class EventEmitter {
    sub = new Map();
    subscribe(eventName, callback) {
        if (!this.sub.has(eventName)) {
            this.sub.set(eventName, []);
        }
        const arr = this.sub.get(eventName);
        if(arr){
            arr.forEach(callback => callback(data));
        }
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
