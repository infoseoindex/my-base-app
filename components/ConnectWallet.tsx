"use client";

import {
  useAccount,
  useBalance,
  useChainId,
  useConnect,
  useDisconnect,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";
import { base } from "wagmi/chains";
import { formatUnits, parseEther } from "viem";

export default function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const {
    connect,
    connectors,
    isPending,
    error: connectError,
  } = useConnect();
  const { disconnect } = useDisconnect();

  const { data: balance, isLoading: balanceLoading, error: balanceError } =
    useBalance({
      address,
      chainId: base.id,
      query: {
        enabled: Boolean(address),
      },
    });

  const {
    sendTransaction,
    data: hash,
    isPending: isSending,
    error: sendError,
  } = useSendTransaction();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const formattedBalance =
    balance?.value !== undefined && balance?.decimals !== undefined
      ? Number(formatUnits(balance.value, balance.decimals)).toFixed(6)
      : null;

  const isCorrectNetwork = chainId === base.id;

  const handleSendTransaction = () => {
    if (!address) return;

    sendTransaction({
      to: address,
      value: parseEther("0.000001"),
      chainId: base.id,
    });
  };

  const getConnectorLabel = (name: string) => {
    if (name.toLowerCase().includes("base")) return "Connect Base Account";
    if (name.toLowerCase().includes("injected")) return "Connect Browser Wallet";
    return `Connect ${name}`;
  };

  if (isConnected) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border p-6">
        <p className="text-lg font-semibold text-green-600">
          Кошелёк подключён
        </p>

        <div className="text-center">
          <p className="text-sm text-gray-500">Адрес</p>
          <p className="max-w-md break-all font-mono text-sm">{address}</p>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">Сеть</p>
          <p>{isCorrectNetwork ? "Base Mainnet" : `Chain ID: ${chainId}`}</p>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">Баланс</p>
          <p>
            {balanceLoading
              ? "Загрузка..."
              : balanceError
                ? "Ошибка загрузки"
                : formattedBalance !== null
                  ? `${formattedBalance} ${balance?.symbol ?? "ETH"}`
                  : "0 ETH"}
          </p>
        </div>

        {!isCorrectNetwork && (
          <p className="text-sm text-red-600">Переключи сеть на Base Mainnet</p>
        )}

        <button
          onClick={handleSendTransaction}
          disabled={!isCorrectNetwork || isSending || isConfirming}
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSending
            ? "Отправка..."
            : isConfirming
              ? "Подтверждение..."
              : "Send 0.000001 ETH"}
        </button>

        {hash && (
          <div className="max-w-md text-center">
            <p className="text-sm text-gray-500">TX Hash</p>
            <p className="break-all font-mono text-sm">{hash}</p>
          </div>
        )}

        {isConfirmed && (
          <p className="text-sm font-medium text-green-600">
            Транзакция подтверждена
          </p>
        )}

        {sendError && (
          <p className="max-w-md text-center text-sm text-red-600">
            {sendError.message}
          </p>
        )}

        <button
          onClick={() => disconnect()}
          className="rounded bg-red-500 px-4 py-2 text-white"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {connectors.length === 0 && (
        <p className="text-sm text-red-600">
          Коннекторы не найдены. Проверь кошелёк или открой app в Base App.
        </p>
      )}

      {connectors.map((connector) => (
        <button
          key={connector.uid}
          onClick={() => connect({ connector })}
          disabled={isPending}
          className="rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
        >
          {isPending ? "Подключение..." : getConnectorLabel(connector.name)}
        </button>
      ))}

      {connectError && (
        <p className="max-w-md text-center text-sm text-red-600">
          {connectError.message}
        </p>
      )}
    </div>
  );
}