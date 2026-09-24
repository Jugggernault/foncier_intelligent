"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export function OtpForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  return (
    <form
      className="mt-8 space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        router.push("/connexion/role");
      }}
    >
      <InputOTP maxLength={6} value={code} onChange={setCode} aria-label="Code de vérification">
        <InputOTPGroup>
          {Array.from({ length: 6 }, (_, i) => (
            <InputOTPSlot key={i} index={i} className="size-12 text-lg" />
          ))}
        </InputOTPGroup>
      </InputOTP>
      <Button type="submit" size="lg" className="h-11 w-full" disabled={code.length < 6}>
        Valider
      </Button>
    </form>
  );
}
