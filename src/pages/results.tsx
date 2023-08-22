import { Inter } from "next/font/google";
import Navbar from "@/components/NavBar";

import styles from "../styles/Buttons.module.css";
import { useEffect, useState } from "react";
import {
  getAllCourses,
  getAllSessions,
  getResultReport,
} from "@/web3/interactions/read-interactions";
import Course from "@/models/course";
import AddResultForm from "@/components/Forms/AddResultForm";
import Session from "@/models/session";
import Input from "@/components/Forms/Input";
import Select from "@/components/Forms/Select";
import { toast } from "react-toastify";
import { useSigner } from "@thirdweb-dev/react";
import Result from "@/models/Result";

const inter = Inter({ subsets: ["latin"] });

export default function ViewResult() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [state, setState] = useState<{
    _address: string;
    courses: number[];
    semester: number;
    session: number;
  }>({
    _address: "",
    courses: [],
    semester: 0,
    session: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [_report, setReport] = useState<
    { results: Result[]; gp: number } | undefined
  >();

  const [uiState, setUiState] = useState({
    loading: false,
  });
  const signer = useSigner();

  useEffect(() => {
    getDetails();
  }, []);

  async function getDetails() {
    try {
      const _courses = await getAllCourses();
      const _sessions = await getAllSessions();

      setCourses([..._courses]);
      setSessions([..._sessions]);
    } catch (error) {
      console.log(error);
    }
  }

  async function getReport() {
    const id = toast.loading(`Getting Report...`);
    try {
      setUiState({ ...uiState, loading: true });
      if (!signer) {
        setUiState({ ...uiState, loading: false });
        return;
      }
      console.log(state);
      let report = await getResultReport(
        state._address,
        state.semester,
        state.courses,
        state.session,
        signer
      );

      if (report && report.results.length > 0) {
        setReport(report);
        setUiState({ ...uiState, loading: false });
        toast.dismiss(id);
        toast.success(`Report Retrieve`);
        return;
      }

      throw new Error("Falied");
    } catch (error: any) {
      console.log(error);
      setReport(undefined);
      setUiState({ ...uiState, loading: false });
      toast.dismiss(id);
      toast.error("failed");
    }
  }
  return (
    <div>
      <Navbar />
      <main
        className={`relative isolate px-6 pt-14 lg:px-8 ${inter.className}`}
      >
        <AddResultForm
          sessions={sessions}
          courses={courses}
          onClose={() => setShowModal(false)}
          visible={showModal}
        />
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="flex w-full items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight text-white-900">
              View Result
            </h2>
            <div className="flex items-center ">
              <button
                onClick={() => setShowModal(true)}
                className={`${styles.primary} rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600`}
              >
                Add Result
              </button>
            </div>
          </div>
          <div className="my-10" style={{ width: "100%", maxWidth: 500 }}>
            <div className=" w-full block">
              <div className="w-9/12">
                <Input
                  label="Student Address"
                  onChange={(v) => {
                    setState({ ...state, _address: v });
                  }}
                  type="text"
                  required
                  color="text-white-700"
                />
              </div>
              <div className="w-9/12">
                <Select
                  choices={[{ name: "Select Course", id: 0 }].concat([
                    ...courses.map((c) => ({ name: c.name, id: c._id })),
                  ])}
                  onPress={(v) => {
                    setState({ ...state, courses: state.courses.concat(v) });
                  }}
                  select="Course"
                />
              </div>
              <h4 className="text-white-600 my-2">Selected Courses</h4>
              <div className="flex items-center">
                {state.courses.map((c, i) => {
                  const course = courses.find((_c) => _c._id == c)!;
                  return (
                    <p key={i} className="text-sm text-white-300 mx-2">
                      {course.name}
                    </p>
                  );
                })}
              </div>
              <div className="w-9/12">
                <Select
                  choices={[{ name: "Select Session", id: 0 }].concat([
                    ...sessions.map((c) => ({ name: c.name, id: c._id })),
                  ])}
                  onPress={(v) => {
                    setState({ ...state, session: v });
                  }}
                  select="Session"
                />
              </div>
              <div className="w-9/12">
                <Select
                  choices={[
                    { name: "HARMATTAN", id: 0 },
                    { name: "RAIN", id: 1 },
                  ]}
                  onPress={(v) => {
                    setState({ ...state, semester: v });
                  }}
                  select="Semester"
                />
              </div>

              <div className="my-5">
                <button
                  onClick={getReport}
                  className={`${styles.primary} rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600`}
                >
                  Check
                </button>
              </div>
            </div>
          </div>
          {_report && (
            <div className="my-10" style={{ width: "100%", maxWidth: 600 }}>
              <h1 className="text-white-600 my-2">Result</h1>
              <div className=" w-full block">
                <div className="mt-2 grid grid-cols-1 gap-x-2 gap-y-4 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                  <p>Course</p>
                  <p>Unit</p>
                  <p>Score</p>
                  <p>Grade</p>
                </div>
                {_report.results.map((r, i) => {
                  const course = courses.find((c) => c._id == r.course)!;
                  return (
                    <div
                      key={i}
                      className="mt-2 grid grid-cols-1 gap-x-2 gap-y-4 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8"
                    >
                      <p>{course.name}</p>
                      <p>{course.unit}</p>
                      <p>{r.score}</p>
                      <p>{r.grade}</p>
                    </div>
                  );
                })}
              </div>
              <h1 className="text-white-600 my-4">
                Grade point: {_report.gp.toFixed(2)}
              </h1>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
