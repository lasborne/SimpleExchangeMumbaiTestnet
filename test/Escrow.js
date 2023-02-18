const { expect } = require('chai')
const { ethers } = require('hardhat')
let TokenContracts = require('../scripts/deployTokens.js')
let EscrowContract = require('../scripts/deployEscrowContract.js')

describe('Exchange', () => {
    let token1, token2, token1ContractAddress, token2ContractAddress
    let escrowContract, deployerToken1, deployerToken2, deployerEscrow, trader2
    beforeEach(async() => {
        [deployerToken1, deployerToken2, deployerEscrow, trader2] = await ethers.getSigners()

        //Create token1 and token2 by running a script containing them
        token1 = await TokenContracts.Tokens.token1()
        token2 = await TokenContracts.Tokens.token2()

        //Get token1 and token2's contract addresses
        token1ContractAddress = token1.address
        token2ContractAddress = token2.address

        //Call the Escrow smart contract by running the script
        escrowContract = await EscrowContract.EscrowContractObject.escrowContract(
            token1ContractAddress, token2ContractAddress
        )

        /*Transfer some token1 and token2 tokens to the Escrow smart contract*/

        //Transfer 2 million token1 tokens into the Escrow contract (for exchange)
        await token1.transfer(
            escrowContract.address, ethers.utils.parseEther(`${2*(10**6)}`)
        )

        //Transfer 500000 token2 tokens into the Escrow contract (for exchange)
        await token2.transfer(
            escrowContract.address, ethers.utils.parseEther(`${5*(10**5)}`)
        )

        //Fund/Transfer 35000 token2 tokens to trader2
        await token1.transfer(trader2.address, ethers.utils.parseEther('35000'))
        
        //Fund/Transfer 100000 token2 tokens to trader2
        await token2.transfer(trader2.address, ethers.utils.parseEther('100000'))
    })

    describe('Ensures contract is created and gives the address', () => {
        it('checks if token names are correct', async() => {
            console.log(`Contract address of token1 is: ${await token1.address}`)
            console.log(`Contract address of token2 is: ${await token2.address}`)
            expect(await token1.name()).to.eq('TOKEN1')
            expect(await token2.name()).to.eq('TOKEN2')
            console.log(await token1.signer.address, await token2.signer.address,
                await escrowContract.signer.address, await trader2.address)
        })
        it("checks the Token contracts' balances", async() => {
            expect(await token1.totalSupply()).to.eq(ethers.utils.parseEther('10000000'))
            expect(await token2.totalSupply()).to.eq(ethers.utils.parseEther('1000000'))
        })
        it("Checks the balances of the Token contracts' owners", async() => {
            expect(await token1.balanceOf(await token1.signer.address)).to.eq(
                ethers.utils.parseEther('7965000')
            )
            expect(await token2.balanceOf(await token2.signer.address)).to.eq(
                ethers.utils.parseEther('400000')
            )
        })
        it('Ensures Escrow Contract is deployed and have balance', async() => {
            expect(await escrowContract.checkBalToken1()).to.eq(
                ethers.utils.parseEther('2000000')
            )
            expect(await escrowContract.checkBalToken2()).to.eq(
                ethers.utils.parseEther('500000')
            )
            console.log(await escrowContract.address)
        })

        it('Evaluates that the exchange function of Escrow contract works', async() => {
            let amountIn = '20000'
            let initToken1Balance = await token1.balanceOf(trader2.address)
            let initToken2Balance = await token2.balanceOf(trader2.address)
            console.log('***Balances of trader2 Before***')
            console.log(`Trader2 is: ${await trader2.address}`)
            console.log(`Token1: ${ethers.utils.formatEther(
                await initToken1Balance
            )}`)
            console.log(`Token2: ${ethers.utils.formatEther(
                await initToken2Balance
            )}`)

            //Approve the escrowContract to use trader2 tokens
            await token2.connect(trader2).approve(
                escrowContract.address, ethers.utils.parseEther(amountIn)
            )

            expect(
                await token2.allowance(trader2.address, escrowContract.address)
            ).to.eq(ethers.utils.parseEther(amountIn))

            //Do the exchange
            await escrowContract.connect(trader2).exchange(
                ethers.utils.parseEther(amountIn), token2ContractAddress
            )

            console.log('***Balances of trader2 After***')
            console.log(`Token1: ${ethers.utils.formatEther(
                await token1.balanceOf(trader2.address)
            )}`)
            console.log(`Token2: ${ethers.utils.formatEther(
                await token2.balanceOf(trader2.address)
            )}`)

            expect(await token1.balanceOf(trader2.address)).gte(await initToken1Balance)
            expect(await token2.balanceOf(trader2.address)).lte(await initToken2Balance)
        })

        it('Evaluates that the exchange function of Escrow contract works', async() => {
            let amountIn = '5000'
            let initToken1Balance = await token1.balanceOf(trader2.address)
            let initToken2Balance = await token2.balanceOf(trader2.address)
            console.log('***Balances of trader2 Before***')
            console.log(`Trader2 is: ${await trader2.address}`)
            console.log(`Token1: ${ethers.utils.formatEther(
                await token1.balanceOf(trader2.address)
            )}`)
            console.log(`Token2: ${ethers.utils.formatEther(
                await token2.balanceOf(trader2.address)
            )}`)

            //Approve the escrowContract to use trader2 tokens
            await token1.connect(trader2).approve(
                escrowContract.address, ethers.utils.parseEther(amountIn)
            )

            expect(
                await token1.allowance(trader2.address, escrowContract.address)
            ).to.eq(ethers.utils.parseEther(amountIn))

            //Do the exchange
            await escrowContract.connect(trader2).exchange(
                ethers.utils.parseEther(amountIn), token1ContractAddress
            )
            console.log('***Balances of trader2 After***')
            console.log(`Token1: ${ethers.utils.formatEther(
                await token1.balanceOf(trader2.address)
            )}`)
            console.log(`Token2: ${ethers.utils.formatEther(
                await token2.balanceOf(trader2.address)
            )}`)

            expect(await token1.balanceOf(trader2.address)).lte(await initToken1Balance)
            expect(await token2.balanceOf(trader2.address)).gte(await initToken2Balance)
        })
    })
})