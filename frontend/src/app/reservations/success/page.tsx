"use client";

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const ReservationSuccessContent = () => {
    const searchParams = useSearchParams();
    const reservationId = searchParams.get('reservationId');

    const handleCopy = () => {
        if (reservationId) {
            navigator.clipboard.writeText(reservationId)
                .then(() => alert('예약 번호가 클립보드에 복사되었습니다.'))
                .catch(err => console.error('Failed to copy text: ', err));
        }
    };

    if (!reservationId) {
        return (
            <div className="text-center">
                <h1 className="text-2xl font-bold text-red-500">오류</h1>
                <p className="mt-2 text-gray-600">예약 정보를 불러오지 못했습니다. 다시 시도해주세요.</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-10 text-center">
            <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <h1 className="text-3xl font-extrabold text-gray-800 mt-4">예약이 완료되었습니다!</h1>
            <p className="text-gray-600 mt-3 mb-6">고객님의 소중한 여행을 위해 최선을 다하겠습니다.</p>

            <div className="bg-gray-50 rounded-lg p-6 my-8">
                <p className="text-sm font-semibold text-gray-500 uppercase">Your Reservation ID</p>
                <p className="text-4xl font-mono font-bold text-indigo-600 my-2 break-all">{reservationId}</p>
                <p className="text-red-500 font-semibold mt-4">이 예약 번호를 꼭 메모해 두세요!</p>
            </div>

            <button
                onClick={handleCopy}
                className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300"
            >
                예약 번호 복사하기
            </button>
        </div>
    );
};


const ReservationSuccessPage = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <Suspense fallback={<div className="text-center">Loading...</div>}>
                <ReservationSuccessContent />
            </Suspense>
        </div>
    );
};

export default ReservationSuccessPage;
