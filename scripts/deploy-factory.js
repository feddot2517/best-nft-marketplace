const hre = require("hardhat");

async function main() {
    const NFT_MARKETPLACE_FACTORY = await hre.ethers.getContractFactory("Factory");

    const nftMarketplaceFactory = await NFT_MARKETPLACE_FACTORY.deploy();
    await nftMarketplaceFactory.deployed();

    console.log('NFT marketplace factory deployed to ', nftMarketplaceFactory.address)
}
/*
  const ERC20UpgradableV1 = await ethers.getContractFactory(
    "ERC20UpgradableV1"
  );
  console.log("Deploying ERC20UpgradableV1...");
  const contract = await upgrades.deployProxy(ERC20UpgradableV1, [], {
    initializer: "initialize",
    kind: "transparent",
  });
  await contract.deployed();
  console.log("ERC20UpgradableV1 deployed to:", contract.address);
 */
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});