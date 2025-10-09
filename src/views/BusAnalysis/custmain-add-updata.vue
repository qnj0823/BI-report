<template>
    <div class='updata'>
        <el-dialog :close-on-click-modal="false" :visible.sync="visible">
            <el-form>
                <div v-if="ids === '1'">
                    <el-form-item label="分公司/办事处">
                        <el-select v-model="selectedValue" filterable placeholder="请选择/可搜索" @change="handleChange">
                            <el-option v-for="item in fgsList" :key="item.pK_CUSTCLASS" :label="item.pkCustclassName"
                                :value="item.pK_CUSTCLASS">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="负责人">
                        <el-input v-model="dataForm1.fzr" placeholder="负责人"></el-input>
                    </el-form-item>
                </div>
                <div v-else-if="ids === '2'">
                    <el-form-item label="站点">
                        <el-select v-model="selectedValue1" filterable placeholder="请选择/可搜索" @change="handleChange1">
                            <el-option v-for="item in zdList" :key="item.dEF1" :label="item.def1Name"
                                :value="item.dEF1">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否直营">
                        <el-select v-model="value" placeholder="请选择" @change="handleChange2">
                            <el-option v-for="item in direcList" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div v-else-if="ids === '3'">
                    <el-form-item label="区域">
                        <el-select v-model="selectedValue3" filterable placeholder="请选择/可搜索" @change="handleChange3">
                            <el-option v-for="item in regList" :key="item.dEF5" :label="item.def5Name"
                                :value="item.dEF5">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="GDP">
                        <el-input v-model="dataForm3.gdb"  placeholder="GDP"></el-input>
                    </el-form-item>
                    <el-form-item label="人口">
                        <el-input v-model="dataForm3.peoples"  placeholder="人口"></el-input>
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
            dataForm2: {
                siteid: '',
                sitename: '',
                isDirectlyName:'',
                isDirectlyValue:''
            },
            dataForm3: {
                gdb: '',
                peoples: '',
                regionid:'',
                regionname:''
            },
            dataFormfgslist: {
                page: 0,
                size: 200
            },
            dataFormzdlist: {
                page: 0,
                size: 5000
            },
            dataFormreglist: {
                page: 0,
                size: 5000
            },
            value:'',
            ids: '',
            dataList: [],
            fgsList: [],
            zdList: [],
            regList:[],
            show: true,
            selectedValue: '',//分公司id
            selectedLabel: '',//分公司名称
            selectedValue1: '',//站点id
            selectedLabel1: '',//站点名称
            selectedValue2: '',//是否为直营
            selectedLabel2: '',//是否为直营(0否，1是)
            selectedValue3: '',//区域id
            selectedLabel3: '',//区域名称
            direcList: [{
                value: '1',
                label: '是'
            },
            {
                value: '0',
                label: '否'
            }]
        };
    },
    mounted() {
    },
    methods: {
        //分公司
        handleChange(value) {
            const selectedItem = this.fgsList.find(item => item.pK_CUSTCLASS === value);
            this.selectedLabel = selectedItem ? selectedItem.pkCustclassName : '';
            this.selectedValue = value;
            console.log('Selected value:', this.selectedValue);
            console.log('Selected label:', this.selectedLabel);
        },
        //站点
        handleChange1(value) {
            const selectedItem = this.zdList.find(item => item.dEF1 === value);
            this.selectedLabel1 = selectedItem ? selectedItem.def1Name : '';
            this.selectedValue1 = value;
            console.log('Selected value:', this.selectedValue1);
            console.log('Selected label:', this.selectedLabel1);
        },
        //是否直营
        handleChange2(value) {
            const selectedItem = this.direcList.find(item => item.value === value);
            this.selectedLabel2 = selectedItem ? selectedItem.label : '';
            this.selectedValue2 = value;
            console.log('Selected value:', this.selectedValue2);
            console.log('Selected label:', this.selectedLabel2);
        },
         //区域
         handleChange3(value) {
            const selectedItem = this.regList.find(item => item.dEF5 === value);
            this.selectedLabel3 = selectedItem ? selectedItem.def5Name : '';
            this.selectedValue3 = value;
            console.log('Selected value:', this.selectedValue3);
            console.log('Selected label:', this.selectedLabel3);
        },


        init(id) { // 初始化表单验证规则
            this.visible = true
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

                console.log(this.regList);

                console.log(this.dataList)
                // this.dataListLoading = false
            })
            this.ids = id
            
            console.log(id)


        },
        gethubData() {
            this.visible = false
            if (this.ids == 1) {
                api.CompanyTablelist(this.dataFormfgslist).then(res => {
                    const matchFound = res.content.some(company => company.companyname === this.selectedLabel);

                    if (matchFound) {
                        this.dataForm1.companyid = this.selectedValue
                        this.dataForm1.companyname = this.selectedLabel
                        api.CompanyTable(this.dataForm1).then(res => {
                            this.$message.success('修改数据成功')
                            this.$emit('refreshDataList')
                        })
                    } else {
                        this.dataForm1.companyid = this.selectedValue
                        this.dataForm1.companyname = this.selectedLabel
                        api.CompanyTableadd(this.dataForm1).then(res => {
                            this.$message.success('新增数据成功')
                            this.$emit('refreshDataList')
                        })
                    }
                })

            }else if(this.ids == 2){
                api.zdTablelist(this.dataFormzdlist).then(res => {
                    const matchFound = res.content.some(company => company.sitename === this.selectedLabel1);
           
                    if (matchFound) {
                        this.dataForm2.siteid = this.selectedValue1
                        this.dataForm2.sitename = this.selectedLabel1
                        this.dataForm2.isDirectlyName = this.selectedLabel2
                        this.dataForm2.isDirectlyValue = this.selectedValue2
                        api.zdTable(this.dataForm2).then(res => {
                            this.$message.success('修改数据成功')
                            this.$emit('refreshDataList')
                        })
                    } else {
                        this.dataForm2.isDirectlyName = this.selectedLabel2
                        this.dataForm2.isDirectlyValue = this.selectedValue2
                        this.dataForm2.siteid = this.selectedValue1
                        this.dataForm2.sitename = this.selectedLabel1
                        api.zdTableadd(this.dataForm2).then(res => {
                            this.$message.success('新增数据成功')
                            this.$emit('refreshDataList')
                        })
                    }
                })

            }else if(this.ids == 3){
                api.regTablelist(this.dataFormreglist).then(res => {
                    const matchFound = res.content.some(company => company.regionname === this.selectedLabel3);
                    if (matchFound) {
                        this.dataForm3.regionid = this.selectedValue3
                        this.dataForm3.regionname = this.selectedLabel3
                        api.regTable(this.dataForm3).then(res => {
                            this.$message.success('修改数据成功')
                        })
                    } else {
                        this.dataForm3.regionid = this.selectedValue3
                        this.dataForm3.regionname = this.selectedLabel3
                        api.regTableadd(this.dataForm3).then(res => {
                            this.$message.success('新增数据成功')
                        })
                    }
                })

            }
        }
    }
};
</script>

<style scoped lang="scss"></style>