import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, useAccount, useConnect, useBalance, http } from 'wagmi';
import { embeddedWallet, userHasWallet } from '@civic/auth-web3';
import { CivicAuthProvider, UserButton, useUser } from '@civic/auth-web3/react';
import { mainnet, sepolia } from "wagmi/chains";

const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  connectors: [
    embeddedWallet(),
  ],
});

const queryClient = new QueryClient();

const LoadingSpinner = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const AppContent = () => {
  const [loading, setLoading] = useState(false);
  const userContext = useUser();
  const { connect, connectors } = useConnect();
  const { isConnected } = useAccount();
  const balance = useBalance({
    address: userHasWallet(userContext) ? userContext.walletAddress : undefined,
  });

  const connectExistingWallet = () => {
    setLoading(true);
    connect({ connector: connectors[0] }).finally(() => setLoading(false));
  };

  const createWallet = () => {
    if (userContext.user && !userHasWallet(userContext)) {
      setLoading(true);
      userContext.createWallet().then(() => {
        connectExistingWallet();
      }).finally(() => setLoading(false));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="w-full max-w-lg bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
        {/* Header Section */}
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-white text-center">
            Civic Wallet
          </h1>
          <p className="text-gray-400 text-center mt-1">
            Your gateway to secure Web3 interactions
          </p>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-6">
          <div className="flex justify-center">
            <UserButton className="w-full max-w-xs" />
          </div>
          
          {userContext.user && (
            <div className="space-y-6">
              {!userHasWallet(userContext) ? (
                <button
                  onClick={createWallet}
                  disabled={loading}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner />
                      <span className="ml-2">Creating Wallet...</span>
                    </>
                  ) : (
                    'Create Wallet'
                  )}
                </button>
              ) : (
                <div className="space-y-6">
                  {/* Wallet Address */}
                  <div className="p-4 rounded-lg bg-gray-700/50 border border-gray-600">
                    <p className="text-sm text-gray-400 mb-1">Wallet Address</p>
                    <p className="text-white font-mono text-sm break-all">
                      {userContext.walletAddress}
                    </p>
                  </div>
                  
                  {/* Balance */}
                  <div className="p-4 rounded-lg bg-gray-700/50 border border-gray-600">
                    <p className="text-sm text-gray-400 mb-1">Balance</p>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-bold text-white">
                        {balance?.data ? (
                          `${(BigInt(balance.data.value) / BigInt(1e18)).toString()}`
                        ) : (
                          '...'
                        )}
                      </span>
                      <span className="text-gray-400">
                        {balance?.data?.symbol}
                      </span>
                    </div>
                  </div>

                  {/* Connect Button or Status */}
                  {!isConnected ? (
                    <button
                      onClick={connectExistingWallet}
                      disabled={loading}
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <LoadingSpinner />
                          <span className="ml-2">Connecting...</span>
                        </>
                      ) : (
                        'Connect Wallet'
                      )}
                    </button>
                  ) : (
                    <div className="flex items-center justify-center space-x-2 text-green-400">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      <span>Connected</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <CivicAuthProvider clientId="2bc82a36-ab1c-4c75-9c64-cd697ce72a88">
          <AppContent />
        </CivicAuthProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
};

export default App;