import type { SourceSnapshot } from "./ticketing";

export function parseSourceSnapshot(value: unknown): SourceSnapshot {
  if (!value || typeof value !== "object") throw new Error("Invalid source snapshot");
  const data = value as SourceSnapshot;
  if (typeof data.checkedAt !== "string" || !Number.isFinite(Date.parse(data.checkedAt)) || !Array.isArray(data.sources))
    throw new Error("Invalid source snapshot");
  const ids = new Set<string>();
  for (const source of data.sources) {
    if (!source || typeof source.id !== "string" || ids.has(source.id) ||
      typeof source.url !== "string" || typeof source.status !== "string" ||
      typeof source.note !== "string" || typeof source.checkedAt !== "string" ||
      !Number.isFinite(Date.parse(source.checkedAt))) throw new Error("Invalid source record");
    for (const field of ["title", "currency", "duration"] as const)
      if (source[field] !== undefined && typeof source[field] !== "string")
        throw new Error("Invalid source field");
    const url = new URL(source.url);
    if (url.protocol !== "https:" || !["www.lcsc.qa", "tickets.formula1.com", "f1experiences.com"].includes(url.hostname))
      throw new Error("Unsupported source URL");
    if (source.status === "reference-price" &&
      (typeof source.price !== "number" || !Number.isFinite(source.price) || source.price <= 0 || source.currency !== "QAR"))
      throw new Error("Invalid reference price");
    ids.add(source.id);
  }
  return data;
}
