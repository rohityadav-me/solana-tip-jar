"use client";

import { useState, useEffect } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import { getProgram } from "@/lib/program";

import {
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

export default function Home() {

  const wallet = useWallet(); // FIXED
  const { publicKey } = wallet;

  const { connection } = useConnection();

  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("0.01");
  const [tips, setTips] = useState<any[]>([]);

const fetchTips = async () => {
  if (!publicKey) return;

  try {
    const program = getProgram(connection, wallet);

    const tipsData =
      await program.account.tip.all();

    setTips(tipsData);

  } catch (err) {
    console.error(err);
  }
};
  useEffect(() => {
    fetchTips();
  }, [publicKey]);

 const sendTip = async () => {
  if (!publicKey) {
    alert("Connect wallet first");
    return;
  }

  try {
    const recipient = new PublicKey(recipientAddress);
    const lamports = Math.floor(parseFloat(amount) * LAMPORTS_PER_SOL); // better to floor to avoid fractional lamports

    const program = getProgram(connection, wallet);

    // PDA seeds MUST match the program's #[account(seeds = ...)]
    const [tipPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("tip"),
        publicKey.toBuffer(),       // from (sender)
        recipient.toBuffer(),       // to (recipient)  ← this was missing!
      ],
      program.programId
    );

    const signature = await program.methods
      .sendTip(new anchor.BN(lamports))
      .accounts({
        from: publicKey,
        to: recipient,
        tip: tipPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    alert("Tip sent! TX: " + signature);
  } catch (err: any) {
    console.error("Full error:", err);
    alert("Error sending tip: " + (err.message || "Unknown"));
  }
}; 

return (
  <div style={{ padding: 40 }}>
    <h1>Solana Tip Jar</h1>
    <WalletMultiButton />

    <input
      value={recipientAddress}
      onChange={(e) => setRecipientAddress(e.target.value)}
      placeholder="Recipient wallet address"
      style={{ display: "block", margin: "10px 0", padding: "8px", width: "400px" }}
    />

    <input
      value={amount}
      onChange={(e) => setAmount(e.target.value)}
      placeholder="Amount in SOL"
      style={{ display: "block", margin: "10px 0", padding: "8px", width: "200px" }}
    />

    <br />

    <button onClick={sendTip}>Send Tip</button>

    <h2 style={{ marginTop: "30px" }}>Tip History</h2>

    {tips.length === 0 && <p>No tips yet</p>}

    {tips.map((tip, index) => (
      <div
        key={index}
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          marginTop: "10px",
          borderRadius: "6px",
        }}
      >
        <div>From: {tip.account.sender.toString()}</div>
        <div>To: {tip.account.recipient.toString()}</div>
        <div>
          Amount: {(Number(tip.account.amount) / LAMPORTS_PER_SOL).toFixed(6)} SOL
        </div>
        <div>
          Time: {new Date(Number(tip.account.timestamp) * 1000).toLocaleString()}
        </div>
      </div>
    ))}
  </div>
);
  }
