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

const extraChar = err =>
  err.expected[0].type === 'other' && ['}', ']'].includes(err.found)

const trailingChar = err => ['.', ',', 'x', 'b', 'o'].includes(err.found)

const missingChar = err => {
  return err
}

/*eslint-disable no-console */
const fixJson = (err, data) => {
  const lines = data.split('\n')
  // lines.forEach((l, i) => process.stdout.write(`${chalk.yellow(i)} ${l}\n`))
  // console.log(chalk.red('err='))
  // console.dir(err)
  const start = err.location.start
  const fixedData = [...lines]

  if (extraChar(err)) {
    const targetLine = start.line - 2
    const brokenLine = removeLinebreak(lines[targetLine])
    // console.log(`broken line='${brokenLine.toString()}'`);
    let fixedLine = brokenLine.trimEnd()
    fixedLine = fixedLine.substr(0, fixedLine.length - 1)
    // console.log(`fixed line='${fixedLine}'`)
    fixedData[targetLine] = fixedLine
    return doubleCheck(fixedData.join('\n'))
  } else if (trailingChar(err)) {
    const targetLine = start.line - 1
    const brokenLine = removeLinebreak(lines[targetLine])
    const fixedLine = brokenLine.replace(/(":\s*)[.,](\d*)/g, '$10.$2')
    let baseNumber = fixedLine.replace(/(":\s*)([xbo][0-9a-fA-F]*)/g, '$1"0$2"')
    if (baseNumber !== fixedLine) {
      process.stdout.write(
        chalk.cyan(
          "Found a non base-10 number and since JSON doesn't support those numbers types. I will turn it into a base-10 number to keep the structure intact\n",
        ),
      )
      baseNumber = baseNumber.replace(/"(0[xbo][0-9a-fA-F]*)"/g, (_, num) =>
        Number(num),
      ) //base-(16|2|8) -> base-10
    }

    fixedData[targetLine] = baseNumber
    return doubleCheck(fixedData.join('\n'))
  } else if (missingChar(err)) {
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
    return {
      data: fixJson(err, data),
      changed: true,
    }
  }
}

module.exports = checkJson
