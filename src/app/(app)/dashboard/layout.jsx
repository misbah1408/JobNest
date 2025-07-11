import Navbar from "@/components/Navbar";

export default async function RootLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="w-full sticky top-0 z-50">
      <Navbar />
      </div>
      {children}
    </div>
  );
}