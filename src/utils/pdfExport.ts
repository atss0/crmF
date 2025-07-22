import { toPng } from "html-to-image"
import jsPDF from "jspdf"

export const downloadInvoicePDF = async (elementId: string, fileName = "invoice.pdf") => {
  const element = document.getElementById(elementId)
  if (!element) {
    alert("PDF içeriği bulunamadı.")
    return
  }

  try {
    // Show loading state
    const loadingElement = document.createElement("div")
    loadingElement.innerHTML = `
      <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                  background: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); 
                  z-index: 10000; display: flex; align-items: center; gap: 10px;">
        <div style="width: 20px; height: 20px; border: 2px solid #e5e7eb; border-top: 2px solid #6366f1; 
                    border-radius: 50%; animation: spin 1s linear infinite;"></div>
        <span style="font-family: system-ui; color: #374151;">Generating PDF...</span>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `
    document.body.appendChild(loadingElement)

    // Wait a bit for the element to be fully rendered
    await new Promise((resolve) => setTimeout(resolve, 500))

    const dataUrl = await toPng(element, {
      cacheBust: true,
      pixelRatio: 2,
      width: 800,
      height: element.scrollHeight,
      style: {
        transform: "scale(1)",
        transformOrigin: "top left",
      },
    })

    const pdf = new jsPDF("p", "mm", "a4")
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = dataUrl

    img.onload = () => {
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (img.height * pdfWidth) / img.width

      // If content is too long, split into multiple pages
      if (pdfHeight > pdf.internal.pageSize.getHeight()) {
        const pageHeight = pdf.internal.pageSize.getHeight()
        let yPosition = 0

        while (yPosition < pdfHeight) {
          if (yPosition > 0) {
            pdf.addPage()
          }

          pdf.addImage(dataUrl, "PNG", 0, -yPosition, pdfWidth, pdfHeight)

          yPosition += pageHeight
        }
      } else {
        pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight)
      }

      pdf.save(fileName)

      // Remove loading state
      document.body.removeChild(loadingElement)
    }

    img.onerror = () => {
      document.body.removeChild(loadingElement)
      alert("PDF oluşturulurken hata oluştu.")
    }
  } catch (error) {
    console.error("PDF oluşturulurken hata oluştu:", error)
    alert("PDF oluşturulurken hata oluştu.")
  }
}

export const printInvoice = async (elementId: string) => {
  const element = document.getElementById(elementId)
  if (!element) {
    alert("Yazdırılacak içerik bulunamadı.")
    return
  }

  try {
    // Create a new window for printing
    const printWindow = window.open("", "_blank", "width=800,height=600")
    if (!printWindow) {
      alert("Pop-up engelleyici nedeniyle yazdırma penceresi açılamadı.")
      return
    }

    // Get the invoice content
    const invoiceContent = element.innerHTML

    // Create the print document
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              background: white;
              padding: 20px;
            }
            
            .invoice-container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              padding: 40px;
              border: 1px solid #e5e7eb;
            }
            
            .invoice-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 40px;
              padding-bottom: 20px;
              border-bottom: 2px solid #e5e7eb;
            }
            
            .invoice-title {
              font-size: 32px;
              font-weight: bold;
              color: #1f2937;
              margin-bottom: 8px;
            }
            
            .invoice-number {
              font-size: 16px;
              color: #6b7280;
            }
            
            .invoice-dates {
              text-align: right;
              font-size: 14px;
              color: #6b7280;
            }
            
            .invoice-parties {
              display: flex;
              justify-content: space-between;
              margin-bottom: 40px;
            }
            
            .bill-to, .invoice-status {
              flex: 1;
            }
            
            .bill-to h3 {
              font-size: 16px;
              font-weight: 600;
              color: #1f2937;
              margin-bottom: 12px;
            }
            
            .customer-info {
              color: #4b5563;
              font-size: 14px;
              line-height: 1.5;
            }
            
            .status-badge {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              padding: 8px 16px;
              border-radius: 20px;
              font-size: 14px;
              font-weight: 500;
              text-transform: capitalize;
            }
            
            .status-paid {
              background-color: #dcfce7;
              color: #166534;
              border: 1px solid #bbf7d0;
            }
            
            .status-pending {
              background-color: #dbeafe;
              color: #1e40af;
              border: 1px solid #bfdbfe;
            }
            
            .status-overdue {
              background-color: #fee2e2;
              color: #dc2626;
              border: 1px solid #fecaca;
            }
            
            .status-draft {
              background-color: #f3f4f6;
              color: #374151;
              border: 1px solid #d1d5db;
            }
            
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            
            .items-table th,
            .items-table td {
              padding: 12px;
              text-align: left;
              border-bottom: 1px solid #e5e7eb;
            }
            
            .items-table th {
              background-color: #f9fafb;
              font-weight: 600;
              color: #374151;
              font-size: 14px;
            }
            
            .items-table td {
              color: #4b5563;
              font-size: 14px;
            }
            
            .item-name {
              font-weight: 500;
              color: #1f2937;
            }
            
            .item-description {
              font-size: 12px;
              color: #6b7280;
              margin-top: 4px;
            }
            
            .text-right {
              text-align: right;
            }
            
            .invoice-totals {
              margin-left: auto;
              width: 300px;
              border-top: 2px solid #e5e7eb;
              padding-top: 20px;
            }
            
            .total-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              font-size: 14px;
            }
            
            .total-row.final {
              border-top: 1px solid #e5e7eb;
              margin-top: 12px;
              padding-top: 16px;
              font-size: 18px;
              font-weight: bold;
              color: #1f2937;
            }
            
            .invoice-notes {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
            }
            
            .notes-title {
              font-size: 16px;
              font-weight: 600;
              color: #1f2937;
              margin-bottom: 8px;
            }
            
            .notes-content {
              color: #4b5563;
              font-size: 14px;
              line-height: 1.6;
            }
            
            @media print {
              body {
                padding: 0;
              }
              
              .invoice-container {
                border: none;
                box-shadow: none;
                padding: 20px;
              }
            }
          </style>
        </head>
        <body>
          ${invoiceContent}
        </body>
      </html>
    `)

    printWindow.document.close()

    // Wait for content to load then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 500)
    }
  } catch (error) {
    console.error("Yazdırma hatası:", error)
    alert("Yazdırma sırasında hata oluştu.")
  }
}
