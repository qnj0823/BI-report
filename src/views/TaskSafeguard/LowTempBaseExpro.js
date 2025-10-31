import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

/**
 * 使用 exceljs 导出低温基数表格数据到 Excel
 * @param {Array} tableList - 数据列表
 * @param {String} fileName - 文件名
 */
export async function exportExcel(tableList, fileName) {
  // 初始化工作簿
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  // 定义列
  worksheet.columns = [
    { header: '战区', key: 'sqname', width: 15, hidden: false },
    { header: '单位体code', key: 'companycode', width: 20, hidden: false },
    { header: '单位体', key: 'companyname', width: 25, hidden: false },
    { header: '日期', key: 'yearmonthdate', width: 15, hidden: false },
    { header: '去年低温基数', key: 'goalvalue', width: 18, hidden: false },
  ];

  // 添加数据行
  tableList.forEach(item => { 
    worksheet.addRow([
      item.sqname || '',
      item.companycode || '',
      item.companyname || '',
      item.yearmonthdate || '',
      item.goalvalue || '',
    ]);
  });

  // 设置样式（表头、数据行等）
  styleHeaderRows(worksheet);
  styleDataRows(worksheet);

  // 导出文件
  const buffer = await workbook.xlsx.writeBuffer();
  
  // 确保文件名有正确的扩展名
  if (!fileName.endsWith('.xlsx')) {
    fileName += '.xlsx';
  }
  
  saveAs(new Blob([buffer]), fileName);
}

// 样式函数 - 表头样式
function styleHeaderRows(worksheet) {
  // 定义通用样式
  const headerStyle = {
    fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF0000' } 
    },
    font: {
      color: { argb: 'FFFFFFFF' }, // 白色文字
      bold: true,
      size: 11,
      name: 'Microsoft YaHei'
    },
    alignment: {
      horizontal: 'center',
      vertical: 'middle',
      wrapText: true
    },
    border: {
      top: { style: 'thin' },
      bottom: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' }
    }
  };

  // 应用样式到第1行（表头行）
  const row1 = worksheet.getRow(1);
  row1.height = 30; // 设置行高
  row1.eachCell(cell => {
    cell.style = headerStyle;
  });
}

// 设置表体样式从第2行开始
function styleDataRows(worksheet) {
  // 通用数据行样式
  const dataRowStyle = {
    font: {
      name: 'Microsoft YaHei',
      size: 10,
      bold: false // 数据行字体不加粗
    },
    alignment: {
      horizontal: 'center',
      vertical: 'middle',
      wrapText: true // 自动换行
    },
    border: {
      top: { style: 'thin', color: { argb: 'FF000000' } },
      bottom: { style: 'thin', color: { argb: 'FF000000' } },
      left: { style: 'thin', color: { argb: 'FF000000' } },
      right: { style: 'thin', color: { argb: 'FF000000' } }
    }
  };

  // 从第2行开始应用样式
  for (let i = 2; i <= worksheet.rowCount; i++) {
    const row = worksheet.getRow(i);
    row.eachCell(cell => {
      cell.style = dataRowStyle;
    });
    row.height = 25; // 设置行高
  }
}