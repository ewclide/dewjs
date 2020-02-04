import clampAngle from '../../../core/helper/clamp-angle';
import { degToRad } from '../../utils';

test('clampAngle', () => {
    // degrees
    expect(clampAngle(390, true)).toBe(30);
    expect(clampAngle(350, true)).toBe(350);
    expect(clampAngle(-30, true)).toBe(330);

    // radians
    expect(clampAngle(390 * degToRad)).toBe(30 * degToRad);
    expect(clampAngle(350 * degToRad)).toBe(350 * degToRad);
    expect(clampAngle(-30 * degToRad)).toBe(330 * degToRad);
});