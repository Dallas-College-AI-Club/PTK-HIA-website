import { Footer } from "@/components/ui/footer";
import { NavBar } from "@/components/ui/navbar";

export default function FrontendLayout({ children }: LayoutProps<"/">) {
   return (
      <>
         <NavBar />
         <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
            {children}
         </main>
         <Footer />
      </>
   );
}
