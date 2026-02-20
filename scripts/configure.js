const { 
  makeContractCall, 
  contractPrincipalCV,
  bufferCV,
  getAddressFromPrivateKey
} = require('@stacks/transactions');
const { STACKS_TESTNET } = require('@stacks/network');

const NETWORK = STACKS_TESTNET;
const DEPLOYER_KEY = '753b7cc01a1a2e86221266a154af73a1e3ee9aca744a56a6448375836c071d7901';
const ORACLE_KEY_HEX = '036f6128ef7b8df82f2e91a807ec8253e393ad19c9a3840678547f1c2886d9d20a';

async function getNextNonce(address, network) {
  const url = `${network.client.baseUrl}/extended/v1/address/${address}/nonces`;
  const response = await fetch(url);
  const json = await response.json();
  return BigInt(json.possible_next_nonce);
}

async function customBroadcast(tx, network) {
  const url = `${network.client.baseUrl}/v2/transactions`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tx: tx.serialize().toString('hex') })
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Broadcast failed (${response.status} ${response.statusText}): ${text}`);
  }
  return JSON.parse(text);
}

async function main() {
  const deployerAddress = getAddressFromPrivateKey(DEPLOYER_KEY, 'testnet');
  let currentNonce = await getNextNonce(deployerAddress, NETWORK);
  console.log(`Using Nonce: ${currentNonce}`);

  // 1. Link Savings -> Verification
  console.log(`Linking Savings -> Verification...`);
  try {
    const tx1 = await makeContractCall({
      contractAddress: deployerAddress,
      contractName: 'savings',
      functionName: 'set-verification-contract',
      functionArgs: [contractPrincipalCV(deployerAddress, 'verification')],
      senderKey: DEPLOYER_KEY,
      validateWithAbi: false,
      network: NETWORK,
      nonce: currentNonce++,
    });
    const res1 = await customBroadcast(tx1, NETWORK);
    console.log(`✅ Savings Link TX: ${res1.txid || res1}`);
  } catch (e) {
    console.error(`❌ Link failed:`, e.message);
  }

  // 2. Set Oracle Key
  console.log(`Setting Oracle Key...`);
  try {
    const tx2 = await makeContractCall({
      contractAddress: deployerAddress,
      contractName: 'verification',
      functionName: 'set-oracle-key',
      functionArgs: [bufferCV(Buffer.from(ORACLE_KEY_HEX, 'hex'))],
      senderKey: DEPLOYER_KEY,
      validateWithAbi: false,
      network: NETWORK,
      nonce: currentNonce++,
    });
    const res2 = await customBroadcast(tx2, NETWORK);
    console.log(`✅ Oracle Set TX: ${res2.txid || res2}`);
  } catch (e) {
    console.error(`❌ Oracle set failed:`, e.message);
  }
}

main();
