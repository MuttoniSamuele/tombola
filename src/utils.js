export function generateSequentialNumbers(min, max) {
  const numbers = [];
  for (let i = min; i <= max; i++) {
    numbers.push(i);
  }
  return numbers;
}
