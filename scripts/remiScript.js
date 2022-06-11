const { getNamedAccounts, ethers, waffle } = require("hardhat");
const compiledFactory = require("../artifacts/contracts/interfaces/IERC20.sol/IERC20.json");

async function main() {
  const erc20Abi = "Comptroller";
  const contractAddress = "0x8849f1a0cB6b5D6076aB150546EddEe193754F1C";
  const { deployer } = await getNamedAccounts();
  const signedDeployer = await ethers.getSigner(deployer);

  const iErc = await ethers.getContractAt(
    erc20Abi,
    // can fork the mainnet and run a local hh node pretending to be the mainnet
    contractAddress,
    signedDeployer
  );
  // console.log(iErc);
  await getAccountLiquidity(iErc);
}

async function getAccountLiquidity(account) {
  const liquidity = await account.getAllMarkets();
  console.log(`The current liquidity is ${liquidity.toString()}`);
  return liquidity;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
