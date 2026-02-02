<template>
    <div class='Deliver'>
        <el-form :inline="true" style="margin-top: 10px;" :model="dataForm" @submit.native.prevent>
            <el-form-item>
                <el-date-picker v-model="dataForm.p_vouchdatestart" value-format="yyyy-MM-dd" type="date"
                    placeholder="开始日期" clearable style="width: 100%"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-date-picker v-model="dataForm.p_vouchdateend" value-format="yyyy-MM-dd" type="date"
                    placeholder="结束日期" clearable style="width: 100%"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-form-item>
                    <el-input v-model="bullay" placeholder="模糊搜索" clearable @keyup.enter.native="searchEnterFun()"
                        ref="searchInput"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
                        @click="getDataList">查询</el-button>
                </el-form-item>
                <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                    @click="exportData">导出</el-button>
                <el-button size="mini" class="filter-item" type="success" @click="Shippend">已发货</el-button>
            </el-form-item>
        </el-form>
        <el-table border ref="table" v-loading="dataListLoading" :data="dataList" style="width: 100%;"
            :span-method="(data) => objectSpanMethod(data, dataList)" @select="handleSelect"
            @selection-change="handleSelectionChange">
            <el-table-column :selectable="(row) => !(row.orderoutNumber == '合计') && !(row.orderoutNumber == '小计')"
                :show-overflow-tooltip="true" type="selection" width="55" />
            <el-table-column :show-overflow-tooltip="true" align="center" width="180" prop="orderoutMainNumber"
                label="主单号" />
            <el-table-column :show-overflow-tooltip="true" align="center" width="60" prop="sort" label="序号" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="orderoutNumber" label="单据编号" />
            <el-table-column :show-overflow-tooltip="true" align="center" width="190" prop="cuName" label="客户名称" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="csitename" label="客户站点" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="pNo" label="产品编码" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="pname" label="产品名称" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="creceiver" label="联系人" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100001" label="联系电话" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="ireceiveaddress" label="地址" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="midUnit" label="规格" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="midCount" label="数量" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="tong" label="吨位" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="createdate" label="创建时间" />
            <el-table-column header-align="center" align="center" width="150" label="操作">
                <template slot-scope="scope">
                    <el-button type="text"
                        v-if="!(scope.row.orderoutNumber == '合计') && !(scope.row.orderoutNumber == '小计')" size="small"
                        v-show="scope.row.issend != 1"
                        @click="addOrUpdateHandle(scope.row.orderoutMainNumber, scope.row)">确认发货</el-button>
                    <!-- <el-button type="text"
                        v-if="!(scope.row.orderoutNumber == '合计') && !(scope.row.orderoutNumber == '小计')" size="small"
                        v-show="scope.row.issend != 1"
                        @click="deleteHandle(scope.row.orderoutMainNumber, scope.row)">删除</el-button> -->
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import * as api from '@/api/WLOutWarehouseAPI/WLOutWarehouse.js'
import * as oapi from '@/api/frame/customer.js'
import {
    exportExcel
} from './DeliveryFormExpro.js'
export default {
    name: 'Deliver-page',
    data() {
        return {
            msg: 'Deliver-page',
            dataList: [],
            siteList: [],
            year: '',
            month: '',
            day: '',
            bullay: '',
            dataListLoading: false,
            dataForm: {
                p_vouchdatestart: '',
                p_vouchdateend: ''
            },
            proList: [],
            dataForm1: {
                page: 0,
                size: 200,
                sort: '',
            },
            ptsForm: {
                mainorderno: '',
            },
            delForm: {
                orderout_main_number: ''
            },
            select: [],
            selectoud: []

        };
    },
    created() {
        this.calculateDates();
    },
    mounted() {
        this.getDataList()
    },
    methods: {
        addOrUpdateHandle(odd, data) {
            this.ptsForm.mainorderno = odd
            api.APIorderissend(this.ptsForm).then(res => {
                this.getDataList()
                this.$message.success('已成功发货')

            })
        },
        deleteHandle(odd, data) {
            this.dataListLoading = true
            this.delForm.orderout_main_number = odd
            api.DelOrderPtsApi(this.delForm).then(res => {
                api.DelOrderNCCApi(this.delForm).then(res => {
                    this.$message.success('删除成功')
                    this.dataListLoading = false
                    this.getDataList()
                    console.log(res, 'res')
                })
            })

        },
        /**
     * 选择变化时的处理（选中一个主单号时，自动选中该主单号的所有行）
     */
        handleSelectionChange(selectedRows) {
            // 2. 从 tableData 中筛选出所有匹配的主单号数据
            this.select = this.dataList.filter(item =>
                item.orderoutMainNumber == selectedRows[0].orderoutMainNumber
            );

            this.select.forEach(item => {
                const midCount = Number(item.midCount) || 0;
                const pieceConverValue = Number(item.pieceConverValue) || 0;
                item.tong = ((Math.round(midCount * pieceConverValue) / 1000).toFixed(2)).toString(); // 四舍五入保留两位
                item.midCount = ((Number(item.midCount) || 0).toFixed(0)).toString();
            });
            this.select.forEach((item, index) => {
                item.sort = index + 1; // 1, 2, 3, ..., array.length
            });
            this.select = this.addTotalRow(this.select);
            this.select = this.mergeObjectsByPno1(this.select);
            this.select = this.sortByPNo(this.select)

            this.selectoud = this.dataList.filter(item =>
                item.orderoutMainNumber == selectedRows[0].orderoutMainNumber
            );

            this.selectoud = this.mergeObjectsByPno(this.selectoud);
            this.selectoud.forEach(item => {
                const midCount = Number(item.midCount) || 0;
                const pieceConverValue = Number(item.pieceConverValue) || 0;
                item.tong = ((Math.round(midCount * pieceConverValue) / 1000).toFixed(2)).toString(); // 四舍五入保留两位
                item.midCount = ((Number(item.midCount) || 0).toFixed(0)).toString();
            });
            this.selectoud.forEach((item, index) => {
                item.sort = index + 1; // 1, 2, 3, ..., array.length
            });
            this.selectoud = this.addTotalRow(this.selectoud);
            this.selectoud = this.sortByPNo(this.selectoud)

            console.log(this.selectoud, 'selectoud');

        },
        sortByPNo(array) {
            // 定义参考顺序
            const referenceOrder = [
                "1520100047",
                "1520100023",
                "1520130002",
                "1520100028",
                "1520100027",
                "1520100049",
                "1520100032",
                "1520100031",
                "1520100030",
                "1520100029",
                "1520100033",
                "1520100034",
                "1520100035",
                "1520100036",
                "1520100037",
                "1520100038",
                "1520100039",
                "1520100040",
                "1520100007",
                "1520100042",
                "1520100044",
                "1520100050", // 注意：重复值
                "1103010005",
                "1102010001"
            ];

            // 创建一个映射，将 pNo 映射到它的顺序索引
            const orderMap = new Map();
            referenceOrder.forEach((pNo, index) => {
                orderMap.set(pNo, index);
            });

            // 先排序
            const sortedArray = array.sort(function (a, b) {
                // 如果某个对象是 "合计"，则排在最后
                if (a.pname === "合计") return 1;
                if (b.pname === "合计") return -1;

                var indexA = orderMap.get(a.pNo);
                var indexB = orderMap.get(b.pNo);

                // 使用 typeof 检查 undefined，或使用传统逻辑或
                indexA = typeof indexA !== 'undefined' ? indexA : Infinity;
                indexB = typeof indexB !== 'undefined' ? indexB : Infinity;

                return indexA - indexB;
            });

            // 遍历排序后的数组，添加 sort 字段
            sortedArray.forEach((item, index) => {
                if (item.pname === "合计") {
                    item.sort = "合计"; // 如果是 "合计"，则 sort 也设为 "合计"
                } else {
                    item.sort = index + 1; // 否则按正常序号 1, 2, 3... 赋值
                }
            });

            return sortedArray;
        },

        addTotalRow(arr) {
            // 计算合计值
            const total = {
                midCount: 0,
                tong: 0,
                sort: '合计',
                pname: '合计',
                midUnit: '合计',
                cuName: '合计',
            };

            arr.forEach(item => {
                // 累加 midCount（转为数字计算，但最终存为字符串）
                total.midCount = String(Number(total.midCount) + Number(item.midCount) || 0);
                // 累加 tong（转为数字计算，但最终存为字符串）
                total.tong = String((Number(total.tong) + Number(item.tong)).toFixed(2) || 0);
            });

            // 创建新数组（不修改原数组）
            const newArray = [...arr, total];
            return newArray;
        },

        mergeObjectsByPno1(arr) {
            const result = {};
            arr.forEach(item => {
                // 使用pNo和cuName的组合作为唯一键
                const key = `${item.pNo}_${item.cuName}`;

                if (!result[key]) {
                    // 如果结果中还没有这个组合键，直接添加，并确保midCount是数字
                    result[key] = { ...item, midCount: Number(item.midCount) };
                } else {
                    // 如果已存在，将midCount转为数字后累加
                    result[key].midCount += Number(item.midCount);
                }
            });

            // 将结果对象转换为数组
            return Object.values(result);
        },

        mergeObjectsByPno(arr) {
            const result = {};
            arr.forEach(item => {
                // 使用pNo和cuName的组合作为唯一键
                const key = `${item.pNo}`;

                if (!result[key]) {
                    // 如果结果中还没有这个组合键，直接添加，并确保midCount是数字
                    result[key] = { ...item, midCount: Number(item.midCount) };
                } else {
                    // 如果已存在，将midCount转为数字后累加
                    result[key].midCount += Number(item.midCount);
                }
            });

            // 将结果对象转换为数组
            return Object.values(result);
        },
        // 强制单选逻辑
        handleSelect(selection, row) {
            if (selection.length > 1) {
                // 如果用户尝试多选，就清除所有选择，再重新选中当前行
                this.$refs.table.clearSelection();
                this.$nextTick(() => {
                    this.$refs.table.toggleRowSelection(row, true);
                });
            }
        },
        // 合并单元格方法
        objectSpanMethod({
            row,
            column,
            rowIndex,
            columnIndex
        }, items) {
            if (columnIndex === 0) { // 只处理第一列
                const currentMainNo = row['orderoutMainNumber']; // 假设主单号的字段名是'orderoutMainNumber'
                const preRow = items[rowIndex - 1];
                const preMainNo = preRow ? preRow['orderoutMainNumber'] : null;

                if (currentMainNo === preMainNo) {
                    return {
                        rowspan: 0,
                        colspan: 0
                    }; // 隐藏当前单元格
                } else {
                    let rowspan = 1;
                    for (let i = rowIndex + 1; i < items.length; i++) {
                        const nextRow = items[i];
                        if (nextRow['orderoutMainNumber'] === currentMainNo) {
                            rowspan++;
                        } else {
                            break;
                        }
                    }
                    return {
                        rowspan,
                        colspan: 1
                    }; // 当前单元格跨越行
                }
            }
            if (columnIndex === 15) { // 只处理第一列
                const currentMainNo = row['orderoutMainNumber']; // 假设主单号的字段名是'orderoutMainNumber'
                const preRow = items[rowIndex - 1];
                const preMainNo = preRow ? preRow['orderoutMainNumber'] : null;

                if (currentMainNo === preMainNo) {
                    return {
                        rowspan: 0,
                        colspan: 0
                    }; // 隐藏当前单元格
                } else {
                    let rowspan = 1;
                    for (let i = rowIndex + 1; i < items.length; i++) {
                        const nextRow = items[i];
                        if (nextRow['orderoutMainNumber'] === currentMainNo) {
                            rowspan++;
                        } else {
                            break;
                        }
                    }
                    return {
                        rowspan,
                        colspan: 1
                    }; // 当前单元格跨越行
                }
            }
        },
        Shippend() {
            this.dataListLoading = true
            oapi.TtrackProductAdd(this.dataForm1).then(res => {
                this.proList = res.content
                console.log(this.proList)
                api.APIptsnccorderSend(this.dataForm).then(res => {
                    this.dataList = res
                    // 过滤掉 issend 为 1 的对象
                    this.dataList = this.dataList.filter(item => item.issend == 1);
                    this.dataList.forEach(dataItem => {
                        const matchedPro = this.proList.find(proItem =>
                            proItem.code === dataItem.pNo
                        );

                        if (matchedPro) {
                            dataItem.bulkfactor = matchedPro.bulkfactor; // 添加 converBox
                            dataItem.pieceConverValue = matchedPro.pieceConverValue;               // 添加 kg
                        }
                    });
                    this.dataList.forEach(item => {
                        const midCount = Number(item.midCount) || 0;
                        const pieceConverValue = Number(item.pieceConverValue) || 0;
                        item.tong = (Math.round(midCount * pieceConverValue) / 1000).toString(); // 四舍五入保留两位
                        item.midCount = ((Number(item.midCount) || 0).toFixed(0)).toString();
                    });
                    
                    // 按 orderoutMainNumber 排序
                    this.dataList = [...this.dataList].sort((a, b) =>
                        a.orderoutMainNumber.localeCompare(b.orderoutMainNumber)
                    );
                    this.dataList = this.dataList.filter(item =>
                        (item.orderoutNumber && item.orderoutNumber.includes(this.bullay)) ||
                        (item.cname && item.cname.includes(this.bullay)) ||
                        (item.pname && item.pname.includes(this.bullay)) ||
                        (item.cuName && item.cuName.includes(this.bullay)) ||
                        (item.orderoutMainNumber && item.orderoutMainNumber.includes(this.bullay)) ||
                        (item.csitename && item.csitename.includes(this.bullay))||
                        (item.pNo && item.pNo.includes(this.bullay))
                    );
                    this.dataList.forEach((item, index) => {
                        item.sort = index + 1; // 1, 2, 3, ..., array.length
                    });

                })
                console.log(this.dataList)
                this.dataListLoading = false
            })
        },
        getDataList() {
            this.dataListLoading = true
            oapi.TtrackProductAdd(this.dataForm1).then(res => {
                this.proList = res.content
                console.log(this.proList)
                api.APIptsnccorderSend(this.dataForm).then(res => {
                    this.dataList = res
                    // 过滤掉 issend 为 1 的对象
                    this.dataList = this.dataList.filter(item => item.issend != 1);
                    this.dataList.forEach(dataItem => {
                        const matchedPro = this.proList.find(proItem =>
                            proItem.code === dataItem.pNo
                        );

                        if (matchedPro) {
                            dataItem.bulkfactor = matchedPro.bulkfactor; // 添加 converBox
                            dataItem.pieceConverValue = matchedPro.pieceConverValue;               // 添加 kg
                        }
                    });
                    this.dataList.forEach(item => {
                        const midCount = Number(item.midCount) || 0;
                        const pieceConverValue = Number(item.pieceConverValue) || 0;
                        item.tong = (Math.round(midCount * pieceConverValue) / 1000).toString(); // 四舍五入保留两位
                        item.midCount = ((Number(item.midCount) || 0).toFixed(0)).toString();
                    });
                    // 按 orderoutMainNumber 排序
                    this.dataList = [...this.dataList].sort((a, b) =>
                        a.orderoutMainNumber.localeCompare(b.orderoutMainNumber)
                    );

                    this.dataList = this.dataList.filter(item =>
                        (item.orderoutNumber && item.orderoutNumber.includes(this.bullay)) ||
                        (item.cname && item.cname.includes(this.bullay)) ||
                        (item.pname && item.pname.includes(this.bullay)) ||
                        (item.cuName && item.cuName.includes(this.bullay)) ||
                        (item.orderoutMainNumber && item.orderoutMainNumber.includes(this.bullay)) ||
                        (item.csitename && item.csitename.includes(this.bullay))||
                        (item.pNo && item.pNo.includes(this.bullay))
                    );
                    this.dataList.forEach((item, index) => {
                        item.sort = index + 1; // 1, 2, 3, ..., array.length
                    });
                    let newDate = this.calculateTotal(this.dataList)
                    this.dataList.push(newDate)
                    console.log(this.dataList)
                    this.dataListLoading = false

                })
            })
        },
        //计算合计
        calculateTotal(data) {
            // 通用求和函数
            const sumField = (field) => {
                return data.reduce((sum, item) => {
                    const value = item[field];
                    if (value == null || value === "") return sum;
                    const num = Number(value);
                    return isNaN(num) ? sum : sum + num;
                }, 0);
            };

            // 生成合计对象
            return {
                orderoutNumber: "合计",
                // midUnit: '箱',
                midCount: parseFloat(sumField('midCount').toFixed(2)).toString(),
                tong: parseFloat(sumField('tong').toFixed(2)).toString()
            };
        },
        exportData() {

            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                console.log(this.select, 'this.select')
                exportExcel(this.selectoud, this.dataForm.p_vouchdateend, '发货表.xlsx', this.select)

            })
        },
        // 获取今年的日期数据
        calculateDates() {
            const today = new Date();

            // 获取当前月份的月初时间 
            const startOfMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);
            this.startOfMonth = this.formatDate(startOfMonthDate);

            // 获取截至今天的时间 
            this.endOfToday = this.formatDate(today);

            this.dataForm.p_vouchdatestart = this.startOfMonth;
            this.dataForm.p_vouchdateend = this.endOfToday;
            this.labelText = `雨帆乳业（海南）股份有限公司送货单`;
        },
        // 格式化日期
        formatDate(date) {
            this.year = date.getFullYear();
            this.month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1 
            this.day = String(date.getDate()).padStart(2, '0');
            return `${this.year}-${this.month}-${this.day}`;
        },
    }
};
</script>

<style scoped lang="scss"></style>