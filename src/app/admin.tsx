import React, { useEffect, useState } from 'react';
import { Connection, PublicKey, AccountInfo } from '@solana/web3.js';

const AdminPage: React.FC = () => {
    const [accountInfo, setAccountInfo] = useState<AccountInfo<Buffer> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchAccountInfo = async () => {
            try {
                const connection = new Connection(process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL || '', 'confirmed');
                const publicKey = new PublicKey('9yM6Q3uuagzGN7BsZnjLHMCnWYHzxvBibehUJMZF3V2L'); // Replace with the actual public key
                const info = await connection.getAccountInfo(publicKey);
                setAccountInfo(info);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchAccountInfo();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <h1>Admin Page</h1>
            <pre>{accountInfo ? JSON.stringify(accountInfo, null, 2) : 'No account info available'}</pre>
        </div>
    );
};

export default AdminPage;
