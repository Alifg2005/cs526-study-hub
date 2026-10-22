import type { LectureMeta } from "../types/content";

/**
 * Single source of truth for lecture metadata and availability.
 *
 * To add a lecture: append an entry here, then register its content module in
 * src/content/lectures/index.ts. Set status to "available" only after the
 * content passes `npm run validate-content`. See ADD_CHAPTER.md.
 */
export const lectureRegistry: LectureMeta[] = [
  {
    id: "lecture-01",
    slug: "01",
    number: "1",
    order: 1,
    title: "Mobile Application Trends",
    description:
      "Why mobile is its own paradigm: device strengths and limits, web apps versus native apps, the origins of Android and the Open Handset Alliance, and the parts of an Android project.",
    status: "available",
    inMidtermScope: true,
  },
  {
    id: "lecture-02",
    slug: "02",
    number: "2",
    order: 2,
    title: "Building User Interface",
    description:
      "Views, ViewGroups and XML layouts; connecting layouts to Java with R and findViewById; LinearLayout, RelativeLayout, TableLayout, FrameLayout and ConstraintLayout; the app bar and options menu.",
    status: "available",
    inMidtermScope: true,
  },
  {
    id: "lecture-03",
    slug: "03",
    number: "3",
    order: 3,
    title: "Android Architecture Stack",
    description:
      "What the Android SDK provides and the layers of the software stack: applications, the application framework and its managers, native libraries, the runtime, and the Linux kernel.",
    status: "available",
    inMidtermScope: true,
  },
  {
    id: "lecture-04",
    slug: "04",
    number: "4",
    order: 4,
    title: "Creating Applications and Activities",
    description:
      "Application building blocks, the manifest, externalized and alternative resources, process priority and termination, and the four steps for implementing an Activity.",
    status: "available",
    inMidtermScope: true,
  },
  {
    id: "lecture-05",
    slug: "05",
    number: "5",
    order: 5,
    title: "Intents",
    description:
      "Intents as Android's message-passing mechanism: explicit versus implicit intents, intent resolution and the app chooser, actions and data URIs, and passing data with extras and Bundles.",
    status: "available",
    inMidtermScope: true,
  },
  {
    id: "lecture-06",
    slug: "06",
    number: "6",
    order: 6,
    title: "Activity Lifecycle",
    description:
      "The activity stack, activity states, the seven lifecycle callbacks and when each runs, the entire, visible and foreground lifetimes, and manifest elements that launch an activity.",
    status: "available",
    inMidtermScope: true,
  },
  {
    id: "lecture-07-part-1",
    slug: "07-part-1",
    number: "7.1",
    order: 7,
    title: "Fragments",
    part: "Part 1",
    description:
      "Fragments as reusable, self-contained portions of an activity's UI: design philosophy, properties, creating a fragment, the fragment lifecycle, and adding fragments statically in XML.",
    status: "available",
    inMidtermScope: true,
  },
  {
    id: "lecture-07-part-2",
    slug: "07-part-2",
    number: "7.2",
    order: 8,
    title: "Fragments",
    part: "Part 2",
    description:
      "Dynamic fragments managed at run time: the FragmentManager, fragment transactions (add, replace, remove), commit, and the back stack.",
    status: "available",
    inMidtermScope: true,
  },
];
