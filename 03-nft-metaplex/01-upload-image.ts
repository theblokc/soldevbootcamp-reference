import fs from 'fs'
import { toMetaplexFile } from '@metaplex-foundation/js'
import { createMetaplexInstance } from './metaplex';

const buffer = fs.readFileSync(__dirname + '/image.jpg')
const file = toMetaplexFile(buffer, "image.png");
const metaplex = createMetaplexInstance();

async function main() {
    const imageUrl = await metaplex.storage().upload(file);
    console.log('imageUrl', imageUrl);
    // https://arweave.net/ODic38o8btipC7XKZgjaz4h5VNswi1bT3sOwVLa8Tuc
}
main()
