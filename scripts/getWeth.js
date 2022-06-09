const { getNamedAccounts, ethers } = require("hardhat");

const AMOUNT = ethers.utils.parseEther("0.02");

async function getWeth() {
  const { deployer } = await getNamedAccounts();
  // call the "deposit" function on the weth contract
  // abi, contract address
  // weth mainnet contract address: 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
  const signer = await ethers.getSigner(deployer);
  const iWeth = await ethers.getContractAt(
    "IWeth",
    // can fork the mainnet and run a local hh node pretending to be the mainnet
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    signer
  );

  // deposit 0.02 ETH
  const tx = await iWeth.deposit({ value: AMOUNT });
  await tx.wait(1);
  const wethBalance = await iWeth.balanceOf(deployer);
  console.log(`Got ${wethBalance.toString()} WETH`);
}

module.exports = { getWeth };
