<template>
    <div class='old'>
        <el-form :inline="true" style="width: 75%; margin: 5px auto;">
            <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                @click="exportData">导出</el-button>
        </el-form>
        <el-table class="table" ref="table" border v-loading="dataListLoading" :data="currentData"
            style="width: 75%; margin: 0 auto; margin-bottom: 50px;">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="sqname" label="销售区域/省区" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="ocustomerClass_name" label="分公司办事处" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="cname" label="客户名称" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="cSiteName" label="站点" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="oldbox" label="老品" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="oldrate" label="老品百分比" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="newbox" label="新品" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="newrate" label="新品百分比" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="otherbox" label="其它品" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="otherrate" label="其它品百分比" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="allbox" label="小计" />
        </el-table>
        <el-pagination style="width: 75%; margin: 0 auto; " @size-change="sizeChangeHandle" ref="pagination"
            @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20, 40, 60, 80, 100, 1000]"
            :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="aggregatedData.length">
        </el-pagination>
    </div>
</template>

<script>
import * as api from '@/api/frame/customer.js'
import {
    exportExcel
} from './oldnewDetailsExpro.js'
export default {
    name: 'old-page',
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
            dataForm1: {
                page: 0,
                size: 400,
                sort: '',
            },
            proList: [],
            dataListLoading: false,
            dataList: [],
            currentData: [],
            currentPage: 1,
            pageSize: 20,
            totalItems: 0,
            aggregatedData:[]
        };
    },
    mounted() {
        this.dataForm.p_orgname = this.$route.query.param1;
        this.dataForm.p_vouchdatestart = this.$route.query.startdate;
        this.dataForm.p_vouchdateend = this.$route.query.enddata;
        this.getDataList()
    },
    methods: {
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                exportExcel(this.aggregatedData, '老/新品销量-站点.xlsx')

            })
        },

        //变老新品字段
        convertBoxFields(dataList) {
            dataList.forEach(item => {
                // 检查 attribute 字段并进行相应修改  
                if (typeof item.attribute === 'string') {
                    if (item.attribute.includes('老品')) {
                        item.oldbox = Number(item.box); // 将 box 转换为数字并赋值给 oldbox  
                        delete item.box; // 删除原来的 box 字段  
                    } else if (item.attribute.includes('新品')) {
                        item.newbox = Number(item.box); // 将 box 转换为数字并赋值给 newbox  
                        delete item.box; // 删除原来的 box 字段  
                    } else if (item.attribute.includes('其它')) {
                        item.otherbox = Number(item.box); // 将 box 转换为数字并赋值给 newbox  
                        delete item.box; // 删除原来的 box 字段  
                    }
                }
            });
        },
        aggregateBoxes(dataList) {
            const resultMap = {};

            dataList.forEach(item => {
                const { cSiteName, cname,ocustomerClass_name, nAME, sqname, newbox = 0, oldbox = 0, otherbox = 0 } = item;

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
                        newbox: Number(newbox),
                        oldbox: Number(oldbox),
                        otherbox: Number(otherbox),
                    };
                } else {
                    // 否则累加相应的字段  
                    resultMap[key].newbox += Number(newbox);
                    resultMap[key].oldbox += Number(oldbox);
                    resultMap[key].otherbox += Number(otherbox);
                }
            });

            // 将结果转换成数组形式  
            return Object.values(resultMap);
        },
        addSumField(dataList) {
            dataList.forEach(item => {
                // Convert fields to numbers and calculate the sum  
                const newbox = Number(item.newbox || 0);
                const oldbox = Number(item.oldbox || 0);
                const otherbox = Number(item.otherbox || 0);

                // Calculate the sum  
                item.allbox = newbox + oldbox + otherbox;
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

                

                // 计算合计  
                const total = this.aggregatedData.reduce((acc, item) => {
                    acc.oldbox += parseFloat(item.oldbox);
                    acc.newbox += parseFloat(item.newbox);
                    acc.allbox += parseFloat(item.allbox);
                    acc.otherbox += parseFloat(item.otherbox);
                    return acc;
                }, {
                    oldbox: 0,
                    newbox: 0,
                    allbox: 0,
                    otherbox: 0,
                });

                // 添加合计对象  
                const summary = {
                    cSiteName: '合计',
                    oldbox: total.oldbox.toFixed(2),
                    newbox: total.newbox.toFixed(2),
                    allbox: total.allbox.toFixed(2),
                    otherbox: total.otherbox.toFixed(2),
                };

                // 将合计对象添加到数据数组中  
                this.aggregatedData.push(summary);

                this.aggregatedData.forEach(item => {
                    item.oldbox = parseFloat(item.oldbox).toFixed(2); // 格式化 oldbox 
                    item.newbox = parseFloat(item.newbox).toFixed(2); // 格式化 newbox 
                    item.allbox = parseFloat(item.allbox).toFixed(2); // 格式化 allbox
                    item.otherbox = parseFloat(item.otherbox).toFixed(2)  ||0; // 格式化 allbox
                });
                this.aggregatedData.forEach(item => {
                    if (item.sqname) { // 检查 sqname 是否存在且非空  
                        item.sqname = item.sqname.replace(/\d+/g, '').trim(); // 替换数字并去除空格  
                    }
                });
                this.aggregatedData.forEach(item=>{
                    item.oldrate = ((item.oldbox / item.allbox).toFixed(2))*100+'%'
                    item.newrate = ((item.newbox / item.allbox).toFixed(2))*100+'%'
                    item.otherrate= ((item.otherbox / item.allbox).toFixed(2))*100+'%'
                })
                console.log(this.aggregatedData, 'aggregatedData')

                this.currentData = {
                    ...this.aggregatedData
                };
                this.sizeChangeHandle(this.pageSize);
                // // 按照 sonname、sqname 和 cSiteName 排序  
                // this.dataList.sort((a, b) => {
                //     // 处理比较时确保处理了空值情况  
                //     const classNameA = a.sonname || ''; // 默认值为空字符串  
                //     const classNameB = b.sonname || ''; // 默认值为空字符串  
                //     const nameA = a.sqname || ''; // 默认值为空字符串  
                //     const nameB = b.sqname || ''; // 默认值为空字符串  

                //     // 如果 cSiteName 是 "合计"，则确保其排到最后  
                //     if (a.sonname === "合计") return 1;
                //     if (b.sonname === "合计") return -1;

                //     // 首先比较 sonname 
                //     const classComparison = classNameA.localeCompare(classNameB);

                //     // 如果 sonname 相同，则比较 sqname  
                //     if (classComparison === 0) {
                //         return nameA.localeCompare(nameB); // 次级排序  
                //     }

                //     return classComparison; // 返回 sonname 的比较结果  
                // });

                this.dataListLoading = false;
                

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