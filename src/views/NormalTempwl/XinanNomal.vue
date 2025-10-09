<template>
    <div class='XinanNomal'>
        <el-form :inline="true" style="margin-top: 10px;" :model="dataForm" @submit.native.prevent>
            <!-- <el-form-item>
                <el-date-picker v-model="dataForm.p_vouchdateend" value-format="yyyy-MM-dd" type="date"
                    placeholder="开始日期" clearable style="width: 100%"></el-date-picker>
            </el-form-item> -->
            <el-form-item>
                <el-date-picker v-model="dataForm.p_vouchdateend" value-format="yyyy-MM-dd" type="date"
                    placeholder="截至日期" clearable style="width: 100%"></el-date-picker>
            </el-form-item>

            <!-- <el-form-item>
                <el-input v-model="bullay" placeholder="模糊搜索" clearable @keyup.enter.native="searchEnterFun()"
                    ref="searchInput"></el-input>
            </el-form-item> -->
            <el-form-item>
                <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
                    @click="getDataList()">查询</el-button>
                <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                    @click="exportData">导出</el-button>
            </el-form-item>
        </el-form>
        <el-table border ref="table" v-loading="dataListLoading" :data="dataList" style="width: 100%;">
            <el-table-column :show-overflow-tooltip="true" align="center" width="150" prop="vcol6_name" label="物流站点" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100028" label="常温300(经典版)" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100027" label="常温300(宴席版)" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="sum" label="合计" />
        </el-table>
    </div>
</template>

<script>
import * as api from '@/api/frame/customer.js'
import {
    exportExcel
} from './XinanNomalExpro.js'
export default {
    name: 'XinanNomal-page',
    data() {
        return {
            msg: 'XinanNomal-page',
            dataList: [],
            dataForm: {
                p_vouchdatestart: '',
                p_vouchdateend: ''
            },
            dataListLoading: false,
            bullay: ''
        };
    },
    created() {
        this.calculateCurrentYearDates();
    },
    mounted() {
        this.getDataList()
    },
    methods: {
        getDataList() {
            this.dataForm.p_vouchdatestart = this.dataForm.p_vouchdateend
            console.log(this.dataForm)
            api.XinanNomalSite(this.dataForm).then(res => {
                this.dataList = res
                this.dataList = this.dataList.map(item => ({
                    ...item, // 展开原对象的所有属性
                    ["box" + item.cProductCode]: parseFloat(Number(item.box).toFixed(2)) // 新增动态属性
                }));
                ///数据合并（根据wlSiteCode分组）
                this.dataList = this.mergeDataList(this.dataList);
                //计算小计
                this.dataList = this.dataList.map(item => {
                    let sum = 0;
                    for (const key in item) {
                        // 跳过保留字段
                        if (['areaName', 'days', 'wlSiteCode', 'wlSiteName'].includes(key)) continue;
                        // 其他字段转为数字并累加
                        sum += Number(item[key]) || 0;
                    }
                    // 返回新对象（保留原字段 + 新增 sum）
                    return { ...item, sum };
                });
                console.log(this.dataList)
                this.dataList = this.sumObjectsToTotal(this.dataList)

            })

        },
        sumObjectsToTotal(arr) {
            // 1. 初始化总计对象
            const totalObj = { vcol6_name: "总计" };

            // 2. 遍历每个对象
            arr.forEach(obj => {
                Object.keys(obj).forEach(key => {
                    // 跳过 vcol6_name 字段
                    if (key === "vcol6_name") return;

                    // 初始化字段（如果尚未存在）
                    if (totalObj[key] === undefined) {
                        totalObj[key] = 0;
                    }

                    // 转换为数字并累加（处理可能的非数字值）
                    const numValue = Number(obj[key]) || 0;
                    totalObj[key] += numValue;
                });
            });

            // 3. 将总计对象添加到原数组末尾
            return [...arr, totalObj];
        },

        //数据合并（根据wlSiteCode分组）
        mergeDataList(dataList) {
            return Object.values(
                dataList.reduce((acc, item) => {
                    const key = item.vcol6_name; // 使用 wlSiteCode 作为分组依据

                    if (!acc[key]) {
                        // 初始化新对象，并删除不合并的字段
                        acc[key] = { ...item }; // 先复制所有字段

                        // 删除不合并的字段
                        const fieldsToRemove = [
                            'box',
                            'cProductCode',
                            'cProductName',
                            'pK_AREACL_NAME',
                            'piece',
                            'salesOrgId',
                            'salesOrgName',
                            'vcol6_code'
                        ];
                        fieldsToRemove.forEach(field => delete acc[key][field]);
                    } else {
                        // 合并其他字段（如 jtProductCode）
                        Object.keys(item).forEach(field => {
                            // 如果字段不在排除列表，则合并
                            if (![
                                'box',
                                'cProductCode',
                                'cProductName',
                                'pK_AREACL_NAME',
                                'piece',
                                'salesOrgId',
                                'salesOrgName',
                                'vcol6_code'
                            ].includes(field)) {
                                acc[key][field] = item[field]; // 后出现的值会覆盖前面的
                            }
                        });
                    }

                    return acc;
                }, {})
            );
        },

        // 获取今年的日期数据
        calculateCurrentYearDates() {
            const today = new Date();

            // 获取当前月份的月初时间 
            const startOfMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);
            this.startOfMonth = this.formatDate(startOfMonthDate);

            // 获取截至今天的时间 
            this.endOfToday = this.formatDate(today);

            // this.dataForm.p_vouchdatestart = this.startOfMonth;
            this.dataForm.p_vouchdatestart = this.endOfToday;
            this.dataForm.p_vouchdateend = this.endOfToday;
        },
        // 格式化日期
        formatDate(date) {
            this.year = date.getFullYear();
            this.month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1 
            this.day = String(date.getDate()).padStart(2, '0');
            return `${this.year}-${this.month}-${this.day}`;
        },
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                exportExcel(this.dataList, this.dataForm.p_vouchdateend, '常温产品发货表.xlsx')
            })
        },
    }
};
</script>

<style scoped lang="scss"></style>