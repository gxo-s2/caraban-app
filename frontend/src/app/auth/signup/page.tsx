'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// 타입 경로가 맞는지 확인해주세요. (만약 파일이 없다면 아래 주석을 풀고 로컬에 정의하세요)
import { Role } from '../../../types/backend-enums'; 

// 만약 위 import가 안 된다면 아래 주석을 풀어서 사용하세요.
// enum Role {
//   HOST = 'HOST',
//   GUEST = 'GUEST',
// }

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  // 초기값을 명확하게 Role.GUEST로 설정
  const [role, setRole] = useState<Role>(Role.GUEST); 
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('회원가입 요청 데이터:', { email, password, name, role });

      // [수정 포인트 1] 백엔드 API 주소 확인
      // 기존: /api/users/register -> 변경: /api/auth/signup (일반적인 관례)
      // *주의: 만약 백엔드 라우터가 /users/register라면 다시 원래대로 돌리세요.
      const res = await fetch('http://localhost:3001/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || '회원가입에 실패했습니다.');
      }

      alert('회원가입이 완료되었습니다! 로그인 해주세요.');
      router.push('/auth/login'); 
    } catch (err: any) {
      console.error(err);
      setError(err.message || '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create Your Account</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 이메일 입력 */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* 비밀번호 입력 */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* 이름 입력 */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* [수정 포인트 2] 역할 선택 (라디오 버튼) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Register as:</label>
            <div className="mt-2 flex space-x-4">
              
              {/* Guest 선택 */}
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  checked={role === Role.GUEST}
                  onChange={() => setRole(Role.GUEST)} // 직접 값을 설정
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-600">Guest</span>
              </label>

              {/* Host 선택 */}
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  checked={role === Role.HOST}
                  onChange={() => setRole(Role.HOST)} // 직접 값을 설정
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-600">Host</span>
              </label>

            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center font-bold">{error}</p>}

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition"
            disabled={loading}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}