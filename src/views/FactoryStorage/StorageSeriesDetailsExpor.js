import * as XLSX from 'xlsx'
import FileSaver from 'file-saver'
import XLSXS from 'xlsx-style'

/**
 * 根据list进行导出
 * @param {Element} dom
 * @param {String} fileName
 */
export function exportExcel(tableList, fileName) {

  let tableData = [
    ['销售区域','分公司/办事处', '客户名称','PTS帐号', '站点名称', '日期', '常温订单数', '常温入库数','常温未入库数','低温订单数','低温入库数','低温未入库数','订单数汇总','入库数汇总','未入库数汇总',]
  ]
  // tableData.push(tablebop)
  tableList.forEach(item => {
    tableData.push([item.levelName2|| '',item.levelName3|| '',item.cust_name || '',item.username || '', item.cu_name || '', item.po_date || '', item.normal_order_count || '', item.normal_in_count || '', item
      .normal_unin_count || '', item.cold_order_count || '', item.cold_in_count || '', item.cold_unin_count || '', item.total_order_count || '', item.total_in_count || '', item.total_unin_count || ''
    ])
  })
  let ws = XLSX.utils.aoa_to_sheet(tableData)
  console.log(ws, 'ws')
  // mergeAllAdjacentCells(ws)//列合并
  // mergeEGColumns(ws)
  mergeTotalRowColumns(ws)//行合并
  
  setExcelStyle(ws) // 设置样式
  styleFirstTwoRows(ws)
  styleTotalRows(ws)
  let wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws)
  let wbout = XLSXS.write(wb, {
    bookType: 'xlsx',
    bookSST: false,
    type: 'binary'
  })
  try {
    FileSaver.saveAs(new Blob([s2ab(wbout)], {
      type: "application/octet-stream"
    }), fileName);
  } catch (e) {
    console.error(e, wbout, '----->>>')
  }
}

function mergeAllAdjacentCells(ws) {
  // 确保!merges数组存在
  if (!ws['!merges']) {
    ws['!merges'] = [];
  }

  // 获取工作表的范围
  const range = XLSX.utils.decode_range(ws['!ref']);
  const rowCount = range.e.r + 1; // 总行数
  const colCount = Math.min(8, range.e.c + 1); // 最多处理5列(A-E)

  // 遍历A-E列(列索引0-4)
  for (let col = 0; col < colCount; col++) {
    let currentValue = null; // 当前值
    let startRow = null; // 合并的起始行

    // 遍历所有行
    for (let row = 1; row < rowCount; row++) {
      const cell = ws[XLSX.utils.encode_cell({
        c: col,
        r: row
      })]; // 获取当前单元格

      if (cell && cell.v === currentValue) {
        // 当前单元格的值与前一个相同，继续
        continue;
      }

      // 如果当前值与之前不同，且存在需要合并的范围
      if (currentValue !== null && startRow !== null && (row - 1) > startRow) {
        // 添加合并范围
        ws['!merges'].push({
          s: { r: startRow, c: col }, // 起始位置
          e: { r: row - 1, c: col }  // 结束位置
        });
      }

      // 更新当前值和起始行
      currentValue = cell ? cell.v : null;
      startRow = row;
    }

    // 处理最后一组合并
    if (currentValue !== null && startRow !== null && (rowCount - 1) > startRow) {
      ws['!merges'].push({
        s: { r: startRow, c: col },
        e: { r: rowCount - 1, c: col }
      });
    }
  }
}
function mergeEGColumns(ws) {
  // 确保!merges数组存在
  if (!ws['!merges']) {
    ws['!merges'] = [];
  }

  // 获取工作表的范围
  const range = XLSX.utils.decode_range(ws['!ref']);
  const rowCount = range.e.r + 1; // 总行数

  // 处理E列到G列(列索引4到6)
  for (let col = 2; col <= 6; col++) {
    // 如果列索引超出工作表范围则跳过
    if (col > range.e.c) continue;

    let currentValue = null; // 当前值
    let startRow = null; // 合并的起始行

    // 遍历所有行
    for (let row = 1; row < rowCount; row++) {
      const cell = ws[XLSX.utils.encode_cell({
        c: col,
        r: row
      })]; // 获取当前单元格

      if (cell && cell.v === currentValue) {
        // 当前单元格的值与前一个相同，继续
        continue;
      }

      // 如果当前值与之前不同，且存在需要合并的范围
      if (currentValue !== null && startRow !== null && (row - 1) > startRow) {
        // 添加合并范围
        ws['!merges'].push({
          s: { r: startRow, c: col }, // 起始位置
          e: { r: row - 1, c: col }  // 结束位置
        });
      }

      // 更新当前值和起始行
      currentValue = cell ? cell.v : null;
      startRow = row;
    }

    // 处理最后一组合并
    if (currentValue !== null && startRow !== null && (rowCount - 1) > startRow) {
      ws['!merges'].push({
        s: { r: startRow, c: col },
        e: { r: rowCount - 1, c: col }
      });
    }
  }
}

function mergeTotalRowColumns(ws) {
  // 确保!merges数组存在
  if (!ws['!merges']) {
    ws['!merges'] = [];
  }

  // 获取工作表范围
  const range = XLSX.utils.decode_range(ws['!ref']);
  const rowCount = range.e.r + 1;
  const colCount = range.e.c + 1;

  // 遍历所有行，寻找包含"合计"的D列单元格
  for (let row = 0; row < rowCount; row++) {
    const dColCell = ws[XLSX.utils.encode_cell({ r: row, c: 6 })]; // 是第6列(0-based)
    
    // 检查D列单元格是否包含"合计"
    if (dColCell && (dColCell.v === "合计" || dColCell.v === "总计" || dColCell.v === "合计:")) {
      // 合并D列和E列
      ws['!merges'].push({
        s: { r: row, c: 5 }, // D列(索引3)
        e: { r: row, c: 6 }  // E列(索引4)
      });
      
      // 可选：设置合并后单元格的样式（如居中）
      const mergedCell = ws[XLSX.utils.encode_cell({ r: row, c: 3 })];
      if (!mergedCell.s) mergedCell.s = {};
      mergedCell.s.alignment = {
        horizontal: "center",
        vertical: "center"
      };
    }
  }
}


