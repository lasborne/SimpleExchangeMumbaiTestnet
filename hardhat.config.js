require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

//console.log(process.env.POLYGON_MAINNET)
const polygon_mainnet = process.env.POLYGON_MAINNET

const polygon_mumbai = process.env.POLYGON_MUMBAI
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "maticmum",
  networks: {
    hardhat: {

    },
    polygon: {
      url: polygon_mainnet,
      accounts: [process.env.PRIVATE_KEY]
    },
    maticmum: {
      url: polygon_mumbai,
      accounts: [process.env.PRIVATE_KEY, process.env.USER1_PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: process.env.API_KEY
  },
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};
