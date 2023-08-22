import Image from "next/image";
import { Inter } from "next/font/google";
import Navbar from "@/components/NavBar";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

import styles from "../styles/Buttons.module.css";
import { useEffect, useState } from "react";
import { getAllCourses } from "@/web3/interactions/read-interactions";
import AddDepartment from "@/components/Forms/AddDepartmentForm";
import Course from "@/models/course";
import AddCourseForm from "@/components/Forms/AddCourseForm";

const inter = Inter({ subsets: ["latin"] });

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | undefined>();
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    getCourses();
  }, []);

  async function getCourses() {
    try {
      const _courses = await getAllCourses();

      setCourses([..._courses]);
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
        <AddCourseForm
          course={selectedCourse}
          onClose={() => setShowModal(false)}
          visible={showModal}
        />
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="flex w-full items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight text-white-900">
              Courses
            </h2>
            <div className="flex items-center ">
              <ArrowPathIcon
                onClick={getCourses}
                color="gray"
                className="h-6 w-6 mr-2"
              />
              <button
                onClick={() => setShowModal(true)}
                className={`${styles.primary} rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600`}
              >
                Add Course
              </button>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {courses.map((s, i) => {
              return (
                <div key={i} className="group relative">
                  <div className="mt-4 flex justify-between">
                    <div>
                      <p className="mt-1 text-sm text-white-500">
                        Name: {s.name}
                      </p>
                      <p className="mt-1 text-sm text-white-500">
                        Code: {s.code}
                      </p>
                      <p className="mt-1 text-sm text-white-500">
                        Unit: {s.unit}
                      </p>
                    </div>
                  </div>
                  <div className="my-4">
                    <button
                      onClick={() => {
                        setShowModal(true);
                        setSelectedCourse(s);
                      }}
                      className={`${styles.primary} rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600`}
                    >
                      Edit Course
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
