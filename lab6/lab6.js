const fs = require('fs');
const readline = require('readline');

const fileName = 'huge_data.txt';

async function generateFakeLargeFile() {
    if (fs.existsSync(fileName)) return;

    const stream = fs.createWriteStream(fileName);
    for (let i = 0; i < 1_000_000; i++) {
        stream.write(i % 50 === 0 ? `[ERROR] line ${i}\n` : `[INFO] line ${i}\n`);
    }
    return new Promise(resolve => stream.end(resolve));
}

async function processData() {
    const startTime = Date.now();

    const rl = readline.createInterface({
        input: fs.createReadStream(fileName),
        crlfDelay: Infinity
    });

    let errorCount = 0;

    for await (const line of rl) {
        if (line.includes("ERROR")) {
            errorCount++;

            if (Math.random() < 0.0001) {
                console.log(`Знайдено помилок ${errorCount}`);
            }
        }
    }

    const endTime = Date.now();
    console.log(`\nВсього помилок: ${errorCount}`);
    console.log(`Час виконання: ${endTime - startTime} мс`);
}

generateFakeLargeFile()
    .then(processData)
    .catch(console.error);