<template>
    <div class='updata'>
        <el-dialog :close-on-click-modal="false" :visible.sync="visible">
            <el-form>
                <div>
                    <el-form-item label="分公司/办事处">
                        <el-select v-model="selectedValue" filterable placeholder="请选择/可搜索" @change="handleChange">
                            <el-option v-for="item in fgsList" :key="item.pK_CUSTCLASS" :label="item.pkCustclassName"
                                :value="item.pK_CUSTCLASS">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="省份" prop="sitename">
                        <el-select v-model="selectedValue3" filterable placeholder="请选择/可搜索" @change="handleChange3">
                            <el-option v-for="item in chinasf" :key="item.id" :label="item.label" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>

                <el-form-item>
                    <el-button size="mini" class="filter-item" type="success" @click="gethubData">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import * as api from '@/api/frame/customer.js'
import * as oapi from '@/api/Business/analysis.js'
export default {
    name: 'updata-page',
    data() {
        return {
            msg: 'updata-page',
            visible: false,
            dataForm: {
                blurry: '',
                page: 0,
                size: this.$constants.page.limit[0],
                sort: '',
            },
            dataForm1: {
                companyid: '',
                companyname: '',
                fzr: ''
            },
            dictForm2: {
                page: 0,
                size: 100,
                dictName: 'china_provinces',
            },
            cityForm:{

            },
            value: '',
            ids: '',
            dataList: [],
            fgsList: [],
            chinasf: [],
            selectedValue: '',//分公司id
            selectedLabel: '',//分公司名称
            selectedLabel3: '',//中国行政省份
            selectedValue3: '',//中国行政省份
        };
    },
    mounted() {

    },
    methods: {
        getFactoryList() {
            //中国省份
            oapi.getdictDetailAPI(this.dictForm2).then(res => {
                this.chinasf = res.content
                console.log(this.chinasf)
            })
        },
        //中国省份
        handleChange3(value) {
            const selectedItem = this.chinasf.find(item => item.id === value);
            this.selectedLabel3 = selectedItem ? selectedItem.label : '';
            this.selectedValue3 = value;
            this.dataForm.sname = this.selectedLabel3
            console.log('Selected value:', this.selectedValue3);
            console.log('Selected label:', this.selectedLabel3);
        },
        //分公司
        handleChange(value) {
            const selectedItem = this.fgsList.find(item => item.pK_CUSTCLASS === value);
            this.selectedLabel = selectedItem ? selectedItem.pkCustclassName : '';
            this.selectedValue = value;
            console.log('Selected value:', this.selectedValue);
            console.log('Selected label:', this.selectedLabel);
        },

        init(id) { // 初始化表单验证规则
            this.visible = true
            this.getFactoryList()
            api.SiteallCustomer(this.dataForm).then(res => {
                this.dataList = res
                this.dataList.forEach(item => {
                    const levels = item.levelName.split(' -> ');
                    item.levelName1 = levels[0] || "";
                    // 去掉 levelName2 中的数字  
                    item.levelName2 = levels[1] ? levels[1].replace(/\d+/g, '').trim() : "";
                    item.levelName3 = levels[2] || "";
                });

                const seen = new Set();
                this.fgsList = this.dataList.filter(item => {
                    if (!seen.has(item.pkCustclassName)) {
                        seen.add(item.pkCustclassName);
                        return true; // 保留这个对象  
                    }
                    return false; // 过滤掉重复对象  
                }).map(item => ({
                    pkCustclassName: item.pkCustclassName,
                    pK_CUSTCLASS: item.pK_CUSTCLASS
                }));

                const seen1 = new Set();
                this.zdList = this.dataList.filter(item => {
                    if (!seen1.has(item.def1Name)) {
                        seen1.add(item.def1Name);
                        return true; // 保留这个对象  
                    }
                    return false; // 过滤掉重复对象  
                }).map(item => ({
                    def1Name: item.def1Name,
                    dEF1: item.dEF1
                }));

                const seen2 = new Set();
                this.regList = this.dataList.filter(item => {
                    if (!seen2.has(item.def5Name)) {
                        seen2.add(item.def5Name);
                        return true; // 保留这个对象  
                    }
                    return false; // 过滤掉重复对象  
                }).map(item => ({
                    def5Name: item.def5Name,
                    dEF5: item.dEF5
                }));

            })
            this.ids = id

            console.log(id)


        },
        gethubData() {
            this.$refs['dataForm'].validate((valid) => {
                api.figCompanyCityAPI(this.dataForm).then(res => {
                    // TODO 保存数据
                    this.$emit('refreshDataList')
                    this.$emit('close')
                    this.$message.success('新增数据成功')
                    this.visible = false
                })

            })


        }
    }
};
</script>

<style scoped lang="scss"></style>