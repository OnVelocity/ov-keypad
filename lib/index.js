
const defaultKeyPadMap = {
	'pad1': ['1', '.', '@', '_', ':'],
	'pad2': ['2', 'a', 'b', 'c', '|'],
	'pad3': ['3', 'd', 'e', 'f', '!'],
	'padF': ['F6'],
	'pad4': ['4', 'g', 'h', 'i', '$'],
	'pad5': ['5', 'j', 'k', 'l', '/'],
	'pad6': ['6', 'm', 'n', 'o', ','],
	'padE': ['F5'],
	'pad7': ['7', 'p', 'q', 'r', 's'],
	'pad8': ['8', 't', 'u', 'v', '\\'],
	'pad9': ['9', 'w', 'x', 'y', 'z'],
	'padD': ['F4'],
	'padA': ['F1', '*', ' ', '#'],
	'pad0': ['0', '-', '+', '=', '?'],
	'padB': ['F2'],
	'padC': ['F3']
};

export default function Keypad(keyMap = defaultKeyPadMap) {

	let pos = 0;
	let key = null;
	let timeoutId = null;
	let replacePreviousValue = false;
	let lastKeyPressEventName = null;

	function Key(keys) {
		keys = Object.freeze(keys);
		this.press = function () {
			if (key !== this) {
				pos = 0;
				key = this;
			}
			return keys[pos++ % keys.length];
		};
		this.keys = function () {
			return keys;
		};
	}

	const pads = Object.keys(keyMap).reduce((out, key) => {
		out[key] = new Key(keyMap[key]);
		return out;
	}, {});


	/**
	 * return keypad character for the given matrix keypad bus event
	 * expects an object with a property 'keys' to contain the name
	 * of the key pressed on the matrix keypad.
	 * @param event
	 */
	this.processBusEvent = function (event) {
		const key = pads['pad' + String(event.keys).toUpperCase()];
		replacePreviousValue = (key === lastKeyPressEventName);
		lastKeyPressEventName = key;
		if (key) {
			if (!replacePreviousValue) {
				pos = 0;
			}
			const pad = key.keys();
			const len = pad.length;
			if (len > 1) {
				event.extendedKeys = pad;
				event.extendedKeysIndex = (pos % len);
			}

			return key.press();
		}
	};

	/**
	 * returns the underlying key map as an array of arrays.
	 * @returns {*}
	 */
	this.keys = function () {
		return Object.keys(pads).reduce(function (out, pad) {
			out.push(pads[pad].keys());
			return out;
		}, []);
	};

	/**
	 * returns the pad names.
	 */
	this.keypadNames = function () {
		return Object.keys(keyMap).map(pad => pad.substr(3));
	};

	/**
	 * reset the extension key back to the primary key such that the next
	 * call to processBusEvent() will return the primary key value.
	 */
	this.reset = function () {
		pos = 0;
	};

	/**
	 * determine if recent key press value should replace the previous value.
	 */
	this.replacePreviousValue = function (timeout = 0, callback) {
		if (timeout) {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				this.reset();
				replacePreviousValue = false;
				lastKeyPressEventName = null;
				if (callback) {
					callback();
				}
			}, timeout);
		}
		return replacePreviousValue;
	};

}
