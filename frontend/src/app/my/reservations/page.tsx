'use client'; // ✅ 이 선언은 반드시 파일의 맨 꼭대기에 있어야 합니다.

import { useEffect, useState } from 'react';
import axios from 'axios';
// import Link from 'next/link'; // 오류 발생으로 제거하고 a 태그로 대체

// 예약 데이터 타입 정의
interface Reservation {
  id: string; // 예약 번호 (UUID)
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  caravan: {
    id: string;
    name: string;
    location: string;
    pricePerDay: number;
    images: string[];
  };
}

export default function MyReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 데이터 불러오기
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        // 로컬 스토리지에서 유저 정보 가져오기
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          setError('로그인이 필요합니다.');
          setLoading(false);
          return;
        }

        const user = JSON.parse(userStr);
        // API 요청
        const response = await axios.get(`/api/reservations/user/${user.id}`);
        setReservations(response.data);
      } catch (err: any) {
        console.error('예약 불러오기 실패:', err);
        setError('예약 내역을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  // ✅ 예약 번호 복사 핸들러
  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id).then(() => {
      alert(`예약 번호가 복사되었습니다!\n${id}`);
    }).catch(() => {
      alert('복사에 실패했습니다. 직접 복사해 주세요.');
    });
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // 가격 포맷팅 함수
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(price);
  };

  // 상태 뱃지 컴포넌트
  const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    const labels = {
      PENDING: '대기중',
      CONFIRMED: '예약 확정',
      CANCELLED: '취소됨',
    };

    const statusKey = status as keyof typeof styles;

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[statusKey] || 'bg-gray-100 text-gray-800'}`}>
        {labels[statusKey] || status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold mb-6">내 예약 목록</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse h-80">
              <div className="bg-gray-200 h-40 rounded-md mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold mb-8">내 예약 목록</h1>

      {error ? (
        <div className="text-center py-20">
          <p className="text-red-500 mb-4">{error}</p>
          <a href="/auth/login" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            로그인 페이지로
          </a>
        </div>
      ) : reservations.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500 text-lg mb-6">아직 예약된 여행이 없습니다.</p>
          <a href="/caravans" className="px-6 py-3 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition-colors">
            카라반 구경하러 가기
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              
              {/* 카드 이미지 영역 */}
              <div className="relative h-48 bg-gray-200">
                <img
                  // ✅ [수정됨] 안전한 접근: images가 없거나(undefined) 비어있어도 에러 없이 기본 이미지를 보여줍니다.
                  src={reservation.caravan.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                  alt={reservation.caravan.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <StatusBadge status={reservation.status} />
                </div>
              </div>

              {/* 카드 내용 영역 */}
              <div className="p-5">
                {/* ✅ 예약 번호 및 복사 버튼 */}
                <div className="flex items-center justify-between mb-3 bg-gray-50 p-2 rounded-md">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">Reservation ID</span>
                    <span className="text-xs font-mono text-gray-700 truncate w-40" title={reservation.id}>
                      {reservation.id}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyId(reservation.id)}
                    className="text-gray-400 hover:text-indigo-600 transition-colors p-1"
                    title="예약 번호 복사"
                  >
                    {/* 복사 아이콘 (SVG) */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-3.5m7.5-10.375H9.375a1.125 1.125 0 01-1.125-1.125v-3.5" />
                    </svg>
                    <span className="text-xs ml-1">복사</span>
                  </button>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-1">{reservation.caravan.name}</h3>
                <p className="text-sm text-gray-500 mb-4 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {reservation.caravan.location}
                </p>

                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">예약 날짜</span>
                    <span className="text-gray-900 font-medium">
                      {formatDate(reservation.startDate)} ~ {formatDate(reservation.endDate)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">총 결제 금액</span>
                    <span className="text-indigo-600 font-bold text-lg">
                      {formatPrice(reservation.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}