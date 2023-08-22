import { useEffect, useState } from "react";
import Modal from "../Overlays/Modal";
import Input from "./Input";
// import {
//   addCredential,
//   addInstitution,
// } from "../../web3/interactions/write-interactions";
import { useSigner } from "@thirdweb-dev/react";
import { toast } from "react-toastify";

import { getAllDepartments } from "../../web3/interactions/read-interactions";

import Select from "./Select";
import {
  addDepartment,
  addStudents,
  editDepartment,
  editStudents,
} from "@/web3/interactions/write-interactions";
import { ethers } from "ethers";
import Department from "@/models/department";

type Props = {
  visible: boolean;
  onClose: () => void;
  department?: Department;
};

export default function AddDepartment(props: Props) {
  const [state, setState] = useState<{
    name: string;
    code: string;
  }>({
    code: props.department ? props.department.dep_code : "",
    name: props.department ? props.department.name : "",
  });
  const [uiState, setUiState] = useState({
    loading: false,
  });
  const [dep, set_dep] = useState<{ name: string; id: number }[]>([]);

  const signer = useSigner();

  async function submit() {
    const id = toast.loading(
      `${props.department ? "Editting Department" : "Adding Department"}`
    );
    try {
      setUiState({ ...uiState, loading: true });
      if (!signer) {
        setUiState({ ...uiState, loading: false });
        return;
      }
      let trx: ethers.ContractTransaction;
      if (props.department) {
        trx = await editDepartment(
          state.name,
          state.code,
          props.department._id,
          signer
        );
      } else {
        trx = await addDepartment(state.name, state.code, signer);
      }

      await trx.wait(1);
      setUiState({ ...uiState, loading: false });
      toast.dismiss(id);
      toast.success(`${props.department ? "Editted" : "Added"}`);
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
      title={`${props.department ? "Edit Department" : "Add Department"}`}
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
              value={props.department?.name}
              required
            />
            <Input
              label="Department Code"
              onChange={(v) => setState({ ...state, code: v })}
              type="text"
              value={props.department?.dep_code}
              required
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
