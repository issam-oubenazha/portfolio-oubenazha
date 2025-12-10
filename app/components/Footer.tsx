import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-green-900 to-blue-950 text-emerald-100 border-t border-cyan-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4 glass-effect p-6 rounded-xl border border-cyan-500/30">
            <h3 className="text-2xl font-bold gradient-text">Issam Oubenazha</h3>
            <p className="text-sm text-emerald-100">
              Full Stack Developer & AI Engineer crafting exceptional digital experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 glass-effect p-6 rounded-xl border border-emerald-500/30">
            <h4 className="text-lg font-semibold text-cyan-400">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="hover:text-cyan-300 transition-colors font-medium">Home</a></li>
              <li><a href="#about" className="hover:text-cyan-300 transition-colors font-medium">About</a></li>
              <li><a href="#skills" className="hover:text-cyan-300 transition-colors font-medium">Skills</a></li>
              <li><a href="#work" className="hover:text-cyan-300 transition-colors font-medium">Work</a></li>
              <li><a href="#contact" className="hover:text-cyan-300 transition-colors font-medium">Contact</a></li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4 glass-effect p-6 rounded-xl border border-cyan-500/30">
            <h4 className="text-lg font-semibold text-emerald-400">Connect</h4>
            <div className="flex space-x-4">
              <a href="https://github.com/issam-oubenazha"
                 className="text-emerald-100 hover:text-cyan-400 transition-colors transform hover:scale-125 duration-300"
                 target="_blank"
                 rel="noopener noreferrer">
                <FaGithub className="h-6 w-6" />
              </a>
              <a href="https://www.linkedin.com/in/issam-oubenazha-651b12352/"
                 className="text-emerald-100 hover:text-emerald-400 transition-colors transform hover:scale-125 duration-300"
                 target="_blank"
                 rel="noopener noreferrer">
                <FaLinkedin className="h-6 w-6" />
              </a>
              <a href="https://twitter.com" 
                 className="text-emerald-100 hover:text-cyan-400 transition-colors transform hover:scale-125 duration-300"
                 target="_blank"
                 rel="noopener noreferrer">
                <FaTwitter className="h-6 w-6" /> 
              </a>
              <a href="mailto:issamoubenazha@gmail.com"
                 className="text-emerald-100 hover:text-emerald-400 transition-colors transform hover:scale-125 duration-300">
                <FaEnvelope className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-cyan-900 text-center">
          <p className="text-sm text-emerald-200">
            © {currentYear} ISSAM Oubenazha. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
