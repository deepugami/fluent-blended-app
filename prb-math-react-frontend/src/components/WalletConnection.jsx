import React from 'react';

const WalletConnection = ({ connectWallet, account, connectionStatus, networkName }) => {
  return (
    <section className="wallet-connection">
      <h2>Wallet Connection</h2>
      <div className="connection-info">
        <div>
          <button 
            onClick={connectWallet}
            disabled={connectionStatus === 'connected' || connectionStatus === 'connecting'}
            className="connect-button"
          >
            {connectionStatus === 'connecting' ? 'Connecting...' : 'Connect Wallet'}
          </button>
          <div className="network-badge">
            Network: <span>{networkName}</span>
            <span className={`status ${connectionStatus}`}>
              {connectionStatus === 'connected' ? 'Connected' : 
               connectionStatus === 'connecting' ? 'Connecting...' : 
               connectionStatus === 'error' ? 'Error' : 'Not Connected'}
            </span>
          </div>
        </div>
        {account && (
          <div className="wallet-info">
            <p>Connected Address: <span className="address">{account}</span></p>
          </div>
        )}
      </div>
    </section>
  );
};

export default WalletConnection; 