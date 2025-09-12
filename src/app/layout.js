export default function RootLayout({ children }) {
    return (
      <html>
        <body className="bg-[#1E293B] text-white font-sans flex flex-col min-h-screen">
          <Header /> {/* твоя шапка с лого и навигацией */}
          <main className="flex-grow max-w-5xl mx-auto py-12 px-6">
            {children}
          </main>
          <Footer /> {/* футер */}
        </body>
      </html>
    );
  }