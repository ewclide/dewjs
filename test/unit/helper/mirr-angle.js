import mirrAngle from '../../../core/helper/mirr-angle';
import { degToRad } from '../utils';

test('mirrAngle', () => {
    expect(mirrAngle(390, true)).toEqual(30);
    expect(mirrAngle(270, true)).toEqual(-90);
    expect(mirrAngle(-30, true)).toEqual(-30);

    expect(mirrAngle(390 * degToRad)).toBeCloseTo(30 * degToRad);
    expect(mirrAngle(270 * degToRad)).toBeCloseTo(-90 * degToRad);
    expect(mirrAngle(-30 * degToRad)).toBeCloseTo(-30 * degToRad);
});