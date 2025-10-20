import Header from './components/Header';
import Footer from './components/Footer';

export default function Home(): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Fill available space so footer sits at the bottom */}
      <div className="flex-1" />
      
      {/* Footer */}
      <Footer />
    </div>
  );
}