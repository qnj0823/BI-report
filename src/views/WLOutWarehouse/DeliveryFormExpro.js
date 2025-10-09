import ExcelJS from 'exceljs';

/**
 * 根据list进行导出
 * @param {Array} tableList 
 * @param {String} date 
 * @param {String} fileName 
 * @param {Array} tableList1 
 */
export async function exportExcel(tableList, date, fileName, tableList1) {
  const selectedDate = new Date(date);
  const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
  const year = selectedDate.getFullYear();
  const day = String(selectedDate.getDate()).padStart(2, '0');
  const labelText = `雨帆乳业（海南）股份有限公司海南常温产品发货通知单`;
  const timedate = `日期:${year}年${month}月${day}日`;
  const oddLable = tableList[0].orderoutMainNumber;
  const dislble = `${oddLable}`;
  const bottomLable = `发货说明：发货前请与客户联系约定收货时间`;
  const bottomLable1 = `收货信息：`;

  // 创建工作簿
  const workbook = new ExcelJS.Workbook();

  // 创建第一个工作表 - 总单
  const ws = workbook.addWorksheet('总单');

  // 添加数据到第一个工作表
  ws.addRow([`${labelText}`, `${labelText}`, `${labelText}`, `${labelText}`, `${labelText}`, `${labelText}`]);
  ws.addRow([`${timedate}`, `${timedate}`, `发货单号`, `发货单号`, `${dislble}`, `${dislble}`]);
  ws.addRow(['序号', '名称', '规格', '数量', `吨位`, `备注`]);

  tableList.forEach(item => {
    ws.addRow([
      item.sort || '',
      item.pname || '',
      item.midUnit || '',
      item.midCount || '',
      item.tong || '',
      item.box1520100010 || ''
    ]);
  });

  // ws.addRow(['', '', '', '', ``, '']);
  ws.addRow([`${bottomLable1}`, `${bottomLable1}`, `${bottomLable1}`, `${bottomLable1}`, `${bottomLable1}`, `${bottomLable1}`]);
  ws.addRow([`${bottomLable}`, `${bottomLable}`, `${bottomLable}`, `${bottomLable}`, `${bottomLable}`, `${bottomLable}`]);

  // 应用第一个工作表的样式
  applyFirstSheetStyles(ws);

  // 按客户分组
  const customerGroups = {};
  tableList1.forEach(item => {
    if (item.cuName == '合计') {
      return;
    }
    const cuName = item.cuName || '未知客户';
    if (!customerGroups[cuName]) {
      customerGroups[cuName] = [];
    }
    customerGroups[cuName].push(item);
  });

  // 为每个客户创建明细工作表
  let sheetIndex = 1;
  for (const cuName in customerGroups) {
    const customerData = customerGroups[cuName];
    const tableToptwo = `雨帆乳业（海南）股份有限公司送货单`;
    const dislbletwo = `${dislble}-${sheetIndex}`;

    const wsCustomer = workbook.addWorksheet(`明细表${sheetIndex}`);

    // 添加数据到客户工作表
    wsCustomer.addRow([`${tableToptwo}`, `${tableToptwo}`, `${tableToptwo}`, `${tableToptwo}`, `${tableToptwo}`, `${tableToptwo}`]);
    wsCustomer.addRow(['单据编号:', '单据编号:', '单据编号:', `${dislbletwo}`, `${dislbletwo}`, `${dislbletwo}`]);
    wsCustomer.addRow(['客户名称:', cuName, cuName, cuName, cuName, cuName]);
    wsCustomer.addRow(['客户地址:', '', '', '', '', '']);
    wsCustomer.addRow(['联系人:', '', '联系电话', '', '', '']);
    wsCustomer.addRow(['', '', '', '', '', '']);
    wsCustomer.addRow(['产品编码', '产品名称', '订单数量(箱)', '实发数量(箱)', '实收数量(箱)', `备注`]);

    customerData.forEach(item => {
      wsCustomer.addRow([
        item.pNo || '',
        item.pname || '',
        item.midCount || '',
        item.detailinfo || '',
        item.detailinfo || '',
        item.dewewew || ''
      ]);
    });

    // wsCustomer.addRow(['', '', '', '', '', '']);
    wsCustomer.addRow(['送货单位(送货人)', '', '送货日期', '', '', '']);
    wsCustomer.addRow(['收货单位(收货人)', '', '收货日期', '', '', '']);

    // 应用客户工作表的样式
    applyCustomerSheetStyles(wsCustomer);

    sheetIndex++;
  }

  // 导出Excel
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer], { type: "application/octet-stream" }), fileName);
}

