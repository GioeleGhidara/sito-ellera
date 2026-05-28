const STORY_ICON_VALUES = [
  "sparkles",
  "scale",
  "clapperboard",
  "candy",
  "beef",
  "cat",
  "cog",
  "leaf",
  "church",
] as const;

type StoryIcon = (typeof STORY_ICON_VALUES)[number];

export interface Story {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  summary?: string;
  body: string;
  icon: StoryIcon;
  externalUrl?: string;
  externalLabel?: string;
}

type StoryFrontmatter = {
  id?: string;
  slug?: string;
  order?: string;
  title?: string;
  subtitle?: string;
  summary?: string;
  icon?: string;
  externalUrl?: string;
  externalLabel?: string;
};

type ParsedStory = Story & { order: number };

const STORY_ICONS = new Set<StoryIcon>(STORY_ICON_VALUES);
const STORY_FRONTMATTER_KEYS = new Set<keyof StoryFrontmatter>([
  "id",
  "slug",
  "order",
  "title",
  "subtitle",
  "summary",
  "icon",
  "externalUrl",
  "externalLabel",
]);

const FRONTMATTER_PATTERN = /^(?:\uFEFF)?---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

const markdownFiles = import.meta.glob("../../content/tradizioni/*.md", {
  eager: true,
  import: "default",
  query: "?raw",
}) as Record<string, string>;

const stripMatchingQuotes = (value: string) => {
  if (
    (value.startsWith("\"") && value.endsWith("\"")) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
};

const sanitizeOptionalString = (value?: string) => {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
};

const sanitizeRequiredString = (value: string | undefined, fallback: string) =>
  sanitizeOptionalString(value) ?? fallback;

const isStoryFrontmatterKey = (key: string): key is keyof StoryFrontmatter =>
  STORY_FRONTMATTER_KEYS.has(key as keyof StoryFrontmatter);

const isStoryIcon = (value?: string): value is StoryIcon =>
  typeof value === "string" && STORY_ICONS.has(value as StoryIcon);

const parseOrder = (value?: string) => {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) ? parsed : Number.MAX_SAFE_INTEGER;
};

const isHttpUrl = (value?: string) => {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const parseFrontmatter = (rawContent: string): { data: StoryFrontmatter; body: string } => {
  const match = rawContent.match(FRONTMATTER_PATTERN);
  if (!match) {
    return { data: {}, body: rawContent.trim() };
  }

  const [, frontmatterBlock, markdownBody] = match;
  const data: StoryFrontmatter = {};

  for (const line of frontmatterBlock.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf(":");
    if (separatorIndex <= 0) continue;

    const keyCandidate = trimmed.slice(0, separatorIndex).trim();
    if (!isStoryFrontmatterKey(keyCandidate)) continue;

    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    data[keyCandidate] = stripMatchingQuotes(rawValue).trim();
  }

  return { data, body: markdownBody.trim() };
};

const getFilenameWithoutExtension = (filePath: string) => {
  const normalized = filePath.replace(/\\/g, "/");
  const filename = normalized.split("/").pop() ?? normalized;
  return filename.replace(/\.md$/i, "");
};

const parseStory = (filePath: string, rawContent: string): ParsedStory => {
  const { data, body } = parseFrontmatter(rawContent);
  const fallbackSlug = getFilenameWithoutExtension(filePath);

  const slug = sanitizeRequiredString(data.slug, fallbackSlug);
  const externalUrl = sanitizeOptionalString(data.externalUrl);

  return {
    id: sanitizeRequiredString(data.id, fallbackSlug),
    slug,
    title: sanitizeRequiredString(data.title, fallbackSlug),
    subtitle: sanitizeOptionalString(data.subtitle) ?? "",
    summary: sanitizeOptionalString(data.summary),
    body: body.trim(),
    icon: isStoryIcon(data.icon) ? data.icon : "sparkles",
    externalUrl: isHttpUrl(externalUrl) ? externalUrl : undefined,
    externalLabel: sanitizeOptionalString(data.externalLabel),
    order: parseOrder(data.order),
  };
};

export const stories: Story[] = Object.entries(markdownFiles)
  .map(([filePath, rawContent]) => parseStory(filePath, rawContent))
  .sort(
    (a, b) =>
      a.order - b.order ||
      a.slug.localeCompare(b.slug, "it") ||
      a.title.localeCompare(b.title, "it"),
  )
  .map(({ order: _order, ...story }) => story);
