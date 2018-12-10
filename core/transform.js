import {leftJoin} from './object';

const _defaultUnits = {
	perspective : 'px',
	translate : 'px',
	rotate : 'deg',
	skew : 'deg',
	origin : '%'
}

export default CSSTransformer = {
	apply(element, transforms, settings = {}) {

		const units = leftJoin(_defaultUnits, transforms.units, true);

		let transform = '';

        if (settings.origin) {
			this.element.style('transform-origin',
				settings.origin[0] + units.origin + ' ' + settings.origin[1] + units.origin);
		}

		if (settings.backface === false) {
			element.style('backface-visibility', 'hidden');
		}

        if (settings.style) {
            if (settings.style == '3d') {
				element.style('transform-style', 'preserve-3d');
			} else if (settings.style == 'flat') {
				element.style('transform-style', 'flat');
			}
        }

        if (settings.perspective) {
			transform += `perspective(${settings.perspective + units.perspective}) `;
		}

        element.style('transform', transform + this._build(transforms));
	},

	_build(transforms) {
		let result = '';
		if (Array.isArray(transforms)) {
			transforms.forEach((transform) => this._localBuild(transform));
		}
	},

	_localBuild(actions, units) {
		let result = '';

		if (actions.matrix2d.length) {
			result += `matrix2d(${actions.matrix2d.join(',')}) `;

		} else if (actions.matrix3d.length) {
			result += `matrix3d(${actions.matrix3d.join(',')}) `;

		} else {
			const { scale, skew, rotate, translate } = actions;

			if (typeof scale == 'number') {
				result += `scale(${scale}) `;
			} else if (Array.isArray(scale)) {
				result += `scale(${scale.join(',')}) `;
			}

			if (typeof skew == 'number') {
				result += `skew(${skew}) `;
			} else if (Array.isArray(skew)) {
				result += `skew(${skew.join(',') + units.skew}) `;
			}

			if (typeof rotate == 'number') {
				result += `rotate(${rotate + units.rotate}) `;
			} else if (Array.isArray(rotate)) {
				result += `rotate(${rotate.join(',') + units.rotate}) `;
			}

			if (Array.isArray(translate)) {
				result += `translate(${translate.join(',') + units.translate}) `;
			}
	    }

        return result;
	},
}

const transform = new Transform();
export default transform;