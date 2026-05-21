const test = async () => {
  try {
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'testuser123@example.com', password: 'password123' })
    });
    const loginData = await loginRes.json();
    const token = loginData.token;

    const searchRes = await fetch('http://localhost:5000/api/employees?search=[', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await searchRes.json();
    console.log("Search '[':", data);
  } catch (err) {
    console.error("Error:", err.message);
  }
};
test();
