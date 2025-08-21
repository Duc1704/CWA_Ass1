import HamburgerMenu from './components/HamburgerMenu';
import ThemeToggle from './components/ThemeToggle';

export default function Home(): JSX.Element {
  return (
    <div>
      <HamburgerMenu />
      <div className="mt-4 flex justify-center">
        <ThemeToggle />
      </div>
      <div className="flex justify-center mt-4">
        <h1 className="text-5xl font-extrabold transition-colors duration-200 mt-2 text-center cursor-default" style={{ color: 'var(--foreground)' }}>
          Tabs Generator
        </h1>
      </div>
    </div>
  );
}