// 设置导出Excel样式 这里主要是关注单元格宽度
function setExcelStyle(data) {
  // 1. 定义全边框样式（黑色细线）
  let borderAll = {
    top: { style: "thin", color: { rgb: '000000' } },    // 上边框
    bottom: { style: "thin", color: { rgb: '000000' } }, // 下边框
    left: { style: "thin", color: { rgb: '000000' } },   // 左边框
    right: { style: "thin", color: { rgb: '000000' } }   // 右边框
  }

  // 2. 初始化列宽设置
  data['!cols'] = [
    { wpx: 100 }, { wpx: 150 }, { wpx: 180 }, { wpx: 80 },
    { wpx: 150 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }
    // 最后一列宽度为0（隐藏列）
  ];

  // 3. 设置行高（两种单位任选其一）

  // 方案A：使用像素单位（hpx）
  data['!rows'] = [
    { hpx: 16.5 },  // 第1行高度35像素
    { hpx: 16.5 },  // 第2行高度28像素
    { hpx: 16.5 }
  ];
  // 4. 获取总行数（假设 data 是 SheetJS 的工作表对象）
  const rowCount = Object.keys(data)
    .filter(key => key.match(/^[A-Z]+\d+$/)) // 过滤有效单元格（如 "A1", "B2"）
    .map(key => parseInt(key.replace(/[A-Z]+/, ''))) // 提取行号（如 "A1" → 1）
    .reduce((max, rowNum) => Math.max(max, rowNum), 0); // 计算最大行号

  // 5. 设置剩余行高为16.5px（从第4行开始）
  for (let i = 4; i <= rowCount; i++) {
    data['!rows'][i - 1] = { hpx: 16.5 }; // 数组索引从0开始，所以 i-1
  }


  // 4. 为所有单元格应用统一样式
  for (let key in data) {
    if (typeof data[key] === 'object' && data[key] !== null) {
      data[key].s = {
        border: borderAll,       // 边框样式
        alignment: {
          horizontal: "center", // 水平居中
          vertical: "center",   // 垂直居中
          wrapText: true       // 自动换行
        },
        font: {
          sz: 11,               // 字体大小11磅
          // bold: true,
          name: 'Microsoft YaHei',          // 加粗
        },
        numFmt: "0"             // 数字格式（常规）
      }
    }
  }
}

//特殊行
function styleTotalRows(ws) {
  // 红色字体样式定义
  const redFontStyle = {
    font: {
      color: {
        rgb: "FF0000"  // 红色
      },
      name: 'Microsoft YaHei',
      sz: 11,
      // bold: true
    }
  };

  // 获取工作表范围
  const range = XLSX.utils.decode_range(ws['!ref']);
  const rowCount = range.e.r + 1; // 总行数
  const colCount = range.e.c + 1; // 总列数

  for (let row = 0; row < rowCount; row++) {
    // 检查第二列（索引1）是否包含"合计"
    const cellAddress = XLSX.utils.encode_cell({
      c: 5,  // 第二列（索引1）
      r: row
    });
    const cell = ws[cellAddress];

    // 如果是合计行
    if (cell && cell.v && typeof cell.v === 'string' && cell.v.includes("合计")) {
      // 只处理G到K列（索引6到10）
      for (let col = 5; col <= 14; col++) {
        // 确保列索引不超过工作表范围
        if (col < colCount) {
          const targetCellAddress = XLSX.utils.encode_cell({
            c: col,
            r: row
          });
          const targetCell = ws[targetCellAddress];

          if (targetCell) {
            // 保留原有样式，只修改字体颜色
            targetCell.s = {
              ...(targetCell.s || {}),  // 保留现有样式
              font: {
                ...((targetCell.s && targetCell.s.font) || {}), // 保留现有字体样式
                color: { rgb: "FF0000" } // 设置为红色
              }
            };
          } else {
            // 如果单元格不存在，创建新单元格并应用红色字体
            ws[targetCellAddress] = {
              t: 's', // 字符串类型
              v: '',  // 空值
              s: redFontStyle
            };
          }
        }
      }
    }
  }
}

//第一行样式
function styleFirstTwoRows(ws) {
  // 定义样式
  const redBackground = {
    fill: {
      fgColor: {
        rgb: "c00000"
      }
    }
  }; // 红色背景
  const whiteFont = {
    font: {
      color: {
        rgb: "FFFFFF"
      },
      sz: 12,
      bold: true
    }
  }; // 白色字体

  // 确保工作表的行数足够
  const rowCount = 1; // 只处理前两行

  for (let row = 0; row < rowCount; row++) {
    for (let col = 0; col <= XLSX.utils.decode_range(ws['!ref']).e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({
        c: col,
        r: row
      });
      const cell = ws[cellAddress];

      if (cell) {
        // 应用背景颜色
        cell.s = {
          ...cell.s,
          ...redBackground,
          ...whiteFont
        };
      } else {
        // 如果单元格不存在，创建一个新的单元格并应用样式
        ws[cellAddress] = {
          s: {
            ...redBackground,
            ...whiteFont
          }
        };
      }
    }
  }
}


function s2ab(s) {
  var buf = new ArrayBuffer(s.length)
  var view = new Uint8Array(buf)
  for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
  return buf
}
