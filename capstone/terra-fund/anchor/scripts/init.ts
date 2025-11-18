import 'dotenv/config'
import * as anchor from '@coral-xyz/anchor'
import { Terrafund } from '../target/types/terrafund'
import idl from '../target/idl/terrafund.json'
import fs from 'fs'
const { SystemProgram, PublicKey } = anchor.web3

const getClusterURL = (cluster: string): string => {
  switch (cluster.toLowerCase()) {
    case 'devnet':
      return 'https://api.devnet.solana.com'
    case 'mainnet':
    case 'mainnet-beta':
      return 'https://api.mainnet-beta.solana.com'
    case 'localhost':
    case 'localnet':
      return 'http://127.0.0.1:8899'
    default:
      return 'http://127.0.0.1:8899'
  }
}

const main = async (cluster: string) => {
  console.log('🚀 Starting initialization...')
  console.log('Cluster:', cluster)
  
  const clusterURL = getClusterURL(cluster)
  console.log('Cluster URL:', clusterURL)

  // Creates a connection to the cluster
  const connection = new anchor.web3.Connection(clusterURL, 'confirmed')

  // Test connection
  try {
    const version = await connection.getVersion()
    console.log('✅ Connected to Solana cluster, version:', version['solana-core'])
  } catch (error) {
    console.error('❌ Failed to connect to cluster:', error)
    throw new Error('Cannot connect to Solana cluster. Check your internet connection and cluster URL.')
  }

  // Load the wallet from the deployer's keypair file
  const keypairPath = `${process.env.HOME}/.config/solana/id.json`
  console.log('Loading wallet from:', keypairPath)
  
  if (!fs.existsSync(keypairPath)) {
    throw new Error(`Keypair file not found at ${keypairPath}`)
  }

  const keypairData = JSON.parse(fs.readFileSync(keypairPath, 'utf-8'))
  const wallet = anchor.web3.Keypair.fromSecretKey(Uint8Array.from(keypairData))
  console.log('Wallet public key:', wallet.publicKey.toBase58())

  // Check wallet balance
  const balance = await connection.getBalance(wallet.publicKey)
  console.log('Wallet balance:', balance / anchor.web3.LAMPORTS_PER_SOL, 'SOL')
  
  if (balance === 0) {
    console.warn('⚠️  Wallet has 0 SOL. You may need to airdrop:')
    console.warn(`   solana airdrop 2 ${wallet.publicKey.toBase58()} --url ${cluster}`)
  }

  // Create a provider
  const provider = new anchor.AnchorProvider(
    connection,
    new anchor.Wallet(wallet),
    {
      commitment: 'confirmed',
    }
  )

  anchor.setProvider(provider)

  // Load the program
  const program = new anchor.Program<Terrafund>(idl as any, provider)
  console.log('Program ID:', program.programId.toBase58())

  const [programStatePda] = PublicKey.findProgramAddressSync(
    [Buffer.from('program_state')],
    program.programId
  )
  console.log('Program State PDA:', programStatePda.toBase58())

  try {
    const state = await program.account.programState.fetch(programStatePda)
    console.log('✅ Program already initialized')
    console.log('   Status:', state.initialized)
    console.log('   Campaign Count:', state.campaignCount.toString())
    console.log('   Platform Fee:', state.platformFee.toString())
  } catch (error) {
    console.log('Program not yet initialized, initializing now...')
    
    try {
      const tx = await program.methods
        .initialize()
        .accountsPartial({
          programState: programStatePda,
          deployer: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc()

      console.log('Transaction sent:', tx)
      await connection.confirmTransaction(tx, 'finalized')
      console.log('✅ Program initialized successfully!')
      console.log('   Transaction:', tx)
      console.log(`   Explorer: https://explorer.solana.com/tx/${tx}?cluster=${cluster}`)
    } catch (initError: any) {
      console.error('❌ Initialization failed:', initError)
      if (initError.logs) {
        console.error('Program logs:')
        initError.logs.forEach((log: string) => console.error('  ', log))
      }
      throw initError
    }
  }
}

const cluster: string = process.env.NEXT_PUBLIC_CLUSTER || 'devnet'
main(cluster).catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})