#![no_std]

use soroban_sdk::{contractimpl, symbol, vec, Address, Env, Symbol, Vec, Map};

const MAX_LEVERAGE: i128 = 300; // 3x leverage (300%)
const MIN_COLLATERAL_RATIO: i128 = 150; // 150% minimum collateral ratio

#[derive(Clone)]
pub struct LoanVault {
    loans: Map<Address, Map<Address, Loan>>, // user -> (asset -> loan)
    total_loans: Map<Address, i128>, // asset -> total amount
}

#[derive(Clone)]
pub struct Loan {
    amount: i128,
    collateral: i128,
    interest_rate: i128,
    start_time: i64,
    end_time: i64,
    status: Symbol,
}

#[contractimpl]
impl LoanVault {
    pub fn initialize(env: &Env) -> LoanVault {
        LoanVault {
            loans: Map::new(env),
            total_loans: Map::new(env),
        }
    }

    pub fn create_loan(
        env: &Env,
        asset: Address,
        amount: i128,
        collateral: i128,
        user: Address,
    ) {
        // Calculate collateral ratio
        let collateral_ratio = (collateral * 100) / amount;
        require!(collateral_ratio >= MIN_COLLATERAL_RATIO, "Insufficient collateral");

        // Calculate leverage
        let leverage = (amount * 100) / collateral;
        require!(leverage <= MAX_LEVERAGE, "Exceeds maximum leverage");

        // Create loan
        let loan = Loan {
            amount,
            collateral,
            interest_rate: 500, // 5% annual interest
            start_time: env.ledger().timestamp(),
            end_time: env.ledger().timestamp() + 31536000, // 1 year
            status: symbol!("active"),
        };

        // Store loan
        let mut user_loans = self.loans.get(user.clone()).unwrap_or_else(|| Map::new(env));
        user_loans.set(asset.clone(), loan);
        self.loans.set(user, user_loans);

        // Update total loans
        let total = self.total_loans.get(asset.clone()).unwrap_or(0);
        self.total_loans.set(asset, total + amount);
    }

    pub fn repay_loan(
        env: &Env,
        asset: Address,
        amount: i128,
        user: Address,
    ) {
        let mut user_loans = self.loans.get(user.clone()).unwrap_or_else(|| Map::new(env));
        let mut loan = user_loans.get(asset.clone()).unwrap_or_else(|| panic!("Loan not found"));

        // Calculate interest
        let time_elapsed = env.ledger().timestamp() - loan.start_time;
        let interest = (loan.amount * loan.interest_rate * time_elapsed) / (31536000 * 10000);
        let total_due = loan.amount + interest;

        require!(amount >= total_due, "Insufficient repayment amount");

        // Update loan status
        loan.status = symbol!("repaid");
        user_loans.set(asset.clone(), loan);
        self.loans.set(user, user_loans);

        // Update total loans
        let total = self.total_loans.get(asset.clone()).unwrap_or(0);
        self.total_loans.set(asset, total - loan.amount);
    }

    pub fn liquidate_loan(
        env: &Env,
        asset: Address,
        user: Address,
    ) {
        let mut user_loans = self.loans.get(user.clone()).unwrap_or_else(|| Map::new(env));
        let mut loan = user_loans.get(asset.clone()).unwrap_or_else(|| panic!("Loan not found"));

        // Calculate current collateral ratio
        let current_price = self.get_asset_price(env, asset.clone());
        let current_collateral_value = (loan.collateral * current_price) / 1000000;
        let collateral_ratio = (current_collateral_value * 100) / loan.amount;

        require!(collateral_ratio < MIN_COLLATERAL_RATIO, "Loan not liquidatable");

        // Update loan status
        loan.status = symbol!("liquidated");
        user_loans.set(asset.clone(), loan);
        self.loans.set(user, user_loans);

        // Update total loans
        let total = self.total_loans.get(asset.clone()).unwrap_or(0);
        self.total_loans.set(asset, total - loan.amount);
    }

    pub fn get_loan(env: &Env, asset: Address, user: Address) -> Loan {
        let user_loans = self.loans.get(user).unwrap_or_else(|| Map::new(env));
        user_loans.get(asset).unwrap_or_else(|| panic!("Loan not found"))
    }

    pub fn get_total_loans(env: &Env, asset: Address) -> i128 {
        self.total_loans.get(asset).unwrap_or(0)
    }

    // Helper function to get asset price (to be implemented with price oracle)
    fn get_asset_price(env: &Env, asset: Address) -> i128 {
        // TODO: Implement price oracle integration
        1000000 // Placeholder: 1.0 in 6 decimal places
    }
}

fn require(condition: bool, message: &str) {
    if !condition {
        panic!(message);
    }
} 