const fs = require('fs');

function logDecorator({ level = "INFO", output = "console", format = "text", file = "app.log" }) {

    return function (func) {

        return function (...args) {
            const startTime = Date.now();

            const writeLog = (resultOrError, isError = false) => {
                const executionTime = Date.now() - startTime;

                if (level === "ERROR" && !isError) return;

                const logData = {
                    timestamp: new Date().toISOString(),
                    level: isError ? "ERROR" : level,
                    function: func.name,
                    arguments: args,
                    executionTimeMs: executionTime,
                    [isError ? "error" : "result"]: resultOrError
                };

                const logString = format === "json"
                    ? JSON.stringify(logData)
                    : `[${logData.timestamp}] [${logData.level}] ${func.name}(${args}) -> ${resultOrError} (${executionTime}ms)`;

                if (output === "file") {
                    fs.appendFileSync(file, logString + "\n");
                } else {
                    isError ? console.error(logString) : console.log(logString);
                }
            };

            try {
                const result = func(...args);

                if (result instanceof Promise) {
                    return result
                        .then(res => { writeLog(res); return res; })
                        .catch(err => { writeLog(err.message, true); throw err; });
                }

                writeLog(result);
                return result;

            } catch (err) {
                writeLog(err.message, true);
                throw err;
            }
        };
    };
}

const syncMath = (a, b) => a + b;
const loggedSyncMath = logDecorator({ level: "INFO", format: "json" })(syncMath);
loggedSyncMath(5, 10);

const fetchData = async (id) => `Дані користувача ${id}`;
const loggedFetchData = logDecorator({ level: "DEBUG", output: "console" })(fetchData);
loggedFetchData(42);

const riskyTask = (shouldFail) => {
    if (shouldFail) throw new Error("Халепа, стався збій!");
    return "Усе добре";
};
const loggedRiskyTask = logDecorator({ level: "ERROR" })(riskyTask);

loggedRiskyTask(false);
try { loggedRiskyTask(true); } catch (e) {}
