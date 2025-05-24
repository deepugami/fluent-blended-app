import React from 'react';

const AboutSection = () => {
  return (
    <section className="about-section">
      <h2>About PRB Math on Fluent</h2>
      <div className="about-content">
        <p>
          This application demonstrates advanced mathematical computations on the Fluent network.
          By leveraging Fluent's blockchain technology, we deliver precise, reliable 
          calculations with the security and transparency of blockchain.
        </p>
        <p>
          The Fluent network enables a new generation of blockchain applications 
          with enhanced capabilities, improved performance, and deeper interoperability.
        </p>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h4>High Performance</h4>
            <p>Optimized mathematical functions with blockchain-level precision</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h4>Secure Calculations</h4>
            <p>Calculations performed on-chain for maximum security</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">⚙️</div>
            <h4>No Wallet Required</h4>
            <p>Use in No-Blockchain Mode for quick access</p>
          </div>
        </div>
        
        <div className="tech-stack">
          <h4>Technology Stack:</h4>
          <ul>
            <li>Fluent Network</li>
            <li>PRB Math Library</li>
            <li>ethers.js</li>
            <li>React</li>
            <li>Chart.js</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default AboutSection; 