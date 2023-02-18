//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import './Token1.sol';
import './Token2.sol';
import '@openzeppelin/contracts/utils/Address.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';

contract Escrow is ReentrancyGuard{
    Token1 public token1;
    Token2 public token2;
    address public owner;

    mapping(address => uint256) public amountIn;
    mapping(address => uint256) public amountOut;
    mapping(address => mapping(address => uint256)) public balanceOfAddress;

    constructor(Token1 _token1, Token2 _token2) {
        owner = msg.sender;
        token1 = _token1;
        token2 = _token2;
    }

    // Check the Balance of Token1 contained in the smart contract
    function checkBalToken1() public view returns (uint256) {
        uint256 balToken1 = token1.balanceOf(address(this));
        return balToken1;
    }

    // Check the Balance of Token2 contained in the smart contract
    function checkBalToken2() public view returns (uint256) {
        uint256 balToken2 = token2.balanceOf(address(this));
        return balToken2;
    }

    // Check the particular token and instantly exchange it
    function exchange(
        uint256 _amountIn, address _tokenType
    ) public payable nonReentrant{
        
        if (_tokenType == address(token1)) {
            token1.transferFrom(msg.sender, address(this), _amountIn);
            uint256 _amountOut = _amountIn / 2;
            token2.transfer(payable(msg.sender), _amountOut);
        }
        if (_tokenType == address(token2)) {
            token2.transferFrom(msg.sender, address(this), _amountIn);
            uint256 _amountOut = _amountIn * 2;
            token1.transfer(payable(msg.sender), _amountOut);
        } else {
            console.log('This token is not available for exchange');
        }
    }

    receive() external payable {

    }
}