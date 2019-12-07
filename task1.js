import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on("line", input => {
  let result = input
    .split("")
    .reverse()
    .join("");

  console.log(result);
});
