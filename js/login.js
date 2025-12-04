document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // prevent normal form submission

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (res.redirected) {
        // If server sends redirect, follow it
        window.location.href = res.url;
        return;
      }

      const data = await res.json();

      if (data.message === 'Login successful') {
        // Redirect manually
        window.location.href = '/dashboard';
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      alert('Login error');
    }
  });
});
