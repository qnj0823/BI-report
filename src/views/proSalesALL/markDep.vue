<template>
    <div class='pursue'>

        <div>
            <el-form :inline="true" style="width: 100%; margin-top: 10px;" :model="dataForm" @submit.native.prevent>
                <el-form-item>
                    <el-date-picker v-model="dataForm.p_vouchdatecur" value-format="yyyy-MM-dd" type="date"
                        placeholder="选择日期" clearable style="width: 100%"></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
                        @click="getdataListPer">查询</el-button>
                    <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                        @click="exportData">导出</el-button>
                </el-form-item>
            </el-form>
            <el-table class="table" ref="table" v-loading="dataListLoading" :data="dataList" style=" width: 100%; ">
                <el-table-column :show-overflow-tooltip="true" align="center" prop="levelName1" label="战区" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="levelName3" label="单位体" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="goalvalue" label="签订人" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="sumallorder_today"
                    label="今日报单（全品）" />
                <el-table-column :show-overflow-tooltip="true" :label="getTotalTarget()" align="center">
                    <el-table-column :show-overflow-tooltip="true" align="center" prop="sumlooknumLeiji" label="老品">
                        <el-table-column :show-overflow-tooltip="true" align="center" prop="sumLookLowNum_leiji"
                            label="低温系列+330/310">
                        </el-table-column>
                        <el-table-column :show-overflow-tooltip="true" align="center" prop="sumyuanweinumLeiji"
                            label="同比增幅">
                        </el-table-column>
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" align="center" label="新品（标准件）">
                        <el-table-column :show-overflow-tooltip="true" align="center" prop="sumLookNormalNum_leiji"
                            label="常温系列">
                        </el-table-column>
                        <el-table-column :show-overflow-tooltip="true" align="center" prop="sumYeZiNum_leiji"
                            label="1L椰子牛乳">
                        </el-table-column>
                        <el-table-column :show-overflow-tooltip="true" align="center" prop="sumyuanweinumLeiji"
                            label="椰子汁系列">
                        </el-table-column>
                        <el-table-column :show-overflow-tooltip="true" align="center" prop="sumGuoZhiNum_leiji"
                            label="果汁系列">
                        </el-table-column>
                    </el-table-column>
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="sum_leiji_all"
                    :label="getTotalTarget1()" />
                <!-- <el-table-column :show-overflow-tooltip="true" align="center" prop="completion_rate" label="全品完成率" /> -->
                <el-table-column :show-overflow-tooltip="true" align="center" prop="" label="全品累计增幅" />
            </el-table>
        </div>
    </div>
</template>

