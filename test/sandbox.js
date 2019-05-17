const fs = require('fs')
const chalk = require('chalk')
const jsonFix = require('../')
const args = process.argv.slice(2)
const files = args.length ? args : ['s4']

// Get the (potentially malformed) JSON data ready
files.forEach(arg => {
  const file = `./test/samples/${arg}.json`
  const jsonContent = fs.readFileSync(file, 'utf-8')

  const {data, changed} = jsonFix(jsonContent, true) // Lint (and fix) it

  if (changed) {
    // Do something with `data` which is the fixed JSON data from `jsonContent`
    // e.g. `fs.writeFileSync(configPath, JSON.stringify(config, null, 2))`
    console.log(chalk.underline(`${file} changed:`))
    console.log(JSON.stringify(data, null, 2))
  } else console.log(chalk.underline(file, 'is correct'))
})
