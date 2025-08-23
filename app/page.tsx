import HamburgerMenu from './components/HamburgerMenu';
import Tabs from './components/Tabs';
import { STUDENT_NAME, STUDENT_NUMBER } from './layout';

export default function Home(): JSX.Element {
  return (
    <div>
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
              <footer className="mt-16 py-6 text-center text-[--foreground]/70 border-t border-[--foreground]/20">
          <p className="text-sm">
            © 2024 {STUDENT_NAME} - Student No: {STUDENT_NUMBER} | Generated on: {new Date().toLocaleDateString()}
          </p>
        </footer>
    </div>
  );
}