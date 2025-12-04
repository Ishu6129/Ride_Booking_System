// Quick test file to manually verify ride request endpoint
// Run this in browser console after logging in as rider

const testRideRequest = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('❌ No token found! Please login first');
      return;
    }

    console.log('📝 Starting ride request test...');
    console.log('🔑 Token:', token.substring(0, 20) + '...');

    const requestData = {
      pickupLat: 28.7041,
      pickupLon: 77.1025,
      dropoffLat: 28.7589,
      dropoffLon: 77.1368,
      pickupAddress: 'Test Pickup',
      dropoffAddress: 'Test Dropoff',
      vehicleType: 'economy'
    };

    console.log('📍 Request data:', requestData);

    const response = await fetch('http://localhost:5000/api/rides/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestData)
    });

    console.log('📊 Response status:', response.status);

    const data = await response.json();
    console.log('📄 Response data:', data);

    if (response.ok) {
      console.log('✅ Success! Ride created:', data.ride._id);
      return data;
    } else {
      console.error('❌ Error response:', data);
      return null;
    }
  } catch (error) {
    console.error('❌ Fetch error:', {
      message: error.message,
      stack: error.stack
    });
  }
};

// Run the test
testRideRequest();
