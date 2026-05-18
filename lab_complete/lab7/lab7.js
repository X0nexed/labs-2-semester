class EventEmitter {
    sub = new Map();

    subscribe(eventName, callback) {
        if (!this.sub.has(eventName)) {
            this.sub.set(eventName, []);
        }

        const arr = this.sub.get(eventName);
        arr.push(callback);

        return () => {
            const index = arr.indexOf(callback);
            if (index !== -1) {
                arr.splice(index, 1);
            }
        };
    }

    emit(eventName, data) {
        const arr = this.sub.get(eventName);
        if (arr) {
            arr.forEach(cb => cb(data));
        }
    }
}

const mySystem = new EventEmitter();

const unsubscribeLogger = mySystem.subscribe('USER_LOGIN', (user) => {
    console.log(`Записано: пользователь ${user} вошел в систему.`);
});

const unsubscribeUI = mySystem.subscribe('USER_LOGIN', (user) => {
    console.log(`Рисуем плашку: Добро пожаловать, ${user}!`);
});

console.log('Имитируем первый вход');
mySystem.emit('USER_LOGIN', 'Kirill');

console.log('\nОтключаем интерфейс');
unsubscribeUI();

console.log('Имитируем второй вход');
mySystem.emit('USER_LOGIN', 'Xonex');