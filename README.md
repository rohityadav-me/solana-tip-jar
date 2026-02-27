# Solana Tip Jar dApp

A decentralized application built on Solana that allows users to send micro-tips to any wallet and stores tip history on-chain using Anchor and PDAs.

## Features

• Send SOL tips to any wallet  
• Wallet connection via Phantom  
• On-chain tip storage using Anchor  
• PDA-based account structure  
• Tip history display  
• Fully deployed on Solana Devnet  

## Live Demo
https://solana-tip-jar-frontend-kcp1mwbnj-rohityadav-mes-projects.vercel.app/

## GitHub

https://github.com/rohityadav-me/solana-tip-jar

## Tech Stack

• Solana  
• Anchor  
• Rust  
• Next.js  
• TypeScript  
• Phantom Wallet  

## Program ID

A1qE6kdjYwk9bTHXeaAJrUYMYJUuuLJhypC1LWMLmBhW

## Network

Devnet

## How it works

Each tip creates a PDA account storing:

• sender  
• recipient  
• amount  
• timestamp  

This ensures fully verifiable on-chain history.


