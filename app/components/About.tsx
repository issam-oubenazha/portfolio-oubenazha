import React from 'react';
import Image from 'next/image';

export default function About() {

  return (
    <section className="w-full text-center py-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center relative overflow-hidden" id="about">
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <h3 className="text-lg font-bold text-cyan-400 animate-fadeInUp">My Introduction</h3>
        <h2 className="text-4xl md:text-5xl font-bold gradient-text mt-2 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>About Me</h2>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Container */}
          <div className="flex justify-center animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-emerald-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-glow"></div>
                <Image
                  src="/images/Gemini_Generated_Image_rel34arel34arel3.jfif"
                  className="relative rounded-full h-80 w-80 object-cover shadow-2xl"
                  alt="Issam Oubenazha - Full Stack & AI Developer"
                  width={320}
                  height={320}
                  priority
                />
              </div>
          </div>

          {/* Content Container */}
          <div className="space-y-10 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass-effect border-l-4 border-l-cyan-500 p-6 rounded-xl hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-cyan-500/50 animate-glow group cursor-pointer">
                <i className="fas fa-award text-cyan-400 text-3xl mb-3 group-hover:animate-bounce"></i>
                <h3 className="font-bold text-lg text-emerald-100">Experience</h3>
                <span className="text-cyan-300 font-semibold text-lg">1 Year</span>
              </div>

              <div className="glass-effect border-l-4 border-l-emerald-500 p-6 rounded-xl hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-emerald-500/50 animate-glow group cursor-pointer" style={{ animationDelay: '0.2s' }}>
                <i className="fas fa-briefcase text-emerald-400 text-3xl mb-3 group-hover:animate-bounce"></i>
                <h3 className="font-bold text-lg text-emerald-100">Projects</h3>
                <span className="text-cyan-300 font-semibold text-lg">9 Done</span>
              </div>

              <div className="glass-effect border-l-4 border-l-cyan-500 p-6 rounded-xl hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-cyan-500/50 animate-glow group cursor-pointer" style={{ animationDelay: '0.4s' }}>
                <i className="fas fa-headset text-cyan-400 text-3xl mb-3 group-hover:animate-bounce"></i>
                <h3 className="font-bold text-lg text-emerald-100">Support</h3>
                <span className="text-cyan-300 font-semibold text-lg">24/7 Online</span>
              </div>
            </div>  

            {/* Description */}
            <div className="glass-effect p-8 rounded-xl border-l-4 border-l-cyan-500 hover:border-l-emerald-500 transition-all duration-300">
              <p className="text-left text-base sm:text-lg leading-relaxed text-emerald-100">
                Full Stack Developer with expertise in <span className="text-cyan-300 font-semibold">AI</span>, <span className="text-emerald-300 font-semibold">Cybersecurity</span>, and <span className="text-cyan-300 font-semibold">Digital Transformation</span>. Skilled in building scalable, user-friendly web and AI-driven solutions across academic, enterprise, and research environments.
              </p>
            </div>

            {/* Contact Button */}
            <div className="text-center pt-4">
              <a 
                href="#contact" 
                className="inline-flex items-center px-8 py-4 text-sm font-bold text-emerald-100 bg-gradient-to-r from-cyan-600 to-emerald-600 rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 group relative overflow-hidden"
              >
                <span className="relative z-10">Let&apos;s Build Something Intelligent</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                </svg>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-cyan-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
