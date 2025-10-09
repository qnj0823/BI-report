<template>
    <div class='statement'>
        <el-form :inline="true" style="width: 95%; margin: 0 auto;">
            <el-form-item>
                <el-date-picker v-model="dataForm.p_vouchdatestart" value-format="yyyy-MM-dd" type="date"
                    placeholder="开始日期" clearable style="width: 100%"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-date-picker v-model="dataForm.p_vouchdateend" value-format="yyyy-MM-dd" type="date"
                    placeholder="结束日期" clearable style="width: 100%"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-input v-model="bullay" placeholder="模糊搜索" clearable @keyup.enter.native="searchEnterFun()"
                    ref="searchInput"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
                    @click="getdataList">查询</el-button>
            </el-form-item>
            <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                @click="exportData">导出</el-button>
        </el-form>
        <div style="display: flex; justify-content: center; align-items: center;">
            <label>《净销售明细表》</label>
        </div>
        <el-table ref="table" v-loading="dataListLoading" :data="currentData" :span-method="objectSpanMethod"
            max-height="650" style="width: 100%;">
            <el-table-column width="100" align="center" prop="vouchdate" label="订单日期" />
            <el-table-column :show-overflow-tooltip="true" width="180" align="center" prop="cOrderNo" label="订单号" />
            <el-table-column :show-overflow-tooltip="true" width="180" align="center" prop="cName" label="客户 " />
            <el-table-column :show-overflow-tooltip="true" width="100" align="center" prop="levelName1" label="战区" />
            <el-table-column :show-overflow-tooltip="true" width="100" align="center" prop="levelName2" label="销量区域" />
            <el-table-column :show-overflow-tooltip="true" width="100" align="center" prop="ocustomerClass_name"
                label="客户分类" />
            <el-table-column :show-overflow-tooltip="true" width="130" align="center" prop="cSiteName" label="客户站点" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="product_class_name" label="商品分类" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="simplename" label="产品简称" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="attribute" label="商品属性" />
            <el-table-column :show-overflow-tooltip="true" align="center" width="100" prop="cProductCode"
                label="商品编码" />
            <el-table-column :show-overflow-tooltip="true" align="center" width="200" prop="cProductName"
                label="商品名称" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box" width="100" label="订单销售数量" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="cProductAuxUnitName" label="销售单位" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="nqtorigtaxprice" label="含税单价" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="test01" width="130"
                label="订单总金额(含折扣)" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="norigdiscount" width="100"
                label="返利分摊金额" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="fOrderRebateMoney" width="150"
                label="市场费用返利分摊金额" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="norigtaxmny" width="130"
                label="折扣后订单金额" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="giftbox" label="搭赠数量" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="costsubs" width="100" label="费用补助数量" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="netsalesvolume" label="净销量数量" />
        </el-table>
        <el-pagination style="width: 90%; margin: 0 auto; " @size-change="sizeChangeHandle" ref="pagination"
            @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20, 40, 60, 80, 100, 1000]"
            :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="dataList.length">
        </el-pagination>
    </div>
</template>

