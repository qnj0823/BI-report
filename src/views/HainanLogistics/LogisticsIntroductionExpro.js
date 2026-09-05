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
    ['发货日期', '一级组织', '二级组织', '三级组织', '区域', '合计-件', '合计-吨', '950G常温噜渴', '950G常温噜渴(宴席）', '300G常温噜渴', '300ML常温噜渴(宴席)', '1L椰子牛乳', '300ML姜黄', '380ML双柚汁', '1.35ML双柚汁', '380ML橙汁', '1.35ML橙汁', '380ML椰子水', '1L椰子水', '900M菠萝芒果', '300ML菠萝芒果', '900ML苹果汁', '300ML苹果汁', '300G芦荟汁', '300G山楂汁', '1L噜渴椰汁', '1.25L噜渴椰汁（宴席）', '1.25L噜渴椰汁', '300ML噜渴椰汁', '245ML噜渴椰汁', '280G常温噜渴', '185ML常温噜渴(线下)', '185ML常温噜渴(线上)', '720g常温噜渴', '1.25L常温噜渴']
  ]
  tableList.forEach(item => {
    tableData.push([
      item.planDeliveryDate || '',
      item.orgLevel1 || '',
      item.orgLevel2 || '',
      item.orgLevel3 || '',
      item.region || '',
      item.totalQuantity || '',
      item.totalWeightTon || '',
      item.product950gLuche || '',
      item.product950gLucheBanquet || '',
      item.product300gLuche || '',
      item.product300mlLucheBanquet || '',
      item.product1lCoconutMilk || '',
      item.product300mlcurcuma || '',
      item.product380mlDoublePlum || '',
      item.product135lDoublePlum || '',
      item.product380mlOrange || '',
      item.product135lOrange || '',
      item.product380mlCoconutWater || '',
      item.product1lCoconutWater || '',
      item.product900mlPineappleMango || '',
      item.product300mlPineappleMango || '',
      item.product900mlApple || '',
      item.product300mlApple || '',
      item.product300gAloe || '',
      item.product300gHawthorn || '',
      item.product1lLucheCoconut || '',
      item.product125lLucheCoconutBanquet || '',
      item.product125lLucheCoconut || '',
      item.product300mlLucheCoconut || '',
      item.product245mlLucheCoconut || '',
      item.product280gLuche || '',
      item.product185mlLucheOffline || '',
      item.product185mlLucheOnline || '',
      item.product720gLuche || '',
      item.product125lLuche || ''
    ])
  })
  let ws = XLSX.utils.aoa_to_sheet(tableData)
  console.log(ws, 'ws')
  setExcelStyle(ws) // 设置样式
  styleFirstTwoRows(ws)
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
        wpx: 100
      }, // 第一列宽度为100像素
      {
        wpx: 100
      }, // 第二列宽度为150像素
      {
        wpx: 100
      }, // 第三列宽度为80像素
      {
        wpx: 100
      }, // 第四列宽度为80像素
      {
        wpx: 100
      }, // 第四列宽度为80像素
      {
        wpx: 100
      }, // 第四列宽度为80像素
      {
        wpx: 100
      }, // 第四列宽度为80像素
      {
        wpx: 100
      }, // 第四列宽度为80像素
      ]
      // 单元格宽度
    }
  }
}

//第一行样式
function styleFirstTwoRows(ws) {
  // 定义样式
  const redBackground = {
    fill: {
      fgColor: {
        rgb: "FF0000"
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
