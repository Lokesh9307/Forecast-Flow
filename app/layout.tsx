// frontend/app/layout.tsx
import "./globals.css";
import AuthProvider from "./components/AuthProvider";
import AuthHeader from "./components/AuthHeader";

export const metadata = {
  title: "ForeCast Flow - Weather Tracker",
  description: "Track weather easily",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <header>
              <div className="container mx-auto px-4 flex justify-between items-center">
                <AuthHeader />
              </div>
            </header>
            <main className="container mx-auto px-4 py-6 flex-1">{children}</main>
            <footer className="text-center py-4 text-gray-500 text-sm">
              © 2025 Forecast Flow assignment by Xenvolt.Ai
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
