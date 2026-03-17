import { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header({ home }: { home: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-2">
            <Link to="/">
              <img src="/logo.webp" alt="CronJob Logo" className="w-8 h-8" />
            </Link>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Cron Job</h1>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            {home ? (
              <>
                <a href="/#features" className="text-gray-700 hover:text-purple-500 transition-colors font-medium">
                  Features
                </a>
              </>
            ) : (
              <Link to="/" className="text-gray-700 hover:text-purple-500 transition-colors font-medium">
                Home
              </Link>
            )}
            <Link
              to="/dashboard"
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2 shadow-sm hover:shadow-md"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </nav>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-200"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden mt-2 space-y-3 pb-4">
            {home ? (
              <>
                <a
                  href="/#features"
                  className="block text-gray-700 hover:text-purple-500 transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Features
                </a>
              </>
            ) : (
              <Link
                to="/"
                className="block text-gray-700 hover:text-purple-500 transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
            )}
            <Link
              to="/dashboard"
              className="block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
              onClick={() => setIsOpen(false)}
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
