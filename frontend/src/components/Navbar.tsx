'use client';

import { useEffect, useState } from 'react';

type User = {
  id: string;
  name?: string;
  role?: string;
};

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    setIsLoggedIn(!!userData);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  const handleReservationLookupClick = () => {
    if (isLoggedIn) {
      window.location.href = '/my/reservations';
    } else {
      window.location.href = '/reservations/lookup';
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          <div className="flex items-center gap-8">
            <a href="/" className="flex-shrink-0 flex items-center cursor-pointer">
              <span className="text-2xl font-extrabold text-indigo-600 tracking-tight">
                CaravanShare
              </span>
            </a>

            <div className="hidden sm:flex sm:space-x-8">
              <a
                href="/caravans"
                className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-indigo-500 text-sm font-medium transition-colors"
              >
                Explore Caravans
              </a>
              
              <button
                onClick={handleReservationLookupClick}
                className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-indigo-500 text-sm font-medium transition-colors focus:outline-none"
              >
                예약 조회
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <a
                  href="/my/reservations"
                  className="hidden md:inline-block text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  내 예약
                </a>
                <a
                  href="/my/profile"
                  className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  내 프로필
                </a>
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  로그아웃
                </button>
              </>
            ) : (
              // ✅ [수정됨] href 경로를 '/login' -> '/auth/login'으로 변경
              <a
                href="/auth/login"
                className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-bold shadow-md hover:bg-indigo-700 transition-all hover:shadow-lg transform hover:-translate-y-0.5"
              >
                로그인
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}