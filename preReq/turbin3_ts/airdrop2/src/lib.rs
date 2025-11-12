#[cfg(test)]
mod tests {
    use solana_client::rpc_client::RpcClient;

    const RPC_URL: &str = "https://turbine-solanad-4cde.devnet.rpcpool.com/9a9da9cf-6db1-47dc-839a-55aca5c9c80a";

    use solana_system_interface::{
        program as system_program, 
        instruction::transfer
    }; 

    use solana_sdk::{ 
        message::Message, 
        hash::hash, 
        pubkey::Pubkey, 
        signature::{Keypair, Signer, read_keypair_file}, 
        transaction::Transaction, 
        instruction::{Instruction, AccountMeta},
    }; 
    use std::str::FromStr; 
   
    

    #[test]
    fn keygen() {
        let kp = Keypair::new();
        println!("You've generated a new Solana wallet: {}\n", kp.pubkey());
        println!("To save your wallet, copy and paste the following into a JSON file:");
        println!("{:?}", kp.to_bytes());
    }

    #[test]
    fn claim_airdrop() {
        // Import our keypair
        let keypair = read_keypair_file("dev-wallet.json").expect(
            "Couldn't find wallet file",
        );

        // we'll establish a connection to Solana devnet using the const we defined above
        let client = RpcClient::new(RPC_URL);

        // We're going to claim 2 devnet SOL tokens (2 billion lamports)
        match client.request_airdrop(&keypair.pubkey(), 2_000_000_000u64) {
            Ok(sig) => {
                println!("Success! Check your TX here:");
                println!("https://explorer.solana.com/tx/{}?cluster=devnet", sig);
            }
            Err(err) => {
                println!("Airdrop failed: {}", err);
            }
        }
    }

    #[test]
    fn transfer_sol() {
        // Load your devnet keypair from file 
        let keypair = read_keypair_file("dev-wallet.json").expect("Couldn't find wallet file");

        // Generate a signature from the keypair 
        let pubkey = keypair.pubkey(); 
        let message_bytes = b"I verify my Solana Keypair!"; 
        let sig = keypair.sign_message(message_bytes); 
        let _sig_hashed  = hash(sig.as_ref()); 

        // Verify the signature using the public key 
        match sig.verify(&pubkey.to_bytes(), message_bytes) { 
            true => println!("Signature verified"), 
            false => println!("Verification failed"), 
        } 

        //  Define the destination (Turbin3) address 
        let to_pubkey = Pubkey::from_str("5DKAQEs3NbhCE3CJwvhCY2MADiNQm7BxxKC4BmtrnMjw").unwrap(); 

        //  Connect to devnet
        let rpc_client = RpcClient::new(RPC_URL); 
        //  Fetch recent blockhash
        let recent_blockhash = rpc_client.get_latest_blockhash().expect("Failed to get recent blockhash"); 

        // Create and sign the transaction
         let transaction = Transaction::new_signed_with_payer( 
            &[transfer(&keypair.pubkey(), &to_pubkey, 1000_000_000)], 
            Some(&keypair.pubkey()), 
            &vec![&keypair], 
            recent_blockhash, 
        ); 

        // Send the transaction and print tx 
        let signature = rpc_client 
            .send_and_confirm_transaction(&transaction) 
            .expect("Failed to send transaction"); 
        
        println!(
            "Success! Check out your TX here: https://explorer.solana.com/tx/{}/?cluster=devnet", 
            signature 
        ); 
    }

   #[test]
    fn drain_wallet() {
        // const RPC_URL: &str = "https://api.devnet.solana.com";
        let keypair = read_keypair_file("dev-wallet.json").expect("Couldn't find wallet file");
        let client = RpcClient::new(RPC_URL);
        let to_pubkey = Pubkey::from_str("5DKAQEs3NbhCE3CJwvhCY2MADiNQm7BxxKC4BmtrnMjw").unwrap();

        //get balance
        let balance = client.get_balance(&keypair.pubkey()).expect("Failed to get balance");
        let recent_blockhash = client.get_latest_blockhash().expect("Failed to get blockhash");

        let message = Message::new_with_blockhash(
            &[transfer(&keypair.pubkey(), &to_pubkey, balance)],
            Some(&keypair.pubkey()),
            &recent_blockhash
        );

        let fee = client.get_fee_for_message(&message).expect("Failed get the gas fee");
        let transaction = Transaction::new_signed_with_payer(&[transfer(&keypair.pubkey(), &to_pubkey, balance - fee)], Some(&keypair.pubkey()), &vec![&keypair], recent_blockhash);

        let signature = client.send_and_confirm_transaction(&transaction).expect("Transaction failed");
        println!("Success! Check out your TX here: https://explorer.solana.com/tx/{}?cluster=devnet", signature);
    }


    #[test]
    fn enroll(){
        let rpc_client = RpcClient::new(RPC_URL);

        

        // reading private key of the turbin3 wallet
        let signer = read_keypair_file("Turbin3-wallet.json").expect("Couldn't find wallet file");

        // Define program and account public keys
        let mint = Keypair::new(); 

        let turbin3_prereq_program = 
        Pubkey::from_str("TRBZyQHB3m68FGeVsqTK39Wm4xejadjVhP5MAZaKWDM").unwrap(); 
        let collection = 
        Pubkey::from_str("5ebsp5RChCGK7ssRZMVMufgVZhd2kFbNaotcZ5UvytN2").unwrap(); 
        let mpl_core_program = 
        Pubkey::from_str("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d").unwrap(); 
        let system_program = system_program::id(); 

        // Get the prereq PDA
        let signer_pubkey = signer.pubkey(); 
        let seeds = &[b"prereqs", signer_pubkey.as_ref()]; 
        let (prereq_pda, _bump) = Pubkey::find_program_address(seeds, 
        &turbin3_prereq_program);

       

        // Get the authority PDA (collection authority)
        let authority_seeds = &[b"collection", collection.as_ref()];
        let (authority, _authority_bump) = Pubkey::find_program_address(
            authority_seeds,
            &turbin3_prereq_program
        );

        // Instruction discriminator for submit_rs
        let data = vec![77, 124, 82, 163, 21, 133, 181, 206]; 

        // Define the accounts metadata 

        let accounts = vec![ 
            AccountMeta::new(signer.pubkey(), true),      
            AccountMeta::new(prereq_pda, false),          
            AccountMeta::new(mint.pubkey(), true),        
            AccountMeta::new(collection, false),          
            AccountMeta::new_readonly(authority, false),        
            AccountMeta::new_readonly(mpl_core_program, false), 
            AccountMeta::new_readonly(system_program, false),       
        ];         

        // get recent blockhash
        let blockhash = rpc_client 
            .get_latest_blockhash() 
            .expect("Failed to get recent blockhash");

        // Build the instruction

        let instruction = Instruction { 
            program_id: turbin3_prereq_program, 
            accounts, 
            data, 
        };     

        // Create and sign the transaction

         let transaction = Transaction::new_signed_with_payer( 
            &[instruction], 
            Some(&signer.pubkey()), 
            &[&signer, &mint], 
            blockhash, 
        );

        //  Send and confirm the transaction

        let signature = rpc_client 
            .send_and_confirm_transaction(&transaction) 
            .expect("Failed to send transaction"); 
            println!( 
            "Success! Check out your TX 
            here:\nhttps://explorer.solana.com/tx/{}/?cluster=devnet", 
            signature 
        );

    }
    

}
