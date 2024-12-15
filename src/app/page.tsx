'use client';

import Image from "next/image";
import { useWallet } from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic';
import { Connection, PublicKey, Transaction, SystemProgram, TransactionInstruction } from '@solana/web3.js';

// Dynamically import WalletMultiButton with SSR disabled
const WalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then(mod => mod.WalletMultiButton),
  { ssr: false }
);

export default function Home() {
  const { connected, publicKey, sendTransaction } = useWallet();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fullName = formData.get('fullName') as string;
    const address = formData.get('address') as string;
    const phoneNo = formData.get('phoneNo') as string;

    if (!connected || !publicKey) {
      console.error('Wallet not connected');
      return;
    }

    try {
      const network = process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL || '';
      const connection = new Connection(network);

      // Encode the data
      const data = Buffer.from(JSON.stringify({ fullName, address, phoneNo }));

      // Create a custom instruction
      const instruction = new TransactionInstruction({
        keys: [{ pubkey: publicKey, isSigner: true, isWritable: false }],
        programId: new PublicKey('YourProgramIdHere'), // Replace with your program ID
        data,
      });

      const transaction = new Transaction().add(instruction);

      const signature = await sendTransaction(transaction, connection);
      console.log('Transaction sent with signature:', signature);
    } catch (error) {
      console.error('Error sending transaction:', error);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="text-center">
        <h1 className="text-4xl font-bold">Welcome to Verify</h1>
        <p className="text-lg mt-4">Your trusted platform for verification solutions.</p>
      </header>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <section className="text-center sm:text-left">
          <h2 className="text-2xl font-semibold">Features</h2>
          <ul className="list-disc list-inside mt-4">
            <li>Secure and reliable verification processes</li>
            <li>Easy integration with existing systems</li>
            <li>Comprehensive reporting and analytics</li>
          </ul>
        </section>
        
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-foreground text-black"
              placeholder="Enter your full name"
            />
          </div>
          
          <div>
            <label htmlFor="address" className="block text-sm font-medium mb-1">Address</label>
            <textarea
              id="address"
              name="address"
              required
              rows={3}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-foreground text-black"
              placeholder="Enter your address"
            />
          </div>
          
          <div>
            <label htmlFor="phoneNo" className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              type="tel"
              id="phoneNo"
              name="phoneNo"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-foreground text-black"
              placeholder="Enter your phone number"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-foreground text-background rounded-md py-2 px-4 hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors"
          >
            Submit
          </button>
        </form>

        <div className="flex gap-4 items-center flex-col sm:flex-row mt-8">
          <WalletMultiButton className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5" />
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
