import dayjs from "dayjs";

const initialValues = {
  firstName: "",
  fatherName: "",
  cnic: "34202-2866666-1",
  dob: "",
  mailingAddress: "lalamusa",
  disability: "no",
  kindofdisability: "",
  mobile: "0331-6281670",
  email: "ali@gmail.com",
  gender: "male",
  maritalStatus: "single",
  otherMobile: "0331-6281670",
  whosMobile: "personal",
  qualification: "matriculation",
  startDate: new Date().toISOString().substr(0, 10),
  dateconfirmed: new Date().toISOString().substr(0, 10),

  empId: "",
  designation: "Graphic Designer",

  userName: "",
  password: "",
  role: "employee",

  probation: "no",
  probationMonths: "",

  BasicPayInProbationPeriod: 0,
  BasicPayAfterProbationPeriod: 0,
  AllowancesInProbationPeriod: 0,
  AllowancesAfterProbationPeriod: 0,

  bankAccount: "no",
  accountNo: "",

  // Onboarding Questionnaire
  policyBook: "no",
  appointment: "no",
  annualLeave: "no",
  attendence: "no",
  localServerAccount: "no",
  rules: "no",
  slack: "no",
  superAdmin: "no",
  whatsApp: "no",
  empCard: "no",

  // Documents
  employeeProImage: {},
  policeCertificateUpload: [],
  cnicScanCopy: [],
  degreesScanCopy: [],
};

const interneeInitialValues = {
  firstName: "",
  fatherName: "",
  cnic: "34202-2866666-1",
  dob: dayjs().format("YYYY-MM-DD"),
  mailingAddress: "lalamusa",
  mobile: "0331-6281670",
  email: "alisahi@gmail.com",
  gender: "male",
  maritalStatus: "single",
  otherMobile: "0331-6281670",
  whosMobile: "personal",
  qualification: "matriculation",

  rules: "no",
  slack: "no",

  internshipFrom: dayjs().format("YYYY-MM-DD"),
  internshipTo: "",
  internId: "",
  designation: "MERN",

  offered_By: "",

  // Documents
  interneeProImage: {},
  cnicFile: [],
  appointmentFile: [],
  experienceLetter: [],

  disability: "no",
  //Ye field formik me nhi hai
  disabilityType: "",
};
