import a0HalloIkBenPackage from "./packages/lessons/a0-hallo-ik-ben.json";
import a0IkHebDitNodigPackage from "./packages/lessons/a0-ik-heb-dit-nodig.json";
import a0IkWoonEnWerkHierPackage from "./packages/lessons/a0-ik-woon-en-werk-hier.json";
import a0WoonJeHierPackage from "./packages/lessons/a0-woon-je-hier.json";
import a1KuntUDatHerhalenPackage from "./packages/lessons/a1-kunt-u-dat-herhalen.json";
import a1IkWilGraagBestellenPackage from "./packages/lessons/a1-ik-wil-graag-bestellen.json";
import a1KanIkMetPinBetalenPackage from "./packages/lessons/a1-kan-ik-met-pin-betalen.json";
import a1WaarMoetIkOverstappenPackage from "./packages/lessons/a1-waar-moet-ik-overstappen.json";
import a1MijnTreinIsVertraagdPackage from "./packages/lessons/a1-mijn-trein-is-vertraagd.json";
import a1EenAfspraakMakenPackage from "./packages/lessons/a1-een-afspraak-maken.json";
import a1IkHebLastVanPackage from "./packages/lessons/a1-ik-heb-last-van.json";
import a1ErIsIetsKapotPackage from "./packages/lessons/a1-er-is-iets-kapot.json";
import a1IkBenBeschikbaarOpPackage from "./packages/lessons/a1-ik-ben-beschikbaar-op.json";
import a1WatMoetIkMeenemenPackage from "./packages/lessons/a1-wat-moet-ik-meenemen.json";
import a2WatStaatErInDezeBriefPackage from "./packages/lessons/a2-wat-staat-er-in-deze-brief.json";
import type { Lesson } from "../lessons/catalog";
import a0ZijnPresentPackage from "./packages/grammar/a0-zijn-present.json";
import a0HebbenPresentPackage from "./packages/grammar/a0-hebben-present.json";
import a0RegularPresentPackage from "./packages/grammar/a0-regular-present.json";
import a0YesNoInversionPackage from "./packages/grammar/a0-yes-no-inversion.json";
import contrastMainClauseInversionPackage from "./packages/contrast/contrast.main_clause_inversion.json";
import type { GrammarPattern } from "../grammar/content";
import type { ContrastPack } from "../grammar/contrast";

export const CONTENT_CATALOG_SCHEMA_VERSION = 1 as const;

export type ContentFamily = "lesson" | "verb-journey" | "grammar" | "contrast";
export type ContentReleaseStatus = "draft" | "released";
export type ContentReviewMetadata = {
  author: string;
  reviewer: string;
  reviewedAt: string;
  sources: string[];
  provenance: string;
};
export type ContentPackage<T> = {
  family: ContentFamily;
  id: string;
  schemaVersion: typeof CONTENT_CATALOG_SCHEMA_VERSION;
  contentVersion: number;
  releaseStatus: ContentReleaseStatus;
  review: ContentReviewMetadata;
  payload: T;
};
export type ContentManifestEntry = Pick<ContentPackage<unknown>, "family" | "id" | "schemaVersion" | "contentVersion" | "releaseStatus">;

export type ContentCatalog = {
  manifest(): readonly ContentManifestEntry[];
  getLesson(id: string): Lesson | null;
  getGrammarPattern(id: string): GrammarPattern | null;
  getContrastPack(id: string): ContrastPack | null;
};

const lessonPackages: readonly ContentPackage<Lesson>[] = [
  a0HalloIkBenPackage,
  a0IkHebDitNodigPackage,
  a0IkWoonEnWerkHierPackage,
  a0WoonJeHierPackage,
  a1KuntUDatHerhalenPackage,
  a1IkWilGraagBestellenPackage,
  a1KanIkMetPinBetalenPackage,
  a1WaarMoetIkOverstappenPackage,
  a1MijnTreinIsVertraagdPackage,
  a1EenAfspraakMakenPackage,
  a1IkHebLastVanPackage,
  a1ErIsIetsKapotPackage,
  a1IkBenBeschikbaarOpPackage,
  a1WatMoetIkMeenemenPackage,
  a2WatStaatErInDezeBriefPackage,
] as unknown as readonly ContentPackage<Lesson>[];
const grammarPackages: readonly ContentPackage<GrammarPattern>[] = [a0ZijnPresentPackage, a0HebbenPresentPackage, a0RegularPresentPackage, a0YesNoInversionPackage] as unknown as readonly ContentPackage<GrammarPattern>[];
const contrastPackages: readonly ContentPackage<ContrastPack>[] = [contrastMainClauseInversionPackage] as unknown as readonly ContentPackage<ContrastPack>[];
const allPackages: readonly ContentPackage<unknown>[] = [...lessonPackages, ...grammarPackages, ...contrastPackages];

export function validateContentPackage(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["package: expected object"];
  const stableId = /^[a-z0-9]+(?:[-._][a-z0-9_]+)*$/u;
  if (!Object.values<ContentFamily>(["lesson", "verb-journey", "grammar", "contrast"]).includes(value.family as ContentFamily)) errors.push("family: expected supported content family");
  if (typeof value.id !== "string" || !stableId.test(value.id)) errors.push("id: expected stable identifier");
  if (value.schemaVersion !== CONTENT_CATALOG_SCHEMA_VERSION) errors.push("schemaVersion: unsupported catalog schema");
  if (!Number.isInteger(value.contentVersion) || (value.contentVersion as number) < 1) errors.push("contentVersion: expected positive version");
  if (value.releaseStatus !== "released") errors.push("releaseStatus: expected released package");
  const review = value.review;
  if (!isRecord(review)) errors.push("review: expected review metadata");
  else if (typeof review.author !== "string" || typeof review.reviewer !== "string" || typeof review.reviewedAt !== "string" || !Array.isArray(review.sources) || typeof review.provenance !== "string" || !review.author.trim() || !review.reviewer.trim() || !/^\d{4}-\d{2}-\d{2}$/u.test(review.reviewedAt) || review.sources.length === 0 || !review.provenance.trim()) errors.push("review: incomplete release metadata");
  if (!isRecord(value.payload)) errors.push("payload: expected authored content");
  return errors;
}

function manifestEntry(contentPackage: ContentPackage<unknown>): ContentManifestEntry {
  return {
    family: contentPackage.family,
    id: contentPackage.id,
    schemaVersion: contentPackage.schemaVersion,
    contentVersion: contentPackage.contentVersion,
    releaseStatus: contentPackage.releaseStatus,
  };
}

const releasedLessonPackages = lessonPackages.filter((contentPackage) => validateContentPackage(contentPackage).length === 0);
const releasedGrammarPackages = grammarPackages.filter((contentPackage) => validateContentPackage(contentPackage).length === 0);
const releasedContrastPackages = contrastPackages.filter((contentPackage) => validateContentPackage(contentPackage).length === 0);
const manifest = allPackages.map(manifestEntry).sort((first, second) => `${first.family}:${first.id}`.localeCompare(`${second.family}:${second.id}`));

export const contentCatalog: ContentCatalog = {
  manifest: () => manifest,
  getLesson: (id) => releasedLessonPackages.find((contentPackage) => contentPackage.id === id)?.payload ?? null,
  getGrammarPattern: (id) => releasedGrammarPackages.find((contentPackage) => contentPackage.id === id)?.payload ?? null,
  getContrastPack: (id) => releasedContrastPackages.find((contentPackage) => contentPackage.id === id)?.payload ?? null,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
