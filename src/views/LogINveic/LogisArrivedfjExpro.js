import * as XLSX from 'xlsx'
import FileSaver from 'file-saver'
import XLSXS from 'xlsx-style'

/**
 * 根据list进行导出
 * @param {Element} dom
 * @param {String} fileName
 */
export function exportExcelfj(tableList, date, fileName,gxtableList) {

  const selectedDate = new Date(date);
  const month = selectedDate.getMonth() + 1; // 获取月份（0-11，需要加 1）
  const year = selectedDate.getFullYear(); // 获取年份  
  const day = Number(String(selectedDate.getDate()).padStart(2, '0'));
  const labelText = `福建${month}.${day}到货明细`; // 如果没有选择日期，显示默认文本 
  console.log(month, year)

  let tableData = [
    [`${labelText}`, `${labelText}`, `${labelText}`, `${labelText}`, `${labelText}`, `${labelText}`, `${labelText}`, `${labelText}`,
    `${labelText}`, `${labelText}`, `${labelText}`, `${labelText}`, `${labelText}`, `${labelText}`, `${labelText}`, `${labelText}`, `${labelText}`, `${labelText}`, `${labelText}`, `${labelText}`, `${labelText}`, `${labelText}`, `${labelText}`
    ]
  ]
  const tableTitle = ['订单日期', '区域', '联系人', '电话', '大LOOK', '小LOOK', '健能', `LOOK优选`, '大白桃', `小白桃`, '大清新健爽（橙）', `小清新健爽（橙）`, `330椰子牛乳`, `310椰子牛乳`, `大0糖`,
    `小0糖`, '200鲜酪乳', '450鲜酪乳', '180健爽', '180红盒', `合计`, '地址', '备注']

  tableData.push(tableTitle)
  tableList.forEach(item => {
    tableData.push([item.startDate || '', item.wlSiteName || '', item.contacts || '', item.tel || '', item.box1520100001 || '', item.box1520100002 || '', item.box1520100004 || '', item
      .box1520100008 || '', item.box1520100010 || '', item.box1520100009 || '', item.box1520100014 || '', item.box1520100015 || '', item.box1520130001 || '', item.box1520130003 || '',
    item.box1520100017 || '', item.box1520100016 || '', item.box1520100052 || '', item.box1520100053 || '', item.box1520100051 || '', item.box1520100026 || '', item.sum || '', item.address || '', item.vnote || ''
    ])
  })
  let ws = XLSX.utils.aoa_to_sheet(tableData)

  // 准备第二个工作表的数据  
  const tableData1 = [
    ['区域', '联系人', '电话', '大LOOK', '小LOOK', '健能', `LOOK优选`, '大白桃', `小白桃`, '大清新健爽（橙）', `小清新健爽（橙）`, `330椰子牛乳`, `310椰子牛乳`, `大0糖`,
      `小0糖`, '200鲜酪乳', '450鲜酪乳', '180健爽', '180红盒', `合计`, '地址', '备注']
  ];
  gxtableList.forEach(item => {
    tableData1.push([ item.wlSiteName || '', item.contacts || '', item.tel || '', item.box1520100001 || '', item.box1520100002 || '', item.box1520100004 || '', item
      .box1520100008 || '', item.box1520100010 || '', item.box1520100009 || '', item.box1520100014 || '', item.box1520100015 || '', item.box1520130001 || '', item.box1520130003 || '',
    item.box1520100017 || '', item.box1520100016 || '', item.box1520100052 || '', item.box1520100053 || '', item.box1520100051 || '', item.box1520100026 || '', item.sum || '', item.address || '', item.vnote || ''
    ])
  })

  //创建第二个工作表  
  const ws2 = XLSX.utils.aoa_to_sheet(tableData1);
  setExcelStyletwo(ws2);
  styleRowsWithSubtotaltwo(ws2); // 设置样式  
  styleFirstTwoRowsTWO(ws2)
  // styleTotalRows(ws2);

  mergeSecondAndThirdRows(ws); // 合并
  mergeDuplicateInFirstTwoRows(ws)
  mergeDuplicateInFirstTwoRows1(ws)
  setExcelStyle(ws) // 设置样式
  styleFirstTwoRows(ws)
  styleLastRow(ws)
  styleRowsWithSubtotal(ws)//小计
  styleRowsWithSubtotal1(ws)
  // styleFirstTwoRows1(ws2)

  let wb = XLSX.utils.book_new()
  // 将工作表添加到工作簿中  
  XLSX.utils.book_append_sheet(wb, ws, '福建物流汇总表');
  XLSX.utils.book_append_sheet(wb, ws2, '放货明细表');


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

// 设置导出Excel样式 这里主要是关注单元格宽度
function setExcelStyletwo(data) {
  // 1. 定义全边框样式（黑色细线）
  let borderAll = {
    top: { style: "thin", color: { rgb: '000000' } },    // 上边框
    bottom: { style: "thin", color: { rgb: '000000' } }, // 下边框
    left: { style: "thin", color: { rgb: '000000' } },   // 左边框
    right: { style: "thin", color: { rgb: '000000' } }   // 右边框
  }

  // 2. 初始化列宽设置
  data['!cols'] = [
    calculateColumnWidth(data,'A'), { wpx: 120 }, { wpx: 100 }, { wpx: 90 },
    { wpx: 50.28 }, { wpx: 50.28 }, { wpx: 50.28 }, { wpx: 50.28 },
    { wpx: 50.28 }, { wpx: 50.28 }, { wpx: 50.28 }, { wpx: 50.28 }, { wpx: 50.28 }, { wpx: 50.28 }, { wpx: 50.28 }, { wpx: 50.28 }, { wpx: 50.28 }, { wpx: 50.28 }, { wpx: 50.28 }, { wpx: 50.28 }, calculateColumnWidth(data,'U'), { wpx: 100 } // 最后一列宽度为0（隐藏列）
  ];

  // 3. 设置行高（两种单位任选其一）

  // 方案A：使用像素单位（hpx）
  data['!rows'] = [
    { hpx: 35 },  // 第1行高度35像素
    { hpx: 35 },  // 第2行高度28像素
    { hpx: 25 },
    { hpx: 25 },
  ];
  // 4. 获取总行数（假设 data 是 SheetJS 的工作表对象）
  const rowCount = Object.keys(data)
    .filter(key => key.match(/^[A-Z]+\d+$/)) // 过滤有效单元格（如 "A1", "B2"）
    .map(key => parseInt(key.replace(/[A-Z]+/, ''))) // 提取行号（如 "A1" → 1）
    .reduce((max, rowNum) => Math.max(max, rowNum), 0); // 计算最大行号

  // 5. 设置剩余行高为16.5px（从第4行开始）
  for (let i = 4; i <= rowCount; i++) {
    data['!rows'][i - 1] = { hpx: 25 }; // 数组索引从0开始，所以 i-1
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
          // bold: true,
          name: 'Microsoft YaHei',          // 加粗
        },
        numFmt: "0"             // 数字格式（常规）
      }
    }
  }
}

