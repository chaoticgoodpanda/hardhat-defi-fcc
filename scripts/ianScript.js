const { BigNumber, ethers, provider } = require("ethers");
const BN = BigNumber.from;

const user = "0x222e90b3e08ac94c9b8eb3ee79a0a0d6a87536cb";
const borrow = "0x3B9128Ddd834cE06A60B0eC31CCfB11582d8ee18";
const abi = [
  " function borrowBalanceStored(address account) view returns (uint256)",
];

async function main() {
  const provider = new ethers.providers.getDefaultProvider(
    "https://polygon-mainnet.infura.io/v3/afac4b899a704db2b66e9d7cef3be714"
  );
  const borrowContract = new ethers.Contract(borrow, abi, provider);
  const borrowBalance = await borrowContract.borrowBalanceStored(user);
  console.log("borrowBalance: ", parseFloat(BN(borrowBalance)));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
