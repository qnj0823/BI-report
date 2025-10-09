<template>
    <div class='RF'>
        <!-- <el-form style="width: 95%; margin: 0 auto;">
            <el-form-item>
                <el-button class="filter-item" size="mini" :type="activeButton === 'order' ? 'primary' : 'success'"
                    @click="setActiveButton('order')">
                    订单时间
                </el-button>
                <el-button class="filter-item" size="mini" :type="activeButton === 'arrival' ? 'primary' : 'success'"
                    @click="setActiveButton('arrival')">
                    到货时间
                </el-button>
            </el-form-item>
        </el-form> -->
        <add-or-update v-if="show" ref="addOrUpdate"></add-or-update>
        <div v-else>
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
                        @click="getDataList">查询</el-button>
                </el-form-item>
                <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                    @click="exportData">导出</el-button>
            </el-form>
            <el-table class="table" ref="table" border :data="currentData" v-loading="dataListLoading"
                style="width: 95%; margin: 0 auto; margin-bottom: 50px;">
                <el-table-column fixed :show-overflow-tooltip="true" width="140" align="center" prop="nAME"
                    label="战区" />
                <el-table-column fixed :show-overflow-tooltip="true" align="center" prop="sqname" label="省区" />
                <el-table-column fixed :show-overflow-tooltip="true" width="140" align="center"
                    prop="ocustomerClass_name" label="分公司/办事处" />
                <el-table-column fixed :show-overflow-tooltip="true" align="center" width="200" prop="cname"
                    label="客户营业执照" />
                <el-table-column fixed :show-overflow-tooltip="true" align="center" width="200" prop="cSiteName"
                    label="站点" />
                <el-table-column fixed :show-overflow-tooltip="true" align="center" width="150" prop="vouchdate"
                    label="报单日期" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="bigyuanwei" label="大原味" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="smallyuanwei" label="小原味" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yxyuanwei" label="优选原味" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="140" prop="xyuanweidyh"
                    label="小原味（戴永红定制）" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="xyuanweily"
                    label="小原味（绿叶定制）" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="dbt" label="大白桃" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="xbt" label="小白桃" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="dqx" label="大清新" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="xqx" label="小清新" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="qinxi450" label="450清新" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="djs" label="大健爽" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="xjs" label="小健爽" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="dlt" label="大0糖" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="xlt" label="小0糖" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="lsjs" label="蓝色健爽" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="jn" label="健能" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="jh" label="姜黄" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yz330" label="330" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yz310" label="310" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="snnb180"
                    label="180酸乳酪(白）" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="snnred180"
                    label="180酸乳酪(红）" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="lyznr1" label="1L椰子牛乳" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="140" prop="lyznrdz1"
                    label="1L椰子牛乳(定制款）" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="cgb970"
                    label="950常温(常规版）" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="yxb970"
                    label="950常温(宴席版）" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="yxb300"
                    label="300常温(宴席版）" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="jdb300"
                    label="300常温(经典版）" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="cz380" label="380橙汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="cz135" label="1.35橙汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="syz380" label="380双柚汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="syz135" label="1.35双柚汁" />
                <!-- <el-table-column :show-overflow-tooltip="true" align="center" prop="yzs1l" label="椰子水" /> -->
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yzz245" label="245椰子汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="lyzz1" label="1L椰子汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yzz300" label="300椰子汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="hpyzz125"
                    label="1.25L红瓶椰子汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="lkyzz300"
                    label="300礼盒椰子汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="xqn300" label="300小青柠汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="xqn900" label="900小青柠汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="pgz300" label="300苹果汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="pgz900" label="900苹果汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="mgbl300" label="300芒果菠萝汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="mgbl900" label="900芒果菠萝汁" />

                <el-table-column :show-overflow-tooltip="true" align="center" prop="Qtnmer" label="其它" />
                <el-table-column prop="sum" align="center" label="小计" />
            </el-table>
            <el-pagination @size-change="sizeChangeHandle" ref="pagination" @current-change="handleCurrentChange"
                :current-page="currentPage" :page-sizes="[20, 40, 60, 80, 100, 1000]" :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper" :total="results.length">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import AddOrUpdate from './RevieDayFormArrival'
