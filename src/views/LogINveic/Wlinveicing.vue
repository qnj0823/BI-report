<template>
    <div class='Wlin'>
        <el-form :inline="true" style="width: 100%; margin: 0 auto;">
            <!-- <el-form-item>
                <el-date-picker v-model="dataForm.p_vouchdatestart" value-format="yyyy-MM-dd" type="date"
                    placeholder="开始日期" clearable style="width: 100%"></el-date-picker>
            </el-form-item> -->
            <el-form-item>
                <el-input v-model="bullay" placeholder="模糊搜索" clearable @keyup.enter.native="searchEnterFun()"
                    ref="searchInput"></el-input>
            </el-form-item>
            <el-form-item>
                <el-date-picker v-model="dataForm.p_vouchdateend" @change="handleDateChange" value-format="yyyy-MM-dd"
                    type="date" placeholder="结束日期" clearable style="width: 100%"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
                    @click="getdataList()">查询</el-button>
            </el-form-item>
            <el-form-item>
                <!-- 1. 先渲染西南按钮（如果存在西南地区） -->
                <el-button v-if="showSouthwest" size="mini" class="filter-item" type="primary"
                    @click="getDataList('四川', '雨帆食品集团股份有限公司')">
                    西南
                </el-button>

                <el-button v-if="showhubei" size="mini" class="filter-item" type="primary"
                    @click="getDataList('湖北', '海南雨帆之家餐饮供应链管理有限公司')">
                    湖北
                </el-button>
                <!-- 2. 渲染其他地区按钮（排除西南包含的地区） -->
                <el-button v-for="item in nonSouthwestAreas" :key="item.pK_AREACL_NAME" size="mini" class="filter-item"
                    type="primary" @click="getDataList(item.pK_AREACL_NAME, item.salesOrgName)">
                    {{ item.pK_AREACL_NAME }}
                </el-button>
                <!-- 导出按钮 -->
                <el-button type="warning" icon="el-icon-download" @click="handleClick">导出</el-button>
            </el-form-item>
        </el-form>

        <el-form :inline="true" style="width: 100%; margin: 0 auto;">
            <el-form-item>
                <el-button type="primary" @click="addOrUpdateHandle()">手动</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="success" @click="CalibrateHandle('1')">校准</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="success" @click="CalibrateHandle()">发送</el-button>
            </el-form-item>
        </el-form>
        <!-- 表单弹窗, 校准和发送数据 -->
        <add-or-Calibr v-if="addOrCalibrVisible" ref="addOrCalibr" @close="addOrCalibrVisible = false"></add-or-Calibr>
        <!-- 表单弹窗, 新增数据和修改数据 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @close="addOrUpdateVisible = false"></add-or-update>
        <!-- <el-form :inline="true" style="width: 100%; margin: 0 auto;">
            <el-form-item>
                <el-form-item>
                    <el-date-picker v-model="postData.datestart" value-format="yyyy-MM-dd" type="date"
                        placeholder="开始日期" clearable style="width: 100%"></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-date-picker v-model="postData.dateend" @change="handleDateChange"
                        value-format="yyyy-MM-dd" type="date" placeholder="结束日期" clearable
                        style="width: 100%"></el-date-picker>
                </el-form-item>
                <el-button type="primary" icon="el-icon-download" @click="getfast">拿数据</el-button>
            </el-form-item>
        </el-form> -->

        <!-- Dialog 弹窗 -->
        <el-dialog :visible.sync="showModal" title="导出数据" width="30%">
            <p>请选择导出格式：</p>
            <el-button type="primary" @click="exportData('excel')">导出开单表</el-button>
            <el-button type="primary" v-show="butnshow" @click="exportData('csv')">导出计划表</el-button>
            <el-button type="primary" v-show="butnshow1" @click="exportData('pdf')">{{ buttonText }}</el-button>
            <el-button type="primary" v-show="butnshow2" @click="exportData('qxhl')">导出清新活力计划表</el-button>
            <el-button type="primary" v-show="butnshow3" @click="exportData('yn')">导出云南计划表</el-button>
            <!-- <el-button type="primary" v-show="butnshowSD" @click="exportData('SDHZ')">导出山东杭州仓计划表</el-button> -->
            <el-button type="primary" v-show="butnshowSDNO" @click="exportData('SDnO')">导出山东非杭州仓计划</el-button>
            <!-- <el-button type="primary" v-show="butnshow3" @click="exportData('sc')">导出四川计划表</el-button> -->

            <!-- 弹窗底部 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="showModal = false">取消</el-button>
            </span>
        </el-dialog>

        <!-- Dialog 弹窗 -->
        <el-dialog :visible.sync="showModalspeci" title="导出数据" width="30%">
            <p>请选择导出格式：</p>
            <el-button type="primary" @click="exportDataspe('kd')">导出开单表(大月规则)</el-button>
            <el-button type="primary" @click="exportDataspe('jh')">导出计划表(大月规则)</el-button>
            <el-button type="primary" @click="exportDataspe('zbjh')">中百罗森计划表(大月规则)</el-button>

            <!-- 弹窗底部 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="showModalspeci = false">取消</el-button>
            </span>
        </el-dialog>
        <el-table class="table" ref="table" border :data="currentData" v-loading="dataListLoading"
            style="width: 100%; margin: 0 auto; margin-bottom: 50px;">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="salesOrgName" label="销售组织" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="pK_AREACL_NAME" label="区域" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="vcol6_name" label="站点" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="cProductName" label="产品名称" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="factory_name" label="工厂" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="simplename" label="产品简称" />
            <el-table-column prop="cProductCode" align="center" label="产品编码" />
            <el-table-column prop="box" align="center" label="箱数" />
        </el-table>
        <el-pagination @size-change="sizeChangeHandle" ref="pagination" @current-change="handleCurrentChange"
            :current-page="currentPage" :page-sizes="[20, 40, 60, 80, 100, 1000]" :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="dataList.length">
        </el-pagination>
    </div>
