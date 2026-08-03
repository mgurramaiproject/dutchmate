import lessonPackageJson from "./packages/lessons/a0-hallo-ik-ben.json";
import type { Lesson } from "../lessons/catalog";

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
};

const lessonPackages: readonly ContentPackage<Lesson>[] = [lessonPackageJson as unknown as ContentPackage<Lesson>];

export function validateContentPackage(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["package: expected object"];
  const stableId = /^[a-z0-9]+(?:[-.][a-z0-9]+)*$/u;
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
const manifest = lessonPackages.map(manifestEntry).sort((first, second) => `${first.family}:${first.id}`.localeCompare(`${second.family}:${second.id}`));

export const contentCatalog: ContentCatalog = {
  manifest: () => manifest,
  getLesson: (id) => releasedLessonPackages.find((contentPackage) => contentPackage.id === id)?.payload ?? null,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
