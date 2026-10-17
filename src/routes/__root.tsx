import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { CartProvider } from "@/lib/cart";
import { DemoBanner } from "@/components/demo-banner";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { Toaster } from "sonner";
import appCss from "../styles.css?url";

const APP_NAME = "CDSI — Centre de Développement Solidaire et Inclusif";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      {
        name: "description",
        content:
          "CDSI — Centre de Développement Solidaire et Inclusif. Formation, artisanat, savonnerie et e-commerce solidaire à Dakar, Sénégal.",
      },
      { name: "theme-color", content: "#2F5233" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Work+Sans:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  component: RootDocument,
});

function RootDocument() {
  return (
    <html lang="fr" suppressHydrationWarning className="antialiased">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-cream font-sans text-charcoal">
        <PreviewHostBridge />
        <AuthProvider>
          <CartProvider>
            <DemoBanner />
            <SiteHeader />
            <main>
              <Outlet />
            </main>
            <SiteFooter />
            <WhatsAppFloat />
            <Toaster
              position="bottom-left"
              toastOptions={{
                className: "font-sans",
                style: {
                  background: "#f6f1e4",
                  color: "#262420",
                  border: "1px solid #ddd0a8",
                },
              }}
            />
          </CartProvider>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
