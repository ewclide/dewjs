import getProbFromMap from '../../../core/helper/get-prob-from-map';

test('getProbFromMap', () => {
    const probs = new Map(Object.entries({
        hello: 0.2,
        world: 0.3,
        man: 0.5
    }));

    expect(getProbFromMap(probs)).toMatch(/hello|world|man/);

    const results = Object.seal({ hello: 0, world: 0, man: 0 });
    for (let i = 0; i < 100; i++) {
        results[getProbFromMap(probs)]++;
    }

    expect(results.hello  / 100).toBeWithin(0.10, 0.3);
    expect(results.world / 100).toBeWithin(0.2, 0.4);
    expect(results.man  / 100).toBeWithin(0.4, 0.6);
});