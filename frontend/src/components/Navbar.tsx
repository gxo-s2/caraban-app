'use client'; // This component uses client-side interactivity (e.g., localStorage, useState, useRouter)

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

// 유저 정보 타입 (localStorage에 저장된 구조 기반)
type StoredUser = {
    id: string; // 실제 ID는 UUID string
    name: string;
    role: string;
    // userToken 등 다른 필드가 있을 수 있으나, 필요한 최소 정보만 정의
};

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // 🚨 [핵심 수정] localStorage에서 'user' 키의 JSON 객체를 파싱하여 상태를 설정합니다.
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');

      if (storedUser) {
        try {
            const user: StoredUser = JSON.parse(storedUser);
            setIsLoggedIn(true);
            setUserRole(user.role); // 'user' 객체에서 role 값을 직접 가져옵니다.
            
            // 토큰을 별도로 사용하지 않으므로 userToken 대신 isLoggedIn으로 상태 관리
        } catch (e) {
            console.error("Failed to parse user data from localStorage:", e);
            handleLogout(); // 파싱 오류 시 강제 로그아웃 처리
        }
      } else {
          setIsLoggedIn(false);
          setUserRole(null);
      }
    }
  }, []);

  const handleLogout = () => {
    // 🚨 [수정] 로그인 정보를 저장하는 단일 키 'user'만 제거합니다.
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user'); // 'user' 키 제거
      localStorage.removeItem('userToken'); // 기존 코드와 충돌 방지 및 정리
      localStorage.removeItem('userId'); // 기존 코드와 충돌 방지 및 정리
      localStorage.removeItem('userRole'); // 기존 코드와 충돌 방지 및 정리

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
                  {/* 🚨 [핵심 기능] HOST 전용 버튼 */}
                  {userRole === 'HOST' && (
                    <>
                      {/* 카라반 등록하기 버튼 */}
                      <Link href="/host/caravans/new" className="bg-indigo-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-600">
                        카라반 등록하기
                      </Link>
                      {/* 예약 관리 버튼 */}
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