import { createNavigation } from "next-intl/navigation";

import { routing } from "./routing";

/**
 * Use these instead of next/link and next/navigation for links inside the
 * site. They keep the visitor's language: on a Spanish page, <Link href="/esl">
 * goes to /es/esl, and usePathname() returns "/esl" (without "/es").
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);