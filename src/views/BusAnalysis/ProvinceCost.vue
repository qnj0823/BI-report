<template>
    <div class='exDetils'>
        <!-- <el-form :inline="true" style="width: 100%; margin: 0 auto;">
        <el-form-item>
          <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
            @click="exportData">导出</el-button>
        </el-form-item>
      </el-form> -->
        <sqcathadd v-if="addOrUpdateVisible" @sqDataList="getDataList" ref="sqaddOrUpdate"
            @close="addOrUpdateVisible = false"></sqcathadd>
        <el-table ref="table" v-loading="dataListLoading" :data=" this.dataList" style="width: 100%;">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="orgname" label="采购组织" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="supplierName" label="供应商" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="code" label="产品编号" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="name" label="产品名称 " />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="nastorigtaxprice" label="价格" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="sqname" label="销售区域/省区" />
            <el-table-column header-align="center" align="center" width="100" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row)">添加</el-button>
                    <!-- <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row)">修改</el-button> -->
                </template>
            </el-table-column>

        </el-table>
    </div>
</template>

<script>
import * as api from '@/api/frame/customer.js'
import sqcathadd from './ProvinceCost-add-updata-add'
export default {
    name: 'exDetils-page',
    components: {
        sqcathadd
    },
    data() {
        return {
            msg: 'exDetils-page',
            dataList: [],
            allList: [],
            dataListLoading: false,
            addOrUpdateVisible: false,
            uniqueObjects: [],
            result:[]
        };
    },
    mounted() {

        this.getDataList()
    },
    methods: {
        getDataList() {
            api.SupplierpriceApi().then(res => {
                this.dataList = res
                console.log(this.dataList)
                this.getallList()

            })
        },
        isUnique(obj) {
            return obj && obj.sqname !== undefined && uniqueObjects.findIndex(item => item.code === obj.code && item.nativetaxprice === obj.nativetaxprice && item.sqname === obj.sqname) === -1;
        },
        getallList() {

            // 遍历 dataList  
            api.SupplierpriceallApi().then(res => {
                const spList = res; // 将接口返回的 spList 存储到组件的数据中  
                console.log(this.spList, 66666)
                const resultList = [];

                // 遍历 dataList 的每一个对象  
                this.dataList.forEach(dataItem => {
                    // 过滤 spList 中与当前 dataItem 的 pK_SUPPLIERPRICE 匹配的对象  
                    const matched = spList.filter(spItem => spItem.sqid === dataItem.pK_SUPPLIERPRICE);

                    if (matched.length > 0) {
                        // 对于每个匹配的对象，复制 dataItem 并将 sqname 添加到其中  
                        matched.forEach(match => {
                            const newItem = { ...dataItem, sqname: match.sqname }; // 复制并添加 sqname  
                            resultList.push(newItem); // 将新对象添加到结果数组中  
                        });
                    } else {
                        // 如果没有匹配，仍然可以选择将原对象添加到结果数组（可选）  
                        resultList.push(dataItem);
                    }
                });

                //将结果赋值到 this.dataList 或其他需要的地方  
                this.dataList = resultList;
                
                // 筛选出包含 sqname 的对象  
                const withSqname = this.dataList.filter(obj => obj.sqname !== undefined);

                // 对具有 sqname 的对象进行去重  
                const uniqueWithSqname = Object.values(withSqname.reduce((acc, obj) => {
                    const key = `${obj.code}-${obj.nastrigtaxprice}-${obj.sqname}`;
                    if (!acc[key]) {
                        acc[key] = obj;
                    }
                    return acc;
                }, {}));

                // 筛选出不包含 sqname 的对象  
                const withoutSqname = this.dataList.filter(obj => obj.sqname === undefined);

                // 合并去重后的对象和不包含 sqname 的对象  
                this.result = [...uniqueWithSqname, ...withoutSqname];

                console.log( this.result);
                // for (let i = 0; i <  this.dataList.length; i++) {
                //     if (this.isUnique( this.dataList[i])) {
                //         this.uniqueObjects.push( this.dataList[i]);
                //     }
                // }
                // this.dataList = Array.from(
                //     new Map(this.dataList.map(item => {
                //         // 检查是否存在 sqname 字段  
                //         if (item.sqname) {
                //             // 存在 sqname 的情况，按原逻辑进行去重  
                //             return [`${item.code}_${item.nastrigtaxprice}_${item.sqname}`, item];
                //         } else {
                //             // 不包含 sqname 的项直接返回一个特定的键值对  
                //             // 返回一个不会去重的键（以确保对象原样保留）  
                //             return [`no_sqname_${item.code}_${item.nastrigtaxprice}`, item];
                //         }
                //     })).values()
                // );
                console.log(this.dataList, 88888)

            });
        },
        addOrUpdateHandle(row) {
            this.addOrUpdateVisible = true
            this.$nextTick(() => {
                this.$refs.sqaddOrUpdate.init(row)
            })
        },
    }
};
</script>

<style scoped lang="scss"></style>