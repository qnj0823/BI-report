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
    ['全国分公司(对赌)销售跟进表','全国分公司(对赌)销售跟进表','全国分公司(对赌)销售跟进表','全国分公司(对赌)销售跟进表','全国分公司(对赌)销售跟进表','全国分公司(对赌)销售跟进表','全国分公司(对赌)销售跟进表','全国分公司(对赌)销售跟进表','全国分公司(对赌)销售跟进表','全国分公司(对赌)销售跟进表'
      ,'全国分公司(对赌)销售跟进表','全国分公司(对赌)销售跟进表','全国分公司(对赌)销售跟进表','全国分公司(对赌)销售跟进表','全国分公司(对赌)销售跟进表','全国分公司(对赌)销售跟进表','全国分公司(对赌)销售跟进表','全国分公司(对赌)销售跟进表'
    ]
  ]
  let tabletitele = [
    '序号','战区','分公司', '总经理', '老品增幅', '老品增幅', '老品增幅', '老品增幅', '老品增幅', '光明椰子汁(10%)', '光明椰子汁(10%)', 
      '光明椰子汁(10%)', '光明椰子汁(10%)', '全品增幅', '全品增幅', '全品增幅', '全品增幅', '全品增幅'
    
  ]
  const tableTop = [ '序号','战区','分公司', '总经理', '老品对赌增幅', '同期老品', '累计达成', '老品増幅', '是否达标', '累计销售额',
    '椰子汁(万元)','占比','是否达标', '全品对赌增幅', '同期全品','累计达成','全品增幅','是否达标'
  ]
  tableData.push(tabletitele)
  tableData.push(tableTop)
  tableList.forEach(item => {
    tableData.push([item.pK_AREACL_NAME || '',item.cProductName || '',item.factory_name || '', item.simplename || '', item.cProductCode || '', item.oldbox1 || '', item.oldbox || '', item
      .oldrate || '', item.oldtite || '', item.totalorder || '', item.yzztotal || '', item.yzzrate || '', item.YZZtite || '', item.allproductvalue || '',
      item.Mallsum1 || '', item.Mallsum || '',item.totalrate || '',item.alltite || ''
    ])
  })
  let ws = XLSX.utils.aoa_to_sheet(tableData)

  mergeFirstThreeRows(ws); // 合并
  mergeDuplicateInFirstTwoRows(ws)
  setExcelStyle(ws) // 设置样式
  styleFirstTwoRows(ws)
  styleLastRow(ws)
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
//合并第几列单元格
function mergeFirstThreeRows(ws) {
  const mergeCells = []; // 保存合并单元格的信息  

  // 确保!merges数组存在  
  if (!ws['!merges']) {
    ws['!merges'] = [];
  }

  // 获取总列数  
  const colCount = XLSX.utils.decode_range(ws['!ref']).e.c + 1; // 获取最大列数  

  // 遍历所有列  
  for (let col = 0; col < colCount; col++) {
    const cell1 = ws[XLSX.utils.encode_cell({ c: col, r: 0 })]; // 第一行单元格  
    const cell2 = ws[XLSX.utils.encode_cell({ c: col, r: 1 })]; // 第二行单元格  
    const cell3 = ws[XLSX.utils.encode_cell({ c: col, r: 2 })]; // 第三行单元格  

    // 检查前三行的单元格是否相同  
    if (cell1 && cell2 && cell3 && cell1.v === cell2.v && cell1.v === cell3.v) {
      // 如果前三行的值相同，合并  
      mergeCells.push({
        s: {
          r: 0,
          c: col
        },
        e: {
          r: 2,
          c: col
        }
      });
    }
  }

  // 合并最后三列（第三行和第四行）  
  const lastThreeColsStart = colCount - 3; // 找到最后三列的起始列索引  
  for (let col = lastThreeColsStart; col < colCount; col++) {
    const cell2 = ws[XLSX.utils.encode_cell({ c: col, r: 2 })]; // 第三行单元格  
    const cell3 = ws[XLSX.utils.encode_cell({ c: col, r: 3 })]; // 第四行单元格  

    // 检查第二行和第三行的单元格是否相同  
    if (cell2 && cell3 && cell2.v === cell3.v) {
      // 如果第二行和第三行的值相同，合并  
      mergeCells.push({
        s: {
          r: 2,
          c: col
        },
        e: {
          r: 3,
          c: col
        }
      });
    }
  }
  // 合并前四列（第二行、第三行和第四行）  
  const firstFourColsCount = Math.min(4, XLSX.utils.decode_range(ws['!ref']).e.c + 1); // 找到前四列的总列数  
  for (let col = 0; col < firstFourColsCount; col++) {
    const cell2 = ws[XLSX.utils.encode_cell({ c: col, r: 1 })]; // 第二行单元格  
    const cell3 = ws[XLSX.utils.encode_cell({ c: col, r: 2 })]; // 第三行单元格  

    // 检查第二、第三和第四行的单元格是否相同  
    if (cell2 && cell3 && cell2.v === cell3.v) {
      // 如果第二、第三和第四行的值相同，合并  
      mergeCells.push({
        s: {
          r: 1,  // 起始行，第二行  
          c: col
        },
        e: {
          r: 2,  // 结束行，第四行  
          c: col
        }
      });
    }
  }
  // 合并从第12列到第15列（第三行和第四行）  
  const startCol = 10; // 第11列的索引（0-based）  
  const endCol = 14; // 第15列的索引（0-based）  

  for (let col = startCol; col <= endCol; col++) {
    const cell3 = ws[XLSX.utils.encode_cell({ c: col, r: 1 })]; // 第二行单元格  
    const cell4 = ws[XLSX.utils.encode_cell({ c: col, r: 3 })]; // 第四行单元格  

    // 检查第三行和第四行的单元格是否相同  
    if (cell3 && cell4 && cell3.v === cell4.v) {
      // 如果第三行和第四行的值相同，合并  
      mergeCells.push({
        s: {
          r: 1,  // 起始行，第三行  
          c: col
        },
        e: {
          r: 3,  // 结束行，第四行  
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
      name: "微软雅黑",
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
        rgb: "c00000" // 蓝色背景  
      }
    }
  };
  // 白色字体   
  const whiteblueFont = {
    font: {
      name: "微软雅黑",
      color: {
        rgb: "FFFFFF"
      },
      sz: 10,
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
          name: "微软雅黑",
          ...cell.s.font,
          sz: 15, // 字体大小设为12  
          bold: true
        }
      };
    } else {
      // 如果单元格不存在，创建新单元格并应用样式  
      ws[cellAddress] = {
        s: {
          font: {
            sz: 12, // 字体大小设为12  
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
        name: "微软雅黑",
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
        name: "微软雅黑",
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
        numFmt: "0"
      }
      data['!cols'] = [  
        { wpx: 70 }, { wpx: 70 }, { wpx: 70 }, { wpx: 70 },  
        { wpx: 70 }, { wpx: 70 }, { wpx: 70 },  
        { wpx:70 }, { wpx: 70 }, { wpx: 70 }, { wpx: 70 },  
        { wpx: 70 }, { wpx: 70 }, { wpx: 70 }, { wpx: 70 },  
        { wpx: 70 }, { wpx: 70 }, { wpx: 70 }, { wpx: 0 }  
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
