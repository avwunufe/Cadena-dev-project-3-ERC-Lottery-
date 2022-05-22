//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";

contract Lottery {
    uint256 entryFee;
    uint256 seed;
    address owner;
    mapping(address => uint256) public lastEntry;

    IERC20 token;

    constructor(address tokenAddress) {
        owner = msg.sender;
        token = IERC20(tokenAddress);
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function setEntryFee(uint256 fee) public {
        require(msg.sender == owner, "Nice try, only owner can set fee ;)");
        entryFee = fee;
    }

    function getOwner() public view returns(address) {
        return owner;
    }

    function getBalance() public view returns(uint256) {
        return token.balanceOf(msg.sender);
    }

    function enterLottery() public payable {
        require(lastEntry[msg.sender] + 30 seconds < block.timestamp, "Must wait 30 seconds before attempting lottery. :(");
        require(token.balanceOf(address(this)) >= 100, "Ooops, lottery over, all the money has been won! :)");
        require(msg.value >= entryFee, "invalid entry amount, raise the stakes!! ;)");
        lastEntry[msg.sender] = block.timestamp;
        seed = (block.difficulty + block.timestamp + seed) % 100;
        if (seed <= 50) {
            uint256 prizeAmount = 100 * (10 ** 18);
            require(
                token.transfer(msg.sender, prizeAmount),
                "Failed, unable to pay"
            );
        }
    }
}
    