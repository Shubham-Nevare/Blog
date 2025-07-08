import Link from "next/link";

const Navbar = () => (
  <nav className="w-full bg-white shadow fixed top-0 left-0 z-50">
    <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
      <Link href="/" className="text-xl font-bold text-blue-700">Blog</Link>
      <div className="space-x-4">
        <Link href="/" className="text-gray-700 hover:text-blue-700 font-medium">Home</Link>
        <Link href="/Login" className="text-gray-700 hover:text-blue-700 font-medium">Login</Link>
      </div>
    </div>
  </nav>
);

export default Navbar; 