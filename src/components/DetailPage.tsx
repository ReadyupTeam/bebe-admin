import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { InquiryItem } from '../\btypes';

function DetailPage() {
  const [item, setItem] = useState<InquiryItem | null>(null);
  const [reply, setReply] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setError('No authentication accessToken found. Please log in.');
      return;
    }

    fetch(`http://localhost:3000/api/inquiry/admin/${id}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then(data => {
        setItem(data);
        setReply(data.reply || '');
      })
      .catch(err => {
        console.error('Error fetching item:', err);
        setError('Failed to load item. Please try again.');
      });
  }, [id]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setError('No authentication accessToken found. Please log in.');
      return;
    }

    fetch('http://localhost:3000/api/inquiry/admin/reply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ id: Number(id), reply }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to submit reply');
        }
        navigate('/');
      })
      .catch(err => {
        console.error('Error submitting reply:', err);
        setError('Failed to submit reply. Please try again.');
      });
  };

  if (error) return <div>Error: {error}</div>;
  if (!item) return <div>Loading...</div>;

  return (
    <div>
      <h1>Detail Page</h1>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '10px', alignItems: 'center' }}>
        <label>Title:</label>
        <input type="text" value={item.title} readOnly />
        
        <label>Create Time:</label>
        <input type="text" value={item.createTime} readOnly />
        
        <label>Content:</label>
        <textarea value={item.content} readOnly />
        
        <label>Reply:</label>
        <textarea 
          value={reply} 
          onChange={(e) => setReply(e.target.value)}
          rows={4}
        />
        
        <div style={{ gridColumn: '2', justifySelf: 'start' }}>
          <button type="submit">등록하기</button>
        </div>
      </form>
    </div>
  );
}

export default DetailPage;