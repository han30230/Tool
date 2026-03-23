"use client";

import { useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormTextarea } from "@/components/tool-page/FormTextarea";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

type JsonSchemaTemplateToolProps = { tool: ResolvedTool };

type Json = null | boolean | number | string | Json[] | { [k: string]: Json };

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function detectStringFormat(v: string): string | undefined {
  if (/^\S+@\S+\.\S+$/.test(v)) return "email";
  if (/^https?:\/\/\S+$/i.test(v)) return "uri";
  if (!Number.isNaN(Date.parse(v)) && /[T:\-]/.test(v)) return "date-time";
  if (UUID_RE.test(v)) return "uuid";
  return undefined;
}

function inferSchema(value: Json): Record<string, unknown> {
  if (value === null) return { type: "null" };
  if (Array.isArray(value)) {
    const first = value[0] as Json | undefined;
    const enumValues = inferEnumCandidates(value);
    return {
      type: "array",
      items: first === undefined ? {} : inferSchema(first),
      ...(enumValues ? { enum: enumValues } : {}),
    };
  }
  const t = typeof value;
  if (t === "string") {
    const s = value as string;
    const fmt = detectStringFormat(s);
    return { type: "string", ...(fmt ? { format: fmt } : {}) };
  }
  if (t === "number" || t === "boolean") {
    return { type: t };
  }
  const obj = value as Record<string, Json>;
  const properties: Record<string, unknown> = {};
  const required: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    properties[k] = inferSchema(v);
    required.push(k);
  }
  return { type: "object", properties, required, additionalProperties: false };
}

function inferEnumCandidates(values: Json[]): string[] | number[] | undefined {
  if (values.length < 2 || values.length > 12) return undefined;
  const allStrings = values.every((v) => typeof v === "string");
  const allNumbers = values.every((v) => typeof v === "number");
  if (!allStrings && !allNumbers) return undefined;
  const unique = [...new Set(values as (string | number)[])];
  if (unique.length < 2 || unique.length > 12) return undefined;
  return unique as string[] | number[];
}

export function JsonSchemaTemplateTool({ tool }: JsonSchemaTemplateToolProps) {
  const [raw, setRaw] = useState('{"id":1,"name":"홍길동","active":true}');

  const result = useMemo(() => {
    const t = raw.trim();
    if (!t) return { ok: false as const, msg: "", schema: "" };
    try {
      const parsed = JSON.parse(t) as Json;
      const schema = {
        $schema: "https://json-schema.org/draft/2020-12/schema",
        title: "GeneratedSchema",
        ...inferSchema(parsed),
      };
      return { ok: true as const, msg: "", schema: JSON.stringify(schema, null, 2) };
    } catch (e) {
      return { ok: false as const, msg: e instanceof Error ? e.message : "JSON 파싱 오류", schema: "" };
    }
  }, [raw]);

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <FormTextarea label="샘플 JSON" value={raw} onChange={(e) => setRaw(e.target.value)} className="min-h-[180px] font-mono text-sm" />
          <ToolActionBar onReset={() => setRaw("")} onExample={() => setRaw('{"id":1,"name":"홍길동","tags":["a","b"],"profile":{"age":30}}')} />
        </div>
      }
      resultSlot={
        result.ok ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
            <div className="mb-2 text-xs font-semibold text-[var(--accent)]">생성된 JSON Schema</div>
            <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap break-words text-sm text-[var(--foreground)]">{result.schema}</pre>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-6 text-sm text-[var(--muted)]">
            {result.msg || "샘플 JSON을 입력하면 스키마 템플릿을 생성합니다."}
          </div>
        )
      }
    />
  );
}

