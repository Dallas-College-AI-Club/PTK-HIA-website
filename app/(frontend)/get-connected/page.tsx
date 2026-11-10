import { GetConnectedForm } from "@/components/ui/get-connected-form";
import { getMessages } from "@/lib/i18n";
import { pageContainer } from "@/lib/layout";

export default function GetConnected() {
   const t = getMessages().getConnected;

   return (
      <div className={pageContainer}>
         <h1 className="mt-6 text-3xl font-extrabold">{t.title}</h1>
         <p className="mt-2 mb-6 max-w-xl text-lg">{t.intro}</p>
         <GetConnectedForm />
      </div>
   );
}
