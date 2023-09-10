import 'dotenv/config'
import * as Web3 from '@solana/web3.js';
import base58 from 'bs58'

async function main() {
    const decoded = base58.decode(process.env.PRIVATE_KEY as any)
    const keyPair = Web3.Keypair.fromSecretKey(decoded)
    console.log('publicKey', keyPair.publicKey)
    const publicKeyFrom = new Web3.PublicKey('5Eh25gUPJDoNtTd3v6vpZ5VAwmjUUrxN28MpJDCfR2xA');
    const publicKeyTo = new Web3.PublicKey('AA9V2fkKunvJ95FdCT7geqQhsESwMh9ufpTqzDRGn8sk');

    const instruction = Web3.SystemProgram.transfer({
        fromPubkey: publicKeyFrom,
        toPubkey: publicKeyTo,
        lamports: 1,
    });
    const transaction = new Web3.Transaction();
    transaction.add(instruction);

    const connection = new Web3.Connection(Web3.clusterApiUrl('devnet'))
    const txSignature = await Web3.sendAndConfirmTransaction(connection, transaction, [keyPair]);

    console.log('txHash', txSignature)
}

main();