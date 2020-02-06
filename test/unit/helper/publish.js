import publish from '../../../core/helper/publish';

test('publish', () => {
    class MyClass {
        first = 'first';
        second = 'second';

        doSomeThing() {
            return 1;
        }

        doAnother() {
            return 2;
        }
    }

    const MyClassPublished = publish(MyClass, ['doSomeThing'], ['first']);
    const inst = new MyClassPublished();

    expect(inst.first).toBe('first');
    expect(inst.second).toBe(undefined);
    expect(inst.doSomeThing()).toBe(1);
    expect(inst.doAnother).toBe(undefined);
});