<script>
import * as oapi from '@/api/DQAPI/dqallApi.js'
import * as api from '@/api/sales/salesAll.js'
import {
    exportExcel
} from './markDepExpro.js'
import * as echarts from 'echarts';
import { data } from 'vue-echarts';
export default {
    name: 'pursue-page',
    data() {
        return {
            msg: 'pursue-page',
            dataForm: {
                p_vouchdatecur: ''
            },
            dataForm3: {
                p_vouchdateend: '',
                p_vouchdatestart: '',
            },
            myChart: null,
            option: null,
            dataList: [],
            categories1: [],
            dataList1: [],
            dataListLoading: false
        };
    },
    created() {
        this.getCurrentDate()
    },
    mounted() {
        this.getdataListPer()

    },

    methods: {

        getTotalTarget() {
            // 从字符串中创建一个 Date 对象  
            const date = new Date(this.dataForm.p_vouchdatecur);
            // 获取月份（注意：月份从0开始，因此需要加1）  
            const month = date.getMonth() + 1; // 结果是 4  
            return `${month}月累计报单`;
        },
        getTotalTarget1() {
            // 从字符串中创建一个 Date 对象  
            const date = new Date(this.dataForm.p_vouchdatecur);
            // 获取月份（注意：月份从0开始，因此需要加1）  
            const month = date.getMonth() + 1; // 结果是 4  
            return `${month}月累计报单(全品)`;
        },
        //获取初始时间
        getCurrentDate() {
            const date = new Date();
            const year = date.getFullYear();
            let startmonth = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1
            let startday = String(date.getDate()).padStart(2, '0');
            let currentDate = `${year}-${startmonth}-${startday}`;
            this.dataForm.p_vouchdatecur = currentDate
            console.log(currentDate)
        },
        //上期数据
        getdataListPer() {
            this.dataListLoading = true
            this.dataForm3.p_vouchdatestart = this.dataForm.p_vouchdatecur
            this.dataForm3.p_vouchdateend = this.dataForm.p_vouchdatecur
            oapi.periodDataApi(this.dataForm3).then(res => {
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
                this.getDataList()
                console.log(this.dataListPre, 5556666)

            })
        },
        getDataList() {
            this.dataListLoading = true
            api.BdprojectTeamallcompany(this.dataForm).then(res => {
                this.dataList = res
                this.dataList.forEach(item => {
                    const levels = item.ocustomerClass_name.split(' -> ');
                    item.levelName1 = levels[0] || "";
                    // 去掉 levelName2 中的数字  
                    item.levelName2 = levels[1] ? levels[1].replace(/\d+/g, '').trim() : "";
                    item.levelName3 = levels[2] || "";
                });
                this.dataList = this.dataList.filter(item => item.levelName3 !== "");
                this.dataList = this.dataList.map(item => {
                    return {
                        sumGuoZhiNum_leiji: parseFloat(item.sumGuoZhiNum_leiji).toFixed(0),
                        sumLookLowNum_leiji: parseFloat(item.sumLookLowNum_leiji).toFixed(0),
                        sumLookNormalNum_leiji: parseFloat(item.sumLookNormalNum_leiji).toFixed(0),
                        sumYeZiNum_leiji: parseFloat(item.sumYeZiNum_leiji).toFixed(0),
                        sum_leiji_all: parseFloat(item.sum_leiji_all).toFixed(0),
                        sumallorder_today: parseFloat(item.sumallorder_today).toFixed(0),
                        ocustomerClass_name: item.ocustomerClass_name,
                        // goalvalue: item.goalvalue,
                        // completion_rate: item.completion_rate,
                        levelName1: item.levelName1,
                        levelName2: item.levelName2,
                        levelName3: item.levelName3
                    };
                });

                this.dataList.forEach(item => {
                    item.ocustomerClass_name = item.ocustomerClass_name.replace(/\d+/g, '').trim();
                });
                // this.dataList.forEach(item => {
                //     // 检查 goalvalue 和 sum_leiji_all 是否都是 0  
                //     if (parseFloat(item.goalvalue) === 0 && parseFloat(item.sum_leiji_all) === 0) {
                //         item.completion_rate = '0.00%';
                //     }
                //     //  else {
                //     //   // 计算 completion_rate  
                //     //   // 这里可以根据需求按实际逻辑计算 completion_rate，如果有需要  
                //     //   // 举个例子：将满足条件的 completion_rate 设置为一个计算值  
                //     //   let completion = (parseFloat(item.sum_leiji_all) / parseFloat(item.goalvalue)) * 100;
                //     //   item.completion_rate = `${completion.toFixed(2)}%`;
                //     // }
                // });
                // // 如果要按降序排序，可以反转比较：  
                // this.dataList = this.dataList.sort((a, b) => {
                //     const rateA = parseFloat(a.completion_rate) / 100;
                //     const rateB = parseFloat(b.completion_rate) / 100;

                //     return rateB - rateA; // 降序排序  
                // });
                // 计算合计  
                const total = this.dataList.reduce((acc, item) => {
                    acc.sumGuoZhiNum_leiji += parseFloat(item.sumGuoZhiNum_leiji);
                    acc.sumLookLowNum_leiji += parseFloat(item.sumLookLowNum_leiji);
                    acc.sumLookNormalNum_leiji += parseFloat(item.sumLookNormalNum_leiji);
                    acc.sumYeZiNum_leiji += parseFloat(item.sumYeZiNum_leiji);
                    acc.sum_leiji_all += parseFloat(item.sum_leiji_all);
                    acc.sumallorder_today += parseFloat(item.sumallorder_today);
                    // acc.goalvalue += parseFloat(item.goalvalue);
                    return acc;
                }, {
                    sumGuoZhiNum_leiji: 0,
                    sumLookLowNum_leiji: 0,
                    sumLookNormalNum_leiji: 0,
                    sumYeZiNum_leiji: 0,
                    sum_leiji_all: 0,
                    sumallorder_today: 0,
                    // goalvalue: 0
                });

                // 添加合计对象  
                const summary = {
                    levelName3: '合计',
                    sumGuoZhiNum_leiji: total.sumGuoZhiNum_leiji.toFixed(0),
                    sumLookLowNum_leiji: total.sumLookLowNum_leiji.toFixed(0),
                    sumLookNormalNum_leiji: total.sumLookNormalNum_leiji.toFixed(0),
                    sumYeZiNum_leiji: total.sumYeZiNum_leiji.toFixed(0),
                    sum_leiji_all: total.sum_leiji_all.toFixed(0),
                    sumallorder_today: total.sumallorder_today.toFixed(0),
                    // goalvalue: total.goalvalue.toFixed(0),
                    // completion_rate: (total.sum_leiji_all / total.goalvalue * 100).toFixed(2) + '%' // 转换为百分比  
                };

                // 将合计对象添加到数据数组中  
                this.dataList.push(summary);
                this.dataListPre.forEach(preItem => {
                    this.dataList.forEach(dataItem => {
                        if (preItem.levelName3 === dataItem.levelName3) {
                            // 如果匹配，将box字段直接赋值  
                            dataItem.box = preItem.box; // 更新或添加box字段  
                        }
                    });
                });
                console.log(this.dataList, 5566)


                this.categories1 = this.dataList
                    .filter(item => item.ocustomerClass_name !== '合计') // 先过滤掉 "合计"  
                    .map(item => item.ocustomerClass_name); // 然后提取 ocustomerClass_name  
                this.dataList1 = this.dataList
                    .filter(item => item.ocustomerClass_name !== '合计') // 先过滤掉 "合计" 
                // console.log(this.dataList1)
                this.dataListLoading = false
            })

        },
        exportData() {
            this.$confirm('是否导出表格数据到Excel？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                exportExcel(this.dataList, '目标销量表.xlsx')
                // this.dataListLoading = true
                // api.BdallCustomer(this.dataForm1).then(res => {
                //   this.exportList = res
                //   this.exportList.forEach(item => {
                //     const levels = item.levelName.split(' -> ');
                //     item.levelName1 = levels[0] || "";
                //     // 去掉 levelName2 中的数字  
                //     item.levelName2 = levels[1] ? levels[1].replace(/\d+/g, '').trim() : "";
                //     item.levelName3 = levels[2] || "";
                //     this.dataListLoading = false
                //   });
                //   console.log(this.exportList)
                //   // return
                //   exportExcel(this.exportList, '业务框架/客户表.xlsx')
                // })
            })
        },
    }
};
</script>

<style scoped lang="scss">
::v-deep .table .el-table__cell {
    padding: 0px !important;
}
</style>