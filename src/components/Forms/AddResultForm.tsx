import { useEffect, useState } from "react";
import Modal from "../Overlays/Modal";
import Input from "./Input";
import { useSigner } from "@thirdweb-dev/react";
import { toast } from "react-toastify";

import {
  addCourse,
  addResult,
  editCourse,
} from "@/web3/interactions/write-interactions";
import { ethers } from "ethers";
import Course from "@/models/course";
import Select from "./Select";
import {
  getAllCourses,
  getAllSessions,
} from "@/web3/interactions/read-interactions";
import Session from "@/models/session";

type Props = {
  visible: boolean;
  onClose: () => void;
  sessions: Session[];
  courses: Course[];
};

export default function AddResultForm(props: Props) {
  const [state, setState] = useState<{
    _address: string;
    course: number;
    semester: number;
    score: number;
    session: number;
  }>({
    _address: "",
    course: 0,
    score: 0,
    semester: 0,
    session: 0,
  });
  const [uiState, setUiState] = useState({
    loading: false,
  });
  const signer = useSigner();

  async function submit() {
    const id = toast.loading(`Adding Result`);
    try {
      setUiState({ ...uiState, loading: true });
      if (!signer) {
        setUiState({ ...uiState, loading: false });
        return;
      }
      let trx: ethers.ContractTransaction = await addResult(
        state._address,
        state.score,
        state.course,
        state.semester,
        state.session,
        signer
      );

      await trx.wait(1);
      setUiState({ ...uiState, loading: false });
      toast.dismiss(id);
      toast.success(`Result Added`);
      return;
    } catch (error: any) {
      setUiState({ ...uiState, loading: false });
      toast.dismiss(id);
      toast.error("failed");
    }
  }

  return (
    <Modal
      visible={props.visible}
      onClose={props.onClose}
      title={`Add Result`}
      desc="fill the form below"
      closeTitle="Cancel"
      onsumbit={submit}
      submitTitle="Submit"
      loading={uiState.loading}
    >
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-4 lg:px-8">
        <div className="space-y-1">
          <div>
            <Input
              label="Student Wallet Address"
              onChange={(v) => setState({ ...state, _address: v })}
              type="text"
              required
            />
            <Input
              label="Score"
              onChange={(v) => setState({ ...state, score: +v })}
              type="number"
              required
            />
            <Select
              choices={[{ name: "Select Course", id: 0 }].concat([
                ...props.courses.map((c) => ({ name: c.name, id: c._id })),
              ])}
              onPress={(v) => {
                setState({ ...state, course: v });
              }}
              select="Course"
            />
            <Select
              choices={[{ name: "Select Session", id: 0 }].concat([
                ...props.sessions.map((c) => ({ name: c.name, id: c._id })),
              ])}
              onPress={(v) => {
                setState({ ...state, session: v });
              }}
              select="Session"
            />
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
        </div>
      </div>
    </Modal>
  );
}
