import React from 'react';
import './Content.css';

const Content = ({ section }) => {
  return (
    <div className="content">
      <h1>{section}</h1>
      <p>You are viewing the <strong>{section}</strong> section.</p>
    </div>
  );
};

export default Content;
