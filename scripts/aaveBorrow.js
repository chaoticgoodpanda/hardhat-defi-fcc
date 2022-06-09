const { getWeth } = require("../scripts/getWeth");
const { getNamedAccounts, ethers } = require("hardhat");

async function main() {
  // the protocol treats everything as an ERC20 token
  await getWeth();
  const { deployer } = await getNamedAccounts();
  const signedDeployer = await ethers.getSigner(deployer);
  const signedDeployers = await ethers.getSigners();

  // get abi, address from AAVE protocol
  // Lending pool address provider: 0xb53c1a33016b2dc2ff3653530bff1848a515c8c5
  const lendingPool = await getLendingPool(signedDeployer);
  console.log(`Lending pool address ${lendingPool.address}`);
}

async function getLendingPool(account) {
  const lendingPoolAddressesProvider = await ethers.getContractAt(
    "ILendingPoolAddressesProvider",
    "0xb53c1a33016b2dc2ff3653530bff1848a515c8c5",
    account
  );
  const lendingPoolAddress =
    await lendingPoolAddressesProvider.getLendingPool();
  const lendingPool = await ethers.getContractAt(
    "ILendingPool",
    lendingPoolAddress,
    account
  );
  return lendingPool;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
