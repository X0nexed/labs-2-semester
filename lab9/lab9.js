const fs = require('fs');

function logDecorator({ level = "INFO", output = "console", format = "text", file = "app.log" }) {
    return function (func) {
        return function (...args) {
            const result = func(...args);
            console.log(`[${new Date().toISOString()}] [${level}] ${func.name}(${args}) -> ${result}`);
            return result;
        };
    };
}
