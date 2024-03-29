const hre = require("hardhat");

async function main() {
    const NFTMarket = await hre.ethers.getContractFactory("NFTMarket");
    const market = await NFTMarket.deploy();
    await market.deployed()
    console.log("NFT Market deployed to:", market.address)


    const NFT = await hre.ethers.getContractFactory("NFT");
    const nft = await NFT.deploy(market.address);
    await nft.deployed();
    console.log("NFT deployed to:", nft.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
