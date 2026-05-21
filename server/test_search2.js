const test = async () => {
  try {
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'testuser123@example.com', password: 'password123' })
    });
    const loginData = await loginRes.json();
    const token = loginData.token;

    const emptySearchRes = await fetch('http://localhost:5000/api/employees?search=', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const emptyData = await emptySearchRes.json();
    console.log("Employees:", emptyData.employees.map(e => e.name));
  } catch (err) {
    console.error("Error:", err.message);
  }
};
test();
