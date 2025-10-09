import * as XLSX from 'xlsx'
import FileSaver from 'file-saver'
import XLSXS from 'xlsx-style'

/**
 * 根据list进行导出
 * @param {Element} dom
 * @param {String} fileName
 */
export function exportExcel(tableList, fileName) {
  let tablelable = [['净销售明细表', '净销售明细表', '净销售明细表', '净销售明细表', '净销售明细表', '净销售明细表', '净销售明细表', '净销售明细表', '净销售明细表', '净销售明细表', '净销售明细表', '净销售明细表', '净销售明细表', '净销售明细表', '净销售明细表', '净销售明细表', '净销售明细表', '净销售明细表', '净销售明细表', '净销售明细表', '净销售明细表', '净销售明细表']]

  const tableTop = ['订单日期', '订单号', '客户', '战区', '销量区域', '客户分类', '客户站点', '商品分类', '产品简称',
    '商品属性', '商品编码', '商品名称', '订单销售数量', '销售单位', '含税单价', '订单总金额\n(含折扣)', '返利分摊\n金额', '市场费用返\n利分摊金额', '折扣后\n订单金额', '搭赠数量', '费用补助数量', '净销量数量'
  ]

  tablelable.push(tableTop)

  tableList.forEach(item => {
    tablelable.push([item.vouchdate || '', item.cOrderNo || '', item.cName || '', item.levelName1 || '', item.levelName2 || '', item.ocustomerClass_name || '', item.cSiteName || '', item
      .product_class_name || '', item.simplename || '', item.attribute || '', item.cProductCode || '', item.cProductName || '', item.box || '',
    item.cProductAuxUnitName || '', item.nqtorigtaxprice || '', item.test01 || '', item.norigdiscount || '', item.fOrderRebateMoney || '', item.norigtaxmny || '', item.giftbox || '', item.costsubs || '', item.netsalesvolume || ''

    ])
  })
  let ws = XLSX.utils.aoa_to_sheet(tablelable)

  // mergeFirstThreeRows(ws); // 合并
  mergeSecondAndThirdRows(ws)
  mergeVColumnCells(ws)
  mergeDuplicateInFirstTwoRows(ws)
  setExcelStyle(ws) // 设置样式
  styleFirstTwoRows(ws)
  // styleLastRow(ws)
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

function mergeVColumnCells(ws) {
  // 确保 !merges 数组存在
  if (!ws['!merges']) {
    ws['!merges'] = [];
  }

  const targetCol = 21; // V列的索引（0-based）
  const range = XLSX.utils.decode_range(ws['!ref']);
  const maxRow = range.e.r; // 获取最大行数

  let startMergeRow = 0; // 合并起始行
  let currentValue = null; // 当前单元格的值

  // 遍历V列的所有行
  for (let row = 0; row <= maxRow; row++) {
    const cellAddress = XLSX.utils.encode_cell({ c: targetCol, r: row });
    const cell = ws[cellAddress];
    const cellValue = cell ? cell.v : undefined;

    // 如果当前值与前一个不同，则合并之前的连续相同值
    if (cellValue !== currentValue) {
      // 如果存在待合并的区域（连续相同值超过1行）
      if (startMergeRow < row - 1) {
        ws['!merges'].push({
          s: { r: startMergeRow, c: targetCol }, // 合并起始行
          e: { r: row - 1, c: targetCol }       // 合并结束行
        });
      }
      startMergeRow = row; // 更新合并起始行
      currentValue = cellValue; // 更新当前值
    }
  }

  // 处理最后一组连续相同值
  if (startMergeRow < maxRow) {
    ws['!merges'].push({
      s: { r: startMergeRow, c: targetCol },
      e: { r: maxRow, c: targetCol }
    });
  }
}
//合并O列P列
function mergeColumns(ws) {
  const mergeCells = []; // 保存合并单元格的信息  

  // 确保 !merges 数组存在  
  if (!ws['!merges']) {
    ws['!merges'] = [];
  }

  // 设置要合并的列索引（O列和P列）  
  const columnsToMerge = [15, 18, 19]; // O列索引和P列索引  
  const colB = 1; // B列索引  

  // 获取行数  
  const rowCount = XLSX.utils.decode_range(ws['!ref']).e.r + 1; // 总行数  

  // 遍历所有行，从第二行开始  
  for (let row = 1; row < rowCount; row++) {
    const cellB = ws[XLSX.utils.encode_cell({ c: colB, r: row })]; // 获取B列的当前单元格  

    // 跳过空的B列单元格  
    if (!cellB) {
      continue;
    }

    // 在当前行后查找与当前B列值相同的行数  
    let startRow = row;
    let endRow = row;
    while (endRow + 1 < rowCount) {
      const nextCellB = ws[XLSX.utils.encode_cell({ c: colB, r: endRow + 1 })]; // 获取下一行B列的单元格  
      if (nextCellB && nextCellB.v === cellB.v) {
        endRow++; // 如果下一行的B列值相同，继续往下查找  
      } else {
        break; // 否则停止  
      }
    }

    // 只在B列值相同时进行O列和P列的合并操作  
    if (endRow > startRow) {
      columnsToMerge.forEach(colIndex => {
        // 合并O列或P列  
        for (let currentRow = startRow; currentRow <= endRow; currentRow++) {
          const cell = ws[XLSX.utils.encode_cell({ c: colIndex, r: currentRow })];

          // 跳过值为0的单元格或为空的单元格  
          if (!cell || cell.v == 0) {
            continue;
          }

          // 记录合并范围  
          if (currentRow == startRow) {
            mergeCells.push({
              s: { r: startRow, c: colIndex },
              e: { r: endRow, c: colIndex }
            });
          }
        }
        // 跳到合并的最后一行  
        row = endRow;
      });
    }
  }

  // 添加合并信息到工作表  
  mergeCells.forEach(range => {
    ws['!merges'].push(range);
  });
}

//合并第二第三列单元格
function mergeSecondAndThirdRows(ws) {
  const mergeCells = []; // 保存合并单元格的信息  

  // 确保 !merges 数组存在  
  if (!ws['!merges']) {
    ws['!merges'] = [];
  }

  // 获取总列数  
  const colCount = XLSX.utils.decode_range(ws['!ref']).e.c + 1; // 获取最大列数  

  // 遍历所有列  
  for (let col = 0; col < colCount; col++) {
    const cell2 = ws[XLSX.utils.encode_cell({ c: col, r: 1 })]; // 第二行单元格  
    const cell3 = ws[XLSX.utils.encode_cell({ c: col, r: 2 })]; // 第三行单元格                           

    // 检查第二和第三行的单元格是否相同  
    if (cell2 && cell3 && cell2.v === cell3.v) {
      // 如果第二行和第三行的值相同，合并  
      mergeCells.push({
        s: {
          r: 1,
          c: col
        },
        e: {
          r: 2,
          c: col
        }
      });
    }
  }

  // 添加合并信息到工作表  
  mergeCells.forEach(range => {
    ws['!merges'].push(range);
  });
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

// 定义样式 
function styleFirstTwoRows(ws) {
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
      sz: 10,
      bold: true
    }
  };
  // 蓝色背景  
  const blueBackground = {
    fill: {
      fgColor: {
        rgb: "c00000"
      }
    }
  };
  // 白色字体 
  const whiteblueFont = {
    font: {
      color: {
        rgb: "FFFFFF"
      },
      sz: 10,
      bold: true
    }
  };
  // 确保工作表的行数足够  
  const rowCount = 2; // 只处理前两行  
  const colCount = XLSX.utils.decode_range(ws['!ref']).e.c; // 获取列的总数  

  for (let row = 0; row < rowCount; row++) {
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
      sz: 10,
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
      sz: 10,
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
  let borderAll = {
    //单元格外侧框线
    top: {
      style: "thin",
      color: {
        rgb: '000000'
      }
    },
    bottom: {
      style: "thin",
      color: {
        rgb: '000000'
      }
    },
    left: {
      style: "thin",
      color: {
        rgb: '000000'
      }
    },
    right: {
      style: "thin",
      color: {
        rgb: '000000'
      }
    },
  }
  data['!cols'] = []
  for (let key in data) {
    if (data[key].constructor === Object) {
      data[key].s = {
        border: borderAll, // 边框
        alignment: {
          horizontal: "center", //水平左对齐
          vertical: "center", // 垂直居中
          wrapText: true,
        },
        font: {
          sz: 10,
        },
        bold: true,
        numFmt: "0.00"
      }
      data['!cols'] = [
        { wpx: 60 }, { wpx: 100 }, { wpx: 130 }, { wpx: 100 }, { wpx: 100 },
        { wpx: 100 }, { wpx: 100 }, { wpx: 70 }, { wpx: 70 }, { wpx: 70 },
        { wpx: 70 }, { wpx: 120 }, { wpx: 70 }, { wpx: 70 }, { wpx: 100 },
        { wpx: 70 }, { wpx: 70 }, { wpx: 70 }, { wpx: 100 }
      ];   // 单元格宽度
    }

  }
}


function s2ab(s) {
  var buf = new ArrayBuffer(s.length)
  var view = new Uint8Array(buf)
  for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
  return buf
}
