import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import TeamModal from './TeamModal';

const Footer = () => {
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  return (
    <footer className="bg-gray-100 dark:bg-[#0d1117] py-6 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 flex flex-col md:flex-row items-center justify-center gap-2">
          <span>&copy; {new Date().getFullYear()} | All Rights Reserved | </span>
          <span className="flex items-center gap-1.5">
            Developed with <Heart size={14} className="text-orange-500 fill-orange-500" /> by
            <button
              onClick={() => setIsTeamModalOpen(true)}
              className="text-gray-900 dark:text-white font-medium hover:text-orange-500 hover:underline focus:outline-none transition-colors"
            >
              Okan
            </button>
          </span>
        </p>
      </div>
      <TeamModal isOpen={isTeamModalOpen} onClose={() => setIsTeamModalOpen(false)} />
    </footer>
  );
};

export default Footer;