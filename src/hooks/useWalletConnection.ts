
'use client';

import { useState, useEffect, useCallback } from 'react';
import { ethers, BrowserProvider, Eip1193Provider, formatEther } from 'ethers'; // Import formatEther
import { useToast } from "@/hooks/use-toast";

// Extend the Window interface to include ethereum
declare global {
  interface Window {
    ethereum?: Eip1193Provider & { // Use Eip1193Provider for modern standards
      isMetaMask?: boolean;
      request: (request: { method: string; params?: any[] | Record<string, any> }) => Promise<any>;
      on: (eventName: string, listener: (...args: any[]) => void) => void;
      removeListener: (eventName: string, listener: (...args: any[]) => void) => void;
    };
  }
}


interface UseWalletConnectionReturn {
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  account: string | null;
  provider: BrowserProvider | null;
  balance: string | null; // Add balance state
  error: string | null;
  isLoading: boolean;
}

export function useWalletConnection(): UseWalletConnectionReturn {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [balance, setBalance] = useState<string | null>(null); // State for balance
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  // --- Helper Function to Fetch Balance ---
  const fetchBalance = useCallback(async (currentProvider: BrowserProvider | null, currentAccount: string | null) => {
    if (currentProvider && currentAccount) {
      try {
        const balanceWei = await currentProvider.getBalance(currentAccount);
        const balanceEther = formatEther(balanceWei);
        // Format to a reasonable number of decimal places, e.g., 4
        const formattedBalance = parseFloat(balanceEther).toFixed(4);
        setBalance(formattedBalance);
        setError(null); // Clear balance-related errors on success
      } catch (err) {
        console.error("Error fetching balance:", err);
        setBalance(null); // Reset balance on error
        setError("Failed to fetch balance.");
        // Optionally show a toast for balance fetch error
        toast({ title: 'Balance Error', description: 'Could not fetch account balance.', variant: 'destructive' });
      }
    } else {
      setBalance(null); // Reset balance if provider or account is missing
    }
  }, [toast]); // Added toast dependency

  // Function to handle account changes
  const handleAccountsChanged = useCallback(async (accounts: string[]) => {
    console.log('Accounts changed:', accounts);
    if (accounts.length === 0) {
      // MetaMask is locked or the user has disconnected accounts
      console.log('Please connect to MetaMask.');
      disconnectWallet(); // Disconnect if no accounts are found
      toast({ title: 'Wallet Disconnected', description: 'No accounts found or wallet locked.' });
    } else if (accounts[0] !== account) {
      const newAccount = accounts[0];
      setAccount(newAccount);
      setError(null); // Clear previous errors
      toast({ title: 'Account Changed', description: `Switched to account: ${newAccount.substring(0,6)}...${newAccount.substring(newAccount.length - 4)}` });
      // Ensure provider exists before fetching balance
      if (provider) {
        await fetchBalance(provider, newAccount); // Fetch balance for new account
      } else {
         console.warn("Provider not available when handling account change.");
         // Attempt to re-establish provider if necessary, or rely on initial connect logic
         // For simplicity here, we assume provider should exist if accounts changed.
      }
    }
  }, [account, provider, fetchBalance, toast]); // Add provider, fetchBalance, toast

  // Function to handle chain changes
  const handleChainChanged = useCallback(async (chainId: string) => {
    console.log('Chain changed:', chainId);
    toast({ title: 'Network Changed', description: 'Reloading to apply network changes.' });
    // Reloading is the simplest robust way to handle network changes with ethers v6
    window.location.reload();
  }, [toast]); // Add toast

   // Function to handle disconnect event
   const handleDisconnect = useCallback((error?: any) => {
    console.log('Wallet disconnected:', error);
    disconnectWallet(); // Use the existing disconnect logic
    toast({ title: 'Wallet Disconnected', description: error?.message || 'You have been disconnected.', variant: 'destructive' });
   }, [toast]); // Add toast dependency, remove disconnectWallet dependency as it's called internally


  const disconnectWallet = useCallback(() => {
     console.log("Disconnecting wallet...");
     setAccount(null);
     setProvider(null);
     setBalance(null); // Reset balance on disconnect
     setError(null);
     setIsLoading(false); // Ensure loading is false
     // Remove event listeners carefully
     if (window.ethereum?.removeListener) {
         try {
            window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            window.ethereum.removeListener('chainChanged', handleChainChanged);
            window.ethereum.removeListener('disconnect', handleDisconnect);
            console.log("Event listeners removed.");
         } catch (e) {
            console.error("Error removing event listeners:", e);
         }
     } else {
        console.log("window.ethereum.removeListener not available.");
     }
      // Don't show toast here, it's shown in handleDisconnect or when manually called elsewhere
      // toast({ title: 'Wallet Disconnected' });
  }, [handleAccountsChanged, handleChainChanged, handleDisconnect]); // Add dependencies

  const connectWallet = useCallback(async () => {
    setError(null); // Clear previous errors
    setBalance(null); // Clear previous balance

    if (typeof window.ethereum === 'undefined') {
      setError('MetaMask (or another Ethereum wallet) is not installed. Please install it to connect.');
      toast({ title: 'Wallet Not Found', description: 'Please install MetaMask or another Ethereum wallet.', variant: 'destructive' });
      setIsLoading(false); // Ensure loading stops
      return;
    }

    // If already connected, fetch balance and return
    // if (account && provider) {
    //     console.log("Wallet already connected. Fetching balance.");
    //     setIsLoading(true); // Show loading briefly for balance fetch
    //     await fetchBalance(provider, account);
    //     setIsLoading(false);
    //     return;
    // }


    setIsLoading(true);
    try {
      // Use BrowserProvider which is recommended for browser environments
      // Ensure we are creating a new provider instance on each connect attempt
      // to handle potential state issues after disconnection or errors.
      const browserProvider = new ethers.BrowserProvider(window.ethereum, 'any'); // 'any' helps with network changes
      setProvider(browserProvider);

      // Request account access
      const accounts = await browserProvider.send('eth_requestAccounts', []);

      if (accounts.length > 0) {
        const currentAccount = accounts[0];
        setAccount(currentAccount);
        toast({ title: 'Wallet Connected', description: `Connected: ${currentAccount.substring(0,6)}...${currentAccount.substring(currentAccount.length - 4)}` });

        // Fetch balance after setting account and provider
        await fetchBalance(browserProvider, currentAccount);

        // --- Set up event listeners ---
        // Remove existing listeners before adding new ones to prevent duplicates
        if (window.ethereum?.removeListener) {
            window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            window.ethereum.removeListener('chainChanged', handleChainChanged);
            window.ethereum.removeListener('disconnect', handleDisconnect);
        }
        window.ethereum?.on('accountsChanged', handleAccountsChanged);
        window.ethereum?.on('chainChanged', handleChainChanged);
        window.ethereum?.on('disconnect', handleDisconnect); // Listen for standard disconnect

      } else {
         setError('No accounts found. Please ensure your wallet is unlocked and has accounts.');
         toast({ title: 'Connection Failed', description: 'No accounts found in wallet.', variant: 'destructive' });
         disconnectWallet(); // Clean up if connection failed mid-way
      }
    } catch (err: any) {
      console.error("Error connecting wallet:", err);
      let errorMessage = 'Failed to connect wallet.';
      if (err.code === 4001) { // User rejected request
        errorMessage = 'Connection request rejected by user.';
      } else if (err.code === -32002) { // Request already pending
        errorMessage = 'Connection request already pending. Please check your wallet.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      toast({ title: 'Connection Error', description: errorMessage, variant: 'destructive' });
      disconnectWallet(); // Clean up on error
    } finally {
        setIsLoading(false);
    }
  }, [fetchBalance, handleAccountsChanged, handleChainChanged, handleDisconnect, toast, disconnectWallet]); // Add disconnectWallet dependency


  // Clean up listeners on component unmount
  useEffect(() => {
    // Return the cleanup function
    return () => {
       if (window.ethereum?.removeListener) {
           console.log("Cleaning up wallet listeners on unmount.");
           try {
              window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
              window.ethereum.removeListener('chainChanged', handleChainChanged);
              window.ethereum.removeListener('disconnect', handleDisconnect);
           } catch (e) {
              console.error("Error removing listeners during unmount:", e);
           }
       }
    };
  }, [handleAccountsChanged, handleChainChanged, handleDisconnect]); // Add dependencies


  // Initial connection check attempt (optional, uncomment if desired)
  // useEffect(() => {
  //   const checkConnection = async () => {
  //      if (window.ethereum) {
  //           try {
  //               const browserProvider = new ethers.BrowserProvider(window.ethereum, 'any');
  //               const accounts = await browserProvider.listAccounts();
  //               if (accounts.length > 0 && accounts[0]) {
  //                   console.log("Previously connected account found:", accounts[0].address);
  //                   // Automatically trigger connection logic if an account is found
  //                   await connectWallet();
  //               } else {
  //                   console.log("No previously connected accounts found.");
  //               }
  //           } catch (e) {
  //               console.error("Error checking initial connection:", e);
  //           }
  //      }
  //   };
  //   checkConnection();
  //   // Run only once on mount
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);


  return { connectWallet, disconnectWallet, account, provider, balance, error, isLoading }; // Return balance
}
