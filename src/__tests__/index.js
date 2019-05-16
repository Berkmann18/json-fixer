const fs = require('fs')
const jf = require('../../')

describe('keeps a correct file intact', () => {
  it('normal file', () => {
    const json = fs.readFileSync('./test/samples/normal.json', 'utf-8')
    const {data, changed} = jf(json)
    expect(changed).toBeFalsy()
    expect(data).toEqual({
      name: 'sample #0',
      type: 'JSON',
      version: 0,
    })
  })

  it('floating points', () => {
    const json = fs.readFileSync('./test/samples/fp.json', 'utf-8')
    const {data, changed} = jf(json)
    expect(changed).toBeFalsy()
    expect(data).toEqual({
      name: 'sample #2',
      type: 'JSON',
      version: 2.0,
    })
  })
})

it('fix single quotes', () => {
  const json = fs.readFileSync('./test/samples/singleQuote.json', 'utf-8')
  const {data, changed} = jf(json)
  expect(changed).toBeTruthy()
  expect(data).toStrictEqual({
    name: 'sample #1',
    type: 'JSON',
    error: 'single quote',
    version: '1',
  })
})

// it('fix missing quotes', () => {
//   const json = fs.readFileSync('./test/samples/noQuotes.json', 'utf-8')
//   const {data, changed} = jf(json)
//   expect(changed).toBeTruthy()
//   expect(data).toStrictEqual({
//     name: 'sample #10',
//     type: 'JSON',
//     error: 'missing quotes',
//     version: "one zero"
//   })
// })

describe('fix trailing characters', () => {
  it('dots', () => {
    const json = fs.readFileSync('./test/samples/trailingDot.json', 'utf-8')
    const {data, changed} = jf(json)
    expect(changed).toBeTruthy()
    expect(data).toEqual({
      name: 'sample #3',
      type: 'JSON',
      error: 'trailing dot',
      version: 0.3,
    })
  })

  it('commas', () => {
    const json = fs.readFileSync('./test/samples/trailingComma.json', 'utf-8')
    const {data, changed} = jf(json)
    expect(changed).toBeTruthy()
    expect(data).toEqual({
      name: 'sample #6',
      type: 'JSON',
      error: 'trailing comma',
      version: 0.6,
    })
  })

  it('hex\'s "x"', () => {
    const json = fs.readFileSync('./test/samples/x.json', 'utf-8')
    const {data, changed} = jf(json)
    expect(changed).toBeTruthy()
    expect(data).toEqual({
      name: 'sample #7',
      type: 'JSON',
      error: 'trailing x',
      version: 0x7,
    })
  })

  it('binary\'s "b"', () => {
    const json = fs.readFileSync('./test/samples/b.json', 'utf-8')
    const {data, changed} = jf(json)
    expect(changed).toBeTruthy()
    expect(data).toEqual({
      name: 'sample #8',
      type: 'JSON',
      error: 'trailing b',
      version: 0b1000,
    })
  })

  it('octal\'s "o"', () => {
    const json = fs.readFileSync('./test/samples/o.json', 'utf-8')
    const {data, changed} = jf(json)
    expect(changed).toBeTruthy()
    expect(data).toEqual({
      name: 'sample #9',
      type: 'JSON',
      error: 'trailing o',
      version: 0o11,
    })
  })
})

it('fix extra characters', () => {
  const json = fs.readFileSync('./test/samples/trailing.json', 'utf-8')
  const {data, changed} = jf(json)
  expect(changed).toBeTruthy()
  expect(data).toEqual({
    name: 'sample #4',
    type: 'JSON',
    error: 'trailing error',
    version: 4,
  })
})

it('fix missing commas', () => {
  const json = fs.readFileSync('./test/samples/missing.json', 'utf-8')
  const {data, changed} = jf(json)
  expect(changed).toBeTruthy()
  expect(data).toEqual({
    name: 'sample #5',
    type: 'JSON',
    error: 'missing comma',
    version: 5,
  })
})
