 interface ILoginUserBody {
  email: string;
  password: string;
}
interface Syllabus {
  jobCategory: string;
  jobTitle: string;
    releasedDate: string;
  file: string;
}

 interface RegisterUserBody {
  fullName: string;
  fatherName: string;
  motherName: string;
  email: string;
  emailOtp: string;
  mobile: string;
  mobileOtp: string;
  gender: string;
  dateOfBirth: string;
  qualification: string;
  interest: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
}

 interface SendEmailOtpBody {
  email: string;
}

 interface VerifyEmailOtpBody {
  email: string;
  otp: string;
}

 interface SendMobileOtpBody {
  mobile: string;
}

 interface VerifyMobileOtpBody {
  mobile: string;
  otp: string;
}

interface UploadCutoffBody {
  [key: string]: any;
}

