const {
  compose,
  map,
  filter,
  reduce
} = require('../lib/functional')

function arrayOfNumbers (n) {
  const array = []
  let i = 0
  while (i < n) {
    array.push(i)
    i++
  }
  return array
}

const values = arrayOfNumbers(100000)

const procesor = compose(
  map(x => x * x),
  filter(x => x % 2 === 0),
  reduce((acc, x) => acc + x, 0)
)

let i = 0
while (i < 1000) {
  i++
  procesor(values)
}

const used = process.memoryUsage()
for (let key in used) {
  console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`)
}
