'use client';

import React, { useMemo, ReactNode } from 'react';
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { Keypair } from '@solana/web3.js';

interface WalletProviderProps {
    children: ReactNode;
}

const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
    const network = process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL || '';
    const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

    // Function to generate a new public key
    const generatePublicKey = () => {
        const keypair = Keypair.generate();
        console.log('Generated Public Key:', keypair.publicKey.toString());
        return keypair.publicKey;
    };

    // Example usage of the generatePublicKey function
    const publicKey = generatePublicKey();

    return (
        <ConnectionProvider endpoint={network}>
            <SolanaWalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </SolanaWalletProvider>
        </ConnectionProvider>
    );
};

export default WalletProvider;
