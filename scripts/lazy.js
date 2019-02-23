const { Lazy } = require('../lib/perezoso')

const Numbers = Lazy.generate(function () {
  let n = 0
  return {
    next () {
      return { value: n++ }
    }
  }
})

const lazyArray = Numbers.take(100000)

let i = 0
while (i < 1000) {
  i++
  lazyArray
    .map(x => x * x)
    .filter(x => x % 2 === 0)
    .reduce((acc, x) => acc + x)
}

const used = process.memoryUsage()
for (let key in used) {
  console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`)
}
