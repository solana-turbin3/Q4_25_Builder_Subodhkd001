jest.setTimeout(60000)

import * as anchor from '@coral-xyz/anchor'
import { Terrafund } from '../target/types/terrafund'
import idl from '../target/idl/terrafund.json'
import fs from 'fs'
const { SystemProgram, PublicKey } = anchor.web3

/**
 * IMPORTANT NOTES:
 * 
 * 1. Withdrawal requires minimum 1 SOL due to rent requirements
 * 2. The smart contract appears to deduct rent/fees before recording donation amounts
 * 3. We donate 3 SOL to ensure at least 1 SOL is available for withdrawal after all fees
 * 4. Automatic airdrop is used to fund wallets before tests
 */

const toggleProvider = (user: 'deployer' | 'creator') => {
  let wallet: any
  if (user === 'creator') {
    const keypairData = JSON.parse(fs.readFileSync('user.json', 'utf-8'))
    wallet = anchor.web3.Keypair.fromSecretKey(Uint8Array.from(keypairData))
  } else {
    const keypairPath = `${process.env.HOME}/.config/solana/id.json`
    const keypairData = JSON.parse(fs.readFileSync(keypairPath, 'utf-8'))
    wallet = anchor.web3.Keypair.fromSecretKey(Uint8Array.from(keypairData))
  }

  const connection = new anchor.web3.Connection(
    'https://api.devnet.solana.com',
    'confirmed'
  )

  const provider = new anchor.AnchorProvider(
    connection,
    new anchor.Wallet(wallet),
    { commitment: 'confirmed' }
  )

  anchor.setProvider(provider)

  return provider
}

// Helper function to airdrop SOL to a wallet
const airdropSol = async (
  connection: anchor.web3.Connection,
  publicKey: anchor.web3.PublicKey,
  amount: number
) => {
  try {
    console.log(`💰 Requesting airdrop of ${amount} SOL to ${publicKey.toBase58()}...`)
    const signature = await connection.requestAirdrop(
      publicKey,
      amount * anchor.web3.LAMPORTS_PER_SOL
    )
    const latestBlockhash = await connection.getLatestBlockhash()
    await connection.confirmTransaction({
      signature,
      ...latestBlockhash,
    })
    console.log(`✅ Airdrop successful! Signature: ${signature}`)
    
    // Verify the new balance
    const balance = await connection.getBalance(publicKey)
    console.log(`   New balance: ${balance / anchor.web3.LAMPORTS_PER_SOL} SOL`)
    
    return signature
  } catch (error: any) {
    console.error('❌ Airdrop failed:', error.message)
    
    // Check if it's a rate limit error
    if (error.message.includes('429') || error.message.includes('rate limit') || error.message.includes('airdrop limit')) {
      console.log('⚠️  Rate limit reached. Please manually fund the wallet:')
      console.log(`   solana airdrop ${amount} ${publicKey.toBase58()} --url devnet`)
      console.log('   OR use: https://faucet.solana.com')
      console.log('\n   Continuing with current balance...\n')
      return null // Don't throw, just return null
    }
    throw error
  }
}

