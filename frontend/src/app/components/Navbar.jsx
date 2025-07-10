import Link from "next/link";

const Navbar = () => (
  <nav className="w-full bg-white shadow fixed top-0 left-0 z-50">
    <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <img src="/logo.png" alt="Logo" className="h-8 w-8" />
        <span className="text-xl font-bold text-blue-700">Blog</span>
      </Link>
      <div className="flex items-center gap-6">
        <Link
          href="/"
          className="text-gray-700 hover:text-blue-700 font-medium"
        >
          Home
        </Link>

        <Link
          href="/about"
          className="text-gray-700 hover:text-blue-700 font-medium transition-colors"
        >
          About
        </Link>
        <Link
          href="/contact"
          className="text-gray-700 hover:text-blue-700 font-medium transition-colors"
        >
          Contact
        </Link>

        <Link
          href="/Login"
          className="text-gray-700 hover:text-blue-700 font-medium"
        >
          Login
        </Link>
        <Link
          href="/Signup"
          className="text-gray-700 hover:text-blue-700 font-medium"
        >
          Signup
        </Link>
      </div>
    </div>
  </nav>
);

export default Navbar;
