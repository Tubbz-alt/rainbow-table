const fs = require('fs');

const lmhash = require('ntlm').smbhash.lmhash;

var fetchTable = () => {
	try {
		var tableString = fs.readFileSync('table.json');
		return JSON.parse(tableString);
	} catch (e) {
		return [];
	}
};

var populateTable = texts => {
	// check if table.json exists
	var tableExists = fs.existsSync('table.json');
	// remove table.json to recreate the table
	if (tableExists) fs.unlinkSync('table.json');
	var table = [];
	texts.forEach(text => {
		var hash = lmhash(text);
		var newHash = hash;
		// 6 chains of reduce and hash
		for (let i = 0; i < 5; i++) {
			newHash = reduceAndHash(newHash).hash;
		}
		var tableElement = {
			text: text,
			hash: newHash
		};
		table.push(tableElement);
	});
	// save the table in table.json file
	fs.writeFileSync('table.json', JSON.stringify(table));
};

var reduceHash = hash => {
	// strip all non-numeric characters from hash
	var newHash = hash.replace(/\D/g, '');
	// take the first 6 numbers
	return newHash.substring(0, 6);
};

var getHash = hash => {
	var table = fetchTable();
	var filteredTable = table.filter(element => element.hash === hash);
	return filteredTable[0];
};

var reduceAndHash = hash => {
	// reduce the hash
	var reducedHash = reduceHash(hash);
	// hash the new text
	var newHash = lmhash(reducedHash);
	//console.log(`Plain text: ${reducedHash} Hash: ${newHash}`);
	return { text: reducedHash, hash: newHash };
};

var crackHash = hash => {
	// keep the track of the last hash
	var lastHash = hash;
	// chain that contains the original hash
	var chain;
	while (chain === undefined) {
		var hashElement = getHash(lastHash);
		if (hashElement) {
			// we found the chain
			chain = hashElement;
			break;
		} else {
			// we didn't found the chain, let's reduce and hash again
			lastHash = reduceAndHash(lastHash).hash;
		}
	}

	// pair of text and it's hash
	var pair = {
		text: chain.text,
		hash: lmhash(chain.text)
	};

	while (pair.hash !== hash) {
		pair = reduceAndHash(pair.hash);
		if (pair.hash === hash) {
			// we found our pair!
			break;
		}
	}

	return pair.text;
};

module.exports = {
	crackHash,
	populateTable,
	fetchTable
};
