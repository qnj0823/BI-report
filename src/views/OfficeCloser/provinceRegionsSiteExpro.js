import  ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

/**
 * 使用 exceljs 导出 Excel（支持隐藏列）
 * @param {Array} tableList - 数据列表
 * @param {String} startDate - 开始日期
 * @param {String} endDate - 结束日期
 * @param {String} fileName - 文件名
 */
export async function exportExcel(tableList, startDate, endDate,month1,day1,monthend1,dayend1, fileName) {
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

  const labelText = `${year}年全国(各省区)低温销售数据进度表(${month}月${day}日—${monthEnd}月${dayEnd}日)`;

  const LableTitle = `低温系列${month}.${day}-${monthEnd}.${dayEnd}数据`

  // 定义列（支持隐藏）
  worksheet.columns = [
    { header: '增幅排名', key: 'sort', width: 10, hidden: false },
    { header: '省区', key: 'sqname', width: 15, hidden: false },
    // { header: '单位体', key: 'companyname', width: 15, hidden: false },
    { header: '负责人', key: 'companyman', width: 12, hidden: false },
    { header: `本月累计\n基数`, key: 'fixedbox', width: 12, hidden: false },
    { header: '今日\n报单', key: 'goalnumtotal', width: 12, hidden: false },
    { header: '累计\n报单', key: 'goalrate', width: 12, hidden: false },
    { header: '截止今日\n累计基数', key: 'goalnum', width: 12, hidden: false },
    { header: '累计缺口\n(正为缺口)', key: 'todaybox', width: 15, hidden: false },
    { header: '累计\n同比', key: 'difference', width: 12, hidden: false },
  ];

  // 添加标题行（合并单元格）
  worksheet.mergeCells('A1:I1');//合并单元格
  const titleRow = worksheet.getRow(1);
  titleRow.getCell(1).value = labelText;
  titleRow.height = 40; // 行高

  // 设置标题样式
  titleRow.getCell(1).style = {
    font: { bold: true, size: 14, name: 'Microsoft YaHei' },
    alignment: { horizontal: 'center', vertical: 'middle' },
  };

  // 添加表头和数据
  const headers = ['增幅排名', '省区', '负责人', `${LableTitle}`,`${LableTitle}`,
     `${LableTitle}`,`${LableTitle}`,`${LableTitle}`,`${LableTitle}`];
    const subHeaders = ['增幅排名', '省区','负责人', `${month1}.1-${month1}.${dayend1}\n报单基数`,'今日\n报单',`${month1}.${day1}-今日\n累计报单`,`${month1}.${day1}-今日\n报单基数`,`${month1}.${day1}-今日\n累计缺口`,`${month1}.${day1}-今日\n累计同比`];

  worksheet.addRow(headers);
  worksheet.addRow(subHeaders);

  // 添加数据行
  tableList.forEach(item => {
    worksheet.addRow([
      item.sort || '',
      item.sqname || '',
      // item.companyname || '',
      item.companyman || '',
      item.fixedbox || '',
      item.todaybox || '',
      item.leijibox || '',
      item.leijiboxhistory || '',
      item.cumulativeDiff || '',
      item.lasteyear || '',
    ]);
  });

//   // 链式设置多行行高
// worksheet.getRow(2).height = 30; // 第2行
// worksheet.getRow(3).height = 25; // 第3行

  // 合并相同内容的单元格（示例：合并第2行和第3行）
  worksheet.mergeCells('A2:A3');
  worksheet.mergeCells('B2:B3');
  worksheet.mergeCells('C2:C3');
  // ...其他需要合并的列
  worksheet.mergeCells('D2:I2');

  // 动态查找 "全国合计" 行并合并前三列
worksheet.eachRow((row, rowNum) => {
  if (row.getCell(2).value === "全国合计") {
    worksheet.mergeCells(rowNum, 1, rowNum, 3); // 合并A、B、C列
    const cell = row.getCell(1);
    cell.value = "全国合计"; // 防止合并后数据丢失
    cell.alignment = { horizontal: "center" };
  }
});

  // 设置样式（表头、数据行、小计行等）
  styleHeaderRows(worksheet);
  styleDataRows(worksheet)
  styleSubtotalRows(worksheet)
  styleColumnsJandP(worksheet)

  // 隐藏指定列（例如隐藏第4列）
  worksheet.getColumn(4).hidden = false;

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
      size: 10,
      bold: false // 数据行字体不加粗
    },
     numFmt: "0",
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
    row.height = 25; // 设置行高
  }
}

function styleSubtotalRows(worksheet) {
  // 遍历所有行
  worksheet.eachRow((row, rowNumber) => {
    const cell = row.getCell(2);
    
    // 检查单元格是否有值且包含"全国"
    if (cell.value && typeof cell.value === 'string' && cell.value.includes('全国合计')) {
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

function styleColumnsJandP(worksheet) {
  // 遍历所有行
  worksheet.eachRow((row, rowNumber) => {
    // 只处理第4行及以后的行
    if (rowNumber >= 4) {
      // 获取B列的单元格检查是否是小计或合计
      const bCell = row.getCell(2); // B列是第2列
      const bValue = bCell.value ? bCell.value.toString() : '';
      
      // 如果B列包含"小计"或"合计"，则跳过处理该行
      if (bValue.includes('小计') || bValue.includes('合计') || bValue.includes('总计')) {
        return; // 跳过当前行
      }

      // 获取J列和P列的单元格
      const jCell = row.getCell(5); // J列是第10列
      const ECell = row.getCell(8);
      
      // 深绿色样式
      const deepGreenStyle = {
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'eeece1' } // 深绿色
        },
        font: {
          bold: true,
          size: 11,
          name: 'Microsoft YaHei',
          // color: { argb: 'FFFFFF' } // 白色文字
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
        },
        numFmt: '@' // 文本格式
      };
      
      // 应用样式到J列
      jCell.style = deepGreenStyle;
      
      // 应用样式到P列
      // pCell.style = deepGreenStyle;
      ECell.style = deepGreenStyle;
    }
  });
}