// Règles d'accès au foncier (Code foncier et domanial, décision ANDF du 27/12/2024).
export type Nationality = "beninois" | "reciprocite" | "sans-reciprocite";
export type Area = "urbain" | "rural";
export type Size = "lt2" | "2-20" | "20-500" | "gt500";

export type Line = { tone: "ok" | "no" | "info"; text: string; href?: string };

/** Règles du Code foncier : qui peut acheter quoi (TR-06). */
export function rules(n: Nationality, a: Area, s: Size): Line[] {
  if (a === "urbain") {
    if (n === "sans-reciprocite")
      return [
        { tone: "no", text: "Achat impossible : votre pays n'applique pas la réciprocité avec le Bénin." },
        { tone: "info", text: "Vous pouvez prendre un bail de 50 ans maximum, non renouvelable." },
      ];
    return [
      { tone: "ok", text: "Vous pouvez acheter cette parcelle, par acte notarié." },
      { tone: "info", text: "Vérifiez d'abord la parcelle et demandez un état descriptif.", href: "/recherche" },
    ];
  }
  if (n !== "beninois")
    return [
      { tone: "no", text: "Achat impossible : les terres rurales sont réservées aux personnes de nationalité béninoise." },
      { tone: "info", text: "Un bail de 50 ans maximum, non renouvelable, reste possible." },
    ];
  const out: Line[] = [{ tone: "ok", text: "Vous pouvez acheter cette terre rurale." }];
  if (s !== "lt2") out.push({ tone: "info", text: "À partir de 2 ha, l'ANDF peut exercer son droit de préemption et doit viser la vente." });
  if (s === "20-500")
    out.push({ tone: "info", text: "Au-delà de 20 ha, faites approuver votre projet de mise en valeur par l'ANDF et prouvez l'origine des fonds." });
  if (s === "gt500") out.push({ tone: "info", text: "Au-delà de 500 ha, le projet est soumis au Conseil des ministres sur avis de l'ANDF." });
  out.push({ tone: "info", text: "Consultez le guide de l'achat en milieu rural.", href: "/guides/acheter-a-la-campagne" });
  return out;
}

