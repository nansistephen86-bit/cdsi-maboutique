import { existsSync } from "node:fs";
import { join } from "node:path";
import { env, isWorkspacePreview } from "@/lib/env.server";
import { siteConfig } from "@/data/site-config";

function firstEnv(...keys: string[]): string | undefined {
  for (const key of keys) {
    const v = env(key);
    if (v) return v;
  }
  return undefined;
}

export type PaymentSettings = {
  wavePhone: string;
  waveName: string;
  waveQrUrl: string | null;
  orangePhone: string;
  orangeName: string;
  orangeQrUrl: string | null;
  adminEmail: string;
  deliveryFee: number;
};

function publicAssetIfPresent(filename: string): string | null {
  const rel = `/images/paiement/${filename}`;
  const abs = join(process.cwd(), "public", "images", "paiement", filename);
  return existsSync(abs) ? rel : null;
}

export function getPaymentSettings(): PaymentSettings {
  const defaultPhone = siteConfig.paiement.numero;
  const deliveryRaw = firstEnv("DELIVERY_FEE");
  const deliveryFee = deliveryRaw ? Number(deliveryRaw) : siteConfig.livraison.forfait;
  return {
    wavePhone: firstEnv("WAVE_PHONE_NUMBER") ?? defaultPhone,
    waveName: firstEnv("WAVE_ACCOUNT_NAME") ?? siteConfig.nomCourt,
    waveQrUrl: firstEnv("WAVE_QR_URL") ?? publicAssetIfPresent("wave-qr.png"),
    orangePhone: firstEnv("ORANGE_MONEY_PHONE_NUMBER") ?? defaultPhone,
    orangeName: firstEnv("ORANGE_MONEY_ACCOUNT_NAME") ?? siteConfig.nomCourt,
    orangeQrUrl: firstEnv("ORANGE_MONEY_QR_URL") ?? publicAssetIfPresent("orange-qr.png"),
    adminEmail: firstEnv("ADMIN_EMAIL") ?? siteConfig.email,
    deliveryFee: Number.isFinite(deliveryFee) ? deliveryFee : 2000,
  };
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const configured = (firstEnv("ADMIN_EMAIL") ?? siteConfig.email)
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (configured.includes(email.toLowerCase())) return true;
  return isWorkspacePreview();
}
