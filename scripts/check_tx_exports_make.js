
const tx = require('@stacks/transactions');
console.log(Object.keys(tx).filter(k => k.toLowerCase().startsWith('make')));
