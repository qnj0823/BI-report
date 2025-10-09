<template>
    <!-- 基于 Element UI 新增和修改弹窗 -->
    <el-dialog :title="!dataForm.id ? '新增-ADD' : '修改-EDITE'" :close-on-click-modal="false" :visible.sync="visible">
        <!-- 新增和创建表单表单 -->
        <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataSubmit()" label-width="160px">
            <div style="display: flex;">
                <!-- 左侧表单 -->
                <div style="flex: 1; margin-right: 1rem;">
                    <!-- <el-form-item label="客户名称" prop="fgsbscName">
                        <el-input v-model="dataForm.custname" style="width: 100%;" disabled placeholder="客户名称">
                        </el-input>
                    </el-form-item> -->
                    <el-form-item label="客户名称" prop="fgsbscName">
                        <el-select v-model="selectedmatValue" style="width: 100%;" filterable placeholder="请选择"
                            @change="handlematChange">
                            <el-option v-for="item in filteredMaterList" :key="item.id" :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="系统内站点" prop="fgsbscName">
                        <el-select v-model="selecsiteValue" style="width: 100%;" filterable placeholder="请选择"
                            @change="handsiteChange">
                            <el-option v-for="item in newArray" :key="item.id" :label="item.def1Name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="战区" prop="fgsbscName">
                        <el-input v-model="dataForm.dqname" style="width: 100%;" disabled placeholder="战区">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="销售区域/省区" prop="fgsbscName">
                        <el-input v-model="dataForm.sqname" style="width: 100%;" disabled placeholder="销售区域/省区">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="分子公司" prop="fgsbscName">
                        <el-input v-model="dataForm.companyname" style="width: 100%;" disabled placeholder="分子公司">
                        </el-input>
                    </el-form-item>

                </div>

                <!-- 右侧表单 -->
                <div style="flex: 1; margin-left: 1rem;">
                    <el-form-item label="客户名称" prop="fgsbscName">
                        <el-select v-model="selectedmatValue1" style="width: 100%;" filterable placeholder="请选择"
                            @change="handlematChange1">
                            <el-option v-for="item in filteredMaterList" :key="item.id" :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="合并后需归到站点" prop="fgsbscName">
                        <el-select v-model="selecsiteValue1" style="width: 100%;" filterable placeholder="请选择"
                            @change="handsiteChange1">
                            <el-option v-for="item in newArray1" :key="item.id" :label="item.def1Name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="战区" prop="fgsbscName">
                        <el-input v-model="dataForm.dqnamenew" style="width: 100%;" disabled placeholder="战区">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="销售区域/省区" prop="fgsbscName">
                        <el-input v-model="dataForm.sqnamenew" style="width: 100%;" disabled placeholder="销售区域/省区">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="分子公司" prop="fgsbscName">
                        <el-input v-model="dataForm.companynamenew" style="width: 100%;" disabled placeholder="分子公司">
                        </el-input>
                    </el-form-item>

                </div>
            </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="Cancel()">取消</el-button>
            <el-button type="primary" @click="dataSubmit()">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import * as api from '@/api/frame/customer.js'
