/** Base64url → UTF-8 문자열 (JWT 헤더·페이로드용, 검증 없음) */
export function base64UrlDecodeToString(segment: string): string {
  const pad = segment.length % 4 === 0 ? "" : "=".repeat(4 - (segment.length % 4));
  const b64 = segment.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
}

export type JwtDecodeOk = {
  ok: true;
  headerJson: string;
  payloadJson: string;
  headerObj: unknown;
  payloadObj: unknown;
  signaturePresent: boolean;
};

export type JwtDecodeErr = {
  ok: false;
  message: string;
};

export function decodeJwtParts(token: string): JwtDecodeOk | JwtDecodeErr {
  const t = token.trim();
  if (!t) return { ok: false, message: "토큰을 입력하세요." };
  const parts = t.split(".");
  if (parts.length < 2) {
    return { ok: false, message: "JWT는 헤더·페이로드·(서명)을 마침표(.)로 구분합니다." };
  }
  const [h, p, sig] = parts;
  if (!h || !p) return { ok: false, message: "헤더 또는 페이로드가 비어 있습니다." };
  try {
    const headerRaw = base64UrlDecodeToString(h);
    const payloadRaw = base64UrlDecodeToString(p);
    const headerObj = JSON.parse(headerRaw) as unknown;
    const payloadObj = JSON.parse(payloadRaw) as unknown;
    return {
      ok: true,
      headerJson: JSON.stringify(headerObj, null, 2),
      payloadJson: JSON.stringify(payloadObj, null, 2),
      headerObj,
      payloadObj,
      signaturePresent: Boolean(sig && sig.length > 0),
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "디코딩 실패";
    return { ok: false, message: msg };
  }
}
