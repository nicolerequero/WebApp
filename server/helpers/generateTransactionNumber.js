const crypto = require('crypto');

function generateTransactionNumber(prefix) {
  const bytes = crypto.randomBytes(8);
  const randomString = bytes.toString('hex');
  return prefix + randomString;
}

const prefix = 'PSBLI';
const transactionNumber = generateTransactionNumber(prefix);
console.log(transactionNumber);
