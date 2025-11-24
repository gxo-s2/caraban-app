"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// 타입 정의 (백엔드 응답 구조와 일치해야 합니다.)
type ReservationStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

interface Caravan {
  id: string;
  name: string;
  location: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface Reservation {
  id: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: ReservationStatus;
  caravan: Caravan; // include 된 카라반 정보
  guest: User;    // include 된 게스트 정보
  hostId: string;
}

export default function HostReservationPage() {
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hostUser, setHostUser] = useState<User & { role: string } | null>(null);

  // 백엔드 API 주소
  const API_URL = "http://localhost:3001/api/reservations";

  useEffect(() => {
    // 1. 로그인 및 권한 체크
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      alert("로그인이 필요합니다.");
      router.push("/auth/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    
    if (parsedUser.role !== "HOST") {
      alert("호스트만 접근할 수 있습니다.");
      router.push("/");
      return;
    }

    setHostUser(parsedUser);
    
    // 2. 예약 목록 로드 시작
    fetchReservations(parsedUser.id);

  }, [router]);

  // 예약 목록 조회 함수
  const fetchReservations = async (hostId: string) => {
    setLoading(true);
    try {
      // 🚨 [핵심] 새로 구현한 호스트용 API 호출: GET /api/reservations/host/:hostId
      const response = await axios.get(`${API_URL}/host/${hostId}`);
      
      setReservations(response.data);
      
    } catch (err: any) {
      console.error("예약 목록 로딩 실패:", err);
      setError(`예약 정보를 불러오는데 실패했습니다. (Error: ${err.response?.status || err.message})`);
    } finally {
      setLoading(false);
    }
  };

  // 예약 상태 변경 핸들러 (승인 또는 거절) - PATCH API가 구현되었다고 가정
  const handleUpdateStatus = async (reservationId: string, newStatus: "CONFIRMED" | "CANCELLED") => {
    const action = newStatus === "CONFIRMED" ? "승인" : "거절";
    if (!confirm(`예약을 ${action}하시겠습니까?`)) return;

    try {
      // PATCH /api/reservations/:id/status API 호출 (추후 구현 예정)
      await axios.patch(`${API_URL}/${reservationId}/status`, {
        status: newStatus,
        hostId: hostUser?.id, // 권한 검증을 위해 호스트 ID 전송
      });

      alert(`예약이 성공적으로 ${action}되었습니다.`);
      
      // 상태 업데이트 후 목록 새로고침
      if (hostUser) fetchReservations(hostUser.id);
      
    } catch (err: any) {
      console.error(`${action} 실패:`, err);
      alert(`예약 ${action} 처리에 실패했습니다. (오류: ${err.response?.data?.message || err.message})`);
    }
  };

  // 상태에 따른 배지 스타일링
  const getStatusBadge = (status: ReservationStatus) => {
    let colorClass = "";
    let statusText = "";

    switch (status) {
      case "PENDING":
        colorClass = "bg-yellow-100 text-yellow-800";
        statusText = "대기 중";
        break;
      case "CONFIRMED":
        colorClass = "bg-green-100 text-green-800";
        statusText = "예약 확정";
        break;
      case "CANCELLED":
        colorClass = "bg-red-100 text-red-800";
        statusText = "예약 취소";
        break;
      default:
        colorClass = "bg-gray-100 text-gray-800";
        statusText = "알 수 없음";
    }
    return (
      <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${colorClass}`}>
        {statusText}
      </span>
    );
  };

  if (loading) return <div className="text-center py-20">예약 목록을 불러오는 중...</div>;
  if (error) return <p className="text-center py-20 text-red-500 font-bold">오류: {error}</p>;
  if (!hostUser) return null; // 로딩 중 권한 없는 경우

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        카라반 예약 관리 대시보드 ({hostUser.name}님)
      </h1>

      {reservations.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">내 카라반에 들어온 예약 요청이 없습니다.</p>
          <p className="text-sm text-gray-400 mt-2">새로운 예약 요청이 들어오면 여기에 표시됩니다.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reservations.map((reservation) => (
            <div
              key={reservation.id}
              className="bg-white border border-gray-200 rounded-xl shadow-md p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center hover:shadow-lg transition"
            >
              {/* 예약 정보 영역 */}
              <div className="flex-1 space-y-2 lg:space-y-0 lg:flex lg:space-x-8 items-center w-full">
                
                {/* 상태 배지 */}
                <div className="lg:w-32 flex-shrink-0 mb-3 lg:mb-0">
                  {getStatusBadge(reservation.status)}
                </div>

                {/* 상세 내용 */}
                <div className="flex-1 min-w-0">
                    <p className="text-lg font-semibold text-gray-800 truncate">{reservation.caravan.name}</p>
                    <p className="text-sm text-gray-500">
                        <span className="font-medium text-gray-700">게스트:</span> {reservation.guest?.name || "익명"} ({reservation.guest?.email})
                    </p>
                    <p className="text-sm text-gray-500">
                        <span className="font-medium text-gray-700">기간:</span> {new Date(reservation.startDate).toLocaleDateString()} ~ {new Date(reservation.endDate).toLocaleDateString()}
                    </p>
                </div>

                {/* 가격 정보 */}
                <div className="lg:w-40 flex-shrink-0 text-left lg:text-right mt-3 lg:mt-0">
                    <p className="text-sm font-medium text-gray-500">총 금액</p>
                    <p className="text-xl font-bold text-green-600">₩{reservation.totalPrice.toLocaleString()}</p>
                </div>
              </div>

              {/* 액션 버튼 영역 */}
              <div className="mt-5 lg:mt-0 flex flex-col space-y-2 lg:flex-row lg:space-x-2 lg:space-y-0 flex-shrink-0">
                {reservation.status === "PENDING" ? (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(reservation.id, "CONFIRMED")}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition w-full lg:w-auto"
                    >
                      예약 승인
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(reservation.id, "CANCELLED")}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition w-full lg:w-auto"
                    >
                      예약 거절
                    </button>
                  </>
                ) : (
                  <button
                    disabled
                    className="bg-gray-100 text-gray-500 px-4 py-2 rounded-lg text-sm cursor-not-allowed w-full lg:w-auto"
                  >
                    처리 완료
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}