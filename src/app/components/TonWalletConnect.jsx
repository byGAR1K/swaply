'use client';
import React, { useState } from "react";
import { TonConnectButton } from "@tonconnect/ui-react";

export default function TonWalletConnect({ onConnect }) {
  const [walletAddress, setWalletAddress] = useState(null);

  return (
    <div className="flex flex-col items-center gap-2">
      <TonConnectButton
        onConnect={(wallet) => {
          setWalletAddress(wallet.account.address);
          onConnect(wallet.account.address); // передаем адрес в родитель
        }}
        onDisconnect={() => {
          setWalletAddress(null);
          onConnect(null);
        }}
      />
      {walletAddress && (
        <p className="text-green-400 font-semibold text-sm">
          Подключен кошелек: {walletAddress}
        </p>
      )}
    </div>
  );
}
