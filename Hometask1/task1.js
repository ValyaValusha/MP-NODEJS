import { createInterface } from 'readline';

const stdInterface = createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

stdInterface.on('line', input => {
  let result = input
    .split('')
    .reverse()
    .join('');

  console.log(result);
});