<script>
import * as api from '@/api/Business/analysis.js'
import {
    exportExcel
} from './NetSalesStatementExpro.js'
export default {
    name: 'statement-page',
    data() {
        return {
            dataForm: {
                p_vouchdateend: '',
                p_vouchdatestart: '',
                p_orgname: ''
            },
            bullay: '',
            dataListLoading: false,
            dataList: [],
            currentData: [],
            currentPage: 1,
            pageSize: 20,
            totalItems: 0,
        };
    },
    created() {
        this.calculateDates();
    },
    mounted() {
        this.getdataList()
    },
    methods: {
        objectSpanMethod({
            row,
            column,
            rowIndex,
            columnIndex
        }) {
            // 处理第16列  
            if (columnIndex === 16) { // 第16列的索引是16  
                const currentValue = row[column.property];
                const preRow = this.dataList[rowIndex - 1];
                const preValue = preRow ? preRow[column.property] : null;

                // 如果当前值为0，直接返回不合并  
                if (currentValue == 0.00) {
                    return {
                        rowspan: 1,
                        colspan: 1
                    };
                }

                // 如果当前值和上一行的值相同，则将当前单元格隐藏  
                if (currentValue === preValue) {
                    return {
                        rowspan: 0,
                        colspan: 0
                    };
                } else {
                    // 否则计算当前单元格应该跨越多少行  
                    let rowspan = 1;
                    for (let i = rowIndex + 1; i < this.dataList.length; i++) {
                        const nextRow = this.dataList[i];
                        const nextValue = nextRow[column.property];

                        // 只有当下一行的值与当前值相同且不为0才继续统计  
                        if (nextValue === currentValue && nextValue !== 0) {
                            rowspan++;
                        } else {
                            break;
                        }
                    }
                    return {
                        rowspan,
                        colspan: 1
                    };
                }
            }

            // 处理第17列  
            if (columnIndex === 17) { // 第17列的索引是17  
                const currentValue = row[column.property];
                const preRow = this.dataList[rowIndex - 1];
                const preValue = preRow ? preRow[column.property] : null;

                // 如果当前值为0，直接返回不合并  
                if (currentValue == 0.00) {
                    return {
                        rowspan: 1,
                        colspan: 1
                    };
                }

                // 如果当前值和上一行的值相同，则将当前单元格隐藏  
                if (currentValue === preValue) {
                    return {
                        rowspan: 0,
                        colspan: 0
                    };
                } else {
                    // 否则计算当前单元格应该跨越多少行  
                    let rowspan = 1;
                    for (let i = rowIndex + 1; i < this.dataList.length; i++) {
                        const nextRow = this.dataList[i];
                        const nextValue = nextRow[column.property];

                        // 只有当下一行的值与当前值相同且不为0才继续统计  
                        if (nextValue === currentValue && nextValue !== 0) {
                            rowspan++;
                        } else {
                            break;
                        }
                    }
                    return {
                        rowspan,
                        colspan: 1
                    };
                }
            }

            // 对于其他列，默认返回不合并  
            return {
                rowspan: 1,
                colspan: 1
            };
        },
        //获取时间
        calculateDates() {
            const today = new Date();

            // 获取当前月份的月初时间 
            const startOfMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);
            this.startOfMonth = this.formatDate(startOfMonthDate);

            // 获取截至今天的时间 
            this.endOfToday = this.formatDate(today);
            this.dataForm.p_vouchdatestart = this.startOfMonth
            this.dataForm.p_vouchdateend = this.endOfToday
        },
        formatDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1 
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                exportExcel(this.dataList, '净销售明细表.xlsx')

            })
        },
        getdataList() {
            this.dataListLoading = true
            api.salesclearlyAPI(this.dataForm).then(res => {
                this.dataList = res
                this.dataList.forEach(item => {
                    if (item.level_name) { // 检查 levelName 是否存在  
                        const levels = item.level_name.split(' -> ');
                        item.levelName1 = levels[0] || "";
                        // 去掉 levelName2 中的数字  
                        item.levelName2 = levels[1] ? levels[1].replace(/\d+/g, '').trim() : "";
                        item.levelName3 = levels[2] || "";
                    } else {
                        // 如果 levelName 不存在，可以设置默认值  
                        item.levelName1 = "";
                        item.levelName2 = "";
                        item.levelName3 = "";
                    }
                });

                this.dataList = this.dataList.map(item => {
                    // 确保参与计算的字段存在，避免除以零和其他潜在错误  
                    const fOrderRebateMoney = Number(item.fOrderRebateMoney) || 0;//除减后返利分摊金额
                    // 默认为1以防止除以零  
                    const nqtorigtaxprice = Number(item.nqtorigtaxprice) || 1;//含税单价

                    // 计算 costsubs -- 费用补助数量
                    const costsubs = fOrderRebateMoney / nqtorigtaxprice;

                    // 计算 netsalesvolume -- 净销量数量
                    const box = item.box || 0;
                    const giftbox = item.giftbox || 0;

                    const netsalesvolume = box - giftbox - costsubs;

                    // 返回更新后的对象，包括新字段  
                    return {
                        ...item,      // 保留原始字段  
                        costsubs,     // 添加 costsubs 字段  
                        netsalesvolume // 添加 netsalesvolume 字段  
                    };
                });
                this.dataList.forEach(item => {
                    item.nqtorigtaxprice = Number(item.nqtorigtaxprice).toFixed(2)
                    item.test01 = Number(item.test01).toFixed(2)
                    item.fOrderRebateMoney = Number(item.fOrderRebateMoney).toFixed(2)
                    item.norigdiscount = Number(item.norigdiscount).toFixed(2)
                    item.norigtaxmny = Number(item.norigtaxmny).toFixed(2)
                    item.giftbox = Number(item.giftbox).toFixed(0)
                    item.costsubs = Number(item.costsubs).toFixed(2)
                    item.netsalesvolume = Number(item.netsalesvolume).toFixed(2)
                });

                this.dataList = this.dataList.filter(item =>
                    (item.cName && item.cName.toLowerCase().includes(this.bullay)) ||
                    (item.ocustomerClass_name && item.ocustomerClass_name.toLowerCase().includes(this.bullay)) ||
                    (item.cSiteName && item.cSiteName.toLowerCase().includes(this.bullay)) ||
                    (item.product_class_name && item.product_class_name.toLowerCase().includes(this.bullay)) ||
                    (item.simplename && item.simplename.toLowerCase().includes(this.bullay)) ||
                    (item.attribute && item.attribute.toLowerCase().includes(this.bullay)) ||
                    (item.cProductName && item.cProductName.toLowerCase().includes(this.bullay)) ||
                    (item.levelName1 && item.levelName1.toLowerCase().includes(this.bullay)) ||
                    (item.levelName2 && item.levelName2.toLowerCase().includes(this.bullay))
                );
                // this.dataList = this.dataList.reduce((acc, curr) => {
                //     const { cOrderNo, test01, norigdiscount, giftbox, fOrderRebateMoney } = curr;
                //     // 检查当前 cOrderNo 是否已经存在于 accumulator 中  
                //     const existing = acc.find(item => item.cOrderNo === cOrderNo);
                //     if (!existing) {
                //         // 如果累加器中没有此 cOrderNo，直接将当前对象添加到 accumulator  
                //         acc.push({ ...curr }); // 保留所有字段  
                //     } else {
                //         // 如果已存在此 cOrderNo，比较 test01 和 norigdiscount 字段  
                //         if (existing.test01 === test01 && existing.norigdiscount === norigdiscount && existing.giftbox === giftbox && existing.fOrderRebateMoney === fOrderRebateMoney) {
                //             // 如果相等，将当前对象的 test01 和 norigdiscount 设置为 '0.00'  
                //             curr.test01 = '';
                //             curr.norigdiscount = '';
                //             curr.giftbox = '';
                //             curr.fOrderRebateMoney = '';

                //         }
                //         // else {
                //         //     // 如果不相等，则将当前对象的 test01 和 norigdiscount 设置为 '0.00'  
                //         //     curr.test01 = '';
                //         //     curr.norigdiscount = '';
                //         // }
                //         // 直接添加修改后的当前对象到 accumulator  
                //         acc.push(curr);
                //     }
                //     return acc;
                // }, []);
                this.dataList = this.processArray(this.dataList);
                console.log(this.dataList, 'this.dataList')
                this.currentData = {
                    ...this.dataList
                };
                this.sizeChangeHandle(this.pageSize);
                this.dataListLoading = false
                console.log(this.dataList)
            })
        },

        processArray(arr) {
            // 创建一个对象来存储按 cOrderNo 分组的结果
            const grouped = {};

            // 遍历数组，按 cOrderNo 分组
            arr.forEach(item => {
                const orderNo = item.cOrderNo;
                if (!grouped[orderNo]) {
                    grouped[orderNo] = [];
                }
                grouped[orderNo].push(item);
            });

            // 处理每一组
            for (const orderNo in grouped) {
                const group = grouped[orderNo];

                // 计算 box 和 costsubs 的总和
                let boxSum = 0;
                let costsubsSum = 0;
                let giftbox = 0

                group.forEach(item => {
                    boxSum += Number(item.box) || 0;
                    costsubsSum = Number(item.costsubs) || 0;
                    giftbox = Number(item.giftbox) || 0;
                });

                // 计算 netsalesvolume
                const netsalesvolume = boxSum - costsubsSum - giftbox;

                // 将结果赋给组中每个对象
                group.forEach(item => {
                    item.netsalesvolume = netsalesvolume.toString();
                });
            }

            return arr;
        },
        // 每页数
        sizeChangeHandle(val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.currentData = this.dataList.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this
                .pageSize);
        },
        // 当前页
        handleCurrentChange(val) {
            console.log(val)
            this.currentPage = val;
            this.currentData = this.dataList.slice((val - 1) * this.pageSize, val * this.pageSize);
        },
    }
};
</script>

<style scoped lang="scss">
::v-deep .table .el-table__cell {
    padding: 2px !important;

}

;

::v-deep th.el-table__cell>.cell {
    padding: 0px !important;
}

;

::v-deep .el-table__header-wrapper {
    font-size: 12px;
    background: #f5f7fa;
}


::v-deep .el-table th {
    background: #f5f7fa;
}
</style>