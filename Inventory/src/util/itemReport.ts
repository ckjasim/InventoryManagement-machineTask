import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { sendEmailApi } from '../Api/user';

export const generateExcel = (items) => {
  // Prepare the data for the Excel file
  const tableData = items.map((item, index) => ({
    '#': index + 1,
    'Item Name': item.name || 'N/A',
    'Description': item.description || 'N/A',
    'Category': item.category || 'N/A',
    'Stock': item.stock || 0,
    'Price': `$${item.price || 0}`,
  }));

  // Define the worksheet and workbook
  const worksheet = XLSX.utils.json_to_sheet(tableData);
  const workbook = XLSX.utils.book_new();

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory Report');

  // Generate and download the Excel file
  XLSX.writeFile(workbook, 'Inventory_Report.xlsx');
};

export const generateItemPDF = (items) => {
  const doc = new jsPDF();
  doc.text('Inventory Report', 14, 20);

  const tableData = items.map((item, index) => [
    index + 1,
    item.name || 'N/A',
    item.description || 'N/A',
    item.category || 'N/A',
    item.stock || 0,
    `$${item.price || 0}`,
  ]);

  doc.autoTable({
    head: [['#', 'Item Name', 'Description', 'Category', 'Stock', 'Price']],
    body: tableData,
    startY: 30,
  });

  doc.save('Inventory_Report.pdf');
};

export const printReport = (items) => {
  // Prepare the data as an HTML table
  const tableRows = items
    .map((item, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${item.name || 'N/A'}</td>
        <td>${item.description || 'N/A'}</td>
        <td>${item.category || 'N/A'}</td>
        <td>${item.stock || 0}</td>
        <td>$${item.price || 0}</td>
      </tr>
    `)
    .join('');

  // Create the HTML content
  const printContent = `
    <html>
      <head>
        <title>Inventory Report</title>
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
        <h1>Inventory Report</h1>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Item Name</th>
              <th>Description</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Price</th>
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