// This is the Main Script (all Contracts exist on the Matic Mumbai test blockchain)
const {ethers} =  require('hardhat');
require('dotenv').config()

let EscrowContract = require('./deployEscrow.js')

// All addresses used in this scripts
// 'deployer' and 'user1' would be different for anyone forking this scripts and entire code
let deployer = "0xCF7869798aa5132Ef4A245fAE10aC79aB7e62375"
let user1 = "0x3c96Eaa2e4ec538b5115D03294AEab385c980965"
let token1Address = "0xE33664E40670151168Ac4459B10f59b2FD6d06CA"
let token2Address = "0xB0723822600a544Ab42c7ECD05A6B225c2745Fc1"
let escrowAddress = "0xE742A93dF95E9DF2891e36B5fAc1e49cAd93cb04"


let App = {
    // This property function is called to load a new escrow contract
    loadNewContract: async function loadEscrowContract() {
        let escrowContract = await EscrowContract.EscrowContractApp.deployEscrowContract()
        console.log(`Contract Address: ${escrowContract.address}`)
        console.log(`Contract Deployer: ${escrowContract.signer.address}`)
        return escrowContract
    },

    // This property function transfers token1 and token2 to the Escrow Contract Address
    transferToEscrowContract: async function loadAddressesContract() {
        // Load token1, token2, and escrow Contracts
        let Token1 = await ethers.getContractFactory('Token1')
        let token1 = Token1.attach(token1Address)

        let Token2 = await ethers.getContractFactory('Token2')
        let token2 = Token2.attach(token2Address)

        let EscrowContract = await ethers.getContractFactory('Escrow')
        let escrowContract = EscrowContract.attach(escrowAddress)

        // Transfer token1, and token2 to EscrowContract
        await token1.transfer(escrowAddress, ethers.utils.parseEther('100000'))
        await token2.transfer(escrowAddress, ethers.utils.parseEther('20000'))

        console.log(`Deployer balance: ${await token1.balanceOf(deployer)}`)
        // Check the balances of token1 and token2 in the Escrow Contract after transfer
        let balToken1 = await escrowContract.checkBalToken1()
        let balToken2 = await escrowContract.checkBalToken2()
        console.log(balToken1)
        console.log(balToken2)
    },

    // This property function approves token1 or token2 for the escrowContract to spend on behalf 
    // of a user
    approveTransac: async function funcApprovTransac() {
        let EscrowContract = await ethers.getContractFactory('Escrow')
        let escrowContract = EscrowContract.attach(escrowAddress)
        let Token1 = await ethers.getContractFactory('Token1')
        let token1 = Token1.attach(token1Address)
        await token1.deployed()
        let Token2 = await ethers.getContractFactory('Token2')
        let token2 = Token2.attach(token2Address)
        await token2.deployed()

        // 2nd user with private key already loaded in hardhat config file
        let [, user1Address] = await ethers.getSigners()
        
        // Approve function
        await token1.connect(user1Address).functions.approve(
            escrowContract.address, ethers.utils.parseEther('510')
        )
    },

    // This property function loads the approve, then calls the exchange function coded in the
    // escrowContract (which swaps token1 for token2 or vice versa, depending on what user inputs)
    sendFundsToOtherUser: async function funcSendFunds () {
        // Load token1, token2, and escrow Contracts
        let Token1 = await ethers.getContractFactory('Token1')
        let token1 = Token1.attach(token1Address)

        let Token2 = await ethers.getContractFactory('Token2')
        let token2 = Token2.attach(token2Address)

        let EscrowContract = await ethers.getContractFactory('Escrow')
        let escrowContract = EscrowContract.attach(escrowAddress)
        await escrowContract.deployed()

        /*await token1.transfer(
            user1, ethers.utils.parseEther('5000')
        )
        console.log(await token1.balanceOf(user1))
        */
        
        let [, user1Address] = await ethers.getSigners()

        // Invoke the approveTransac property function for token approvals
        await this.approveTransac()
        // check the maximum token1 or token2 approval i.e. number of tokens approved for spending
        const maxApproval = await token1.allowance(user1Address.address, escrowContract.address)
        console.log(`Max. Approval: ${Number(maxApproval)}`)

        // Exchange user's token1 or token2 by calling exchange function of escrowContract which
        // has both tokens already held in its vault. (Sort of like an AMM in DeFi)
        try {
            await escrowContract.connect(user1Address).functions.exchange(
                ethers.utils.parseEther('510'), token1Address, {
                    from: user1, gasLimit: 6700000, 
                    gasPrice: Number(await ethers.provider.getGasPrice())
                }
            )
        } catch(e) {
            console.log(e.message)
            throw e
        }
        console.log(`Token1 Balance of User1: ${await token1.balanceOf(user1Address.address)}`)
        console.log(`Token2 Balance of User1: ${await token2.balanceOf(user1Address.address)}`)
    },

    // This property function simply sends Matic to a user from original deployer
    sendMatic: async function funcSendMatic() {
        const [owner, ] = await ethers.getSigners()
        await owner.sendTransaction({
            to: user1, 
            value: ethers.utils.parseEther('0.001')
        })
    }
}

// This is the main function for controlling what property function is called depending on needs
main = async () => {
    //await App.loadNewContract()
    //await App.transferToEscrowContract()
    await App.sendFundsToOtherUser()
    //await App.sendMatic()
}
main()