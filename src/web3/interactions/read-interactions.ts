import { BigNumber, ethers } from "ethers";
import ABI from "../ABI.json";
import { MUMBAI_RPC, _ADDRESS } from "../../utils/constants";
import User from "@/models/user";
import { Role } from "@/utils/types";
import Department from "@/models/department";
import Course from "@/models/course";
import Session from "@/models/session";
import Result from "@/models/Result";

function createContractReadInstance() {
  const instance = new ethers.Contract(
    _ADDRESS,
    ABI,
    new ethers.VoidSigner(
      "0x0b90bFa298f00d7762658DD183848740eD1EB713",
      ethers.getDefaultProvider(MUMBAI_RPC)
    )
  );

  return instance;
}

export async function getAllStudents(signer: ethers.Signer) {
  const instance = createContractReadInstance();
  let _students: User[] = [];
  const students: any[] = await instance.connect(signer)._adminGetAllStudents();
  _students = students.slice(1).map((s, i) => {
    const _s: User = {
      name: s.name,
      reqNo: s.reqNo,
      department: s.department,
      role: Role.Student,
    };
    return _s;
  });
  return _students;
}

export async function getAllDepartments() {
  const instance = createContractReadInstance();
  let _dep: Department[] = [];
  const departments: any[] = await instance.getAllDepartment();
  _dep = departments.slice(1).map((s, i) => {
    const _d: Department = {
      name: s.name,
      _id: i + 1,
      dep_code: s.dep_code,
    };
    return _d;
  });
  return _dep;
}

export async function getAllCourses() {
  const instance = createContractReadInstance();
  let _courses: Course[] = [];
  const courses: any[] = await instance.getAllCourse();
  _courses = courses.slice(1).map((s, i) => {
    const _c: Course = {
      name: s.name,
      _id: i + 1,
      code: s.code,
      unit: s.unit,
    };
    return _c;
  });
  return _courses;
}

export async function getAllSessions() {
  const instance = createContractReadInstance();
  let _sessions: Session[] = [];
  const sessions: any[] = await instance.getAllSessions();
  _sessions = sessions.slice(1).map((s, i) => {
    const _c: Session = {
      name: s.name,
      _id: i + 1,
    };
    return _c;
  });
  return _sessions;
}

export async function get_student_profile(address: string) {
  try {
    const instance = createContractReadInstance();
    const student = await instance.student_get_profile(address);
    return student;
  } catch (err) {
    return undefined;
  }
}

export async function getResultReport(
  address: string,
  semester: number,
  courses: number[],
  session: number,
  signer: ethers.Signer
) {
  try {
    const instance = createContractReadInstance();
    const report = await instance
      .connect(signer)
      ._admin_view_result_report(address, courses, semester, session);
    let results: Result[] = [];
    for (let r of report[0]) {
      if (r.created) {
        const _r: Result = {
          _id: 1,
          course: formBigNumber(r.course),
          grade: getGrade(formBigNumber(r.point)),
          score: formBigNumber(r.score),
          semester: formBigNumber(r.semester),
          session: formBigNumber(r.session),
        };
        results.push(_r);
      }
    }
    return {
      results,
      gp: formBigNumber(report[1]) / formBigNumber(report[2]),
    };
  } catch (err) {
    throw err;
  }
}

export async function getStudentResultReport(
  semester: number,
  courses: number[],
  session: number,
  signer: ethers.Signer
) {
  try {
    const instance = createContractReadInstance();
    const report = await instance
      .connect(signer)
      ._student_view_result_report(courses, semester, session);
    let results: Result[] = [];
    for (let r of report[0]) {
      if (r.created) {
        const _r: Result = {
          _id: 1,
          course: formBigNumber(r.course),
          grade: getGrade(formBigNumber(r.point)),
          score: formBigNumber(r.score),
          semester: formBigNumber(r.semester),
          session: formBigNumber(r.session),
        };
        results.push(_r);
      }
    }
    return {
      results,
      gp: formBigNumber(report[1]) / formBigNumber(report[2]),
    };
  } catch (err) {
    throw err;
  }
}

