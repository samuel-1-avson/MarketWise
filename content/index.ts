import type { ContentBundle } from "@/lib/content-validation";
import { comparison } from "./comparison";
import { glossary } from "./glossary";
import { labs } from "./labs";
import { myths } from "./myths";
import { quizzes } from "./quizzes";
import { slides } from "./slides";
import { sources } from "./sources";
import { lessons } from "./topics";

/** Everything the site renders from, assembled for validation and for tests. */
export const contentBundle: ContentBundle = {
  sources,
  lessons,
  glossary,
  quizzes,
  myths,
  slides,
  labs,
  comparison,
};

export { comparison, glossary, labs, lessons, myths, quizzes, slides, sources };
