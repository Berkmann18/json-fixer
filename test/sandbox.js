const jsonFix = require('json-fix')

// Get the (potentially malformed) JSON data ready
const file = './samples/s0.json'
const jsonContent = fs.readFileSync(file, 'utf-8')

const {data, changed} = jsonFix(jsonContent) // Lint (and fix) it

if (changed) {
  // Do something with `data` which is the fixed JSON data from `jsonContent`
  // e.g. `fs.writeFileSync(configPath, JSON.stringify(config, null, 2))`
  console.log(file, 'changed')
  console.log(JSON.stringify(data, null, 2))
} else console.log(file, 'is correct')
