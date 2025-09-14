// src/app/providers.tsx
'use client';

import { TonConnectUIProvider } from '@tonconnect/ui-react';

export function Providers({ children }: { children: React.ReactNode }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  return (
    <TonConnectUIProvider
      manifestUrl={`${baseUrl}/tonconnect-manifest.json`}
    >
      {children}
    </TonConnectUIProvider>
  );
}
