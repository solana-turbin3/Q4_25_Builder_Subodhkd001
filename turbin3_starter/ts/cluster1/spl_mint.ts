import { Keypair, PublicKey, Connection, Commitment } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import wallet from "../../turbin3-wallet.json"

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

const token_decimals = 1_000_000n;

// Mint address
const mint = new PublicKey("Hgxta7omUhPcZqznv9mfDkwYSKupzgkn1qXknpchXyMv");

(async () => {
    try {
        // Create an ATA
        const ata = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            keypair.publicKey,
            true,
            "confirmed",

        )
        console.log(`Your ata is: ${ata.address.toBase58()}`);

        // Mint to ATA
        const mintTx = await mintTo(
            connection,
            keypair,
            mint,
            ata.address,
            keypair,
            token_decimals * 100n
        )
        console.log(`Your mint txid: ${mintTx}`);
    } catch(error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()


// got this
// Your ata is: F6gN259geVJEf4Lc2mq3XZQxnwH6UWvNceg3sAsjGvbQ
// Your mint txid: 3fYL1BDjdXp2vxMYnkLz4VsvZzYnVFn3s1Ka584zC5igrXtTWfaU1n7km9z2ibALVcCxCAYKKHmpvTLHWNYZVayp