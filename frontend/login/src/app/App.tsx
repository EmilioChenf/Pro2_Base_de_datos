import { BrandingPanel } from './components/BrandingPanel';
import { LoginCard } from './components/LoginCard';

export default function App() {
  return (
    <div className="min-h-screen w-full flex">
      <BrandingPanel />
      <LoginCard />
    </div>
  );
}