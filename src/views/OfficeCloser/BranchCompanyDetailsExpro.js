import  ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

/**
 * 使用 exceljs 导出 Excel（支持隐藏列）
 * @param {Array} tableList - 数据列表
 * @param {String} startDate - 开始日期
 * @param {String} endDate - 结束日期
 * @param {String} fileName - 文件名
 */
export async function exportExcel(tableList, startDate, endDate,areas, fileName) {
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
  console.log(monthEnd)

  const labelText = `${year}年${areas || '全部'}各单位体 完成进度---截止到(${monthEnd}月${dayEnd}日)`;



  // 定义列（支持隐藏）
  worksheet.columns = [
    { header: '序号', key: 'sort', width: 10, hidden: false },
    { header: '单位体', key: 'ocustomerClass_name', width: 16, hidden: false },
    { header: '负责人', key: 'companyman', width: 15, hidden: false },
    { header: '低温目标', key: 'goalnumtotal', width: 12, hidden: false },
    { header: '今日目标', key: 'goalnum', width: 12, hidden: false },
    { header: 'look系列', key: 'looktodaybox', width: 12, hidden: true },
    { header: '330/310', key: 'today330box', width: 12, hidden: false },
    { header: '180宴席', key: 'today180box', width: 12, hidden: false },
    { header: '今日已完成', key: 'todayend', width: 12, hidden: false },
    { header: '今日缺口\n(正为缺口)', key: 'todaydiff', width: 12, hidden: false },
    { header: '累计目标', key: 'ordersnumStage', width: 12, hidden: true },
    { header: 'look系列', key: 'lookleijibox', width: 12, hidden: false },
    { header: '330/310', key: 'leiji330box', width: 12, hidden: false },
    { header: '180宴席', key: 'leiji180box', width: 12, hidden: false },
    { header: '累计完成', key: 'leijiend', width: 12, hidden: false },
    { header: '累计缺口\n(正为缺口)', key: 'leijidiff', width: 12, hidden: false },
    { header: '明日指标', key: 'goalnumTommo', width: 12, hidden: false },
  ];

  // 添加标题行（合并单元格）
  worksheet.mergeCells('A1:Q1');//合并单元格
  const titleRow = worksheet.getRow(1);
  titleRow.getCell(1).value = labelText;
  titleRow.height = 40; // 行高

  // 设置标题样式
  titleRow.getCell(1).style = {
    font: { bold: true, size: 14, name: 'Microsoft YaHei' },
    alignment: { horizontal: 'center', vertical: 'middle' },
  };

  // 添加表头和数据
  const headers =['序号', '单位体', '负责人', '低温目标', '今日完成', `今日完成`,'今日完成', `今日完成`,'今日完成', `今日完成`,`截止今日累计完成`, `截止今日累计完成`, `截止今日累计完成`,
    `截止今日累计完成`, `截止今日累计完成`,`截止今日累计完成`, '明日指标'];
  const subHeaders = ['序号', '单位体', '负责人', '低温目标', `今日目标`,'look系列', `330/310`,'180宴席', `今日完成`,`今日缺口\n(正为缺口)`, `累计目标`, `look系列`,`330/310`,
    `180宴席`, `累计完成`, `累计缺口\n(正为缺口)`, '明日指标'];

  worksheet.addRow(headers);
  worksheet.addRow(subHeaders);

  // 添加数据行
  tableList.forEach(item => {
    worksheet.addRow([
      item.sort || '',
      item.ocustomerClass_name || '',
      item.companyman || '',
      item.goalnumtotal || '',
      item.goalnum || '',
      item.looktodaybox || '',
      item.today330box || '',
      item.today180box || '',
      item.todayend || '',
      item.todaydiff || '',
      item.ordersnumStage || '',
      item.lookleijibox || '',
      item.leiji330box || '',
      item.leiji180box || '',
      item.leijiend || '',
      item.leijidiff || '',
      item.goalnumTommo || '',
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
  worksheet.mergeCells('Q2:Q3');
  // ...其他需要合并的列
  worksheet.mergeCells('E2:J2');
  worksheet.mergeCells('K2:P2');


  // 动态查找 "全国合计" 行并合并前三列
  worksheet.eachRow((row, rowNum) => {
  if (row.getCell(2).value === "合计") {
    worksheet.mergeCells(rowNum, 1, rowNum, 3); // 合并A、B、C列
    const cell = row.getCell(1);
    cell.value = "合计"; // 防止合并后数据丢失
    cell.alignment = { horizontal: "center" };
  }
});

  // 设置样式（表头、数据行、小计行等）
  styleHeaderRows(worksheet);
  styleDataRows(worksheet)
  styleSubtotalRows(worksheet);

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
    if (cell.value && typeof cell.value === 'string' && cell.value.includes('合计')) {
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