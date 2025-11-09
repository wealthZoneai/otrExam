

const endpoints = {

    login: 'api/auth/candidateLogin',
    register: 'api/auth/candidateSignup',
    sendEmailOtp: 'api/auth/send-email-otp',
    verifyEmailOtp: "api/auth/verify-email-otp",
    sendMobileOtp: "api/auth/send-mobile-otp",
    verifyMobileOtp: "api/auth/verify-mobile-otp",
    Syllabus: 'api/syllabus/upload',
    uploadPQP: 'api/pqp/pqpupload',
    uploadAnswer: 'api/answerkey/uploadbyAnswer',
    uploadResult: 'api/result/Resultupload',
    uploadCutoff: 'api/cutoff/upload',
    createJobpost: 'jobpost/create',
    getJobNotification: 'jobpost/search?jobCategory=',
    getAllSyllabus: "api/syllabus/GetAllSyllabus",
    getAllPQP: "api/pqp/getallPQPs",
    getAllAnswerKeys: "api/answerkey/getallAnswerKeys",
    getAllResults: "api/result/resultAll",
    getAllCutOffs: "api/cutoff/getAllCutOff",
    getCandidateOTRAS: "api/candidate/GetProfileByCandidateId?candidateId=",
    payment: "api/payment/create-checkout-session",
    paymentSucess: "api/payment/application/submit",
    DownloadAdminCard: "api/admit-card/get-by-otr?otrId=",
    getuserDataOtr: "api/admit-card/all-by-candidate?candidateId=",
    createExam: "examAssignment/conductExam?candidateName=",
    submitExam: "examAssignment/submitExam?examRollNo=",


}

export default endpoints