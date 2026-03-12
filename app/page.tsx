import ConnectWallet from "@/components/ConnectWallet";
import MiniAppReady from "@/components/MiniAppReady";

function BitcoinLogo() {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 shadow-lg">
      <span className="text-2xl font-bold text-white">₿</span>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-gradient-to-br from-orange-100 via-white to-blue-100">
      <MiniAppReady />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8">
        <header className="mb-10 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <BitcoinLogo />
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
                Base App
              </p>
              <h1 className="text-2xl font-bold text-zinc-900">My Base App</h1>
            </div>
          </div>

          <div className="rounded-full border border-orange-200 bg-white/70 px-4 py-2 text-sm text-zinc-600 shadow-sm backdrop-blur">
            Base Sepolia
          </div>
        </header>

        <section className="flex flex-1 items-center justify-center">
          <div className="grid w-full items-center gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="inline-flex rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700">
                Wallet • Transactions • Base
              </div>

              <div>
                <h2 className="text-5xl font-extrabold leading-tight text-zinc-900">
                  Яркий старт для твоего
                  <span className="block bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                    Base dApp
                  </span>
                </h2>

                <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-600">
                  Подключай кошелёк, смотри баланс и отправляй транзакции в сети
                  Base Sepolia через аккуратный и современный интерфейс.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-sm text-zinc-700 shadow-sm backdrop-blur">
                  ⚡ Быстрое подключение
                </div>
                <div className="rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-sm text-zinc-700 shadow-sm backdrop-blur">
                  🔐 Кошелёк и сеть
                </div>
                <div className="rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-sm text-zinc-700 shadow-sm backdrop-blur">
                  🚀 Первая транзакция
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-orange-300/40 blur-2xl" />
              <div className="absolute -bottom-8 -right-6 h-28 w-28 rounded-full bg-blue-300/40 blur-2xl" />

              <div className="relative rounded-[32px] border border-white/60 bg-white/80 p-8 shadow-2xl backdrop-blur">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-500">Dashboard</p>
                    <h3 className="text-2xl font-bold text-zinc-900">
                      Wallet Panel
                    </h3>
                  </div>

                  <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-yellow-500 px-3 py-2 text-sm font-semibold text-white shadow">
                    Live
                  </div>
                </div>

                <ConnectWallet />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}