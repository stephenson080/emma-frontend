import Image from "next/image";
import { Inter } from "next/font/google";
import Navbar from "@/components/NavBar";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

import styles from "../styles/Buttons.module.css";
import { useEffect, useState } from "react";
import { getAllDepartments } from "@/web3/interactions/read-interactions";
import { useSigner } from "@thirdweb-dev/react";
import Department from "@/models/department";
import AddDepartment from "@/components/Forms/AddDepartmentForm";

const inter = Inter({ subsets: ["latin"] });

export default function Departments() {
  const signer = useSigner();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDep, setSelectedDep] = useState<Department | undefined>();
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    getDepartments();
  }, []);

  async function getDepartments() {
    try {
      const _dep = await getAllDepartments();
      console.log(_dep);
      setDepartments([..._dep]);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      <Navbar />
      <main
        className={`relative isolate px-6 pt-14 lg:px-8 ${inter.className}`}
      >
        <AddDepartment
          department={selectedDep}
          onClose={() => setShowModal(false)}
          visible={showModal}
        />
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="flex w-full items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight text-white-900">
              Departments
            </h2>
            <div className="flex items-center ">
              <ArrowPathIcon
                onClick={getDepartments}
                color="gray"
                className="h-6 w-6 mr-2"
              />
              <button
                onClick={() => setShowModal(true)}
                className={`${styles.primary} rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600`}
              >
                Add Department
              </button>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {departments.map((s, i) => {
              return (
                <div key={i} className="group relative">
                  <div className="mt-4 flex justify-between">
                    <div>
                      <p className="mt-1 text-sm text-white-500">
                        Name: {s.name}
                      </p>
                      <p className="mt-1 text-sm text-white-500">
                        Code: {s.dep_code}
                      </p>
                    </div>
                  </div>
                  <div className="my-4">
                    <button
                      onClick={() => {
                        setShowModal(true);
                        setSelectedDep(s);
                      }}
                      className={`${styles.primary} rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600`}
                    >
                      Edit Department
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
