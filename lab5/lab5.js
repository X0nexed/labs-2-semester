function asyncMapCallback(arr, fn, cb) {
    let res = [];
    let count = 0;

    for (let i = 0; i < arr.length; i++) {
        fn(arr[i], function(val) {
            res[i] = val;
            count++;

            if (count === arr.length) {
                cb(res);
            }
        });
    }
}

function asyncMapPromise(arr, fn, signal) {
    if (signal && signal.aborted) {
        return Promise.reject("Cancelled!");
    }

    let promises = [];
    for (let i = 0; i < arr.length; i++) {
        promises.push(fn(arr[i], signal));
    }
    return Promise.all(promises);
}

function taskCallback(item, cb) {
    setTimeout(() => {
        cb(item * 2);
    }, 1000);
}

function taskPromise(item, signal) {
    return new Promise((resolve, reject) => {
        let timer = setTimeout(() => resolve(item * 2), 1000);

        if (signal) {
            signal.addEventListener('abort', () => {
                clearTimeout(timer);
                reject("Aborted!");
            });
        }
    });
}

function memoize(fn, max = 5) {
    let cache = {};
    let order = [];

    return function(...args) {
        let key = JSON.stringify(args);

        if (cache[key] !== undefined) {
            return cache[key];
        }

        let result = fn(...args);

        cache[key] = result;
        order.push(key);

        if (order.length > max) {
            let oldest = order.shift();
            delete cache[oldest];
        }

        return result;
    }
}


let numbers = [1, 2, 3, 4, 5];

console.log("Тест коллбеков");
asyncMapCallback(numbers, taskCallback, function(res) {
    console.log("Результат коллбеков:", res);
});

console.log("Тест промисов");
asyncMapPromise(numbers, taskPromise, null)
    .then(function(res) {
        console.log("Результат промисов:", res);
    })
    .catch(function(err) {
        console.log("Ошибка:", err);
    });

console.log("Тест мемоизации");
function slowFunc(x) {
    console.log("Считаем для", x);
    return x * 10;
}

let memoized = memoize(slowFunc, 2);

console.log(memoized(1));
console.log(memoized(1));
console.log(memoized(2));
console.log(memoized(3));
console.log(memoized(1));
