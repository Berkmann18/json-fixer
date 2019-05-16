const fs = require('fs')
const jf = require('../../')

describe('keeps a correct file intact', () => {
  it('normal file', () => {
    const json = fs.readFileSync('./test/samples/s0.json', 'utf-8')
    const {data, changed} = jf(json)
    expect(changed).toBeFalsy()
    expect(data).toEqual({
      name: 'sample #0',
      type: 'JSON',
      version: 0,
    })
  })

  it('floating points', () => {
    const json = fs.readFileSync('./test/samples/s2.json', 'utf-8')
    const {data, changed} = jf(json)
    expect(changed).toBeFalsy()
    expect(data).toEqual({
      name: 'sample #2',
      type: 'JSON',
      version: 2.0,
    })
  })
})

// it('fix single quotes', () => {
//   const json = fs.readFileSync('./test/samples/s1.json', 'utf-8')
//   const {data, changed} = jf(json)
//   expect(changed).toBeTruthy()
//   expect(data).toStrictEqual({
//     name: 'sample #4',
//     type: 'JSON',
//     error: 'single quote',
//     version: "1"
//   })
// })

// it('fix trailing dots', () => {
//   const json = fs.readFileSync('./test/samples/s3.json', 'utf-8')
//   const {data, changed} = jf(json)
//   expect(changed).toBeTruthy()
//   expect(data).toEqual({
//     name: 'sample #3',
//     type: 'JSON',
//     error: 'trailing dot',
//     version: 0.3
//   })
// })

it('fix extra characters', () => {
  const json = fs.readFileSync('./test/samples/s4.json', 'utf-8')
  const {data, changed} = jf(json)
  expect(changed).toBeTruthy()
  expect(data).toEqual({
    name: 'sample #4',
    type: 'JSON',
    error: 'trailing error',
    version: 4,
  })
})

// it('fix missing commas', () => {
//   const json = fs.readFileSync('./test/samples/s5.json', 'utf-8')
//   const {data, changed} = jf(json)
//   expect(changed).toBeTruthy()
//   expect(data).toEqual({
//     name: 'sample #5',
//     type: 'JSON',
//     error: 'missing comma',
//     version: 5
//   })
// })
