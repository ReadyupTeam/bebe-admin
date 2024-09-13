import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { InquiryItem } from '../\btypes';

function LoginModal({ onLogin, error }: { onLogin: (id: string, pw: string) => void, error: string | null }) {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(id, pw);
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
        width: '300px' // 폼의 너비를 고정
      }}>
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '80px 1fr', // 레이블과 입력 필드의 너비 비율
          gap: '10px',
          alignItems: 'center'
        }}>
          <label htmlFor="id">ID:</label>
          <input
            id="id"
            type="text"
            value={id}
            onChange={e => setId(e.target.value)}
            style={{ width: '100%' }}
          />
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={pw}
            onChange={e => setPw(e.target.value)}
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = sessionStorage.getItem('sessionId');
    const sessionPw = sessionStorage.getItem('sessionPw');
    if (sessionId && sessionPw) {
      fetchData(sessionId, sessionPw);
    }
  }, []);

  const fetchData = (id: string, pw: string) => {
    setIsLoading(true);
    setLoginError(null);
    fetch(`http://localhost:3000/api/inquiry/admin?id=${id}&pw=${pw}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Login failed`);
        }
        return response.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setItems(data);
          setIsLoggedIn(true);
          // 로그인 성공 시 세션에 저장
          sessionStorage.setItem('sessionId', id);
          sessionStorage.setItem('sessionPw', pw);
        } else {
          throw new Error('Received data is not an array');
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoginError(error.message);
        // 로그인 실패 시 세션 정보 삭제
        sessionStorage.removeItem('sessionId');
        sessionStorage.removeItem('sessionPw');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setItems([]);
    // 로그아웃 시 세션 정보 삭제
    sessionStorage.removeItem('sessionId');
    sessionStorage.removeItem('sessionPw');
  };

  if (!isLoggedIn) {
    return <LoginModal onLogin={fetchData} error={loginError} />;
  }

  if (isLoading) return <div>Loading...</div>;
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