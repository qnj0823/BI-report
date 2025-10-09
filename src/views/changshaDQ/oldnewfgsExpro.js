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
    ['销售区域/省区', '分公司/办事处', '老品','老品百分比','新品','新品百分比', '其它', '其他百分比', '小计']
  ]
  tableList.forEach(item => {
    tableData.push([item.iParentName || '',item.ocustomerClass_name || '', item.oldbox || '', item.oldrate || '', item.newbox || '',item.newrate || '',item.otherbox || '',item.otherrate || '',item.allbox || ''
    ])
  })
  let ws = XLSX.utils.aoa_to_sheet(tableData)
  console.log(ws, 'ws')
  setExcelStyle(ws) // 设置样式
  styleLastRow(ws)
  styleFirstTwoRows(ws)
  // mergeColumns(ws, 0); // 合并L列
  // mergeColumns(ws, 3); // 合并L列
  // mergeColumns(ws, 6); // 合并L列
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
        },
        font: {
          sz: 10,
        },
        bold: true,
        numFmt: "0"
      }
      // data["!cols"].push({
      //   wpx: 230
      // });
      data['!cols'] = [{
        wpx: 200
      }, // 第一列宽度为100像素
      {
        wpx: 120
      }, // 第二列宽度为150像素
      {
        wpx: 120
      }, // 第三列宽度为80像素
      {
        wpx: 160
      }, // 第四列宽度为80像素
      {
        wpx: 160
      }, // 第五列宽度为80像素
      {
        wpx: 160
      }, // 第六列宽度为80像素
      ]
      // 单元格宽度
    }
  }
}
//合并
function mergeColumns(ws, colIndex) {
  const mergeCells = []; // 保存合并单元格的信息

  let currentValue = null; // 当前值
  let startRow = null; // 合并的起始行

  // 确保!merges数组存在
  if (!ws['!merges']) {
    ws['!merges'] = [];
  }

  // 获取总行数
  const rowCount = ws['!ref'].split(':')[1].replace(/[A-Z]/g, ''); // 获取最大行数

  // 遍历指定列
  for (let row = 1; row < rowCount; row++) {
    const cell = ws[XLSX.utils.encode_cell({
      c: colIndex,
      r: row
    })]; // 获取当前列的单元格

    if (cell && cell.v === currentValue) {
      // 当前单元格的值与前一个相同，继续
      continue;
    }

    if (currentValue !== null && startRow !== null) {
      // 合并范围
      mergeCells.push({
        s: {
          r: startRow,
          c: colIndex
        },
        e: {
          r: row - 1,
          c: colIndex
        }
      });
    }

    // 更新当前值和起始行
    currentValue = cell ? cell.v : null;
    startRow = row; // 更新起始行
  }

  // 处理最后一组合并
  if (currentValue !== null && startRow !== null) {
    mergeCells.push({
      s: {
        r: startRow,
        c: colIndex
      },
      e: {
        r: rowCount - 1,
        c: colIndex
      }
    });
  }

  // 添加合并信息到工作表
  mergeCells.forEach(range => {
    ws['!merges'].push(range);
  });
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


function s2ab(s) {
  var buf = new ArrayBuffer(s.length)
  var view = new Uint8Array(buf)
  for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
  return buf
}
