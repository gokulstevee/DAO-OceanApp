require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.17',
  networks: {
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [process.env.MAIN_ACCOUNT],
      chainId: 80001,
    },
    hardhat: {
      chainId: 1337,
    },
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  paths: {
    sources: './contracts',
    tests: '.test',
    cache: './cache',
    artifacts: './src/abi',
  },
};
