"use client";

import { useMemo, useState } from "react";
import type { ResolvedTool } from "@/content/tools/types";
import { ToolPageLayout } from "@/components/tool-page/ToolPageLayout";
import { FormTextarea } from "@/components/tool-page/FormTextarea";
import { ResultCard } from "@/components/tool-page/ResultCard";
import { ToolActionBar } from "@/components/tool-page/ToolActionBar";

type MetaDescriptionLengthToolProps = { tool: ResolvedTool };

export function MetaDescriptionLengthTool({ tool }: MetaDescriptionLengthToolProps) {
  const [text, setText] = useState("");
  const chars = useMemo(() => [...text].length, [text]);
  const recommendedMin = 80;
  const recommendedMax = 160;
  const status = chars < recommendedMin ? "짧음" : chars > recommendedMax ? "김" : "적정";

  return (
    <ToolPageLayout
      tool={tool}
      inputSlot={
        <div className="space-y-4">
          <FormTextarea
            label="메타 설명 문구"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[140px]"
            helperText="일반적으로 80~160자 범위에서 의미가 명확한 설명을 권장합니다."
          />
          <ToolActionBar
            onReset={() => setText("")}
            onExample={() =>
              setText("판매 수수료, 배송비, 마진을 한 번에 계산해 정산 금액을 빠르게 확인할 수 있는 무료 온라인 계산기입니다.")
            }
          />
        </div>
      }
      resultSlot={
        <ResultCard
          primaryLabel="메타 설명 길이"
          primaryValue={`${chars}자 (${status})`}
          copyText={`메타 설명 길이: ${chars}자\n상태: ${status}`}
          description="검색 노출 길이는 기기·검색어에 따라 달라질 수 있습니다."
          extraRows={[
            { label: "권장 범위", value: `${recommendedMin}~${recommendedMax}자` },
            { label: "상태", value: status },
          ]}
        />
      }
    />
  );
}

