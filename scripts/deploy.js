const hre = require('hardhat');

async function main() {
  const DAO = await hre.ethers.getContractFactory('DAO');
  const dao = await DAO.deploy();
  await dao.deployed();
  console.log(`DAO contract address ${dao.address}`);
  // deployed address 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
