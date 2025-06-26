(() => {
  const newGreet = (name: string) => `Hello, ${name}!`;
  console.log(newGreet('Fire'));
})();

(() => {
    const allNumbers = [1, 2, 3, 4, 5];
    const doubled = allNumbers.map(n => n * 2);
    console.log(doubled);
})();

