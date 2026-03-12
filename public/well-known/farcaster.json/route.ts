export async function GET() {
  return Response.json({
    miniapp: {
      version: "1",
      name: "My Base App",
      description: "Simple Base Sepolia dApp with wallet and transactions",
      iconUrl: "https://my-base-app-seven.vercel.app/og-image.png",
      homeUrl: "https://my-base-app-seven.vercel.app",
      canonicalDomain: "my-base-app-seven.vercel.app",
      requiredChains: ["eip155:84532"],
    },
  });
}