import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    // Permet aux pages de savoir si le vrai paiement est branché (la clé reste côté serveur).
    NEXT_PUBLIC_STRIPE_ENABLED: process.env.STRIPE_SECRET_KEY ? "1" : "0",
  },
};

export default nextConfig;
