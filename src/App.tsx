/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { ErrorBoundary } from './components/ErrorBoundary';
import { PlatformProvider, usePlatform } from './context/PlatformContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScannerPaymentModal } from './components/ScannerPaymentModal';
import { HomePage } from './pages/HomePage';
import { AiRobotPage } from './pages/AiRobotPage';
import { AiAutomationPage } from './pages/AiAutomationPage';
import { AiShoppingPage } from './pages/AiShoppingPage';
import { AiBusinessPage } from './pages/AiBusinessPage';
import { AiVideoPage } from './pages/AiVideoPage';
import { PricingPage } from './pages/PricingPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';

function PlatformShell() {
  const { currentPage } = usePlatform();

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'ai-robot':
        return <AiRobotPage />;
      case 'ai-automation':
        return <AiAutomationPage />;
      case 'ai-shopping':
        return <AiShoppingPage />;
      case 'ai-business':
        return <AiBusinessPage />;
      case 'ai-video':
        return <AiVideoPage />;
      case 'pricing':
        return <PricingPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'auth':
        return <AuthPage />;
      case 'dashboard':
        return <DashboardPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#060913] text-slate-100">
      <Navbar />
      <main className="flex-1">{renderPage()}</main>
      <Footer />
      <ScannerPaymentModal />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <PlatformProvider>
        <PlatformShell />
      </PlatformProvider>
    </ErrorBoundary>
  );
}
