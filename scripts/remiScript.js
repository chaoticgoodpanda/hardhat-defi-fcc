const { getNamedAccounts, ethers } = require("hardhat");
const { BigNumber, ethers: ethers2 } = require("ethers");

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
  // console.log(await getSuppliedValue());
}

async function getSuppliedValue() {
  const erc20Abi = "Comptroller";
  const { deployer } = await getNamedAccounts();
  const signedDeployer = await ethers.getSigner(deployer);
  const supply = "0xEBb865Bf286e6eA8aBf5ac97e1b56A76530F3fBe";

  const supplyBalanceContract = await ethers.getContractAt(
    erc20Abi,
    // can fork the mainnet and run a local hh node pretending to be the mainnet
    supply,
    signedDeployer
  );

  const provider = new ethers2.providers.getDefaultProvider(
    "https://polygon-mainnet.infura.io/v3/afac4b899a704db2b66e9d7cef3be714"
  );

  const abi = [
    " function borrowBalanceStored(address account) view returns (uint256)",
  ];
  const user = "0x222e90b3e08ac94c9b8eb3ee79a0a0d6a87536cb";
  const supplyContract = new ethers2.Contract(supply, abi, provider);
  const supplyBalance = await supplyBalanceContract.balanceOf(user);
  console.log(`Your balance is ${supplyBalance}`);

  const exchangeRateStored = await supplyContract.exchangeRateStored();
  console.log(`Your exchange rate stored is ${exchangeRateStored}`);
}

async function getBorrowValue(contract, signedDeployer) {
  const ioTokenAbi = "IOToken";
  // const contractToken = await ethers.getContractAt(
  //   ioTokenAbi,
  //   contract.address,
  //   signedDeployer
  // );
  const provider = new ethers2.providers.getDefaultProvider(
    "https://polygon-mainnet.infura.io/v3/afac4b899a704db2b66e9d7cef3be714"
  );

  const abi = [
    " function borrowBalanceStored(address account) view returns (uint256)",
  ];
  const borrow = contract.address;
  const user = "0x222e90b3e08ac94c9b8eb3ee79a0a0d6a87536cb";
  const borrowContract = new ethers2.Contract(borrow, abi, provider);
  const borrowBalance = await borrowContract.borrowBalanceStored(user);

  // const exchangeRateStored = await contractToken.exchangeRateStored();
  // console.log(`Your exchange rate stored is ${exchangeRateStored}`);

  const oracleAccount = await getOracle(signedDeployer);

  // const borrowBalance = await contractToken.borrowBalanceStored(
  //   contractToken.address
  // );

  const BN = BigNumber.from;
  console.log(`Your borrow balance is ${parseFloat(BN(borrowBalance))}`);
  const oracleUnderlyingPrice = await oracleAccount.getUnderlyingPrice(borrow);
  console.log(
    `Your oracle underlying price is ${parseFloat(BN(oracleUnderlyingPrice))}`
  );
  const marketBorrow =
    (borrowBalance * oracleUnderlyingPrice) / Math.pow(1, Math.pow(10, 18));

  console.log(marketBorrow);

  console.log(`Your total borrowed is ${marketBorrow.toString()}`);
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
