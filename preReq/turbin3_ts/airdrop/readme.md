# Turbin3 Typescript Prerequisites Assignment

This project contains the Typescript implementation of the Turbin3 enrollment prerequisites.

## Setup

### Clone the Repository

```
git clone https://github.com/Subodhkd001/turbin3_prereq.git
cd turbin3_prereq.git/airdrop
```

### Install Dependencies

```
yarn
```

### Project Structure
airdrop/
├── clients
├── programs/
│   └── Turbin3_prereq.ts   # IDL definitions
├── scripts
    └── generate-client.ts  # generate client
├── keygen.ts               # Keypair generation script
├── airdrop.ts              # Devnet token airdrop script
├── transfer.ts             # SOL transfer script
├── drain.ts
├── enroll.ts               # Turbin3 enrollment interaction
├── dev-wallet.json         # Development wallet (auto-generated)
├── Turbin3-wallet.json     # Main wallet for enrollment
└── package.json


## Transaction Results - 

Solana turbine wallet - 5DKAQEs3NbhCE3CJwvhCY2MADiNQm7BxxKC4BmtrnMjw

### Generating a keypair
Generated wallet address: EyBJ9VwA6z4MVdzr3VWBj8WQ9ebp7BByZD5p3nJ2cKSC


### Claim airdrop for that dev wallet
```
Your Solana wallet address: EyBJ9VwA6z4MVdzr3VWBj8WQ9ebp7BByZD5p3nJ2cKSC
Success! Check out your TX here: 
https://explorer.solana.com/tx/3AamwbZRFLqehTyYEv7LkgWwTKAH9HWAWKVcUHBEGQ682WZBheE9NjE8SmJaj3FnJS6YybmaZVcf2YiVKAqVx6N2?cluster=devnet
```

### Transfer sol from dev-wallet to turbin3 wallet
```
Success! Check out your TX here: 
https://explorer.solana.com/tx/5x2zGL5wrpCwkN8pmv3m63a6cGrfziKBD87dVnCNvuyeGuKuSMrSTLSJEKBvXnC3fAD5uLHrDXkoiPdkqxB7iqiv?cluster=devnet
```

### Drain the dev-wallet
```
Success! Check out your TX here: 
https://explorer.solana.com/tx/5mNnDGmNWfLUpKHR7Rxqs5dkN1Fqp6HaAntMiUQPKRw9iEJs9uijVtXju2oT4wZqYALFyQnAVum4UysbP3AWbrkj?cluster=devnet
```

### Interact with the onchain program
```
Success! Check out your TX here: 
https://explorer.solana.com/tx/4y3WmGCBP7sWoN5XYDpfjUqdmSnxur29fJcaWayWtDfCcSK1dLypZ6H254xUHRGVRSBqtTENpq2gF2EB1a9Ee11p?cluster=devnet
```

| Submits Typescript prerequisite completion proof and mints completion NFT

![alt text](image.png)

