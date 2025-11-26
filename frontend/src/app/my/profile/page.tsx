"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
// User 타입이 '@/types/user'에서 올바르게 import 되었다고 가정합니다.
import { User } from '@/types/user'; 

// 🚨 API_BASE_URL 상수를 제거하고 상대 경로를 사용하여 Next.js 프록시 설정을 활용합니다.
// 백엔드 경로가 'http://localhost:3001/api/users'라고 가정하면, 
// 프론트에서는 '/api/users'로 요청을 보냅니다.
const API_PREFIX = '/api/users'; // Next.js가 3001로 프록시해주기를 기대합니다.

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false); // Alert 대신 사용할 상태
  const router = useRouter();

  // 1. 사용자 정보 조회 (GET /api/users/:id)
  useEffect(() => {
    const fetchUser = async () => {
      // 🚨 [중요: LocalStorage 대신 Firebase 사용 권장]
      // 실제 프로덕션 환경에서는 localStorage 대신 안전한 인증 및 Firestore를 사용해야 합니다.
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        router.push('/auth/login');
        return;
      }

      const { id: userId } = JSON.parse(storedUser);
      if (!userId) {
        router.push('/auth/login');
        return;
      }

      try {
        // ✅ 수정된 경로: 상대 경로 사용. Next.js가 설정된 프록시 규칙에 따라 
        // 이 요청을 'http://localhost:3001/api/users/{userId}'로 전달할 것입니다.
        const response = await axios.get(`${API_PREFIX}/${userId}`);
        
        // Next.js 개발 서버를 사용하고 있다면, `response.status !== 200` 검사는 Axios의
        // catch 블록에서 처리되므로 제거하거나 2xx 코드만 검사하는 것이 좋습니다.
        
        const data: User = response.data;
        setUser(data);
        setName(data.name);
        setContactNumber(data.contactNumber || '');
        
      } catch (err: any) {
        console.error('Fetch Error (404 Likely):', err);
        // 404/500 에러 처리
        setError(err.response?.data?.message || 'Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  // 2. 사용자 정보 업데이트 (PATCH /api/users/:id)
  const handleUpdate = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // ✅ 수정된 경로: 상대 경로 사용
      const response = await axios.patch(`${API_PREFIX}/${user.id}`, {
        name,
        contactNumber,
      });

      const updatedUser: User = response.data;
      
      // LocalStorage 업데이트
      const currentStoredUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({
        ...currentStoredUser,
        name: updatedUser.name,
        contactNumber: updatedUser.contactNumber,
      }));

      // UI 상태 업데이트
      setUser(updatedUser);
      setName(updatedUser.name);
      setContactNumber(updatedUser.contactNumber || '');
      setIsEditing(false);
      setShowUpdateSuccess(true); // 성공 알림 표시
      setTimeout(() => setShowUpdateSuccess(false), 3000); // 3초 후 숨김

    } catch (err: any) {
      console.error('Update Error:', err);
      setError(err.response?.data?.message || 'An unknown error occurred during update.');
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------------------------
  // 렌더링 로직
  // ----------------------------------------------------------------------
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // 🚨 [수정 3] 에러 발생 시 UI 개선: Failed to fetch user data 메시지 표시
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-600 bg-red-100 p-6 rounded-lg shadow-xl text-center">
          <p className="text-xl font-bold mb-2">Error</p>
          <p className="text-lg">{error}</p>
          <p className="mt-4 text-sm text-red-500">
            (Hint: 백엔드 서버가 'http://localhost:3001'에서 실행 중인지, 
            API 경로 '{API_PREFIX}/{user?.id || 'ID'}'가 유효한지 확인하세요.)
          </p>
          <button 
             onClick={() => router.push('/')}
             className="mt-3 text-white bg-red-500 hover:bg-red-700 py-1 px-3 rounded-md"
          >
             Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; 
  }

  return (
    <div className="container mx-auto px-4 py-8 relative">
      {/* 성공 알림 모달/메시지 */}
      {showUpdateSuccess && (
        <div className="absolute top-0 right-0 mt-4 mr-4 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg transition duration-300">
          프로필이 성공적으로 업데이트되었습니다.
        </div>
      )}

      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
        {user.name} 님의 프로필
      </h1>
      <div className="bg-white shadow-2xl border border-gray-100 rounded-xl p-8 max-w-lg mx-auto transform transition duration-500 hover:scale-[1.01]">
        <div className="space-y-6">
          <ProfileField label="Name" isEditing={isEditing} value={name}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
            />
          </ProfileField>

          <ProfileField label="Email" isEditing={false} value={user.email}>
            <p className="text-gray-900 font-medium">{user.email}</p>
          </ProfileField>

          <ProfileField label="Contact Number" isEditing={isEditing} value={contactNumber}>
            <input
              type="text"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className="mt-1 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
            />
          </ProfileField>

          <ProfileField label="Rating" isEditing={false} value={user.rating}>
            <p className="text-gray-900 font-medium">{user.rating ? `${user.rating.toFixed(1)} / 5.0` : 'No ratings yet'}</p>
          </ProfileField>

          <div className="pt-2">
            <label className="block text-sm font-semibold text-gray-600 mb-2">Identity Verification</label>
            <span
              className={`px-3 py-1 text-xs font-bold leading-tight rounded-full shadow ${
                user.isVerified ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
              }`}
            >
              {user.isVerified ? 'Verified' : 'Pending Verification'}
            </span>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end space-x-4 border-t pt-6">
          {isEditing ? (
            <>
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-150 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => { setIsEditing(false); setName(user.name); setContactNumber(user.contactNumber || ''); }}
                disabled={loading}
                className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-150 disabled:opacity-50"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-150"
              >
                Edit Profile
              </button>
              <button
                onClick={() => window.location.href = '/my/payments'}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-150"
              >
                결제 내역 보러가기
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// 재사용 가능한 필드 컴포넌트
const ProfileField = ({ label, isEditing, children, value }: { label: string, isEditing: boolean, children: React.ReactNode, value: any }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-600 mb-1">{label}</label>
    {isEditing ? children : (
      <p className="text-gray-900 font-medium bg-gray-50 p-2 rounded-md border border-gray-200">{value}</p>
    )}
  </div>
);

export default ProfilePage;