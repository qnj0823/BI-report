import * as XLSX from 'xlsx'
import FileSaver from 'file-saver'
import XLSXS from 'xlsx-style'

/**
 * 根据list进行导出
 * @param {Element} dom
 * @param {String} fileName
 */
export function exportExcel(tableList, date, fileName, tableList1, area) {
  const selectedDate = new Date(date);
  const month = selectedDate.getMonth() + 1;
  const year = selectedDate.getFullYear();
  const day = String(selectedDate.getDate()).padStart(2, '0');
  // const labelText = `${area}区域到货明细表--到货日期${year}年${month}月${day}日`;
  // 1. 创建工作簿
  const wb = XLSX.utils.book_new();

  // 2. 添加固定的"物流站点相关信息"工作表（保持不变）
  const tableData1 = [['区域\n(物流站点)', '联系人', '电话', '地址']];
  tableList1.forEach(item => {
    tableData1.push([item.sitename || '', item.pK_LINKMAN_NAME || '', item.pHONE || '', item.detailinfo || '']);
  });

  const ws2 = XLSX.utils.aoa_to_sheet(tableData1);
  setExcelStyle(ws2);
  styleFirstRows(ws2);

  // 添加到工作簿（固定名称）
  XLSX.utils.book_append_sheet(wb, ws2, '物流站点相关信息');

  // 1. 按deliverydate分组主数据并排序
  const groupedData = {};
  tableList.forEach(item => {
    const deliveryDate = item.deliverydate; // 假设deliverydate存在且是日期字符串
    if (!groupedData[deliveryDate]) {
      groupedData[deliveryDate] = [];
    }
    groupedData[deliveryDate].push(item);
  });

  // 获取所有日期并排序
  const sortedDates = Object.keys(groupedData).sort((a, b) => {
    // 将日期字符串转换为Date对象进行比较
    return new Date(a) - new Date(b);
  });


  console.log(groupedData)

  // 3. 按排序后的日期创建主工作表
  sortedDates.forEach(dateKey => {
    const dateData = groupedData[dateKey];
    const labelText = `${area}区域到货明细表--到货日期${dateKey}`;

    // 先对当前日期的数据执行聚合操作
    const aggregatedData = aggregateData(dateData);

    // 准备表格数据（保持原有格式）
    let tableData = [
      [labelText, labelText, labelText, labelText, labelText, labelText, labelText, labelText,
        labelText, labelText, labelText, labelText, labelText, labelText, labelText, labelText, labelText]
    ];

    const tableTitle = ['区域', '大LOOK', '小LOOK', '健能', 'LOOK优选', '大白桃', '小白桃',
      '大清新健爽（橙）', '小清新健爽（橙）', '大0糖0脂', '小0糖0脂', '小原味戴永红',
      '小原味绿叶水果', '新鲜牧场', '180噜渴(白)', '180噜渴(红)', '合计'];

    tableData.push(tableTitle);

    // 使用聚合后的数据填充表格
    aggregatedData.forEach(item => {
      tableData.push([
        item.wlSiteName || '',
        item.box1520100001 || '',
        item.box1520100002 || '',
        item.box1520100004 || '',
        item.box1520100008 || '',
        item.box1520100010 || '',
        item.box1520100009 || '',
        item.box1520100014 || '',
        item.box1520100015 || '',
        item.box1520100017 || '',
        item.box1520100016 || '',
        item.box1520100020 || '',
        item.box1520100021 || '',
        item.box1520110069 || '',
        item.box1520100025 || '',
        item.box1520100026 || '',
        item.sum || ''
      ]);
    });

    // 创建工作表并应用样式
    const ws = XLSX.utils.aoa_to_sheet(tableData);
    mergeSecondAndThirdRows(ws);
    mergeDuplicateInFirstTwoRows(ws);
    setExcelStyle(ws);
    styleFirstTwoRows(ws);
    styleLastRow(ws);
    styleRowsWithSubtotal(ws);

    // 工作表命名为"物流配送表-日期"
    XLSX.utils.book_append_sheet(wb, ws, `物流配送表-${dateKey}`);
  });
  // 5. 导出文件
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

// 数据聚合函数
function aggregateData(dataList) {
  // 1. 按wlSiteCode分组
  // let aggregated = Object.values(
  //   dataList.reduce((acc, item) => {
  //     const key = item.wlSiteCode;

  //     if (!acc[key]) {
  //       // 创建新分组并删除不需要的字段
  //       acc[key] = { ...item };
  //       ['box', 'deliverydate', 'factoryProductCode', 'factoryProductName',
  //         'piece', 'productCode', 'vouchdate'].forEach(field => delete acc[key][field]);
  //     } else {
  //       // 合并数值字段
  //       Object.keys(item).forEach(field => {
  //         if (!['wlSiteCode', 'box', 'deliverydate', 'factoryProductCode',
  //           'factoryProductName', 'piece', 'productCode', 'vouchdate'].includes(field)) {
  //           acc[key][field] = (Number(acc[key][field]) || 0) + (Number(item[field]) || 0);
  //         }
  //       });
  //     }
  //     return acc;
  //   }, {})
  // );

  let aggregated = Object.values(
    dataList.reduce((acc, item) => {
      const key = item.wlSiteCode; // 使用 wlSiteCode 作为分组依据

      if (!acc[key]) {
        // 初始化新对象，并删除不合并的字段
        acc[key] = { ...item }; // 先复制所有字段

        // 删除不合并的字段
        const fieldsToRemove = [
          'box',
          'deliverydate',
          'factoryProductCode',
          'factoryProductName',
          'piece',
          'productCode',
          'vouchdate'
        ];
        fieldsToRemove.forEach(field => delete acc[key][field]);
      } else {
        // 合并其他字段（如 jtProductCode）
        Object.keys(item).forEach(field => {
          // 如果字段不在排除列表，则合并
          if (![
            'wlSiteCode',
            'box',
            'deliverydate',
            'factoryProductCode',
            'factoryProductName',
            'piece',
            'productCode',
            'vouchdate'
          ].includes(field)) {
            acc[key][field] = item[field]; // 后出现的值会覆盖前面的
          }
        });
      }

      return acc;
    }, {})
  );
  // 2. 计算每个站点的sum
  aggregated = aggregated.map(item => {
    let sum = 0;
    for (const key in item) {
      if (!['areaName', 'days', 'wlSiteCode', 'wlSiteName'].includes(key)) {
        sum += Number(item[key]) || 0;
      }
    }
    return { ...item, sum };
  });

  // 3. 添加总计行
  const totalObj = {
    areaName: "总计",
    days: 0,
    wlSiteCode: "TOTAL",
    wlSiteName: "总计"
  };

  aggregated.forEach(item => {
    Object.keys(item).forEach(key => {
      if (!['areaName', 'days', 'wlSiteCode', 'wlSiteName'].includes(key)) {
        totalObj[key] = (totalObj[key] || 0) + (Number(item[key]) || 0);
      }
    });
    totalObj.days += Number(item.days) || 0;
  });

  aggregated.push(totalObj);
  return aggregated;
}

//合并第几列单元格
function mergeSecondAndThirdRows(ws) {
  // 确保 !merges 数组存在
  if (!ws['!merges']) {
    ws['!merges'] = [];
  }

  // 获取工作表的范围
  const range = XLSX.utils.decode_range(ws['!ref']);
  const colCount = range.e.c + 1;  // 总列数

  // 遍历所有列
  for (let col = 0; col < colCount; col++) {
    // 获取第二行和第三行的单元格
    const cell2 = ws[XLSX.utils.encode_cell({ r: 1, c: col })]; // 第二行（索引1）
    const cell3 = ws[XLSX.utils.encode_cell({ r: 2, c: col })]; // 第三行（索引2）

    // 如果两行都存在且值相同，则合并
    if (cell2 && cell3 && cell2.v === cell3.v) {
      ws['!merges'].push({
        s: { r: 1, c: col },  // 起始位置：第二行
        e: { r: 2, c: col }   // 结束位置：第三行
      });
    }
  }
}

// 行合并  
function mergeDuplicateInFirstTwoRows(ws) {
  const mergeCells = []; // 保存合并单元格的信息  

  // 确保!merges数组存在  
  if (!ws['!merges']) {
    ws['!merges'] = [];
  }

  // 获取总列数  
  const colCount = XLSX.utils.decode_range(ws['!ref']).e.c + 1; // 获取最大列数  

  // 遍历前两行  
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < colCount; col++) {
      const cell = ws[XLSX.utils.encode_cell({
        c: col,
        r: row
      })]; // 获取当前行单元格  

      if (cell) {
        const cellValue = cell.v;
        let startCol = col; // 记录合并的起始列  

        // 检查后续单元格是否与当前单元格相同  
        while (col + 1 < colCount) {
          const nextCell = ws[XLSX.utils.encode_cell({
            c: col + 1,
            r: row
          })];
          if (nextCell && nextCell.v === cellValue) {
            col++; // 移动到下一个单元格  
          } else {
            break; // 如果不相同，退出循环  
          }
        }

        // 如果有多个相同的单元格，记录合并范围  
        if (col > startCol) {
          mergeCells.push({
            s: {
              r: row,
              c: startCol
            }, // 合并起始单元格  
            e: {
              r: row,
              c: col
            } // 合并结束单元格  
          });
        }
      }
    }
  }

  // 添加合并信息到工作表  
  mergeCells.forEach(range => {
    ws['!merges'].push(range);
  });
}

