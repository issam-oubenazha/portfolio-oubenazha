import Nav from './components/Nav';
import HomePage from './components/Home';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import TerminalMode from './components/TerminalMode';

export default function Page() {
  return (
    <div className="relative min-h-screen">
      <TerminalMode>
        <div id="tsparticles" className="fixed inset-0 z-0 pointer-events-none" />

        <div className="relative z-10">
          <Nav />

          <main className="w-full">
            <HomePage />
            <About />
            <Skills />
            <Projects />
            <Contact />
          </main>

          <Footer />
        </div>
      </TerminalMode>
    </div>
  );
}
