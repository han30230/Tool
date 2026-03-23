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
import { TipCalculatorTool } from "@/components/tools/implementations/TipCalculatorTool";
import { SplitBillTool } from "@/components/tools/implementations/SplitBillTool";
import { WaterIntakeTool } from "@/components/tools/implementations/WaterIntakeTool";
import { PaceCalculatorTool } from "@/components/tools/implementations/PaceCalculatorTool";
import { FuelConverterTool } from "@/components/tools/implementations/FuelConverterTool";
import { WorldClockTool } from "@/components/tools/implementations/WorldClockTool";
import { SpeedConverterTool } from "@/components/tools/implementations/SpeedConverterTool";
import { UnixTimestampTool } from "@/components/tools/implementations/UnixTimestampTool";
import { UuidGeneratorTool } from "@/components/tools/implementations/UuidGeneratorTool";
import { ColorConverterTool } from "@/components/tools/implementations/ColorConverterTool";
import { RegexTesterTool } from "@/components/tools/implementations/RegexTesterTool";
import { BinaryConverterTool } from "@/components/tools/implementations/BinaryConverterTool";
import { LoremIpsumTool } from "@/components/tools/implementations/LoremIpsumTool";
import { SlugifyTool } from "@/components/tools/implementations/SlugifyTool";
import { RandomPickerTool } from "@/components/tools/implementations/RandomPickerTool";
import { CoinFlipTool } from "@/components/tools/implementations/CoinFlipTool";
import { VatTool } from "@/components/tools/implementations/VatTool";
import { WhitespaceTool } from "@/components/tools/implementations/WhitespaceTool";
import { QrCodeTool } from "@/components/tools/implementations/QrCodeTool";
import { HashGeneratorTool } from "@/components/tools/implementations/HashGeneratorTool";
import { InchCmTool } from "@/components/tools/implementations/InchCmTool";
import { KgLbTool } from "@/components/tools/implementations/KgLbTool";
import { CelsiusFahrenheitTool } from "@/components/tools/implementations/CelsiusFahrenheitTool";
import { DataUnitConverterTool } from "@/components/tools/implementations/DataUnitConverterTool";
import { HtmlEscapeTool } from "@/components/tools/implementations/HtmlEscapeTool";
import { LineDedupeTool } from "@/components/tools/implementations/LineDedupeTool";
import { MarkdownPreviewTool } from "@/components/tools/implementations/MarkdownPreviewTool";
import { CsvJsonTool } from "@/components/tools/implementations/CsvJsonTool";
import { ExchangeRateTool } from "@/components/tools/implementations/ExchangeRateTool";
import { TodoChecklistTool } from "@/components/tools/implementations/TodoChecklistTool";
import { TimerStopwatchTool } from "@/components/tools/implementations/TimerStopwatchTool";
import { ImageCompressorTool } from "@/components/tools/implementations/ImageCompressorTool";
import { PdfMergeSplitTool } from "@/components/tools/implementations/PdfMergeSplitTool";
import { FaviconGeneratorTool } from "@/components/tools/implementations/FaviconGeneratorTool";
import { XmlFormatTool } from "@/components/tools/implementations/XmlFormatTool";
import { YamlJsonTool } from "@/components/tools/implementations/YamlJsonTool";
import { JwtDecoderTool } from "@/components/tools/implementations/JwtDecoderTool";
import { ImageResizerTool } from "@/components/tools/implementations/ImageResizerTool";
import { ImageFormatConverterTool } from "@/components/tools/implementations/ImageFormatConverterTool";
import { ImageToPdfTool } from "@/components/tools/implementations/ImageToPdfTool";
import { PdfToImageTool } from "@/components/tools/implementations/PdfToImageTool";
import { SalesFeeCalculatorTool } from "@/components/tools/implementations/SalesFeeCalculatorTool";
import { UnitCostWithShippingTool } from "@/components/tools/implementations/UnitCostWithShippingTool";
import { BreakEvenTool } from "@/components/tools/implementations/BreakEvenTool";
import { JeonseWolseTool } from "@/components/tools/implementations/JeonseWolseTool";
import { MeetingTimeTool } from "@/components/tools/implementations/MeetingTimeTool";
import { TitleLengthTool } from "@/components/tools/implementations/TitleLengthTool";
import { MetaDescriptionLengthTool } from "@/components/tools/implementations/MetaDescriptionLengthTool";
import { HashtagCleanerTool } from "@/components/tools/implementations/HashtagCleanerTool";
import { RoiCalculatorTool } from "@/components/tools/implementations/RoiCalculatorTool";
import { AiTokenCalculatorTool } from "@/components/tools/implementations/AiTokenCalculatorTool";
import { PromptLengthTool } from "@/components/tools/implementations/PromptLengthTool";
import { ModelCostEstimatorTool } from "@/components/tools/implementations/ModelCostEstimatorTool";
import { TextChunkSplitterTool } from "@/components/tools/implementations/TextChunkSplitterTool";
import { JsonSchemaTemplateTool } from "@/components/tools/implementations/JsonSchemaTemplateTool";
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
  "tip-calculator": TipCalculatorTool,
  "split-bill": SplitBillTool,
  "water-intake": WaterIntakeTool,
  "pace-calculator": PaceCalculatorTool,
  "fuel-converter": FuelConverterTool,
  "world-clock": WorldClockTool,
  "speed-converter": SpeedConverterTool,
  "unix-timestamp": UnixTimestampTool,
  "uuid-generator": UuidGeneratorTool,
  "color-converter": ColorConverterTool,
  "regex-tester": RegexTesterTool,
  "binary-converter": BinaryConverterTool,
  "lorem-ipsum": LoremIpsumTool,
  slugify: SlugifyTool,
  "random-picker": RandomPickerTool,
  "coin-flip": CoinFlipTool,
  "qr-code-generator": QrCodeTool,
  "hash-generator": HashGeneratorTool,
  "inch-cm": InchCmTool,
  "kg-lb": KgLbTool,
  "celsius-fahrenheit": CelsiusFahrenheitTool,
  "data-unit-converter": DataUnitConverterTool,
  "html-escape": HtmlEscapeTool,
  "line-dedupe": LineDedupeTool,
  "markdown-preview": MarkdownPreviewTool,
  "csv-json": CsvJsonTool,
  "exchange-rate": ExchangeRateTool,
  "todo-checklist": TodoChecklistTool,
  "timer-stopwatch": TimerStopwatchTool,
  "image-compressor": ImageCompressorTool,
  "pdf-merge-split": PdfMergeSplitTool,
  "favicon-generator": FaviconGeneratorTool,
  "xml-formatter": XmlFormatTool,
  "yaml-json": YamlJsonTool,
  "jwt-decoder": JwtDecoderTool,
  "image-resizer": ImageResizerTool,
  "image-format-converter": ImageFormatConverterTool,
  "image-to-pdf": ImageToPdfTool,
  "pdf-to-image": PdfToImageTool,
  "sales-fee-calculator": SalesFeeCalculatorTool,
  "unit-cost-with-shipping": UnitCostWithShippingTool,
  "roi-calculator": RoiCalculatorTool,
  "break-even": BreakEvenTool,
  "jeonse-wolse": JeonseWolseTool,
  "meeting-time": MeetingTimeTool,
  "title-length": TitleLengthTool,
  "meta-description-length": MetaDescriptionLengthTool,
  "hashtag-cleaner": HashtagCleanerTool,
  "ai-token-calculator": AiTokenCalculatorTool,
  "prompt-length": PromptLengthTool,
  "model-cost-estimator": ModelCostEstimatorTool,
  "text-chunk-splitter": TextChunkSplitterTool,
  "json-schema-template": JsonSchemaTemplateTool,
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
