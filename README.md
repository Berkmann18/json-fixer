<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [json-fixer](#json-fixer)
  - [Usage](#usage)
  - [Contributors](#contributors)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# json-fixer

A JSON file fixer primarly focused to be used in a NodeJS file.

## Usage

- In NodeJS

```js
const jsonFix = require('json-fix')

// Get the (potentially malformed) JSON data ready
const jsonContent = fs.readFileSync('config.json', 'utf-8')

const {data, changed} = jsonFix(jsonContent) // Lint (and fix) it

if (changed) {
  // Do something with `data` which is the fixed JSON data from `jsonContent`
  // e.g. `fs.writeFileSync(configPath, JSON.stringify(config, null, 2))`
}
```

- In the CLI
  _Not supported yet_.

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<table><tr><td align="center"><a href="http://maxcubing.wordpress.com"><img src="https://avatars0.githubusercontent.com/u/8260834?v=4" width="100px;" alt="Maximilian Berkmann"/><br /><sub><b>Maximilian Berkmann</b></sub></a><br /><a href="https://github.com/Berkmann18/json-fixer/commits?author=Berkmann18" title="Code">💻</a> <a href="https://github.com/Berkmann18/json-fixer/commits?author=Berkmann18" title="Documentation">📖</a> <a href="#ideas-Berkmann18" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-Berkmann18" title="Maintenance">🚧</a> <a href="https://github.com/Berkmann18/json-fixer/commits?author=Berkmann18" title="Tests">⚠️</a></td></tr></table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
