import { Syne } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import AuthProvider from "@/Context/AuthProvider";
import { ThemeProvider } from "next-themes";

const syne = Syne({
  subsets: ["latin"],
  display: "swap",
  // variable: "--font-syne", // You don't strictly need this for this method
  weight: ['400', '500', '600', '700', '800'] // Add more weights if needed
});

export const metadata = {
  title: "JobNest",
  description: "A platform where job seekers and employers connect effortlessly.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${syne.className} font-syne antialiased`}
      >
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