import * as api from '@/api/frame/customer.js'
import {
    exportExcel
} from './RevieDayFormArrivalExpro.js'
export default {
    name: 'RF-page',
    components: {
        AddOrUpdate,
    },
    data() {
        return {
            msg: 'RF-page',
            dataForm: {
                p_vouchdateend: '',
                p_vouchdatestart: '',
                p_orgname: ''
            },
            bullay: '',
            show: false,
            activeButton: 'order', // 用于存储当前激活的按钮  
            dataList: [],
            dataListLoading: false,
            currentData: [],
            results: [],
            currentPage: 1,
            pageSize: 20,
            totalItems: 0,
            codes: [
                {
                    id: '1520100001',
                    name: 'bigyuanwei'
                },
                {
                    id: '1520100002',
                    name: 'smallyuanwei'
                },
                {
                    id: '1520100008',
                    name: 'yxyuanwei'
                },
                {
                    id: '1520100020',
                    name: 'xyuanweidyh'
                },
                {
                    id: '1520100021',
                    name: 'xyuanweily'
                },
                {
                    id: '1520100025',
                    name: 'snnb180'
                },
                {
                    id: '1520100026',
                    name: 'snnred180'
                },
                {
                    id: '1520100010',
                    name: 'dbt'
                },
                {
                    id: '1520100009',
                    name: 'xbt'
                },
                {
                    id: '1520100012',
                    name: 'dqx'
                },
                {
                    id: '1520100011',
                    name: 'xqx'
                },
                {
                    id: '1520100014',
                    name: 'djs'
                },
                {
                    id: '1520100015',
                    name: 'xjs'
                },
                {
                    id: '1520100017',
                    name: 'dlt'
                },
                {
                    id: '1520100016',
                    name: 'xlt'
                },
                {
                    id: '1520100003',
                    name: 'lsjs'
                },
                {
                    id: '1520100004',
                    name: 'jn'
                },
                {
                    id: '1520100007',
                    name: 'jh'
                },
                {
                    id: '1520130001',
                    name: 'yz330'
                },
                {
                    id: '1520130003',
                    name: 'yz310'
                },
                {
                    id: '1520130002',
                    name: 'lyznr1'
                },

                {
                    id: '1520130009',
                    name: 'lyznrdz1'
                },
                {
                    id: '1520100022',
                    name: 'cgb970'
                },
                {
                    id: '1520100023',
                    name: 'yxb970'
                },
                {
                    id: '1520100027',
                    name: 'yxb300'
                },
                {
                    id: '1520100028',
                    name: 'jdb300'
                },
                {
                    id: '1520100030',
                    name: 'cz380'
                },
                {
                    id: '1520100029',
                    name: 'cz135'
                },
                {
                    id: '1520100032',
                    name: 'syz380'
                },
                {
                    id: '1520100031',
                    name: 'syz135'
                },
                {
                    id: '1102010001',
                    name: 'yzz245'
                },
                {
                    id: '1103010003',
                    name: 'lyzz1'
                },
                {
                    id: '1103010005',
                    name: 'yzz300'
                },
                {
                    id: '1103010006',
                    name: 'hpyzz125'
                },
                {
                    id: '1103010007',
                    name: 'lkyzz300'
                },
                {
                    id: '1520110069',
                    name: 'xqmc'
                },
                {
                    id: '1520110072',
                    name: 'pcb'
                },
                {
                    id: '1520110073',
                    name: 'gm1l'
                },
                // {
                //     id: 'Y0003',
                //     name: 'le003'
                // },
                {
                    id: '3520100002',
                    name: 'xyw1'
                },
                {
                    id: '3520100012',
                    name: 'xbt1'
                },
                {
                    id: '3520100010',
                    name: 'dbt1'
                },
                {
                    id: '3520100001',
                    name: 'dyw1'
                },

                {
                    id: 'HNLK001',
                    name: 'yzz1Lh'
                },
                {
                    id: 'HNLK002',
                    name: 'yzz125Lh'
                },
                {
                    id: 'HNLK003',
                    name: 'yzz300h'
                },
                {
                    id: 'HNLK006',
                    name: 'yzz300h1'
                },
                {
                    id: 'HNLK005',
                    name: 'yzz245h'
                },
                {
                    id: '1520100045',
                    name: 'qinxi450'
                },
                {
                    id: '1520100040',
                    name: 'xqn300'
                },
                {
                    id: '1520100039',
                    name: 'xqn900'
                },
                {
                    id: '1520100037',
                    name: 'pgz900'
                },
                {
                    id: '1520100038',
                    name: 'pgz300'
                },
                {
                    id: '1520100036',
                    name: 'mgbl300'
                },
                {
                    id: '1520100035',
                    name: 'mgbl900'
                },
                {
                    id: '1520100041',
                    name: 'yzz24541'
                },
                {
                    id: '1520100042',
                    name: 'yzz1ll'
                },
                {
                    id: '1520100043',
                    name: 'yzz30043'
                },
                {
                    id: '1520100044',
                    name: 'yzz125red'
                },
                {
                    id: '1520100046',
                    name: 'yzz300box'
                },

                {
                    id: '3520100006',
                    name: 'xqxjsh'
                },
                {
                    id: '3520100011',
                    name: 'yznr330h'
                },
                {
                    id: 'HBLK002',
                    name: 'HBLK002'
                },
                {
                    id: 'HBLK003',
                    name: 'HBLK003'
                },
                {
                    id: 'HBLK004',
                    name: 'HBLK004'
                },
                {
                    id: 'HNYZ0001',
                    name: 'HNYZ0001'
                },
                {
                    id: 'HNYZ0002',
                    name: 'HNYZ0002'
                },
                {
                    id: 'HNYZ0003',
                    name: 'HNYZ0003'
                },
                {
                    id: 'HNYZ0004',
                    name: 'HNYZ0004'
                },
                {
                    id: 'SCLK0001',
                    name: 'SCLK0001'
                },
                {
                    id: 'SCLK0002',
                    name: 'SCLK0002'
                },
                {
                    id: 'HFZF001',
                    name: 'HFZF001'
                },
                {
                    id: 'HFZF002',
                    name: 'HFZF002'
                },
                {
                    id: 'HFZF003',
                    name: 'HFZF003'
                },
                {
                    id: 'HFZF004',
                    name: 'HFZF004'
                },
                {
                    id: 'HFZF006',
                    name: 'HFZF006'
                },
                {
                    id: '1520100019',
                    name: 'gmxxmc900'
                },
                {
                    id: '1520100018',
                    name: 'gmxxmc420'
                },
                {
                    id: 'HBLK007',
                    name: 'HBLK007'
                },
                {
                    id: 'HBLK001',
                    name: 'HBLK001'
                },
                {
                    id: '1520100047',
                    name: 'CGB950'
                },
                {
                    id: '1520100048',
                    name: 'YXB950'
                },
                {
                    id: '1520100034',
                    name: 'yzs1l'
                },
                {
                    id: '1520100049',
                    name: 'yqb36'
                },
            ],
        };
    },
    created() {
        this.calculateDates();
    },
    mounted() {
        this.getDataList()
    },
    methods: {
        setActiveButton(button) {
            this.activeButton = button; // 设置当前激活的按钮  
            // 这里可以调用相应的函数，例如：  
            if (button === 'order') {
                this.getorderList();
            } else {
                this.getarrivalList();
            }
        },
        //订单时间
        getorderList() {
            this.show = false
        },
        //到货时间
        getarrivalList() {
            this.show = true
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
        },
        formatDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1 
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },
        mergeByName(arr) {
            return Object.values(
                arr.reduce((acc, obj) => {
                    const { nAME, box, cProductCode, cProductName, cSiteName, cname, ocustomerClass_name, sqname, vouchdate, ...rest } = obj;

                    if (!acc[nAME]) {
                        acc[nAME] = { nAME, box, cProductCode, cProductName, cSiteName, cname, ocustomerClass_name, sqname, vouchdate };
                    }

                    // 累加除了特定字段之外的值  
                    for (const [key, value] of Object.entries(rest)) {
                        acc[nAME][key] = (acc[nAME][key] || 0) + value;
                    }

                    return acc;
                }, {})
            );
        },

        async getDataList() {
            this.dataListLoading = true;

            this.results = []
            const startDate = new Date(this.dataForm.p_vouchdatestart); // 开始日期  
            const endDate = new Date(this.dataForm.p_vouchdateend); // 结束日期  
            const dateArray = []; // 用于存储要调用的日期  

            // 生成日期数组  
            for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
                dateArray.push(new Date(d).toISOString().split('T')[0]); // 将日期格式化为 YYYY-MM-DD  
            }

            // 循环调用接口  
            for (const date of dateArray) {
                // 设置 dataForm 的日期  
                const dictForm = {
                    p_vouchdatestart: date,
                    p_vouchdateend: date,
                };

                // 调用 API  
                const res = await api.sitenccApi(dictForm);

                this.dataList = res

                this.dataList.forEach(item => {
                    if (item.cProductCode == 'HBLK007') {
                        item.box = item.box / 40
                    }
                })


                // 处理 dataList（与原来相同的逻辑）  
                this.dataList = this.dataList.map(item => {
                    // 在 codes 数组中查找匹配的对象   
                    const matchedCode = this.codes.find(codeItem => codeItem.id === item.cProductCode);
                    // 如果找到了匹配的对象，添加新字段并设置 box 字段的值   
                    if (matchedCode) {
                        return {
                            ...item, // 保留原始 item 的所有字段   
                            [matchedCode.name]: item.box // 新增字段，名称为 matchedCode.name，值为 box 字段的值   
                        };
                    }
                    // 如果没有匹配的，返回原始 item  
                    return item;
                });

                console.log(this.dataList, 'dataList')
                //去除这些对象
                this.dataList = this.dataList.map(({ box, cProductCode, cProductName, product_class_pname, attribute, ...rest }) => rest);


                this.dataList = this.dataList.map(obj => {
                    // 计算非指定字段的和  
                    const sum = Object.keys(obj)
                        .filter(key => !["cSiteName", "cname", "nAME", "ocustomerClass_name", "sqname", "vouchdate"].includes(key))
                        .reduce((acc, key) => {
                            // 转换为数字并相加，确保即使是字符串也会被正确转换  
                            const value = Number(obj[key]);
                            return acc + (typeof value === 'number' && !isNaN(value) ? value : 0);
                        }, 0);

                    // 转换为带有两位小数的数字  
                    const formattedSum = parseFloat(sum.toFixed(2));

                    return { ...obj, sum: formattedSum }; // 返回新对象，包含原有字段和计算的 sum 字段  
                });



                this.dataList = this.dataList.map(item => {
                    return {
                        ...item, // 保留所有原有字段  
                        dbt: ((Number(item.dbt) || 0) + (Number(item.dbt1) || 0)).toFixed(2), // 更新 dbt 字段  
                        xbt: ((Number(item.xbt) || 0) + (Number(item.xbt1) || 0)).toFixed(2), // 更新 xbt 字段  
                        bigyuanwei: ((Number(item.bigyuanwei) || 0) + (Number(item.dyw1) || 0)).toFixed(2), // 更新 bigyuanwei 字段  
                        smallyuanwei: ((Number(item.smallyuanwei) || 0) + (Number(item.xyw1) || 0)).toFixed(2), // 更新 smallyuanwei 字段  le003 yzz24599 HBLK004
                        yzz245: ((Number(item.yzz245) || 0) + (Number(item.yzz245h) || 0) + (Number(item.yzz24541) || 0) + (Number(item.yzz24599) || 0) + (Number(item.HBLK004) || 0) + (Number(item.HNYZ0004) || 0) + (Number(item.HFZF006) || 0)).toFixed(2),
                        lyzz1: ((Number(item.lyzz1) || 0) + (Number(item.yzz1Lh) || 0) + (Number(item.yzz1ll) || 0) + (Number(item.HNYZ0001) || 0) + (Number(item.SCLK0001) || 0) + (Number(item.HFZF001) || 0) + (Number(item.HBLK001) || 0)).toFixed(2),
                        yzz300: ((Number(item.yzz300) || 0) + (Number(item.yzz300h) || 0) + (Number(item.yzz30043) || 0) + (Number(item.HBLK003) || 0) + (Number(item.HNYZ0003) || 0) + (Number(item.HFZF003) || 0)).toFixed(2),
                        hpyzz125: ((Number(item.hpyzz125) || 0) + (Number(item.yzz125Lh) || 0) + (Number(item.yzz125red) || 0) + (Number(item.HBLK002) || 0) + (Number(item.HNYZ0002) || 0) + (Number(item.SCLK0002) || 0) + (Number(item.HFZF002) || 0)).toFixed(2),
                        lkyzz300: ((Number(item.lkyzz300) || 0) + (Number(item.yzz300h1) || 0) + (Number(item.HFZF004) || 0) + (Number(item.HBLK007) || 0)).toFixed(2),
                        yz330: ((Number(item.yz330) || 0) + (Number(item.yznr330h) || 0)).toFixed(2),
                        xjs: ((Number(item.xjs) || 0) + (Number(item.xqxjsh) || 0)).toFixed(2),
                        cgb970:((Number(item.cgb970) || 0) + (Number(item.CGB950) || 0)).toFixed(2),
                        yxb970:((Number(item.yxb970) || 0) + (Number(item.YXB950) || 0)).toFixed(2),
                        yxb300: ((Number(item.yxb300) || 0) + (Number(item.yqb36) || 0)).toFixed(2), 
                    };
                });
                this.dataList.forEach(item => {
                    const xqmcValue = parseFloat(item.xqmc) || 0; // 如果没有值，则取0  
                    const gm1lValue = parseFloat(item.gm1l) || 0; // 如果没有值，则取0  
                    const pcbValue = parseFloat(item.pcb) || 0; // 如果没有值，则取0 
                    const gmxxmc900 = parseFloat(item.gmxxmc900) || 0;
                    const gmxxmc420 = parseFloat(item.gmxxmc420) || 0;
                    item.Qtnmer = xqmcValue + gm1lValue + pcbValue + gmxxmc900 + gmxxmc420; // 计算和并赋值给新字段   // 计算和并赋值给新字段  
                });
                this.dataList.forEach(item => {
                    if (item.sqname) { // 检查 sqname 是否存在且非空  
                        item.sqname = item.sqname.replace(/\d+/g, '').trim(); // 替换数字并去除空格  
                    }
                });

                // 将每个日期的结果添加到 results 数组中  
                this.results.push(...this.dataList);
            }


            // 计算合计  
            const summedData = this.results.reduce((acc, item) => {
                Object.keys(item).forEach(key => {
                    // 过滤出不需要的字段  
                    if (!['cSiteName', 'nAME', 'ocustomerClass_name', 'sqname', 'vouchdate'].includes(key)) {
                        const value = Number(item[key]) || 0; // 转换为数字，若不能转换则为0  
                        const roundedValue = parseFloat(value.toFixed(2)); // 保留两位小数  

                        // 累加到对应的字段  
                        if (!acc[key]) acc[key] = 0;
                        acc[key] += roundedValue;
                    }
                });
                return acc;
            }, {});

            // 创建一个新对象，填充ocustomerClass_name 为 "合计"  
            // 确保每个字段都保留两位小数  
            const totalObject = {
                ocustomerClass_name: '合计',
                ...Object.fromEntries(
                    Object.entries(summedData).map(([key, value]) => [key, parseFloat(value.toFixed(2))])
                ) // 确保合计值保留两位小数  
            };

            // 将合计对象添加到原数组中  
            this.results.push(totalObject);

            // 过滤数据  
            this.results = this.results.filter(item =>
                (item.nAME && item.nAME.toLowerCase().includes(this.bullay)) ||
                (item.sqname && item.sqname.toLowerCase().includes(this.bullay)) ||
                (item.ocustomerClass_name && item.ocustomerClass_name.toLowerCase().includes(this.bullay)) ||
                (item.cSiteName && item.cSiteName.toLowerCase().includes(this.bullay))
            );

            console.log(this.results, 'this.results');

            this.currentData = {
                ...this.results
            };
            this.dataListLoading = false;
            this.sizeChangeHandle(this.pageSize);

            // 打印最终的 dataList  


            this.dataListLoading = false; // 设置加载状态为结束  
        },
        // 每页数
        sizeChangeHandle(val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.currentData = this.results.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this
                .pageSize);
        },
        // 当前页
        handleCurrentChange(val) {
            console.log(val)
            this.currentPage = val;
            this.currentData = this.results.slice((val - 1) * this.pageSize, val * this.pageSize);
        },
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                exportExcel(this.results, '已审核报单明细.xlsx')

            })
        },
    }
};
</script>

<style scoped lang="scss"></style>