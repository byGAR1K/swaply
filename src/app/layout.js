'use client';

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body className="bg-[#1E293B] text-white font-sans">
        {children}
      </body>
    </html>
  );
}