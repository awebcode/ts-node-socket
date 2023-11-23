import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 fixed top-0 left-0 right-0">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex justify-end items-center px-3">
          <Link href="/">
            <p className="text-white hover:text-gray-300 mr-4">Home</p>
          </Link>
          <Link href="/about">
            <p className="text-white hover:text-gray-300 mr-4">About</p>
          </Link>
          <Link href="/contact">
            <p className="text-white hover:text-gray-300">Contact</p>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
