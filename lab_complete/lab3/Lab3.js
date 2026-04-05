function memory(fn, options = {}) {
    const maxSize = options.maxSize || 3;
    const cache = new Map();
    const time = new Map();
    return function (...args) {
        const start = performance.now();
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            const start = time.get(key);
            time.delete(key);
            time.set(key , Date.now);
            const saved = cache.get(key);
            cache.delete(key);
            cache.set(key, saved);
            const end = performance.now();
            return saved;
        }
        const result = fn(...args);
        if (cache.size >= maxSize) {
            const older =
            cache.delete(cache.keys().next().value);
            cache.delete(time.keys().next().value);
        }
        cache.set(key, result);
        const end = performance.now();
        let time = end - start;
        console.log(`${time.toFixed(3)} ms`);
        console.log(time.toFixed(3));
        return result;
    }

}
function add(a, b) {
    console.log(`[подсчет] ${a} + ${b}`);
    return a + b;
}
const mem = memory;
const smartAdd = mem(add, { maxSize: 2 });

console.log("Вызов 1:", smartAdd(1, 1));
console.log("Вызов 2:", smartAdd(2, 2));
console.log("Вызов 3:", smartAdd(1, 1));
console.log("Вызов 4:", smartAdd(3, 3));
console.log("Вызов 5:", smartAdd(2, 2));