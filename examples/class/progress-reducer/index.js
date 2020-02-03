const { ProgressReducer } = Dew.type;
const { randf, randi } = Dew.helper;

const progressEmulator = (handler, total = 1) => {
    let factor = 0;
    let tid;

    const emulate = () => {
        factor += randf(0, 0.2);
        if (factor > 1) factor = 1;

        handler(total * factor);

        if (factor === 1) {
            clearTimeout(tid);
            return;
        }

        tid = setTimeout(emulate, randi(500, 1000));
    };

    return emulate;
};

const mainReducer = new ProgressReducer();

mainReducer.onUpdate((loaded, total) => {
    console.log(`progress: ${Math.round(loaded)}/${total} (${loaded/total * 100}%) `);
});

mainReducer.onFinish(() => {
    console.log('completed!');
});

const reducer1 = mainReducer.create(100);
const reducer2 = mainReducer.create(50);
const reducer3 = mainReducer.create(20);

progressEmulator(reducer1, 100)(); // it is same as invoking "reducer1(loadState)" somewhere in the program
progressEmulator(reducer2, 50)();
progressEmulator(reducer3, 20)();
