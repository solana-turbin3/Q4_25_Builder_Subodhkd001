import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import wallet from "../../turbin3-wallet.json"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("Hgxta7omUhPcZqznv9mfDkwYSKupzgkn1qXknpchXyMv");

// Recipient address
const to = new PublicKey("8X7nUC3WcZDuVucqRJHHXvWqHjs9eNJ2djb3fR9kNZJ");


(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it
        const ata_sender = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            keypair.publicKey
        );
        console.log(`Sender ATA: ${ata_sender.address.toBase58()}`);

        // Get the token account of the toWallet address, and if it does not exist, create it
        const ata_reciever = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            to
        );
        console.log(`Reciever ATA: ${ata_reciever.address.toBase58()}`);

        // Transfer the new token to the "toTokenAccount" we just created
        const tx = await transfer(
            connection,
            keypair,
            ata_sender.address,
            ata_reciever.address,
            keypair.publicKey,
            1e6
        );
        console.log(`Transfer tx: https://explorer.solana.com/tx/${tx}?cluster=devnet`);
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();