function styleFirstTwoRows(ws) {
  // 红色背景  
  const redBackground = {
    fill: {
      fgColor: {
        rgb: "c00000" // 红色背景 
      }
    }
  };
  // 白色字体  
  const whiteFont = {
    font: {
      color: {
        rgb: "FFFFFF"
      },
      sz: 12,
      name: 'Microsoft YaHei',
      bold: true
    }
  };

  // 确保工作表的行数足够  
  const rowIndex = 1; // 仅处理第二行（0-based索引）
  const colCount = XLSX.utils.decode_range(ws['!ref']).e.c; // 获取列的总数  

  // 处理第一行（行索引为0）  
  for (let col = 0; col <= colCount; col++) {
    const cellAddress = XLSX.utils.encode_cell({
      c: col,
      r: 0  // 第一行  
    });
    const cell = ws[cellAddress];

    if (cell) {
      // 指定字体加粗和变大  
      cell.s = {
        ...cell.s,
        font: {
          ...cell.s.font,
          sz: 20, // 字体大小设为20  
          name: 'Microsoft YaHei',
          bold: true
        }
      };
    } else {
      // 如果单元格不存在，创建新单元格并应用样式  
      ws[cellAddress] = {
        s: {
          font: {
            sz: 20, // 字体大小设为20  
            name: 'Microsoft YaHei',
            bold: true
          }
        }
      };
    }
  }

  // 仅处理第二行
  for (let col = 0; col <= colCount; col++) {
    const cellAddress = XLSX.utils.encode_cell({
      c: col,
      r: rowIndex  // 第二行
    });
    const cell = ws[cellAddress];

    if (cell) {
      if (col < 8) { // 前8列（0-7）
        // 应用红色背景  
        cell.s = {
          ...cell.s,
          ...redBackground,
          ...whiteFont
        };
      } else {
        // 应用蓝色背景  
        cell.s = {
          ...cell.s,
          ...redBackground,
          ...whiteFont
        };
      }
    } else {
      // 如果单元格不存在，创建新单元格并应用样式
      const style = col < 8
        ? { ...redBackground, ...whiteFont }
        : { ...redBackground, ...whiteFont };

      ws[cellAddress] = {
        s: style
      };
    }
  }
}

