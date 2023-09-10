import "dotenv/config"
import base58 from "bs58"
import * as Web3 from "@solana/web3.js"
import * as token from "@solana/spl-token"
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token"

const connection = new Web3.Connection(Web3.clusterApiUrl("devnet"))
const publickey = new Web3.PublicKey("5Eh25gUPJDoNtTd3v6vpZ5VAwmjUUrxN28MpJDCfR2xA")
const decoded = base58.decode(process.env.PRIVATE_KEY as any)
const keyPair = Web3.Keypair.fromSecretKey(decoded)
const tokenMint = "26RenpAGAFfbnwghL8AAcyCpgtVXncNnpfeTvTpBBBto"

async function main(){
    const tokenAccount  = await token.createAccount(
        connection, // connection
        keyPair, // signer
        new Web3.PublicKey(tokenMint), // mint public key
        publickey, // owner of the token-account
    );
    console.log(tokenAccount.toBase58());
    // OUTPUT: tokenAccount D1ThQxUcscXuuotcEJBQJ3UH48J1eFeY8Ggc3biej8Zc
}

main();