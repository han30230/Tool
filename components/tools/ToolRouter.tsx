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
import { TakeHomePayTool } from "@/components/tools/implementations/TakeHomePayTool";
import { SeverancePayTool } from "@/components/tools/implementations/SeverancePayTool";
import { WeeklyHolidayPayTool } from "@/components/tools/implementations/WeeklyHolidayPayTool";
import { AnnualLeaveTool } from "@/components/tools/implementations/AnnualLeaveTool";
import { BmiTool } from "@/components/tools/implementations/BmiTool";
import { LoanTool } from "@/components/tools/implementations/LoanTool";
import { CompoundInterestTool } from "@/components/tools/implementations/CompoundInterestTool";
import { KoreanAgeTool } from "@/components/tools/implementations/KoreanAgeTool";
import { DdayTool } from "@/components/tools/implementations/DdayTool";
import { HourlyMonthlyTool } from "@/components/tools/implementations/HourlyMonthlyTool";
import { SleepCycleTool } from "@/components/tools/implementations/SleepCycleTool";
import { PasswordGeneratorTool } from "@/components/tools/implementations/PasswordGeneratorTool";
import { RandomNumberTool } from "@/components/tools/implementations/RandomNumberTool";
import { UrlEncodeTool } from "@/components/tools/implementations/UrlEncodeTool";
import { Base64Tool } from "@/components/tools/implementations/Base64Tool";
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
  "take-home-pay": TakeHomePayTool,
  "severance-pay": SeverancePayTool,
  "weekly-holiday-pay": WeeklyHolidayPayTool,
  "annual-leave": AnnualLeaveTool,
  date: DateTool,
  area: AreaTool,
  whitespace: WhitespaceTool,
  "json-format": JsonFormatTool,
  bmi: BmiTool,
  loan: LoanTool,
  "compound-interest": CompoundInterestTool,
  "korean-age": KoreanAgeTool,
  dday: DdayTool,
  "hourly-monthly": HourlyMonthlyTool,
  "sleep-cycle": SleepCycleTool,
  "password-generator": PasswordGeneratorTool,
  "random-number": RandomNumberTool,
  "url-encode": UrlEncodeTool,
  base64: Base64Tool,
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
