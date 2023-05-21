import { useCallback, useEffect, useState } from "react";
import Link from 'next/link';
import { signOut, useSession } from "next-auth/react";
import { Beer, LogOut, BarChart4 } from "lucide-react";
import Popover from "@/components/shared/popover";
import Image from "next/image";
import { motion } from "framer-motion";
import { FADE_IN_ANIMATION_SETTINGS } from "@/lib/constants";
import { ofetch } from "ofetch";

interface UserDropdownProps {
  onGetCredits(): void;
}
export default function UserDropdown({ onGetCredits }: UserDropdownProps) {
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
  const getCredits = useCallback(async () => {
    setOpenPopover(false);
    onGetCredits();
  }, [onGetCredits]);

  if (!email) return null;

  return (
    <motion.div
      className="relative inline-block text-left"
      {...FADE_IN_ANIMATION_SETTINGS}
    >
      <Popover
        content={
          <div className="w-full rounded-md bg-white p-2 sm:w-40">
            {/* <Link
              className="flex items-center justify-start space-x-2 relative w-full rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100"
              href="/dashboard"
            >
              <LayoutDashboard className="h-4 w-4" />
              <p className="text-sm">Dashboard</p>
            </Link> */}
            <button
              className="relative flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100"
              onClick={() => getCredits()}
            >
              <Beer className="h-4 w-4" />
              <p className="text-sm">Get Credits</p>
            </button>
            <Link href="/credit" 
              className="relative flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100"
            >
              <BarChart4 className="h-4 w-4" />
              <p className="text-sm">Credits Usage</p>
            </Link>
            <button
              className="relative flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100"
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
          className="flex h-12 flex-row items-center justify-center overflow-hidden border-none transition-all duration-75 cursor-pointer focus:border-none focus:outline-none active:scale-95"
        >
          <div className="flex flex-col items-start space-y-1">
            <span className="text-xl leading-none dark:text-white">{name}</span>
            <span className="text-sm leading-none dark:text-white">
              {" "}
              {credit + " credits"}
            </span>
          </div>
          <Image
            alt={email}
            src={image || `https://avatars.dicebear.com/api/micah/${email}.svg`}
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
