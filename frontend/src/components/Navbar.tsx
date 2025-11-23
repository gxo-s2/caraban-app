'use client'; // This component uses client-side interactivity (e.g., localStorage, useState, useRouter)

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check login status and user role from localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('userToken');
      const role = localStorage.getItem('userRole');
      setIsLoggedIn(!!token);
      setUserRole(role);
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
      setIsLoggedIn(false);
      setUserRole(null);
      router.push('/'); // Redirect to home page after logout
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              CaravanShare
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/" className="text-gray-500 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Home
              </Link>
              <Link href="/caravans" className="text-gray-500 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Explore Caravans
              </Link>

              {isLoggedIn ? (
                <>
                  {userRole === 'HOST' && (
                    <>
                      <Link href="/host/caravans/new" className="bg-indigo-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-600">
                        카라반 등록하기
                      </Link>
                      <Link href="/host/reservations" className="bg-green-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-600">
                        예약 관리
                      </Link>
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-gray-500 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="text-gray-500 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                    로그인
                  </Link>
                  <Link href="/auth/signup" className="text-gray-500 hover:bg-gray-100 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                    회원가입
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
