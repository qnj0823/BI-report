<template>
    <div class='fgsOLD'>
        <el-form :inline="true" style="width: 60%; margin: 5px auto;">
      <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
        @click="exportData">导出</el-button>
    </el-form>
        <el-table class="table" ref="table" border v-loading="dataListLoading" :data="dataList"
            style="width: 60%; margin: 0 auto; margin-bottom: 50px;">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="sonname" label="分公司办事处" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="oldbox" label="老品" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="oldrate" label="老品百分比" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="newbox" label="新品" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="newrate" label="新品百分比" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="otherbox" label="其它品" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="otherrate" label="其它品百分比" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="allbox" label="小计" />
        </el-table>
    </div>
</template>

<script>
import * as api from '@/api/frame/customer.js'
import {
    exportExcel
} from './fgsOldNewSalesExpro.js'
export default {
    name: 'fgsOLD-page',
    data() {
        return {
            msg: 'fgsOLD-page',
            dataForm: {
                p_orgname: '',
                p_vouchdatestart: '',
                p_vouchdateend: ''
            },
            dataList: [],
            dataListLoading:false
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

                exportExcel(this.dataList, '分子公司老/新品销售表.xlsx')

            })
        },
        getDataList() {
            this.dataListLoading = true
            api.newoldcompanyAll(this.dataForm).then(res => {
                this.dataList = res
                console.log(this.dataList, 'this.dataList')
                // 计算合计  
                const total = this.dataList.reduce((acc, item) => {
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
                    sonname: '合计',
                    oldbox: total.oldbox.toFixed(0),
                    newbox: total.newbox.toFixed(0),
                    allbox: total.allbox.toFixed(0),
                    otherbox: total.otherbox.toFixed(0),
                };

                // 将合计对象添加到数据数组中  
                this.dataList.push(summary);
                this.dataList.forEach(item => {
                    item.oldbox = parseFloat(item.oldbox).toFixed(0); // 格式化 oldbox 
                    item.newbox = parseFloat(item.newbox).toFixed(0); // 格式化 newbox 
                    item.allbox = parseFloat(item.allbox).toFixed(0); // 格式化 allbox
                    item.otherbox = parseFloat(item.otherbox).toFixed(0)  ||0; // 格式化 allbox
                });
                
                this.dataListLoading = false
            })
        }
    }
};
</script>

<style scoped lang="scss">
::v-deep .table .el-table__cell {
    padding: 0px !important;

}

;

::v-deep th.el-table__cell>.cell {
    padding: 0px !important;
}

;

::v-deep .el-table__header-wrapper {
    font-size: 13px;
    background: #f5f7fa;
}

::v-deep .el-table .el-table__body-wrapper tbody tr:last-child {
    font-size: 15px;
    /* 根据需要设置字体大小 */
    font-weight: 600;
}

::v-deep .el-table th {
    background: #f5f7fa;
}
</style>