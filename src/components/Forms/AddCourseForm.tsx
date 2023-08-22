import { useEffect, useState } from "react";
import Modal from "../Overlays/Modal";
import Input from "./Input";
import { useSigner } from "@thirdweb-dev/react";
import { toast } from "react-toastify";

import { addCourse, editCourse } from "@/web3/interactions/write-interactions";
import { ethers } from "ethers";
import Course from "@/models/course";

type Props = {
  visible: boolean;
  onClose: () => void;
  course?: Course;
};

export default function AddCourseForm(props: Props) {
  const [state, setState] = useState<{
    name: string;
    code: string;
    unit: string;
  }>({
    code: props.course ? props.course.code : "",
    name: props.course ? props.course.name : "",
    unit: props.course ? props.course.unit.toString() : "",
  });
  const [uiState, setUiState] = useState({
    loading: false,
  });

  const signer = useSigner();

  async function submit() {
    const id = toast.loading(
      `${props.course ? "Editting Course" : "Adding Course"}`
    );
    try {
      setUiState({ ...uiState, loading: true });
      if (!signer) {
        setUiState({ ...uiState, loading: false });
        return;
      }
      let trx: ethers.ContractTransaction;
      if (props.course) {
        trx = await editCourse(
          state.name,
          state.code,
          props.course._id,
          +state.unit,
          signer
        );
      } else {
        trx = await addCourse(state.name, state.code, +state.unit, signer);
      }

      await trx.wait(1);
      setUiState({ ...uiState, loading: false });
      toast.dismiss(id);
      toast.success(`${props.course ? "Editted" : "Added"}`);
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
      title={`${props.course ? "Edit Course" : "Add Course"}`}
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
              label="Name"
              onChange={(v) => setState({ ...state, name: v })}
              type="text"
              value={props.course?.name}
              required
            />
            <Input
              label="Course Code"
              onChange={(v) => setState({ ...state, code: v })}
              type="text"
              value={props.course?.code}
              required
            />
            <Input
              label="Course Unit"
              onChange={(v) => setState({ ...state, unit: v })}
              type="number"
              value={props.course?.unit.toString()}
              required
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
