import * as Web3 from '@solana/web3.js'
async function main() {
    const instruction = new Web3.TransactionInstruction({
        keys: [
            {
                pubkey: publicKey,
                isSigner: true,
                isWritable: false,
            }
        ],
        data: Buffer.alloc(20),
        ???,
    });

    const signature = await Web3.sendAndConfirmTransaction(
        ???,
        ???,
        ???
    )
    console.log('SIGNATURE', signature)
}

main()
.then(() => process.exit(0))
.catch(err => {
    console.error(err)
});