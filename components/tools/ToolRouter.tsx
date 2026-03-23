import type { ResolvedTool } from "@/content/tools/types";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { AreaTool } from "@/components/tools/implementations/AreaTool";
import { CharCountTool } from "@/components/tools/implementations/CharCountTool";
import { DateTool } from "@/components/tools/implementations/DateTool";
import { DiscountTool } from "@/components/tools/implementations/DiscountTool";
import { JsonFormatTool } from "@/components/tools/implementations/JsonFormatTool";
import { MarginTool } from "@/components/tools/implementations/MarginTool";
import { PercentTool } from "@/components/tools/implementations/PercentTool";
import { SalaryTool } from "@/components/tools/implementations/SalaryTool";
import { VatTool } from "@/components/tools/implementations/VatTool";
import { WhitespaceTool } from "@/components/tools/implementations/WhitespaceTool";
import {
  ToolPlaceholderInput,
  ToolPlaceholderResult,
} from "@/components/tools/ToolPlaceholder";

const implemented = {
  vat: VatTool,
  percent: PercentTool,
  discount: DiscountTool,
  margin: MarginTool,
  "char-count": CharCountTool,
  salary: SalaryTool,
  date: DateTool,
  area: AreaTool,
  whitespace: WhitespaceTool,
  "json-format": JsonFormatTool,
} as const;

type ImplementedSlug = keyof typeof implemented;

function isImplementedSlug(slug: string): slug is ImplementedSlug {
  return slug in implemented;
}

type ToolRouterProps = {
  slug: string;
  tool: ResolvedTool;
};

export function ToolRouter({ slug, tool }: ToolRouterProps) {
  if (isImplementedSlug(slug)) {
    const Impl = implemented[slug];
    return <Impl tool={tool} />;
  }

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={<ToolPlaceholderInput tool={tool} />}
      resultSlot={<ToolPlaceholderResult tool={tool} />}
    />
  );
}
