"use client";

import { logout } from "@/actions/user";
import { Button } from "./ui/button";

export default function LogoutButton({ isConnected }: { isConnected: boolean }) {
  if (!isConnected) return

  return (
    <form action={logout}>
      <Button
        type="submit"
        variant={'ghost'}
      >
        Disconnect
      </Button>
    </form>
  );
}