</template>

<script>
import * as api from '@/api/frame/customer.js'
import AddOrUpdate from './Wlinveicing-add-updata'
import AddOrCalibr from './Wlin-add-updata'

import axios from 'axios';
export default {
    components: {
        AddOrUpdate,
        AddOrCalibr
    },
    name: 'Wlin-page',
    data() {
        return {
            msg: 'Wlin-page',
            dataListLoading: false,
            showModal: false,
            showModalspeci: false,
            addOrCalibrVisible:false,
            postData: {
                datestart: '',
                dateend: ''
            },
            dataForm: {
                p_vouchdateend: '',
                p_vouchdatestart: '',
                p_orgname: ''
            },
            dictForm: {
                p_vouchdateend: '',
                p_vouchdatestart: '',
                p_orgname: '',
                p_areaname: ''
            },
            productForm: {
                page: 0,
                size: 200,
                sort: '',
            },
            switchForm: {
                file_path: '',
                file_name: ''
            },
            butnshow: false,
            butnshow1: false,
            butnshow2: false,
            butnshow3: false,
            butnshowSD: false,
            butnshowSDNO: false,
            // butnshowKD: false,
            newArray: [],
            bullay: '',
            dataList: [],
            productList: [],
            currentData: [],
            currentPage: 1,
            pageSize: 20,
            totalItems: 0,
            buttonText: '',
            areas: '',
            organaze: '',
            showhubei: '',
            addOrUpdateVisible: false,
        };
    },
    computed: {
        // 西南地区包含的省份
        southwestProvinces() {
            return ['四川', '云南', '重庆', '贵州'];
        },

        // 是否需要显示西南按钮
        showSouthwest() {
            return this.newArray.some(item =>
                this.southwestProvinces.includes(item.pK_AREACL_NAME)
            );
        },

        // 非西南地区的列表
        nonSouthwestAreas() {
            return this.newArray.filter(item =>
                !this.southwestProvinces.includes(item.pK_AREACL_NAME)
            );
        },
    },
    created() {
        this.calculateDates();
    },
    mounted() {
        this.getfast()

    },
    methods: {
        // 新增 / 修改
        addOrUpdateHandle(id, data) {
            this.addOrUpdateVisible = true
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(id, data)
            })
        },
        //校准 / 发送
        CalibrateHandle(id){
            this.addOrCalibrVisible = true
            this.$nextTick(() => {
                this.$refs.addOrCalibr.init(id)
            })
        },
        async getfast() {
            this.dataListLoading = true
            try {

                const response = await axios.post(
                    'http://172.16.100.239:9000/nccorder',
                    this.postData,
                );

            } catch (err) {
                this.error = err.message || '请求失败';
            } finally {
                this.dataListLoading = false;
                this.getdataList()
            }
        },

        handleDateChange(newDate) {
            this.dataForm.p_vouchdatestart = newDate
            this.dictForm.p_vouchdatestart = newDate
            this.dictForm.p_vouchdateend = newDate
            console.log("选择的结束日期:", newDate);
        },
        //获取时间
        calculateDates() {
            const today = new Date();

            // 获取当前月份的月初时间 
            const startOfMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);
            this.startOfMonth = this.formatDate(startOfMonthDate);

            // 获取截至今天的时间 
            this.endOfToday = this.formatDate(today);
            this.dataForm.p_vouchdatestart = this.endOfToday
            this.dataForm.p_vouchdateend = this.endOfToday
            this.dictForm.p_vouchdatestart = this.endOfToday
            this.dictForm.p_vouchdateend = this.endOfToday
            this.postData.datestart = this.endOfToday
            this.postData.dateend = this.endOfToday

        },
        formatDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1 
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },

        getdataList(data) {
            this.dataListLoading = true
            api.wlProductApi(this.dataForm).then(res => {
                this.dataList = res

                this.newArray = this.dataList.map(item => ({
                    salesOrgName: item.salesOrgName,
                    pK_AREACL_NAME: item.pK_AREACL_NAME
                }))
                    .filter((item, index, self) =>
                        index === self.findIndex(t => t.pK_AREACL_NAME === item.pK_AREACL_NAME)
                    );
                console.log(this.newArray, 'this.newArray')

                const dateStr = this.dataForm.p_vouchdateend; // "2025-05-30"
                const date = new Date(dateStr); // 转为 Date 对象
                const day = date.getDate(); // 获取日（数字，如 30）

                if (day === 31) {
                    const hasHubei = this.newArray.some(item => item.pK_AREACL_NAME == "湖北");
                    this.showhubei = !hasHubei;
                } else {
                    this.showhubei = false
                }

                if (data) {
                    this.dataList = this.dataList.filter(item =>
                        (item.pK_AREACL_NAME && item.pK_AREACL_NAME.toLowerCase().includes(data))
                    );
                }
                this.getproDuct()
            })
        },
        getproDuct() {
            api.TtrackProductAdd(this.productForm).then(res => {
                this.productList = res.content
                // 遍历 dataList，为每个项匹配并添加 simplename  
                this.dataList.forEach(dataItem => {
                    // 查找在 productList 中是否有匹配的 code  
                    const product = this.productList.find(productItem => productItem.code === dataItem.cProductCode);

                    // 如果找到匹配的 product，则将 simplename 添加到 dataItem  
                    if (product) {
                        dataItem.simplename = product.simplename;
                    }
                });
                this.dataList = this.dataList.filter(item =>
                    (item.salesOrgName && item.salesOrgName.toLowerCase().includes(this.bullay)) ||
                    (item.pK_AREACL_NAME && item.pK_AREACL_NAME.toLowerCase().includes(this.bullay)) ||
                    (item.vcol6_name && item.vcol6_name.toLowerCase().includes(this.bullay)) ||
                    (item.cProductName && item.cProductName.toLowerCase().includes(this.bullay)) ||
                    (item.factory_name && item.factory_name.toLowerCase().includes(this.bullay)) ||
                    (item.simplename && item.simplename.toLowerCase().includes(this.bullay))
                );
                this.currentData = {
                    ...this.dataList
                };
                this.sizeChangeHandle(this.pageSize);
                this.dataListLoading = false
            })
        },
        getDataList(data, salse) {
            this.areas = data
            this.organaze = salse
            console.log(salse)
            if (data == '湖南') {
                this.butnshow = true
                this.butnshow1 = true
                this.butnshow2 = false
                this.butnshow3 = false
                this.butnshowSD = false
                this.butnshowSDNO = false
                this.buttonText = '导出鑫锦湖计划表'
            } else if (data == '湖北') {
                this.butnshow = true
                this.butnshow1 = true
                this.butnshow2 = false
                this.butnshow3 = false
                this.butnshowSD = false
                this.butnshowSDNO = false
                this.buttonText = '导出中百罗森计划表'
            } else if (data == '四川') {
                this.butnshow = true
                this.butnshow1 = true
                this.butnshow3 = true
                this.butnshow2 = false
                this.butnshowSD = false
                this.butnshowSDNO = false
                this.buttonText = '导出新鲜活力开单表'
            } else if (data == '安徽') {
                this.butnshow = false
                this.butnshow1 = false
                this.butnshow2 = false
                this.butnshow3 = false
                this.butnshowSD = false
                this.butnshowSDNO = false
                // this.buttonText = '导出新鲜活力导出表'
            } else if (data == '河南') {
                this.butnshow = true
                this.butnshow1 = false
                this.butnshow2 = false
                this.butnshow3 = false
                this.butnshowSD = false
                this.butnshowSDNO = false
                // this.buttonText = '导出新鲜活力导出表'
            } else if (data == '广东') {
                this.butnshow = true
                this.butnshow1 = false
                this.butnshow2 = false
                this.butnshow3 = false
                this.butnshowSD = false
                this.butnshowSDNO = false
                // this.buttonText = '导出新鲜活力导出表'
            } else if (data == '江西') {
                this.butnshow = true
                this.butnshow1 = false
                this.butnshow2 = false
                this.butnshow3 = false
                this.butnshowSD = false
                this.butnshowSDNO = false
                // this.buttonText = '导出新鲜活力导出表'
            } else if (data == '陕西') {
                this.butnshow = true
                this.butnshow1 = false
                this.butnshow2 = false
                this.butnshow3 = false
                this.butnshowSD = false
                this.butnshowSDNO = false
                // this.buttonText = '导出新鲜活力导出表' butnshowKD
            } else if (data == '浙江') {
                this.butnshowKD = false
                this.butnshow = true
                this.butnshow1 = false
                this.butnshow2 = false
                this.butnshow3 = false
                this.butnshowSD = false
                this.butnshowSDNO = false
                // this.buttonText = '导出新鲜活力导出表' butnshowKD
            } else if (data == '福建') {
                this.butnshowKD = false
                this.butnshow = true
                this.butnshow1 = false
                this.butnshow2 = false
                this.butnshow3 = false
                this.butnshowSD = false
                this.butnshowSDNO = false
                // this.buttonText = '导出新鲜活力导出表' butnshowKD
            } else if (data == '江苏') {
                this.butnshowKD = false
                this.butnshow = true
                this.butnshow1 = false
                this.butnshow2 = false
                this.butnshow3 = false
                this.butnshowSD = false
                this.butnshowSDNO = false
                // this.buttonText = '导出新鲜活力导出表' butnshowKD
            } else if (data == '山东') {
                this.butnshowKD = false
                this.butnshow = false
                this.butnshow1 = false
                this.butnshow2 = false
                this.butnshow3 = false
                this.butnshowSD = true
                this.butnshowSDNO = true
                // this.buttonText = '导出新鲜活力导出表' butnshowKD
            } else {
                this.butnshowKD = true
                this.butnshow = false
                this.butnshow1 = false
                this.butnshow2 = false
                this.butnshow3 = false
                this.butnshowSD = false
                this.butnshowSDNO = false
            }
            this.dictForm.p_orgname = salse
            this.dictForm.p_areaname = data
            this.getdataList(data)
        },
        handleClick() {
            // 获取当前日期和时间
            const now = new Date(this.dataForm.p_vouchdateend);

            const currentYear = now.getFullYear();
            const currentMonth = now.getMonth(); // 0=1月，11=12月
            const currentDate = now.getDate(); // 获取当前日期(1-31)

            // const year = now.getFullYear();
            // const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1 
            // const day = String(now.getDate()).padStart(2, '0');

            const date = `${currentYear}-${currentMonth}-${currentDate}`
            console.log(date)
            // 计算当前月份的天数
            const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

            // 判断区域是否存在
            if (!this.dictForm.p_areaname) {
                this.$message.warning('请选择区域');
                return; // 直接返回，不执行后续逻辑
            }

            // 判断是否满足所有条件
            if (this.areas === '湖北' &&
                daysInCurrentMonth === 31 &&
                [29, 30, 31].includes(currentDate)) {
                this.dictForm.p_orgname = this.organaze
                this.dictForm.p_areaname = this.areas

                // this.dictForm.p_vouchdatestart = '2025-05-29'
                // this.dictForm.p_vouchdateend = '2025-05-29'

                this.showModalspeci = true; // 打开特殊模态框

                // 这里放入大月末需要执行的处理代码
                console.log("1. 执行大月末特有处理");
                console.log("2. 生成月末报告");
                console.log("3. 执行额外统计任务");
            } else {
                // 普通情况处理
                this.showModal = true; // 打开普通模态框
            }
        },
        //湖北大月
        exportDataspe(format) {
            switch (format) {
                case 'kd':
                    this.exportkd();
                    break;
                case 'jh':
                    this.exportjh();
                    break;
                case 'zbjh':
                    this.exportzbjh();
                default:
                    console.log('未知的导出格式');
            }
            this.showModalspeci = false;
        },
        exportkd() {
            this.dataListLoading = true
            api.wlhbkdbigApi(this.dictForm).then(res => {
                window.open('http://bi.yufanjtbip.com:8069/file/%E6%96%87%E6%A1%A3/newfilehubeiout.xlsx')
                this.dataListLoading = false
            })
        },
        exportjh() {
            this.dataListLoading = true
            api.wlhbjhbigApi(this.dictForm).then(res => {
                window.open('http://bi.yufanjtbip.com:8069/file/%E6%96%87%E6%A1%A3/newfileplanhubeiout.xlsx')
                this.dataListLoading = false
            })
        },
        exportzbjh() {
            this.dataListLoading = true
            api.wlProductexcelhbzbjhApi(this.dictForm).then(res => {
                console.log(666)
                window.open('http://bi.yufanjtbip.com:8069/file/%E6%96%87%E6%A1%A3/newfileplanhubeizmlout.xlsx')
                this.dataListLoading = false
            })
        },
        exportData(format) {
            switch (format) {
                case 'csv':
                    this.exportCSV();
                    break;
                case 'excel':
                    this.exportExcel();
                    break;
                case 'pdf':
                    this.exportPDF();
                    break;
                case 'qxhl':
                    this.exportPqxhl();
                    break;
                case 'yn':
                    this.exportyn();
                    break;
                case 'sc':
                    this.exportsc();
                    break;
                case 'SDHZ':
                    this.exportSDSD();
                    break;
                case 'SDnO':
                    this.exportSDnO();
                default:
                    console.log('未知的导出格式');
            }
            this.showModal = false;
        },
        //开单表
        exportExcel() {
            this.dataListLoading = true
            console.log(this.dictForm, 'this.dictForm')
            if (this.dictForm.p_areaname == '湖北') {
                const isDev = process.env.NODE_ENV === 'development';
                console.log(isDev,666666)
                const baseURL = isDev ? 'http://172.16.100.199:9000' : '';
                //湖北
                api.wlProductexcelnewhbApi(this.dictForm).then(res => {
                    this.switchForm.file_name = 'newfilehubeiout.xlsx'
                    try {
                        const response = axios.post(
                            `${baseURL}/convertexcel `,
                            {
                                data: this.switchForm,
                            }, // 请求体（POST data），这里可以留空或传其他数据
                            {
                                
                                headers: {
                                    'Accept': 'application/json, text/plain, */*',
                                    'Content-Type': 'application/json',
                                    // 'Host': '172.16.100.239:9000', // 明确指定Host
                                    // 'Origin': 'http://bi.yufanjtbip.com:8059'
                                }
                            }
                        );
                        window.open('http://bi.yufanjtbip.com:8069/file/%E6%96%87%E6%A1%A3/newfilehubeiout.xlsx')

                    } catch (err) {
                        window.open('http://bi.yufanjtbip.com:8069/file/%E6%96%87%E6%A1%A3/newfilehubeiout.xlsx')
                    }

                    this.dataListLoading = false
                })
            } else if (this.dictForm.p_areaname == '湖南') {
                // 湖南
                api.wlProductexcelnewhnApi(this.dictForm).then(res => {
                    window.open('http://bi.yufanjtbip.com:8069/file/%E6%96%87%E6%A1%A3/newfilehunanout.xlsx')
                    this.dataListLoading = false
                })
            } else if (this.dictForm.p_areaname == '四川') {
                api.wlexcelxinanApi(this.dictForm).then(res => {
                    window.open('http://bi.yufanjtbip.com:8069/file/%E6%96%87%E6%A1%A3/newfilexinanout.xlsx')
                    this.dataListLoading = false

                })
            } else if (this.dictForm.p_areaname == '安徽') {
                api.wlnewanhuiApi(this.dictForm).then(res => {
                    window.open('http://bi.yufanjtbip.com:8069/file/%E6%96%87%E6%A1%A3/newfileanhuiout.xlsx')
                    this.dataListLoading = false

                })
            } else if (this.dictForm.p_areaname == '河南') {
                api.wlnewhenanApi(this.dictForm).then(res => {
                    window.open('http://bi.yufanjtbip.com:8069/file/%E6%96%87%E6%A1%A3/newfilehenanout.xlsx')
                    this.dataListLoading = false

                })
            } else if (this.dictForm.p_areaname == '广东') {
                api.wlnewguangdongApi(this.dictForm).then(res => {
                    window.open('http://bi.yufanjtbip.com:8069/file/%E6%96%87%E6%A1%A3/newfileguangdongout.xlsx')
                    this.dataListLoading = false

                })
            } else if (this.dictForm.p_areaname == '江西') {
                api.wlnewjiangxiApi(this.dictForm).then(res => {
                    window.open('http://bi.yufanjtbip.com:8069/file/%E6%96%87%E6%A1%A3/newfilejiangxiout.xlsx')
                    this.dataListLoading = false

                })
            } else if (this.dictForm.p_areaname == '陕西') {
                api.wlshanxiApi(this.dictForm).then(res => {
                    window.open('http://bi.yufanjtbip.com:8069/file/%E6%96%87%E6%A1%A3/newfileshanxiout.xlsx')
                    this.dataListLoading = false

                })
            } else if (this.dictForm.p_areaname == '山东') {
                api.wlSDOpenthenApi(this.dictForm).then(res => {
                    window.open('http://bi.yufanjtbip.com:8069/file/%E6%96%87%E6%A1%A3/newfileshandongout.xlsx')
                    this.dataListLoading = false

                })
            }
        },
        //山东杭州仓计划
        exportSDSD() {
            console.log(66666)
            this.dataListLoading = true
            api.wlSDOpenthenotherApi(this.dictForm).then(res => {
                console.log(res)
                window.open('http://bi.yufanjtbip.com:8069/file/%E6%96%87%E6%A1%A3/newfileplanshandongotherout.xlsx')
                this.dataListLoading = false
            })
        },
        //山东非杭州仓计划
        exportSDnO() {
            console.log(66666)
            this.dataListLoading = true
            api.wlSDOpenthenotherNoApi(this.dictForm).then(res => {
                console.log(res)
                window.open('http://bi.yufanjtbip.com:8069/file/%E6%96%87%E6%A1%A3/newfileplanshandongout.xlsx')
                this.dataListLoading = false
            })
        },
        //云南单独计划
        exportyn() {
            this.dataListLoading = true
            const yunnanForm = {
                p_vouchdateend: '',
                p_vouchdatestart: '',
                p_orgname: '雨帆食品集团股份有限公司',
                p_areaname: '云南'
            }
            yunnanForm.p_vouchdatestart = this.dictForm.p_vouchdatestart
            yunnanForm.p_vouchdateend = this.dictForm.p_vouchdateend
            api.wlyunnanApi(yunnanForm).then(res => {
                window.open('http://bi.yufanjtbip.com:8069/file/%E6%96%87%E6%A1%A3/newxinancanout_yunnan.xlsx')
                this.dataListLoading = false
            })
        },
        //四川单独计划
        exportsc() {

        },
        //计划
        exportCSV() {
            this.dataListLoading = true
            if (this.dictForm.p_areaname == '湖北') {
                api.wlProductexcelhbjhApi(this.dictForm).then(res => {
                    console.log(res)
                    window.open('http://bi.yufanjtbip.com:8069/file/%E6%96%87%E6%A1%A3/newfileplanhubeiout.xlsx')
                    this.dataListLoading = false
                })
            } else if (this.dictForm.p_areaname == '湖南') {
                api.wlProductexcelhnnApi(this.dictForm).then(res => {
                    console.log(res)
                    window.open('http://bi.yufanjtbip.com:8069/file/%E6%96%87%E6%A1%A3/newhunancanout.xlsx')
                    this.dataListLoading = false
                })
            } else if (this.dictForm.p_areaname == '四川') {
                api.wlexcelxinannormalApi(this.dictForm).then(res => {
                    console.log(res)
                    window.open('http://bi.yufanjtbip.com:8069/file/%E6%96%87%E6%A1%A3/newxinancanout.xlsx')
                    this.dataListLoading = false
                })
            } else if (this.dictForm.p_areaname == '安徽') {
                api.wlnewanhuiplanApi(this.dictForm).then(res => {
                    window.open('http://bi.yufanjtbip.com:8069/file/%E6%96%87%E6%A1%A3/newfileplananhuiout.xlsx')
                    this.dataListLoading = false

                })
            } else if (this.dictForm.p_areaname == '河南') {
                api.wlnewhenanplanApi(this.dictForm).then(res => {
                    window.open('http://bi.yufanjtbip.com:8069/file/%E6%96%87%E6%A1%A3/newfileplanhenanout.xlsx')
                    this.dataListLoading = false

                })
            } else if (this.dictForm.p_areaname == '广东') {
                api.wlnewguangdongplanApi(this.dictForm).then(res => {
                    window.open('http://bi.yufanjtbip.com:8069/file/%E6%96%87%E6%A1%A3/newfileplanguangdongout.xlsx')
                    this.dataListLoading = false

                })
            } else if (this.dictForm.p_areaname == '江西') {
                api.wlnewjiangxiplanApi(this.dictForm).then(res => {
                    window.open('http://bi.yufanjtbip.com:8069/file/%E6%96%87%E6%A1%A3/newfileplanjiangxiout.xlsx')
                    this.dataListLoading = false

                })
            } else if (this.dictForm.p_areaname == '陕西') {
                api.wlshanxiPlanApi(this.dictForm).then(res => {
                    window.open('http://bi.yufanjtbip.com:8069/file/%E6%96%87%E6%A1%A3/newfileplanshanxiout.xlsx')
                    this.dataListLoading = false

                })
            } else if (this.dictForm.p_areaname == '浙江') {
                api.WlplanzhejiangApi(this.dictForm).then(res => {
                    window.open('http://bi.yufanjtbip.com:8069/file/%E6%96%87%E6%A1%A3/newfileplanzhejiangout.xlsx')
                    this.dataListLoading = false

                })
            } else if (this.dictForm.p_areaname == '福建') {
                api.WlplanfujianApi(this.dictForm).then(res => {
                    window.open('http://bi.yufanjtbip.com:8069/file/%E6%96%87%E6%A1%A3/newfileplanfujianout.xlsx')
                    this.dataListLoading = false

                })
            } else if (this.dictForm.p_areaname == '江苏') {
                api.WlplanjiangsuApi(this.dictForm).then(res => {
                    window.open('http://bi.yufanjtbip.com:8069/file/%E6%96%87%E6%A1%A3/newfileplanjiangsuout.xlsx')
                    this.dataListLoading = false

                })
            }
        },
        //特殊计划
        exportPDF() {
            this.dataListLoading = true
            if (this.dictForm.p_areaname == '湖北') {
                api.wlProductexcelhbzbjhApi(this.dictForm).then(res => {
                    console.log(666)
                    window.open('http://bi.yufanjtbip.com:8069/file/%E6%96%87%E6%A1%A3/newfileplanhubeizmlout.xlsx')
                    this.dataListLoading = false
                })
            } else if (this.dictForm.p_areaname == '湖南') {
                api.wlProductexcelhnmcApi(this.dictForm).then(res => {
                    console.log(666)
                    window.open('http://bi.yufanjtbip.com:8069/file/%E6%96%87%E6%A1%A3/newjcanout.xlsx')
                    this.dataListLoading = false
                })
            } else if (this.dictForm.p_areaname == '四川') {
                api.wlexcelxinanqingxingApi(this.dictForm).then(res => {
                    console.log(666)
                    window.open('http://bi.yufanjtbip.com:8069/file/%E6%96%87%E6%A1%A3/newfilexinanqingxingout.xlsx')
                    this.dataListLoading = false
                })
            }
        },
        //清新活力
        exportPqxhl() {
            this.dataListLoading = true
            if (this.dictForm.p_areaname == '四川') {
                api.wlexcelxinanqingxingnorApi(this.dictForm).then(res => {
                    console.log(666)
                    window.open('http://bi.yufanjtbip.com:8069/file/%E6%96%87%E6%A1%A3/newxinancanqingxingout.xlsx')
                    this.dataListLoading = false
                })

            }

        },

        // 每页数
        sizeChangeHandle(val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.currentData = this.dataList.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this
                .pageSize);
        },
        // 当前页
        handleCurrentChange(val) {
            console.log(val)
            this.currentPage = val;
            this.currentData = this.dataList.slice((val - 1) * this.pageSize, val * this.pageSize);
        },
    }
};
</script>

<style scoped lang="scss"></style>