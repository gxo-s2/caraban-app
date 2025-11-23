"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // 1. 로그인 요청
      // 🚨 [수정 완료] URL을 /api/users/login 에서 /api/auth/login 으로 변경
      const res = await fetch("http://localhost:3001/api/auth/login", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "로그인에 실패했습니다.");
      }

      // 서버 응답에서 유저 정보를 추출하여 저장
      const userInfo = data.user || data; 

      if (!userInfo.id || !userInfo.role) {
         throw new Error("서버 응답에 유저 정보가 누락되었습니다. 백엔드 확인 필요.");
      }

      // 정보를 깔끔하게 저장 (중첩되지 않게)
      localStorage.setItem("user", JSON.stringify(userInfo));

      alert(`로그인 성공! 환영합니다.`);
      
      // 페이지 이동
      window.location.href = "/"; 

    } catch (err: any) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center font-bold">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition font-bold"
          >
            Log In
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          계정이 없으신가요?{" "}
          <Link href="/auth/signup" className="text-blue-600 font-bold hover:underline">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}