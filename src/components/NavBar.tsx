import { useContext, useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import ConnectButton from "./Buttons/ConnectButton";
import { Role } from "../utils/types";
import { useConnectionStatus } from "@thirdweb-dev/react";
import { UserContext } from "../contexts/user_context";
import { useRouter } from "next/router";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Results", href: "/student/results" },
];
const adminNavigation = [
  { name: "Home", href: "/" },
  { name: "Students", href: "/students" },
  { name: "Department", href: "/departments" },
  { name: "Courses", href: "/courses" },
  { name: "Results", href: "/results" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const status = useConnectionStatus();
  const { user } = useContext(UserContext);

  const router = useRouter();

  useEffect(() => {
    if (status === "disconnected") {
      router.replace("/");
    }
  }, [status]);

  function renderNavs() {
    if (status === "connected" && user) {
      if (user.role === Role.Admin) {
        return adminNavigation.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="text-sm font-semibold leading-6 text-white-900"
          >
            {item.name}
          </a>
        ));
      }
      return navigation.map((item) => (
        <a
          key={item.name}
          href={item.href}
          className="text-sm font-semibold leading-6 text-white-900"
        >
          {item.name}
        </a>
      ));
    }
    return (
      <a
        key={"Home"}
        href={"/"}
        className="text-sm font-semibold leading-6 text-white-900"
      >
        Home
      </a>
    );
  }

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav
        className="flex items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <p>Logo</p>
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">{renderNavs()}</div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <ConnectButton isConnected={true} />
        </div>
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt=""
              />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">{renderNavs()}</div>
              <div className="py-6">
                <ConnectButton isConnected={true} />
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
