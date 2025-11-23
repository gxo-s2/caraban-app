// This is the root layout for the entire application.
// It's a required file in the Next.js App Router.

import './globals.css'; // Assuming global styles are in this file
import { Inter } from 'next/font/google';
import "./globals.css";
import Navbar from '../components/Navbar'; // 또는 import Navbar from '../../components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'CaravanShare',
  description: 'Share and rent caravans with ease.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar /> {/* Render the Navbar component */}
        {children}
      </body>
    </html>
  );
}
