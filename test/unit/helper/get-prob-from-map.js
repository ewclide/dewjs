import getProbFromMap from '../../../core/helper/get-prob-from-map';

test('getProbFromMap', () => {
    const probs = new Map(Object.entries({
        hello: 0.2,
        world: 0.3,
        man: 0.5
    }));

    expect(getProbFromMap(probs)).toMatch(/hello|world|man/);

    const results = Object.seal({ hello: 0, world: 0, man: 0 });
    for (let i = 0; i < 1500; i++) {
        results[getProbFromMap(probs)]++;
    }

    expect(results.hello  / 1500).toBeWithin(0.17, 0.23);
    expect(results.world / 1500).toBeWithin(0.27, 0.33);
    expect(results.man  / 1500).toBeWithin(0.47, 0.53);
});