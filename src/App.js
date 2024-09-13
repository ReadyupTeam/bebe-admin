import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './components/MainPage';
import DetailPage from './components/DetailPage';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/detail/:id" element={<DetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;