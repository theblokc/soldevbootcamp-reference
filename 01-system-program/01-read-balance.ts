// @solana/web3.js
import * as Web3 from '@solana/web3.js';

async function main() {
    const publicKey = new Web3.PublicKey('5Eh25gUPJDoNtTd3v6vpZ5VAwmjUUrxN28MpJDCfR2xA');
    const connection = new Web3.Connection(Web3.clusterApiUrl('devnet'))
    // const balance = await connection.getBalance(publicKey);
    // console.log('balance', balance);

    const accountInfo = await connection.getAccountInfo(publicKey)
    console.log('accountInfo', accountInfo)
}

main()