import * as anchor from '@coral-xyz/anchor'
import fs from 'fs'

const DEVNET_URL = 'https://api.devnet.solana.com'

async function airdrop(
  connection: anchor.web3.Connection,
  publicKey: anchor.web3.PublicKey,
  amount: number,
  label: string
) {
  console.log(`💰 Requesting ${amount} SOL for ${label}...`)
  try {
    const signature = await connection.requestAirdrop(
      publicKey,
      amount * anchor.web3.LAMPORTS_PER_SOL
    )
    const latestBlockhash = await connection.getLatestBlockhash()
    await connection.confirmTransaction({
      signature,
      ...latestBlockhash,
    })
    console.log(`   ✅ Success! Signature: ${signature}`)
    return true
  } catch (error: any) {
    if (error.message.includes('429') || error.message.includes('rate limit')) {
      console.log(`   ❌ Rate limit reached for ${label}`)
    } else {
      console.log(`   ❌ Failed: ${error.message}`)
    }
    return false
  }
}

async function main() {
  console.log('🚀 Funding Test Wallets for Terra Fund')
  console.log('======================================\n')

  const connection = new anchor.web3.Connection(DEVNET_URL, 'confirmed')

  // Load creator/deployer wallet
  const creatorKeypairPath = `${process.env.HOME}/.config/solana/id.json`
  if (!fs.existsSync(creatorKeypairPath)) {
    console.error(`❌ Creator keypair not found at ${creatorKeypairPath}`)
    process.exit(1)
  }
  const creatorData = JSON.parse(fs.readFileSync(creatorKeypairPath, 'utf-8'))
  const creatorKeypair = anchor.web3.Keypair.fromSecretKey(
    Uint8Array.from(creatorData)
  )

  // Load donor/user wallet
  let donorKeypair: anchor.web3.Keypair | null = null
  if (fs.existsSync('user.json')) {
    const donorData = JSON.parse(fs.readFileSync('user.json', 'utf-8'))
    donorKeypair = anchor.web3.Keypair.fromSecretKey(Uint8Array.from(donorData))
  } else {
    console.log('⚠️  user.json not found. Run genuser.ts first to create donor wallet\n')
  }

  console.log('📋 Wallet Addresses:')
  console.log(`   Creator/Deployer: ${creatorKeypair.publicKey.toBase58()}`)
  if (donorKeypair) {
    console.log(`   Donor/User: ${donorKeypair.publicKey.toBase58()}`)
  }
  console.log()

  // Check current balances
  console.log('💰 Current Balances:')
  const creatorBalance = await connection.getBalance(creatorKeypair.publicKey)
  console.log(
    `   Creator: ${creatorBalance / anchor.web3.LAMPORTS_PER_SOL} SOL`
  )
  if (donorKeypair) {
    const donorBalance = await connection.getBalance(donorKeypair.publicKey)
    console.log(`   Donor: ${donorBalance / anchor.web3.LAMPORTS_PER_SOL} SOL`)
  }
  console.log()

  console.log('🎯 Requesting Airdrops...\n')

  // Fund creator (needs 2 SOL)
  console.log('1️⃣  Funding Creator wallet (minimum 2 SOL needed)...')
  await airdrop(connection, creatorKeypair.publicKey, 2, 'Creator')
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Fund donor (needs 3 SOL)
  if (donorKeypair) {
    console.log('\n2️⃣  Funding Donor wallet (minimum 3 SOL needed)...')
    const success1 = await airdrop(connection, donorKeypair.publicKey, 2, 'Donor')
    await new Promise((resolve) => setTimeout(resolve, 2000))

    if (success1) {
      await airdrop(connection, donorKeypair.publicKey, 1, 'Donor (2nd)')
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
  }

  // Final balances
  console.log('\n🏁 Final Balances:')
  const finalCreatorBalance = await connection.getBalance(
    creatorKeypair.publicKey
  )
  console.log(
    `   Creator: ${finalCreatorBalance / anchor.web3.LAMPORTS_PER_SOL} SOL`
  )
  if (donorKeypair) {
    const finalDonorBalance = await connection.getBalance(donorKeypair.publicKey)
    console.log(
      `   Donor: ${finalDonorBalance / anchor.web3.LAMPORTS_PER_SOL} SOL`
    )
  }

  console.log('\n✅ Done! If you hit rate limits, try:')
  console.log('   • Wait 60 seconds and run this script again')
  console.log('   • Use web faucet: https://faucet.solana.com')
  console.log('   • Alternative faucets:')
  console.log('     - https://solfaucet.com')
  console.log('     - https://faucet.quicknode.com/solana/devnet')
  console.log()
}

main().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})