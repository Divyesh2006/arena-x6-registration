/**
 * Excel File Generator for ARENA X6 Registrations
 * Creates beautifully formatted Excel reports using ExcelJS
 */

const ExcelJS = require('exceljs');

/**
 * Generate Excel report with all team registrations
 * @param {Array} teams - Array of team objects from database
 * @returns {Promise<Buffer>} - Excel file buffer
 */
async function generateExcelReport(teams) {
  // Create new workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Team Registrations');

  // Set worksheet properties
  worksheet.properties.defaultRowHeight = 20;

  // TITLE SECTION - Rows 1-5
  
  // Row 1: Main Title
  worksheet.mergeCells('A1:J1');
  const titleCell = worksheet.getCell('A1');
  titleCell.value = 'ARENA X6 - Team Registration Report';
  titleCell.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FFFFFF' } };
  titleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFD700' } // Gold background
  };
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getRow(1).height = 30;

  // Row 2: College Name
  worksheet.mergeCells('A2:J2');
  const collegeCell = worksheet.getCell('A2');
  collegeCell.value = 'Velalar College of Engineering and Technology, Thindal, Erode';
  collegeCell.font = { name: 'Arial', size: 12, bold: false };
  collegeCell.alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getRow(2).height = 22;

  // Row 3: Department and Event Date
  worksheet.mergeCells('A3:J3');
  const deptCell = worksheet.getCell('A3');
  deptCell.value = 'Department of CSE (AI & ML) | Event Date: 12/02/2026 | Non-Technical Event';
  deptCell.font = { name: 'Arial', size: 11 };
  deptCell.alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getRow(3).height = 20;

  // Row 4: Report Generated Timestamp
  worksheet.mergeCells('A4:J4');
  const timestampCell = worksheet.getCell('A4');
  const now = new Date();
  timestampCell.value = `Report Generated: ${now.toLocaleString('en-IN', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  })}`;
  timestampCell.font = { name: 'Arial', size: 10, italic: true, color: { argb: '666666' } };
  timestampCell.alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getRow(4).height = 18;

  // Row 5: Blank row for spacing
  worksheet.getRow(5).height = 10;

  // HEADER ROW - Row 6
  const headers = [
    'S.No',
    'Team Name',
    'Student 1 Name',
    'Student 1 Reg.No',
    'Student 2 Name',
    'Student 2 Reg.No',
    'Year',
    'Email',
    'Phone',
    'Registration Date'
  ];

  worksheet.getRow(6).values = headers;
  
  // Style header row
  worksheet.getRow(6).eachCell((cell) => {
    cell.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFFF' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4CAF50' } // Green background
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      top: { style: 'medium' },
      left: { style: 'medium' },
      bottom: { style: 'medium' },
      right: { style: 'medium' }
    };
  });
  worksheet.getRow(6).height = 25;

  // DATA ROWS - Starting from Row 7
  teams.forEach((team, index) => {
    const rowNum = 7 + index;
    const row = worksheet.getRow(rowNum);
    
    // Format registration date
    const regDate = new Date(team.created_at);
    const formattedDate = regDate.toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    row.values = [
      index + 1,
      team.team_name,
      team.student1_name,
      team.student1_regno,
      team.student2_name,
      team.student2_regno,
      team.year,
      team.email,
      team.phone,
      formattedDate
    ];

    // Style data rows with alternating colors
    row.eachCell((cell, colNumber) => {
      cell.font = { name: 'Arial', size: 10 };
      cell.alignment = { 
        vertical: 'middle', 
        horizontal: colNumber === 1 ? 'center' : 'left' // Center S.No, left align others
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      
      // Alternating row colors
      if (index % 2 === 0) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF' } // White
        };
      } else {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'F5F5F5' } // Light gray
        };
      }
    });
    
    row.height = 22;
  });

  // SUMMARY ROW - 2 rows after last data row
  const summaryRowNum = 7 + teams.length + 2;
  worksheet.mergeCells(`A${summaryRowNum}:I${summaryRowNum}`);
  const summaryCell = worksheet.getCell(`A${summaryRowNum}`);
  summaryCell.value = `Total Teams Registered: ${teams.length}`;
  summaryCell.font = { name: 'Arial', size: 12, bold: true, color: { argb: '000000' } };
  summaryCell.alignment = { vertical: 'middle', horizontal: 'right' };
  worksheet.getRow(summaryRowNum).height = 25;

  // Set column widths
  worksheet.getColumn(1).width = 8;   // S.No
  worksheet.getColumn(2).width = 25;  // Team Name
  worksheet.getColumn(3).width = 25;  // Student 1 Name
  worksheet.getColumn(4).width = 18;  // Student 1 Reg.No
  worksheet.getColumn(5).width = 25;  // Student 2 Name
  worksheet.getColumn(6).width = 18;  // Student 2 Reg.No
  worksheet.getColumn(7).width = 12;  // Year
  worksheet.getColumn(8).width = 30;  // Email
  worksheet.getColumn(9).width = 15;  // Phone
  worksheet.getColumn(10).width = 20; // Registration Date

  // Generate Excel file buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}

module.exports = { generateExcelReport };
