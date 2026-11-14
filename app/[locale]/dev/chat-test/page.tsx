import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ChatTest } from "@/components/dev/chat-test";
import { devToolsEnabled } from "@/lib/dev-tools";

export const metadata: Metadata = {
   title: "Chat test (dev) | PTK × AI Club",
   robots: { index: false, follow: false },
};

/**
 * Developer-only page for testing OpenRouter through /api/chat (issue #30):
 * custom system prompts, streaming, and model replies. It sits outside the
 * (frontend) group, so it has no student navbar or footer.
 * Shows a 404 on the live site unless ENABLE_DEV_TOOLS=true (lib/dev-tools.ts).
 */
export default function ChatTestPage() {
   if (!devToolsEnabled()) notFound();

   return <ChatTest />;
}