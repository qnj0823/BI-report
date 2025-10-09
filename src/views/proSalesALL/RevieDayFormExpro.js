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
    ['战区','省区', '分公司/办事处', '客户营业执照', '站点','报单时间', '大原味', '小原味', '优选原味', '小原味（戴永红定制）', '小原味（绿叶定制）', '大白桃', '小白桃',
      '大清新', '小清新', '450清新', '大健爽', '小健爽', '大0糖', '小0糖', '蓝色健爽', '健能', '姜黄', '330', '310', '180酸乳酪(白）', '180酸乳酪(红）', '1L椰子牛乳', '1L椰子牛乳(定制款）', '950常温(常规版）', '950常温(宴席版）',
      '300常温(宴席版）', '300常温(经典版）', '380橙汁', '1.35橙汁', '380双柚汁', '1.35双柚汁', '245椰子汁', '1L椰子汁', '300椰子汁', '1.25L红瓶椰子汁', '300礼盒椰子汁', '300小青柠汁', '900小青柠汁', '300苹果汁', '900苹果汁', '300芒果菠萝汁', '900芒果菠萝汁', '其它', '小计'
    ]
  ]
  tableList.forEach(item => {
    tableData.push([item.nAME || '', item.sqname || '',item.ocustomerClass_name || '',item.cname || '',item.cSiteName || '',item.vouchdate || '', item.bigyuanwei || '', item.smallyuanwei || '', item.yxyuanwei || '', item.xyuanweidyh || '', item
      .xyuanweily || '', item.dbt || '', item.xbt || '', item.dqx || '', item.xqx || '', item.qinxi450 || '', item.djs || '',
      item.xjs || '', item.dlt || '',item.xlt || '',item.lsjs || '',item.jn || '',item.jh || '',item.yz330|| '',item.yz310|| '',item.snnb180|| '',item.snnred180|| '',item.lyznr1|| '',item.lyznrdz1|| '',
      item.cgb970|| '',item.yxb970|| '',item.yxb300|| '',item.jdb300|| '',item.cz380|| '',item.cz135|| '',item.syz380|| '',item.syz135|| '',item.yzz245|| '',item.lyzz1|| '',item.yzz300|| '',item.hpyzz125|| '',item.lkyzz300|| '',
      item.xqn300|| '',item.xqn900|| '',item.pgz300|| '',item.pgz900|| '',item.mgbl300|| '',item.mgbl900|| '',item.Qtnmer|| '',item.sum|| ''
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
      }, // 第二列宽度为150像素
      {
        wpx: 100
      }, // 第二列宽度为150像素
      {
        wpx: 100
      }, // 第二列宽度为150像素
      {
        wpx: 100
      }, // 第二列宽度为150像素
      {
        wpx: 100
      }, // 第二列宽度为150像素
      {
        wpx: 100
      }, // 第二列宽度为150像素
      {
        wpx: 100
      }, // 第二列宽度为150像素

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
