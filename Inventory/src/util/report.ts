import * as XLSX from 'xlsx';

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { sendEmailApi } from '../Api/user';

export const generateExcel = (sales) => {
  // Prepare the data for the Excel file
  const tableData = sales.map((sale, index) => ({
    '#': index + 1,
    Customer: sale.customerId?.name || sale.customer || 'N/A',
    Item: sale.itemId?.name || 'N/A',
    'Total Price': `$${sale.totalPrice || 0}`,
    Date: sale.saleDate
      ? new Date(sale.saleDate).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      : 'N/A',
  }));

  // Define the worksheet and workbook
  const worksheet = XLSX.utils.json_to_sheet(tableData);
  const workbook = XLSX.utils.book_new();

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales Report');

  // Generate and download the Excel file
  XLSX.writeFile(workbook, 'Sales_Report.xlsx');
};



export const generatePDF = (sales:any) => {
    const doc: any = new jsPDF();
    doc.text('Sales Report', 14, 20);

    const tableData = sales.map((sale, index) => [
      index + 1,
      sale.customerId?.name || sale.customer || 'N/A',
      sale.itemId?.name || 'N/A',
      `$${sale.totalPrice || 0}`,
      sale.saleDate ? new Date(sale.saleDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }) : 'N/A',
    ]);

    doc.autoTable({
      head: [['#', 'Customer', 'Item', 'Total Price', 'Date']],
      body: tableData,
      startY: 30,
    });

    doc.save('Sales_Report.pdf');
  };

 export const printReport = (sales:any) => {
    // Prepare the data as an HTML table
    const tableRows = sales
      .map((sale, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${sale.customerId?.name || sale.customer || 'N/A'}</td>
          <td>${sale.itemId?.name || 'N/A'}</td>
          <td>$${sale.totalPrice || 0}</td>
          <td>${
            sale.saleDate
              ? new Date(sale.saleDate).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })
              : 'N/A'
          }</td>
        </tr>
      `)
      .join('');
  
    // Create the HTML content
    const printContent = `
      <html>
        <head>
          <title>Sales Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              text-align: left;
              padding: 8px;
            }
            th {
              background-color: #f2f2f2;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
          </style>
        </head>
        <body>
          <h1>Sales Report</h1>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Item</th>
                <th>Total Price</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </body>
      </html>
    `;
  
    // Open a new window and print the content
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    } else {
      alert('Failed to open print window. Please check your browser settings.');
    }
  };

  export const sendEmail = async (data: { sales?: any; items?: any }) => {
    try {
      const res = await sendEmailApi(data);
      console.log('Email sent successfully:', res);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };
  