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
  //retrieve all the markets
  const allMarkets = await getAllMarkets(iErc);

  const ierc20 = "IERC20";

  const iterator = allMarkets.values();

  for (const value of iterator) {
    const marketAddress = value.toString();
    const marketContract = await ethers.getContractAt(
      ierc20,
      marketAddress,
      signedDeployer
    );
    const balance = await getBalance(marketContract);
    console.log(await getBorrowValue(marketContract, signedDeployer));
  }
}

async function getBorrowValue(contract, signedDeployer) {
  const ioTokenAbi = "IOToken";
  const contractToken = await ethers.getContractAt(
    ioTokenAbi,
    contract.address,
    signedDeployer
  );

  const exchangeRateStored = await contractToken.exchangeRateStored();

  const oracleAccount = await getOracle(signedDeployer);

  const borrowBalance = await contractToken.borrowBalanceStored(
    contractToken.address
  );
  console.log(`Your borrow balance is ${borrowBalance.toNumber()}`);
  const oracleUnderlyingPrice = await oracleAccount.getUnderlyingPrice(
    contractToken.address
  );
  console.log(parseInt(borrowBalance.toString()));
  console.log(parseInt(oracleUnderlyingPrice.toString()));
  const marketBorrow =
    parseInt(oracleUnderlyingPrice.toString()) / Math.pow(1, 18);

  console.log(`Your sum position is ${marketBorrow.toString()}`);
}

async function getOracleUnderlyingPrice(oracle, oToken) {
  const underlyingPrice = await oracle.getUnderlyingPrice(oToken.address);
  return underlyingPrice;
}

async function getOracle(signer) {
  const oracleAddress = "0x1c312b14c129EabC4796b0165A2c470b659E5f01";
  const oracleAbi = "OvixChainlinkOracleV2";

  const oracle = await ethers.getContractAt(oracleAbi, oracleAddress, signer);
  console.log(`The oracle address is ${oracle.address}`);
  return oracle;
}

async function getBalance(account) {
  const balance = await account.balanceOf(account.address);
  console.log(`Balance for ${account.address} ${balance}`);
  return balance;
}

async function getAllMarkets(account) {
  const markets = await account.getAllMarkets();
  console.log(`The current markets are ${markets.toString()}`);
  return markets;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
