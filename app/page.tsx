import HamburgerMenu from './components/HamburgerMenu';
import Tabs from './components/Tabs';
import Footer from './components/Footer';

export default function Home(): JSX.Element {
  return (
    <div className="pb-20">
      <HamburgerMenu />
      <div className="flex justify-center mt-4">
        <h1 className="text-5xl font-extrabold transition-colors duration-200 mt-2 text-center cursor-default" style={{ color: 'var(--foreground)' }}>
          Tabs Generator
        </h1>
      </div>
      <div className="mt-4">
        <Tabs />
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}