function* generator() {
    let i = 0;
    while (true) {
        yield i++;
    }
}
module.exports = generator;