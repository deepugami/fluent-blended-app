import React from 'react';

const AboutSection = () => {
  return (
    <section className="about-section">
      <h2>About PRB Math Blended</h2>
      <div className="about-content">
        <p>
          This application demonstrates the integration of Solidity smart contracts with
          Rust-based WebAssembly for mathematical computations on the Fluent network.
        </p>
        <p>
          By combining Solidity's EVM compatibility with Rust's performance and security,
          we can create more efficient and powerful decentralized applications.
        </p>
        <div className="tech-stack">
          <h4>Technology Stack:</h4>
          <ul>
            <li>Solidity Smart Contract (Frontend)</li>
            <li>Rust Implementation (Backend)</li>
            <li>Fluent Network (Blended Execution)</li>
            <li>ethers.js (Blockchain Interaction)</li>
            <li>React (User Interface)</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default AboutSection; 