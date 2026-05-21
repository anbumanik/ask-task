const test = async () => {
  try {
    const email = 'testuser123@example.com';
    const password = 'password123';
    
    console.log("Registering user...");
    const regRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email,
        password,
      })
    });
    const regData = await regRes.json();
    console.log("Register response:", regRes.status, regData);

    console.log("Logging in...");
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
      })
    });
    const loginData = await loginRes.json();
    console.log("Login response:", loginRes.status, loginData);
  } catch (err) {
    console.error("Error:", err.message);
  }
};

test();
