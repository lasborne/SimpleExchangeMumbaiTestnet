// This is only used for hardhat testing
const {ethers} = require('hardhat')

module.exports['EscrowContractObject'] = {
    escrowContractMain: deployEscrowContractMain = async(token1Add, token2Add) => {
        let deployer, escrowContractMain
        
        deployer = await ethers.getSigner()
        let EscrowContractMain = await ethers.getContractFactory('Escrow', deployer)
        escrowContractMain = await EscrowContractMain.deploy(token1Add, token2Add)

        await escrowContractMain.deployed()
        return escrowContractMain
    },
    escrowContract: deployEscrowContract = async(token1Add, token2Add) => {
        let deployerToken1, deployerToken2, deployerEscrow, escrowContract

        [deployerToken1, deployerToken2, deployerEscrow] = await ethers.getSigners()
        let EscrowContract = await ethers.getContractFactory('Escrow', deployerEscrow)
        escrowContract = await EscrowContract.deploy(token1Add, token2Add)

        await escrowContract.deployed()
        return escrowContract
    }

}