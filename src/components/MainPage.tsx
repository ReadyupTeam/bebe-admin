import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { InquiryItem } from '../\btypes';

function LoginModal({ onLogin, error }: { onLogin: (email: string, provider: string) => void, error: string | null }) {
  const [email, setEmail] = useState('');
  const [provider, setProvider] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, provider);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <form onSubmit={handleSubmit} style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '5px',
        width: '300px'
      }}>
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '80px 1fr',
          gap: '10px',
          alignItems: 'center'
        }}>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: '100%' }}
          />
          <label htmlFor="provider">Provider:</label>
          <input
            id="provider"
            type="text"
            value={provider}
            onChange={e => setProvider(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
}

function MainPage() {
  const [items, setItems] = useState<InquiryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      fetchData(accessToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, provider: string) => {
    try {
      const response = await fetch('http://localhost:3000/api/adminsign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, provider }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const { accessToken } = await response.json();
      localStorage.setItem('accessToken', accessToken);
      setIsLoggedIn(true);
      fetchData(accessToken);
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Login failed. Please try again.');
    }
  };

  const fetchData = async (accessToken: string) => {
    setIsLoading(true);
    setLoginError(null);
    try {
      const response = await fetch('http://localhost:3000/api/inquiry/admin', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setItems(data);
        setIsLoggedIn(true);
      } else {
        throw new Error('Received data is not an array');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoginError('Failed to fetch data. Please log in again.');
      handleLogout();
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setItems([]);
    localStorage.removeItem('accessToken');
  };

  if (isLoading) return <div>Loading...</div>;

  if (!isLoggedIn) {
    return <LoginModal onLogin={login} error={loginError} />;
  }

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Main Page</h1>
      <button onClick={handleLogout} style={{ marginBottom: '10px' }}>Logout</button>
      {items.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <table style={{ borderCollapse: 'separate', borderSpacing: '0 10px' }}>
          <thead>
            <tr>
              <th style={{ paddingRight: '50px' }}>Title</th>
              <th style={{ textAlign: 'center', width: '100px' }}>Has Reply</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td style={{ paddingRight: '50px' }}>
                  <Link to={`/detail/${item.id}`}>{item.title}</Link>
                </td>
                <td style={{ textAlign: 'center' }}>{item.reply ? '✓' : '✗'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MainPage;