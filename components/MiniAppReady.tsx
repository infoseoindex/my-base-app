"use client";

import { useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

export default function MiniAppReady() {
  useEffect(() => {
    const init = async () => {
      try {
        await sdk.actions.ready();
      } catch (error) {
        console.error("Mini app ready error:", error);
      }
    };

    init();
  }, []);

  return null;
}