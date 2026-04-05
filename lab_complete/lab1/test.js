const generator = require('lab_complete/lab1/my-lib');
const q = generator();

function time(iterator, seconds) {
    const endTime = Date.now() + (seconds * 1000);
    let lastValue;

    while (Date.now() < endTime) {
        lastValue = iterator.next().value;
    }

    console.log(`число операций ${lastValue}`);
}
time(q,0.1);