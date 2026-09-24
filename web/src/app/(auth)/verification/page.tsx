import type { Metadata } from "next";
import { OtpForm } from "./otp-form";

export const metadata: Metadata = { title: "Vérification · Foncier Intelligent" };

export default function VerificationPage() {
  return (
    <div className="w-full max-w-sm">
      <h1 className="text-3xl font-extrabold text-navy">Code de vérification</h1>
      <p className="mt-2 text-muted-foreground">Saisissez le code à 6 chiffres envoyé par SMS. En démonstration, n&apos;importe quel code convient.</p>
      <OtpForm />
    </div>
  );
}
