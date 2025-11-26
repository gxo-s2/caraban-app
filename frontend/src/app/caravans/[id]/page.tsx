'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

// 타입 정의
interface Caravan {
  id: string;
  name: string;
  description: string;
  location: string;
  pricePerDay: number;
  capacity: number;
  images: string[];
  host: { name: string; id: string };
}

// 모달 컴포넌트
function PaymentModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  caravanName, 
  startDate, 
  endDate, 
  totalPrice 
}: any) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 m-4 animate-fade-in-up">
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <h3 className="text-xl font-bold text-gray-900">결제 확인</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-500 mb-1">예약 카라반</p>
            <p className="font-bold text-gray-800">{caravanName}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-500 mb-1">일정</p>
            <p className="font-medium text-gray-800">{startDate} ~ {endDate}</p>
          </div>

          <div className="bg-indigo-50 p-4 rounded-md flex justify-between items-center border border-indigo-100">
            <p className="text-indigo-700 font-medium">총 결제 금액</p>
            <p className="text-2xl font-bold text-indigo-700">
              {totalPrice.toLocaleString()}원
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">결제 수단</p>
            <div className="flex gap-4">
              <label className="flex items-center space-x-2 cursor-pointer border p-3 rounded-md w-full hover:bg-gray-50 transition-colors has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50">
                <input type="radio" name="payment" defaultChecked className="text-indigo-600 focus:ring-indigo-500" />
                <span className="text-sm font-medium">신용카드</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer border p-3 rounded-md w-full hover:bg-gray-50 transition-colors has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50">
                <input type="radio" name="payment" className="text-indigo-600 focus:ring-indigo-500" />
                <span className="text-sm font-medium">무통장입금</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-md font-bold hover:bg-indigo-700 transition-colors shadow-md"
          >
            결제하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CaravanDetailPage() {
  const [id, setId] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathSegments = window.location.pathname.split('/');
      const caravanId = pathSegments.pop() || pathSegments.pop(); 
      if (caravanId) {
        setId(caravanId);
      }
    }
  }, []);

  const [caravan, setCaravan] = useState<Caravan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [processing, setProcessing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchCaravan = async () => {
      try {
        // ✅ 다시 localhost로 변경 (가장 일반적인 설정)
        const res = await axios.get(`http://localhost:3001/api/caravans/${id}`);
        setCaravan(res.data);
      } catch (err: any) {
        console.error('카라반 로딩 에러:', err);
        // 연결 거부 에러일 때 사용자에게 명확히 알림
        if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
          setError('백엔드 서버(localhost:3001)에 연결할 수 없습니다. 서버가 켜져 있는지 확인해주세요.');
        } else {
          setError('카라반 정보를 불러올 수 없습니다.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCaravan();
  }, [id]);

  const calculateTotal = () => {
    if (!caravan || !startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    if (diffTime <= 0) return 0;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays * caravan.pricePerDay;
  };

  const handleOpenModal = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      alert('로그인이 필요합니다.');
      if (typeof window !== 'undefined') {
        window.location.href = `${window.location.origin}/auth/login`;
      }
      return;
    }
    if (!startDate || !endDate) {
      alert('체크인 및 체크아웃 날짜를 선택해주세요.');
      return;
    }
    if (calculateTotal() <= 0) {
      alert('올바른 날짜를 선택해주세요.');
      return;
    }
    setIsModalOpen(true);
  };

  const handlePaymentConfirm = async () => {
    if (!id) {
      alert('카라반 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    setProcessing(true);

    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) throw new Error('로그인 정보가 없습니다.');
      const user = JSON.parse(userStr);

      const payload = {
        caravanId: id,
        guestId: user.id,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        totalPrice: calculateTotal(), 
      };

      console.log('전송 데이터:', payload);

      // ✅ 예약 요청 (localhost:3001)
      await axios.post('http://localhost:3001/api/reservations', payload);

      setIsModalOpen(false);
      alert('🎉 예약 및 결제가 성공적으로 완료되었습니다!');
      
      if (typeof window !== 'undefined') {
        window.location.href = `${window.location.origin}/my/reservations`;
      }

    } catch (err: any) {
      console.error('예약 실패:', err);
      
      let errMsg = '알 수 없는 오류';
      if (err.code === 'ERR_NETWORK') {
        errMsg = '서버 연결 실패 (백엔드가 켜져 있나요?)';
      } else if (err.response?.data?.message) {
        errMsg = err.response.data.message;
      }
      
      alert(`예약 실패: ${errMsg}`);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="p-10 text-center">로딩 중...</div>;
  if (!caravan) return (
    <div className="p-10 text-center">
      <h2 className="text-xl font-bold mb-2">카라반을 찾을 수 없습니다.</h2>
      <p className="text-red-500 font-medium bg-red-50 p-3 rounded inline-block">
        {error || '알 수 없는 오류가 발생했습니다.'}
      </p>
    </div>
  );

  const totalPrice = calculateTotal();

  const mainImage = (caravan.images?.[0] && caravan.images[0].startsWith('http'))
    ? caravan.images[0]
    : `https://via.placeholder.com/1200x600?text=${encodeURIComponent(caravan.name)}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <PaymentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handlePaymentConfirm}
        caravanName={caravan.name}
        startDate={startDate}
        endDate={endDate}
        totalPrice={totalPrice}
      />

      <div className="w-full h-96 bg-gray-200 rounded-xl overflow-hidden mb-8 relative shadow-md">
        <img 
          src={mainImage} 
          alt={caravan.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{caravan.name}</h1>
            <p className="text-gray-500 flex items-center">
              📍 {caravan.location}
            </p>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">카라반 소개</h2>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {caravan.description}
            </p>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">호스트 정보</h2>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg">
                {caravan.host?.name?.[0] || 'H'}
              </div>
              <div className="ml-4">
                <p className="text-gray-900 font-medium">{caravan.host?.name || '알 수 없음'}</p>
                <p className="text-sm text-gray-500">호스트 ID: {caravan.host?.id}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 sticky top-24">
            <div className="flex justify-between items-end mb-6">
              <span className="text-2xl font-bold text-gray-900">
                {caravan.pricePerDay.toLocaleString()}원
              </span>
              <span className="text-gray-500 mb-1">/ 1박</span>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">체크인</label>
                <input 
                  type="date" 
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">체크아웃</label>
                <input 
                  type="date" 
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={handleOpenModal}
              disabled={processing || !startDate || !endDate}
              className={`w-full py-3 rounded-lg font-bold text-white transition-all shadow-md
                ${processing || !startDate || !endDate 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg transform hover:-translate-y-0.5'}`}
            >
              {processing ? '처리 중...' : '예약 및 결제하기'}
            </button>

            {startDate && endDate && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex justify-between mb-2 text-gray-600">
                  <span>{caravan.pricePerDay.toLocaleString()}원 × {Math.ceil(Math.abs(new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))}박</span>
                  <span>{totalPrice.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-gray-900 mt-2 pt-2 border-t border-gray-100">
                  <span>총 합계</span>
                  <span>{totalPrice.toLocaleString()}원</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}