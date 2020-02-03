export default function jsonParse(str) {
	const devs = '{}[],:';
	const reg = /^[\s*"']+|['"\s*]+$/gm;

	let quot = '', word = '', isString = false, left = false;
	let result = '';

    for (let i = 0; i < str.length; i++) {

    	if (isString && str[i] == quot) {
			isString = false;
			i++
		}

    	if (str[i] == "'" || str[i] == '"') {
			isString = true;
			quot = str[i];
			i++
		}

    	left = str[i] == ":";

        if (devs.indexOf(str[i]) != -1 && !isString) {
        	word = word.replace(reg, '');

            if (word) {
				if (word == 'true') word = true;
            	else if (word == 'false') word = false;

            	result += typeof word == 'boolean' && !left || +word && !left
            	? word : '"' + word + '"';
            }

            result += str[i];
			word = '';

        } else {
			word += str[i];
		}

    }

    return JSON.parse(result);
}