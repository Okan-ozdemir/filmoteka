import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Film, Menu, X, Sun, Moon } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });
  const location = useLocation();

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm uppercase font-medium tracking-wide transition-all duration-200 ${isActive ? 'text-orange-500' : 'text-gray-900 dark:text-white hover:text-orange-500'}`;

  const mobileNavLinkClass = ({ isActive }) =>
    `text-2xl font-semibold uppercase tracking-wider transition-colors ${isActive ? 'text-orange-500' : 'text-white hover:text-orange-500'}`;


  return (
    <header className="fixed top-0 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md z-40 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-3 group z-[110]">
          <div className="bg-orange-100 dark:bg-gray-800 p-2 rounded-lg group-hover:scale-105 transition-transform">
             <Film className="text-orange-500" size={24} />
          </div>
          <span className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Filmoteka</span>
        </NavLink>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          <NavLink to="/" className={navLinkClass}>Home</NavLink>
          <NavLink to="/catalog" className={navLinkClass}>Catalog</NavLink>
          <NavLink to="/library" className={navLinkClass}>My Library</NavLink>

          <button
            onClick={toggleTheme}
            className="ml-4 p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={20} className="text-white" /> : <Moon size={20} className="text-gray-900" />}
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 md:hidden">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
             {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
          </button>
          <button
            onClick={() => setIsMenuOpen(true)}
            className="text-gray-900 dark:text-white hover:text-orange-500 z-[110]"
          >
            <Menu size={32} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[100] bg-gray-900 transform transition-transform duration-300 ease-in-out md:hidden ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex flex-col h-full relative p-8">
           {/* Background decoration */}
           <div className="absolute top-6 right-4">
              <button onClick={() => setIsMenuOpen(false)} className="text-white hover:text-orange-500 p-2">
                 <X size={32} />
              </button>
           </div>

           <div className="absolute top-6 left-4 flex items-center gap-3">
              <Film className="text-orange-500" size={24} />
              <span className="text-xl font-bold text-white tracking-tight">Filmoteka</span>
           </div>

          <div className="flex flex-col items-center justify-center h-full gap-8">
            <NavLink to="/" className={mobileNavLinkClass}>Home</NavLink>
            <NavLink to="/catalog" className={mobileNavLinkClass}>Catalog</NavLink>
            <NavLink to="/library" className={mobileNavLinkClass}>My Library</NavLink>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;