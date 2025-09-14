// src/app/layout.tsx
import './globals.css';
import { Providers } from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="bg-[#1E293B] text-white font-sans">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}