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
  addStudents,
  editStudents,
} from "@/web3/interactions/write-interactions";
import User from "@/models/user";
import { ethers } from "ethers";

type Props = {
  visible: boolean;
  onClose: () => void;
  student?: User;
};

export default function AddStudent(props: Props) {
  const [state, setState] = useState<{
    name: string;
    reg_no: string;
    dep_id: number;
    address: string;
  }>({
    reg_no: props.student ? props.student.reqNo : "",
    name: props.student ? props.student.name : "",
    dep_id: 0,
    address: "",
  });
  const [uiState, setUiState] = useState({
    loading: false,
  });
  const [dep, set_dep] = useState<{ name: string; id: number }[]>([]);

  const signer = useSigner();

  useEffect(() => {
    _getDeps();
  }, []);

  async function _getDeps() {
    try {
      const _deps = await getAllDepartments();
      set_dep(_deps.map((d) => ({ id: d._id, name: d.name })));
    } catch (error) {}
  }

  async function submit() {
    const id = toast.loading(
      `${props.student ? "Editting Student" : "Adding Student"}`
    );
    try {
      setUiState({ ...uiState, loading: true });
      if (!signer) {
        setUiState({ ...uiState, loading: false });
        return;
      }
      let trx: ethers.ContractTransaction;
      if (props.student) {
        trx = await editStudents(state.name, state.reg_no, signer);
      } else {
        trx = await addStudents(
          state.address,
          state.name,
          state.reg_no,
          state.dep_id,
          signer
        );
      }

      await trx.wait(1);
      setUiState({ ...uiState, loading: false });
      toast.dismiss(id);
      toast.success(`${props.student ? "Editted!" : "Added!"}`);
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
      title={`${props.student ? "Edit Department" : "Add Department"}`}
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
              value={props.student?.name}
              required
            />
            <Input
              label="Reg No"
              onChange={(v) => setState({ ...state, reg_no: v })}
              type="text"
              value={props.student?.reqNo}
              required
            />
            {!props.student && (
              <Input
                label="Wallet Address"
                onChange={(v) => setState({ ...state, address: v })}
                type="text"
                required
              />
            )}
            {!props.student && (
              <Select
                choices={[{ name: "Select Department", id: 0 }].concat([
                  ...dep,
                ])}
                onPress={(v) => {
                  setState({ ...state, dep_id: v });
                }}
                select="Department"
              />
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
