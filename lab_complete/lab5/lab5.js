function Callback(arr, fn, signal, cb) {
    if (arr.length === 0) return cb(null, []);
    if (signal && signal.aborted) return cb(new Error("AbortError"));

    let result = [];
    let doneCount = 0;
    let isError = false;

    for (let i = 0; i < arr.length; i++) {
        fn(arr[i], signal, function (err, val) {
            if (isError) return;
            if (err) {
                isError = true;
                return cb(err);
            }

            result[i] = val;
            doneCount++;

            if (doneCount === arr.length) {
                cb(null, result);
            }
        });
    }
}

function myTaskCb(item, signal, cb) {
    if (signal && signal.aborted) return cb(new Error("AbortError"));

    let t;
    let abortHandler = () => {
        clearTimeout(t);
        cb(new Error("AbortError"));
    };

    if (signal) {
        signal.addEventListener('abort', abortHandler, { once: true });
    }

    t = setTimeout(() => {
        if (signal) {
            signal.removeEventListener('abort', abortHandler);
        }
        cb(null, item * 2);
    }, 1000);
}

function myMapPromise(arr, fn, signal) {//
    if (signal && signal.aborted) return Promise.reject(new Error("AbortError"));

    let arrPromises = [];
    for (let i = 0; i < arr.length; i++) {
        arrPromises.push(fn(arr[i], signal));
    }

    return Promise.all(arrPromises);
}

function myTaskPromise(item, signal) {
    return new Promise((res, rej) => {
        if (signal && signal.aborted) return rej(new Error("AbortError"));

        let t;
        let abortHandler = () => {
            clearTimeout(t);
            rej(new Error("AbortError"));
        };

        if (signal) {
            signal.addEventListener('abort', abortHandler, { once: true });
        }

        t = setTimeout(() => {
            if (signal) {
                signal.removeEventListener('abort', abortHandler);
            }
            res(item * 2);
        }, 1000);
    });
}

let arr = [1, 2, 3, 4, 5];

Callback(arr, myTaskCb, null, function(err, res) {
    if (err) console.log("err cb:", err.message);
    else console.log("res cb:", res);
});

setTimeout(() => {
    let ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), 500);

    Callback(arr, myTaskCb, ctrl.signal, function(err, res) {
        if (err) console.log("abort cb err:", err.message);
        else console.log("res cb:", res);
    });
}, 1500);

setTimeout(() => {
    myMapPromise(arr, myTaskPromise, null)
        .then(res => console.log("res promise:", res))
        .catch(err => console.log("err promise:", err.message));
}, 3000);

setTimeout(async () => {
    let ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), 500);

    try {
        let res = await myMapPromise(arr, myTaskPromise, ctrl.signal);
        console.log("res await:", res);
    } catch (err) {
        console.log("abort await err:", err.message);
    }
}, 4500);