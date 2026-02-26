FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt update && apt install -y \
    curl \
    build-essential \
    pkg-config \
    libssl-dev \
    git \
    nodejs \
    npm \
    wget \
    ca-certificates

# Install Rust
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Install Solana CLI
RUN sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
ENV PATH="/root/.local/share/solana/install/active_release/bin:${PATH}"

# Install Anchor
RUN npm install -g @coral-xyz/anchor-cli

WORKDIR /app
