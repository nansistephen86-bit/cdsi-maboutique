import { buildWhatsAppGenericUrl } from "@/lib/whatsapp";

export function WhatsAppFloat() {
  return (
    <a
      href={buildWhatsAppGenericUrl("Bonjour CDSI, j'ai une question.")}
      className="fixed right-5 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-50 flex size-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lift transition-colors duration-200 hover:bg-whatsapp-dark"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contacter CDSI sur WhatsApp"
      title="Contacter CDSI sur WhatsApp"
    >
      <svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor" aria-hidden="true">
        <path d="M16.04 4C9.4 4 4 9.37 4 16c0 2.24.62 4.34 1.7 6.13L4 28l6.05-1.66A11.94 11.94 0 0 0 16.04 28C22.68 28 28 22.63 28 16S22.68 4 16.04 4Zm0 21.8c-1.94 0-3.75-.55-5.28-1.5l-.38-.23-3.6.99.97-3.5-.25-.4a9.73 9.73 0 0 1-1.5-5.16c0-5.4 4.4-9.8 9.83-9.8 5.42 0 9.83 4.4 9.83 9.8 0 5.42-4.4 9.8-9.83 9.8Zm5.4-7.35c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.66.15-.2.3-.76.96-.93 1.15-.17.2-.34.22-.64.07-.3-.15-1.25-.46-2.37-1.46a8.9 8.9 0 0 1-1.65-2.05c-.17-.3-.02-.46.13-.6.13-.13.3-.34.44-.5.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.66-1.6-.9-2.2-.24-.57-.48-.5-.66-.5h-.56c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.08 4.5.71.3 1.26.49 1.7.62.71.23 1.36.2 1.87.12.57-.08 1.75-.71 2-1.4.24-.68.24-1.27.17-1.4-.07-.13-.27-.2-.57-.35Z" />
      </svg>
    </a>
  );
}
