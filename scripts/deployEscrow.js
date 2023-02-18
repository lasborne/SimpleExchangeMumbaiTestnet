// This is only called by the main Script 
const {ethers} = require('hardhat')

let token1Address = "0xE33664E40670151168Ac4459B10f59b2FD6d06CA"
let token2Address = "0xB0723822600a544Ab42c7ECD05A6B225c2745Fc1"

let deployEscrowContractApp = {

    /*
    token1: async function funcToken1() {
        let deployer, token1Contract

        deployer = await ethers.getSigner()
        const Token1Contract = await ethers.getContractFactory(
            'Token1', deployer
        )
        token1Contract = await Token1Contract.deploy('TOKEN1', 'TOK1')
        
        await token1Contract.deployed()
        return token1Contract
    },
    
    token2: async function funcToken2() {
        let deployer, token2Contract

        deployer = await ethers.getSigner()
        const Token2Contract = await ethers.getContractFactory(
            'Token2', deployer
        )
        token2Contract = await Token2Contract.deploy('TOKEN2', 'TOK2')

        await token2Contract.deployed()
        return token2Contract
    },
    */

    escrowContract: async function funcEscrowContract(token1Add, token2Add) {
        let deployer, escrowContract
        
        deployer = await ethers.getSigner()
        let EscrowContract = await ethers.getContractFactory('Escrow', deployer)
        escrowContract = await EscrowContract.deploy(token1Add, token2Add)

        await escrowContract.deployed()
        return escrowContract
    }
}


module.exports['EscrowContractApp'] = {

    deployEscrowContract: async function funcDeployEscrowContract() {
        //let token1 = await deployEscrowContractApp.token1()
        //let token2 = await deployEscrowContractApp.token2()

        let escrowContract = await deployEscrowContractApp.escrowContract(
            token1Address, token2Address
        )
        return escrowContract
    }

}
