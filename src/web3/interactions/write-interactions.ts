import { ethers } from "ethers";
import { _ADDRESS } from "../../utils/constants";
import ABI from "../ABI.json";

function createBlocFiWriteInstance(signer: ethers.Signer) {
  const instance = new ethers.Contract(_ADDRESS, ABI, signer);
  return instance;
}

export async function addStudents(
  address: string,
  name: string,
  regNo: string,
  dep_code: number,
  signer: ethers.Signer
) {
  try {
    const instance = createBlocFiWriteInstance(signer);
    const trx: ethers.ContractTransaction = await instance.add_student(
      address,
      name,
      regNo,
      dep_code
    );
    return trx;
  } catch (err) {
    throw err;
  }
}

export async function editStudents(
  name: string,
  regNo: string,
  signer: ethers.Signer
) {
  try {
    const instance = createBlocFiWriteInstance(signer);
    const trx: ethers.ContractTransaction = await instance.edit_student(
      name,
      regNo
    );
    return trx;
  } catch (err) {
    throw err;
  }
}

export async function addDepartment(
  name: string,
  code: string,
  signer: ethers.Signer
) {
  try {
    const instance = createBlocFiWriteInstance(signer);
    const trx: ethers.ContractTransaction = await instance.add_department(
      name,
      code
    );
    return trx;
  } catch (err) {
    throw err;
  }
}

export async function editDepartment(
  name: string,
  code: string,
  _id: number,
  signer: ethers.Signer
) {
  try {
    const instance = createBlocFiWriteInstance(signer);
    const trx: ethers.ContractTransaction = await instance.edit_department(
      _id,
      name,
      code
    );
    return trx;
  } catch (err) {
    throw err;
  }
}

export async function addCourse(
  name: string,
  code: string,
  unit: number,
  signer: ethers.Signer
) {
  try {
    const instance = createBlocFiWriteInstance(signer);
    const trx: ethers.ContractTransaction = await instance.add_course(
      name,
      code,
      unit
    );
    return trx;
  } catch (err) {
    throw err;
  }
}

export async function editCourse(
  name: string,
  code: string,
  _id: number,
  unit: number,
  signer: ethers.Signer
) {
  try {
    const instance = createBlocFiWriteInstance(signer);
    const trx: ethers.ContractTransaction = await instance.edit_course(
      _id,
      name,
      code,
      unit
    );
    return trx;
  } catch (err) {
    throw err;
  }
}

export async function addResult(
  address: string,
  score: number,
  course: number,
  semester: number,
  session: number,
  signer: ethers.Signer
) {
  try {
    const instance = createBlocFiWriteInstance(signer);
    const trx: ethers.ContractTransaction = await instance.add_result(
      address,
      course,
      semester,
      session,
      score
    );
    return trx;
  } catch (err) {
    throw err;
  }
}

export async function addInstitution(
  name: string,
  website: string,
  signer: ethers.Signer
) {
  try {
    const instance = createBlocFiWriteInstance(signer);
    const trx: ethers.ContractTransaction = await instance.addInstitution(
      name,
      website
    );
    return trx;
  } catch (err) {
    throw err;
  }
}

export async function addCredential(
  cid: string,
  timestamp: number,
  credential_no: string,
  issuer: number,
  type: number,
  signer: ethers.Signer
) {
  try {
    const instance = createBlocFiWriteInstance(signer);
    const trx: ethers.ContractTransaction = await instance.addCredential(
      credential_no,
      cid,
      timestamp,
      type,
      issuer
    );
    return trx;
  } catch (err) {
    throw err;
  }
}

export async function verifyCredential(
  credentialNo: string,
  signer: ethers.Signer
) {
  try {
    const instance = createBlocFiWriteInstance(signer);
    const trx: ethers.ContractTransaction = await instance.verifyCredential(
      credentialNo
    );
    return trx;
  } catch (error) {
    throw error;
  }
}
