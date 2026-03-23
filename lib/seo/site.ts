/**
 * canonical·sitemap·robots·JSON-LD에 사용.
 * - 우선 `NEXT_PUBLIC_SITE_URL`(운영 도메인 고정 권장)
 * - 미설정 시 Vercel이 주입하는 `VERCEL_URL`(preview/production)
 * - 로컬 빌드는 localhost
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (explicit) return explicit;

  const vercel = process.env.VERCEL_URL?.trim().replace(/\/$/, "");
  if (vercel) {
    return `https://${vercel}`;
  }

  return "http://localhost:3000";
}
