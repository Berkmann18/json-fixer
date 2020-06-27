const { readFileSync } = require('fs');
const jf = require('../../');
const { exam } = require('../test-utils');

describe('keeps a correct file intact', () => {
  it('normal file', () => {
    exam({
      sampleName: 'normal',
      expectedOutput: {
        name: 'sample #0',
        type: 'JSON',
        version: 0
      }
    });
  });

  it('floating points', () => {
    exam({
      sampleName: 'fp',
      expectedOutput: {
        name: 'sample #2',
        type: 'JSON',
        version: 2.0
      }
    });
  });
});

describe('returns the json as fixed string', () => {
  it('normal file', () => {
    const json = readFileSync('./test/samples/normal.json', 'utf-8');
    const { data } = jf(json, { parse: false });
    expect(typeof data).toBe('string');
    expect(typeof JSON.parse(data)).toBe('object');
  });
});
