const yargs = require('yargs');

const algo = require('./algo.js');

const argv = yargs
	.options({
		hash: {
			demand: true,
			describe: 'Hash to crack',
			string: true
		}
	})
	.help()
	.alias('help', 'h').argv;

console.log('Starting Rainbow Table.');
console.log('This rainbow table cointains only numeric passwords of length 6.');

console.log('Lets populate the rainbow table with the following passwords: ');
var passwords = ['123456', '654321', '111111', '222222', '112233', '445566'];
passwords.forEach(password => console.log(password));
algo.populateTable(passwords);

console.log('Rainbow table: ');
var table = algo.fetchTable();
table.forEach(element =>
	console.log(`Plain text: ${element.text} Final hash: ${element.hash}`)
);

console.log(`The hash you provided is ${argv.hash}`);
console.log(`The password for this hash is ${algo.crackHash(argv.hash)}`);

// EXAMPLE TO TEST
// Plain text: 143349 Hash: 6FFB785EA2380B7FAAD3B435B51404EE

//const lmhash = require('ntlm').smbhash.lmhash;
//console.log('LM Hash: ' + lmhash('123456'));
