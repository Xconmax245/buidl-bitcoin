
const { 
  makeContractDeploy, 
  broadcastTransaction, 
  contractPrincipalCV,
  uintCV,
  trueCV,
  falseCV,
  AnchorMode,
  PostConditionMode,
  makeContractCall,
  standardPrincipalCV,
  bufferCV,
  privateKeyToPublic,
  makeRandomPrivKey,
  getAddressFromPrivateKey
} = require('@stacks/transactions');
const { STACKS_TESTNET } = require('@stacks/network');
const fs = require('fs');

// --- CONFIGURATION ---
const NETWORK = STACKS_TESTNET;
const FEE_ESTIMATE = 10000; // 0.01 STX

const DEPLOYER_KEY = process.env.DEPLOYER_KEY || '753b7cc01a1a2e86221266a154af73a1e3ee9aca744a56a6448375836c071d7901';

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
  // Calculate address
  const deployerAddress = getAddressFromPrivateKey(DEPLOYER_KEY, 'testnet');
  let currentNonce = await getNextNonce(deployerAddress, NETWORK);
  console.log(`Current Nonce: ${currentNonce}`);
  console.log(`\n🚀 DEPLOYMENT SCRIPT`);
  console.log(`-----------------------------------`);
  console.log(`Deployer Address: ${deployerAddress}`);
  console.log(`Network: Testnet`);
  console.log(`\nEnsure this address has STX testnet funds!`);
  console.log(`https://explorer.hiro.so/sandbox/faucet?chain=testnet\n`);

  console.log('Starting deployment...');

  const contracts = [
    { name: 'sbtc-token', path: 'contracts/external/sbtc-token.clar' },
    { name: 'registry', path: 'contracts/registry.clar' },
    { name: 'governance', path: 'contracts/governance.clar' },
    { name: 'savings', path: 'contracts/savings.clar' },
    { name: 'verification', path: 'contracts/verification.clar' },
    { name: 'vault', path: 'contracts/vault.clar' },
    { name: 'rewards', path: 'contracts/rewards.clar' },
    { name: 'emergency', path: 'contracts/emergency.clar' }
  ];

  for (const contract of contracts) {
    console.log(`\n📄 Deploying ${contract.name}...`);
    try {
      const code = fs.readFileSync(contract.path, 'utf8').replace(/\r\n/g, '\n');
      
      const tx = await makeContractDeploy({
        contractName: contract.name,
        codeBody: code,
        senderKey: DEPLOYER_KEY,
        network: NETWORK,
        anchorMode: AnchorMode.Any,
        fee: BigInt(FEE_ESTIMATE),
        nonce: currentNonce++,
      });

      const broadcastResponse = await customBroadcast(tx, NETWORK);
      
      if (broadcastResponse.error) {
        console.error(`❌ Error deploying ${contract.name}:`, broadcastResponse.error);
        console.error(`Reason:`, broadcastResponse.reason);
      } else {
        const txid = typeof broadcastResponse === 'string' ? broadcastResponse : broadcastResponse.txid;
        console.log(`✅ Transaction broadcasted: ${txid}`);
        console.log(`Waiting for confirmation... (15s delay)`);
        await new Promise(r => setTimeout(r, 15000));
      }
    } catch (err) {
      console.error(`❌ Failed to process ${contract.name}:`, err.message);
      console.error(err.stack);
    }
  }
  
  console.log(`\n⚙️ configuring contracts...`);
  
  // 1. Link Savings -> Verification
  try {
     console.log(`Linking Savings -> Verification...`);
     const tx = await makeContractCall({
      contractAddress: deployerAddress,
      contractName: 'savings',
      functionName: 'set-verification-contract',
      functionArgs: [contractPrincipalCV(deployerAddress, 'verification')],
      senderKey: DEPLOYER_KEY,
      validateWithAbi: false,
      network: NETWORK,
      anchorMode: AnchorMode.Any,
      fee: BigInt(FEE_ESTIMATE),
      nonce: currentNonce++,
    });

    const broadcastResponse = await customBroadcast(tx, NETWORK);
    
    if (broadcastResponse.error) {
       console.error(`❌ Link failed:`, broadcastResponse.error);
    } else {
       const txid = typeof broadcastResponse === 'string' ? broadcastResponse : broadcastResponse.txid;
       console.log(`✅ Link TX: ${txid}`);
    }
  } catch (e) {
      console.error(`❌ Configuration error:`, e.message);
  }

  // 2. Set Oracle Key in Verification
  try {
    console.log(`\n🔐 Setting up Trusted Oracle...`);
    
    const oraclePrivKey = makeRandomPrivKey();
    const oraclePubKey = privateKeyToPublic(oraclePrivKey);
    
    const pubKeyBuffer = typeof oraclePubKey === 'string' ? Buffer.from(oraclePubKey, 'hex') : oraclePubKey;
    
    console.log(`Oracle Private Key: ${oraclePrivKey} (SAVE TO BACKEND .env as ORACLE_KEY)`);
    console.log(`Oracle Public Key: ${pubKeyBuffer.toString('hex')}`);

    const tx = await makeContractCall({
      contractAddress: deployerAddress,
      contractName: 'verification',
      functionName: 'set-oracle-key',
      functionArgs: [bufferCV(pubKeyBuffer)],
      senderKey: DEPLOYER_KEY,
      validateWithAbi: false,
      network: NETWORK,
      anchorMode: AnchorMode.Any,
      fee: BigInt(FEE_ESTIMATE),
      nonce: currentNonce++,
    });

    const broadcastResponse = await customBroadcast(tx, NETWORK);
    
     if (broadcastResponse.error) {
       console.error(`❌ Oracle Set failed:`, broadcastResponse.error);
    } else {
       const txid = typeof broadcastResponse === 'string' ? broadcastResponse : broadcastResponse.txid;
       console.log(`✅ Oracle Set TX: ${txid}`);
    }

  } catch (e) {
     console.error(`❌ Oracle setup error:`, e.message);
  }

  console.log(`\n🎉 Deployment Sequence Complete!`);
  console.log(`1. Update NEXT_PUBLIC_CONTRACT_ADDRESS in .env to: ${deployerAddress}`);
  console.log(`2. Update ORACLE_PRIVATE_KEY in backend .env`);
}

main().catch(console.error);

