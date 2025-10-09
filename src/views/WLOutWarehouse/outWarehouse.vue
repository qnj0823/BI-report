<template>
    <div class='outWarehouse'>
        <el-table class="table" ref="table" border :data="currentData" v-loading="dataListLoading"
            style="width: 100%; margin: 0 auto; margin-bottom: 50px;">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="totalDate" label="订单时间" />
            <el-table-column :show-overflow-tooltip="true" align="center" width="190" prop="orderoutNumber"
                label="订单号" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="cuCode" label="客户编码" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="cuName" width="190" label="客户名称" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="pNo" width="150" label="产品编码">
                <template #default="{ row }">
                    <div style="white-space: normal;">
                        <!-- 直接遍历 pNo 数组（不再需要 split('--')） -->
                        <div v-for="(product, index) in row.pNo" :key="index"
                            style="margin-bottom: 4px; line-height: 1.5;">
                            {{ product.trim() }}
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" width="330" prop="pname" label="产品名称">
                <template #default="{ row }">
                    <div style="white-space: normal;">
                        <!-- 直接遍历 pname 数组（不再需要 split('--')） -->
                        <div v-for="(product, index) in row.pname" :key="index"
                            style="margin-bottom: 4px; line-height: 1.5;">
                            {{ product.trim() }}
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="count" label="订单数">
                <template #default="{ row }">
                    <div style="white-space: normal;">
                        <!-- 直接遍历 count 数组（不再需要 split('--')） -->
                        <div v-for="(product, index) in row.count" :key="index"
                            style="margin-bottom: 4px; line-height: 1.5;">
                            {{ product.trim() }}
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="midUnit" label="单位" />
            <el-table-column header-align="center" align="center" width="150" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small"
                        @click="addOrUpdateHandle(scope.row.corderno, scope.row)">出库</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination style="width: 90%; margin: 0 auto; " @size-change="sizeChangeHandle" ref="pagination"
            @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20, 40, 60, 80, 100, 1000]"
            :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="dataList.length">
        </el-pagination>
    </div>
</template>

<script>
import * as api from '@/api/WLOutWarehouseAPI/WLOutWarehouse.js'
export default {
    props: {
        startDate: {
            type: String,
            default: ''
        },
        endDate: {
            type: String,
            default: ''
        }
    },
    name: 'outWarehouse-page',
    data() {
        return {
            msg: 'outWarehouse-page',
            dataForm: {
                p_vouchdatestart: '',
                p_vouchdateend: ''
            },
            orderList: [],
            currentData: [],
            currentPage: 1,
            pageSize: 20,
            totalItems: 0,

        };
    },
    
    mounted() {
        
    },
    methods: {
        getDataList(){
            this.dataForm.p_vouchdatestart = this.startDate
            this.dataForm.p_vouchdateend = this.endDate
            api.ptsNccOrderStopApi(this.dataForm).then(res => {
                console.log(res)
            })
            console.log(this.startDate,this.endDate)
        }
    }
};
</script>

<style scoped lang="scss"></style>