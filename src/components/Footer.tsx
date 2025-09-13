import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-amber-200/50">
      <div className="px-4 py-3">
        <p className="text-xs text-gray-500 text-center">
          © 2025 1-Hour Museum Tours · All rights reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;