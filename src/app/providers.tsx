'use client';

import { TonConnectUIProvider } from '@tonconnect/ui-react';

export function Providers({ children }: { children: React.ReactNode }) {
  const baseUrl = 'https://swaply-9wv3.vercel.app';

  return (
    <TonConnectUIProvider
      manifestUrl={`${baseUrl}/tonconnect-manifest.json`}
    >
      {children}
    </TonConnectUIProvider>
  );
}