// src/components/Header.js
'use client';

import { TonConnectButton, useTonConnect } from '@tonconnect/ui-react';

export default function Header() {
  const { account } = useTonConnect(); // хук для доступа к подключённому аккаунту (если нужен)
  // account может быть undefined или {address, ...}

  return (
    <header className="flex justify-between items-center p-4 shadow-md bg-[#0F172A]">
      <h1 className="text-2xl font-bold">🚀 SWAPLY</h1>

      <div className="flex items-center gap-4">
        {/* Можно показать адрес, если подключено */}
        {account?.address ? (
          <div className="text-sm text-gray-200 mr-2">
            {account.address.slice(0, 8)}...{account.address.slice(-6)}
          </div>
        ) : null}

        {/* Кнопка TON Connect — откроет диалог выбора кошелька / QR */}
        <TonConnectButton />
      </div>
    </header>
  );
}