const hre = require("hardhat");

async function main() {
  // We get the contract to deploy
  const Token = await hre.ethers.getContractFactory("Token");
  const Lottery = await hre.ethers.getContractFactory("Lottery");
  const token = await Token.deploy();
  await token.deployed();
  const lottery = await Lottery.deploy(token.address);
  await lottery.deployed();
  const txn = await token.transfer(lottery.address, ethers.utils.parseEther("10000"));
  await txn.wait();

  console.log("Token deployed to:", token.address);
  console.log("Lottery deployed to:", lottery.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
