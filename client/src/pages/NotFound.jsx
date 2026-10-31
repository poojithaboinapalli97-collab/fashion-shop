import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-card">
        <span className="not-found-badge">404</span>
        <h1 className="not-found-title">Page Not Found</h1>
        <p className="not-found-desc">
          The requested page or collection does not exist, or has been relocated.
        </p>
        <Link to="/" className="btn-primary">
          Return to Atelier
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
