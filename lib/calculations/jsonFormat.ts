export type JsonFormatOk = {
  ok: true;
  pretty: string;
  minify: string;
};

export type JsonFormatErr = {
  ok: false;
  message: string;
};

export function formatJsonString(raw: string): JsonFormatOk | JsonFormatErr {
  const trimmed = raw.trim();
  if (trimmed === "") {
    return { ok: false, message: "JSON 문자열을 입력해 주세요." };
  }
  try {
    const v = JSON.parse(trimmed);
    return {
      ok: true,
      pretty: JSON.stringify(v, null, 2),
      minify: JSON.stringify(v),
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "JSON 형식이 올바르지 않습니다.";
    return {
      ok: false,
      message: `JSON을 읽을 수 없습니다. ${msg}`,
    };
  }
}
