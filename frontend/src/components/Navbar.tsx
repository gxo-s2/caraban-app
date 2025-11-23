import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* 로고 영역 */}
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center cursor-pointer">
              <span className="text-2xl font-bold text-indigo-600">CaravanShare</span>
            </Link>
          </div>

          {/* 메뉴 영역 */}
          <div className="flex items-center space-x-4">
            <Link 
              href="/auth/login" 
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
            >
              로그인
            </Link>
            <Link 
              href="/auth/signup" 
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
            >
              회원가입
            </Link>
            <Link 
              href="/host/caravans/new" 
              className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition duration-150 ease-in-out shadow-sm"
            >
              카라반 등록하기
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}