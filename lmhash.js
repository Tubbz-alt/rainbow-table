// don't look at this file
// i started a custome implementation of lmhash
// but i found a lib called ntlm where there is lmhash implementation

var computeHalf = half => {
	if (half.length === 0) {
		return Buffer.from([0xaa, 0xd3, 0xb4, 0x35, 0xb5, 0x14, 0x04, 0xee]);
	} else if (half.length > 7) {
		throw new Error('Halves greater than 14 characters are not supported');
	}
	// resize half
};

var lmhash = text => {
	if (text.length > 14) {
		throw new Error('Texts greater than 14 characters are not supported');
	}
	var textBytes = Buffer.from(text.toUpper());
	var textHalves = [];
	if (textBytes.length > 7) {
		var len = textBytes.length - 7;

		textHalves[0] = Buffer.alloc(7);
		textHalves[1] = Buffer.alloc(len);

		textHalves[0].write(textBytes, 'utf8', 7);
		textHalves[1].write(textBytes, 7, len);
	} else {
		textHalves[0] = textBytes;
		textHalves[1] = Buffer.alloc(0);
	}

	for (let i = 0; i < 2; i++) {
		textHalves[i] = computeHalf(textHalves[i]);
	}

	var hash = Buffer.alloc(16);
	hash.write(textHalves[0], 'utf8', 8);
	hash.write(textHalves[1], 'utf8', 8);

	return hash;
};
