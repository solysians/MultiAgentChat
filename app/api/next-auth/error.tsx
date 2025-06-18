import React from 'react';

const AuthErrorPage = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Authentication Error</h1>
      <p>It seems there was an issue with Google authentication.</p>
      <p>Please ensure that Google authentication is properly configured.</p>
      <p>If you need assistance, please contact support.</p>
    </div>
  );
};

export default AuthErrorPage;
