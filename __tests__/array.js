function arrayOfNumbers (n) {
  const array = []
  let i = 0
  while (i < n) {
    array.push(i)
    i++
  }
  return array
}

const array = arrayOfNumbers(1000000000000000)

while (true) {
  array
    .map(x => x * x)
    .filter(x => x % 2 === 0)
    .reduce(0, (acc, x) => acc + x)  
}
