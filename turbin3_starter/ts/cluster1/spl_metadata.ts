import wallet from "../../turbin3-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createMetadataAccountV3,
  CreateMetadataAccountV3InstructionAccounts,
  CreateMetadataAccountV3InstructionArgs,
  DataV2Args,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  createSignerFromKeypair,
  signerIdentity,
  publicKey,
} from "@metaplex-foundation/umi";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

// Define our Mint address
const mint = publicKey("Hgxta7omUhPcZqznv9mfDkwYSKupzgkn1qXknpchXyMv");

// Create a UMI connection
const umi = createUmi("https://api.devnet.solana.com");
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

(async () => {
  try {
    // Start here
    let accounts: CreateMetadataAccountV3InstructionAccounts = {
      mint,
      mintAuthority: signer,
    };

    let data: DataV2Args = {
      name: "My NFT",  
      symbol: "MNFT",
      uri: "https://example.com/my-nft-metadata.json", // Replace with your metadata URI
      sellerFeeBasisPoints: 500, // Replace with your desired fee basis points
      creators: null, // Replace with your desired creators (if any)
      collection: null, // Replace with your desired collection (if any)
      uses: null, // Replace with your desired uses (if any)

    }

    let args: CreateMetadataAccountV3InstructionArgs = {
        data: data,
        isMutable: true,
        collectionDetails:null,
    }

    let tx = createMetadataAccountV3(
        umi,
        {
            ...accounts,
            ...args
        }
    )

    let result = await tx.sendAndConfirm(umi);
    console.log(bs58.encode(result.signature));
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();

// we successfully attached the metadata to the token
// 4upYqhLYMVZGjGAjJjRqDMnQqEfjMrfYkG7SMzLoz9s1VYeh5JCPsUYXmSDgLu37LkbGiCK5FHRa13FAUcYwkCHf