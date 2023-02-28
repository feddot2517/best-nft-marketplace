const hre = require("hardhat");

async function main() {
    const NFT_COLLECTION_CONTRACT = await hre.ethers.getContractFactory("NFTCOL");
    const NFT_MARKETPLACE = await hre.ethers.getContractFactory("NFTMarketplace");

    const nftCollection = await NFT_COLLECTION_CONTRACT.deploy();
    await nftCollection.deployed();

    const marketPlace = await NFT_MARKETPLACE.deploy(nftCollection.address, ['0xb23617F1478f7Cf925a5a35De9cde20b0976526b'], '0xF3dC6626058bc2c728d9b5081eb931cD610fF9EB', '0x03a67EFfcA47D1BfbBA418e871Cf278c2E902e62')

    console.log("Example marketplace deployed to ", marketPlace.address);
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