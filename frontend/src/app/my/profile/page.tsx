"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// User 타입이 '@/types/user'에서 올바르게 import 되었다고 가정합니다.
import { User } from '@/types/user'; 
import axios from 'axios'; // fetch 대신 axios를 사용하여 오류 처리의 일관성을 확보합니다.

// 백엔드 서버 주소 (모든 API 호출에 사용)
const API_BASE_URL = 'http://localhost:3001/api/users'; 

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  // 1. 사용자 정보 조회 (GET /api/users/:id)
  useEffect(() => {
    const fetchUser = async () => {
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
        // 🚨 [수정 1] 절대 경로로 변경: http://localhost:3001/api/users/${userId}
        const response = await axios.get(`${API_BASE_URL}/${userId}`);
        
        if (response.status !== 200) {
          throw new Error('Failed to fetch user data');
        }
        
        const data: User = response.data;
        setUser(data);
        setName(data.name);
        setContactNumber(data.contactNumber || '');
        
      } catch (err: any) {
        console.error('Fetch Error:', err);
        // 404/500 에러 메시지 처리
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
    setLoading(true); // 업데이트 중 로딩 상태 활성화

    try {
      const response = await axios.patch(`${API_BASE_URL}/${user.id}`, {
        name,
        contactNumber,
      });

      if (response.status !== 200) {
        throw new Error('Failed to update user data');
      }

      const updatedUser: User = response.data;
      
      // LocalStorage도 업데이트 (이름, 연락처)
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
      alert("프로필이 성공적으로 업데이트되었습니다.");

    } catch (err: any) {
      console.error('Update Error:', err);
      setError(err.response?.data?.message || 'An unknown error occurred during update.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500 font-bold text-xl p-8">{error}</div>;
  }

  if (!user) {
    return null; 
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      <div className="bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          ) : (
            <p className="text-gray-900 font-medium">{user.name}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <p className="text-gray-900">{user.email}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Contact Number</label>
          {isEditing ? (
            <input
              type="text"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          ) : (
            <p className="text-gray-900">{user.contactNumber || 'Not provided'}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Rating</label>
          {/* 🚨 [수정 2] user.rating이 없을 경우 오류 방지 처리 */}
          <p className="text-gray-900">{user.rating ? `${user.rating.toFixed(1)} / 5.0` : 'No ratings yet'}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Identity Verification</label>
          <span
            className={`px-3 py-1 text-sm font-semibold leading-tight rounded-full ${
              user.isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {user.isVerified ? 'Verified' : 'Not Verified'}
          </span>
        </div>
        <div className="mt-6">
          {isEditing ? (
            <>
              <button
                onClick={handleUpdate}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-3"
              >
                Save Changes
              </button>
              <button
                onClick={() => { setIsEditing(false); setName(user.name); setContactNumber(user.contactNumber || ''); }}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
