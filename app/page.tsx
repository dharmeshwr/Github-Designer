import { getCurrentUser } from "@/actions/user";
import { ClientOnly } from "@/components/client-only";
import Footer from "@/components/footer";
import Heatmap from "@/components/heatmap";
import { HeatmapControls } from "@/components/heatmap-controls";
import LogoutButton from "@/components/logout-button";
import { ModeToggle } from "@/components/mode-toggle";
import Precautions from "@/components/precaution";
import SignInButton from "@/components/signin-button";
import { Skeleton } from "@/components/ui/skeleton";
import { SparkEffect } from "@/components/ui/sparks";

export default async function Home() {
  const user = await getCurrentUser()

  return (
    <div className="min-h-svh relative flex flex-col font-sans">
      <SparkEffect />
      <div className="flex justify-between p-5">
        <SignInButton isConnected={!!user} />

        <div className="flex gap-2">
          <LogoutButton isConnected={!!user} />
          <ModeToggle />
          <HeatmapControls />
        </div>
      </div>


      <div className="flex-1 flex flex-col justify-center items-center">
        <Precautions />
        <ClientOnly fallback={<Skeleton />}>
          <Heatmap />
        </ClientOnly>
      </div>

      <Footer />
    </div>
  );
}
