/*global describe, it, beforeEach*/
import {expect} from 'chai';
import Keypad from '../lib';

describe('ov-keypad', function () {
	let keypad;
	beforeEach(function () {
		keypad = new Keypad();
	});
	it('is defined', function () {
		expect(keypad).to.be.defined;
	});
	it('exports the key map', function () {
		const keys = keypad.keys();
		expect(keys).to.eql([
			["1", ".", "@", "_", ":"],
			["2", "a", "b", "c", "|"],
			["3", "d", "e", "f", "!"],
			["F6"],
			["4", "g", "h", "i", "$"],
			["5", "j", "k", "l", "/"],
			["6", "m", "n", "o", ","],
			["F5"],
			["7", "p", "q", "r", "s"],
			["8", "t", "u", "v", "\\"],
			["9", "w", "x", "y", "z"],
			["F4"],
			["F1", "*", " ", "#"],
			["0", "-", "+", "=", "?"],
			["F2"],
			["F3"]
		]);
	});
	it('overrides the default extended keypad', function () {
		keypad = new Keypad({
			pad1: [1],
			pad2: [2],
			pad3: [3],
			pad4: [4],
			pad5: [5],
			pad6: [6],
			pad7: [7],
			pad8: [8],
			pad9: [9],
			pad0: [0],
			padA: ['A'],
			padB: ['B'],
			padC: ['C'],
			padD: ['D'],
			padE: ['E'],
			padF: ['F']
		});
		expect(keypad.keys()).to.eql([[1], [2], [3], [4], [5], [6], [7], [8], [9], [0], ['A'], ['B'], ['C'], ['D'], ['E'], ['F']]);
	});
	it('processBusEvent({keys: [0-9a-f]}) ignores event keys it does not support', function () {
		expect(keypad.processBusEvent({keys: 'bad'})).to.be.undefined;
	});
	it('processBusEvent({keys: [0-9a-f]}) adds extended keys info to the given bus event object', function () {
		let busEvent = {keys: 1};
		keypad.processBusEvent(busEvent);
		expect(busEvent).to.eql({keys: 1, extendedKeys: ['1', '.', '@', '_', ':'], extendedKeysIndex: 0});
	});
	it('reset() sets extended char position index back to primary character', function () {
		expect(keypad.processBusEvent({keys: '1'})).to.equal('1');
		keypad.reset();
		expect(keypad.processBusEvent({keys: '1'})).to.equal('1');
	});
	it('keypadNames() exports the key pad display names', function () {
		expect(keypad.keypadNames()).to.eql(['1', '2', '3', 'F', '4', '5', '6', 'E', '7', '8', '9', 'D', 'A', '0', 'B', 'C']);
	});
	it('processBusEvent() resets extended keys correctly', function () {
		let busEvent = {keys: 2};
		keypad.processBusEvent(busEvent);
		busEvent.keys = 2;
		keypad.processBusEvent(busEvent);
		busEvent.keys = 1;
		keypad.processBusEvent(busEvent);
		expect(busEvent).to.eql({keys: 1, extendedKeys: ['1', '.', '@', '_', ':'], extendedKeysIndex: 0});
	});
	describe('replacePreviousValue()', function () {
		it('indicates a key press value should replace the previous key press value', function () {
			keypad.processBusEvent({keys: '1'});
			keypad.processBusEvent({keys: '1'});
			expect(keypad.replacePreviousValue()).to.equal(true);
		});
		it('indicates a key press value should not replace the previous key press value', function () {
			keypad.processBusEvent({keys: '1'});
			keypad.processBusEvent({keys: '2'});
			expect(keypad.replacePreviousValue()).to.equal(false);
		});
	});
	describe('replacePreviousValue(timeout)', function () {
		it('indicates a key press value should replace the previous key press value', function (done) {
			keypad.processBusEvent({keys: '1'});
			keypad.replacePreviousValue(1000);
			keypad.processBusEvent({keys: '1'});
			expect(keypad.replacePreviousValue(1000)).to.equal(true);
			done();
		});
		it('indicates a key press value should not replace the previous key press value', function (done) {
			keypad.processBusEvent({keys: '1'});
			keypad.replacePreviousValue(1);
			keypad.processBusEvent({keys: '2'});
			keypad.replacePreviousValue(1);
			setTimeout(() => {
				expect(keypad.replacePreviousValue()).to.equal(false);
				done();
			}, 3);
		});
		it('should return false when same key pressed after timeout', function (done) {
			keypad.processBusEvent({keys: '1'});
			keypad.replacePreviousValue(1);
			setTimeout(() => {
				keypad.processBusEvent({keys: '1'});
				expect(keypad.replacePreviousValue(1)).to.equal(false);
				done();
			}, 3);
		});
		it('resets the extended key index so primary key is emitted on key press after timeout', function (done) {
			keypad.processBusEvent({keys: '1'});
			keypad.replacePreviousValue(1);
			setTimeout(() => {
				expect(keypad.processBusEvent({keys: '1'})).to.equal('1');
				done();
			}, 3);
		});
	});
	describe('replacePreviousValue(timeout, callback)', function () {
		it('it should invoke callback when key press wait times out', function (done) {
			keypad.processBusEvent({keys: '1'});
			keypad.replacePreviousValue(1, done);
		});
	});
	describe('character layout first key press', function () {
		it('key 1 returns 1', function () {
			expect(keypad.processBusEvent({keys: '1'})).to.equal('1');
		});
		it('key 2 returns 2', function () {
			expect(keypad.processBusEvent({keys: '2'})).to.equal('2');
		});
		it('key 3 returns 3', function () {
			expect(keypad.processBusEvent({keys: '3'})).to.equal('3');
		});
		it('key 4 returns 4', function () {
			expect(keypad.processBusEvent({keys: '4'})).to.equal('4');
		});
		it('key 5 returns 5', function () {
			expect(keypad.processBusEvent({keys: '5'})).to.equal('5');
		});
		it('key 6 returns 6', function () {
			expect(keypad.processBusEvent({keys: '6'})).to.equal('6');
		});
		it('key 7 returns 7', function () {
			expect(keypad.processBusEvent({keys: '7'})).to.equal('7');
		});
		it('key 8 returns 8', function () {
			expect(keypad.processBusEvent({keys: '8'})).to.equal('8');
		});
		it('key 9 returns 9', function () {
			expect(keypad.processBusEvent({keys: '9'})).to.equal('9');
		});
		it('key 0 returns 0', function () {
			expect(keypad.processBusEvent({keys: '0'})).to.equal('0');
		});
		it('key A returns F1', function () {
			expect(keypad.processBusEvent({keys: 'a'})).to.equal('F1');
		});
		it('key B returns F2', function () {
			expect(keypad.processBusEvent({keys: 'b'})).to.equal('F2');
		});
		it('key C returns F3', function () {
			expect(keypad.processBusEvent({keys: 'c'})).to.equal('F3');
		});
		it('key D returns F4', function () {
			expect(keypad.processBusEvent({keys: 'd'})).to.equal('F4');
		});
		it('key E returns F5', function () {
			expect(keypad.processBusEvent({keys: 'e'})).to.equal('F5');
		});
		it('key F returns F6', function () {
			expect(keypad.processBusEvent({keys: 'f'})).to.equal('F6');
		});
	});
	describe('character layout extended characters', function () {
		it('key 1 returns . @ _ :', function () {
			keypad.processBusEvent({keys: '1'});
			expect(keypad.processBusEvent({keys: '1'})).to.equal('.');
			expect(keypad.processBusEvent({keys: '1'})).to.equal('@');
			expect(keypad.processBusEvent({keys: '1'})).to.equal('_');
			expect(keypad.processBusEvent({keys: '1'})).to.equal(':');
			expect(keypad.processBusEvent({keys: '1'})).to.equal('1');
		});
		it('key 2 returns a b c |', function () {
			keypad.processBusEvent({keys: '2'});
			expect(keypad.processBusEvent({keys: '2'})).to.equal('a');
			expect(keypad.processBusEvent({keys: '2'})).to.equal('b');
			expect(keypad.processBusEvent({keys: '2'})).to.equal('c');
			expect(keypad.processBusEvent({keys: '2'})).to.equal('|');
			expect(keypad.processBusEvent({keys: '2'})).to.equal('2');
		});
		it('key 3 returns d e f !', function () {
			keypad.processBusEvent({keys: '3'});
			expect(keypad.processBusEvent({keys: '3'})).to.equal('d');
			expect(keypad.processBusEvent({keys: '3'})).to.equal('e');
			expect(keypad.processBusEvent({keys: '3'})).to.equal('f');
			expect(keypad.processBusEvent({keys: '3'})).to.equal('!');
			expect(keypad.processBusEvent({keys: '3'})).to.equal('3');
		});
		it('key 4 returns g h i $', function () {
			keypad.processBusEvent({keys: '4'});
			expect(keypad.processBusEvent({keys: '4'})).to.equal('g');
			expect(keypad.processBusEvent({keys: '4'})).to.equal('h');
			expect(keypad.processBusEvent({keys: '4'})).to.equal('i');
			expect(keypad.processBusEvent({keys: '4'})).to.equal('$');
			expect(keypad.processBusEvent({keys: '4'})).to.equal('4');
		});
		it('key 5 returns j k l /', function () {
			keypad.processBusEvent({keys: '5'});
			expect(keypad.processBusEvent({keys: '5'})).to.equal('j');
			expect(keypad.processBusEvent({keys: '5'})).to.equal('k');
			expect(keypad.processBusEvent({keys: '5'})).to.equal('l');
			expect(keypad.processBusEvent({keys: '5'})).to.equal('/');
			expect(keypad.processBusEvent({keys: '5'})).to.equal('5');
		});
		it('key 6 returns m n o ,', function () {
			keypad.processBusEvent({keys: '6'});
			expect(keypad.processBusEvent({keys: '6'})).to.equal('m');
			expect(keypad.processBusEvent({keys: '6'})).to.equal('n');
			expect(keypad.processBusEvent({keys: '6'})).to.equal('o');
			expect(keypad.processBusEvent({keys: '6'})).to.equal(',');
			expect(keypad.processBusEvent({keys: '6'})).to.equal('6');
		});
		it('key 7 returns p q r s', function () {
			keypad.processBusEvent({keys: '7'});
			expect(keypad.processBusEvent({keys: '7'})).to.equal('p');
			expect(keypad.processBusEvent({keys: '7'})).to.equal('q');
			expect(keypad.processBusEvent({keys: '7'})).to.equal('r');
			expect(keypad.processBusEvent({keys: '7'})).to.equal('s');
			expect(keypad.processBusEvent({keys: '7'})).to.equal('7');
		});
		it('key 8 returns t u v \\', function () {
			keypad.processBusEvent({keys: '8'});
			expect(keypad.processBusEvent({keys: '8'})).to.equal('t');
			expect(keypad.processBusEvent({keys: '8'})).to.equal('u');
			expect(keypad.processBusEvent({keys: '8'})).to.equal('v');
			expect(keypad.processBusEvent({keys: '8'})).to.equal('\\');
			expect(keypad.processBusEvent({keys: '8'})).to.equal('8');
		});
		it('key 9 returns w x y z', function () {
			keypad.processBusEvent({keys: '9'});
			expect(keypad.processBusEvent({keys: '9'})).to.equal('w');
			expect(keypad.processBusEvent({keys: '9'})).to.equal('x');
			expect(keypad.processBusEvent({keys: '9'})).to.equal('y');
			expect(keypad.processBusEvent({keys: '9'})).to.equal('z');
			expect(keypad.processBusEvent({keys: '9'})).to.equal('9');
		});
		it('key 0 returns - + = ?', function () {
			keypad.processBusEvent({keys: '0'});
			expect(keypad.processBusEvent({keys: '0'})).to.equal('-');
			expect(keypad.processBusEvent({keys: '0'})).to.equal('+');
			expect(keypad.processBusEvent({keys: '0'})).to.equal('=');
			expect(keypad.processBusEvent({keys: '0'})).to.equal('?');
			expect(keypad.processBusEvent({keys: '0'})).to.equal('0');
		});
		it('key A returns * (space) #', function () {
			keypad.processBusEvent({keys: 'a'});
			expect(keypad.processBusEvent({keys: 'a'})).to.equal('*');
			expect(keypad.processBusEvent({keys: 'a'})).to.equal(' ');
			expect(keypad.processBusEvent({keys: 'a'})).to.equal('#');
		});
		it('key B returns F2 - no extended characters', function () {
			keypad.processBusEvent({keys: 'b'});
			expect(keypad.processBusEvent({keys: 'b'})).to.equal('F2');
		});
		it('key C returns F3', function () {
			keypad.processBusEvent({keys: 'c'});
			expect(keypad.processBusEvent({keys: 'c'})).to.equal('F3');
		});
		it('key D returns F4', function () {
			keypad.processBusEvent({keys: 'd'});
			expect(keypad.processBusEvent({keys: 'd'})).to.equal('F4');
		});
		it('key E returns F5', function () {
			keypad.processBusEvent({keys: 'e'});
			expect(keypad.processBusEvent({keys: 'e'})).to.equal('F5');
		});
		it('key F returns F6', function () {
			keypad.processBusEvent({keys: 'f'});
			expect(keypad.processBusEvent({keys: 'f'})).to.equal('F6');
		});
	});
});
