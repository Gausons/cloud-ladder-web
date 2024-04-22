import React from 'react';
import Sidebar from '../components/sidebar';

const App = () => {
  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <h1>Dashboard</h1>
        <p>Click on the sidebar to navigate</p>
      </div>
    </div>
  );
};

export default App;