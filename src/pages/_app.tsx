import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";

import {
  ThirdwebProvider,
  localWallet,
  metamaskWallet,
} from "@thirdweb-dev/react";
import { Mumbai } from "@thirdweb-dev/chains";
import UserContextProvider from "../contexts/user_context";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      activeChain="mumbai"
      supportedWallets={[metamaskWallet(), localWallet()]}
      supportedChains={[Mumbai]}
    >
      <UserContextProvider>
        <main>
          <Component {...pageProps} />
          <ToastContainer />
        </main>
      </UserContextProvider>
    </ThirdwebProvider>
  );
}
