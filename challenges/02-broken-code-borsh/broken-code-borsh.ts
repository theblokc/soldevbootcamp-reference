import * as Web3 from '@solana/web3.js'
async function main() {
    const movie = new Movie('The Matrix', 5, 'A movie about the matrix')
    const instruction = new Web3.TransactionInstruction({
        keys: [
            {
                pubkey: publicKey,
                isSigner: true,
                isWritable: false,
            },
            {
                pubkey: Web3.SystemProgram.programId,
                isSigner: false,
                isWritable: false
            }
        ],
        data: movie.serialize(),
        ???
    })

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
})