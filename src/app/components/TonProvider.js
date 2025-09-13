// src/components/TonProvider.js
'use client';

import { useEffect, useState } from 'react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

export default function TonProvider({ children }) {
  const [manifestUrl, setManifestUrl] = useState(null);

  useEffect(() => {
    // вычисляем базовый origin на клиенте
    const origin = window.location.origin;
    setManifestUrl(`${origin}/api/tonconnect-manifest`);
  }, []);

  // пока не известен origin — ничего не рендерим провайдера
  if (!manifestUrl) return <>{children}</>;

  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      {children}
    </TonConnectUIProvider>
  );
}
