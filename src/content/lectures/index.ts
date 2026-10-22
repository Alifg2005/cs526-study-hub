import type { LectureContent } from "../../types/content";
import lecture01 from "./lecture-01";
import lecture02 from "./lecture-02";
import lecture03 from "./lecture-03";
import lecture04 from "./lecture-04";
import lecture05 from "./lecture-05";
import lecture06 from "./lecture-06";
import lecture07Part1 from "./lecture-07-part-1";
import lecture07Part2 from "./lecture-07-part-2";

/**
 * Content modules for available lectures, keyed by lecture id.
 * Register a new module here after adding its entry to ../registry.ts.
 */
export const lectureContentModules: LectureContent[] = [
  lecture01,
  lecture02,
  lecture03,
  lecture04,
  lecture05,
  lecture06,
  lecture07Part1,
  lecture07Part2,
];
