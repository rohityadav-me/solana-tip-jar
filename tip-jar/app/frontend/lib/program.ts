import * as anchor from "@coral-xyz/anchor";
import idl from "./tip_jar.json";

// Import the generated TypeScript type (this is the key step)
//import type { TipJar } from "@/anchor-types/tip_jar";
import type { TipJar } from "../src/anchor-types/tip_jar";

export const getProgram = (
  connection: anchor.web3.Connection,
  wallet: any  // or better: import { Wallet } from '@solana/wallet-adapter-react'; then use Wallet
) => {
  const anchorWallet = {
    publicKey: wallet.publicKey,
    signTransaction: wallet.signTransaction,
    signAllTransactions: wallet.signAllTransactions,
  };

  const provider = new anchor.AnchorProvider(
    connection,
    anchorWallet,
    { commitment: "confirmed" }
  );

  // Use the typed Program<TipJar>
  return new anchor.Program<TipJar>(
    idl as TipJar,   // cast the raw JSON to the typed IDL shape
    provider
  );
};
