const { 
  makeContractDeploy, 
  AnchorMode,
} = require('@stacks/transactions');
const { STACKS_TESTNET } = require('@stacks/network');
const fs = require('fs');

const DEPLOYER_KEY = '753b7cc01a1a2e86221266a154af73a1e3ee9aca744a56a6448375836c071d7901';
const NETWORK = STACKS_TESTNET;

async function main() {
  const code = fs.readFileSync('contracts/external/sbtc-token.clar', 'utf8');
      
  const tx = await makeContractDeploy({
    contractName: 'sbtc-token',
    codeBody: code,
    senderKey: DEPLOYER_KEY,
    network: NETWORK,
    anchorMode: AnchorMode.Any,
    fee: BigInt(10000),
  });

  console.log(tx.serialize().toString('hex'));
}

main();
