"use client";

import { useState } from "react";
import {
  useAccount,
  useChainId,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { baseSepolia } from "wagmi/chains";

const CONTRACT_ADDRESS = "0xcCae0F62D781152594277191240B8d438EE2e4Bb";

const CONTRACT_ABI = [
  {
    type: "function",
    name: "mint",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "tokenURI", type: "string" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

const DEFAULT_TOKEN_URI =
  "https://orange-official-gecko-702.mypinata.cloud/ipfs/bafkreibwzifzj3f5v5n6jv7j6zwl7f4gdb7f2wwt4w4b6m3f4m2b5f6m7e";

export default function MintNFT() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [tokenUri, setTokenUri] = useState(DEFAULT_TOKEN_URI);

  const {
    writeContract,
    data: hash,
    isPending: isMinting,
    error,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const isCorrectNetwork = chainId === baseSepolia.id;

  const handleMint = () => {
    if (!address) return;

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "mint",
      args: [address, tokenUri],
      chain: baseSepolia,
    });
  };

  return (
    <div className="mt-6 flex w-full flex-col gap-4 rounded-2xl border border-orange-200 bg-orange-50/60 p-5">
      <div>
        <h3 className="text-xl font-bold text-zinc-900">Mint NFT</h3>
        <p className="mt-1 text-sm text-zinc-600">
          Выпусти свой первый NFT через контракт на Base Sepolia.
        </p>
      </div>

      {!isConnected && (
        <p className="text-sm text-red-600">
          Сначала подключи кошелёк.
        </p>
      )}

      {isConnected && !isCorrectNetwork && (
        <p className="text-sm text-red-600">
          Переключи сеть на Base Sepolia.
        </p>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-zinc-700">Token URI</label>
        <input
          type="text"
          value={tokenUri}
          onChange={(e) => setTokenUri(e.target.value)}
          className="rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400"
          placeholder="https://..."
        />
      </div>

      <button
        onClick={handleMint}
        disabled={!isConnected || !isCorrectNetwork || isMinting || isConfirming}
        className="rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 px-4 py-3 font-semibold text-white shadow disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isMinting
          ? "Отправка mint..."
          : isConfirming
            ? "Подтверждение mint..."
            : "Mint NFT"}
      </button>

      {hash && (
        <div className="rounded-xl bg-white p-3">
          <p className="text-sm text-zinc-500">TX Hash</p>
          <p className="break-all font-mono text-sm text-zinc-800">{hash}</p>
        </div>
      )}

      {isConfirmed && (
        <p className="text-sm font-semibold text-green-600">
          NFT успешно создан.
        </p>
      )}

      {error && (
        <p className="text-sm text-red-600">
          {error.message}
        </p>
      )}
    </div>
  );
}