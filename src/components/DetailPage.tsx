import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { InquiryItem } from '../\btypes';

function DetailPage() {
  const [item, setItem] = useState<InquiryItem | null>(null);
  const [reply, setReply] = useState('');
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3000/api/inquiry/admin/${id}`)
      .then(response => response.json())
      .then(data => {
        setItem(data);
        setReply(data.reply || '');
      });
  }, [id]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    fetch('http://localhost:3000/api/inquiry/admin/reply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: Number(id), reply }),
    })
      .then(() => navigate('/'));
  };

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