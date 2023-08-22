import styles from "../../styles/Buttons.module.css";
import { ConnectWallet, useConnect, useDisconnect } from "@thirdweb-dev/react";

type Props = {
  isConnected: boolean;
};
export default function ConnectButton(props: Props) {
  const connectWallet = useConnect();
  const disconnect = useDisconnect();
  return (
    <ConnectWallet
      className={`${styles.primary} rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
    />
  );
}
