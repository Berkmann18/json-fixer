const chalk = require('chalk')
const {parse} = require('./src/json')

/* const captureError = err => {
  return {
    msg: err.message,
    location: err.location,
    data: err.found,
  }
} */

const psw = d => process.stdout.write(`${d}\n`)

const doubleCheck = (data, verbose = false) => {
  /* eslint-disable no-console */
  try {
    const res = parse(data)
    psw(`\n${chalk.cyan('The JSON data was fixed!')}`)
    if (res) return res
  } catch (err) {
    if (verbose) {
      psw('Nearly fixed data:')
      data.split('\n').forEach((l, i) => psw(`${chalk.yellow(i)} ${l}`))
    }
    console.error(chalk.red(`There's still an error!`))
    throw new Error(err.message)
  }
  /* eslint-enable no-console */
}

const removeLinebreak = l => l.replace(/[\n\r]/g, '')

const extraChar = err =>
  err.expected[0].type === 'other' && ['}', ']'].includes(err.found)

const trailingChar = err => ['.', ',', 'x', 'b', 'o'].includes(err.found)

const missingChar = err =>
  err.expected[0].text === ',' && ['"', '[', '{'].includes(err.found)

const singleQuotes = err => err.found === "'"

const missingQuotes = err =>
  /\w/.test(err.found) && err.expected.find(el => el.description === 'string')

const fixTrailingChar = ({start, fixedData, verbose}) => {
  if (verbose) psw(chalk.magenta('Trailing character'))
  const targetLine = start.line - 1
  const brokenLine = removeLinebreak(fixedData[targetLine])
  const fixedLine = brokenLine.replace(/(":\s*)[.,](\d*)/g, '$10.$2')
  const unquotedWord = /(":\s*)(\S*)/g.exec(fixedLine)
  if (
    unquotedWord &&
    Number.isNaN(Number(unquotedWord[2])) &&
    !/([xbo][0-9a-fA-F]+)/g.test(unquotedWord[2])
  ) {
    if (verbose) psw(chalk.magenta('Adding quotes...'))
    fixedData[targetLine] = fixedLine.replace(/(":\s*)(\S*)/g, '$1"$2"')
    return doubleCheck(fixedData.join('\n'), verbose)
  }
  let baseNumber = fixedLine.replace(/(":\s*)([xbo][0-9a-fA-F]*)/g, '$1"0$2"')
  if (baseNumber !== fixedLine) {
    if (verbose)
      psw(
        chalk.cyan(
          "Found a non base-10 number and since JSON doesn't support those numbers types. I will turn it into a base-10 number to keep the structure intact",
        ),
      )
    baseNumber = baseNumber.replace(/"(0[xbo][0-9a-fA-F]*)"/g, (_, num) =>
      Number(num),
    ) //base-(16|2|8) -> base-10
  }

  fixedData[targetLine] = baseNumber
  return doubleCheck(fixedData.join('\n'), verbose)
}

const fixMissingQuotes = ({start, fixedData, verbose}) => {
  if (verbose) psw(chalk.magenta('Missing quotes'))
  const targetLine = start.line - 1
  const brokenLine = removeLinebreak(fixedData[targetLine])
  const NO_RH_QUOTES = /(":\s*)([\s\S]+)/g
  const NO_LH_QUOTES = /(^[^"]\S[\S\s]+)(:\s*["\w{[])/g
  let fixedLine = NO_RH_QUOTES.test(brokenLine)
    ? brokenLine.replace(NO_RH_QUOTES, '$1"$2"')
    : brokenLine
  const leftSpace = fixedLine.match(/^(\s+)/)
  fixedLine = fixedLine.trimStart()
  if (NO_LH_QUOTES.test(fixedLine))
    fixedLine = fixedLine.replace(NO_LH_QUOTES, '"$1"$2')
  fixedData[targetLine] = `${
    leftSpace === null ? '' : leftSpace[0]
  }${fixedLine}`
  return doubleCheck(fixedData.join('\n'), verbose)
}

/*eslint-disable no-console */
const fixJson = (err, data, verbose) => {
  const lines = data.split('\n')
  if (verbose) {
    psw(`Data:`)
    lines.forEach((l, i) => psw(`${chalk.yellow(i)} ${l}`))
    psw(chalk.red('err='))
    console.dir(err)
  }
  const start = err.location.start
  const fixedData = [...lines]

  if (extraChar(err)) {
    if (verbose) psw(chalk.magenta('Extra character'))
    const targetLine = start.line - 2
    const brokenLine = removeLinebreak(lines[targetLine])
    let fixedLine = brokenLine.trimEnd()
    fixedLine = fixedLine.substr(0, fixedLine.length - 1)
    fixedData[targetLine] = fixedLine
  } else if (trailingChar(err)) {
    return fixTrailingChar({start, fixedData, verbose})
  } else if (missingChar(err)) {
    if (verbose) psw(chalk.magenta('Missing character'))
    const targetLine = start.line - 2
    const brokenLine = removeLinebreak(lines[targetLine])
    fixedData[targetLine] = `${brokenLine},`
  } else if (singleQuotes(err)) {
    if (verbose) psw(chalk.magenta('Single quotes'))
    const targetLine = start.line - 1
    const brokenLine = removeLinebreak(lines[targetLine])
    const fixedLine = brokenLine.replace(/(":\s*)'(.*?)'/g, '$1"$2"')
    fixedData[targetLine] = fixedLine
  } else if (missingQuotes(err)) {
    return fixMissingQuotes({start, fixedData, verbose})
  } else
    throw new Error(
      `Unsupported issue: ${err.message} (please open an issue at the repo)`,
    )
  return doubleCheck(fixedData.join('\n'), verbose)
}
/*eslint-enable no-console */

/**
 * @param {string} data JSON string data to check (and fix).
 * @param {boolean} [verbose=false] Verbosity
 * @returns {{data: (Object|string|Array), changed: boolean}} Result
 */
const checkJson = (data, verbose = false) => {
  //inspired by https://jsontuneup.com/
  try {
    const res = parse(data)
    if (res) {
      return {
        data: res,
        changed: false,
      }
    }
  } catch (err) {
    return {
      data: fixJson(err, data, verbose),
      changed: true,
    }
  }
}

module.exports = checkJson
