import clampBySteps from '../../../core/helper/clamp-by-steps';

test('clampBySteps', () => {
    const steps = [0, 20, 40, 60];

    expect(clampBySteps(-10, steps)).toBe(0);
    expect(clampBySteps(10, steps)).toBe(0);
    expect(clampBySteps(12, steps)).toBe(20);
    expect(clampBySteps(35, steps)).toBe(40);
    expect(clampBySteps(70, steps)).toBe(60);
});