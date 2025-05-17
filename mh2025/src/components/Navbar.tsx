import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 shadow-md">
      <div className="flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">SupportSpace</Link>
        <div className="space-x-4">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/about" className="hover:underline">About</Link>
          <Link href="/chat" className="hover:underline">Chat</Link>
          <Link href="/login" className="hover:underline">Login</Link>
        </div>
      </div>
    </nav>
  );
}
