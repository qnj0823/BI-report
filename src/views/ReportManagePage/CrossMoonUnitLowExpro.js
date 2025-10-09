import * as XLSX from 'xlsx'
import FileSaver from 'file-saver'
import XLSXS from 'xlsx-style'

/**
 * 根据list进行导出
 * @param {Element} dom
 * @param {String} fileName
 */
export function exportExcel(tableList, date, fileName) {

  const selectedDate = new Date(date);
  const month = selectedDate.getMonth() + 1; // 获取月份（0-11，需要加 1）
  const year = selectedDate.getFullYear(); // 获取年份  
  const day = String(selectedDate.getDate()).padStart(2, '0');
  const labelText = `${year}年04月跨05月各单位体低温报单进度表`; // 如果没有选择日期，显示默认文本 
  console.log(month, year)

  let tableData = [
    [`${labelText}`, `${labelText}`, `${labelText}`, `${labelText}`, `${labelText}`, `${labelText}`, `${labelText}`, `${labelText}`,
    `${labelText}`, `${labelText}`, `${labelText}`, `${labelText}`, `${labelText}`, `${labelText}`, `${labelText}`, `${labelText}`, `${labelText}`, `${labelText}`
    ]
  ]
  const tableTitle = ['战区', '单位体', '负责人', '今日报单(低温)', `${year - 1}年${month}月销售数据`,'低温增幅', `${month}月低温任务`,'本月单数', `本月平均每单任务`,`当天单数`, `${month}月累计-低温系列(到货数)`, `${month}月累计-低温系列(到货数)`,
    `${month}月累计-低温系列(到货数)`, `${month}月累计-低温系列(到货数)`,`${month}月截止\n今日差额`, `${month}月累计\n差额`, `${month}月低温\n同比增幅`, `${month}月\n完成率`]
  const tablebop = ['战区', '单位体', '负责人', '今日报单(低温)', `${year - 1}年${month}月销售数据`,'低温增幅', `${month}月低温任务`,'本月单数', `本月平均每单任务`,`当天单数`, `LOOk系列`, `330/310系列`,`180系列`,
    `截止今日完成`, `${month}月截止\n今日差额`, `${month}月累计\n差额`, `${month}月低温\n同比增幅`, `${month}月\n完成率`]

  tableData.push(tableTitle)
  tableData.push(tablebop)
  tableList.forEach(item => {
    tableData.push([item.dqname || '', item.companyname || '', item.companyperson || '', item.box || '', item
      .yearbox || '', item.lowtempStan || '', item.lowTask || '', item.ordernum || '', item.averordernum || '',item.orderdaynum || '', item.lookbox || '',
    item.yezibox || '',item.box180 || '', item.Astoday || '', item.daydiff || '', item.Adddiff || '', item.rate || '', item.Accmplish || ''
    ])
  })
  let ws = XLSX.utils.aoa_to_sheet(tableData)

  const jsonData = XLSX.utils.sheet_to_json(ws);
  console.log(jsonData, 'jsonData')
  mergeSecondAndThirdRows(ws); // 合并
  mergeDuplicateInFirstTwoRows(ws)
  setExcelStyle(ws) // 设置样式
  styleFirstTwoRows(ws)
  styleLastRow(ws)
  styleRowsWithSubtotal(ws)//小计
  let wb = XLSX.utils.book_new()
  console.log(wb, 'wb')
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
  for (let row = 0; row < 3; row++) {
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

// 定义样式 
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
  const rowStart = 1; // 第二行的索引（0-based）  
  const rowCount = 2; // 处理的行数，总共处理三行（第二行到第四行）  
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

  // 处理第二行到第三行  
  for (let row = rowStart; row < rowStart + rowCount; row++) {
    for (let col = 0; col <= colCount; col++) {
      const cellAddress = XLSX.utils.encode_cell({
        c: col,
        r: row
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
            ...redBackground,
            ...whiteFont
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
              ...redBackground,
              ...whiteFont
            }
          };
        }
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
    { wpx: 90 }, { wpx: 150 }, { wpx: 80 }, { wpx: 80 },
    { wpx: 90 }, { wpx: 90 }, { wpx: 90 }, { wpx: 90 },
    { wpx: 75 }, { wpx: 90 }, { wpx: 110 }, { wpx: 100 }, { wpx: 90 }, { wpx: 90 }, { wpx: 90 }, { wpx: 90 } // 最后一列宽度为0（隐藏列）
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
