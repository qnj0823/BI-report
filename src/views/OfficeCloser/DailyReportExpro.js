import  ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
/**
 * 使用 exceljs 导出 Excel（复杂多表格布局）
 * @param {Array} tableList - 数据列表
 * @param {String} startDate - 开始日期
 * @param {String} endDate - 结束日期
 * @param {String} fileName - 文件名
 * @param {Object} summaryData - 汇总数据对象，包含三个小表格的数据
 */
export async function exportExcel(tableList, startDate, endDate, currentDate,fileName, summaryData = {}) {
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

  // 设置列宽
  worksheet.columns = [
    { width: 10 }, // A
    { width: 10 }, // B
    { width: 10 }, // C
    { width: 10 }, // D
    { width: 10 }, // E
    { width: 10 }, // F
    { width: 10 }, // G
    { width: 10 }, // H
    { width: 10 }, // I
    { width: 10 }, // J
    { width: 10 }, // K
    { width: 10 }  // L
  ];

  let currentRow = 1;

  // 第一行：标题（A1:L1）
  worksheet.mergeCells('A1:L1');
  const titleRow = worksheet.getRow(1);
  titleRow.getCell(1).value = '销售日订单跟进表';
  styleTitleRow(titleRow);
  currentRow++;

  // 第二行：日期区间信息（整行合并但两端对齐）
  const dateRow = worksheet.getRow(2);
  // 整行合并A到L
  worksheet.mergeCells('A2:L2');
  
  // 使用空格来实现两端对齐的效果
  const leftText = `日期区间：${year}/${month}/${day}—${yearEnd}/${monthEnd}/${dayEnd}`;
  const rightText = `当期数据日期：${currentDate.replace(/-/g, '/')}`;
  // 计算需要的空格数来实现两端对齐（大约对应A-D和I-L的位置）
  const spaces = '                                          '; //空格分隔
  dateRow.getCell(1).value = leftText + spaces + rightText;
  
  styleDateRow(dateRow);
  currentRow++;

  // 三个小表格的标题行（不空行，直接开始）
  const summaryTitleRow = worksheet.getRow(currentRow);
  
  // 区间总增幅标题（A到C）
  worksheet.mergeCells(`A${currentRow}:C${currentRow}`);
  summaryTitleRow.getCell(1).value = '区间总增幅';
  
  // 截止今日增幅标题（F到H）
  worksheet.mergeCells(`F${currentRow}:H${currentRow}`);
  summaryTitleRow.getCell(6).value = '截止今日增幅';
  
  // 今日增幅标题（K到L）
  worksheet.mergeCells(`K${currentRow}:L${currentRow}`);
  summaryTitleRow.getCell(11).value = '今日增幅';
  
  styleSummaryTitleRow(summaryTitleRow);
  currentRow++;

  // 创建三个小表格
  currentRow = createSummaryTables(worksheet, currentRow, summaryData);

  // 空一行
  currentRow++;

  // 主数据表格开始行
  const mainTableStartRow = currentRow;
  
  // 主表格表头
  const headers = ['日期', '城市', '区域', '客户(站点)', '', '24年10月\n累积', '10月报单累积', '同比\n完成率', '今日\n同期', '今日\n报单', '今日同期差额', '累积同期差额'];
  const headerRow = worksheet.getRow(currentRow);
  headers.forEach((header, index) => {
    headerRow.getCell(index + 1).value = header;
  });
  
  // 合并客户(站点)列：D4:E4
  worksheet.mergeCells(`D${currentRow}:E${currentRow}`);
  
  styleMainTableHeader(headerRow);
  currentRow++;

  // 添加主数据表格数据并处理多层级合并
  const mergeRanges = {
    date: [], // 日期合并范围
    city: [], // 城市合并范围  
    region: [] // 区域合并范围
  };
  
  let currentDateGroup = null;
  let currentCityGroup = null;
  let currentRegionGroup = null;
  let dateStartRow = null;
  let cityStartRow = null;
  let regionStartRow = null;
  
  tableList.forEach((item, index) => {
    const dataRow = worksheet.getRow(currentRow);
    const currentDate = item.vouchdate || '';
    const currentCity = item.cityname || '';
    const currentRegion = item.areaname || '';

    
    
    // 检查日期组变化
    if (currentDateGroup !== currentDate) {
      // 记录之前的日期组合并范围
      if (currentDateGroup !== null && dateStartRow !== null && currentRow - 1 > dateStartRow) {
        mergeRanges.date.push({
          value: currentDateGroup,
          startRow: dateStartRow,
          endRow: currentRow - 1
        });
      }
      // 开始新的日期组
      currentDateGroup = currentDate;
      dateStartRow = currentRow;
      
      // 日期变化时，重置城市和区域组
      currentCityGroup = null;
      currentRegionGroup = null;
      cityStartRow = null;
      regionStartRow = null;
    }
    
    // 检查城市组变化（在同一日期内）
    if (currentCityGroup !== currentCity) {
      // 记录之前的城市组合并范围
      if (currentCityGroup !== null && cityStartRow !== null && currentRow - 1 > cityStartRow) {
        mergeRanges.city.push({
          value: currentCityGroup,
          startRow: cityStartRow,
          endRow: currentRow - 1
        });
      }
      
      // 记录之前的区域组合并范围（城市变化时）
      if (currentRegionGroup !== null && regionStartRow !== null && currentRow - 1 > regionStartRow) {
        mergeRanges.region.push({
          value: currentRegionGroup,
          startRow: regionStartRow,
          endRow: currentRow - 1
        });
      }
      
      // 开始新的城市组
      currentCityGroup = currentCity;
      cityStartRow = currentRow;
      
      // 城市变化时，重置区域组
      currentRegionGroup = null;
      regionStartRow = null;
    }
    
    // 检查区域组变化（在同一日期和城市内）
    if (currentRegionGroup !== currentRegion) {
      // 记录之前的区域组合并范围
      if (currentRegionGroup !== null && regionStartRow !== null && currentRow - 1 > regionStartRow) {
        mergeRanges.region.push({
          value: currentRegionGroup,
          startRow: regionStartRow,
          endRow: currentRow - 1
        });
      }
      // 开始新的区域组
      currentRegionGroup = currentRegion;
      regionStartRow = currentRow;
    }
    
    dataRow.getCell(1).value = currentDate;
    dataRow.getCell(2).value = currentCity;
    dataRow.getCell(3).value = currentRegion;
    dataRow.getCell(4).value = item.cSiteName || '';
    // 第5列为空（因为客户站点占据D和E两列）
    dataRow.getCell(6).value = item.fixedbox || '';
    dataRow.getCell(7).value = item.goalnumtotal || '';
    dataRow.getCell(8).value = item.goalrate || '';
    dataRow.getCell(9).value = item.goalnum || '';
    dataRow.getCell(10).value = item.todaybox || '';
    dataRow.getCell(11).value = item.difference || '';
    dataRow.getCell(12).value = item.leijibox || '';
    
    // 合并每行的客户(站点)列：D到E
    worksheet.mergeCells(`D${currentRow}:E${currentRow}`);
    
    styleMainTableDataRow(dataRow);
    currentRow++;
    
    // 处理最后一组数据
    if (index === tableList.length - 1) {
      // 处理最后的日期组
      if (dateStartRow !== null && currentRow - 1 > dateStartRow) {
        mergeRanges.date.push({
          value: currentDateGroup,
          startRow: dateStartRow,
          endRow: currentRow - 1
        });
      }
      // 处理最后的城市组
      if (cityStartRow !== null && currentRow - 1 > cityStartRow) {
        mergeRanges.city.push({
          value: currentCityGroup,
          startRow: cityStartRow,
          endRow: currentRow - 1
        });
      }
      // 处理最后的区域组
      if (regionStartRow !== null && currentRow - 1 > regionStartRow) {
        mergeRanges.region.push({
          value: currentRegionGroup,
          startRow: regionStartRow,
          endRow: currentRow - 1
        });
      }
    }
  });
  
  // 执行多层级合并
  // 首先收集所有合计行的行号，避免在这些行上进行其他合并
  const subtotalRows = new Set();
  for (let rowNum = mainTableStartRow + 1; rowNum <= currentRow - 1; rowNum++) {
    const row = worksheet.getRow(rowNum);
    const cityCell = row.getCell(2);
    if (cityCell.value && typeof cityCell.value === 'string' && 
        (cityCell.value.includes('小计') || cityCell.value.includes('合计') || cityCell.value.includes('总计'))) {
      subtotalRows.add(rowNum);
    }
  }
  
  // 1. 合并日期列（A列）- 包含合计行
  mergeRanges.date.forEach(range => {
    if (range.startRow < range.endRow) {
      // 直接合并整个日期范围，包括合计行
      worksheet.mergeCells(`A${range.startRow}:A${range.endRow}`);
      const mergedCell = worksheet.getCell(`A${range.startRow}`);
      mergedCell.alignment = { vertical: 'middle', horizontal: 'center' };
      mergedCell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } }
      };
      mergedCell.font = { name: '宋体', size: 11, bold: false };
    }
  });
  
  // 2. 合并城市列（B列）- 跳过合计行
  mergeRanges.city.forEach(range => {
    if (range.startRow < range.endRow) {
      // 检查范围内是否包含合计行，如果包含则分段合并
      let segmentStart = range.startRow;
      for (let rowNum = range.startRow; rowNum <= range.endRow; rowNum++) {
        if (subtotalRows.has(rowNum)) {
          // 合并前一段
          if (segmentStart < rowNum) {
            worksheet.mergeCells(`B${segmentStart}:B${rowNum - 1}`);
            const mergedCell = worksheet.getCell(`B${segmentStart}`);
            mergedCell.alignment = { vertical: 'middle', horizontal: 'center' };
            mergedCell.border = {
              top: { style: 'thin', color: { argb: 'FF000000' } },
              bottom: { style: 'thin', color: { argb: 'FF000000' } },
              left: { style: 'thin', color: { argb: 'FF000000' } },
              right: { style: 'thin', color: { argb: 'FF000000' } }
            };
            mergedCell.font = { name: '宋体', size: 11, bold: false };
          }
          segmentStart = rowNum + 1;
        }
      }
      // 合并最后一段
      if (segmentStart <= range.endRow) {
        if (segmentStart < range.endRow) {
          worksheet.mergeCells(`B${segmentStart}:B${range.endRow}`);
          const mergedCell = worksheet.getCell(`B${segmentStart}`);
          mergedCell.alignment = { vertical: 'middle', horizontal: 'center' };
          mergedCell.border = {
            top: { style: 'thin', color: { argb: 'FF000000' } },
            bottom: { style: 'thin', color: { argb: 'FF000000' } },
            left: { style: 'thin', color: { argb: 'FF000000' } },
            right: { style: 'thin', color: { argb: 'FF000000' } }
          };
          mergedCell.font = { name: '宋体', size: 11, bold: false };
        }
      }
    }
  });
  
  // 3. 合并区域列（C列）- 跳过合计行
  mergeRanges.region.forEach(range => {
    if (range.startRow < range.endRow) {
      // 检查范围内是否包含合计行，如果包含则分段合并
      let segmentStart = range.startRow;
      for (let rowNum = range.startRow; rowNum <= range.endRow; rowNum++) {
        if (subtotalRows.has(rowNum)) {
          // 合并前一段
          if (segmentStart < rowNum) {
            worksheet.mergeCells(`C${segmentStart}:C${rowNum - 1}`);
            const mergedCell = worksheet.getCell(`C${segmentStart}`);
            mergedCell.alignment = { vertical: 'middle', horizontal: 'center' };
            mergedCell.border = {
              top: { style: 'thin', color: { argb: 'FF000000' } },
              bottom: { style: 'thin', color: { argb: 'FF000000' } },
              left: { style: 'thin', color: { argb: 'FF000000' } },
              right: { style: 'thin', color: { argb: 'FF000000' } }
            };
            mergedCell.font = { name: '宋体', size: 11, bold: false };
          }
          segmentStart = rowNum + 1;
        }
      }
      // 合并最后一段
      if (segmentStart <= range.endRow) {
        if (segmentStart < range.endRow) {
          worksheet.mergeCells(`C${segmentStart}:C${range.endRow}`);
          const mergedCell = worksheet.getCell(`C${segmentStart}`);
          mergedCell.alignment = { vertical: 'middle', horizontal: 'center' };
          mergedCell.border = {
            top: { style: 'thin', color: { argb: 'FF000000' } },
            bottom: { style: 'thin', color: { argb: 'FF000000' } },
            left: { style: 'thin', color: { argb: 'FF000000' } },
            right: { style: 'thin', color: { argb: 'FF000000' } }
          };
          mergedCell.font = { name: '宋体', size: 11, bold: false };
        }
      }
    }
  });

  // 处理小计行的合并（B到H列）
  processSubtotalRows(worksheet, mainTableStartRow + 1, currentRow - 1);

  // 导出文件
  const buffer = await workbook.xlsx.writeBuffer();
  
  // 确保文件名有正确的Excel扩展名
  let finalFileName = fileName || '日报导出';
  if (!finalFileName.toLowerCase().endsWith('.xlsx') && !finalFileName.toLowerCase().endsWith('.xls')) {
    finalFileName = finalFileName + '.xlsx';
  }
  
  // 创建Excel格式的Blob并导出
  const blob = new Blob([buffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  saveAs(blob, finalFileName);
}

// 创建三个小表格
function createSummaryTables(worksheet, startRow, summaryData) {
  let currentRow = startRow;
  
  // 区间总增幅表格（A到C列）
  const intervalData = [
    ['去年同区间累积', summaryData.lastYearInterval || ''],
    ['今年同区间报单', summaryData.thisYearInterval || ''],
    ['区间同比差额', summaryData.intervalDifference || ''],
    ['区间同比完成率', summaryData.intervalCompletionRate || '']
  ];
  
  // 截止今日增幅表格（F到H列）
  const todayTotalData = [
    ['截止去年同期累积', summaryData.lastYearToday || ''],
    ['截止今日当期累积', summaryData.thisDayTotal || ''],
    ['截止今日同比差额', summaryData.todayTotalDifference || ''],
    ['截止今日同比完成率', summaryData.todayTotalCompletionRate || '']
  ];
  
  // 今日增幅表格（K到L列）
  const dailyData = [
    ['去年同期', summaryData.lastYearSameDay || ''],
    ['今日报单', summaryData.todayOrders || ''],
    ['今日差额', summaryData.todayDifference || ''],
    ['日完成率', summaryData.dailyCompletionRate || '']
  ];
  
  // 创建四行数据
  for (let i = 0; i < 4; i++) {
    const row = worksheet.getRow(currentRow);
    
    // 区间总增幅表格 - 字段名占A-B两列，数据占C列
    row.getCell(1).value = intervalData[i][0];
    worksheet.mergeCells(`A${currentRow}:B${currentRow}`);
    row.getCell(3).value = intervalData[i][1];
    
    // 截止今日增幅表格 - 字段名占F-G两列，数据占H列
    row.getCell(6).value = todayTotalData[i][0];
    worksheet.mergeCells(`F${currentRow}:G${currentRow}`);
    row.getCell(8).value = todayTotalData[i][1];
    
    // 今日增幅表格 - 字段名占K列，数据占L列
    row.getCell(11).value = dailyData[i][0];
    row.getCell(12).value = dailyData[i][1];
    
    styleSummaryDataRow(row);
    currentRow++;
  }
  
  return currentRow;
}

// 处理小计行合并（B到I列，因为客户站点现在占据D和E两列）
function processSubtotalRows(worksheet, startRow, endRow) {
  for (let rowNum = startRow; rowNum <= endRow; rowNum++) {
    const row = worksheet.getRow(rowNum);
    const cityCell = row.getCell(2);
    
    // 检查是否为小计行（可以根据实际数据特征调整判断条件）
    if (cityCell.value && typeof cityCell.value === 'string' && 
        (cityCell.value.includes('小计') || cityCell.value.includes('合计') || cityCell.value.includes('总计'))) {
      
      // 先检查并取消B列可能存在的纵向合并
      try {
        // 检查B列是否已被合并，如果是则先取消合并
        const bCell = worksheet.getCell(`B${rowNum}`);
        if (bCell.isMerged) {
          // 找到合并范围并取消
          const mergeRange = bCell.master || bCell;
          if (mergeRange.address !== `B${rowNum}`) {
            // 如果B列被纵向合并，需要重新处理
            worksheet.unMergeCells(mergeRange.address);
          }
        }
        
        // 现在进行横向合并B到E列
        worksheet.mergeCells(`B${rowNum}:E${rowNum}`);
        const mergedCell = row.getCell(2);
        mergedCell.alignment = { horizontal: 'center', vertical: 'middle' };
        styleSubtotalRow(row);
        
      } catch (error) {
        // 如果仍然失败，直接强制合并
        try {
          // 强制取消B到E列的所有现有合并
          for (let col = 2; col <= 5; col++) {
            const cell = worksheet.getCell(rowNum, col);
            if (cell.isMerged && cell.master) {
              worksheet.unMergeCells(cell.master.address);
            }
          }
          // 重新合并
          worksheet.mergeCells(`B${rowNum}:E${rowNum}`);
          const mergedCell = row.getCell(2);
          mergedCell.alignment = { horizontal: 'center', vertical: 'middle' };
          styleSubtotalRow(row);
        } catch (finalError) {
          console.warn(`Row ${rowNum} merge failed, applying style only:`, finalError.message);
          styleSubtotalRow(row);
        }
      }
    }
  }
}

// 样式函数：标题行
function styleTitleRow(row) {
  row.height = 38;
  row.getCell(1).style = {
    font: { bold: true, size: 18, name: '宋体' },
    alignment: { horizontal: 'center', vertical: 'middle' },
  };
}

// 样式函数：日期区间行
function styleDateRow(row) {
  row.height = 24;
  const commonStyle = {
    font: { bold: true, size: 12, name: '宋体' },
    alignment: { horizontal: 'left', vertical: 'middle' },
  };
  
  row.getCell(1).style = commonStyle;
}

// 样式函数：小表格标题行
function styleSummaryTitleRow(row) {
  row.height = 24;
  const titleStyle = {
    font: { bold: true, size: 12, name: '宋体' },
    alignment: { horizontal: 'center', vertical: 'middle' },
    border: { 
      top: { style: 'thin' }, 
      bottom: { style: 'thin' }, 
      left: { style: 'thin' }, 
      right: { style: 'thin' } 
    }
  };
  
  // 应用到三个小表格的标题 - 需要应用到所有合并的单元格
  // 区间总增幅：A-C列
  for (let col = 1; col <= 3; col++) {
    row.getCell(col).style = titleStyle;
  }
  
  // 截止今日增幅：F-H列
  for (let col = 6; col <= 8; col++) {
    row.getCell(col).style = titleStyle;
  }
  
  // 今日增幅：K-L列
  for (let col = 11; col <= 12; col++) {
    row.getCell(col).style = titleStyle;
  }
}

// 样式函数：小表格数据行
function styleSummaryDataRow(row) {
  row.height = 14;
  const dataStyle = {
    font: { size: 11, name: '宋体' },
    alignment: { horizontal: 'center', vertical: 'middle' },
    border: { 
      top: { style: 'thin' }, 
      bottom: { style: 'thin' }, 
      left: { style: 'thin' }, 
      right: { style: 'thin' } 
    }
  };
  
  // 应用到所有相关单元格
  // 区间总增幅：A-C列，截止今日增幅：F-H列，今日增幅：K-L列
  for (let col = 1; col <= 12; col++) {
    if ((col >= 1 && col <= 3) || (col >= 6 && col <= 8) || (col >= 11 && col <= 12)) {
      row.getCell(col).style = dataStyle;
    }
  }
}

// 样式函数：主表格表头
function styleMainTableHeader(row) {
  row.height = 27;
  const headerStyle = {
    fill: { 
      type: 'pattern', 
      pattern: 'solid', 
      fgColor: { argb: 'FFC00000' } 
    },
    font: { 
      color: { argb: 'FFFFFFFF' }, 
      bold: true, 
      size: 11, 
      name: '宋体' 
    },
    alignment: { 
      horizontal: 'center', 
      vertical: 'middle',
      wrapText: true
    },
    border: { 
      // top: { style: 'thin' }, 
      bottom: { style: 'thin' }, 
      left: { style: 'thin' }, 
      right: { style: 'thin' } 
    }
  };
  
  // 为"今日报单"列(第10列，J列)设置特殊背景颜色
  const todayOrderStyle = {
    ...headerStyle,
    fill: { 
      type: 'pattern', 
      pattern: 'solid', 
      fgColor: { argb: 'FF4874CB' } 
    }
  };
  
  // 为"累积同期差额"列(第12列，L列)设置特殊背景颜色和字体颜色
  const accumulatedDiffStyle = {
    ...headerStyle,
    fill: { 
      type: 'pattern', 
      pattern: 'solid', 
      fgColor: { argb: 'FFE7E6E6' } 
    },
    font: {
      ...headerStyle.font,
      color: { argb: 'FF000000' } // 黑色字体，确保在浅灰色背景上清晰显示
    }
  };
  
  row.eachCell((cell, colNumber) => {
    if (colNumber === 10) { // "今日报单"列
      cell.style = todayOrderStyle;
    } else if (colNumber === 12) { // "累积同期差额"列
      cell.style = accumulatedDiffStyle;
    } else {
      cell.style = headerStyle;
    }
  });
}

// 样式函数：主表格数据行
function styleMainTableDataRow(row) {
  row.height = 14;
  const dataRowStyle = {
    font: {
      name: '宋体',
      size: 11,
      bold: false
    },
    alignment: {
      horizontal: 'center',
      vertical: 'middle',
      wrapText: true
    },
    border: {
      top: { style: 'thin', color: { argb: 'FF000000' } },
      bottom: { style: 'thin', color: { argb: 'FF000000' } },
      left: { style: 'thin', color: { argb: 'FF000000' } },
      right: { style: 'thin', color: { argb: 'FF000000' } }
    }
  };
  
  // 为"今日报单"列设置特殊背景颜色
  const todayOrderDataStyle = {
    ...dataRowStyle,
    fill: { 
      type: 'pattern', 
      pattern: 'solid', 
      fgColor: { argb: 'FF4874CB' } 
    },
    font: {
      ...dataRowStyle.font,
      color: { argb: 'FFFFFFFF' } // 白色字体
    }
  };
  
  // 为"累积同期差额"列设置特殊背景颜色和字体颜色
  const accumulatedDiffDataStyle = {
    ...dataRowStyle,
    fill: { 
      type: 'pattern', 
      pattern: 'solid', 
      fgColor: { argb: 'FFE7E6E6' } 
    },
    font: {
      ...dataRowStyle.font,
      color: { argb: 'FF000000' } // 黑色字体，确保在浅灰色背景上清晰显示
    }
  };
  
  row.eachCell((cell, colNumber) => {
    if (colNumber === 10) { // "今日报单"列
      cell.style = todayOrderDataStyle;
    } else if (colNumber === 12) { // "累积同期差额"列
      cell.style = accumulatedDiffDataStyle;
    } else {
      cell.style = dataRowStyle;
    }
  });
}

// 样式函数：小计行
function styleSubtotalRow(row) {
  const subtotalStyle = {
    font: {
      color: { argb: 'FFFF0000' }, // 红色字体
      bold: true,
      size: 11, // 调整字体大小为11
      name: '宋体'
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
  
  // 为"今日报单"列设置特殊背景颜色，但保持红色字体
  const todayOrderSubtotalStyle = {
    ...subtotalStyle,
    fill: { 
      type: 'pattern', 
      pattern: 'solid', 
      fgColor: { argb: 'FF4874CB' } 
    }
    // 保持红色字体，不覆盖font属性
  };
  
  // 为"累积同期差额"列设置特殊背景颜色，保持红色字体
  const accumulatedDiffSubtotalStyle = {
    ...subtotalStyle,
    fill: { 
      type: 'pattern', 
      pattern: 'solid', 
      fgColor: { argb: 'FFE7E6E6' } 
    }
    // 保持红色字体，不覆盖font属性
  };
  
  row.eachCell((cell, colNumber) => {
    if (colNumber === 10) { // "今日报单"列
      cell.style = todayOrderSubtotalStyle;
    } else if (colNumber === 12) { // "累积同期差额"列
      cell.style = accumulatedDiffSubtotalStyle;
    } else {
      cell.style = subtotalStyle;
    }
  });
}