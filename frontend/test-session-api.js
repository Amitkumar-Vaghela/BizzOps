import axios from "axios";

async function testSessionAPI() {
    console.log('=== Frontend Session API Test ===');

    const sessionId = localStorage.getItem('sessionId');
    console.log('Stored sessionId:', sessionId || 'Missing');

    if (!sessionId) {
        console.error('No session ID found - please login first');
        return;
    }

    // Optional: add session ID in a custom header (if backend uses it)
    const headers = {
        'X-Session-ID': sessionId,
        'Content-Type': 'application/json'
    };

    console.log('Request headers to be sent:', headers);

    try {
        const response = await axios.get('http://localhost:8000/api/v1/users/sessions', {
            headers: headers,
            withCredentials: true, // 🔥 this sends cookies like session tokens
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        console.log('Response data:', response.data);

        if (response.status === 200) {
            console.log('✅ Success! Sessions found:', response.data.data?.length || 0);
        } else {
            console.error('❌ Error:', response.data.message);
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('❌ Axios error:', error.response?.data || error.message);
        } else {
            console.error('❌ Unknown error:', error);
        }
    }

    console.log('=== Test Complete ===');
}

testSessionAPI();
