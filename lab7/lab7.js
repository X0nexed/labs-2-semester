class EventEmitter {
    sub = new Map();
    subscribe(eventName, callback) {
        this.sub.set(eventName, callback);
        
}
}