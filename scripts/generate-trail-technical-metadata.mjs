import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const tracksDir = path.join(projectRoot, "public", "tracks");
const outputPath = path.join(projectRoot, "src", "data", "trails", "trailTechnicalMetadata.ts");

const technicalPattern =
  /^(.*?)\.\s+Lunghezza\s+(.+?)(?:\s+-\s+Salita\s+(.+?)\s+-\s+Discesa\s+(.+?)|\s+-\s+Dislivello\s+(.+?))\.\s+Tempo medio:\s+(.+?)\.$/;

function extractMetadataDescription(gpxText) {
  return gpxText.match(/<metadata>[\s\S]*?<desc>([\s\S]*?)<\/desc>/i)?.[1]?.trim() ?? null;
}

function parseTechnicalDescription(description) {
  const match = description.match(technicalPattern);
  if (!match) {
    return null;
  }

  const [, , length, ascent, descent, elevation, estimatedTime] = match;

  return {
    specs:
      ascent && descent
        ? `Lunghezza ${length} - Salita ${ascent} - Discesa ${descent}`
        : `Lunghezza ${length} - Dislivello ${elevation}`,
    length,
    ...(ascent ? { ascent } : {}),
    ...(descent ? { descent } : {}),
    ...(elevation ? { elevation } : {}),
    estimatedTime,
  };
}

function buildOutput(entries) {
  return `// Generated from public/tracks/*.gpx by scripts/generate-trail-technical-metadata.mjs
export interface TrailTechnicalMetadata {
  specs: string;
  length: string;
  elevation?: string;
  ascent?: string;
  descent?: string;
  estimatedTime: string;
}

export const trailTechnicalMetadataBySlug = ${JSON.stringify(entries, null, 2)} satisfies Record<string, TrailTechnicalMetadata>;
`;
}

const files = (await fs.readdir(tracksDir))
  .filter((file) => file.endsWith(".gpx"))
  .sort((a, b) => a.localeCompare(b));

const trailTechnicalMetadataBySlug = {};

for (const file of files) {
  const slug = file.replace(/\.gpx$/i, "");
  const gpxText = await fs.readFile(path.join(tracksDir, file), "utf8");
  const description = extractMetadataDescription(gpxText);
  if (!description) {
    continue;
  }

  const parsed = parseTechnicalDescription(description);
  if (!parsed) {
    continue;
  }

  trailTechnicalMetadataBySlug[slug] = parsed;
}

await fs.writeFile(outputPath, buildOutput(trailTechnicalMetadataBySlug), "utf8");
