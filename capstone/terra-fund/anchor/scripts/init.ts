import 'dotenv/config'
import * as anchor from '@coral-xyz/anchor'
import { Terrafund } from '../target/types/terrafund'
import idl from '../target/idl/terrafund.json'
import fs from 'fs'
const { SystemProgram, PublicKey } = anchor.web3

const main = async (cluster: string) => {
  // Correct RPC URLs
  const clusterUrls: any = {
    'mainnet-beta': 'https://api.mainnet-beta.solana.com',
    'testnet': 'https://api.testnet.solana.com',
    'devnet': 'https://api.devnet.solana.com',
    'localhost': 'http://127.0.0.1:8899',
  }

  // FIX: Correct mapping
  const rpcUrl = clusterUrls[cluster]
  if (!rpcUrl) throw new Error(`Invalid cluster name: ${cluster}`)

  // Create RPC connection
  const connection = new anchor.web3.Connection(rpcUrl, 'confirmed')

  // FIX: Using your correct wallet
  const keypairPath = "/home/subodh/keypair_cohorts.json"
  const keypairData = JSON.parse(fs.readFileSync(keypairPath, 'utf-8'))
  const wallet = anchor.web3.Keypair.fromSecretKey(Uint8Array.from(keypairData))

  // Provider setup
  const provider = new anchor.AnchorProvider(
    connection,
    new anchor.Wallet(wallet),
    { commitment: 'confirmed' }
  )

  anchor.setProvider(provider)

  // Load program
  const program = new anchor.Program<Terrafund>(idl as any, provider)

  // PDA for program state
  const [programStatePda] = PublicKey.findProgramAddressSync(
    [Buffer.from('program_state')],
    program.programId
  )

  try {
    // Try fetching existing state
    const state = await program.account.programState.fetch(programStatePda)
    console.log(`Program already initialized. Initialized: ${state.initialized}`)
  } catch (error) {
    // Initialize if not created
    const tx = await program.methods
      .initialize()
      .accountsPartial({
        programState: programStatePda,
        deployer: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc()

    await connection.confirmTransaction(tx, 'finalized')
    console.log('Program initialized successfully:', tx)
  }
}

// Read cluster from env or default to localhost
const cluster: string = process.env.NEXT_PUBLIC_CLUSTER || 'localhost'

main(cluster).catch((error) => {
  console.error("Error:", error)
})
