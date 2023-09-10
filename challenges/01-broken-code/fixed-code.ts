import 'dotenv/config'
import * as Web3 from '@solana/web3.js'
import { sendAndConfirmTransaction } from '@solana/web3.js'
import base58 from 'bs58'
async function main() {
    const decoded = base58.decode(process.env.PRIVATE_KEY as any)
    const keyPair = Web3.Keypair.fromSecretKey(decoded)
    const signer = keyPair
    const transaction = new Web3.Transaction()
    const publicKey = new Web3.PublicKey('5Eh25gUPJDoNtTd3v6vpZ5VAwmjUUrxN28MpJDCfR2xA')
    const instruction = new Web3.TransactionInstruction({
        keys: [
            {
                pubkey: publicKey,
                isSigner: true,
                isWritable: false,
            }
        ],
        data: Buffer.alloc(20),
        // from local: E94ZmCWodnZQ1g1kV6c7NHZ2yJHp2MSfMJrDqkn6zhm2
        // from codespace: 52bSg3CgGpC7ufWckpmXhM8Ew9ek8GBaps3YMfeXceg1
        programId: new Web3.PublicKey("52bSg3CgGpC7ufWckpmXhM8Ew9ek8GBaps3YMfeXceg1")
    })
    transaction.add(instruction);
    const connection = new Web3.Connection(Web3.clusterApiUrl('devnet'))

    const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [signer]
    )
    console.log('SIGNATURE', signature)
}

main()
    .then(() => process.exit(0))
    .catch(err => {
        console.error(err)
    })