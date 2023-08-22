import Image from "next/image";
import { Inter } from "next/font/google";
import Navbar from "@/components/NavBar";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div>
      <Navbar />
      <main
        className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
      >
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-green-900 sm:text-6xl">
              The future of Result Management.
            </h1>
            <p className="mt-6 text-lg leading-8 text-white-600">
              Blockchain technology is the latest innovation in Result
              Management, and it offers a number of advantages over traditional
              methods.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
