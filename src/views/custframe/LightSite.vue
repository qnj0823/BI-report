<template>
    <div class='Light'>
        <el-form :inline="true" style="margin-top: 10px;" :model="dataForm" @submit.native.prevent>
            <el-form-item>
                <el-button :type="selectedButton === 'site' ? 'warning' : 'success'" @click="selectButton('site')">站点排序
                </el-button>
                <el-button :type="selectedButton === 'product' ? 'warning' : 'success'"
                    @click="selectButton('product')">光明产品排序
                </el-button>
            </el-form-item>
        </el-form>
        <el-form :inline="true" style="margin-top: 10px;" :model="dataForm" @submit.native.prevent>
            <el-form-item>
                <el-input v-model="seek" placeholder="模糊搜索" clearable @keyup.enter.native="searchEnterFun()"
                    ref="searchInput"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getDataList('湖北')">湖北</el-button>
                <el-button type="primary" @click="getDataList('湖南')">湖南</el-button>
                <el-button type="primary" @click="getDataList('四川')">四川</el-button>
                <el-button type="primary" @click="getDataList('重庆')">重庆</el-button>
                <el-button type="primary" @click="getDataList('云南')">云南</el-button>
                <el-button type="primary" @click="getDataList('贵州')">贵州</el-button>
                <el-button type="primary" @click="getDataList('安徽')">安徽</el-button>
                <el-button type="primary" @click="getDataList('河南')">河南</el-button>
                <el-button type="primary" @click="getDataList('广东')">广东</el-button>
                <el-button type="primary" @click="getDataList('江西')">江西</el-button>
                <el-button type="primary" @click="getDataList('陕西')">陕西</el-button>
                <el-button type="primary" @click="getDataList('福建')">福建</el-button>
                <el-button type="primary" @click="getDataList('江苏')">江苏</el-button>
                <el-button type="primary" @click="getDataList('浙江')">浙江</el-button>
                <!-- <el-button type="primary" @click="getDataList('陕西')">陕西</el-button> -->
                <!-- <el-button type="primary" @click="getDataList('浙江')">浙江</el-button>
                <el-button type="primary" @click="getDataList('浙江')">福建</el-button> -->
                <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                    @click="exportData">导出</el-button>
            </el-form-item>
        </el-form>
        <!-- 站点排序 -->
        <div v-if="show">
            <el-button class="filter-item" size="mini" type="success" icon="el-icon-plus"
                @click="addOrUpdateHandle()">新增站点</el-button>
            <el-table ref="table" v-loading="dataListLoading" :data="dataList" style="width: 100%;">
                <el-table-column :show-overflow-tooltip="true" align="center" prop="orderid" label="序号" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="areaname" label="销售区域" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="sitecode" label="光明站点code" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="sitename" label="光明站点" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="store" label="仓库" />
                <el-table-column header-align="center" align="center" width="150" label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small"
                            @click="addOrUpdateHandle(scope.row.id, scope.row)">修改</el-button>
                        <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 光明产品排序 -->
        <add-or-update v-else ref="product" :test="test" :message="childMessage"></add-or-update>
        <!-- 表单弹窗, 新增数据和修改数据 -->
        <LightAdd v-if="addOrUpdateVisible" ref="addOrUpdate" @close="addOrUpdateVisible = false"
            @refreshDataList="getDataList"></LightAdd>
    </div>
</template>

<script>
import * as api from '@/api/frame/customer.js'
import AddOrUpdate from './LightSiteProduct'
import LightAdd from './LightSite-add-updata'
import {
    exportExcel
} from './LightSiteExpro.js'
export default {
    name: 'Light-page',
    components: {
        AddOrUpdate,
        LightAdd
    },
    data() {
        return {
            msg: 'Light-page',
            selectedButton: 'site',
            dataForm: {
                page: 0,
                size: 5000
            },
            dataList: [],
            childMessage: '',
            test: '',
            dataListLoading: false,
            show: true,
            bullay: '',
            seek: '',
            addOrUpdateVisible: false,
        };
    },
    mounted() {
        this.getDataList()
    },
    methods: {
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                exportExcel(this.dataList, '光明站点排序.xlsx')

            })
        },
        // 新增 / 修改
        addOrUpdateHandle(id, data) {
            this.addOrUpdateVisible = true
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(id, data)
            })
        },
        selectButton(button) {
            this.selectedButton = button; // 设置当前激活的按钮  
            // 这里可以调用相应的函数，例如：  
            if (button === 'site') {
                this.sortSite();
            } else {
                this.sortProduct();
            }
        },
        sortSite() {
            this.show = true
        },
        sortProduct() {
            this.show = false
        },
        getDataList(bully) {
            this.childMessage = bully || '湖北'
            this.test = this.seek
            if (this.show == false) {
                this.$nextTick(() => {
                    this.$refs.product.getDataList()
                })
            }
            this.bullay = bully || '湖北'
            this.dataListLoading = true
            api.BDSiteFactorycheckApi(this.dataForm).then(res => {
                this.dataList = res.content
                // this.dataList = this.dataList.filter(item =>
                //     item.areaname.toLowerCase().includes(this.bullay)
                // );
                // this.dataList = this.dataList.filter(item =>
                //     item.sitename.includes(this.seek)
                // );
                this.dataList = this.dataList.filter(item => {
                    // 1. 先判断 areaname 是否存在且为字符串
                    if (typeof item.areaname !== 'string') {
                        return false; // 非字符串类型直接过滤（或根据需求处理）
                    }
                    // 2. 确保 this.bullay 是字符串（避免 includes 传入非字符串导致的问题）
                    const bullayStr = typeof this.bullay === 'string' ? this.bullay : '';
                    // 3. 安全调用 toLowerCase() 和 includes()
                    return item.areaname.toLowerCase().includes(bullayStr);
                });
                this.dataList = this.dataList.filter(item => {
                    // 确保 sitename 存在且是字符串，再调用 includes()
                    return typeof item.sitename === 'string' && item.sitename.includes(this.seek);
                });
                this.dataList = this.dataList.sort((a, b) => {
                    return a.orderid - b.orderid; // 升序排序  
                    // 如果需要降序排序，可以使用: return b.orderId - a.orderId;  
                });
                console.log(this.dataList)
                this.dataListLoading = false
            })
        },
        //删除
        deleteHandle(id) {
            var ids = id ? [id] : this.dataListSelections.map(item => {
                return item.id
            })
            this.$confirm(`您确定对[ids=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                console.log('删除', ids);
                api.BDSiteFactorydelApi(ids).then(res => {
                    // TODO 处理删除
                    this.$emit('refreshDataList')
                    this.$emit('close')
                    this.$message.success('删除成功')
                    this.getDataList()
                })
            })

        },

    }
};
</script>

<style scoped lang="scss"></style>