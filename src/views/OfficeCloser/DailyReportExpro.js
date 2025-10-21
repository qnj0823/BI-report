import  ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

/**
 * 使用 exceljs 导出 Excel（支持隐藏列）
 * @param {Array} tableList - 数据列表
 * @param {String} startDate - 开始日期
 * @param {String} endDate - 结束日期
 * @param {String} fileName - 文件名
 */
export async function exportExcel(tableList, startDate, endDate, fileName) {
  // 初始化工作簿
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  // 解析日期
  const selectedDate = new Date(startDate);
  const month = selectedDate.getMonth() + 1;
  const year = selectedDate.getFullYear();
  const day = String(selectedDate.getDate()).padStart(2, '0');

  const selectedEndDate = new Date(endDate);
  const monthEnd = selectedEndDate.getMonth() + 1;
  const yearEnd = selectedEndDate.getFullYear();
  const dayEnd = String(selectedEndDate.getDate()).padStart(2, '0');

  const labelText = `销售日订单跟进表`;

  const LableTitle = `低温系列${month}.${day}-${monthEnd}.${dayEnd}数据`

  // 定义列（支持隐藏）
  worksheet.columns = [
    { header: '日期', key: 'sort', width: 10, hidden: false },
    { header: '城市', key: 'sqname', width: 15, hidden: false },
    { header: '区域', key: 'companyname', width: 15, hidden: false },
    { header: '客户(站点)', key: 'companyman', width: 12, hidden: false },
    { header: `24年10月\n累积`, key: 'fixedbox', width: 12, hidden: true },
    { header: '10月报单累积', key: 'goalnumtotal', width: 12, hidden: false },
    { header: '同比完成率', key: 'goalrate', width: 12, hidden: true },
    { header: '今日同期', key: 'goalnum', width: 12, hidden: true },
    { header: '今日报单', key: 'todaybox', width: 12, hidden: false },
    { header: '今日同期差额', key: 'difference', width: 12, hidden: false },
    { header: '累积同期差额', key: 'leijibox', width: 12, hidden: false }
  ];

  // 添加标题行（合并单元格）
  worksheet.mergeCells('A1:N1');//合并单元格
  const titleRow = worksheet.getRow(1);
  titleRow.getCell(1).value = labelText;
  titleRow.height = 40; // 行高

  // 设置标题样式
  titleRow.getCell(1).style = {
    font: { bold: true, size: 14, name: 'Microsoft YaHei' },
    alignment: { horizontal: 'center', vertical: 'middle' },
  };

  // 添加表头和数据
  const headers = ['日期', '城市','区域', '客户(站点)', `24年10月\n累积`,`10月报单\n累积`,`同比\n完成率`,`今日\n同期`,`今日\n报单`,`今日同期\n差额`, `累积同期\n差额`];
 
  worksheet.addRow(headers);

  // 添加数据行
  tableList.forEach(item => {
    worksheet.addRow([
      item.vouchdate || '',
      item.areaname || '',
      item.provincename || '',
      item.cSiteName || '',
      item.fixedbox || '',
      item.goalnumtotal || '',
      item.goalrate || '',
      item.goalnum || '',
      item.todaybox || '',
      item.difference || '',
      item.leijibox || ''
    ]);
  });

//   // 链式设置多行行高
// worksheet.getRow(2).height = 30; // 第2行
// worksheet.getRow(3).height = 25; // 第3行

  // 合并相同内容的单元格（示例：合并第2行和第3行）
  worksheet.mergeCells('A2:A3');
  worksheet.mergeCells('B2:B3');
  worksheet.mergeCells('C2:C3');
  worksheet.mergeCells('D2:D3');
  // ...其他需要合并的列
  worksheet.mergeCells('E2:N2');

  // 动态查找 "合资/省平台总计" 行并合并前三列
  worksheet.eachRow((row, rowNum) => {
  if (row.getCell(2).value === "合资/省平台总计") {
    worksheet.mergeCells(rowNum, 1, rowNum, 4); // 合并A、B、C列
    const cell = row.getCell(1);
    cell.value = "合资/省平台总计"; // 防止合并后数据丢失
    cell.alignment = { horizontal: "center" };
  }
});

  // 设置样式（表头、数据行、小计行等）
  styleHeaderRows(worksheet);
  styleDataRows(worksheet)
  styleSubtotalRows(worksheet)

  // 隐藏指定列（例如隐藏第4列）
  // worksheet.getColumn(4).hidden = true;

  // 导出文件
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), fileName);
}

// 样式函数示例第二行第三行
function styleHeaderRows(worksheet) {
  // 定义通用样式（红色背景+白色文字）
  const headerStyle = {
    fill: { 
      type: 'pattern', 
      pattern: 'solid', 
      fgColor: { argb: 'FFC00000' } // 红色背景
    },
    font: { 
      color: { argb: 'FFFFFFFF' }, // 白色文字
      bold: true, 
      size: 12, 
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

  // 应用样式到第2行
  const row2 = worksheet.getRow(2);
  row2.height = 30;//设置行高
  row2.eachCell(cell => {
    cell.style = headerStyle;
  });

  // 应用样式到第3行
  const row3 = worksheet.getRow(3);
  row3.height = 35;//设置行高
  row3.eachCell(cell => {
    cell.style = headerStyle;
  });
}
//设置表体样式从第四行开始
function styleDataRows(worksheet) {
  // 通用数据行样式
  const dataRowStyle = {
    font: {
      name: 'Microsoft YaHei',
      size: 11,
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

  // 从第4行开始应用样式（假设前3行是表头）
  for (let i = 4; i <= worksheet.rowCount; i++) {
    const row = worksheet.getRow(i);
    row.eachCell(cell => {
      cell.style = dataRowStyle;
    });
    row.height = 27; // 设置行高
  }
}

function styleSubtotalRows(worksheet) {
  // 遍历所有行
  worksheet.eachRow((row, rowNumber) => {
    const cell = row.getCell(2);
    
    // 检查单元格是否有值且包含"合资/省平台总计"
    if (cell.value && typeof cell.value === 'string' && cell.value.includes('合资/省平台总计')) {
      row.eachCell(cell => {
        cell.style = {
          fill: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFC00000' } // 红色背景
          },
          font: {
            color: { argb: 'FFFFFFFF' }, // 白色字体
            bold: true,
            size: 12,
            name: 'Microsoft YaHei'
          },
          alignment: {
            horizontal: 'center',
            vertical: 'middle'
          },
          border: { 
            top: { style: 'thin' }, 
            bottom: { style: 'thin' }, 
            left: { style: 'thin' }, 
            right: { style: 'thin' } 
          }
        };
      });
    }
  });
}