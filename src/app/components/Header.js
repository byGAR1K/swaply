'use client';

import { useState, useEffect } from 'react';
import { useTonConnect } from '@tonconnect/ui-react';

export default function Header() {
  const {account, connect, disconnect } = useTonConnect();
  const [menuOpen, setMenuOpen] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (account?.address) {
      const fetchBalance = async () => {
        try {
          const b = await account.getBalance?.();
          setBalance(b ? b / 1_000_000_000 : 0);
        } catch {
          setBalance(0);
        }
      };
      fetchBalance();
    } else {
      setBalance(null);
    }
  }, [account]);

  const formattedBalance = balance !== null ? balance.toFixed(2) : '...';

  return (
    <header className="flex justify-between items-center p-4 shadow-md bg-[#0F172A]">
      <h1 className="text-2xl font-bold text-white">🚀 SWAPLY</h1>

      <div className="flex items-center gap-4">
        {!account?.address ? (
          <button
            onClick={() => connect?.()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
          >
            Подключить кошелек
          </button>
        ) : (
          <div className="relative">
            <div
              onClick={() => setMenuOpen(!menuOpen)}
              className="cursor-pointer text-sm text-gray-200 px-3 py-1 rounded hover:bg-gray-700 transition flex flex-col items-end"
            >
              <span>{account.address.slice(0, 8)}...{account.address.slice(-6)}</span>
              <span className="text-xs text-gray-400">{formattedBalance} TON</span>
            </div>

            {menuOpen && (
              <div className="absolute right-0 top-12 bg-[#1F2A40] p-4 rounded shadow-md w-44 text-white z-50">
                <div className="mb-2">Баланс: {formattedBalance} TON</div>
                <button
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-1 rounded"
                  onClick={() => {
                    disconnect?.();
                    setMenuOpen(false);
                  }}
                >
                  Отключить
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
