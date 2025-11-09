import endpoints from "./endpoints";
import server from "./index";


export function loginUser({ email, password }: ILoginUserBody) {
  const body = { email, password };
  return server.post(endpoints.login, body, { requiresAuth: false });
}


// syllabus
export function uploadSyllabus({
  jobCategory,
  jobTitle,
  qualifications,
  file,
}: {
  jobCategory: string;
  jobTitle: string;
  qualifications: string;
  file: File;
}) {
  const formData = new FormData();
  formData.append("jobCategory", jobCategory);
  formData.append("jobTitle", jobTitle);
  formData.append("qualifications", qualifications);
  formData.append("file", file);

  return server.post(endpoints.Syllabus, formData, {
    requiresAuth: false,
  });

}

// PQP

export function uploadPQP({
  jobCategory,
  jobTitle,
  languages,
  qualifications,
  pqp,
  file,
}: {
  jobCategory: string;
  jobTitle: string;
  languages: string;
  qualifications: string;
  pqp: string;
  file: File;
}) {
  const formData = new FormData();
  formData.append("jobCategory", jobCategory);
  formData.append("jobTitle", jobTitle);
  formData.append("languages", languages);
  formData.append("qualifications", qualifications);
  formData.append("pqp", pqp);
  formData.append("file", file);

  return server.post(endpoints.uploadPQP, formData, { requiresAuth: false });
}


// Answers 

export function uploadAnswer({
  jobCategory,
  jobTitle,
  description,
  qualifications,
  websiteUrl,
  file,
}: {
  jobCategory: string;
  jobTitle: string;
  description: string;
  qualifications: string;
  websiteUrl: string;
  file: File;
}) {
  const formData = new FormData();
  formData.append("jobCategory", jobCategory);
  formData.append("jobTitle", jobTitle);
  formData.append("description", description);
  formData.append("qualifications", qualifications);
  formData.append("websiteUrl", websiteUrl);
  formData.append("file", file);

  return server.post(endpoints.uploadAnswer, formData, {
    requiresAuth: false,
  });
}

// Results

export function uploadResult({
  jobCategory,
  jobTitle,
  releasedDate,
  websiteUrl,
  file,
}: {
  jobCategory: string;
  jobTitle: string;
  releasedDate: string;
  websiteUrl: string;
  file: File;
}) {
  const formData = new FormData();
  formData.append("jobCategory", jobCategory);
  formData.append("jobTitle", jobTitle);
  formData.append("releasedDate", releasedDate);
  formData.append("websiteUrl", websiteUrl);
  formData.append("file", file);

  return server.post(endpoints.uploadResult, formData, {

    requiresAuth: false,
  });
}


// cutOff

export function uploadCutoff({
  jobCategory,
  jobTitle,
  releasedDate,
  file,
}: UploadCutoffBody) {
  const formData = new FormData();
  formData.append("jobCategory", jobCategory);
  formData.append("jobTitle", jobTitle);
  formData.append("releasedDate", releasedDate);
  formData.append("file", file);

  return server.post(endpoints.uploadCutoff, formData, { requiresAuth: false });
}

// 

export async function CreateJobpost(formData: FormData) {
  try {
    const response = await server.post(endpoints.createJobpost, formData, {
      requiresAuth: false,
    });

    return response.data;
  } catch (error: any) {
    console.error("❌ CreateJobpost error:", error.response?.data || error);
    throw error;
  }
}



export function registerUser({
  fullName,
  fatherName,
  motherName,
  email,
  emailOtp,
  mobile,
  mobileOtp,
  gender,
  dateOfBirth,
  qualification,
  interest,
  password,
  confirmPassword,
  termsAccepted,
}: RegisterUserBody) {
  const body = {
    fullName,
    fatherName,
    motherName,
    email,
    emailOtp,
    mobile,
    mobileOtp,
    gender,
    dateOfBirth,
    qualification,
    interest,
    password,
    confirmPassword,
    termsAccepted,
  };

  return server.post(endpoints.register, body, { requiresAuth: false });
}

