import { lectureRegistry } from "../content/registry";
import { lectureContentModules } from "../content/lectures";
import type { Lecture, LectureContent, LectureMeta } from "../types/content";

/**
 * Joins registry metadata with content. A lecture only receives content when
 * the registry marks it "available", so a stray module can never make an
 * unfinished lecture appear complete.
 */
export function buildCatalog(
  registry: LectureMeta[],
  modules: LectureContent[],
): Lecture[] {
  const byId = new Map(modules.map((m) => [m.lectureId, m]));
  return [...registry]
    .sort((a, b) => a.order - b.order)
    .map((meta) => ({
      meta,
      content: meta.status === "available" ? (byId.get(meta.id) ?? null) : null,
    }));
}

export const lectures: Lecture[] = buildCatalog(lectureRegistry, lectureContentModules);

export function getLectureBySlug(slug: string | undefined): Lecture | undefined {
  return lectures.find((l) => l.meta.slug === slug);
}

export function isReady(lecture: Lecture): lecture is Lecture & { content: LectureContent } {
  return lecture.meta.status === "available" && lecture.content !== null;
}

export function lectureLabel(meta: LectureMeta): string {
  return meta.part ? `Lecture ${meta.number.split(".")[0]}, ${meta.part}` : `Lecture ${meta.number}`;
}

export function lectureFullTitle(meta: LectureMeta): string {
  return meta.part ? `${meta.title} (${meta.part})` : meta.title;
}
