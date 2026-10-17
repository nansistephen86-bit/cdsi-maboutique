import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatFCFA } from "@/lib/format";
import { isMobileMoney } from "@/lib/orders/status";

export type PublicPaymentInfo = {
  wavePhone: string;
  waveName: string;
  waveQrUrl: string | null;
  orangePhone: string;
  orangeName: string;
  orangeQrUrl: string | null;
};

export function PaymentInstructions({
  method,
  amount,
  orderNumber,
  settings,
}: {
  method: string;
  amount: number;
  orderNumber: string;
  settings: PublicPaymentInfo;
}) {
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(value: string, key: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      toast.success(`${label} copié`);
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      toast.error("Impossible de copier");
    }
  }

  if (method === "Espèces à la livraison") {
    return (
      <div className="rounded-md border border-sand-dark bg-sand p-4">
        <p className="m-0 font-semibold text-forest-dark">Paiement à la livraison</p>
        <p className="mt-2 mb-0 text-sm">
          Vous paierez le montant total de votre commande ({formatFCFA(amount)}) directement au
          livreur lors de la livraison.
        </p>
      </div>
    );
  }

  if (!isMobileMoney(method)) return null;

  const phone = method === "Wave" ? settings.wavePhone : settings.orangePhone;
  const name = method === "Wave" ? settings.waveName : settings.orangeName;
  const qr = method === "Wave" ? settings.waveQrUrl : settings.orangeQrUrl;

  return (
    <div className="rounded-md border border-forest/30 bg-sand p-4">
      <p className="m-0 font-semibold text-forest-dark">Payer par {method}</p>
      <dl className="mt-3 grid gap-2 text-sm">
        <div className="flex justify-between gap-3">
          <dt>Bénéficiaire</dt>
          <dd className="m-0 font-semibold">{name}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Numéro {method}</dt>
          <dd className="m-0 font-semibold tabular-nums">{phone}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Montant</dt>
          <dd className="m-0 font-semibold tabular-nums">{formatFCFA(amount)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Commande</dt>
          <dd className="m-0 font-semibold">{orderNumber}</dd>
        </div>
      </dl>
      {qr ? (
        <div className="mt-4 flex justify-center">
          <img
            src={qr}
            alt={`QR code ${method}`}
            className="size-44 rounded-sm border border-sand-dark bg-white object-contain p-2"
          />
        </div>
      ) : (
        <p className="mt-3 mb-0 rounded-sm bg-white p-3 text-[0.82rem] text-charcoal-soft">
          Le QR code {method} sera affiché ici dès qu'il sera ajouté par CDSI. En attendant, payez
          avec le numéro ci-dessus.
        </p>
      )}
      <p className="mt-3 mb-3 text-[0.82rem] text-charcoal-soft">
        Ouvrez {method}, envoyez {formatFCFA(amount)} au {phone}. Utilisez le numéro de commande{" "}
        <strong>{orderNumber}</strong> comme référence ou libellé si l'application le permet.
        CDSI vérifiera ensuite le paiement manuellement — il n'est pas confirmé automatiquement.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="secondary" size="sm" onClick={() => copy(phone, "phone", "Numéro")}>
          {copied === "phone" ? <Check className="size-4" /> : <Copy className="size-4" />}
          Copier le numéro
        </Button>
        <Button type="button" variant="secondary" size="sm" onClick={() => copy(String(amount), "amount", "Montant")}>
          {copied === "amount" ? <Check className="size-4" /> : <Copy className="size-4" />}
          Copier le montant
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => copy(orderNumber, "ref", "Référence")}
        >
          {copied === "ref" ? <Check className="size-4" /> : <Copy className="size-4" />}
          Copier la référence
        </Button>
      </div>
    </div>
  );
}
