import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { ToolRouter } from "@/components/tools/ToolRouter";
import { getAllToolSlugs, getToolBySlug } from "@/content/tools/registry";
import { buildToolMetadata } from "@/lib/seo/metadata";
import { buildToolStructuredGraph } from "@/lib/seo/structured";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllToolSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};
  return buildToolMetadata(tool);
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const jsonLd = buildToolStructuredGraph(tool);

  return (
    <>
      <JsonLd data={jsonLd} />
      <ToolRouter slug={slug} tool={tool} />
    </>
  );
}
