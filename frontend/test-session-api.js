// Frontend Debug Test - Paste this in browser console
// This will test the session API call and show detailed logs

async function testSessionAPI() {
    console.log('=== Frontend Session API Test ===');
    
    // Get stored values
    const token = localStorage.getItem('accessToken');
    const sessionId = localStorage.getItem('sessionId');
    
    console.log('Stored token:', token ? `${token.substring(0, 50)}...` : 'Missing');
    console.log('Stored sessionId:', sessionId || 'Missing');
    
    if (!token) {
        console.error('No access token found - please login first');
        return;
    }
    
    if (!sessionId) {
        console.error('No session ID found - please login first');
        return;
    }
    
    // Prepare headers
    const headers = {
        'Authorization': token,
        'X-Session-ID': sessionId,
        'Content-Type': 'application/json'
    };
    
    console.log('Request headers to be sent:', headers);
    
    try {
        const response = await fetch('http://localhost:8000/api/v1/users/sessions', {
            method: 'GET',
            headers: headers,
            credentials: 'include'
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        const data = await response.json();
        console.log('Response data:', data);
        
        if (response.ok) {
            console.log('✅ Success! Sessions found:', data.data?.length || 0);
        } else {
            console.error('❌ Error:', data.message);
        }
    } catch (error) {
        console.error('❌ Network error:', error);
    }
    
    console.log('=== Test Complete ===');
}

testSessionAPI();
