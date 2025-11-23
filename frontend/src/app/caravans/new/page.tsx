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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // In a real app, hostId would come from authenticated user session
  // For now, we'll get it from localStorage (set during login for demo purposes)
  const hostId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
  const userRole = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;

  if (userRole !== 'HOST') {
    // Optionally redirect or show an error if not a host
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-700">Only hosts can register caravans.</p>
          <Link href="/" className="mt-4 inline-block text-indigo-600 hover:underline">
            Go to Home
          </Link>
        </div>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!hostId) {
      setError('Host ID not found. Please log in as a host.');
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting to register caravan with:', { name, description, location, pricePerDay, capacity, hostId });

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
          hostId, // Attach hostId from localStorage
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Caravan registration failed.');
      }

      const newCaravan = await res.json();
      console.log('Caravan registered successfully:', newCaravan);

      router.push('/caravans'); // Redirect to caravan list page
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Register Your Caravan</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Caravan Name
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., Adventure Explorer"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Tell us about your caravan's features and amenities."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              id="location"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., Seoul, South Korea"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="pricePerDay" className="block text-sm font-medium text-gray-700">
              Price per Day ($)
            </label>
            <input
              type="number"
              id="pricePerDay"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., 100"
              value={pricePerDay}
              onChange={(e) => setPricePerDay(e.target.value)}
              required
              min="0"
            />
          </div>
          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
              Capacity (Number of people)
            </label>
            <input
              type="number"
              id="capacity"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., 4"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              required
              min="1"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register Caravan'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          <Link href="/caravans" className="font-medium text-indigo-600 hover:text-indigo-500">
            Cancel
          </Link>
        </p>
      </div>
    </main>
  );
}
