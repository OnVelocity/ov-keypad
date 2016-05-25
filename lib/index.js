
export default function Keypad() {
	let pos = 0;
	let key = null;
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
		pad4: new Key(['4', 'g', 'h', 'i', '$']),
		pad5: new Key(['5', 'j', 'k', 'l', '/']),
		pad6: new Key(['6', 'm', 'n', 'o', ',']),
		pad7: new Key(['7', 'p', 'q', 'r', 's']),
		pad8: new Key(['8', 't', 'u', 'v', '\\']),
		pad9: new Key(['9', 'w', 'x', 'y', 'z']),
		pad0: new Key(['0', '-', '+', '=', '?']),
		padA: new Key(['F1', '*', ' ', '#']),
		padB: new Key(['F2']),
		padC: new Key(['F3']),
		padD: new Key(['F4']),
		padE: new Key(['F5']),
		padF: new Key(['F6'])
	};

	this.processBusEvent = function (event) {
		const key = pads['pad' + String(event.keys).toUpperCase()];
		if (key) {
			return key.press();
		}
	};

	this.keys = function () {
		return Object.keys(pads).reduce(function (out, pad) {
			out.push(pads[pad].keys());
			return out;
		}, []);
	};

}
