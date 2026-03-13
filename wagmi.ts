import { createConfig, cookieStorage, createStorage, http } from "wagmi";
import { base } from "wagmi/chains";
import { injected, baseAccount } from "wagmi/connectors";

export const config = createConfig({
  chains: [base],
  multiInjectedProviderDiscovery: false,
  connectors: [
    injected(),
    baseAccount({
      appName: "My Base App",
    }),
  ],
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  transports: {
    [base.id]: http("https://mainnet.base.org"),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}