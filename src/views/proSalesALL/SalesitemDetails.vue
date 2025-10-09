<template>
    <div class='salesdetails'>
        <el-form :inline="true" style="width: 70%; margin: 10px auto;">
            <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                @click="exportData">导出</el-button>
        </el-form>
        <el-table class="table" ref="table" border v-loading="dataListLoading" :data="currentData"
            style="width: 70%; margin: 0 auto; margin-bottom: 50px;">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="sqname" label="销售区域/省区" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="ocustomerClass_name" label="分公司办事处" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="cSiteName" label="站点" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="lowbox" label="低温系列" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="nowbox" label="常温系列" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="Frubox" label="果汁系列" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="yznlbox" label="椰子牛乳系列" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="yzzbox" label="椰子汁系列" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="qtbox" label="其它" />
            <el-table-column prop="sum" align="center" label="小计" />
        </el-table>
        <el-pagination style="width: 80%; margin: 0 auto; " @size-change="sizeChangeHandle" ref="pagination"
            @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20, 40, 60, 80, 100, 1000]"
            :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="aggregatedData.length">
        </el-pagination>
    </div>
</template>

<script>
import * as api from '@/api/frame/customer.js'
import {
    exportExcel
} from './SalesitemDetailsExpro.js'
export default {
    name: 'salesdetails-page',
    data() {
        return {
            dataListLoading: false,
            dataList: [],
            result: [],
            chartList: [],
            dataForm: {
                p_vouchdatestart: '',
                p_vouchdateend: '',
                p_orgname: ''
            },
            dataListLoading: false,
            dataList: [],
            currentData: [],
            currentPage: 1,
            pageSize: 20,
            totalItems: 0,
            startOfMonth: '',
            endOfToday: '',
            mergedDataList: [],
            aggregatedData: []
        };
    },
    mounted() {
        this.dataForm.p_orgname = this.$route.query.param1;
        this.dataForm.p_vouchdatestart = this.$route.query.startdate;
        this.dataForm.p_vouchdateend = this.$route.query.enddata;
        this.getDataList()
    },
    methods: {
        sumBoxes(array) {
            //计算 box 字段的总和 
            const sum = array.reduce((accumulator, current) => accumulator + current.box, 0);
            // 创建一个新对象并存储总和
            const result = { box: sum, cSiteName: '合计' };
            // 将新对象推入数组 
            array.push(result);
            return array;
        },
        objectSpanMethod({
            row,
            column,
            rowIndex,
            columnIndex
        }, items) {
            if (columnIndex === 0) { // 处理第一列
                const currentValue = row[column.property];
                const preRow = items[rowIndex - 1];
                const preValue = preRow ? preRow[column.property] : null;

                if (currentValue === preValue) {
                    return {
                        rowspan: 0,
                        colspan: 0
                    }; // 隐藏当前单元格
                } else {
                    let rowspan = 1;
                    for (let i = rowIndex + 1; i < items.length; i++) {
                        const nextRow = items[i];
                        if (nextRow[column.property] === currentValue) {
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
            if (columnIndex === 3) { // 处理第一列
                const currentValue = row[column.property];
                const preRow = items[rowIndex - 1];
                const preValue = preRow ? preRow[column.property] : null;

                // 检查当前值是否为空
                if (!currentValue) {
                    return {
                        rowspan: 1, // 保留当前单元格
                        colspan: 1
                    }; // 不合并，但保留单元格
                }

                if (currentValue === preValue) {
                    return {
                        rowspan: 0,
                        colspan: 0
                    }; // 隐藏当前单元格
                } else {
                    let rowspan = 1;
                    for (let i = rowIndex + 1; i < items.length; i++) {
                        const nextRow = items[i];
                        if (nextRow[column.property] === currentValue) {
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
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                exportExcel(this.aggregatedData, '分子公司产品系列销售表-站点.xlsx')

            })
        },
        //变产品系列字段
        convertBoxFields(dataList) {
            dataList.forEach(item => {
                // 检查 product_class_pname 字段并进行相应修改  
                if (typeof item.product_class_pname === 'string') {
                    if (item.product_class_pname.includes('低温系列')) {
                        item.lowbox = Number(item.box).toFixed(2); // 将 box 转换为数字并赋值给 oldbox  
                        delete item.box; // 删除原来的 box 字段  
                    } else if (item.product_class_pname.includes('常温系列')) {
                        item.nowbox = Number(item.box).toFixed(2); // 将 box 转换为数字并赋值给 newbox  
                        delete item.box; // 删除原来的 box 字段  
                    } else if (item.product_class_pname.includes('果汁系列')) {
                        item.Frubox = Number(item.box).toFixed(2); // 将 box 转换为数字并赋值给 newbox  
                        delete item.box; // 删除原来的 box 字段  
                    } else if (item.product_class_pname.includes('椰子汁系列')) {
                        item.yzzbox = Number(item.box).toFixed(2); // 将 box 转换为数字并赋值给 newbox  
                        delete item.box; // 删除原来的 box 字段  
                    } else if (item.product_class_pname.includes('椰子牛乳系列')) {
                        item.yznlbox = Number(item.box).toFixed(2); // 将 box 转换为数字并赋值给 newbox  
                        delete item.box; // 删除原来的 box 字段  
                    } else if (item.product_class_pname.includes('其它')) {
                        item.qtbox = Number(item.box).toFixed(2); // 将 box 转换为数字并赋值给 newbox  
                        delete item.box; // 删除原来的 box 字段  
                    }
                }
            });
        },
        aggregateBoxes(dataList) {
            const resultMap = {};

            dataList.forEach(item => {
                // 结构赋值并设置默认值  
                const { cSiteName, cname, ocustomerClass_name, nAME, sqname, lowbox = 0, nowbox = 0, Frubox = 0, yzzbox = 0, yznlbox = 0, qtbox = 0 } = item;

                // 创建一个唯一的键  
                const key = `${cSiteName}|${cname}|${nAME}|${sqname}`;

                // 如果 resultMap 中没有这个键，初始化它  
                if (!resultMap[key]) {
                    resultMap[key] = {
                        cSiteName,
                        cname,
                        nAME,
                        sqname,
                        ocustomerClass_name,
                        lowbox: Number(lowbox).toFixed(2),
                        nowbox: Number(nowbox).toFixed(2),
                        Frubox: Number(Frubox).toFixed(2),
                        yzzbox: Number(yzzbox).toFixed(2),
                        yznlbox: Number(yznlbox).toFixed(2),
                        qtbox: Number(qtbox).toFixed(2),
                    };
                } else {
                    // 否则累加相应的字段，并保留两位小数  
                    resultMap[key].lowbox = (parseFloat(resultMap[key].lowbox) + Number(lowbox)).toFixed(2);
                    resultMap[key].nowbox = (parseFloat(resultMap[key].nowbox) + Number(nowbox)).toFixed(2);
                    resultMap[key].Frubox = (parseFloat(resultMap[key].Frubox) + Number(Frubox)).toFixed(2);
                    resultMap[key].yzzbox = (parseFloat(resultMap[key].yzzbox) + Number(yzzbox)).toFixed(2);
                    resultMap[key].yznlbox = (parseFloat(resultMap[key].yznlbox) + Number(yznlbox)).toFixed(2);
                    resultMap[key].qtbox = (parseFloat(resultMap[key].qtbox) + Number(qtbox)).toFixed(2);
                }
            });

            // 将结果转换成数组形式  
            return Object.values(resultMap);
        },
        addSumField(dataList) {
            dataList.forEach(item => {
                // 将字段转换为数字并计算总和  
                const lowbox = Number(item.lowbox || 0);
                const nowbox = Number(item.nowbox || 0);
                const Frubox = Number(item.Frubox || 0);
                const yzzbox = Number(item.yzzbox || 0);
                const yznlbox = Number(item.yznlbox || 0);
                const qtbox = Number(item.qtbox || 0);

                // 计算总和并确保有两位小数  
                const totalSum = lowbox + nowbox + Frubox + yzzbox + yznlbox + qtbox;
                item.sum = totalSum.toFixed(2); // 转换为带有两位小数的字符串  
            });
        },

        getDataList() {
            this.dataListLoading = true
            api.productonesellsite(this.dataForm).then(res => {
                this.dataList = res
                this.dataList.forEach(item => {
                    if (item.cProductCode == 'HBLK007') {
                        item.box = item.box / 40
                    }
                })
                this.convertBoxFields(this.dataList)
                this.aggregatedData = this.aggregateBoxes(this.dataList)
                this.addSumField(this.aggregatedData)
                console.log(this.aggregatedData, ' this.aggregatedData')

                // 计算合计  
                const total = this.aggregatedData.reduce((acc, item) => {
                    acc.lowbox += parseFloat(item.lowbox);
                    acc.nowbox += parseFloat(item.nowbox);
                    acc.Frubox += parseFloat(item.Frubox);
                    acc.yzzbox += parseFloat(item.yzzbox);
                    acc.yznlbox += parseFloat(item.yznlbox);
                    acc.qtbox += parseFloat(item.qtbox);
                    acc.sum += parseFloat(item.sum);
                    return acc;
                }, {
                    lowbox: 0,
                    nowbox: 0,
                    Frubox: 0,
                    yzzbox: 0,
                    yznlbox: 0,
                    qtbox: 0,
                    sum: 0,
                });

                // 添加合计对象  
                const summary = {
                    cSiteName: '合计',
                    lowbox: total.lowbox.toFixed(2),
                    nowbox: total.nowbox.toFixed(2),
                    Frubox: total.Frubox.toFixed(2),
                    yzzbox: total.yzzbox.toFixed(2),
                    yznlbox: total.yznlbox.toFixed(2),
                    qtbox: total.qtbox.toFixed(2),
                    sum: total.sum.toFixed(2),
                };

                // 将合计对象添加到数据数组中  
                this.aggregatedData.push(summary);

                this.aggregatedData.forEach(item => {
                    item.lowbox = parseFloat(item.lowbox).toFixed(2); // 格式化 oldbox 
                    item.nowbox = parseFloat(item.nowbox).toFixed(2); // 格式化 newbox 
                    item.Frubox = parseFloat(item.Frubox).toFixed(2); // 格式化 allbox
                    item.yzzbox = parseFloat(item.yzzbox).toFixed(2) || 0; // 格式化 allbox
                    item.yznlbox = parseFloat(item.yznlbox).toFixed(2) || 0; // 格式化 allbox
                    item.qtbox = parseFloat(item.qtbox).toFixed(2) || 0; // 格式化 allbox
                    item.sum = parseFloat(item.sum).toFixed(2) || 0; // 格式化 allbox
                });
                this.aggregatedData.forEach(item => {
                    if (item.sqname) { // 检查 sqname 是否存在且非空  
                        item.sqname = item.sqname.replace(/\d+/g, '').trim(); // 替换数字并去除空格  
                    }
                });

                this.currentData = {
                    ...this.aggregatedData
                };
                this.dataListLoading = false;
                this.sizeChangeHandle(this.pageSize);

            })
        },
        // 每页数
        sizeChangeHandle(val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.currentData = this.aggregatedData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this
                .pageSize);
        },
        // 当前页
        handleCurrentChange(val) {
            console.log(val)
            this.currentPage = val;
            this.currentData = this.aggregatedData.slice((val - 1) * this.pageSize, val * this.pageSize);
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
    font-size: 15px;
    background: #f5f7fa;
}


::v-deep .el-table th {
    background: #f5f7fa;
}
</style>