import Link from "next/link";
import { SearchXIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

export default function ParcelNotFound() {
  return (
    <Empty className="mx-auto my-24 max-w-lg">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <SearchXIcon />
        </EmptyMedia>
        <EmptyTitle>Parcelle introuvable</EmptyTitle>
        <EmptyDescription>
          Ce NUP n&apos;est pas encore dans la démonstration. Vérifiez les 9 chiffres ou consultez directement le cadastre de l&apos;ANDF.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center">
        <Link href="/recherche" className={buttonVariants({ size: "lg" })}>
          Nouvelle recherche
        </Link>
        <a href="https://cadastre.andf.bj/" target="_blank" rel="noreferrer" className={buttonVariants({ variant: "outline", size: "lg" })}>
          Cadastre ANDF
        </a>
      </EmptyContent>
    </Empty>
  );
}
