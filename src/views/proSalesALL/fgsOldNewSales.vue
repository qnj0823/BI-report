<template>
    <div class='fgsOLD'>
        <el-form :inline="true" style="width: 60%; margin: 5px auto;">
            <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                @click="exportData">导出</el-button>
            <el-button class="filter-item" size="mini" type="primary" @click="Enterdetails">站点详情</el-button>
        </el-form>
        <el-table class="table" ref="table" border v-loading="dataListLoading" :data="finalResult"
            style="width: 60%; margin: 0 auto; margin-bottom: 50px;">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="ocustomerClass_name" label="分公司办事处" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="oldbox" label="老品" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="oldrate" label="老品百分比" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="newbox" label="新品" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="newrate" label="新品百分比" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="otherbox" label="其它品" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="otherrate" label="其它品百分比" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="sum" label="小计" />
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
            finalResult: [],
            dataListLoading: false
        };
    },
    mounted() {
        this.dataForm.p_orgname = this.$route.query.param1;
        this.dataForm.p_vouchdatestart = this.$route.query.startdate;
        this.dataForm.p_vouchdateend = this.$route.query.enddata;
        this.getDataList()
    },
    methods: {
        Enterdetails() {
            this.$router.push({
                path: '/proSalesALL/oldnewDetails',
                query: {
                    param1: this.dataForm.p_orgname,
                    enddata: this.dataForm.p_vouchdateend,
                    startdate: this.dataForm.p_vouchdatestart
                }
            });
        },
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                exportExcel(this.finalResult, '分子公司老/新品销售表.xlsx')

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
                console.log(this.dataList, 'this.dataList')

                const result = {};
                this.dataList.forEach(item => {
                    const key = `${item.sqname}-${item.ocustomerClass_name}`;

                    // 如果结果中还没有这个键,初始化一个对象
                    if (!result[key]) {
                        result[key] = {
                            sqname: item.sqname,
                            ocustomerClass_name: item.ocustomerClass_name,
                            oldbox: 0,
                            newbox: 0,
                            otherbox: 0,
                            sum: 0
                        };
                    }

                    // 将字段值转换为数字并累加
                    result[key].oldbox += parseFloat(item.oldbox) || 0;
                    result[key].newbox += parseFloat(item.newbox) || 0;
                    result[key].otherbox += parseFloat(item.otherbox) || 0;
                    // 计算每个对象的总和并保留两位小数  
                    result[key].sum = parseFloat((result[key].oldbox + result[key].newbox + result[key].otherbox).toFixed(2));

                });

                // 将结果转换为数组
                this.finalResult = Object.values(result);
                console.log(this.finalResult)
                // 初始化合计对象
                const total = {
                    sqname: '',
                    ocustomerClass_name: '合计',
                    oldbox: 0,
                    newbox: 0,
                    otherbox: 0,
                    sum: 0
                };

                // 遍历数组，累加字段值
                this.finalResult.forEach(item => {
                    total.oldbox += parseFloat(item.oldbox);
                    total.newbox += parseFloat(item.newbox);
                    total.otherbox += parseFloat(item.otherbox);
                    total.sum += parseFloat(item.sum);
                });

                // 将合计对象添加到原数组的最后
                this.finalResult.push(total);

                this.finalResult.forEach(item => {
                    item.sqname = item.sqname.replace(/\d+/g, '')
                    item.sum = parseFloat(item.sum.toFixed(2))
                    item.oldbox = parseFloat(item.oldbox.toFixed(2))
                    item.newbox = parseFloat(item.newbox.toFixed(2))
                    item.otherbox = parseFloat(item.otherbox.toFixed(2))

                    // 计算 oldrate，确保 sum 不为零以避免除零错误  
                    if (item.sum !== 0) {
                        item.oldrate = ((item.oldbox / item.sum) * 100).toFixed(2) + '%'; // 转换为百分数，并保留两位小数  
                        item.newrate = ((item.newbox / item.sum) * 100).toFixed(2) + '%'; // newrate 计算  
                        item.otherrate = ((item.otherbox / item.sum) * 100).toFixed(2) + '%'; // otherrate 计算 
                    } else {
                        item.oldrate = '0.00%'; // 如果 sum 为零，设置为 0% 
                        item.oldrate = '0.00%';    // 如果 sum 为零，设置为 0%  
                        item.newrate = '0.00%';    // 如果 sum 为零，设置为 0%  
                        item.otherrate = '0.00%';   // 如果 sum 为零，设置为 0%  
                    }
                })


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