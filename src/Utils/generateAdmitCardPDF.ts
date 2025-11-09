import jsPDF from "jspdf";

interface AdmitCardData {
  examRollNo: string;
  candidateName: string;
  fatherName: string;
  gender: string;
  dateOfBirth: string;
  examCenter: string;
  collegeName: string;
  universityName: string;
  jobPostName: string;
  vacancyName: string;
  otrasId: string;
}

export function generateAdmitCardPDF(data: AdmitCardData) {
  const doc = new jsPDF();

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Admit Card", 105, 20, { align: "center" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Government Recruitment Board", 105, 28, { align: "center" });

  // Horizontal line
  doc.line(20, 35, 190, 35);

  // Candidate Details
  let y = 50;
  const lineHeight = 8;

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Candidate Details", 20, y);
  y += 10;

  const details: Record<string, string> = {
    "Exam Roll No": data.examRollNo,
    "Candidate Name": data.candidateName,
    "Father's Name": data.fatherName,
    Gender: data.gender === "M" ? "Male" : "Female",
    "Date of Birth": data.dateOfBirth,
    "Exam Center": data.examCenter,
    "College Name": data.collegeName,
    "University Name": data.universityName,
    "Job Post": data.jobPostName,
    "Vacancy Department": data.vacancyName,
    "OTR ID": data.otrasId,
  };

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");

  for (const [key, value] of Object.entries(details)) {
    doc.text(`${key}:`, 25, y);
    doc.text(value, 85, y);
    y += lineHeight;
  }

  // Footer
  y += 10;
  doc.line(20, y, 190, y);
  y += 10;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(11);
  doc.text("Please bring this Admit Card along with a valid ID proof to the exam center.", 105, y, {
    align: "center",
  });

  // ✅ Save PDF file
  doc.save(`AdmitCard_${data.otrasId}.pdf`);
}