// Helper to ensure wallet has minimum balance
const ensureBalance = async (
  connection: anchor.web3.Connection,
  publicKey: anchor.web3.PublicKey,
  minBalance: number
) => {
  const balance = await connection.getBalance(publicKey)
  const balanceInSol = balance / anchor.web3.LAMPORTS_PER_SOL
  
  console.log(`Current balance: ${balanceInSol} SOL, Required: ${minBalance} SOL`)
  
  if (balanceInSol < minBalance) {
    const airdropAmount = Math.ceil(minBalance - balanceInSol + 1) // +1 for transaction fees
    const result = await airdropSol(connection, publicKey, airdropAmount)
    
    if (result === null) {
      // Airdrop failed due to rate limit
      const currentBalance = await connection.getBalance(publicKey)
      const currentBalanceInSol = currentBalance / anchor.web3.LAMPORTS_PER_SOL
      
      if (currentBalanceInSol < 0.1) {
        throw new Error(
          `Insufficient balance: ${currentBalanceInSol} SOL. ` +
          `Please manually airdrop at least ${minBalance} SOL to ${publicKey.toBase58()}`
        )
      } else {
        console.log(`⚠️  Continuing with lower balance: ${currentBalanceInSol} SOL`)
      }
    } else {
      // Wait a bit for the airdrop to be fully confirmed
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  } else {
    console.log('✅ Wallet has sufficient balance')
  }
}

describe('terrafund', () => {
  let provider = toggleProvider('creator')
  let program = new anchor.Program<Terrafund>(idl as any, provider)

  let CID: any, DONORS_COUNT: any, WITHDRAW_COUNT: any

  // Fund wallets before running tests
  beforeAll(async () => {
    console.log('\n🚀 Setting up test wallets...\n')
    
    const creatorProvider = toggleProvider('creator')
    const deployerProvider = toggleProvider('deployer')
    
    // Check balances
    const creatorBalance = await creatorProvider.connection.getBalance(creatorProvider.wallet.publicKey)
    const deployerBalance = await deployerProvider.connection.getBalance(deployerProvider.wallet.publicKey)
    
    const creatorBalanceInSol = creatorBalance / anchor.web3.LAMPORTS_PER_SOL
    const deployerBalanceInSol = deployerBalance / anchor.web3.LAMPORTS_PER_SOL
    
    console.log(`Creator balance: ${creatorBalanceInSol} SOL`)
    console.log(`Deployer balance: ${deployerBalanceInSol} SOL`)
    
    // Try to fund if needed, but don't fail if rate limited
    let needsManualFunding = false
    
    if (creatorBalanceInSol < 1) {
      console.log('\n⚠️  Creator wallet needs funding (minimum 1 SOL)...')
      try {
        await ensureBalance(creatorProvider.connection, creatorProvider.wallet.publicKey, 2)
      } catch (error: any) {
        if (error.message.includes('rate limit') || error.message.includes('429')) {
          needsManualFunding = true
          console.log('   Skipping due to rate limit...')
        }
      }
    }
    
    if (deployerBalanceInSol < 1.5) {
      console.log('\n⚠️  Deployer wallet needs funding (minimum 1.5 SOL for tests)...')
      try {
        await ensureBalance(deployerProvider.connection, deployerProvider.wallet.publicKey, 3)
      } catch (error: any) {
        if (error.message.includes('rate limit') || error.message.includes('429')) {
          needsManualFunding = true
          console.log('   Skipping due to rate limit...')
        }
      }
    }
    
    if (needsManualFunding) {
      console.log('\n⚠️  ⚠️  ⚠️  RATE LIMIT REACHED ⚠️  ⚠️  ⚠️')
      console.log('\n📝 Please manually fund wallets using ONE of these methods:')
      console.log('\n🔹 Method 1 - Command Line (run multiple times if needed):')
      console.log(`   solana airdrop 2 ${creatorProvider.wallet.publicKey.toBase58()} --url devnet`)
      console.log(`   solana airdrop 2 ${deployerProvider.wallet.publicKey.toBase58()} --url devnet`)
      
      console.log('\n🔹 Method 2 - Web Faucet:')
      console.log(`   Visit: https://faucet.solana.com`)
      console.log(`   Enter addresses:`)
      console.log(`   - Creator: ${creatorProvider.wallet.publicKey.toBase58()}`)
      console.log(`   - Deployer: ${deployerProvider.wallet.publicKey.toBase58()}`)
      
      console.log('\n🔹 Method 3 - Alternative Faucets:')
      console.log('   • https://solfaucet.com')
      console.log('   • https://faucet.quicknode.com/solana/devnet')
      
      console.log('\n⏳ After funding, wait 30-60 seconds and run tests again.\n')
    }
    
    // Final balance check
    const finalCreatorBalance = await creatorProvider.connection.getBalance(creatorProvider.wallet.publicKey)
    const finalDeployerBalance = await deployerProvider.connection.getBalance(deployerProvider.wallet.publicKey)
    
    console.log(`\n✅ Final balances:`)
    console.log(`   Creator: ${finalCreatorBalance / anchor.web3.LAMPORTS_PER_SOL} SOL`)
    console.log(`   Deployer: ${finalDeployerBalance / anchor.web3.LAMPORTS_PER_SOL} SOL\n`)
  })

  it('creates a campaign', async () => {
    provider = toggleProvider('creator')
    program = new anchor.Program<Terrafund>(idl as any, provider)
    const creator = provider.wallet

    const [programStatePda] = PublicKey.findProgramAddressSync(
      [Buffer.from('program_state')],
      program.programId
    )

    const state = await program.account.programState.fetch(programStatePda)
    CID = state.campaignCount.add(new anchor.BN(1))

    const [campaignPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('campaign'), CID.toArrayLike(Buffer, 'le', 8)],
      program.programId
    )

    const title = `Test Campaign Title #${CID.toString()}`
    const description = `Test Campaign description #${CID.toString()}`
    const image_url = `https://dummy_image_${CID.toString()}.png`
    const goal = new anchor.BN(25 * 1_000_000_000) // 25 SOL

    const tx = await program.methods
      .createCampaign(title, description, image_url, goal)
      .accountsPartial({
        programState: programStatePda,
        campaign: campaignPda,
        creator: creator.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc()

    console.log('Transaction Signature:', tx)

    const campaign = await program.account.campaign.fetch(campaignPda)
    console.log('Campaign:', campaign)
    DONORS_COUNT = campaign.donors
    WITHDRAW_COUNT = campaign.withdrawals
  })

  it('update a campaign', async () => {
    provider = toggleProvider('creator')
    program = new anchor.Program<Terrafund>(idl as any, provider)
    const creator = provider.wallet

    const [campaignPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('campaign'), CID.toArrayLike(Buffer, 'le', 8)],
      program.programId
    )

    const title = `Update Test Campaign Title #${CID.toString()}`
    const description = `Updated Test Campaign description #${CID.toString()}`
    const image_url = `https://dummy_image_${CID.toString()}.png`
    const goal = new anchor.BN(30 * 1_000_000_000) // 30 SOL

    const tx = await program.methods
      .updateCampaign(CID, title, description, image_url, goal)
      .accountsPartial({
        campaign: campaignPda,
        creator: creator.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc()

    console.log('Transaction Signature:', tx)

    const campaign = await program.account.campaign.fetch(campaignPda)
    console.log('Campaign:', campaign)
  })

  it('donate to campaign', async () => {
    provider = toggleProvider('deployer')
    program = new anchor.Program<Terrafund>(idl as any, provider)

    const donor = provider.wallet

    // Check current balance
    const currentBalance = await provider.connection.getBalance(donor.publicKey)
    const currentBalanceInSol = currentBalance / anchor.web3.LAMPORTS_PER_SOL
    console.log('Donor balance:', currentBalanceInSol, 'SOL')

    // Calculate how much we can donate
    // We need to keep 0.1 SOL for transaction fees
    const maxDonation = Math.floor((currentBalanceInSol - 0.2) * anchor.web3.LAMPORTS_PER_SOL)
    
    // We want to donate 3 SOL ideally, but work with what we have
    let donation_amount: anchor.BN
    
    if (currentBalanceInSol >= 3.5) {
      // Ideal case: donate 3 SOL
      donation_amount = new anchor.BN(3 * 1_000_000_000)
      console.log('✅ Sufficient balance - donating 3 SOL')
    } else if (currentBalanceInSol >= 1.5) {
      // We have at least 1.5 SOL, donate what we can minus buffer
      const donateAmount = Math.floor((currentBalanceInSol - 0.3) * 10) / 10 // Round down to 1 decimal
      donation_amount = new anchor.BN(donateAmount * 1_000_000_000)
      console.log(`⚠️  Lower balance - donating ${donateAmount} SOL (all available minus 0.3 SOL buffer)`)
    } else {
      throw new Error(
        `Insufficient balance for donation test. ` +
        `Current: ${currentBalanceInSol} SOL, Need at least: 1.5 SOL. ` +
        `Please manually fund: solana airdrop 2 ${donor.publicKey.toBase58()} --url devnet`
      )
    }

    const [campaignPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('campaign'), CID.toArrayLike(Buffer, 'le', 8)],
      program.programId
    )

    const [transactionPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('donor'),
        donor.publicKey.toBuffer(),
        CID.toArrayLike(Buffer, 'le', 8),
        DONORS_COUNT.add(new anchor.BN(1)).toArrayLike(Buffer, 'le', 8),
      ],
      program.programId
    )

    const donorBefore = await provider.connection.getBalance(donor.publicKey)
    const campaignBefore = await provider.connection.getBalance(campaignPda)

    const tx = await program.methods
      .donate(CID, donation_amount)
      .accountsPartial({
        campaign: campaignPda,
        transaction: transactionPda,
        donor: donor.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc()

    console.log('Transaction Signature:', tx)

    const donorAfter = await provider.connection.getBalance(donor.publicKey)
    const campaignAfter = await provider.connection.getBalance(campaignPda)
    const transaction = await program.account.transaction.fetch(transactionPda)

    console.log('Donation:', transaction)
    
    // Calculate actual amounts
    const donorSpent = donorBefore - donorAfter
    const campaignReceived = campaignAfter - campaignBefore
    
    console.log(`
      📊 Donation Summary:
      - Requested donation: ${donation_amount.toNumber() / anchor.web3.LAMPORTS_PER_SOL} SOL
      - Donor spent: ${donorSpent / anchor.web3.LAMPORTS_PER_SOL} SOL
      - Campaign received: ${campaignReceived / anchor.web3.LAMPORTS_PER_SOL} SOL
      - Transaction record shows: ${transaction.amount.toNumber() / anchor.web3.LAMPORTS_PER_SOL} SOL
      - Difference (fees/rent): ${(donorSpent - campaignReceived) / anchor.web3.LAMPORTS_PER_SOL} SOL
    `)

    console.log(`
      donor balance before: ${donorBefore},
      donor balance after: ${donorAfter}, 
    `)

    console.log(`
      campaign balance before: ${campaignBefore},
      campaign balance after: ${campaignAfter}, 
    `)

    // Update DONORS_COUNT for next test
    const campaign = await program.account.campaign.fetch(campaignPda)
    DONORS_COUNT = campaign.donors
  })

  it('withdraw from campaign', async () => {
    provider = toggleProvider('creator')
    program = new anchor.Program<Terrafund>(idl as any, provider)
    const creator = provider.wallet

    const [programStatePda] = PublicKey.findProgramAddressSync(
      [Buffer.from('program_state')],
      program.programId
    )

    const [campaignPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('campaign'), CID.toArrayLike(Buffer, 'le', 8)],
      program.programId
    )

    const [transactionPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('withdraw'),
        creator.publicKey.toBuffer(),
        CID.toArrayLike(Buffer, 'le', 8),
        WITHDRAW_COUNT.add(new anchor.BN(1)).toArrayLike(Buffer, 'le', 8),
      ],
      program.programId
    )

    const creatorBefore = await provider.connection.getBalance(
      creator.publicKey
    )
    const campaignBefore = await provider.connection.getBalance(campaignPda)

    const programState = await program.account.programState.fetch(
      programStatePda
    )
    const platformBefore = await provider.connection.getBalance(
      programState.platformAddress
    )

    // Check campaign balance before withdrawal
    const campaign = await program.account.campaign.fetch(campaignPda)
    console.log('Campaign balance:', campaign.balance.toString(), 'lamports')
    console.log('Campaign balance in SOL:', campaign.balance.toNumber() / anchor.web3.LAMPORTS_PER_SOL, 'SOL')
    console.log('Campaign amount raised:', campaign.amountRaised.toString(), 'lamports')
    console.log('Campaign amount raised in SOL:', campaign.amountRaised.toNumber() / anchor.web3.LAMPORTS_PER_SOL, 'SOL')

    // Get the actual SOL balance of the campaign PDA account
    const campaignPdaBalance = await provider.connection.getBalance(campaignPda)
    console.log('Campaign PDA account balance:', campaignPdaBalance, 'lamports')
    console.log('Campaign PDA account balance in SOL:', campaignPdaBalance / anchor.web3.LAMPORTS_PER_SOL, 'SOL')

    // Calculate available balance for withdrawal
    // The smart contract likely checks against campaign.balance field
    const availableBalance = campaign.balance
    console.log(`Available for withdrawal (from balance field): ${availableBalance.toNumber() / anchor.web3.LAMPORTS_PER_SOL} SOL`)
    
    // Also check the actual account balance minus rent
    const minRent = await provider.connection.getMinimumBalanceForRentExemption(
  program.account.campaign.size
)
    const withdrawableFromAccount = campaignPdaBalance - minRent
    console.log(`Withdrawable from account (minus rent): ${withdrawableFromAccount / anchor.web3.LAMPORTS_PER_SOL} SOL`)

    // Withdraw 1.5 SOL (more than the 1 SOL minimum required by contract)
    // The contract requires amount > 1 SOL to ensure enough remains for rent
    const withdrawal_amount = new anchor.BN(1.5 * 1_000_000_000)
    
    console.log(`\nAttempting to withdraw: ${withdrawal_amount.toNumber() / anchor.web3.LAMPORTS_PER_SOL} SOL`)
    console.log(`Campaign balance field: ${campaign.balance.toNumber() / anchor.web3.LAMPORTS_PER_SOL} SOL`)
    console.log(`Campaign balance >= withdrawal amount?: ${campaign.balance.gte(withdrawal_amount)}`)

    // Check if we have enough balance
    if (campaign.balance.lt(withdrawal_amount)) {
      throw new Error(
        `Insufficient campaign balance for withdrawal. ` +
        `Available: ${campaign.balance.toNumber() / anchor.web3.LAMPORTS_PER_SOL} SOL, ` +
        `Need: ${withdrawal_amount.toNumber() / anchor.web3.LAMPORTS_PER_SOL} SOL`
      )
    }

    const tx = await program.methods
      .withdraw(CID, withdrawal_amount)
      .accountsPartial({
        programState: programStatePda,
        campaign: campaignPda,
        transaction: transactionPda,
        creator: creator.publicKey,
        platformAddress: programState.platformAddress,
        systemProgram: SystemProgram.programId,
      })
      .rpc()

    console.log('Transaction Signature:', tx)

    const creatorAfter = await provider.connection.getBalance(creator.publicKey)
    const campaignAfter = await provider.connection.getBalance(campaignPda)
    const transaction = await program.account.transaction.fetch(transactionPda)

    const platformAfter = await provider.connection.getBalance(
      programState.platformAddress
    )

    console.log('Withdrawal:', transaction)

    console.log(`
      creator balance before: ${creatorBefore},
      creator balance after: ${creatorAfter}, 
    `)

    console.log(`
      platform balance before: ${platformBefore},
      platform balance after: ${platformAfter}, 
    `)

    console.log(`
      campaign balance before: ${campaignBefore},
      campaign balance after: ${campaignAfter}, 
    `)
  })

  it('updates platform fee', async () => {
    provider = toggleProvider('deployer')
    program = new anchor.Program<Terrafund>(idl as any, provider)
    const updater = provider.wallet

    const [programStatePda] = PublicKey.findProgramAddressSync(
      [Buffer.from('program_state')],
      program.programId
    )

    const stateBefore = await program.account.programState.fetch(
      programStatePda
    )
    console.log('state:', stateBefore)

    const tx = await program.methods
      .updatePlatformSettings(new anchor.BN(7))
      .accountsPartial({
        updater: updater.publicKey,
        programState: programStatePda,
      })
      .rpc()

    console.log('Transaction Signature:', tx)

    const stateAfter = await program.account.programState.fetch(programStatePda)
    console.log('state:', stateAfter)
  })

  // MOVED TO END: Delete should be last so other tests can use the campaign
  it('delete a campaign', async () => {
    provider = toggleProvider('creator')
    program = new anchor.Program<Terrafund>(idl as any, provider)
    const creator = provider.wallet

    const [campaignPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('campaign'), CID.toArrayLike(Buffer, 'le', 8)],
      program.programId
    )

    const tx = await program.methods
      .deleteCampaign(CID)
      .accountsPartial({
        campaign: campaignPda,
        creator: creator.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc()

    console.log('Transaction Signature:', tx)

    const campaign = await program.account.campaign.fetch(campaignPda)
    console.log('Campaign:', campaign)
  })
})