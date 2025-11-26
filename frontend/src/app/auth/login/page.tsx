"use client";

import { useState } from "react";
// Next.js 환경이 아닐 경우를 대비해 window.location을 사용하는 방식으로 대체합니다.
// 실제 Next.js 앱에서는 import { useRouter } from "next/navigation"; 을 사용하세요.
// import Link from "next/link"; 

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  // const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // 1. 로그인 요청
      // ✅ [수정 완료] 
      // 1) 백엔드 라우트가 '/api/users'로 변경되었으므로 'auth' -> 'users'로 변경
      // 2) Next.js 프록시 설정을 활용하기 위해 'http://localhost:3001' 제거 (상대 경로 사용)
      const res = await fetch("/api/users/login", { 
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

      if (!userInfo.id) {
         // role은 필수 여부에 따라 체크하거나 생략 가능
         console.warn("User ID missing in response:", userInfo);
         // throw new Error("서버 응답에 유저 정보가 부족합니다."); // 필요 시 주석 해제
      }

      // 정보를 깔끔하게 저장
      localStorage.setItem("user", JSON.stringify(userInfo));

      alert(`로그인 성공! 환영합니다.`);
      
      // 페이지 이동
      window.location.href = "/"; 

    } catch (err: any) {
      console.error("Login Error:", err);
      // HTML 응답(404 등)이 올 경우 JSON 파싱 에러가 발생하므로, 메시지를 다듬어 줍니다.
      if (err.message && err.message.includes("Unexpected token")) {
        setError("서버 연결 오류: 올바르지 않은 응답입니다. (백엔드 경로를 확인하세요)");
      } else {
        setError(err.message || "알 수 없는 오류가 발생했습니다.");
      }
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
          <a href="/auth/signup" className="text-blue-600 font-bold hover:underline">
            회원가입
          </a>
        </p>
      </div>
    </div>
  );
}