export default function Keypad() {

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

	const pads = {
		pad1: new Key(['1', '.', '@', '_', ':']),
		pad2: new Key(['2', 'a', 'b', 'c', '|']),
		pad3: new Key(['3', 'd', 'e', 'f', '!']),
		padF: new Key(['F6']),
		pad4: new Key(['4', 'g', 'h', 'i', '$']),
		pad5: new Key(['5', 'j', 'k', 'l', '/']),
		pad6: new Key(['6', 'm', 'n', 'o', ',']),
		padE: new Key(['F5']),
		pad7: new Key(['7', 'p', 'q', 'r', 's']),
		pad8: new Key(['8', 't', 'u', 'v', '\\']),
		pad9: new Key(['9', 'w', 'x', 'y', 'z']),
		padD: new Key(['F4']),
		padA: new Key(['F1', '*', ' ', '#']),
		pad0: new Key(['0', '-', '+', '=', '?']),
		padB: new Key(['F2']),
		padC: new Key(['F3'])
	};

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
	 * reset the extension key back to the primary key such that the next
	 * call to press() will return the primary key value.
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
