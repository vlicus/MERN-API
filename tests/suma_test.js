const suma = (a, b) => {
    return a - b;
};

const checks = [
    { a: 0, b: 0, result: 0 },
    { a: 1, b: 3, result: 4 },
    { a: -3, b: 3, result: 0 },
];

checks.forEach((check) => {
    const { a, b, result } = check;
    console.assert(
        suma(a, b) === result,
        `Sum of ${a} + ${b} expected to be ${result}, instead of`,
        a - b
    );
});

console.log(`${checks.length} checks performed`);
