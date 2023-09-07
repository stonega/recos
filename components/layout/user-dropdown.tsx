import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Beer, LogOut, BarChart4, SettingsIcon } from "lucide-react";
import Popover from "@/components/shared/popover";
import Image from "next/image";
import { motion } from "framer-motion";
import { FADE_IN_ANIMATION_SETTINGS } from "@/lib/constants";
import { ofetch } from "ofetch";

export default function UserDropdown() {
  const { data: session } = useSession();
  const { email, image, name } = session?.user || {};
  const [openPopover, setOpenPopover] = useState(false);
  const [credit, setCredit] = useState(0);
  useEffect(() => {
    const getToken = async () => {
      const { credit } = await ofetch("/api/credit");
      setCredit(credit);
    };
    getToken();
  });

  if (!email) return null;

  return (
    <motion.div
      className="relative inline-block text-left"
      {...FADE_IN_ANIMATION_SETTINGS}
    >
      <Popover
        content={
          <div className="w-full rounded-md bg-white dark:bg-[#101010] dark:text-white p-2 sm:w-40">
            {/* <Link
              className="flex items-center justify-start space-x-2 relative w-full rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100"
              href="/dashboard"
            >
              <LayoutDashboard className="h-4 w-4" />
              <p className="text-sm">Dashboard</p>
            </Link> */}
            <Link
              href="/price"
              className="relative flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Beer className="h-4 w-4" />
              <p className="text-sm">Get Credits</p>
            </Link>
            <Link
              href="/credit"
              className="relative flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <BarChart4 className="h-4 w-4" />
              <p className="text-sm">History</p>
            </Link>
            <Link
              href="/settings"
              className="relative flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <SettingsIcon className="h-4 w-4" />
              <p className="text-sm">Settings</p>
            </Link>
            <button
              className="relative flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => signOut({ redirect: false })}
            >
              <LogOut className="h-4 w-4" />
              <p className="text-sm">Logout</p>
            </button>
          </div>
        }
        align="center"
        openPopover={openPopover}
        setOpenPopover={setOpenPopover}
      >
        <div
          onClick={() => setOpenPopover(!openPopover)}
          className="flex h-12 cursor-pointer flex-row items-center justify-center overflow-hidden border-none transition-all duration-75 focus:border-none focus:outline-none active:scale-95"
        >
          <div className="hidden flex-col items-start space-y-1 md:flex">
            <span className="text-xl leading-none dark:text-white">
              {name || email}
            </span>
            <span className="text-sm leading-none dark:text-white">
              {" "}
              {credit + " credits"}
            </span>
          </div>
          <Image
            alt={email}
            src={image || `https://avatar.tobi.sh/${email}.png`}
            unoptimized
            width={35}
            height={35}
            className="ml-2 rounded-full"
          />
        </div>
      </Popover>
    </motion.div>
  );
}
