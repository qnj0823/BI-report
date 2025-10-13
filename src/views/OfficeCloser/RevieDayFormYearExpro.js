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

  //表头
  // worksheet.columns = [
  //   { header: 'ID', key: 'id', width: 10 },    // 第一列宽 10
  //   { header: 'Name', key: 'name', width: 30 }, // 第二列宽 30
  //   { header: 'Age', key: 'age', width: 15 },   // 第三列宽 15
  // ];
  const subHeaders = ['战区', '省区', '分公司\n办事处', '客户营业执照', '站点', '报单日期', '大原味', '小原味', '优选原味', '小原味\n(戴永红定制)', '小原味\n(绿叶定制)', '大白桃', '小白桃',
    '大清新', '小清新', '450清新', '大健爽', '小健爽', '大0糖', '小0糖', '蓝色健爽', '健能', '姜黄', '330', '310', '180酸乳酪(白）', '180酸乳酪\n(红）', '950常温\n(常规版）', '950常温\n(宴席版）',
    '300常温\n(宴席版）', '300常温\n(经典版）','180活力健爽','455活力健爽','200鲜酪乳','450鲜酪乳', '380橙汁', '1.35橙汁', '380双柚汁', '1.35双柚汁', '300小青柠汁', '900小青柠汁', '300苹果汁', '900苹果汁', '300芒果菠萝汁', '900芒果菠萝汁', '1L椰子牛乳', 
    '椰子水', '245椰子汁', '1L椰子汁', '300椰子汁', '1.25L红瓶椰子汁', '1.25L蓝瓶椰子汁'
  ];


  worksheet.addRow(subHeaders);

  // 添加数据行
  tableList.forEach(item => {
    worksheet.addRow([
      item.dqname || '', item.sqname || '', item.companyname || '', item.cname || '', item.ccitename || '', item.vouchdate || '', item.box1520100001 || '', item.box1520100002 || '', item.box1520100008 || '', item.box1520100020 || '',
      item.box1520100021 || '', item.box1520100010 || '', item.box1520100009 || '', item.box1520100012 || '', item.box1520100011 || '', item.box1520100045 || '', item.box1520100014 || '',
      item.box1520100015 || '', item.box1520100017 || '', item.box1520100016 || '', item.box1520100003 || '', item.box1520100004 || '', item.box1520100007 || '', item.box1520130001 || '', item.box1520130003 || '',
      item.box1520100025 || '', item.box1520100026 || '', item.box1520100047 || '', item.box1520100048 || '',
      item.box1520100027 || '', item.box1520100028 || '',item.box1520100051 || '',item.box1520100054 || '',item.box1520100052 || '',item.box1520100053 || '', item.box1520100030 || '', item.box1520100029 || '', item.box1520100032 || '', item.box1520100031 || '', item.box1520100040 || '', item.box1520100039 || '', item.box1520100038 || '', item.box1520100037 || '',
      item.box1520100036 || '', item.box1520100035 || '', item.box1520130002 || '', item.box1520100034 || '', item.box1520100041 || '', item.box1520100042 || '', item.box1520100043 || '', item.box1520100044 || '', item.box1520100050 || ''
    ]);
  });
  styleHeaderRows(worksheet)
  styleDataRows(worksheet)

  // 设置所有列的宽度为 20
  worksheet.columns.forEach(column => {
    column.width = 15;
  });

  // 导出文件
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), fileName);
}

// 样式函数示例第一行
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

  // 应用样式到第1行
  const row1 = worksheet.getRow(1);
  row1.height = 30;//设置行高
  row1.eachCell(cell => {
    cell.style = headerStyle;
  });

  // // 应用样式到第3行
  // const row3 = worksheet.getRow(3);
  // row3.height = 35;//设置行高
  // row3.eachCell(cell => {
  //   cell.style = headerStyle;
  // });
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
  for (let i = 2; i <= worksheet.rowCount; i++) {
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
    if (cell.value && typeof cell.value === 'string' && cell.value.includes('办事处总计')) {
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

//设置表体样式从办事处总计行开始
function styleDatabscRows(worksheet) {
  // 通用数据行样式
  const dataRowStyle = {
    font: {
      name: 'Microsoft YaHei',
      size: 11,
      bold: true // 数据行字体不加粗
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

  // 查找"办事处总计"所在的行号
  let officeTotalRowNum = 0;
  worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    // 检查A列（或其他关键列）是否包含"办事处总计"
    const firstCellValue = row.getCell(2).value;
    if (firstCellValue && firstCellValue.toString().includes("办事处总计")) {
      officeTotalRowNum = rowNumber;
    }
  });

  // 如果找到"办事处总计"行，则从该行开始应用样式
  if (officeTotalRowNum > 0) {
    for (let i = officeTotalRowNum + 1; i <= worksheet.rowCount; i++) {
      const row = worksheet.getRow(i);
      row.eachCell(cell => {
        cell.style = dataRowStyle;
      });
      row.height = 25; // 设置行高
    }
  } else {
    console.warn("未找到'办事处总计'行，样式未应用");
  }
}