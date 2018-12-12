const CSSTransformer = {
	apply(element, actions, settings = {}) {

		const { origin, backface, style, perspective, units = {} } = settings;
		let transform = '';

        if (Array.isArray(origin)) {
			const originUnits = units.origin || '%';
			element.style('transform-origin', origin.join(originUnits + ' ') + originUnits);
		}

		if (backface === false) {
			element.style('backface-visibility', 'hidden');
		}

        if (style === '3d') {
			element.style('transform-style', 'preserve-3d');
		} else if (style === 'flat') {
			element.style('transform-style', 'flat');
		}

        if (typeof perspective == 'number') {
			const perspUnits = units.perspective || 'px';
			transform += `perspective(${perspective + perspUnits}) `;
		}

        element.style('transform', transform + this._build(actions));
	},

	_build(actions) {
		if (Array.isArray(actions)) {
			return actions.reduce((res, next) => res = this._buildLocal(next) + res, '');
		} else {
			return this._buildLocal(actions);
		}
	},

	_buildLocal(actions) {
		let result = '';

		const userUnits = actions.units || {};
		const units = {
			translate: userUnits.translate || 'px',
			rotate: userUnits.rotate || 'deg',
			skew: userUnits.skew || 'deg'
		}

		if (actions.matrix2d && actions.matrix2d.length) {
			result += `matrix2d(${actions.matrix2d.join(',')}) `;

		} else if (actions.matrix3d && actions.matrix3d.length) {
			result += `matrix3d(${actions.matrix3d.join(',')}) `;

		} else {
			const { scale, scaleX, scaleY, skew, rotate, translate } = actions;

			if (Array.isArray(translate)) {
				result += `translate(${translate.join(units.translate + ',') + units.translate}) `;
			}

			if (typeof rotate == 'number') {
				result += `rotate(${rotate + units.rotate}) `;
			} else if (Array.isArray(rotate)) {
				result += `rotate(${rotate.join(units.rotate + ',') + units.rotate}) `;
			}

			if (typeof skew == 'number') {
				result += `skew(${skew + units.skew}) `;
			} else if (Array.isArray(skew)) {
				result += `skew(${skew.join(units.skew + ',') + units.skew}) `;
			}

			if (typeof scale == 'number') {
				result += `scale(${scale}) `;
			} else if (Array.isArray(scale)) {
				result += `scale(${scale.join(',')}) `;
			} else if (typeof scaleX == 'number') {
				result += `scaleX(${scaleX}) `;
			} else if (typeof scaleY == 'number') {
				result += `scaleY(${scaleY}) `;
			}
	    }

        return result;
	},

	origin(element, value, units = '%') {
		if (Array.isArray(value)) {
			element.style('transform-origin', value.join(units + ' ') + units);
		}
	},

	scale(elements, value, save) {
		this._applySingle(elements, 'scale', value, save, '');
	},

	scaleX(elements, value, save) {
		for (let i = 0; i < elements.length; i++) {
			let transform = save ? elements[i].style.transform : '';
			elements[i].style.transform = transform + `scaleX(${value})`;
		}
	},

	scaleY(elements, value, save) {
		for (let i = 0; i < elements.length; i++) {
			let transform = save ? elements[i].style.transform : '';
			elements[i].style.transform = transform + `scaleY(${value})`;
		}
	},

	skew(elements, value, save, units = 'deg') {
		this._applySingle(elements, 'skew', value, save, units);
	},

	rotate(elements, value, save, units = 'deg') {
		this._applySingle(elements, 'rotate', value, save, units);
	},

	translate(elements, value, save, units = 'px') {
		this._applySingle(elements, 'translate', value, save, units, true);
	},

	_applySingle(elements, action, value, save, units, onlyArray) {
		const result = Array.isArray(value) || onlyArray
		? `${action}(${value.join(units + ',') + units})` : `${action}(${value + units})`;

		for (let i = 0; i < elements.length; i++) {
			let transform = save ? elements[i].style.transform : '';
			elements[i].style.transform = transform + result;
		}
	}
}

export default CSSTransformer;