// Define the type for a Caravan object based on our backend model
type Caravan = {
  id: string;
  name: string;
  description: string;
  location: string;
  pricePerDay: number;
  capacity: number;
  createdAt: string;
  updatedAt: string;
  hostId: string;
};

// Function to fetch caravan data from the backend API
async function getCaravans(): Promise<Caravan[]> {
  try {
    // Ensure the backend server is running to get a successful response
    const res = await fetch('http://localhost:3001/api/caravans', {
      cache: 'no-store', // Disable caching to get the latest data on every request
    });

    if (!res.ok) {
      // This will be caught by the nearest `error.js` Error Boundary
      throw new Error('Failed to fetch caravan data.');
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching caravans:', error);
    // In case of an error (e.g., backend not running), return an empty array
    // to prevent the page from crashing.
    return [];
  }
}


export default async function CaravansPage() {
  const caravans = await getCaravans();

  return (
    <main className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Explore Our Caravans</h1>
        
        {caravans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caravans.map((caravan) => (
              <div key={caravan.id} className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:-translate-y-2">
                {/* You can add an image here later */}
                {/* <img src="/placeholder.jpg" alt={caravan.name} className="w-full h-48 object-cover" /> */}
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{caravan.name}</h2>
                  <p className="text-md text-gray-600 mb-4">{caravan.location}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-xl font-semibold text-indigo-600">
                      ${caravan.pricePerDay}
                      <span className="text-sm font-normal text-gray-500"> / day</span>
                    </p>
                    <button className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-700">No Caravans Available</h2>
            <p className="text-gray-500 mt-2">
              Please check back later or make sure the backend server is running.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
