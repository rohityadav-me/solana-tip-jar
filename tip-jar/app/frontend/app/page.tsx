"use client";

import { useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";

import {
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

export default function Home() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("0.01");

  const sendTip = async () => {
    if (!publicKey) {
      alert("Connect wallet first");
      return;
    }

    try {
      const recipient = new PublicKey(recipientAddress);

      const lamports =
        parseFloat(amount) * LAMPORTS_PER_SOL;

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipient,
          lamports,
        })
      );

      const signature = await sendTransaction(
        transaction,
        connection
      );

      await connection.confirmTransaction(signature);

      alert("Tip sent! TX: " + signature);
    } catch (err) {
      console.error(err);
      alert("Error sending tip");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Solana Tip Jar</h1>

      <WalletMultiButton />

      <br />
      <br />

      <input
        type="text"
        placeholder="Recipient wallet address"
        value={recipientAddress}
        onChange={(e) =>
          setRecipientAddress(e.target.value)
        }
        style={{
          padding: "10px",
          width: "400px",
          marginBottom: "10px",
          display: "block",
        }}
      />

      <input
        type="text"
        placeholder="Amount in SOL"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{
          padding: "10px",
          width: "200px",
          marginBottom: "10px",
          display: "block",
        }}
      />

      <button
        onClick={sendTip}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
        }}
      >
        Send Tip
      </button>
    </div>
  );
}
