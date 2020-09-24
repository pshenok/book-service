import Joi from 'joi';


const extensions = [];

extensions.push((joi: any): Joi.Extension => {
	return {
		base:     joi.string(),
		name:     'string',
		language: {
			phone: 'needs to be a valid phone number, pattern: /^[0-9]{12}$/'
		},
		rules: [{
			name: 'phone',
			validate (params: any, value: any, state: Joi.State, options: Joi.ValidationOptions): any {
				if (!/^[0-9]{12}$/.test(value)) {
					return (this as any).createError('string.phone', { v: value }, state, options);
				}

				return value;
			}
		}]
	};
});


extensions.push((joi: any): Joi.Extension => {
	return {
		base:     joi.string(),
		name:     'string',
		language: {
			password: 'must be at least 6 characters, must contain at least one lowercase and one uppercase letter and one digit. ' +
					  'It can also contain any of these special characters: -_!@#$%^&*()'
		},
		rules: [{
			name: 'password',
			validate (params: any, value: any, state: Joi.State, options: Joi.ValidationOptions): any {
				const passwordRegex = new RegExp('^(?=[a-zA-Z0-9-_!@#$%^&*()]{6,16}$)(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9]).*');

				if (!passwordRegex.test(value)) {
					return (this as any).createError('string.password', { v: value }, state, options);
				}

				return value;
			}
		}]
	};
});


extensions.push((joi: any): Joi.Extension => {
	return {
		base:     joi.number(),
		name:     'number',
		language: {
			length: 'needs to be exactly this length: {{l}}'
		},
		rules: [{
			name:   'length',
			params: {
				numberLength: joi.number().integer().positive().required()
			},
			validate (params: any, value: any, state: Joi.State, options: Joi.ValidationOptions): any {
				if (value.toString().length !== params.numberLength) {
					return (this as any).createError('number.length', { v: value, l: params.numberLength }, state, options);
				}

				return value;
			}
		}]
	};
});


const validator = extensions.reduce((validators, extension) => {
	return validators.extend(extension);
}, Joi as any);

export default validator;
