import Navbar from './Navbar';
import Footer from './Footer';
import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: '70vh' }}>{children}</main>
      <Footer />
    </>
  );
}

export default Layout;
