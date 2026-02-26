FROM ubuntu:24.04

# Avoid interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install base system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    build-essential \
    pkg-config \
    libssl-dev \
    git \
    wget \
    ca-certificates \
    libudev-dev \
    protobuf-compiler \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install modern Node.js (22.x LTS) via NodeSource
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get update \
    && apt-get install -y nodejs \
    && npm install -g npm@latest \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Verify Node version (optional - for build logs)
RUN node --version && npm --version

RUN npm install -g yarn

# Install Rust via rustup
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Install Solana CLI + Anchor CLI using the requested one-liner script
# This installs latest stable Solana (Agave) and Anchor
RUN curl --proto '=https' --tlsv1.2 -sSfL https://solana-install.solana.workers.dev | bash

# Add Solana bin to PATH (the installer usually adds ~/.local/share/solana/install/active_release/bin)
ENV PATH="/root/.local/share/solana/install/active_release/bin:${PATH}"

# Verify installations (optional - helps debug builds)
RUN solana --version && anchor --version

# Set working directory
WORKDIR /app
