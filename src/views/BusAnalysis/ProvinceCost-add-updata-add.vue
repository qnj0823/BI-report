<template>
    <div class='updata'>
        <el-dialog :close-on-click-modal="false" :visible.sync="visible">
            <el-form label-width="140px">
                <el-form-item label="销售组织" prop="orgname">
                    <el-input v-model="dataForm1.orgname" placeholder="销售组织"></el-input>
                </el-form-item>
                <el-form-item label="供应商" prop="supplierName">
                    <el-input v-model="dataForm1.supplierName" placeholder="供应商"></el-input>
                </el-form-item>
                <el-form-item label="产品编号" prop="code">
                    <el-input v-model="dataForm1.code" placeholder="产品编号"></el-input>
                </el-form-item>
                <el-form-item label="产品名称" prop="name">
                    <el-input v-model="dataForm1.name" placeholder="产品名称"></el-input>
                </el-form-item>
                <el-form-item label="价格" prop="nastorigtaxprice">
                    <el-input v-model="dataForm1.nastorigtaxprice" placeholder="价格"></el-input>
                </el-form-item>
                <el-form-item label="销售区域/省区">
                    <el-cascader placeholder="搜索" :props="props" :options="options" filterable clearable
                        @change="handleChange"></el-cascader>
                </el-form-item>

                <el-form-item>
                    <el-button size="mini" class="filter-item" type="success" @click="gethubData">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import * as api from '@/api/frame/customer.js'
export default {
    name: 'updata-page',
    data() {
        return {
            props: { multiple: true },
            msg: 'updata-page',
            visible: false,

            dataForm: {
                blurry: '',
            },
            dataForm1: {
                orgname: '',
                code: '',
                name: '',
                nastorigtaxprice: '',
                pkGroup: '',
                pkSupplier: '',
                supplierName: '',
                sqid: '',
                sqname: '',
                PK_SUPPLIERPRICE: ''
            },
            dataList: [],
            options: [],
            string1: '',
            string2: '',
            selectedValues:''

        };
    },
    mounted() {
    },
    methods: {
        // handleChange(value) {
        //     this.string1 = value[0]
        //     this.string2 = value[1]
        //     console.log(this.string1,1111, this.string2,99999);
        // },
        handleChange(Values) {
            this.selectedValues = Values
            console.log('选中的值:',  this.selectedValues);
            // 这里您可以对选中的值进行处理  
        },
        //转为级联选择器可用的数组
        transformToCascaderOptions(array) {
            const result = [];
            const levelMap = {};

            array.forEach(item => {
                const { levelName1, levelName2 } = item;

                if (!levelMap[levelName1]) {
                    levelMap[levelName1] = {
                        value: levelName1,
                        label: levelName1,
                        children: []
                    };
                    result.push(levelMap[levelName1]);
                }

                levelMap[levelName1].children.push({
                    value: levelName2,
                    label: levelName2
                });
            });

            return result;
        },
        init(row) { // 初始化表单验证规则
            this.dataForm1 = row
            console.log(666, this.dataForm1)
            this.visible = true
            api.BdallCustomer(this.dataForm).then(res => {
                this.dataList = res
                this.dataList.forEach(item => {
                    const levels = item.levelName.split(' -> ');
                    item.levelName1 = levels[0] || "";
                    // 去掉 levelName2 中的数字  
                    item.levelName2 = levels[1] || "";
                    item.levelName3 = levels[2] || "";
                });
                this.dataList = Array.from(
                    new Map(this.dataList.map(item => [`${item.levelName1}-${item.levelName2}-${item.levelName3}`, item])).values()
                );
                this.dataList = this.dataList.filter((item, index, self) =>
                    index === self.findIndex((t) => (
                        t.levelName2 === item.levelName2
                    ))
                );
                this.options = this.transformToCascaderOptions(this.dataList);
                console.log(this.dataList)
            })
        },
        gethubData() {
            this.visible = false
            api.SupplierpriceallApi().then(res => {
                console.log(res,55555)
                
                
                const matchFound = res.some(item =>
                    item.pkSupplier === this.dataForm1.pkSupplier &&
                    item.sqname === this.dataForm1.sqname
                );
                const matchingIds = res
                    .filter(item =>
                        item.pkSupplier === this.dataForm1.pkSupplier &&
                        item.sqname === this.dataForm1.sqname
                    )
                    .map(item => item.id.toString()); // 提取符合条件的 id，并转换为字符串  

                const result = matchingIds.length > 0 ? matchingIds[0] : null; // 或者 "" 作为默认值  
                console.log(result,123456)

                if (matchFound) {
                    this.dataForm1.id = result      
                    this.selectedValues.forEach(item => {
                        this.dataForm1.sqid = this.dataForm1.pK_SUPPLIERPRICE
                        this.dataForm1.sqname = item[1];  // 0808江西省 或 0505宜恩合资  


                        // 调用 API  
                        api.SupplierpriceputApi(this.dataForm1).then(res => {
                        this.$message.success('修改数据成功')
                        this.$emit('sqDataList')
                    })
                    });
                } else {
                    this.selectedValues.forEach(item => {
                        this.dataForm1.sqid = this.dataForm1.pK_SUPPLIERPRICE
                        this.dataForm1.sqname = item[1];  // 0808江西省 或 0505宜恩合资  


                        // 调用 API  
                        api.SupplierpriceaddApi(this.dataForm1)
                            .then(res => {
                                this.$message.success('新增数据成功');
                                // 触发 sqDataList 事件  
                                this.$emit('sqDataList');
                            })
                            .catch(err => {
                                this.$message.error('新增数据失败: ' + err.message);
                            });
                    });
                    // this.dataForm1.sqid = this.dataForm1.pK_SUPPLIERPRICE
                    // this.dataForm1.sqname = this.string2
                    // api.SupplierpriceaddApi(this.dataForm1).then(res => {
                    //     this.$message.success('新增数据成功')
                    //     this.$emit('sqDataList')
                    // })
                }


            })


        }
    }
};
</script>

<style scoped lang="scss"></style>