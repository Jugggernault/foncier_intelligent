// Génère les PDF fictifs de la démo (pdfcn + Forme) dans public/demo-docs/.
// Usage : bun scripts/generate-demo-docs.tsx
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { renderDocument } from "@formepdf/core";
import { Document, Page } from "@formepdf/react";
import { View } from "@/lib/pdf-primitives";
import { Divider } from "@/components/pdf/divider/divider";
import { Heading } from "@/components/pdf/heading/heading";
import { KeyValue } from "@/components/pdf/key-value/key-value";
import { PageFooter } from "@/components/pdf/page-footer/page-footer";
import { Section } from "@/components/pdf/section/section";
import { PdfSignatureBlock } from "@/components/pdf/signature/signature";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/pdf/table/table";
import { Text } from "@/components/pdf/text/text";
import { PdfWatermark } from "@/components/pdf/watermark/watermark";
import { DEMO_DOCS, type DemoDoc } from "@/content/demo-documents";

const fcfa = (n: number) => `${new Intl.NumberFormat("fr-FR").format(n).replace(/ /g, " ")} FCFA`;
const date = (iso: string) => new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));

function Body({ doc }: { doc: DemoDoc }) {
  if (doc.kind === "leve")
    return (
      <View>
        <Heading level={1}>Plan de levé topographique</Heading>
        <Text variant="sm">{doc.surveyor}</Text>
        <Divider spacing="md" />
        <KeyValue
          items={[
            { key: "Client", value: doc.client },
            { key: "Commune", value: doc.commune },
            { key: "Quartier / village", value: doc.quartier },
            { key: "Superficie", value: `${doc.declaredM2} m²` },
            { key: "Système de coordonnées", value: "UTM zone 31 Nord (WGS 84)" },
            { key: "Date du levé", value: date(doc.date) },
          ]}
        />
        <Section spacing="lg">
          <Heading level={3}>Tableau des coordonnées des bornes</Heading>
          <Table variant="grid">
            <TableHeader>
              <TableRow header>
                <TableCell header>Borne</TableCell>
                <TableCell header align="right">X (m)</TableCell>
                <TableCell header align="right">Y (m)</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {doc.bornes.map((b) => (
                <TableRow key={b.borne}>
                  <TableCell>{b.borne}</TableCell>
                  <TableCell align="right">{b.x.toFixed(2)}</TableCell>
                  <TableCell align="right">{b.y.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Section>
        <PdfSignatureBlock label="Le géomètre-expert" name="Géo-Précision" date={date(doc.date)} />
      </View>
    );
  if (doc.kind === "adc")
    return (
      <View>
        <Heading level={1}>Attestation de détention coutumière</Heading>
        <Text variant="sm">République du Bénin (document fictif de démonstration)</Text>
        <Divider spacing="md" />
        <Text>
          Nous, {doc.signatory}, attestons que {doc.holder} détient selon la coutume une parcelle de terrain d&apos;une superficie de {doc.declaredM2} m², sise au
          quartier {doc.quartier}, commune de {doc.commune}, sans contestation connue à ce jour.
        </Text>
        <Section spacing="lg">
          <KeyValue
            items={[
              { key: "Détenteur", value: doc.holder },
              { key: "Localisation", value: `${doc.quartier}, ${doc.commune}` },
              { key: "Superficie", value: `${doc.declaredM2} m²` },
              { key: "Date", value: date(doc.date) },
            ]}
          />
        </Section>
        <PdfSignatureBlock label="Le signataire" name={doc.signatory} date={date(doc.date)} />
      </View>
    );
  return (
    <View>
      <Heading level={1}>Convention de vente de terrain</Heading>
      <Text variant="sm">Acte sous seing privé (document fictif de démonstration)</Text>
      <Divider spacing="md" />
      <Text>
        Entre {doc.seller}, ci-après « le vendeur », et {doc.buyer}, ci-après « l&apos;acquéreur », il a été convenu la vente d&apos;une parcelle de {doc.declaredM2} m² sise
        à {doc.quartier}, commune de {doc.commune}, au prix de {fcfa(doc.price)}.
      </Text>
      <Section spacing="lg">
        <KeyValue
          items={[
            { key: "Vendeur", value: doc.seller },
            { key: "Acquéreur", value: doc.buyer },
            { key: "Prix", value: fcfa(doc.price) },
            { key: "Superficie", value: `${doc.declaredM2} m²` },
            { key: "Date", value: date(doc.date) },
          ]}
        />
      </Section>
      <PdfSignatureBlock variant="double" signers={[{ label: "Le vendeur", name: doc.seller }, { label: "L'acquéreur", name: doc.buyer }]} />
    </View>
  );
}

const out = join(import.meta.dir, "../public/demo-docs");
await mkdir(out, { recursive: true });
for (const doc of DEMO_DOCS) {
  const pdf = await renderDocument(
    <Document title={doc.title} author="Foncier Intelligent (démo)">
      <Page size="A4" margin={48}>
        <PdfWatermark text="DÉMONSTRATION" />
        <Body doc={doc} />
        <PageFooter leftText="Document fictif · Foncier Intelligent" />
      </Page>
    </Document>
  );
  await writeFile(join(out, doc.file), pdf);
  console.log(doc.file);
}
