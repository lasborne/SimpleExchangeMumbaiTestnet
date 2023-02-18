// This is only used for hardhat testing
const { ethers } = require('hardhat')

module.exports['Tokens'] = {
    token1: async function deployToken1() {
        let deployerToken1, token1Contract

        [deployerToken1] = await ethers.getSigners()
        const Token1Contract = await ethers.getContractFactory(
            'Token1', deployerToken1
        )
        token1Contract = await Token1Contract.deploy('TOKEN1', 'TOK1')
        
        await token1Contract.deployed()
        return token1Contract
    },
    
    token2: deployToken2 = async() => {
        let deployerToken1, deployerToken2, token2Contract

        [deployerToken1, deployerToken2] = await ethers.getSigners()
        const Token2Contract = await ethers.getContractFactory(
            'Token2', deployerToken2
        )
        token2Contract = await Token2Contract.deploy('TOKEN2', 'TOK2')

        await token2Contract.deployed()
        return token2Contract
    }
}