// export async function getInstitution(_address: string) {
//   const instance = createContractReadInstance();
//   return await instance.getInstitution(_address);
// }

// export async function getInstitutions() {
//   let insts: { name: string; id: number }[] = [];
//   const instance = createContractReadInstance();
//   const noOfInstitutions = await instance.institutionIds();
//   for (let i = 1; i < noOfInstitutions; i++) {
//     const inst = await instance.institutions(i);
//     if (inst.created) {
//       insts.push({ name: inst.name, id: i });
//     }
//   }
//   return insts;
// }

// export async function getCandidatesCredentials(
//   address: string,
//   noOfCert: ethers.BigNumber
// ) {
//   const convertNum = formBigNumber(noOfCert);
//   let credentialWithInstitution: Cred[] = [];
//   const instance = createContractReadInstance();
//   const _id = await instance.resolveId(address, 0);
//   const userId = formBigNumber(_id);
//   for (let i = 1; i <= convertNum; i++) {
//     const cred = await instance.candidates_credential(userId, i);
//     if (cred.created) {
//       const credentialNo = await instance.retrieveCredentialNo(i, cred.cid);
//       const credential = new Credential(
//         i,
//         cred.cid,
//         cred.issuer,
//         cred.owner,
//         cred.verified,
//         cred.created,
//         cred.issue_date,
//         cred.credentialType,
//         credentialNo
//       );
//       const inst = await instance.institutions(formBigNumber(cred.issuer));
//       credentialWithInstitution.push({ credential, inst });
//     }
//   }
//   console.log(credentialWithInstitution);
//   return credentialWithInstitution;
// }

// export async function getInstitutionCredentials(address: string) {
//   let credentialWithInstitution: Cred[] = [];
//   const instance = createBlocFiReadInstance();
//   const _id = await instance.resolveId(address, 1);
//   const noOfCred = await instance.institutionIds();
//   const institutionId = formBigNumber(_id);
//   for (let i = 1; i <= noOfCred; i++) {
//     const cred = await instance.institution_credential(institutionId, i);
//     if (cred.created) {
//       const credentialNo = await instance.retrieveCredentialNo(i, cred.cid);
//       const credential = new Credential(
//         i,
//         cred.cid,
//         cred.issuer,
//         cred.owner,
//         cred.verified,
//         cred.created,
//         cred.issue_date,
//         cred.credentialType,
//         credentialNo
//       );
//       const inst = await instance.institutions(formBigNumber(cred.issuer));
//       credentialWithInstitution.push({ credential, inst });
//     }
//   }
//   return credentialWithInstitution;
// }

// export async function checkoutCredential(credentialNo: string) {
//   const instance = createContractReadInstance();
//   const cred = await instance.viewCredential(credentialNo);
//   if (!cred[0].created) {
//     throw new Error("Not fouund");
//   }
//   const inst = await instance.institutions(formBigNumber(cred[0].issuer));
//   const owner = await instance.candidates(formBigNumber(cred[0].owner));
//   const credential: Cred = {
//     credential: new Credential(
//       1,
//       cred[0].cid,
//       cred[0].issuer,
//       cred[0].owner,
//       cred[0].verified,
//       cred[0].created,
//       cred[0].issue_date,
//       cred[0].credentialType,
//       credentialNo
//     ),
//     inst: new Institution(inst.name, inst.website, inst.created, inst.verified),
//   };
//   return {
//     status: true,
//     credential,
//     owner: new Candidate(
//       owner.name,
//       owner.profile_uri,
//       owner.created,
//       owner.is_verified,
//       owner.no_of_credentials
//     ),
//     hash: cred[1],
//   };
// }

export function formBigNumber(value: ethers.BigNumber) {
  return +ethers.utils.formatUnits(value, "wei");
}

export function getGrade(num: number) {
  switch (num) {
    case 1:
      return "E";
    case 2:
      return "D";
    case 3:
      return "C";
    case 4:
      return "B";
    case 5:
      return "A";
    default:
      return "F";
  }
}
