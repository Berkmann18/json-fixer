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

describe('fix missing quotes', () => {
  it('RHS: one word', () => {
    const json = fs.readFileSync('./test/samples/noQuotes.json', 'utf-8')
    const {data, changed} = jf(json)
    expect(changed).toBeTruthy()
    expect(data).toStrictEqual({
      name: 'sample #10',
      type: 'JSON',
      error: 'missing quotes',
      version: 'one',
    })
  })

  it('RHS: several words', () => {
    const json = fs.readFileSync('./test/samples/missingQuotes.json', 'utf-8')
    const {data, changed} = jf(json)
    expect(changed).toBeTruthy()
    expect(data).toStrictEqual({
      name: 'sample #11',
      type: 'JSON',
      error: 'missing quotes',
      version: 'a string',
    })
  })

  it('LHS: one word', () => {
    const json = fs.readFileSync('./test/samples/noLHQuotes.json', 'utf-8')
    const {data, changed} = jf(json)
    expect(changed).toBeTruthy()
    expect(data).toStrictEqual({
      name: 'sample #13',
      type: 'JSON',
      error: 'missing quotes',
      version: 'a string',
    })
  })

  it('LHS: several words', () => {
    const json = fs.readFileSync('./test/samples/missingLHQuotes.json', 'utf-8')
    const {data, changed} = jf(json)
    expect(changed).toBeTruthy()
    expect(data).toStrictEqual({
      name: 'sample #14',
      type: 'JSON',
      error: 'missing quotes',
      'long content': 'a string',
    })
  })
})

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

describe('fix wrong brackets', () => {
  it('square brackets', () => {
    const json = fs.readFileSync('./test/samples/notSquare.json', 'utf-8')
    const {data, changed} = jf(json)
    expect(changed).toBeTruthy()
    expect(data).toEqual({
      name: 'sample #12',
      error: 'wrong brackets',
      info: {
        type: 'JSON',
        version: 12,
      },
    })
  })
  it('curly brackets', () => {
    const json = fs.readFileSync('./test/samples/notCurly.json', 'utf-8')
    const {data, changed} = jf(json)
    expect(changed).toBeTruthy()
    expect(data).toEqual({
      name: 'sample #15',
      error: 'wrong brackets',
      info: ['one', 'two'],
    })
  })
})
