import Header from './components/Header';
import Footer from './components/Footer';

export default function Home(): JSX.Element {
  return (
    <div className="pb-20">
      <Header />
      
      {/* Footer */}
      <Footer />
    </div>
  );
}