require("@nomiclabs/hardhat-waffle");

const fs = require("fs");
const privateKey = fs.readFileSync(".secret").toString();
const projectId = "665f8607ae294ba7316333dc69a03866a8b8cc19";
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    solidity: "0.8.4",
    networks: {
        hardhat: {
            chainId: 1337
        },
        mumbai: {
            url: `https://rpc-mumbai.maticvigil.com/v1/${projectId}`,
            accounts: [privateKey]
        },
        mainnet: {
            url: `https://rpc-mainnet.maticvigil.com/v1/${projectId}`,
            accounts: [privateKey]
        }
    }
};
