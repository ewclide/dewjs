import log from '../../../core/helper/log';
import { swapConsole } from '../../utils';

test('log', () => {
    swapConsole();

    log('hello', 'world');
    expect(console.log.mock.calls[0]).toEqual(['hello', 'world']);

    log.json({ hello: 'world' });
    expect(console.log.mock.calls[1][0]).toBe('{\n    "hello": "world"\n}');

    log.time('start');
    log.timeEnd('start');
    expect(console.time.mock.calls[0][0]).toBe('start');
    expect(console.timeEnd.mock.calls[0][0]).toBe('start');

    log.errors('title', ['first', 'second']);
    expect(console.error.mock.calls[0][0]).toBe('Errors: title\n  └─> first\n  └─> second\n');

    log.error('hello', 'world');
    expect(console.error.mock.calls[1]).toEqual(['Error:', 'hello', 'world', '']);

    log.warn('hello', 'world');
    expect(console.warn.mock.calls[0]).toEqual(['Warning:', 'hello', 'world', '']);
});