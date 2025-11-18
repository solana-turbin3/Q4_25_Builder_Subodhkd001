#!/bin/bash

# Script to manually fund test wallets
# Run this if you hit rate limits during testing

echo "🚀 Funding Test Wallets for Terra Fund"
echo "======================================"
echo ""

# Get the deployer/creator wallet address
CREATOR_KEY=$(solana-keygen pubkey ~/.config/solana/id.json 2>/dev/null)
if [ -z "$CREATOR_KEY" ]; then
    echo "❌ Could not find deployer keypair at ~/.config/solana/id.json"
    exit 1
fi

# Get the user/donor wallet address
if [ -f "user.json" ]; then
    DONOR_KEY=$(solana-keygen pubkey user.json 2>/dev/null)
else
    echo "⚠️  user.json not found. Run 'ts-node scripts/genuser.ts' first"
    DONOR_KEY="NOT_FOUND"
fi

echo "📋 Wallet Addresses:"
echo "   Creator/Deployer: $CREATOR_KEY"
echo "   Donor/User: $DONOR_KEY"
echo ""

# Check current balances
echo "💰 Current Balances:"
CREATOR_BALANCE=$(solana balance $CREATOR_KEY --url devnet 2>/dev/null | awk '{print $1}')
echo "   Creator: $CREATOR_BALANCE SOL"

if [ "$DONOR_KEY" != "NOT_FOUND" ]; then
    DONOR_BALANCE=$(solana balance $DONOR_KEY --url devnet 2>/dev/null | awk '{print $1}')
    echo "   Donor: $DONOR_BALANCE SOL"
fi
echo ""

echo "🎯 Airdropping SOL..."
echo ""

# Fund creator wallet
echo "1️⃣  Funding Creator wallet (need 2 SOL minimum)..."
solana airdrop 2 $CREATOR_KEY --url devnet
if [ $? -eq 0 ]; then
    echo "   ✅ Creator funded successfully"
else
    echo "   ❌ Creator funding failed (rate limit?)"
fi
sleep 2

# Fund donor wallet
if [ "$DONOR_KEY" != "NOT_FOUND" ]; then
    echo ""
    echo "2️⃣  Funding Donor wallet (need 3 SOL minimum)..."
    solana airdrop 2 $DONOR_KEY --url devnet
    if [ $? -eq 0 ]; then
        echo "   ✅ First airdrop successful"
        sleep 2
        solana airdrop 1 $DONOR_KEY --url devnet
        if [ $? -eq 0 ]; then
            echo "   ✅ Second airdrop successful"
        else
            echo "   ⚠️  Second airdrop failed (try again in a minute)"
        fi
    else
        echo "   ❌ Donor funding failed (rate limit?)"
    fi
fi

echo ""
echo "🏁 Final Balances:"
FINAL_CREATOR=$(solana balance $CREATOR_KEY --url devnet 2>/dev/null | awk '{print $1}')
echo "   Creator: $FINAL_CREATOR SOL"

if [ "$DONOR_KEY" != "NOT_FOUND" ]; then
    FINAL_DONOR=$(solana balance $DONOR_KEY --url devnet 2>/dev/null | awk '{print $1}')
    echo "   Donor: $FINAL_DONOR SOL"
fi

echo ""
echo "✅ Done! If you hit rate limits, try:"
echo "   • Wait 60 seconds and run this script again"
echo "   • Use web faucet: https://faucet.solana.com"
echo "   • Alternative: https://solfaucet.com"
echo ""