"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

// 데이터 타입 정의 (백엔드와 통일: pricePerDay)
interface Caravan {
  // ID 타입은 UUID 문자열이지만, 여기서는 편의상 Number로 가정 (실제 사용은 string)
  id: string; // 실제 데이터 타입을 string으로 가정
  name: string;
  description: string;
  location: string;
  pricePerDay: number; // 🚨 [핵심 수정] pricePerDay로 타입 정의
  images: string[];
  hostId: string; // 호스트 ID도 string (UUID)으로 가정
}

export default function CaravanDetailPage() {
  const { id } = useParams(); // URL 파라미터 가져오기
  const router = useRouter();

  // 상태 관리
  const [caravan, setCaravan] = useState<Caravan | null>(null);
  const [loading, setLoading] = useState(true);
  
  // 예약 관련 상태
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. 카라반 상세 정보 불러오기
  useEffect(() => {
    if (!id) return;
    
    const fetchCaravan = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/caravans/${id}`);
        setCaravan(response.data);
      } catch (error) {
        console.error("카라반 정보 로딩 실패:", error);
        alert("카라반 정보를 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchCaravan();
  }, [id]);

  // 2. 날짜 변경 시 총 가격 자동 계산
  useEffect(() => {
    if (startDate && endDate && caravan) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // 날짜 차이 계산 (밀리초 단위 -> 일 단위 변환)
      const diffTime = end.getTime() - start.getTime();
      const diffDays = diffTime / (1000 * 3600 * 24);

      if (diffDays > 0) {
        // 🚨 [핵심 수정 1] pricePerNight -> pricePerDay로 변경
        setTotalPrice(diffDays * caravan.pricePerDay);
      } else {
        setTotalPrice(0);
      }
    }
  }, [startDate, endDate, caravan]);

  // 3. 예약 요청 핸들러
  const handleReservation = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    if (!startDate || !endDate) {
      alert("체크인 및 체크아웃 날짜를 선택해주세요.");
      return;
    }
    if (totalPrice <= 0) {
      alert("올바른 날짜 범위를 선택해주세요.");
      return;
    }

    // 로그인 확인 (localStorage)
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      alert("로그인이 필요한 서비스입니다.");
      router.push("/auth/login");
      return;
    }
    const user = JSON.parse(storedUser);

    if (confirm(`총 ${totalPrice.toLocaleString()}원으로 예약을 요청하시겠습니까?`)) {
      setIsSubmitting(true);
      try {
        // 예약 요청 API 호출
        await axios.post("http://localhost:3001/api/reservations", {
          caravanId: id, // ID는 이미 string (UUID)
          guestId: user.id, // Host ID와 동일하게 string (UUID)
          startDate,
          endDate,
          totalPrice,
        });

        alert("예약이 요청되었습니다! 호스트 승인을 기다리세요.");
        router.push("/my"); // 마이페이지로 이동

      } catch (error: any) {
        console.error("예약 실패:", error);
        if (error.response && error.response.status === 409) {
          alert("이미 예약된 날짜입니다. 다른 날짜를 선택해주세요.");
        } else {
          alert("예약 요청 중 오류가 발생했습니다.");
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (loading) return <div className="text-center py-20">로딩 중...</div>;
  if (!caravan) return <div className="text-center py-20">카라반을 찾을 수 없습니다.</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* 화면 레이아웃: 데스크탑에서는 3컬럼 중 2칸은 정보, 1칸은 예약창 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* --- [왼쪽] 카라반 상세 정보 --- */}
        <div className="md:col-span-2 space-y-6">
          {/* 이미지 영역 (임시 플레이스홀더) */}
          <div className="w-full h-80 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 text-lg">
            {caravan.images && caravan.images.length > 0 
              ? "이미지 슬라이더 들어갈 자리" 
              : "이미지 없음"}
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{caravan.name}</h1>
            <p className="text-gray-500 flex items-center">
              📍 {caravan.location}
            </p>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">카라반 소개</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {caravan.description}
            </p>
          </div>
          
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">호스트 정보</h2>
            <p className="text-gray-600">호스트 ID: {caravan.hostId}</p>
          </div>
        </div>

        {/* --- [오른쪽] 예약 위젯 (사이드바) --- */}
        <div className="md:col-span-1">
          <div className="sticky top-8 bg-white border border-gray-200 rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-end mb-6">
              <span className="text-2xl font-bold text-gray-900">
                {/* 🚨 [핵심 수정 2] pricePerNight -> pricePerDay로 변경 */}
                ₩{caravan.pricePerDay.toLocaleString()}
              </span>
              <span className="text-gray-500 mb-1">/ 1박</span>
            </div>

            <form onSubmit={handleReservation} className="space-y-4">
              <div className="border rounded-lg p-2">
                <div className="border-b p-2">
                  <label className="block text-xs font-bold text-gray-800 uppercase">체크인</label>
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full outline-none text-gray-600 mt-1"
                    required
                  />
                </div>
                <div className="p-2">
                  <label className="block text-xs font-bold text-gray-800 uppercase">체크아웃</label>
                  <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate} // 체크인 날짜 이후만 선택 가능
                    className="w-full outline-none text-gray-600 mt-1"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 rounded-lg text-white font-bold text-lg transition
                  ${isSubmitting 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-rose-600 hover:bg-rose-700"}`}
              >
                {isSubmitting ? "처리 중..." : "예약 요청하기"}
              </button>
            </form>

            {/* 가격 계산 결과 표시 */}
            {totalPrice > 0 && (
              <div className="mt-6 pt-4 border-t space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span className="underline">
                    {/* 🚨 [핵심 수정 3] pricePerNight -> pricePerDay로 변경 */}
                    ₩{caravan.pricePerDay.toLocaleString()} x {(totalPrice / caravan.pricePerDay)}박
                  </span>
                  <span>₩{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-gray-900 border-t pt-4 mt-2">
                  <span>총 합계</span>
                  <span>₩{totalPrice.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}