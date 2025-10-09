<template>
    <div class='BusinessTrack'>
        <el-form :inline="true" style="width: 60%; margin: 0 auto;">
            <el-form-item>
                <el-date-picker v-model="dataForm.p_vouchdatestart" value-format="yyyy-MM-dd" type="date"
                    placeholder="开始日期" clearable style="width: 100%"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-date-picker v-model="dataForm.p_vouchdateend" value-format="yyyy-MM-dd" type="date"
                    placeholder="结束日期" clearable style="width: 100%"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
                    @click="getdataListPer">查询</el-button>
            </el-form-item>
            <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                @click="exportData">导出</el-button>
        </el-form>
        <el-table class="table" ref="table" border :data="dataList" v-loading="dataListLoading"
            style="width: 60%; margin: 0 auto; margin-bottom: 50px;">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="sqname" label="销售区域/省区" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="companyname" label="分公司/办事处" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="goalvalue" label="当月目标" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box" label="当月销量" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="lastbox" label="上月销量" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="curbox" label="当天报单" />
            <!-- <el-table-column :show-overflow-tooltip="true" align="center" prop="box" label="当月累计" /> -->
            <el-table-column :show-overflow-tooltip="true" align="center" prop="rate" label="同比" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="ratio" label="环比" />
        </el-table>
    </div>
</template>

<script>
import * as api from '@/api/DQAPI/dqallApi.js'
import { data } from 'vue-echarts';
import {
    exportExcel
} from './BusinessTrackExpor.js'
import {
    mapGetters,
} from 'vuex'
export default {
    name: 'BusinessTrack-page',
    data() {
        return {
            msg: 'BusinessTrack-page',
            dataListLoading: false,
            dataList: [],
            dataListPre: [],
            dataForm: {
                p_vouchdateend: '',
                p_vouchdatestart: '',
                p_orgname: ''
            },
            dataForm3: {
                p_vouchdateend: '',
                p_vouchdatestart: '',
            },
            rudepts: '',
            // rudept1: '',
            rujobs: '',
            // rujobs1:''
        };
    },
    computed: {
        ...mapGetters(['dept', 'jobs'])
    },
    created() {
        this.calculateDates();
    },
    mounted() {
        this.rudepts = sessionStorage.getItem('Busdept');
        this.rujobs = sessionStorage.getItem('Busjobs');
        if (this.rujobs == '全部') {
            this.rujobs = sessionStorage.getItem('sf');
        }
        this.getdataListPer()
        console.log(9999, this.dept)
    },
    methods: {
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                exportExcel(this.dataList, '业务跟踪.xlsx')

            })
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
        //上期数据
        getdataListPer() {
            this.dataListLoading = true
            this.dataForm3.p_vouchdatestart = this.dataForm.p_vouchdatestart
            this.dataForm3.p_vouchdateend = this.dataForm.p_vouchdateend
            api.periodDataApi(this.dataForm3).then(res => {
                this.dataListPre = res
                this.dataListPre.forEach(item => {
                    item.box = Number(item.box).toFixed(0)
                })
                this.dataListPre.forEach(item => {
                    if (item.level_name) {
                        const levels = item.level_name.split(' -> ');
                        item.levelName1 = levels[0] || "";
                        // Remove digits from levelName2  
                        item.levelName2 = levels[1] ? levels[1].replace(/\d+/g, '').trim() : "";
                        item.levelName3 = levels[2] || "";
                    } else {
                        // Handle the case when levelName is undefined  
                        item.levelName1 = "";
                        item.levelName2 = "";
                        item.levelName3 = "";
                    }
                });
                this.dataListPre = Object.values(this.dataListPre.reduce((acc, item) => {
                    // 处理 levelName3 不为空的情况  
                    if (item.levelName3) {
                        const boxValue = Number(item.box);

                        // 检查是否存在相同的 levelName3  
                        if (!acc[item.levelName3]) {
                            // 如果没有，则创建一个新的对象  
                            acc[item.levelName3] = { ...item, box: boxValue };  // 保留合并的字段，并将 box 字段转为数字  
                        } else {
                            // 如果存在，相加 box 的值  
                            acc[item.levelName3].box += boxValue;
                        }
                    } else {
                        // levelName3 为空的情况，直接保留  
                        acc.push(item);  // 直接将这个对象加入 accumlate 数组  
                    }
                    return acc;
                }, [])); // 使用数组作为累积器，直接添加对象 
                this.getdataList()
                console.log(this.dataListPre, 5556666)

            })
        },
        getdataList() {
            // this.dataForm.p_orgname = this.rujobs
            this.dataForm.p_orgname = this.rujobs
            this.dataListLoading = true
            api.ordersqrateApi(this.dataForm).then(res => {
                this.dataList = res
                this.dataList.sort((a, b) => {
                    return b.ratio - a.ratio; // 从高到低排序  
                });
                this.dataList.forEach(item => {
                    item.sqname = item.sqname.replace(/\d+/g, '').trim()
                    item.box = Number(item.box).toFixed(0)
                    item.curbox = Number(item.curbox).toFixed(0)
                    item.lastbox = Number(item.lastbox).toFixed(0)
                    const ratio1 = Number(item.ratio) || 0;
                    item.ratio = (ratio1 * 100).toFixed(2) + '%';
                })
                this.dataListPre.forEach(preItem => {
                    this.dataList.forEach(dataItem => {
                        if (preItem.levelName3 === dataItem.companyname) {
                            // 如果匹配，将box字段直接赋值  
                            dataItem.boxsum = preItem.box; // 更新或添加box字段  
                        }
                    });
                });
                this.dataList.forEach(item => {
                    if (item.boxsum !== 0) { // 确保 boxsum 不为 0  
                        const rate = (item.box / item.boxsum) * 100; // 计算百分比  
                        item.rate = `${rate.toFixed(2)}%`; // 格式化为字符串并添加 '%' 符号  
                    } else {
                        item.rate = '0%'; // 如果 boxsum 为 0，将 rate 设置为 '0%'  
                    }
                });
                console.log(this.dataList)
                this.dataListLoading = false
            })
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