const { Async } = Dew.type;

const main  = new Async();
const one   = new Async();
const two   = new Async();
const three = new Async();
const other = new Async();

three.catch((e) => log('three rejected!'));

three.wait(other);
// setTimeout(() => other.reject('other rejected!'), 1500);
setTimeout(() => other.resolve('other rejected!'), 1500);

setTimeout(() => one.resolve(), 1000);
setTimeout(() => two.resolve(), 2000);
// setTimeout(() => three.resolve(), 1000);

log.time();
main.wait([one, two, three])
    .then(() => {
        log('main resolved!');
        log.timeEnd();
    })
    .catch((e) => {
        log('main rejected!');
        log.error(e);
        log.timeEnd();
    });