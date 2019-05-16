const chalk = require('chalk')
const {parse} = require('./src/json')

/* const captureError = err => {
  return {
    msg: err.message,
    location: err.location,
    data: err.found,
  }
} */

const doubleCheck = data => {
  /* eslint-disable no-console */
  try {
    const res = parse(data)
    process.stdout.write(`\n${chalk.cyan('The JSON data was fixed!')}\n`)
    if (res) return res
  } catch (err) {
    console.error(`There's still an error!`)
    throw new Error(err.message)
  }
  /* eslint-enable no-console */
}

const removeLinebreak = l => l.replace(/[\n\r]/g, '')

const extraChar = err => {
  const CLOSING = ['}', ']']
  return err.expected[0].type === 'other' && CLOSING.includes(err.found)
}

const trailingDot = err => {
  return err
}

const missingChar = err => {
  return err
}

/*eslint-disable no-console */
const fixJson = (err, data) => {
  const lines = data.split('\n')
  lines.forEach((l, i) => process.stdout.write(`${chalk.yellow(i)} ${l}\n`))
  // console.log(chalk.red('err='))
  // console.dir(err)
  const start = err.location.start
  /* const {msg, location} = captureError(err)
  const lnNum = location.start.line
  const colNum = location.start.column

  console.error(msg) // eslint-disable-line no-console
  const lines = data.split('\n')
  const brokenLine = lines[lnNum - 1]
  //Removes the character and checks again
  let fixedLine = brokenLine.trimEnd()
  fixedLine = fixedLine.substr(0, fixedLine.length - 1)
  const fixedData = [...lines]
  fixedData[lnNum - 1] = fixedLine

  return doubleCheck(fixedData.join('\n')) */

  if (extraChar(err)) {
    //extraChar: s4
    //Remove char
    const targetLine = start.line - 2
    const brokenLine = removeLinebreak(lines[targetLine])
    // console.log(`broken line='${brokenLine.toString()}'`);
    let fixedLine = brokenLine.trimEnd()
    fixedLine = fixedLine.substr(0, fixedLine.length - 1)
    // console.log(`fixed line='${fixedLine}'`)
    const fixedData = [...lines]
    fixedData[targetLine] = fixedLine
    return doubleCheck(fixedData.join('\n'))
  } else if (trailingDot) {
    //s3
    process.stdout.write(`${chalk.yellow('Fix not supported yet')}\n`)
  } else if (missingChar) {
    //s5
    process.stdout.write(`${chalk.yellow('Fix not supported yet')}\n`)
  } else
    throw new Error(
      `Unsupported issue: ${err.message} (please open an issue at the repo)`,
    )

  return null
}
/*eslint-enable no-console */

/**
 * @param {string} data JSON string data to check (and fix).
 * @returns {{data: (Object|string|Array), changed: boolean}} Result
 */
const checkJson = data => {
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
    // console.log('err=', err)
    return {
      data: fixJson(err, data),
      changed: true,
    }
  }
}

module.exports = checkJson
