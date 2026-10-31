/**
 * Site navigation. Only routes that exist and work are listed; add an entry in the same change that
 * adds the page so the header and footer never point at a dead link.
 */
export type NavItem = { href: string; label: string };

export const primaryNav: readonly NavItem[] = [
  { href: "/explore", label: "Explore" },
  { href: "/compare", label: "Compare" },
  { href: "/labs", label: "Labs" },
  { href: "/myths", label: "Myths" },
  { href: "/quiz", label: "Quiz" },
  { href: "/glossary", label: "Glossary" },
  { href: "/resources", label: "Resources" },
  { href: "/about", label: "About" },
];

export const footerGroups: ReadonlyArray<{ heading: string; items: readonly NavItem[] }> = [
  {
    heading: "Learn",
    items: [
      { href: "/explore", label: "The five lessons" },
      { href: "/compare", label: "Compare the systems" },
      { href: "/labs", label: "Concept labs" },
      { href: "/myths", label: "Myths vs facts" },
      { href: "/quiz", label: "Knowledge check" },
      { href: "/glossary", label: "Glossary" },
      { href: "/present", label: "Launch the presentation" },
      { href: "/present/handout", label: "Presentation handout" },
    ],
  },
  {
    heading: "About",
    items: [
      { href: "/resources", label: "Sources and limits" },
      { href: "/about", label: "About and safety framing" },
    ],
  },
];
