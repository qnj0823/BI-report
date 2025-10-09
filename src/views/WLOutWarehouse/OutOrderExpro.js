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
    ['订单时间','订单号', '省区',  '客户名称',  '产品名称', '订单数', '单位','联系人','收货地址']
  ]
  tableList.forEach(item => {
    tableData.push([item.totalDate || '', item.orderoutNumber || '', item.areacl_name || '', item.cuName || '', item.pname || '', item.midCount || '', item.midUnit || '', item.creceiver || '', item.ireceiveaddress || ''
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
  // 1. 定义全边框样式（黑色细线）
  let borderAll = {
    top: { style: "thin", color: { rgb: '000000' } },    // 上边框
    bottom: { style: "thin", color: { rgb: '000000' } }, // 下边框
    left: { style: "thin", color: { rgb: '000000' } },   // 左边框
    right: { style: "thin", color: { rgb: '000000' } }   // 右边框
  }

  // 2. 初始化列宽设置
  data['!cols'] = [
    { wpx: 90 }, { wpx: 180 },{ wpx: 100 }, { wpx: 80 }, { wpx: 250 },
    { wpx: 90 }, { wpx: 90 }, { wpx: 90 }, { wpx: 350 },
    { wpx: 75 }, { wpx: 90 }, { wpx: 110 }, { wpx: 100 }, { wpx: 90 }, { wpx: 90 }, { wpx: 90 }, { wpx: 90 } // 最后一列宽度为0（隐藏列）
  ];

  // 3. 设置行高(两种单位任选其一)
  // for (let i = 0; i < this.sortedArray.length - 1; i++) {
  //   for (let j = 0; j < this.sortedArray.length - 1 - i; j++) {
  //     if (this.sortedArray[j] > this.sortedArray[j + 1]) {
  //       // 交换位置
  //       [this.sortedArray[j], this.sortedArray[j + 1]] = [this.sortedArray[j + 1], this.sortedArray[j]];
  //     }
  //   }
  // }

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


function s2ab(s) {
  var buf = new ArrayBuffer(s.length)
  var view = new Uint8Array(buf)
  for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
  return buf
}
