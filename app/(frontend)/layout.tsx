import { BackHome } from "@/components/ui/back-home";
import { BottomBar } from "@/components/ui/bottom-bar";
import { Footer } from "@/components/ui/footer";
import { NavBar } from "@/components/ui/navbar";
import { StillHaveQuestion } from "@/components/ui/still-have-question";

/**
 * Shared frame for every page: top bar, "← Home" button, page content,
 * "Still have a question?" box, footer, and the phone bottom bar (last, so it
 * sticks to the bottom of the screen without covering anything).
 *
 * Pages control their own width so Home can use full-width backgrounds:
 * wrap normal page content in `pageContainer` from lib/layout.ts.
 */
export default function FrontendLayout({ children }: LayoutProps<"/">) {
   return (
      <>
         <NavBar />
         <main id="main" className="flex w-full flex-1 flex-col text-brand-ink">
            <BackHome />
            {children}
            <StillHaveQuestion />
         </main>
         <Footer />
         <BottomBar />
      </>
   );
}
