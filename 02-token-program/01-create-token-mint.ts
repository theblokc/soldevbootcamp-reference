import "dotenv/config"
import base58 from "bs58"
import * as Web3 from "@solana/web3.js"
import * as token from "@solana/spl-token"

const connection = new Web3.Connection(Web3.clusterApiUrl("devnet"))

const publickey = new Web3.PublicKey("5Eh25gUPJDoNtTd3v6vpZ5VAwmjUUrxN28MpJDCfR2xA")
const decoded = base58.decode(process.env.PRIVATE_KEY as any)
const keyPair = Web3.Keypair.fromSecretKey(decoded)

async function main(){
    const tokenMint = await token.createMint(
        connection,
        keyPair,
        publickey,
        publickey,
        9
    )
    console.log(tokenMint.toBase58());

    // OUTPUT: tokenMint 26RenpAGAFfbnwghL8AAcyCpgtVXncNnpfeTvTpBBBto
}

main();