import { jsPDF } from "jspdf"

export const generateCertificate = (studentName: string, score: number) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  })

  // Border
  doc.setDrawColor(29, 78, 216) // Inkata Blue
  doc.setLineWidth(5)
  doc.rect(5, 5, 287, 200)

  // Content
  doc.setFont("helvetica", "bold")
  doc.setFontSize(40)
  doc.setTextColor(30, 41, 59)
  doc.text("CERTIFICATE OF EXCELLENCE", 148, 60, { align: "center" })

  doc.setFontSize(16)
  doc.setTextColor(148, 163, 184)
  doc.text("DIBERIKAN KEPADA", 148, 85, { align: "center" })

  doc.setFontSize(50)
  doc.setTextColor(29, 78, 216)
  doc.text(studentName.toUpperCase(), 148, 115, { align: "center" })

  doc.setFontSize(14)
  doc.setTextColor(30, 41, 59)
  doc.text(`Atas Pencapaian Luar Biasa dalam Evaluasi Literasi Inkata.`, 148, 140, { align: "center" })
  doc.text(`Skor Komprehensif: ${score}%`, 148, 150, { align: "center" })

  doc.setFontSize(10)
  doc.setTextColor(203, 213, 225)
  doc.text("© 2026 INKATA EDUCATION TECHNOLOGIES", 148, 185, { align: "center" })

  doc.save(`Sertifikat_Inkata_${studentName.replace(/\s+/g, '_')}.pdf`)
}
