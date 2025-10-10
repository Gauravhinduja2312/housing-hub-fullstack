import React, { useState } from 'react';

const MinimalLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Crucial: Prevent default form submission (page refresh)
    console.log("MinimalLogin: Form submitted."); // Diagnostic log
    setError('');
    setLoading(true);

    try {
      console.log("MinimalLogin: Sending login request to http://localhost:3001/api/login with email:", email);
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        console.log("MinimalLogin: Login successful!", data);
        alert('Login successful! Check console for user data.'); // Use alert for immediate feedback
        // In a real app, you'd store token/user data and navigate
      } else {
        console.error("MinimalLogin: Login API error response:", data);
        setError(data.message || 'Login failed. Invalid credentials.');
      }
    } catch (networkError) {
      console.error("MinimalLogin: Network error during login:", networkError);
      setLoading(false);
      setError('Network error: Could not reach backend. Is it running on http://localhost:3001?');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-2xl border border-gray-200 animate-fade-in">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Minimal Login Test</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-6" role="alert">
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-lg font-medium mb-2" htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              required
              className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-lg transition duration-200"
              placeholder="test@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-lg font-medium mb-2" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-lg transition duration-200"
              placeholder="password123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-semibold rounded-full text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 shadow-lg transform hover:scale-105"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Test Login'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MinimalLogin;
