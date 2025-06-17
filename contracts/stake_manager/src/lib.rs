#![no_std]

use soroban_sdk::{contractimpl, symbol, vec, Address, Env, Symbol, Vec, Map};

#[derive(Clone)]
pub struct StakeManager {
    stakes: Map<Address, Map<Address, i128>>, // user -> (asset -> amount)
    total_stakes: Map<Address, i128>, // asset -> total amount
}

#[contractimpl]
impl StakeManager {
    pub fn initialize(env: &Env) -> StakeManager {
        StakeManager {
            stakes: Map::new(env),
            total_stakes: Map::new(env),
        }
    }

    pub fn stake(
        env: &Env,
        asset: Address,
        amount: i128,
        user: Address,
    ) {
        let mut user_stakes = self.stakes.get(user.clone()).unwrap_or_else(|| Map::new(env));
        let current_stake = user_stakes.get(asset.clone()).unwrap_or(0);
        user_stakes.set(asset.clone(), current_stake + amount);
        self.stakes.set(user, user_stakes);

        let total = self.total_stakes.get(asset.clone()).unwrap_or(0);
        self.total_stakes.set(asset, total + amount);
    }

    pub fn withdraw(
        env: &Env,
        asset: Address,
        amount: i128,
        user: Address,
    ) {
        let mut user_stakes = self.stakes.get(user.clone()).unwrap_or_else(|| Map::new(env));
        let current_stake = user_stakes.get(asset.clone()).unwrap_or(0);
        
        require!(current_stake >= amount, "Insufficient stake");
        
        user_stakes.set(asset.clone(), current_stake - amount);
        self.stakes.set(user, user_stakes);

        let total = self.total_stakes.get(asset.clone()).unwrap_or(0);
        self.total_stakes.set(asset, total - amount);
    }

    pub fn get_stake(env: &Env, asset: Address, user: Address) -> i128 {
        let user_stakes = self.stakes.get(user).unwrap_or_else(|| Map::new(env));
        user_stakes.get(asset).unwrap_or(0)
    }

    pub fn get_total_stake(env: &Env, asset: Address) -> i128 {
        self.total_stakes.get(asset).unwrap_or(0)
    }
}

fn require(condition: bool, message: &str) {
    if !condition {
        panic!(message);
    }
} 