'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ReservationStatus } from '@/types/backend-enums';

// Define types for data fetched from backend
type Caravan = {
  id: string;
  name: string;
  description: string;
  location: string;
  pricePerDay: number;
  capacity: number;
  hostId: string;
};

type Review = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  author: {
    name: string;
    profilePicture?: string;
  };
};

export default function CaravanDetailPage() {
  const { id } = useParams(); // Get caravan ID from dynamic route
  const router = useRouter();

  const [caravan, setCaravan] = useState<Caravan | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingCaravan, setLoadingCaravan] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [error, setError] = useState('');

  // States for Reservation
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reservationError, setReservationError] = useState('');
  const [submittingReservation, setSubmittingReservation] = useState(false);

  // States for Review
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Get user info from localStorage (for demo purposes)
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
  const userRole = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
  const isLoggedIn = !!userId;

  // Fetch Caravan Details
  useEffect(() => {
    if (!id) return;

    async function fetchCaravan() {
      try {
        const res = await fetch(`http://localhost:3001/api/caravans/${id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch caravan details.');
        }
        const data = await res.json();
        setCaravan(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoadingCaravan(false);
      }
    }

    async function fetchReviews() {
      try {
        const res = await fetch(`http://localhost:3001/api/reviews/caravan/${id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch reviews.');
        }
        const data = await res.json();
        setReviews(data);
      } catch (err: any) {
        setReviewError(err.message);
      } finally {
        setLoadingReviews(false);
      }
    }

    fetchCaravan();
    fetchReviews();
  }, [id]);

  // Handle Reservation Submission
  const handleReservationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReservation(true);
    setReservationError('');

    if (!isLoggedIn) {
      setReservationError('Please log in to make a reservation.');
      setSubmittingReservation(false);
      return;
    }

    if (!startDate || !endDate) {
      setReservationError('Please select both start and end dates.');
      setSubmittingReservation(false);
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      setReservationError('End date must be after start date.');
      setSubmittingReservation(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          caravanId: id,
          guestId: userId, // Assuming userId is available from localStorage
          startDate,
          endDate,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Reservation failed.');
      }

      const newReservation = await res.json();
      console.log('Reservation successful:', newReservation);
      alert('Reservation submitted successfully! You can view your pending reservations.');
      // Optionally redirect or show a success message
      setStartDate('');
      setEndDate('');
      // In a real app, you might refresh user's reservations or prompt for payment
    } catch (err: any) {
      setReservationError(err.message || 'An unexpected error occurred during reservation.');
    } finally {
      setSubmittingReservation(false);
    }
  };

  // Handle Review Submission
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);
    setReviewError('');

    if (!isLoggedIn) {
      setReviewError('Please log in to submit a review.');
      setSubmittingReview(false);
      return;
    }

    if (!reviewRating || !reviewComment) {
      setReviewError('Please provide both a rating and a comment.');
      setSubmittingReview(false);
      return;
    }
    
    if (typeof reviewRating !== 'number' || reviewRating < 1 || reviewRating > 5) {
      setReviewError('Rating must be a number between 1 and 5.');
      setSubmittingReview(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          caravanId: id,
          authorId: userId, // Assuming userId is available from localStorage
          rating: parseInt(reviewRating.toString(), 10), // Ensure rating is an integer
          comment: reviewComment,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Review submission failed.');
      }

      const newReview = await res.json();
      console.log('Review submitted successfully:', newReview);
      alert('Review submitted successfully!');
      // Refresh reviews list
      setReviews((prevReviews) => [newReview, ...prevReviews]);
      setReviewRating(0);
      setReviewComment('');
    } catch (err: any) {
      setReviewError(err.message || 'An unexpected error occurred during review submission.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loadingCaravan) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
        <p className="text-xl text-gray-700">Loading caravan details...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
        <p className="text-xl text-red-600">Error: {error}</p>
        <Link href="/caravans" className="mt-4 text-indigo-600 hover:underline">
          Back to Caravans
        </Link>
      </main>
    );
  }

  if (!caravan) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
        <p className="text-xl text-gray-700">Caravan not found.</p>
        <Link href="/caravans" className="mt-4 text-indigo-600 hover:underline">
          Back to Caravans
        </Link>
      </main>
    );
  }

  return (
    <main className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <Link href="/caravans" className="text-indigo-600 hover:underline mb-4 block">
          &larr; Back to all Caravans
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">{caravan.name}</h1>
        <p className="text-lg text-gray-600 mb-2">Location: {caravan.location}</p>
        <p className="text-xl font-semibold text-indigo-600 mb-4">
          ${caravan.pricePerDay}
          <span className="text-base font-normal text-gray-500"> / day</span>
        </p>
        <p className="text-gray-700 mb-4">{caravan.description}</p>
        <p className="text-gray-700 mb-6">Capacity: {caravan.capacity} people</p>

        {/* Reservation Section */}
        <section className="mb-8 p-6 bg-indigo-50 rounded-lg">
          <h2 className="text-2xl font-bold text-indigo-800 mb-4">Book Your Adventure</h2>
          {isLoggedIn ? (
            <form onSubmit={handleReservationSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
              {reservationError && <p className="text-red-500 text-sm md:col-span-2">{reservationError}</p>}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  disabled={submittingReservation}
                >
                  {submittingReservation ? 'Booking...' : 'Book Now'}
                </button>
              </div>
            </form>
          ) : (
            <p className="text-gray-700">
              <Link href="/login" className="text-indigo-600 hover:underline">Log in</Link> to make a reservation.
            </p>
          )}
        </section>

        {/* Reviews Section */}
        <section className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Reviews</h2>
          {isLoggedIn ? (
            <form onSubmit={handleReviewSubmit} className="space-y-4 mb-6">
              <h3 className="text-xl font-semibold text-gray-700">Write a Review</h3>
              <div>
                <label htmlFor="reviewRating" className="block text-sm font-medium text-gray-700">
                  Rating (1-5)
                </label>
                <input
                  type="number"
                  id="reviewRating"
                  min="1"
                  max="5"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={reviewRating}
                  onChange={(e) => setReviewRating(parseInt(e.target.value))}
                  required
                />
              </div>
              <div>
                <label htmlFor="reviewComment" className="block text-sm font-medium text-gray-700">
                  Comment
                </label>
                <textarea
                  id="reviewComment"
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  required
                ></textarea>
              </div>
              {reviewError && <p className="text-red-500 text-sm">{reviewError}</p>}
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                disabled={submittingReview}
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          ) : (
            <p className="text-gray-700 mb-6">
              <Link href="/login" className="text-indigo-600 hover:underline">Log in</Link> to submit a review.
            </p>
          )}

          {loadingReviews ? (
            <p className="text-gray-600">Loading reviews...</p>
          ) : reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center mb-2">
                    <div className="flex-shrink-0 mr-3">
                      {/* Placeholder for profile picture */}
                      <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-semibold">
                        {review.author.name ? review.author.name.charAt(0) : 'U'}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{review.author.name || 'Anonymous'}</p>
                      <p className="text-sm text-gray-500">Rating: {review.rating}/5</p>
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No reviews yet. Be the first to review!</p>
          )}
        </section>
      </div>
    </main>
  );
}
