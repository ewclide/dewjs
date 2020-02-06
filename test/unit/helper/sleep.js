import sleep from '../../../core/helper/sleep';

test('sleep', async () => {
    let startTime = Date.now();

    await sleep(500);

    expect(Date.now() - startTime).toBeWithin(499, 502);
});