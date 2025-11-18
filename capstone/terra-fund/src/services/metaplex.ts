import { Connection, PublicKey } from '@solana/web3.js'
import { Metaplex, walletAdapterIdentity } from '@metaplex-foundation/js'
import type { WalletAdapter } from '@solana/wallet-adapter-base'

export type DonationNftParams = {
    connection: Connection
    walletAdapter: WalletAdapter
    donor: PublicKey
    campaignId: number
    amountLamports: bigint
}

export type DonationNftResult = {
    mintAddress: string
}

export const getMetaplex = (connection: Connection, walletAdapter: WalletAdapter) => {
    return Metaplex.make(connection).use(walletAdapterIdentity(walletAdapter))
}

export const mintDonationNft = async (
    params: DonationNftParams
): Promise<DonationNftResult> => {
    const { connection, walletAdapter, donor, campaignId, amountLamports } = params
    const mx = getMetaplex(connection, walletAdapter)

    const name = `TerraFund Contribution #${campaignId}`
    const symbol = 'TERRA'

    // MVP: Use a very short immutable URI to satisfy on-chain URI length constraints
    // Replace this with a real uploaded metadata URI for production
    // Use a tiny data: URI to avoid external fetches and CORS/network issues in-browser
    // Keep it well under Token Metadata URI length limits
    const uri = 'data:application/json,%7B%7D'

    const createResult: any = await mx
        .nfts()
        .create({
            name,
            symbol,
            uri,
            sellerFeeBasisPoints: 0,
            tokenOwner: donor,
            isMutable: false,
        })

    const mintKey = createResult?.mintAddress || createResult?.nft?.address
    const mintStr = typeof mintKey?.toBase58 === 'function' ? mintKey.toBase58() : String(mintKey)
    return { mintAddress: mintStr }
}
