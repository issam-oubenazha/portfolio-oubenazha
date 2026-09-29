import React from 'react'
import './skills.css'

type StyleWithVar = React.CSSProperties & { '--time': string };

export default function Skills() {
  return (
    <section className="w-screen text-center p-4 sm:p-6 md:p-10 min-h-screen flex flex-col items-center justify-center relative overflow-hidden" id="skills">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full">
        <h3 className="text-sm sm:text-base md:text-lg font-bold text-cyan-400 animate-fadeInUp">My Abilities</h3>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text animate-fadeInUp" style={{ animationDelay: '0.2s' }}>My Skills</h2>

        <div className="flex items-center justify-center mt-8 sm:mt-16 md:mt-24 w-full animate-fadeInUp animate-float" style={{ animationDelay: '0.4s' }}>
          <div>
            <div className="scroll" style={{ '--time': '20s' } as StyleWithVar}>
              <div>
                <span>HTML</span>
                <span>CSS</span>
                <span>JavaScript</span>
                <span>ReactJS</span>
                <span>Tailwind</span>
                <span>Saas</span>
                <span>Bootstrap</span>
              </div>
              <div>
                <span>HTML</span>
                <span>CSS</span>
                <span>JavaScript</span>
                <span>ReactJS</span>
                <span>Tailwind</span>
                <span>Saas</span>
                <span>Bootstrap</span>
              </div>
            </div>
            
            <div className="scroll" style={{ '--time': '30s' } as StyleWithVar}>
              <div>
                  <span>Python</span>
                  <span>Php</span>
                  <span>Node js</span>
                  <span>Express JS</span>
                  <span>Flask </span>
                  <span>Laravel</span>
              </div>
              <div>
                  <span>Python</span>
                  <span>Php</span>
                  <span>Node js</span>
                  <span>Express JS</span>
                  <span>Flask </span>
                  <span>Laravel</span>
              </div>
            </div>

            <div className="scroll" style={{ '--time': '20s' } as StyleWithVar}>
              <div>
                  <span>MongoDB</span>
                  <span>MySQL</span>
                  <span>Hadoop</span>
                  <span>Hbase</span>
                  <span>Redis</span>
                  <span>Casandra</span>
              </div>
              <div>
                  <span>MongoDB</span>
                  <span>MySQL</span>
                  <span>Hadoop</span>
                  <span>Hbase</span>
                  <span>Redis</span>
                  <span>Casandra</span>
              </div>
            </div>

            <div className="scroll" style={{ '--time': '40s' } as StyleWithVar}>
              <div>
                <span>AI </span>
                <span>Machine Learning</span>
                <span>Deep Learning</span>
                <span>CNN</span>
                <span>NLP</span>
              </div>
              <div>
                <span>AI </span>
                <span>Machine Learning</span>
                <span>Deep Learning</span>
                <span>CNN</span>
                <span>NLP</span>
              </div>
            </div>

            <div className="scroll imgBox" style={{ '--time': '30s' } as StyleWithVar}>
              <div>
                  <img src="/images/1.png" alt="Technology 1"/>
                  <img src="/images/2.png" alt="Technology 2"/>
                  <img src="/images/3.png" alt="Technology 3"/>
                  <img src="/images/4.png" alt="Technology 4"/>
                  <img src="/images/5.png" alt="Technology 5"/>
                  <img src="/images/6.png" alt="Technology 6"/>
                  <img src="/images/7.png" alt="Technology 7"/>
                  <img src="/images/8.png" alt="Technology 8"/>
              </div>
              <div>
                  <img src="/images/9.png" alt="Technology 9"/>
                  <img src="/images/10.png" alt="Technology 10"/>
                  <img src="/images/11.png" alt="Technology 11"/>
                  <img src="/images/12.png" alt="Technology 12"/>
                  <img src="/images/13.png" alt="Technology 13"/>
                  <img src="/images/14.png" alt="Technology 14"/>
                  <img src="/images/15.png" alt="Technology 15"/>
                  <img src="/images/16.png" alt="Technology 16"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
