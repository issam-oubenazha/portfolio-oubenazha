import Nav from './components/Nav';
import HomePage from './components/Home';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function Page() {
  return (
    <div>
      <Nav />

      <main className="bg-gradient-to-r from-green-400 to-blue-500 text-white w-full">
        <HomePage />
        <About />
        <Skills />
        {/* <Projects /> */}
        <Contact />
      </main>
      
      <Footer />
    </div>
  );
}
