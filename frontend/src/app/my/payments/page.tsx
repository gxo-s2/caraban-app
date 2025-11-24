"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios"; // axios 대신 fetch를 사용해도 되지만, 일관성을 위해 axios를 사용합니다.

// 백엔드 데이터 타입 정의
type PaymentStatus = 'COMPLETED' | 'PENDING' | 'FAILED'; // Prisma Status와 일치하도록 정의

interface Caravan {
    name: string;
    location: string;
}

interface Reservation {
    id: string;
    caravan: Caravan;
}

interface Payment {
    id: string;
    amount: number;
    method: string;
    status: PaymentStatus;
    createdAt: string; // 결제일시 (Prisma의 기본 필드)
    reservation: Reservation;
}

export default function PaymentHistoryPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const router = useRouter();

    const API_URL = "http://localhost:3001/api/payments";

    useEffect(() => {
        // 1. 로그인 체크 및 userId 추출
        const userJson = localStorage.getItem("user");
        
        if (!userJson) {
            router.push("/auth/login");
            return;
        }
        
        try {
            const user = JSON.parse(userJson);
            // Host ID와 마찬가지로 UUID 문자열이므로 string으로 사용
            const extractedUserId = user.id; 
            
            if (!extractedUserId) {
                router.push("/auth/login"); 
                return;
            }
            
            setUserId(extractedUserId);
            fetchPayments(extractedUserId);
            
        } catch (e) {
            router.push("/auth/login");
        }
    }, [router]);


    async function fetchPayments(currentUserId: string) {
        try {
            // 🚨 [핵심 수정] URL 경로 오류 제거 및 userId를 쿼리 파라미터로만 정확하게 전달
            const res = await axios.get(`${API_URL}?userId=${currentUserId}`);
            
            if (res.status !== 200) {
                throw new Error('Failed to fetch payments.');
            }
            
            setPayments(res.data);
            
        } catch (err: any) {
            console.error("Payment Fetch Error:", err);
            setError("Failed to fetch payments. Check backend API or server status.");
        } finally {
            setLoading(false);
        }
    }

    // 상태에 따른 배지 스타일링
    const getStatusBadge = (status: PaymentStatus) => {
        let colorClass = "";
        switch (status) {
            case "COMPLETED":
                colorClass = "bg-green-100 text-green-800";
                break;
            case "PENDING":
                colorClass = "bg-yellow-100 text-yellow-800";
                break;
            case "FAILED":
                colorClass = "bg-red-100 text-red-800";
                break;
            default:
                colorClass = "bg-gray-100 text-gray-800";
        }
        return (
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}>
                {status}
            </span>
        );
    };


    if (loading) return <div className="text-center py-20">결제 이력을 불러오는 중...</div>;
    if (error) return <p className="text-center py-20 text-red-500 font-bold">{error}</p>;


    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">결제 이력 조회</h1>
            
            {payments.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-lg">결제 이력이 없습니다.</p>
                </div>
            ) : (
                <div className="overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">거래 ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">카라반 이름</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">결제 금액</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">결제일시</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {payments.map((payment) => (
                                <tr key={payment.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate max-w-xs">{payment.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {payment.reservation?.caravan?.name || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-600">
                                        ₩{payment.amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(payment.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(payment.status)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}