import {
    mapGetters,
} from 'vuex'
export default {
    data() {
        return {
            constants: this.$constants,
            visible: false,
            addOrUpdateVisible: false,
            dataForm: {
                companyid: "",//	分子公司主键
                companyidnew: '',//分子公司主键(合并后)
                companyname: '',//分子公司名称
                companynamenew: "",//分子公司名称(合并后)
                createman: '',//操作人
                createmanid: '',//操作人主键
                custid: '',//客户主键
                custidnew: '',//客户主键(合并后)
                custname: '',//客户名称
                custnamenew: '',//客户名称(合并后)
                dqid: '',//战区主键
                dqidnew: '',//	战区主键(合并后)
                dqname: '',//战区名称
                dqnamenew: '',//战区名称(合并后)
                id: 0,//	主键
                siteid: '',//	站点主键
                siteidnew: '',//	站点主键(合并后)
                sitename: '',//站点名称
                sitenamenew: '',//	站点名称(合并后)
                sqid: '',//	省区主键
                sqidnew: '',//省区主键(合并后)
                sqname: '',//	省区名称
                sqnamenew: '',//省区名称(合并后)
            },
            dataForm1: {
                blurry: '',
            },
            dataForm3: {

            },
            selectedmatValue: '',//系统内站点
            selectedmatLable: '',//系统内站点lable
            selectedmatValue1: '',//合并后站点
            selectedmatLable1: '',//合并后站点lable
            selecsiteValue: '',//站点
            selecsiteLable: '',//合并后站点lable
            selecsiteValue1: '',
            selecsiteLable1: '',
            MaterList: '',
            usernameid: '',
            username: '',
            filteredMaterList: [], // 用于存储过滤后的数据  
            // filteredMaterList1: [], // 用于存储过滤后的数据  
            newArray: [],//选择客户之后带出的那个客户的所有站点
            newArray1: []
        }
    },
    computed: {
        ...mapGetters(['userid', 'name'])
    },
    mounted() {
        if (this.userid != '') {
            sessionStorage.setItem('userid', this.userid);
        }
        this.dataForm.createmanid = sessionStorage.getItem('userid');

        if (this.name != '') {
            sessionStorage.setItem('name', this.name);
        }
        this.dataForm.createman = sessionStorage.getItem('name');
        this.getMaterList()
    },
    methods: {
        //合并前
        handlematChange(value) {
            this.selectedmatLable = this.MaterList.find(item => item.id === value);
            this.dataForm.custname = this.selectedmatLable.name//客户名称

            this.newArray = this.MaterList.filter(item => item.name === this.selectedmatLable.name);
        },
        handsiteChange(value) {
            this.selecsiteLable = this.MaterList.find(item => item.id === value);

            this.dataForm.sitename = this.selecsiteLable.def1Name//站点名称
            this.dataForm.siteid = this.selecsiteLable.dEF1//站点id
            this.dataForm.companyname = this.selecsiteLable.pkCustclassName//分子公司名称
            this.dataForm.companyid = this.selecsiteLable.pK_CUSTCLASS//分子公司主键
            this.dataForm.dqname = this.selecsiteLable.levelName1//战区名称
            this.dataForm.sqname = this.selecsiteLable.levelName2//省区名称
            this.dataForm.custid = this.selecsiteLable.pkCustomer
        },
        //需合并
        handlematChange1(value) {
            this.selectedmatLable1 = this.MaterList.find(item => item.id === value);
            this.dataForm.custnamenew = this.selectedmatLable1.name//客户名称

            this.newArray1 = this.MaterList.filter(item => item.name === this.selectedmatLable1.name);
        },
        handsiteChange1(value) {
            this.selecsiteLable1 = this.MaterList.find(item => item.id === value);

            this.dataForm.sitenamenew = this.selecsiteLable1.def1Name//站点名称
            this.dataForm.siteidnew = this.selecsiteLable1.dEF1//站点id
            this.dataForm.companynamenew = this.selecsiteLable1.pkCustclassName//分子公司名称
            this.dataForm.companyidnew = this.selecsiteLable1.pK_CUSTCLASS//分子公司主键
            this.dataForm.dqnamenew = this.selecsiteLable1.levelName1//战区名称
            this.dataForm.sqnamenew = this.selecsiteLable1.levelName2//省区名称
            this.dataForm.custidnew = this.selecsiteLable1.pkCustomer
        },

        //取消
        Cancel() {
            this.visible = false
            this.$emit('close')
            this.$emit('refreshDataList')
        },
        getMaterList() {
            api.SiteallCustomer(this.dataForm1).then(res => {
                this.MaterList = res
                this.MaterList.forEach(item => {
                    const levels = item.levelName.split(' -> ');
                    item.levelName1 = levels[0] || "";
                    // 去掉 levelName2 中的数字  
                    item.levelName2 = levels[1] ? levels[1].replace(/\d+/g, '').trim() : "";
                    item.levelName3 = levels[2] || "";
                });
                // 去重
                const map = new Map();
                this.MaterList.forEach(item => {
                    if (!map.has(item.name)) {
                        map.set(item.name, item);
                    }
                });
                this.filteredMaterList = Array.from(map.values());
            })
        },

        init(id, data) { // 初始化表单验证规则
            this.dataForm.id = id || 0
            this.visible = true
            this.$nextTick(() => {
                if (this.dataForm.id) {
                    this.dataForm = data
                    this.selectedmatValue = data.custname
                    this.selectedmatValue1 = data.custnamenew
                    this.selecsiteValue=data.sitename
                    this.selecsiteValue1=data.sitenamenew
                    this.dataForm.createmanid = sessionStorage.getItem('userid');
                    this.dataForm.createman = sessionStorage.getItem('name');
                }
            })
            console.log(data, id)
        },



        // 表单数据提交
        dataSubmit() {
            this.$refs['dataForm'].validate((valid) => {
                if (!this.dataForm.id) {
                    api.newOldaddApi(this.dataForm).then(res => {
                        // TODO 保存数据
                        this.$emit('refreshDataList')
                        this.$emit('close')
                        this.$message.success('新增数据成功')
                        // this.visible = false
                    });
                } else {
                    api.newOldaddupdatApi(this.dataForm).then(res => {
                        // TODO 保存数据
                        this.$emit('refreshDataList')
                        this.$emit('close')
                        this.$message.success('修改数据成功')
                        this.visible = false
                    })
                }
            })
        }
    }
}
</script>