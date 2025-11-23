"use client";

import { useEffect, useState } from "react";
import Link from "next/link"; // Link 컴포넌트 import 필요
import axios from "axios";

// 데이터 타입 정의 (이전에 사용했던 Caravan 타입 재사용)
interface Caravan {
  id: string; // UUID 타입이므로 string으로 정의 (혹은 number)
  name: string;
  location: string;
  pricePerDay: number; // 백엔드와 이름 통일 (pricePerDay)
}

export default function CaravanExplorePage() {
  const [caravans, setCaravans] = useState<Caravan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 모든 카라반 목록을 불러옵니다.
    const fetchCaravans = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/caravans");
        setCaravans(response.data);
      } catch (error) {
        console.error("카라반 목록 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCaravans();
  }, []);

  if (loading) return <div className="text-center mt-20">카라반 로딩 중...</div>;
  
  if (caravans.length === 0) return <div className="text-center mt-20">등록된 카라반이 없습니다.</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-10">Explore Our Caravans</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {caravans.map((caravan) => (
          // 카라반 카드 시작
          <div 
            key={caravan.id} 
            className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transform hover:scale-[1.02] transition duration-300"
          >
            {/* 임시 이미지/썸네일 영역 */}
            <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                            </div>

            <div className="p-5">
              <h2 className="text-xl font-bold mb-1">{caravan.name}</h2>
              <p className="text-gray-500 text-sm mb-4">📍 {caravan.location}</p>
              
              <div className="flex justify-between items-center border-t pt-4">
                <span className="text-lg font-extrabold text-gray-800">
                  ₩{caravan.pricePerDay.toLocaleString()}
                  <span className="text-sm font-normal text-gray-500"> /day</span>
                </span>
                
                {/* 🚨 [핵심 수정 부분] 🚨 ID를 포함한 동적 링크 연결 */}
                <Link 
                  href={`/caravans/${caravan.id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                >
                  View Details
                </Link>
                
              </div>
            </div>
          </div>
          // 카라반 카드 끝
        ))}
      </div>
    </div>
  );
}