import * as AlertDialog from "@radix-ui/react-alert-dialog";
import useAuthStore from "@/store/useAuthStore";

import { Button } from "@/components/ui/button";

export default function LogoutConfirm() {
  const logout = useAuthStore((state) => state.logout);

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button className="text-sm px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white">
          Logout
        </button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
        <AlertDialog.Content className="fixed z-50 top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] bg-zinc-900 text-white p-6 rounded-lg shadow-xl w-[90%] max-w-md">
          <AlertDialog.Title className="text-lg font-bold">Log Out?</AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-sm text-gray-400">
            You’ll need to log in again to access your account. Are you sure you want to log out?
          </AlertDialog.Description>
          <div className="mt-6 flex justify-end gap-3">
            <AlertDialog.Cancel asChild>
              <Button>
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={logout}
              >
                Confirm Logout
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
