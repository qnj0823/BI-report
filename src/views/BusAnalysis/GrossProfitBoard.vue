<template>
    <div class='GrossProfitBoard'>
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
                    @click="getDateList">查询</el-button>
            </el-form-item>
            <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                @click="exportData">导出</el-button>
        </el-form>
        <el-table ref="table" v-loading="dataListLoading" :data="currentData" style="width: 100%;">
            <el-table-column width="100" align="center" prop="vouchdate" label="订单日期" />
            <el-table-column :show-overflow-tooltip="true" width="180" align="center" prop="cOrderNo" label="单位体" />
            <el-table-column :show-overflow-tooltip="true" width="180" align="center" prop="cName" label="客户名称" />
            <el-table-column :show-overflow-tooltip="true" width="100" align="center" prop="levelName1" label="毛利额" />
            <el-table-column :show-overflow-tooltip="true" width="100" align="center" prop="levelName2" label="毛利率" />
        </el-table>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'GrossProfitBoard-page',
    data() {
        return {
            msg: 'GrossProfitBoard-page',
            dataForm: {
                p_vouchdateend: '',
                p_vouchdatestart: '',
            },
            dataListLoading: false,
            dataList: [],
        };
    },
    mounted() {
    },
    methods: {
        async getDateList() {
            this.dataListLoading = true;
            this.error = null;
            try {
                const response = await axios.get(
                    'http://sc.yufanjtbip.com:8090/api/productHumanResourcesPlanProcess/all_net',
                );
                this.dataList = response.data;
                this.dataListLoading = false;
                console.log(this.dataList)
            } catch (err) {
                this.error = err.message || '请求失败';
            } finally {
                this.loading = false;
            }
        },
    }
};
</script>

<style scoped lang="scss"></style>