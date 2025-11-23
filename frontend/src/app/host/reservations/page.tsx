'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // useRouter import 추가
import axios from 'axios'; // axios import 추가

// 🚨 [수정 1] import ReservationStatus from '@/types/backend-enums' 라인 삭제됨

// 상태 관리를 위한 타입 정의
type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

type User = {
    id: string; // UUID string
    name: string;
    email: string;
    role: string;
};

type Reservation = {
    id: string;
    startDate: string;
    endDate: string;
    totalPrice: number;
    status: ReservationStatus; // 로컬 정의 타입 사용
    hostId: string;
    guest: { name: string; email: string; };
    caravan: { name: string; id: string; };
};

// Helper to format dates
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Helper to get status badge colors (ReservationStatus 대신 string literal 사용)
const getStatusBadgeColor = (status: ReservationStatus) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'CONFIRMED':
      return 'bg-green-100 text-green-800';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function HostReservationsPage() {
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hostUser, setHostUser] = useState<User | null>(null);

  // 백엔드 API 주소
  const API_URL = 'http://localhost:3001/api/reservations';

  // 🚨 [수정 2] 로그인 상태 확인 및 데이터 로딩 로직
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
        setError('Host ID not found. Please log in as a host.');
        setLoading(false);
        router.push('/auth/login');
        return;
    }

    const parsedUser: User = JSON.parse(storedUser);

    if (parsedUser.role !== 'HOST') {
        setError('Access Denied. You must be logged in as a host.');
        setLoading(false);
        router.push('/');
        return;
    }
    
    // 호스트 정보 설정 및 데이터 로딩 시작
    setHostUser(parsedUser);
    fetchHostReservations(parsedUser.id);
  }, [router]);


  async function fetchHostReservations(hostId: string) {
    setLoading(true);
    try {
        // 백엔드에 호스트 ID를 기반으로 필터링된 예약 목록을 요청합니다.
        // 임시 로직: /api/reservations/host/:hostId 엔드포인트가 있다고 가정합니다.
      const res = await axios.get(`${API_URL}/host/${hostId}`); 
      
      if (res.status !== 200) {
        throw new Error('Failed to fetch reservations.');
      }
      
      setReservations(res.data);
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch reservations. Check backend API logs (GET /api/reservations/host/:id).');
    } finally {
      setLoading(false);
    }
  }

  const handleStatusUpdate = async (reservationId: string, status: ReservationStatus) => {
    if (!confirm(`예약을 ${status === 'CONFIRMED' ? '승인' : '거절'}하시겠습니까?`)) return;

    try {
      // 상태 업데이트 API 호출
      const res = await axios.patch(`${API_URL}/${reservationId}/status`, {
        status: status,
        hostId: hostUser?.id // 권한 검증용 hostId 전송
      });

      if (res.status !== 200) {
        throw new Error('Failed to update reservation status.');
      }

      // 로컬 상태 업데이트
      setReservations(reservations.map(r => 
        r.id === reservationId ? { ...r, status: status } : r
      ));
      alert(`예약이 ${status === 'CONFIRMED' ? '승인' : '거절'}되었습니다.`);
      
    } catch (err: any) {
      console.error(err);
      alert(`Error updating status: ${err.response?.data?.message || err.message}`);
    }
  };
  
  // Guard Clauses (로딩/에러/권한 체크)
  if (loading) return <p className="text-center mt-20">Loading reservations...</p>;
  if (error) return <p className="text-center mt-20 text-red-500 font-bold">{error}</p>;

  if (!hostUser || hostUser.role !== 'HOST') {
     return (
      <main className="bg-gray-50 min-h-screen p-8">
        <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
            <p className="mt-2 text-gray-600">You must be logged in as a host to view this page.</p>
        </div>
      </main>
    );
  }


  return (
    <main className="bg-gray-50 min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">예약 관리 ({hostUser.name}님)</h1>
        
        {reservations.length === 0 && (
          <p className="text-gray-500">No reservations found for your caravans.</p>
        )}

        <div className="bg-white shadow overflow-hidden rounded-lg mt-4">
          <ul className="divide-y divide-gray-200">
            {reservations.map((reservation) => (
              <li key={reservation.id} className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-indigo-600 truncate">{reservation.caravan.name}</p>
                    <p className="mt-1 text-sm text-gray-700">
                      <span className="font-medium">Guest:</span> {reservation.guest.name} ({reservation.guest.email})
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {formatDate(reservation.startDate)} - {formatDate(reservation.endDate)}
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-4 flex flex-col items-end space-y-2">
                    <p className="font-semibold">₩{reservation.totalPrice.toLocaleString()}</p>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(reservation.status)}`}>
                      {reservation.status}
                    </span>
                  </div>
                </div>
                {reservation.status === 'PENDING' && (
                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      onClick={() => handleStatusUpdate(reservation.id, 'CONFIRMED')}
                      className="px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                    >
                      승인
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(reservation.id, 'CANCELLED')}
                      className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                    >
                      거절
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}