//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract Token is ERC20 {
    string private greeting;

    constructor () ERC20("Lottery Token", "LTN") {
        _mint(msg.sender, 10000 * 10 ** 18);
    }

}
