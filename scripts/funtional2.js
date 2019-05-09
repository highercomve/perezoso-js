const {
  compose,
  map,
  filter,
  reduce,
  generate,
  take
} = require('../lib/functional')

const Numbers = generate(function () {
  let n = 0
  return {
    next () {
      return { value: n++ }
    }
  }
})

const values = take(100000, Numbers)

const procesor = compose(
  map(x => x * x),
  filter(x => x % 2 === 0),
  reduce((acc, x) => acc + x)
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
