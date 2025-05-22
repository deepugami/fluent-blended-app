const { ethers } = require('ethers');

async function main() {
  const provider = new ethers.providers.JsonRpcProvider('https://rpc.dev.gblend.xyz/');
  console.log('Getting information for contracts...');
  
  const rustContract = '0x87b99c706e17211f313e21f1ed98782e19e91fb2';
  const solidityContract = '0xAFc63F12b732701526f48E8256Ad35c888336E54';
  
  console.log('Rust contract at:', rustContract);
  const rustBalance = await provider.getBalance(rustContract);
  console.log('Balance:', ethers.utils.formatEther(rustBalance), 'ETH');
  const rustCode = await provider.getCode(rustContract);
  console.log('Code length:', (rustCode.length - 2) / 2, 'bytes');
  
  console.log('\nSolidity contract at:', solidityContract);
  const solBalance = await provider.getBalance(solidityContract);
  console.log('Balance:', ethers.utils.formatEther(solBalance), 'ETH');
  const solCode = await provider.getCode(solidityContract);
  console.log('Code length:', (solCode.length - 2) / 2, 'bytes');
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
