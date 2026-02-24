import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

/**
 * 使用 exceljs 导出 Excel（支持隐藏列）
 * @param {Array} tableList - 数据列表
 * @param {String} startDate - 开始日期
 * @param {String} endDate - 结束日期
 * @param {String} fileName - 文件名
 */
export async function exportExcel(tableList, fileName) {
  // 初始化工作簿
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  const labelText = 'LOOK每日报单计划(盒/瓶)'
  const hnFruit = ['海南果汁饮料']
  const hnNormal = ['海南常温']
  const hnCoconut = ['海南椰子汁']

  // 定义列（支持隐藏）
  worksheet.columns = [
    { header: '省区', key: 'areaname', width: 15, hidden: false },
    { header: '销售计划', key: 'piece', width: 15, hidden: false },
    { header: '生成计划', key: 'piece', width: 15, hidden: false },
    { header: '实际接单', key: 'piece', width: 12, hidden: false },
  ];

  // 添加标题行（合并单元格）
  worksheet.mergeCells('A1:H1');//合并单元格
  const titleRow = worksheet.getRow(1);
  titleRow.getCell(1).value = labelText;
  titleRow.height = 40; // 行高

  // 设置标题样式
  titleRow.getCell(1).style = {
    font: { bold: true, size: 14, name: 'Microsoft YaHei' },
    alignment: { horizontal: 'center', vertical: 'middle' },
  };

  // 添加表头和数据
  const subHeaders = ['省区', '销售总计划','供应链', '鲜酪乳', '健爽', '330/310','200清新活力','450清新活力'];

  worksheet.addRow(subHeaders);

  // 添加数据行
  tableList.forEach(item => { 
    worksheet.addRow([
      item.areaname || '',
      item.piece || '',
      item.factory || '',
      item.xnl || '',
      item.js || '',
      item.yznr || '',
      item.qxhl200 || '',
      item.qxhl450 || ''
    ]);
  });

  // 动态查找 "分公司总计" 行并合并前三列
  worksheet.eachRow((row, rowNum) => {
    if (row.getCell(2).value === "分公司总计") {
      worksheet.mergeCells(rowNum, 1, rowNum, 4); // 合并A、B、C列
      const cell = row.getCell(1);
      cell.value = "分公司总计"; // 防止合并后数据丢失
      cell.alignment = { horizontal: "center" };
    }
  });

  // 设置样式（表头、数据行、小计行等）
  styleHeaderRows(worksheet);
  styleDataRows(worksheet);
  
  // 修改合并逻辑："海南省"行不合并，其他行正常合并
  mergeColumnWithHainanExclusion(worksheet, 3, 2);
  
  // 处理光明工厂总计和海南工厂总计行样式（必须在styleDataRows之后执行）
  worksheet.eachRow((row, rowNum) => {
    const areaName = row.getCell(1).value;
    
    // 处理光明工厂总计和海南工厂总计行
    if (areaName === "光明工厂每日总计" || areaName === "海南工厂每日总计" ||areaName === "光明工厂月度总计" || areaName === "海南工厂月度总计") {
      row.eachCell(cell => {
        cell.style = {
          ...cell.style,
          font: {
            ...cell.style.font,
            bold: true
          }
        };
      });
    }
  });
  
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
}

// 新的合并函数："海南省"行不合并，其他行正常合并
function mergeColumnWithHainanExclusion(worksheet, columnIndex, startRow = 2) {
  const endRow = worksheet.rowCount;
  const columnLetter = worksheet.getColumn(columnIndex).letter;
  const areaColumnLetter = worksheet.getColumn(1).letter; // 省区列是第1列
  
  let mergeStart = startRow;
  let currentValue = worksheet.getCell(`${columnLetter}${mergeStart}`).value;
  
  for (let i = startRow + 1; i <= endRow + 1; i++) {
    const cellValue = i <= endRow ? worksheet.getCell(`${columnLetter}${i}`).value : null;
    const areaCellValue = i <= endRow ? worksheet.getCell(`${areaColumnLetter}${i}`).value : null;
    const prevAreaCellValue = worksheet.getCell(`${areaColumnLetter}${i-1}`).value;
    
    // 检查是否需要中断合并的条件：
    // 1. 供应链值发生变化
    // 2. 到达最后一行
    // 3. 遇到空值
    // 4. 当前行或上一行是"海南省"（不参与合并）
    const shouldBreakMerge = cellValue !== currentValue || 
                            i > endRow || 
                            !currentValue || 
                            !cellValue ||
                            areaCellValue === "海南省" || // 当前行是海南省
                            prevAreaCellValue === "海南省"; // 上一行是海南省
  
    if (shouldBreakMerge) {
      // 只有当起始值不为空、合并段长度大于1、且合并段中没有"海南省"时才进行合并
      // 检查合并段中是否包含"海南省"
      let hasHainanInRange = false;
      for (let r = mergeStart; r < i; r++) {
        if (worksheet.getCell(`${areaColumnLetter}${r}`).value === "海南省") {
          hasHainanInRange = true;
          break;
        }
      }
      
      if (mergeStart < i - 1 && currentValue && !hasHainanInRange) {
        const mergeRange = `${columnLetter}${mergeStart}:${columnLetter}${i - 1}`;
        worksheet.mergeCells(mergeRange);
        
        const cell = worksheet.getCell(`${columnLetter}${mergeStart}`);
        cell.alignment = {
          vertical: 'middle',
          horizontal: 'center'
        };
      }
      
      mergeStart = i;
      currentValue = cellValue;
    }
  }
  
  // 处理最后一段
  if (mergeStart <= endRow && currentValue) {
    // 检查最后一段中是否包含"海南省"
    let hasHainanInLastRange = false;
    for (let r = mergeStart; r <= endRow; r++) {
      if (worksheet.getCell(`${areaColumnLetter}${r}`).value === "海南省") {
        hasHainanInLastRange = true;
        break;
      }
    }
    
    if (!hasHainanInLastRange) {
      const mergeRange = `${columnLetter}${mergeStart}:${columnLetter}${endRow}`;
      worksheet.mergeCells(mergeRange);
      
      const cell = worksheet.getCell(`${columnLetter}${mergeStart}`);
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center'
      };
    }
  }
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
  for (let i = 3; i <= worksheet.rowCount; i++) {
    const row = worksheet.getRow(i);
    row.eachCell(cell => {
      cell.style = dataRowStyle;
    });
    row.height = 25; // 设置行高
  }
}