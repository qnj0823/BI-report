import * as XLSX from 'xlsx';  
import FileSaver from 'file-saver';  
import XLSXS from 'xlsx-style'

/**  
 * 导出数据到 Excel 文件，包含两个工作表。  
 * @param {Array} tableList - 第二个工作表的数据从表。  
 * @param {Array} tableList1 - 第一个工作表的数据主表。  
 * @param {Array} dataList - 第二个工作表的表头数据从表。  
 * @param {Array} dataList1 - 第一个工作表的表头数据主表。  
 * @param {String} fileName - 导出文件的名称。  
 */  
export function exportExcel(tableList, tableList1, dataList, dataList1, fileName) {  
  // 准备第一个工作表的数据  
  const tableData = [
    [
      ...dataList1.map(item => item.itemname) // 提取 itemname  
    ]
  ];
  // 提取 itemcode  
  const itemCodes = dataList1.map(item => item.itemcode);

  console.log(itemCodes);

  // tableList1.forEach(item => {
  //   tableData.push([item.custname || '', item.levelName2 || '', item.levelName3 || '', item.itemname || ''
  //   ])
  // })
  tableList1.forEach(item => {  
    const row = itemCodes.map(code => item[code] || '');  
    tableData.push(row);  
  });  

  // 创建第一个工作表  
  const ws1 = XLSX.utils.aoa_to_sheet(tableData);  
  setExcelStyle(ws1); // 设置样式  
  styleFirstTwoRows(ws1); // 设置前两行样式  

  // 准备第二个工作表的数据  
  const tableData1 = [
    [
      ...dataList.map(item => item.itemname) // 提取 itemname  
    ]
  ];
  // 提取 itemcode  
  const itemCodes1 = dataList.map(item => item.itemcode);

  console.log(itemCodes1);

  // tableList.forEach(item => {
  //   tableData1.push([item.cName || '', item.levelName2 || '', item.levelName3 || '', item.itemname || ''
  //   ])
  // })
  tableList.forEach(item => {  
    const row = itemCodes1.map(code => item[code] || '');  
    tableData1.push(row);  
  });  



  // 创建第二个工作表  
  const ws2 = XLSX.utils.aoa_to_sheet(tableData1);  
  setExcelStyle(ws2); // 设置样式  
  styleFirstTwoRows(ws2); // 设置前两行样式  

  // 创建一个新的工作簿  
  const wb = XLSX.utils.book_new();  
  
  // 将工作表添加到工作簿中  
  XLSX.utils.book_append_sheet(wb, ws1, '费用明细主表');  
  XLSX.utils.book_append_sheet(wb, ws2, '费用明细');  

  // 生成 Excel 文件  
  const wbout = XLSXS.write(wb, {  
    bookType: 'xlsx',  
    bookSST: false,  
    type: 'binary'  
  });  

  try {  
    FileSaver.saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), fileName);  
  } catch (e) {  
    console.error(e, wbout, '----->>>');  
  }  
}  

// 设置导出 Excel 样式   
function setExcelStyle(data) {  
  let borderAll = {  
    top: { style: "thin", color: { rgb: '000000' } },  
    bottom: { style: "thin", color: { rgb: '000000' } },  
    left: { style: "thin", color: { rgb: '000000' } },  
    right: { style: "thin", color: { rgb: '000000' } },  
  };  

  data['!cols'] = [  
    { wpx: 100 }, // 第一列宽度  
    { wpx: 100 }, // 第二列宽度  
    { wpx: 270 }, // 第三列宽度（如有需要，添加更多列的宽度）  
    { wpx: 200 }, // 第四列宽度  
    { wpx: 100 }, // 第二列宽度  
    { wpx: 100 }, // 第二列宽度  
    { wpx: 100 }, // 第二列宽度  
  ];  

  for (let key in data) {  
    if (data[key].constructor === Object) {  
      data[key].s = {  
        border: borderAll, // 添加边框  
        alignment: { horizontal: "center", vertical: "center" },  
        font: { sz: 10, bold: false, numFmt: "0" }  
      };  
    }  
  }  
}  

// 设置前两行样式  
function styleFirstTwoRows(ws) {  
  const redBackground = { fill: { fgColor: { rgb: "FF0000" } } }; // 红色背景  
  const whiteFont = { font: { color: { rgb: "FFFFFF" }, sz: 12, bold: true } }; // 白色字体  

  const rowCount = 1; // 处理前两行 (可以根据需求调整)  

  for (let row = 0; row < rowCount; row++) {  
    for (let col = 0; col <= XLSX.utils.decode_range(ws['!ref']).e.c; col++) {  
      const cellAddress = XLSX.utils.encode_cell({ c: col, r: row });  
      const cell = ws[cellAddress];  

      if (cell) {  
        // 应用样式  
        cell.s = { ...cell.s, ...redBackground, ...whiteFont };  
      } else {  
        // 创建新的单元格并应用样式  
        ws[cellAddress] = { s: { ...redBackground, ...whiteFont } };  
      }  
    }  
  }  
}  

// 将字符串转换为二进制字符串  
function s2ab(s) {  
  const buf = new ArrayBuffer(s.length);  
  const view = new Uint8Array(buf);  
  for (let i = 0; i < s.length; ++i) {  
    view[i] = s.charCodeAt(i) & 0xff;  
  }  
  return buf;  
}