// 辅助函数 - 保存文件
function saveAs(blob, filename) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 应用第一个工作表的样式
function applyFirstSheetStyles(ws) {
  // 设置列宽
  ws.columns = [
    { width: 4.92 }, { width: 53 }, { width: 7 },
    { width: 7 }, { width: 7 }, { width: 14.7 }
  ];

  // 设置行高
  ws.getRow(1).height = 45;
  ws.getRow(2).height = 32;
  ws.getRow(3).height = 28;

  // ws.getRow(8).hidden = true

  // 设置第4行及以后的行高为25
  for (let i = 4; i <= ws.rowCount; i++) {
    ws.getRow(i).height = 25;
  }

  // 设置所有行的默认样式
  ws.eachRow(row => {
    row.eachCell(cell => {
      cell.border = {
        top: { style: 'thin', color: { argb: '000000' } },
        left: { style: 'thin', color: { argb: '000000' } },
        bottom: { style: 'thin', color: { argb: '000000' } },
        right: { style: 'thin', color: { argb: '000000' } }
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
        // wrapText: true,
        shrinkToFit: true
      };
      cell.font = {
        name: 'Microsoft YaHei',
        size: 12,
        bold: true
      };
    });
  });

  // 合并第一行单元格
  ws.mergeCells(`A1:F1`);

  // 合并第二行相关单元格
  ws.mergeCells(`A2:B2`);
  ws.mergeCells(`C2:D2`);
  ws.mergeCells(`E2:F2`);

  // 合并最后两行的相关单元格
  const lastRow = ws.rowCount;
  // ws.mergeCells(`A${lastRow - 2}:F${lastRow - 2}`);
  ws.mergeCells(`A${lastRow - 1}:F${lastRow - 1}`);
  ws.mergeCells(`A${lastRow}:F${lastRow}`);

  // 第一行特殊样式
  ws.getRow(1).eachCell(cell => {
    cell.font = {
      name: 'Microsoft YaHei',
      size: 16,
      bold: true
    };
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
      shrinkToFit: true
    };
  });

  // 第二行特殊样式
  ws.getRow(2).eachCell((cell, colNumber) => {
    if (colNumber <= 2) { // A-B列
      cell.alignment = {
        horizontal: 'left',
        vertical: 'middle',
        shrinkToFit: true
      };
    } else if (colNumber >= 5) { // E-F列
      cell.font = {
        name: 'Microsoft YaHei',
        size: 14,
        bold: true,
        color: { argb: 'FF0000' }
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
        shrinkToFit: true
      };
    }
  });

  // 最后两行特殊样式
  for (let i = ws.rowCount - 1; i <= ws.rowCount; i++) {
    ws.getRow(i).eachCell(cell => {
      cell.alignment = {
        horizontal: 'left',
        vertical: 'middle',
        shrinkToFit: true
      };
      cell.font = {
        name: 'Microsoft YaHei',
        size: 12,
        bold: true,
        color: { argb: 'FF0000' }
      };
      cell.border = {};
    });
  }
}

// 应用客户工作表的样式
function applyCustomerSheetStyles(ws) {
  // 设置列宽
  ws.columns = [
    { width: 12.78 }, { width: 40.16}, { width: 9 },
    { width:  9 }, { width:  9 }, { width: 14.3 }
  ];

  // 设置行高
  ws.getRow(1).height = 37;
  ws.getRow(2).height = 32;
  ws.getRow(3).height = 29;
  ws.getRow(4).height = 29;
  ws.getRow(5).height = 29;
  ws.getRow(6).height = 19;
  ws.getRow(7).height = 29;

  // ws.getRow(9).hidden = true

  // 设置第8行及以后的行高为25
  for (let i = 8; i <= ws.rowCount; i++) {
    ws.getRow(i).height = 25;
  }


  // 设置所有行的默认样式
  ws.eachRow(row => {
    row.eachCell(cell => {
      cell.border = {
        top: { style: 'thin', color: { argb: '000000' } },
        left: { style: 'thin', color: { argb: '000000' } },
        bottom: { style: 'thin', color: { argb: '000000' } },
        right: { style: 'thin', color: { argb: '000000' } }
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
        // wrapText: true
        shrinkToFit: true
      };
      cell.font = {
        name: 'Microsoft YaHei',
        size: 11,
        bold: true
      };
    });
  });

  // 合并第一行单元格
  ws.mergeCells(`A1:F1`);

  // 合并第二行相关单元格
  ws.mergeCells(`A2:C2`);
  ws.mergeCells(`D2:F2`);
  ws.mergeCells(`A6:F6`);

  // 合并客户信息行
  ws.mergeCells(`B3:F3`);
  ws.mergeCells(`B4:F4`);
  ws.mergeCells(`D5:F5`);

  // 合并最后三行的相关单元格
  const lastRow = ws.rowCount;
  // ws.mergeCells(`A${lastRow - 2}:F${lastRow - 2}`); // 倒数第三行的D-F列合并
  ws.mergeCells(`D${lastRow - 1}:F${lastRow - 1}`); // 倒数第二行的D-F列合并
  ws.mergeCells(`D${lastRow}:F${lastRow}`);         // 最后一行的D-F列合并

  // 第一行特殊样式
  ws.getRow(1).eachCell(cell => {
    cell.font = {
      name: 'Microsoft YaHei',
      size: 14,
      bold: true
    };
  });

  // 第二行特殊样式
  ws.getRow(2).eachCell((cell, colNumber) => {
    if (colNumber <= 3) { // A-C列
      cell.alignment = { horizontal: 'right', vertical: 'middle' };
    } else if (colNumber >= 4) { // D-F列
      cell.font = {
        name: 'Microsoft YaHei',
        size: 11,
        bold: true,
        color: { argb: 'FF0000' }
      };
    }
  });

  // 最后两行特殊样式
  for (let i = ws.rowCount - 1; i <= ws.rowCount; i++) {
    ws.getRow(i).eachCell(cell => {
      cell.alignment = { horizontal: 'center', vertical: 'middle',  shrinkToFit: true };
      cell.font = {
        name: 'Microsoft YaHei',
        size: 11,
        bold: true
      };
      cell.border = {};
    });
  }
}