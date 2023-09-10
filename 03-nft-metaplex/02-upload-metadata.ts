import { createMetaplexInstance  } from './metaplex'
async function main() {
    const metaplex = createMetaplexInstance()
    const metadata = {
        name: 'Solana Developers Bootcamp by The BLOKC',
        symbol: 'SDBC',
        image: 'https://arweave.net/ODic38o8btipC7XKZgjaz4h5VNswi1bT3sOwVLa8Tuc',
        attributes: [
            {
                trait_type: 'batch',
                value: '2'
            },
            {
                trait_type: 'date',
                value: 'July 29, 2023'
            }
        ]
    }
    const result = await metaplex.nfts().uploadMetadata(metadata)
    console.log('result', result)
    console.log('uri', result.uri)
    // https://arweave.net/E1DYxGOLqqZfE-hKGmDcJEjfJRJrSNIRXu4PSNaPqHo
}

main()