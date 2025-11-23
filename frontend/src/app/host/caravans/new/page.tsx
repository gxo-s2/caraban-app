'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterCaravanPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [pricePerDay, setPricePerDay] = useState('');
  const [capacity, setCapacity] = useState('');
  const [hostId, setHostId] = useState(''); // Test-purpose host ID input
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!hostId) {
      setError('Host ID is required for testing.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/caravans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          location,
          pricePerDay: parseFloat(pricePerDay),
          capacity: parseInt(capacity, 10),
          hostId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Caravan registration failed.');
      }

      alert('등록 성공!'); // Show success alert
      router.push('/'); // Redirect to main page
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">내 카라반 등록하기</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Caravan Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              카라반 이름
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              설명
            </label>
            <textarea
              id="description"
              rows={4}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              위치
            </label>
            <input
              type="text"
              id="location"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          {/* Price per Day */}
          <div>
            <label htmlFor="pricePerDay" className="block text-sm font-medium text-gray-700">
              1박 가격
            </label>
            <input
              type="number"
              id="pricePerDay"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={pricePerDay}
              onChange={(e) => setPricePerDay(e.target.value)}
              required
              min="0"
            />
          </div>
          {/* Capacity */}
          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
              수용 인원
            </label>
            <input
              type="number"
              id="capacity"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              required
              min="1"
            />
          </div>
          {/* Host ID (for testing) */}
          <div>
            <label htmlFor="hostId" className="block text-sm font-medium text-gray-700">
              Host ID (테스트용)
            </label>
            <input
              type="text"
              id="hostId"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your Host ID"
              value={hostId}
              onChange={(e) => setHostId(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? '등록 중...' : '등록하기'}
          </button>
        </form>
      </div>
    </main>
  );
}
