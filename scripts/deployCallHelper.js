const hre = require("hardhat");

async function main() {
  const CALL_HELPER = await hre.ethers.getContractFactory("CallHelper");

  const callHelper = await CALL_HELPER.deploy();
  await callHelper.deployed();

  console.log("CALL_HELPER deployed to ", callHelper.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
