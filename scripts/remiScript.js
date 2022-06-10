const { getNamedAccounts, ethers, waffle } = require("hardhat");
const Web3 = require("web3");
const compiledFactory = require("../artifacts/contracts/interfaces/IERC20.sol/IERC20.json");

const web3 = new Web3(Web3.givenProvider);

async function main() {
  const erc20Abi = "IComptroller";
  const contractAddress = "0xa85c9A5464955481c47247d58776BC086127c061";
  const provider = waffle.provider;
  const { deployer } = await getNamedAccounts();
  const signedDeployer = await ethers.getSigner(deployer);
  const signedDeployers = await ethers.getSigners();

  const iErc = await ethers.getContractAt(
    erc20Abi,
    // can fork the mainnet and run a local hh node pretending to be the mainnet
    contractAddress,
    signedDeployer
  );
  console.log(iErc);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
