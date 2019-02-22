const { LazyArray } = require('../lib/perezoso')
const { iterate } = require('leakage')

function arrayOfNumbers (n) {
  const array = []
  let i = 0
  while (i < n) {
    array.push(i)
    i++
  }
  return array
}

function lazyArrayOfNumbers (n) {
  const array = new LazyArray()
  let i = 0
  while (i < n) {
    array.push(i)
    i++
  }
  return array
}

describe('Perezoso', () => {
  it('array does not leak when doing stuff', () => {
    iterate(() => {
      arrayOfNumbers(1000000)
        .map(x => x * x)
        .filter(x => x % 2 === 0)
        .reduce((acc, x) => acc + x)
    })
  })

  it('lazy does not leak when doing stuff', () => {
    iterate(() => {
      lazyArrayOfNumbers(1000000)
        .map(x => x * x)
        .filter(x => x % 2 === 0)
        .reduce(0, (acc, x) => acc + x)
    })
  })
})