//第一行样式
function styleFirstRows(ws) {
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
      sz: 12, // 字体大小设为20  
      name: 'Microsoft YaHei',
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


//特定行背景颜色
function styleRowsWithSubtotal(ws) {
  // 样式定义
  const styles = {
    // 小计行样式 - 浅绿色背景
    subtotal: {
      fill: {
        fgColor: {
          rgb: "e2f0d9"  // 浅绿色
        }
      },
      font: {
        color: {
          rgb: "000000"  // 黑色字体
        },
        name: 'Microsoft YaHei',
        sz: 11,
        bold: true
      }
    },
    // 合计行样式 - 深绿色背景
    total: {
      fill: {
        fgColor: {
          rgb: "a9d18e"  // 深绿色 #a9d18e
        }
      },
      font: {
        color: {
          rgb: "000000"  // 黑色字体
        },
        name: 'Microsoft YaHei',
        sz: 11,
        bold: true
      }
    }
  };

  // 获取工作表范围
  const range = XLSX.utils.decode_range(ws['!ref']);
  const rowCount = range.e.r + 1; // 总行数
  const colCount = range.e.c + 1; // 总列数

  for (let row = 0; row < rowCount; row++) {
    // 检查第二列（索引1）
    const cellAddress = XLSX.utils.encode_cell({
      c: 1,  // 第二列（索引1）
      r: row
    });
    const cell = ws[cellAddress];

    // 确定当前行是否需要特殊样式
    let rowStyle = null;
    if (cell && cell.v && typeof cell.v === 'string') {
      if (cell.v.includes("小计")) {
        rowStyle = styles.subtotal;
      } else if (cell.v.includes("合计")) {
        rowStyle = styles.total;
      }
    }

    // 如果匹配到需要设置样式的行
    if (rowStyle) {
      // 对整行应用样式
      for (let col = 0; col < colCount; col++) {
        const targetCellAddress = XLSX.utils.encode_cell({
          c: col,
          r: row
        });
        const targetCell = ws[targetCellAddress];

        if (targetCell) {
          // 合并现有样式（如果有）与新样式
          targetCell.s = {
            ...(targetCell.s || {}),  // 保留现有样式
            ...rowStyle
          };
        } else {
          // 如果单元格不存在，创建新单元格并应用样式
          ws[targetCellAddress] = {
            t: 's', // 字符串类型
            v: '',  // 空值
            s: rowStyle
          };
        }
      }
    }
  }
}

//最后一行样式
function styleLastRow(ws) {
  // 红色背景  
  const redBackground = {
    fill: {
      fgColor: {
        rgb: "c00000"
      }
    }
  };
  // 白色字体  
  const whiteFont = {
    font: {
      color: {
        rgb: "FFFFFF"
      },
      sz: 11,
      name: 'Microsoft YaHei',
      bold: true
    }
  };
  // 蓝色背景  
  const blueBackground = {
    fill: {
      fgColor: {
        rgb: "c00000"  // Assume a different color for blue  
      }
    }
  };
  // 白色字体   
  const whiteblueFont = {
    font: {
      color: {
        rgb: "FFFFFF"
      },
      sz: 11,
      name: 'Microsoft YaHei',
      bold: true
    }
  };

  // 获取总行数  
  const rowCount = XLSX.utils.decode_range(ws['!ref']).e.r + 1; // Total rows (0-based index, so +1 to get actual count)  
  const colCount = XLSX.utils.decode_range(ws['!ref']).e.c; // Total columns  
  const lastRow = rowCount - 1; // Last row index  

  for (let col = 0; col <= colCount; col++) {
    const cellAddress = XLSX.utils.encode_cell({
      c: col,
      r: lastRow
    });
    const cell = ws[cellAddress];

    if (cell) {
      if (col < 8) { // I 列的索引是 8  
        // 应用红色背景  
        cell.s = {
          ...cell.s,
          ...redBackground,
          ...whiteFont
        };
      } else {
        // 应用蓝色背景  
        cell.s = {
          ...cell.s,
          ...blueBackground,
          ...whiteblueFont
        };
      }
    } else {
      // 如果单元格不存在，创建一个新的单元格并应用样式  
      if (col < 8) {
        ws[cellAddress] = {
          s: {
            ...redBackground,
            ...whiteFont
          }
        };
      } else {
        ws[cellAddress] = {
          s: {
            ...blueBackground,
            ...whiteblueFont
          }
        };
      }
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
    { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 80 },
    { wpx: 90 }, { wpx: 90 }, { wpx: 90 }, { wpx: 110 },
    { wpx: 120 }, { wpx: 90 }, { wpx: 110 }, { wpx: 100 }, { wpx: 100 }, { wpx: 90 }, { wpx: 90 }, { wpx: 90 } // 最后一列宽度为0（隐藏列）
  ];

  // 3. 设置行高（两种单位任选其一）

  // 方案A：使用像素单位（hpx）
  data['!rows'] = [
    { hpx: 35 },  // 第1行高度35像素
    { hpx: 28 },  // 第2行高度28像素
    { hpx: 28 }
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

  /* 
  // 方案B：使用磅值单位（hpt，1磅≈1/72英寸）
  data['!rows'] = [
    { hpt: 26 },  // 约35像素（1磅≈1.33像素）
    { hpt: 21 },  // 约28像素
    { hpt: 21 }   // 约28像素
  ];
  */
  // data['!rows'] = [
  //   { hpt: 35 },  // 约35像素（1磅≈1.33像素）
  //   { hpt: 28 },  // 约28像素
  //   { hpt: 28 }   // 约28像素
  // ];

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
          bold: true,
          name: 'Microsoft YaHei',          // 加粗
        },
        numFmt: "0"             // 数字格式（常规）
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
