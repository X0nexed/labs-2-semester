const fs = require('fs');

function logDecorator({ level = "INFO", output = "console", format = "text", file = "app.log" }) {
    return function (func) {
        return function (...args) {
            const startTime = Date.now();

            const writeLog = (result) => {
                const executionTime = Date.now() - startTime;
                console.log(`[${new Date().toISOString()}] [${level}] ${func.name}(${args}) -> ${result} (${executionTime}ms)`);
            };

            const result = func(...args);

            if (result instanceof Promise) {
                return result.then(res => { writeLog(res); return res; });
            }

            writeLog(result);
            return result;
        };
    };
}
