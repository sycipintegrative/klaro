import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

export async function downloadElementPdf(element: HTMLElement, filename: string): Promise<void> {
  await document.fonts.ready
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#fbf7f0',
    logging: false,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  })
  const img = canvas.toDataURL('image/png')
  const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
  pdf.addImage(img, 'PNG', 0, 0, 210, 297)
  pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`)
}
