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
            <el-table-column :show-overflow-tooltip="true" align="center" width="150" prop="dateStr" label="订单日期" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="dateStrNoDash" label="订单张数" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="GMsite" label="光明站点" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="cProductName" label="产品" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box" label="数量" />
        </el-table>
    </div>
</template>

<script>
import * as api from '@/api/frame/customer.js'
import {
    exportExcel
} from './XinanNomalGMExpro.js'
export default {
    name: 'XinanNomalGM-page',
    data() {
        return {
            msg: 'XinanNomalGM-page',
            dataList: [],
            dataForm: {
                p_vouchdatestart: '',
                p_vouchdateend: ''
            },
            dataListLoading: false,
            bullay: '',
            dateStr: '',
            dateStrNoDash: ''
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
            this.dateStr = (this.addTwoDays(this.dataForm.p_vouchdateend)).replace(/-/g, '')
            this.dateStrNoDash = this.dateStr.replace(/-/g, '') + 'SC';

            console.log(this.dateStrNoDash)
            this.dataForm.p_vouchdatestart = this.dataForm.p_vouchdateend
            console.log(this.dataForm)
            api.XinanNomalSite(this.dataForm).then(res => {
                this.dataList = res
                this.dataList = this.mergeBoxByProductCode(this.dataList)
                this.dataList.forEach(obj => {
                    obj.GMsite = "雨帆自提";
                    obj.dateStr = this.dateStr
                });
                this.dataList.forEach((item, index) => {
                    const sequenceNumber = (index + 1).toString().padStart(4, '0'); // '0001', '0002', ...
                    item.dateStrNoDash = this.dateStrNoDash + sequenceNumber;
                });

                console.log(this.dataList)
            })

        },
        mergeBoxByProductCode(arr) {
            const result = [];
            const map = new Map();

            // 遍历数组
            for (const item of arr) {
                const code = item.cProductCode;
                const boxValue = Number(item.box) || 0; // 转换为数字，无法转换则默认为0

                if (map.has(code)) {
                    // 如果已有相同cProductCode，则累加box值
                    map.get(code).box += boxValue;
                } else {
                    // 如果没有，则创建新对象并存入Map
                    const newItem = { ...item, box: boxValue };
                    map.set(code, newItem);
                    result.push(newItem);
                }
            }

            return result;
        },
        //加两天
        addTwoDays(dateStr) {
            // 将字符串转换为 Date 对象
            let dateObj = new Date(dateStr);

            // 在原日期基础上加两天
            dateObj.setDate(dateObj.getDate() + 2);

            // 格式化为 'yyyy-mm-dd'
            let year = dateObj.getFullYear();
            let month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
            let day = dateObj.getDate().toString().padStart(2, '0');

            return `${year}-${month}-${day}`;
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
                exportExcel(this.dataList, '西南常温产品发货表.xlsx')
            })
        },
    }
};
</script>

<style scoped lang="scss"></style>