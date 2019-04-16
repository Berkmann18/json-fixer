<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- [![Build Status](https://img.shields.io/circleci/project/all-contributors/all-contributors-cli/master.svg)](https://circleci.com/gh/all-contributors/workflows/all-contributors-cli/tree/master) -->
[![Code Coverage](https://img.shields.io/codecov/c/github/Berkmann18/json-fixer.svg)](https://codecov.io/github/Berkmann18/json-fixer)
[![Version](https://img.shields.io/npm/v/json-fixer.svg)](https://www.npmjs.com/package/json-fixer)
[![Downloads](https://img.shields.io/npm/dm/all-contributors-cli.svg)](http://www.npmtrends.com/json-fixer)
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors)
[![Star on Github](https://img.shields.io/github/stars/Berkmann18/json-fixer.svg?style=social)](https://github.com/Berkmann18/json-fixer/stargazers)
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [json-fixer](#json-fixer)
  - [Usage](#usage)
  - [Contributors](#contributors)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# json-fixer

A JSON file fixer primarily focused on [All Contributors' CLI](https://github.com/all-contributors/all-contributors-cli).

## Usage
- In NodeJS

```js
const jsonFix = require('json-fix')

// Get the (potentially malformed) JSON data ready
const jsonContent = fs.readFileSync('config.json', 'utf-8')

const { data, changed } = jsonFix(jsonContent); // Lint (and fix) it

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
<table><tr><td align="center"><a href="http://maxcubing.wordpress.com"><img src="https://avatars0.githubusercontent.com/u/8260834?v=4" width="100px;" alt="Maximilian Berkmann"/><br /><sub><b>Maximilian Berkmann</b></sub></a><br /><a href="https://github.com/Berkmann18/json-fixer/commits?author=Berkmann18" title="Code">💻</a> <a href="https://github.com/Berkmann18/json-fixer/commits?author=Berkmann18" title="Documentation">📖</a> <a href="#ideas-Berkmann18" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-Berkmann18" title="Maintenance">🚧</a></td></tr></table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
