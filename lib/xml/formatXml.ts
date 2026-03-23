/** XML 텍스트 이스케이프(텍스트 노드용) */
function escapeText(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeAttr(s: string): string {
  return escapeText(s).replace(/"/g, "&quot;");
}

export function parseXmlDocument(xml: string): Document {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml.trim(), "application/xml");
  const err = doc.querySelector("parsererror");
  if (err) {
    const msg = err.textContent?.trim().slice(0, 280) || "XML 파싱 오류";
    throw new Error(msg);
  }
  return doc;
}

function prettyElement(el: Element, depth: number): string {
  const pad = "  ".repeat(depth);
  const name = el.tagName;
  let open = `${pad}<${name}`;
  for (let i = 0; i < el.attributes.length; i++) {
    const a = el.attributes[i]!;
    open += ` ${a.name}="${escapeAttr(a.value)}"`;
  }
  const childElements = [...el.childNodes].filter((n) => n.nodeType === Node.ELEMENT_NODE) as Element[];
  if (childElements.length === 0) {
    const text = [...el.childNodes]
      .filter((n) => n.nodeType === Node.TEXT_NODE || n.nodeType === Node.CDATA_SECTION_NODE)
      .map((n) => (n.nodeType === Node.CDATA_SECTION_NODE ? `<![CDATA[${(n as CDATASection).data}]]>` : (n.textContent ?? "")))
      .join("")
      .trim();
    if (!text) return `${open}/>`;
    return `${open}>${text.startsWith("<![CDATA[") ? text : escapeText(text)}</${name}>`;
  }
  let s = `${open}>\n`;
  for (const c of el.childNodes) {
    if (c.nodeType === Node.ELEMENT_NODE) {
      s += `${prettyElement(c as Element, depth + 1)}\n`;
    } else if (c.nodeType === Node.TEXT_NODE) {
      const t = c.textContent?.trim();
      if (t) s += `${pad}  ${escapeText(t)}\n`;
    } else if (c.nodeType === Node.CDATA_SECTION_NODE) {
      s += `${pad}  <![CDATA[${(c as CDATASection).data}]]>\n`;
    }
  }
  s += `${pad}</${name}>`;
  return s;
}

export function formatXmlPretty(xml: string): string {
  const doc = parseXmlDocument(xml);
  const root = doc.documentElement;
  if (!root) throw new Error("루트 요소가 없습니다.");
  return `${prettyElement(root, 0)}\n`;
}

export function formatXmlMinify(xml: string): string {
  const doc = parseXmlDocument(xml);
  const root = doc.documentElement;
  if (!root) throw new Error("루트 요소가 없습니다.");
  return new XMLSerializer().serializeToString(root);
}
