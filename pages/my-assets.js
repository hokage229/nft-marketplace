import {ethers} from 'ethers'
import {useEffect, useState} from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'

import {nftAddress, nftMarketAddress} from '../config'
import NFT from "../artifacts/contracts/NFT.sol/NFT.json"
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json"

export default function MyAssets() {
    const [nfts, setNfts] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')

    useEffect(() => {
        loadNFTs()
    }, [])

    async function loadNFTs() {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()


        const marketContract = new ethers.Contract(nftMarketAddress, Market.abi, signer)
        const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider)
        const data = await marketContract.fetchMyNFTs()

        const items = await Promise.all(data.map(async i => {
            const tokenURI = await tokenContract.tokenURI(i.tokenId)
            const meta = await axios.get(tokenURI)
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            return {
                price,
                tokenId: i.tokenId.toString(),
                seller: i.seller,
                owner: i.owner,
                image: meta.data.image,
                name: meta.data.name,
                description: meta.data.description
            }
        }))
        setNfts(items)
        setLoadingState("loaded")
    }

    if (loadingState === 'loaded' && !nfts.length) return (
        <h1 className="py-10 px-20 text-3xl">No assets owned</h1>
    )

    return (
        <div className="flex justify-center">
            <div className="p-4">
                <div className="grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                    {
                        nfts.map((nft, i) => (
                            <div key={i} className="border shadow rounded-xl overflow-hidden">
                                <img src={nft.image} alt="" className="rounded"/>
                                <div className="p-4 bg-black">
                                    <p className="text-2xl font-bold text-white">Price - {nft.price} Matic</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )

}