// ✅ SEND EMAIL OTP
export function sendEmailOtpApi({ email }: SendEmailOtpBody) {
  const body = { email };
  return server.post(endpoints.sendEmailOtp, body, { requiresAuth: false });
}

// ✅ VERIFY EMAIL OTP
export function verifyEmailOtpApi({ email, otp }: VerifyEmailOtpBody) {
  const body = { email, otp };
  return server.post(endpoints.verifyEmailOtp, body, { requiresAuth: false });
}

// ✅ SEND MOBILE OTP
export function sendMobileOtpApi({ mobile }: SendMobileOtpBody) {
  const body = { mobile };
  return server.post(endpoints.sendMobileOtp, body, { requiresAuth: false });
}

// ✅ VERIFY MOBILE OTP
export function verifyMobileOtpApi({ mobile, otp }: VerifyMobileOtpBody) {
  const body = { mobile, otp };
  return server.post(endpoints.verifyMobileOtp, body, { requiresAuth: false })
}


// 

export function GetJobNotification(quary: any) {
  return server.get(endpoints.getJobNotification + quary, { requiresAuth: false });
}


//  For Syllabus
export function GetAllSyllabus() {
  return server.get(endpoints.getAllSyllabus, { requiresAuth: false });
}

//  For PQP
export function GetAllPQP() {
  return server.get(endpoints.getAllPQP, { requiresAuth: false });
}

//  For Answer Key
export function GetAllAnswerKeys() {
  return server.get(endpoints.getAllAnswerKeys, { requiresAuth: false });
}

//  For Results
export function GetAllResults() {
  return server.get(endpoints.getAllResults, { requiresAuth: false });
}

// For Cut-Off
export function GetAllCutOffs() {
  return server.get(endpoints.getAllCutOffs, { requiresAuth: false });
}


export function GetgetCandidateOTRAS({ candidateId }: any) {
  return server.get(endpoints.getCandidateOTRAS + candidateId, { requiresAuth: false });
}

// 
export function createCheckoutSession({
  amount,
  productName,
  successUrl,
  cancelUrl,
}: {
  amount: number;
  productName: string;
  successUrl: string;
  cancelUrl: string;
}) {
  // 👇 Send pure JSON, not FormData
  const payload = {
    amount,
    productName,
    successUrl,
    cancelUrl,
  };

  return server.post(endpoints.payment, payload, {
    requiresAuth: false,
  });
}


export interface PaymentSuccessPayload {
  otrId: string;
  jobPostId: number;
  vacancyId: number;
  selectedCenters: string[];
  livePhoto: File;
  signature: File;
}

export function paymentSuccess(payload: {
  otrId: string;
  jobPostId: number;
  vacancyId: number;
  selectedCenters: string | string[];
  livePhoto: File;
  signature: File;
}) {
  const formData = new FormData();

  formData.append("otrId", payload.otrId);
  formData.append("jobPostId", String(payload.jobPostId));
  formData.append("vacancyId", String(payload.vacancyId));

  // backend expects 'centers' as JSON string
  formData.append("centers", JSON.stringify(payload.selectedCenters));
  formData.append("livePhoto", payload.livePhoto);
  formData.append("signature", payload.signature);

  return server.post("/api/payment/application/submit", formData, {
  });
}

export function DownloadAdminCard(otr:any) {
  return server.get(endpoints.DownloadAdminCard+otr, { requiresAuth: false });
}
export function GetuserDataOtr( otr:any) {
  return server.get(endpoints.getuserDataOtr+otr, { requiresAuth: false });
}

// ✅ Conduct exam (verify student and fetch paper)
export function CreateExam(candidateName: string, examRollNo: string) {
  const fullUrl = `examAssignment/conductExam?candidateName=${candidateName}&examRollNo=${examRollNo}`;
  return server.post(fullUrl, {}, { requiresAuth: false });
}
interface SubmitExamBody {
  examRollNo: string;
  answers: Record<string, string>;
}

// ✅ Submit exam answers
export function SubmitExam({ examRollNo, answers }: SubmitExamBody) {
  return server.post(`/examAssignment/submitExam?examRollNo=${examRollNo}`, answers, {
    requiresAuth: false,
  });
}




