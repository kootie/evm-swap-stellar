import { useState } from 'react';

interface LoanInfo {
  id: string;
  collateralAsset: string;
  collateralAmount: number;
  borrowedAsset: string;
  borrowedAmount: number;
  interestRate: number;
  dueDate: Date;
  isRepaid: boolean;
}

interface LoanProps {
  loans: LoanInfo[];
  onBorrow: (collateralAsset: string, collateralAmount: number, borrowAsset: string) => Promise<void>;
  onRepay: (loanId: string) => Promise<void>;
}

export default function Loan({ loans, onBorrow, onRepay }: LoanProps) {
  const [collateralAsset, setCollateralAsset] = useState('ETH');
  const [collateralAmount, setCollateralAmount] = useState('');
  const [borrowAsset, setBorrowAsset] = useState('BTC');
  const [isLoading, setIsLoading] = useState(false);

  const handleBorrow = async () => {
    if (!collateralAmount || isNaN(Number(collateralAmount))) return;
    
    setIsLoading(true);
    try {
      await onBorrow(collateralAsset, Number(collateralAmount), borrowAsset);
      setCollateralAmount('');
    } catch (error) {
      console.error('Borrow failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRepay = async (loanId: string) => {
    setIsLoading(true);
    try {
      await onRepay(loanId);
    } catch (error) {
      console.error('Repayment failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Borrow Form */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Borrow Crypto
          </h3>
          <div className="mt-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Collateral Asset
              </label>
              <select
                value={collateralAsset}
                onChange={(e) => setCollateralAsset(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-stellar-blue focus:border-stellar-blue sm:text-sm rounded-md"
              >
                <option value="BTC">BTC</option>
                <option value="ETH">ETH</option>
                <option value="XLM">XLM</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Collateral Amount
              </label>
              <input
                type="number"
                value={collateralAmount}
                onChange={(e) => setCollateralAmount(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-stellar-blue focus:border-stellar-blue sm:text-sm"
                placeholder="0.0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Borrow Asset
              </label>
              <select
                value={borrowAsset}
                onChange={(e) => setBorrowAsset(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-stellar-blue focus:border-stellar-blue sm:text-sm rounded-md"
              >
                <option value="BTC">BTC</option>
                <option value="ETH">ETH</option>
                <option value="XLM">XLM</option>
              </select>
            </div>
            <button
              onClick={handleBorrow}
              disabled={isLoading || !collateralAmount}
              className="btn-primary w-full"
            >
              {isLoading ? 'Processing...' : 'Borrow'}
            </button>
          </div>
        </div>
      </div>

      {/* Active Loans */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Your Loans
          </h3>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {loans.map((loan) => (
              <li key={loan.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {loan.collateralAmount} {loan.collateralAsset} → {loan.borrowedAmount} {loan.borrowedAsset}
                    </p>
                    <p className="text-sm text-gray-500">
                      Due: {loan.dueDate.toLocaleDateString()}
                    </p>
                  </div>
                  {!loan.isRepaid && (
                    <button
                      onClick={() => handleRepay(loan.id)}
                      disabled={isLoading}
                      className="btn-secondary ml-4"
                    >
                      {isLoading ? 'Repaying...' : 'Repay'}
                    </button>
                  )}
                </div>
              </li>
            ))}
            {loans.length === 0 && (
              <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
                No active loans
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
} 