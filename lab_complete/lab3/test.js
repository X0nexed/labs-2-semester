const memory = require('./Lab3.js');
function add(a, b) {
    console.log(`[подсчет] ${a} + ${b}`);
    return a + b;
}

const smartAdd = memory(add, { maxSize: 2 });

console.log("Вызов 1:", smartAdd(1, 1));
console.log("Вызов 2:", smartAdd(2, 2));
console.log("Вызов 3:", smartAdd(1, 1));
console.log("Вызов 4:", smartAdd(3, 3));
console.log("Вызов 5:", smartAdd(2, 2));