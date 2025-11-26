'use client'; 

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      
      {/* ✅ 수정 완료:
        1. Header와 Footer 태그 제거 (layout.tsx에서 중복 방지)
        2. 불필요한 useEffect, axios, useState 제거 (404 에러 해결)
      */}

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Find Your Next</span>
            <span className="block text-indigo-600">Adventure on Wheels</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Rent unique caravans from trusted hosts around the world. Your next journey awaits.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                href="/caravans"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
              >
                Explore Caravans
              </Link>
            </div>
          </div>
        </div>
      </main>
      
    </div>
  );
}
