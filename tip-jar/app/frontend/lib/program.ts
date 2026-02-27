import * as anchor from "@coral-xyz/anchor";

import idl from "./tip_jar.json";

export const getProgram = (
  connection,
  wallet
) => {

  const anchorWallet = {
    publicKey: wallet.publicKey,
    signTransaction: wallet.signTransaction,
    signAllTransactions: wallet.signAllTransactions,
  };

  const provider =
    new anchor.AnchorProvider(
      connection,
      anchorWallet,
      {
        commitment: "confirmed",
      }
    );

  return new anchor.Program(
    idl,
    provider
  );
};
