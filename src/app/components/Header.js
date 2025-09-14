'use client';

import { useState } from 'react';
import { TonConnectButton, useTonConnect } from '@tonconnect/ui-react';

export default function Header() {
  const { account, disconnect } = useTonConnect(); // account может быть undefined
  const [menuOpen, setMenuOpen] = useState(false);

  // Баланс в TON (если он есть в account.balance в наноTON)
  const formattedBalance = account?.balance
    ? (Number(account.balance) / 1_000_000_000).toFixed(2)
    : '0';

  return (
    <header className="flex justify-between items-center p-4 shadow-md bg-[#0F172A] relative">
      <h1 className="text-2xl font-bold text-white">🚀 SWAPLY</h1>

      <div className="flex items-center gap-4 relative">
        {account?.address ? (
          <>
            <div
              onClick={() => setMenuOpen(!menuOpen)}
              className="cursor-pointer text-sm text-gray-200 px-3 py-1 rounded hover:bg-gray-700 transition"
            >
              {account.address.slice(0, 8)}...{account.address.slice(-6)}
            </div>

            {menuOpen && (
              <div className="absolute right-0 top-10 bg-[#1F2A40] p-4 rounded shadow-md w-44 text-white z-50">
                <div className="mb-2">Баланс: {formattedBalance} TON</div>
                <button
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-1 rounded"
                  onClick={() => {
                    disconnect();
                    setMenuOpen(false);
                  }}
                >
                  Отключить
                </button>
              </div>
            )}
          </>
        ) : (
          <TonConnectButton className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded" />
        )}
      </div>
    </header>
  );
}
