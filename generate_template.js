const XLSX = require('xlsx');
const path = require('path');

const data = [
  ['No', 'Nama Siswa', 'Jenjang', 'Kelas'],
  [1, 'Fulan bin Fulan', '1 SD', 'A'],
  [2, 'Fulanah binti Fulanah', '1 SD', 'A'],
  [3, '', '', ''],
  [4, '', '', ''],
  [5, '', '', ''],
];

const wb = XLSX.utils.book_new();
const ws = XLSX.utils.aoa_to_sheet(data);

// Set column widths
ws['!cols'] = [
  { wch: 5 },
  { wch: 30 },
  { wch: 15 },
  { wch: 10 },
];

XLSX.utils.book_append_sheet(wb, ws, 'Data Siswa');

const targetPath = path.join(__dirname, 'public', 'template_asesmen_inkata.xlsx');
XLSX.writeFile(wb, targetPath);

console.log('Template created at: ' + targetPath);