// //特定行背景颜色
// 特定行背景颜色
function styleRowsWithSubtotaltwo(ws) {
  // 样式定义
  const styles = {
    // 总计行样式 - 浅绿色背景
    total: {
      fill: {
        type: 'pattern',
        patternType: 'solid',
        fgColor: { rgb: '9aba58' }  // 浅绿色
      },
      font: {
        color: { rgb: '000000' },  // 黑色字体
        name: 'Microsoft YaHei',
        sz: 11
      }
    }
  };

  // 获取工作表范围
  if (!ws['!ref']) return; // 如果没有数据范围，直接返回

  const range = XLSX.utils.decode_range(ws['!ref']);

  for (let row = range.s.r; row <= range.e.r; row++) {
    // 检查B列（索引1）
    const cellAddress = XLSX.utils.encode_cell({ c: 1, r: row });
    const cell = ws[cellAddress];

    // 检查是否为总计行
    if (cell && cell.v && typeof cell.v === 'string' && cell.v.includes('总计')) {
      // 对整行应用样式
      for (let col = range.s.c; col <= range.e.c; col++) {
        const targetCellAddress = XLSX.utils.encode_cell({ c: col, r: row });

        if (!ws[targetCellAddress]) {
          // 如果单元格不存在，创建空单元格
          ws[targetCellAddress] = { t: 's', v: '' };
        }

        // 应用样式
        ws[targetCellAddress].s = {
          ...(ws[targetCellAddress].s || {}),
          fill: styles.total.fill,
          font: {
            ...((ws[targetCellAddress].s && ws[targetCellAddress].s.font) || {}),
            ...styles.total.font
          }
        };
      }
    }
  }

  // 更新工作表范围（如果有新单元格被创建）
  if (ws['!ref']) {
    const updatedRange = XLSX.utils.decode_range(ws['!ref']);
    ws['!ref'] = XLSX.utils.encode_range(updatedRange);
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

function styleFirstTwoRowsTWO(ws) {
  // 红色背景  
  const redBackground = {
    fill: {
      fgColor: {
        rgb: "c00000" // 绿色背景 
      }
    }
  };
  // 白色字体  
  const whiteFont = {
    font: {
      color: {
        rgb: "ffffff"
      },
      sz: 12,
      name: 'Microsoft YaHei',
      bold: true
    }
  };

  // 确保工作表的行数足够  
  const rowIndex = 0; // 仅处理第二行（0-based索引）
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
          sz: 18, // 字体大小设为20  
          name: 'Microsoft YaHei',
          // bold: true
        }
      };
    } else {
      // 如果单元格不存在，创建新单元格并应用样式  
      ws[cellAddress] = {
        s: {
          font: {
            sz: 20, // 字体大小设为20  
            name: 'Microsoft YaHei',
            // bold: true
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

// 行合并  
function mergeDuplicateInFirstTwoRows(ws) {
  const mergeCells = []; // 保存合并单元格的信息  

  // 确保!merges数组存在  
  if (!ws['!merges']) {
    ws['!merges'] = [];
  }

  // 获取总列数和总行数
  const range = XLSX.utils.decode_range(ws['!ref']);
  const rowCount = range.e.r + 1;

  // 要处理的行（前两行和最后三行）
  const rowsToProcess = [rowCount - 1, rowCount - 2, rowCount - 3];

  // 遍历需要处理的行
  for (const row of rowsToProcess) {
    // 只处理前三列（0-2列）
    for (let col = 0; col < 4; col++) {  // 修改这里，只循环到第2列
      const cellAddress = XLSX.utils.encode_cell({ c: col, r: row });
      const cell = ws[cellAddress];

      if (cell) {
        const cellValue = cell.v;
        let startCol = col;

        // 检查后续单元格是否与当前单元格相同（不超过第2列）
        while (col + 1 < 4) {  // 修改这里，限制不超过第2列
          const nextCellAddress = XLSX.utils.encode_cell({ c: col + 1, r: row });
          const nextCell = ws[nextCellAddress];
          if (nextCell && nextCell.v === cellValue) {
            col++;
          } else {
            break;
          }
        }

        // 如果有多个相同的单元格，记录合并范围  
        if (col > startCol) {
          mergeCells.push({
            s: { r: row, c: startCol },
            e: { r: row, c: col }
          });
        }
      }
    }
  }

  // 添加合并信息到工作表  
  ws['!merges'] = ws['!merges'].concat(mergeCells);
}

function mergeDuplicateInFirstTwoRows1(ws) {
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
        rgb: "9aba58" // 绿色背景 
      }
    }
  };
  // 白色字体  
  const whiteFont = {
    font: {
      color: {
        rgb: "272727"
      },
      sz: 12,
      name: 'Microsoft YaHei',
      // bold: true
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
          sz: 18, // 字体大小设为20  
          name: 'Microsoft YaHei',
          // bold: true
        }
      };
    } else {
      // 如果单元格不存在，创建新单元格并应用样式  
      ws[cellAddress] = {
        s: {
          font: {
            sz: 20, // 字体大小设为20  
            name: 'Microsoft YaHei',
            // bold: true
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
      // bold: true
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
function styleRowsWithSubtotal1(ws) {
  // 样式定义
  const styles = {
    // 小计行样式 - 浅绿色背景
    subtotal: {
      fill: {
        fgColor: {
          rgb: "FFFF00"  // 浅绿色
        }
      },
      font: {
        color: {
          rgb: "000000"  // 黑色字体
        },
        name: 'Microsoft YaHei',
        sz: 11
      }
    },
    // 合计行样式 - 深绿色背景
    total: {
      fill: {
        fgColor: {
          rgb: "9aba58"  // 深绿色
        }
      },
      font: {
        color: {
          rgb: "000000"  // 黑色字体
        },
        name: 'Microsoft YaHei',
        sz: 11
      }
    },
    // 小于50的值 - 黄色背景
    lessThan50: {
      fill: {
        fgColor: {
          rgb: "FFFF00"  // 黄色
        }
      },
      font: {
        color: {
          rgb: "000000"  // 黑色字体
        },
        name: 'Microsoft YaHei',
        sz: 11
      }
    }
  };

  // 获取工作表范围
  const range = XLSX.utils.decode_range(ws['!ref']);
  const rowCount = range.e.r + 1; // 总行数
  const colCount = range.e.c + 1; // 总列数

  for (let row = 0; row < rowCount; row++) {
    // 1. 检查第二列（索引1）是否为小计/合计行
    const secondColCell = ws[XLSX.utils.encode_cell({ c: 1, r: row })];
    let rowStyle = null;

    if (secondColCell && secondColCell.v && typeof secondColCell.v === 'string') {
      if (secondColCell.v.includes("小计")) {
        rowStyle = styles.subtotal;
      } else if (secondColCell.v.includes("合计")) {
        rowStyle = styles.total;
      }
    }

    // 2. 从第三行开始检查P列（索引15）的值
    if (row >= 2) {  // 从第三行开始（索引2）
      const pColCell = ws[XLSX.utils.encode_cell({ c: 20, r: row })];  // P列是第16列，索引15

      if (pColCell) {
        // 尝试获取数值
        let value = pColCell.v;
        if (typeof value === 'string') {
          value = parseFloat(value.replace(/[^\d.-]/g, ''));
        }

        // 如果值小于50，应用黄色样式
        if (!isNaN(value) && value < 50) {
          pColCell.s = {
            ...(pColCell.s || {}),  // 保留现有样式
            ...styles.lessThan50
          };
        }
      }
    }

    // 3. 应用小计/合计行的整行样式
    if (rowStyle) {
      for (let col = 0; col < colCount; col++) {
        const targetCell = ws[XLSX.utils.encode_cell({ c: col, r: row })];
        if (targetCell) {
          targetCell.s = {
            ...(targetCell.s || {}),
            ...rowStyle
          };
        } else {
          ws[XLSX.utils.encode_cell({ c: col, r: row })] = {
            t: 's',
            v: '',
            s: rowStyle
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
          rgb: "9aba58"  // 浅绿色
        }
      },
      font: {
        color: {
          rgb: "000000"  // 黑色字体
        },
        name: 'Microsoft YaHei',
        sz: 11,
        // bold: true
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
        // bold: true
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
      // bold: true
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
      // bold: true
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
    { wpx: 100 }, calculateColumnWidth(data,'B'), { wpx: 100 }, { wpx: 160 },
    { wpx: 80 }, { wpx: 80 }, { wpx: 80 }, { wpx: 80 },
    { wpx: 80 }, { wpx: 80 }, { wpx: 80 }, { wpx: 80 }, { wpx: 80 }, { wpx: 80 }, { wpx: 80 }, { wpx: 80 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, calculateColumnWidth(data,'V') // 最后一列宽度为0（隐藏列）
  ];

  // 3. 设置行高（两种单位任选其一）

  // 方案A：使用像素单位（hpx）
  data['!rows'] = [
    { hpx: 35 },  // 第1行高度35像素
    { hpx: 35 },  // 第2行高度28像素
    { hpx: 25 },
    { hpx: 25 },
  ];
  // 4. 获取总行数（假设 data 是 SheetJS 的工作表对象）
  const rowCount = Object.keys(data)
    .filter(key => key.match(/^[A-Z]+\d+$/)) // 过滤有效单元格（如 "A1", "B2"）
    .map(key => parseInt(key.replace(/[A-Z]+/, ''))) // 提取行号（如 "A1" → 1）
    .reduce((max, rowNum) => Math.max(max, rowNum), 0); // 计算最大行号

  // 5. 设置剩余行高为16.5px（从第4行开始）
  for (let i = 4; i <= rowCount; i++) {
    data['!rows'][i - 1] = { hpx: 25 }; // 数组索引从0开始，所以 i-1
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
          // bold: true,
          name: 'Microsoft YaHei',          // 加粗
        },
        numFmt: "0"             // 数字格式（常规）
      }
    }
  }
}

// 计算宽度
function calculateColumnWidth(data,columnLetter) {
  let maxChars = 0;
  
  // 遍历指定列的所有单元格
  const columnRegex = new RegExp(`^${columnLetter}\\d+$`, 'i');
  Object.keys(data).forEach(key => {
    if (columnRegex.test(key)) {
      const cellValue = data[key].v;
      if (cellValue !== null && cellValue !== undefined) {
        const strValue = cellValue.toString();
        const charCount = getEffectiveLength(strValue);
        if (charCount > maxChars) {
          maxChars = charCount;
        }
      }
    }
  });
  
  // 计算宽度：每个字符10像素
  let width = maxChars * 8;
  return { wpx: width };
}

// 计算有效长度（中文算2个字符，英文算1个）
function getEffectiveLength(str) {
  let length = 0;
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    // 中文字符范围判断
    if (charCode >= 0x4E00 && charCode <= 0x9FA5) {
      length += 2;
    } else {
      length += 1;
    }
  }
  return length;
}


function s2ab(s) {
  var buf = new ArrayBuffer(s.length)
  var view = new Uint8Array(buf)
  for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
  return buf
}
