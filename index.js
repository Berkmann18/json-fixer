const chalk = require('chalk')
const {parse} = require('./src/json.pjs')

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
const replaceChar = (str, idx, chr) =>
  str.substring(0, idx) + chr + str.substring(idx + 1)

const extraChar = err =>
  err.expected[0].type === 'other' && ['}', ']'].includes(err.found)

const trailingChar = err => {
  const literal =
    err.expected[0].type === 'literal' && err.expected[0].text !== ':'
  return (
    ['.', ',', 'x', 'b', 'o'].includes(err.found) &&
    (err.expected[0].type === 'other' || literal)
  )
}

const missingChar = err =>
  err.expected[0].text === ',' && ['"', '[', '{'].includes(err.found)

const singleQuotes = err => err.found === "'"

const missingQuotes = err =>
  /\w/.test(err.found) && err.expected.find(el => el.description === 'string')

const notSquare = err =>
  err.found === ':' && [',', ']'].includes(err.expected[0].text)

const notCurly = err => err.found === ',' && err.expected[0].text === ':'

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
    return fixedData
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
  return fixedData
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
  return fixedData
}

const fixSquareBrackets = ({start, fixedData, verbose, targetLine}) => {
  if (verbose) psw(chalk.magenta('Square brackets instead of curly ones'))
  const brokenLine = removeLinebreak(
    fixedData[targetLine].includes('[')
      ? fixedData[targetLine]
      : fixedData[++targetLine],
  )
  const fixedLine = replaceChar(brokenLine, start.column - 1, '{')
  fixedData[targetLine] = fixedLine

  try {
    parse(fixedData.join('\n'))
  } catch (e) {
    targetLine = e.location.start.line - 1
    const newLine = removeLinebreak(fixedData[targetLine]).replace(']', '}')
    fixedData[targetLine] = newLine
  }
  return fixedData
}

const fixCurlyBrackets = ({fixedData, verbose, targetLine}) => {
  if (verbose) psw(chalk.magenta('Curly brackets instead of square ones'))
  const brokenLine = removeLinebreak(
    fixedData[targetLine].includes('{')
      ? fixedData[targetLine]
      : fixedData[++targetLine],
  )
  const fixedLine = replaceChar(brokenLine, brokenLine.indexOf('{'), '[')
  fixedData[targetLine] = fixedLine

  try {
    parse(fixedData.join('\n'))
  } catch (e) {
    targetLine = e.location.start.line - 1
    const newLine = removeLinebreak(fixedData[targetLine]).replace('}', ']')
    fixedData[targetLine] = newLine
  }

  return fixedData
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
  let fixedData = [...lines]
  let targetLine = start.line - 2

  if (extraChar(err)) {
    if (verbose) psw(chalk.magenta('Extra character'))
    const brokenLine = removeLinebreak(lines[targetLine])
    let fixedLine = brokenLine.trimEnd()
    fixedLine = fixedLine.substr(0, fixedLine.length - 1)
    fixedData[targetLine] = fixedLine
  } else if (trailingChar(err)) {
    fixedData = fixTrailingChar({start, fixedData, verbose})
  } else if (missingChar(err)) {
    if (verbose) psw(chalk.magenta('Missing character'))
    const brokenLine = removeLinebreak(lines[targetLine])
    fixedData[targetLine] = `${brokenLine},`
  } else if (singleQuotes(err)) {
    if (verbose) psw(chalk.magenta('Single quotes'))
    targetLine = start.line - 1
    const brokenLine = removeLinebreak(lines[targetLine])
    const fixedLine = brokenLine.replace(/(":\s*)'(.*?)'/g, '$1"$2"')
    fixedData[targetLine] = fixedLine
  } else if (missingQuotes(err)) {
    fixedData = fixMissingQuotes({start, fixedData, verbose})
  } else if (notSquare(err)) {
    fixedData = fixSquareBrackets({start, fixedData, verbose, targetLine})
  } else if (notCurly(err)) {
    fixedData = fixCurlyBrackets({fixedData, verbose, targetLine})
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
