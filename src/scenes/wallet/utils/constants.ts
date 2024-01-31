interface Transaction {
    txnHash: string;
    amount: number;
    type: string;
    timestamp: string;
    from: string;
    to: string;
  }

export const transactions: Transaction[] = [
    {
      txnHash: "dfa52ca72b1cff31dea782bdd9cce62bf5c515a48c5d12fa302bf20d4677015b",
      amount: 1.5,
      type: "Transfer",
      timestamp: "2024-01-28T12:00:00",
      from: "d48750112a5c78aa941fdc14a0e3c16086af5090d01971c6a78b17b7ac343f30",
      to: "d23234421waadf31dea782bdd9cce62bf5c515a48c5d12fa302bf20d4677015b",
    },
    {
      txnHash: "acdfba52ca72b1cff31dea782bdd9cce62bf5c515a48c5d12fa302bf238wfa283",
      amount: 2.0,
      type: "Deposit",
      timestamp: "2024-01-27T11:00:00",
      from: "dfa52ca72b1cff31dea782bdd9cce62bf5c515a48c5d12fa302bf20d4677015b",
      to: "dfa52ca72b1cff31dea782bdd9cce62bf5c515a48c5d12fa302bf20d4677015b",
    },
    {
      txnHash: "e12cbb32ca72b1cff31dea782bdf224i2idw62bf5c515a48c5d12fa302bf20d4",
      amount: 0.75,
      type: "Withdrawal",
      timestamp: "2024-01-26T10:30:00",
      from: "d9e4f72a3c9b5f80c1d2a6b4e5f3c7a89b0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r",
      to: "7f3b4a92bc5e6d87f1a2e03bf498560c6a7d8f2e3c4157e08b9c02d444e8b9a6",
    },
    {
      txnHash: "d23234421waadf31dea782bdd9cce62bf5c515a48c5d12fa302bf20d4677015b",
      amount: 3.0,
      type: "Transfer",
      timestamp: "2024-01-25T09:45:00",
      from: "9a6b5c7d8e9f0a1b2c3d4e5f67890123456789abcdef123456789abcdef01234",
      to: "3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5",
    },
    {
      txnHash: "db3799613f50e300920f41c9792a995b201f493c3b073037977578a1e51a9f62",
      amount: 1.25,
      type: "Transfer",
      timestamp: "2024-01-24T08:30:00",
      from: "58b97c06e42f13d8a5b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y",
      to: "763e979bee4d763d23202338e8248d0e236be690ad3e950682936257bb171e24",
    },
  ];