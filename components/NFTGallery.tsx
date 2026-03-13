"use client";

import { useEffect, useMemo, useState } from "react";
import { useAccount, useChainId, usePublicClient } from "wagmi";
import { base } from "wagmi/chains";

const CONTRACT_ADDRESS = "0x5FEAb188881f934e42426DEE399CB99840D4B39c";

const GALLERY_ABI = [
  {
    type: "function",
    name: "nextTokenId",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "ownerOf",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "address" }],
  },
  {
    type: "function",
    name: "tokenURI",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "string" }],
  },
] as const;

type NFTItem = {
  tokenId: number;
  tokenUri: string;
  name?: string;
  description?: string;
  image?: string;
};

function normalizeUrl(url?: string) {
  if (!url) return "";
  if (url.startsWith("ipfs://")) {
    return url.replace("ipfs://", "https://ipfs.io/ipfs/");
  }
  return url;
}

export default function NFTGallery() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient({ chainId: base.id });

  const [nfts, setNfts] = useState<NFTItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalMinted, setTotalMinted] = useState<number>(0);

  const isCorrectNetwork = chainId === base.id;

  const ownerAddress = useMemo(
    () => (address ? address.toLowerCase() : ""),
    [address]
  );

  useEffect(() => {
    const loadNFTs = async () => {
      if (!isConnected || !address || !publicClient || !isCorrectNetwork) {
        setNfts([]);
        setTotalMinted(0);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const nextTokenId = await publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: GALLERY_ABI,
          functionName: "nextTokenId",
        });

        const total = Number(nextTokenId);
        setTotalMinted(total);

        if (total === 0) {
          setNfts([]);
          return;
        }

        const ownedTokens: NFTItem[] = [];

        for (let tokenId = 0; tokenId < total; tokenId++) {
          try {
            const owner = await publicClient.readContract({
              address: CONTRACT_ADDRESS,
              abi: GALLERY_ABI,
              functionName: "ownerOf",
              args: [BigInt(tokenId)],
            });

            if (owner.toLowerCase() !== ownerAddress) continue;

            const tokenUri = await publicClient.readContract({
              address: CONTRACT_ADDRESS,
              abi: GALLERY_ABI,
              functionName: "tokenURI",
              args: [BigInt(tokenId)],
            });

            let metadataName = `NFT #${tokenId}`;
            let metadataDescription = "Minted on Base";
            let metadataImage = "";

            try {
              const normalizedTokenUri = normalizeUrl(tokenUri);
              const response = await fetch(normalizedTokenUri);
              const metadata = await response.json();

              metadataName = metadata?.name ?? metadataName;
              metadataDescription =
                metadata?.description ?? metadataDescription;
              metadataImage = normalizeUrl(metadata?.image);
            } catch {
              // fallback metadata
            }

            ownedTokens.push({
              tokenId,
              tokenUri,
              name: metadataName,
              description: metadataDescription,
              image: metadataImage,
            });
          } catch {
            // skip unreadable token
          }
        }

        setNfts(ownedTokens.reverse());
      } catch (err) {
        console.error(err);
        setError("Не удалось загрузить NFT");
      } finally {
        setIsLoading(false);
      }
    };

    loadNFTs();
  }, [address, isConnected, publicClient, isCorrectNetwork, ownerAddress]);

  return (
    <div className="mt-6 flex w-full flex-col gap-4 rounded-2xl border border-blue-200 bg-blue-50/60 p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-zinc-900">My NFT Gallery</h3>
          <p className="mt-1 text-sm text-zinc-600">
            NFT из текущего Base Mainnet контракта.
          </p>
        </div>
      </div>

      {isConnected && isCorrectNetwork && (
        <div className="rounded-xl bg-white p-3 text-sm text-zinc-700">
          <p>
            <span className="font-semibold">Контракт:</span> {CONTRACT_ADDRESS}
          </p>
          <p>
            <span className="font-semibold">Кошелёк:</span> {address}
          </p>
          <p>
            <span className="font-semibold">Всего сминчено в контракте:</span>{" "}
            {totalMinted}
          </p>
          <p>
            <span className="font-semibold">Найдено у этого кошелька:</span>{" "}
            {nfts.length}
          </p>
        </div>
      )}

      {!isConnected && (
        <p className="text-sm text-red-600">Сначала подключи кошелёк.</p>
      )}

      {isConnected && !isCorrectNetwork && (
        <p className="text-sm text-red-600">Переключи сеть на Base Mainnet.</p>
      )}

      {isConnected && isCorrectNetwork && isLoading && (
        <p className="text-sm text-zinc-600">Загрузка NFT...</p>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {isConnected && isCorrectNetwork && !isLoading && !error && nfts.length === 0 && (
        <p className="text-sm text-zinc-600">
          У этого кошелька пока нет NFT из текущего контракта.
        </p>
      )}

      {nfts.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {nfts.map((nft) => (
            <div
              key={nft.tokenId}
              className="overflow-hidden rounded-2xl border border-white/70 bg-white shadow-sm"
            >
              <div className="aspect-square bg-zinc-100">
                {nft.image ? (
                  <img
                    src={nft.image}
                    alt={nft.name ?? `NFT #${nft.tokenId}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-5xl">
                    🖼️
                  </div>
                )}
              </div>

              <div className="space-y-2 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="font-semibold text-zinc-900">
                    {nft.name ?? `NFT #${nft.tokenId}`}
                  </h4>
                  <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700">
                    #{nft.tokenId}
                  </span>
                </div>

                <p className="text-sm text-zinc-600">
                  {nft.description ?? "Minted on Base"}
                </p>

                <p className="break-all text-xs text-zinc-500">
                  {nft.tokenUri}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}