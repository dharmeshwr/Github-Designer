import { getCurrentUser } from "@/actions/user";
import { ClientOnly } from "@/components/client-only";
import Heatmap from "@/components/heatmap";
import LogoutButton from "@/components/logoutButton";
import { ModeToggle } from "@/components/mode-toggle";
import SignInButton from "@/components/signInButton";
import { Skeleton } from "@/components/ui/skeleton";

export default async function Home() {
  const user = await getCurrentUser()

  return (
    <div className="flex min-h-svh flex-col items-center justify-center relative">
      <div className="absolute top-5 right-5 flex gap-2">
        <LogoutButton />
        <ModeToggle />
      </div>

      <div className="absolute top-5 left-5">
        <SignInButton className={"mb-4"} isConnected={!!user} />
      </div>


      <ClientOnly fallback={<Skeleton />}>
        <Heatmap />
      </ClientOnly>
    </div>
  );
}
