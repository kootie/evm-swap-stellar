#![no_std]

use soroban_sdk::{contractimpl, symbol, vec, Address, Env, Symbol, Vec};

const SWAP_FEE: i128 = 1000; // 10% in basis points (1000 = 10%)

#[derive(Clone)]
pub struct SwapRouter;

#[contractimpl]
impl SwapRouter {
    pub fn swap(
        env: &Env,
        from_asset: Address,
        to_asset: Address,
        amount: i128,
        min_output: i128,
        recipient: Address,
    ) -> i128 {
        // Calculate swap amount (90% of input)
        let swap_amount = (amount * (10000 - SWAP_FEE)) / 10000;
        
        // Calculate stake amount (10% of input)
        let stake_amount = amount - swap_amount;
        
        // Perform the swap using Stellar's AMM
        let output_amount = env.invoke_contract(
            &from_asset,
            &symbol!("swap"),
            vec![
                env,
                to_asset.to_val(),
                swap_amount.to_val(),
                min_output.to_val(),
            ],
        );
        
        // Send stake amount to StakeManager
        env.invoke_contract(
            &from_asset,
            &symbol!("stake"),
            vec![
                env,
                stake_amount.to_val(),
                recipient.to_val(),
            ],
        );
        
        output_amount
    }
    
    pub fn get_swap_fee() -> i128 {
        SWAP_FEE
    }
} 