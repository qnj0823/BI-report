<template>
    <div class='WorkUnitLow'>
        <el-form :inline="true" style="width: 100%; margin: 0 auto;">
            <!-- <el-form-item>
                <el-date-picker v-model="dataForm.p_vouchdatestart" value-format="yyyy-MM-dd" type="date"
                    placeholder="开始日期" clearable style="width: 100%"
                    @change="handleStartDateChange"></el-date-picker>
            </el-form-item> -->
            <el-form-item>
                <!-- :picker-options="pickerOptions"  -->
                <el-date-picker v-model="dataForm.p_vouchdateend" value-format="yyyy-MM-dd" type="date" placeholder="日期"
                    clearable style="width: 100%"
                    @change="handleStartDateChange1"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-input v-model="bullay" placeholder="模糊查询" clearable @keyup.enter.native="searchEnterFun()"
                    ref="searchInput"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
                    @click="getdataList">查询</el-button>
                <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                    @click="exportData">导出</el-button>
                <el-button size="mini" class="filter-item" type="success" @click="calculate">重新计算</el-button>
            </el-form-item>

        </el-form>
        <div class="test">{{ this.labelText }}</div>
        <el-divider></el-divider>
        <el-table border ref="table" v-loading="dataListLoading" :data="dataList" style="width: 100%;">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="teamsno" label="班组" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="companyname" label="单位体" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="companyperson" label="负责人" />
            <el-table-column prop="box" align="center" label="今日报单(低温)" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="yearbox" width="150"
                :label="`${year - 1}年${month}月销售数据`" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="lowtempStan" label="低温增幅" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="lowTask" :label="`${month}月低温任务`" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="ordernum" label="本月单数" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="averordernum" label="本月平均每单任务">
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="orderdaynum" label="当天单数" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="converBigPiece"
                :label="`${month}月累计-低温系列(到货数)`">
                <el-table-column :show-overflow-tooltip="true" align="center" prop="lookbox" label="LOOk系列">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yezibox" label="330/310系列">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="box180" label="180系列">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="Astoday" label="截止今日完成">
                </el-table-column>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="daydiff" :label="`${month}月截止今日差额`">
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="Adddiff" :label="`${month}月累计差额`">
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="rate" :label="`${month}月低温同比增幅`">
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="Accmplish" :label="`${month}月完成率`">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import {
    exportExcel
} from './WorkUnitLowExpro.js'
import * as api from '@/api/management/management.js'
export default {
    name: 'WorkUnitLow-page',
    data() {
        return {
            msg: '班组单位体低温报单进度表',
            dataListLoading: false,
            bullay: '',//查询
            dataList: [],//总数据存储
            lowtempList: [],//今日低温
            LowTempdataList: [],//低温增幅比
            lowtempForm: {
                curdate: ''
            },
            historyForm: {
                curdate: ''
            },
            historyList: [],//去年已算数据
            TeamsAnList: [],//班组/单位体数据表
            TeamsAnForm: {
                page: 0,
                size: 2000,
            },
            templookList: [],//look系列累计
            templookForm: {
                startdate: '',
                enddate: '',
                ishistory: '0'
            },
            yearlookForm: {
                startdate: '',
                enddate: '',
                ishistory: '1'
            },
            curList: [],
            yearlookList: [],//去年look系列累计
            yearotherList: [],//去年330-310
            MonthSIngList: [],//本月单数
            MonthmaxList: [],//本月单数
            tempotherList: [],//330-310
            breastList:[],//180系列
            tempyearList: [],//去年同月低温销售数据
            dataForm: {
                p_vouchdateend: '',
                p_vouchdatestart: '',
            },
            //只允许点击当月
            // pickerOptions: {
            //     disabledDate(time) {
            //         const now = new Date();
            //         const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
            //         const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            //         return time.getTime() < firstDay.getTime() || time.getTime() > lastDay.getTime();
            //     }
            // },
            calForm: {
                enddate: ''
            },
            year: '',//年
            month: '',//月
            day: '',//日
            labelText: ''//抬头标题

        };
    },
    created() {
        this.calculateCurrentYearDates();
        this.calculateLastYearDates()
    },
    mounted() {
        this.getdataList()
    },
    methods: {
        handleStartDateChange(selectedDate) {
            if (!selectedDate) return;  // 如果清空了选择，直接返回

            console.log("原始选择的开始日期：", selectedDate);  // 如 "2025-04-10"

            // 将日期字符串转为Date对象
            const dateObj = new Date(selectedDate);

            // 获取上一年同一天的日期
            dateObj.setFullYear(dateObj.getFullYear() - 1);

            // 格式化为YYYY-MM-DD字符串
            const lastYearDate = this.formatDate(dateObj);

            console.log("转换为上一年的日期：", lastYearDate);  // 如 "2024-04-10"

            // 更新绑定的数据（如果需要）
            this.yearlookForm.enddate = lastYearDate;
        },
        handleStartDateChange1(selectedDate) {
            if (!selectedDate) return;  // 如果清空了选择，直接返回

            console.log("原始选择的开始日期：", selectedDate);  // 如 "2025-04-10"

            // 将日期字符串转为Date对象
            const dateObj = new Date(selectedDate);

            // // 获取上一年同一天的日期
            // dateObj.setFullYear(dateObj.getFullYear() - 1);

            // // 格式化为YYYY-MM-DD字符串
            // const lastYearDate = this.formatDate(dateObj);

            // console.log("转换为上一年的日期：", lastYearDate);  // 如 "2024-04-10"

            // // 更新绑定的数据（如果需要）
            // this.yearlookForm.startdate = lastYearDate;
            // this.historyForm.curdate = lastYearDate;
        },
        calculate() {
            this.dataListLoading = true;
            this.calForm.enddate = this.dataForm.p_vouchdateend;
            api.APIrunLook(this.calForm).then(res => {
                this.getdataList();
                this.dataListLoading = false;
            })
        },
        //全部api接口
        async getdataList() {
            this.dataListLoading = true;
            this.lowtempForm.curdate = this.dataForm.p_vouchdateend
            this.templookForm.startdate = this.dataForm.p_vouchdatestart
            this.templookForm.enddate = this.dataForm.p_vouchdateend

            const [year, month, day] = this.lowtempForm.curdate.split('-').map(Number);
            this.labelText = `${year}年${month}月班组单位体低温报单进度表--截止${month}月${day}日`; // 如果没有选择日期，显示默认文本

            try {
                const [lowtempres, TeamsAnres, tempcurres, LowTempdata, montrhsinger, history] = await Promise.all([
                    api.APIquerylowtempCHECK(this.lowtempForm),//今日低温
                    api.APITeamsAndCHECK(this.TeamsAnForm),//班组/单位体数据表
                    api.APIlowgetcurall(this.lowtempForm),//今日报单半个小时算一次
                    api.APILowTempCHECK(this.TeamsAnForm),//低温增幅比数据表
                    api.APIMonthCycleCHECK(this.TeamsAnForm),//本月单数
                    // api.APIgetcurall(this.historyForm),//去年以算数据
                    api.APILowTempLastsCHECK(this.TeamsAnForm)//去年以算数据导入

                ]);

                // 处理第一个今日低温API的响应
                this.lowtempList = lowtempres;
                console.log('今日低温:', this.lowtempList);

                // 处理第二个班组/单位体数据表API的响应
                this.TeamsAnList = TeamsAnres.content;

                // // 处理第三个lookAPI的响应
                // this.templookList = templookres
                // console.log('look系列:', this.templookList)

                // // 处理第四个330-310API的响应
                // this.tempotherList = tempother
                // console.log('330-310系列:', this.tempotherList)

                //今日报单每半个小时计算一次
                this.curList = tempcurres
                const { type3, type1, type2 } = this.curList.reduce((acc, item) => {
                    if (item.type == 3) acc.type3.push(item);
                    else if (item.type == 1) acc.type1.push(item);
                    else if (item.type == 2) acc.type2.push(item);
                    return acc;
                }, { type3: [], type1: [], type2: [] });

                // 赋值到组件属性
                //180奶酪系列
                this.breastList = type3;
                //look系列
                this.templookList = type1;  // type=1 的数据
                //330/310系列
                this.tempotherList = type2; // type=2 的数据


                // 处理第六个低温增幅比数据表API的响应
                this.LowTempdataList = LowTempdata.content
                console.log('低温增幅比数据表:', this.LowTempdataList)

                // //去年已算数据
                // this.historyList = history
                // const { type0, type1, type2 } = this.historyList.reduce((acc, item) => {
                //     if (item.type == 0) acc.type0.push(item);
                //     else if (item.type == 1) acc.type1.push(item);
                //     else if (item.type == 2) acc.type2.push(item);
                //     return acc;
                // }, { type0: [], type1: [], type2: [] });

                // // 赋值到组件属性
                // this.tempyearList = type0;  // type=0 的数据
                // this.yearlookList = type1;  // type=1 的数据
                // this.yearotherList = type2; // type=2 的数据
                // console.log('去年已算数据:', this.historyList, this.tempyearList, this.yearlookList, this.yearotherList)

                //去年销售数据导入,根据时间来进行取值
                this.historyList = history.content

                this.tempyearList = this.historyList
                const dateStr = this.dataForm.p_vouchdateend;
                const dateParts = dateStr.split('-');
                const formattedDate = dateParts[0] + parseInt(dateParts[1]);

                this.tempyearList = this.tempyearList.filter(item => item.yearmonth == formattedDate);
                console.log(this.tempyearList, 'this.tempyearList')

                // let yearLowTempRes, yearLookRes, yearOtherRes;
                // if (!history || history.length === 0) {
                //     this.$set(this, 'tempyearList', []);
                //     this.$set(this, 'yearlookList', []);
                //     this.$set(this, 'yearotherList', []);

                //     [yearLowTempRes, yearLookRes, yearOtherRes] = await Promise.all([
                //         api.APIdqyearlowtempCHECK(this.lowtempForm),
                //         api.APIdqlowlookCHECK(this.yearlookForm),
                //         api.APIdqlowotherCHECK(this.yearlookForm)
                //     ]);
                //     this.tempyearList = yearLowTempRes;
                //     this.yearlookList = yearLookRes;
                //     this.yearotherList = yearOtherRes;

                //     console.log('去年同月低温销售数据:', this.tempyearList);
                //     console.log('去年look系列:', this.yearlookList);
                //     console.log('去年330-310系列:', this.yearotherList);
                // }

                // 处理第九个本月单数API的响应
                this.MonthSIngList = montrhsinger
                //取当前月的值
                this.MonthSIngList = this.MonthSIngList.filter(item => item.yearmonth == formattedDate);

                this.MonthmaxList = this.filterMaxOrderNum(this.MonthSIngList)
                console.log('本月单数:', this.MonthSIngList, this.MonthmaxList)

                // 今日低温与班组/单位体数据表匹配
                this.TeamsAnList = this.TeamsAnList.map(team => {
                    const matchedItem = this.lowtempList.find(item => item.companyid === team.companyid);
                    return {
                        ...team,
                        box: matchedItem ? matchedItem.box : '' // 添加box字段，如果没匹配则为'''
                    };
                });
                //look与上一数据表匹配
                this.TeamsAnList = this.TeamsAnList.map(team => {
                    const matchedItem = this.templookList.find(item => item.companyid === team.companyid);
                    return {
                        ...team,
                        lookbox: matchedItem ? matchedItem.box : '' // 添加box字段，如果没匹配则为'''
                    };
                });

                //330-310与上一数据表匹配
                this.TeamsAnList = this.TeamsAnList.map(team => {
                    const matchedItem = this.tempotherList.find(item => item.companyid === team.companyid);
                    return {
                        ...team,
                        yezibox: matchedItem ? matchedItem.box : '' // 添加box字段，如果没匹配则为'''
                    };
                });
                 //180系列与上一数据表匹配
                 this.TeamsAnList = this.TeamsAnList.map(team => {
                    const matchedItem = this.breastList.find(item => item.companyid === team.companyid);
                    return {
                        ...team,
                        box180: matchedItem ? matchedItem.box : '' // 添加box字段，如果没匹配则为'''
                    };
                });


                // //去年look与上一数据表匹配
                // this.TeamsAnList = this.TeamsAnList.map(team => {
                //     const matchedItem = this.yearlookList.find(item => item.companyid === team.companyid);
                //     return {
                //         ...team,
                //         yearlookbox: matchedItem ? matchedItem.box : '' // 添加box字段，如果没匹配则为'''
                //     };
                // });

                // //去年330-310与上一数据表匹配
                // this.TeamsAnList = this.TeamsAnList.map(team => {
                //     const matchedItem = this.yearotherList.find(item => item.companyid === team.companyid);
                //     return {
                //         ...team,
                //         yearyezibox: matchedItem ? matchedItem.box : '' // 添加box字段，如果没匹配则为'''
                //     };
                // });


                //去年同月低温销售数据与上一数据表匹配
                this.TeamsAnList = this.TeamsAnList.map(team => {
                    const matchedItem = this.tempyearList.find(item => item.companyid === team.companyid);
                    return {
                        ...team,
                        yearbox: matchedItem ? matchedItem.lastgoal : '' // 添加box字段，如果没匹配则为'''
                    };
                });

                //低温增幅比数据表与上一数据表匹配
                this.TeamsAnList = this.TeamsAnList.map(team => {
                    const matchedItem = this.LowTempdataList.find(item => item.companyid === team.companyid);
                    return {
                        ...team,
                        lowtempStan: matchedItem ? matchedItem.lowtemp : '' // 添加box字段，如果没匹配则为'''
                    };
                });

                //本月单数数据表匹配
                this.TeamsAnList = this.TeamsAnList.map(team => {
                    const matchedItem = this.MonthmaxList.find(item => item.companyid === team.companyid);
                    return {
                        ...team,
                        ordernum: matchedItem ? matchedItem.ordernum : '' // 添加box字段，如果没匹配则为'''
                    };
                });

                //当前天单数匹配
                this.TeamsAnList = this.TeamsAnList.map(team => {
                    const matchedItem = this.MonthSIngList.find(item =>
                        item.companyid === team.companyid &&
                        item.days === this.dataForm.p_vouchdateend
                    );
                    return {
                        ...team,
                        orderdaynum: matchedItem ? matchedItem.ordernum : '' // 如果没匹配则赋空值
                    };
                });
                //计算本月低温任务
                this.TeamsAnList = this.TeamsAnList.map(item => {
                    // 1. 处理 lowtempStan（空值或格式错误时默认 0）
                    let lowtempStanNum = 0;
                    if (item.lowtempStan && typeof item.lowtempStan === 'string') {
                        const lowtempStanStr = item.lowtempStan.replace('%', '');
                        lowtempStanNum = Number(lowtempStanStr) / 100 || 0;
                    }
                    // 3. 计算 lowTask
                    const lowTask = (item.yearbox * (1 + lowtempStanNum)).toFixed(1); // 字符串形式
                    // 5. 返回新对象（保留原有字段，新增 lowTask）
                    return {
                        ...item,
                        lowTask  // 当月低温任务
                    };
                })
                //计算合计
                const addList = this.addNationalTotal(this.TeamsAnList)

                console.log(addList, 'addList')
                //计算班组小计
                this.dataList = this.mergeObjectsByTeamsno(this.TeamsAnList);

                this.dataList.push(...addList);


                //计算低温任务
                this.dataList = this.dataList.map(item => {

                    // 2. 计算 Astoday 
                    const lookbox = (Number(item.lookbox) || 0).toFixed(1); // 字符串形式 "80.0"
                    const yezibox = (Number(item.yezibox) || 0).toFixed(1); // 字符串形式 "50.0"
                    const Astoday = (Number(lookbox) + Number(yezibox)).toFixed(1); // 直接返回字符串，如 "80.0"

                    // 4. 计算 Adddiff 
                    const Adddiff = (Number(item.lowTask) - Number(Astoday)).toFixed(1); // 字符串形式


                    // 计算本月平均单数
                    const ordernum = Number(item.ordernum) || 0;
                    const lowTaskNum = Number(item.lowTask) || 0;

                    // 计算平均值，处理除数为0或无效值的情况
                    let averordernum = '0.0'; // 默认值
                    if (ordernum !== 0 && !isNaN(lowTaskNum)) {
                        averordernum = (lowTaskNum / ordernum).toFixed(1);
                    }

                    //计算截至今日差额

                    const daydiff = (Number(item.orderdaynum) * Number(averordernum) - Number(Astoday)).toFixed(1);


                    //计算rate
                    const yearbox = Number(item.yearbox) || 0; //去年销售数据
                    const orderdaynum = Number(item.orderdaynum) || 0; //当天单数
                    const ordernum1 = Number(item.ordernum) || 0; //本月单数

                    const yearlinDate = ((yearbox / ordernum1) * orderdaynum).toFixed(1)


                    // 计算增长率（安全处理除零和无效值）
                    let rateValue = 0; // 默认值
                    const astodayNum = Number(Astoday) || 0; // 确保 Astoday 是有效数字

                    // 仅当分母和分子均有效时才计算
                    if (yearlinDate > 0 && astodayNum > 0) {
                        rateValue = ((astodayNum - Number(yearlinDate)) / Number(yearlinDate)) * 100;
                    }

                    // 格式化结果（避免 "-0.0%" 的情况）
                    const formattedRate = rateValue.toFixed(1) + '%'; // 字符串形式，如 "0.0%"

                    //计算完成率
                    let accomplishValue;
                    if (!item.lowTask || item.lowTask === '0.0' || !Astoday || Astoday === '0.0') {
                        accomplishValue = 0; // 被除数或除数为空/0时，强制结果为0
                    } else {
                        accomplishValue = Number(Astoday) / Number(item.lowTask) * 100;
                    }
                    const formattedAccmplish = accomplishValue.toFixed(1) + '%'; // 字符串形式，如 "0.8"

                    // 5. 返回新对象（保留原有字段，新增 lowTask、Astoday 和 Adddiff）
                    return {
                        ...item,
                        lookbox,      // 保留1位小数（字符串）
                        yezibox,      // 保留1位小数（字符串）
                        Astoday,  // 截至当天
                        Adddiff,
                        daydiff, // 差额
                        averordernum,
                        rate: formattedRate,//同比增幅
                        Accmplish: formattedAccmplish,
                        yearlinDate
                    };
                });
                console.log('班组/单位体数据表:', this.dataList);
                //计算区域平均每单任务
                this.dataList = this.sumAndAssignAverordernum(this.dataList);
                this.dataList = this.dataList.map(item => {
                    // 检查companyname是否包含"小计"
                    if (item.companyname && item.companyname.includes("小计")) {
                        const lookboxNum = Number(item.lookbox) || 0;
                        const yeziboxNum = Number(item.yezibox) || 0;
                        const Astoday = (lookboxNum + yeziboxNum).toFixed(1);

                        // 计算增长率（安全处理除零和无效值）
                        let rateValue = 0; // 默认值
                        const astodayNum = Number(Astoday) || 0; // 确保 Astoday 是有效数字

                        // 仅当分母和分子均有效时才计算
                        if (item.yearlinDate > 0 && astodayNum > 0) {
                            rateValue = ((astodayNum - Number(item.yearlinDate)) / Number(item.yearlinDate)) * 100;
                        }

                        // 格式化结果（避免 "-0.0%" 的情况）
                        const formattedRate = rateValue.toFixed(1) + '%'; // 字符串形式，如 "0.0%"



                        // 返回新对象，包含原有属性和计算后的Astoday
                        return {
                            ...item,
                            rate: formattedRate,//同比增幅
                        };
                    }
                    return item; // 不包含"小计"的直接返回原对象
                });
                this.dataList = this.sumAndAssignToTotal(this.dataList);
                this.dataList = this.dataList.map(item => {
                    // 检查companyname是否包含"小计"
                    if (item.teamsno.includes("合计")) {
                        const lookboxNum = Number(item.lookbox) || 0;
                        const yeziboxNum = Number(item.yezibox) || 0;
                        const Astoday = (lookboxNum + yeziboxNum).toFixed(1);

                        // 计算增长率（安全处理除零和无效值）
                        let rateValue = 0; // 默认值
                        const astodayNum = Number(Astoday) || 0; // 确保 Astoday 是有效数字

                        // 仅当分母和分子均有效时才计算
                        if (item.yearlinDate > 0 && astodayNum > 0) {
                            rateValue = ((astodayNum - Number(item.yearlinDate)) / Number(item.yearlinDate)) * 100;
                        }

                        // 格式化结果（避免 "-0.0%" 的情况）
                        const formattedRate = rateValue.toFixed(1) + '%'; // 字符串形式，如 "0.0%"



                        // 返回新对象，包含原有属性和计算后的Astoday
                        return {
                            ...item,
                            rate: formattedRate,//同比增幅
                        };
                    }
                    return item; // 不包含"小计"的直接返回原对象
                });

                //不保留一位小数
                this.dataList = this.dataList.map(item => {
                    const newItem = {};

                    // 遍历对象的每个属性
                    for (const key in item) {
                        if (key === 'Accmplish' || key === 'teamsno' || key === 'rate' || key === 'companyid' || key === 'companycode' || key === 'companyname' || key === 'companyperson' || key === 'teamsperson' || key === 'lowtempStan') {
                            // 保留这三个字段不变
                            newItem[key] = item[key];
                        } else {
                            // 其他字段转为数字并保留一位小数
                            const numValue = parseFloat(item[key]);
                            newItem[key] = isNaN(numValue) ? item[key] : parseFloat(numValue.toFixed(0));
                        }
                    }

                    return newItem;
                });
                console.log('已存储:', this.dataList);


            } catch (error) {
                console.error("获取数据时出错:", error);
                // 可以在这里添加错误提示
                this.$message.error('数据加载失败，请重试');
            } finally {
                this.dataListLoading = false; // 确保无论成功失败都会重置加载状态
            }
        },
        //全部api接口
        async fetchAllData() {
            this.dataListLoading = true;
            this.lowtempForm.curdate = this.dataForm.p_vouchdateend
            this.templookForm.startdate = this.dataForm.p_vouchdatestart
            this.templookForm.enddate = this.dataForm.p_vouchdateend

            const [year, month, day] = this.lowtempForm.curdate.split('-').map(Number);
            this.labelText = `${year}年${month}月班组单位体低温报单进度表--截止${month}月${day}日`; // 如果没有选择日期，显示默认文本

            try {
                const [lowtempres, TeamsAnres, templookres, tempother, LowTempdata, montrhsinger, history] = await Promise.all([
                    api.APIquerylowtempCHECK(this.lowtempForm),//今日低温
                    api.APITeamsAndCHECK(this.TeamsAnForm),//班组/单位体数据表
                    api.APIquerylowtemplookCHECK(this.templookForm), //look系列累计
                    api.APIquerylowtempotherCHECK(this.templookForm),//330/310累计
                    api.APILowTempCHECK(this.TeamsAnForm),//低温增幅比数据表
                    api.APIMonthCycleCHECK(this.TeamsAnForm),//本月单数
                    // api.APIgetcurall(this.historyForm),//去年以算数据
                    api.APILowTempLastsCHECK(this.TeamsAnForm)//去年以算数据导入

                ]);

                // 处理第一个今日低温API的响应
                this.lowtempList = lowtempres;
                console.log('今日低温:', this.lowtempList);

                // 处理第二个班组/单位体数据表API的响应
                this.TeamsAnList = TeamsAnres.content;

                // 处理第三个lookAPI的响应
                this.templookList = templookres
                console.log('look系列:', this.templookList)

                // 处理第四个330-310API的响应
                this.tempotherList = tempother
                console.log('330-310系列:', this.tempotherList)


                // 处理第六个低温增幅比数据表API的响应
                this.LowTempdataList = LowTempdata.content
                console.log('低温增幅比数据表:', this.LowTempdataList)

                // //去年已算数据
                // this.historyList = history
                // const { type0, type1, type2 } = this.historyList.reduce((acc, item) => {
                //     if (item.type == 0) acc.type0.push(item);
                //     else if (item.type == 1) acc.type1.push(item);
                //     else if (item.type == 2) acc.type2.push(item);
                //     return acc;
                // }, { type0: [], type1: [], type2: [] });

                // // 赋值到组件属性
                // this.tempyearList = type0;  // type=0 的数据
                // this.yearlookList = type1;  // type=1 的数据
                // this.yearotherList = type2; // type=2 的数据
                // console.log('去年已算数据:', this.historyList, this.tempyearList, this.yearlookList, this.yearotherList)

                //去年已算数据导入
                this.historyList = history.content

                this.tempyearList = this.historyList
                const dateStr = this.dataForm.p_vouchdateend;
                const dateParts = dateStr.split('-');
                const formattedDate = dateParts[0] + parseInt(dateParts[1]);

                this.tempyearList = this.tempyearList.filter(item => item.yearmonth == formattedDate);
                console.log(this.tempyearList, 'this.tempyearList')

                // let yearLowTempRes, yearLookRes, yearOtherRes;
                // if (!history || history.length === 0) {
                //     this.$set(this, 'tempyearList', []);
                //     this.$set(this, 'yearlookList', []);
                //     this.$set(this, 'yearotherList', []);

                //     [yearLowTempRes, yearLookRes, yearOtherRes] = await Promise.all([
                //         api.APIdqyearlowtempCHECK(this.lowtempForm),
                //         api.APIdqlowlookCHECK(this.yearlookForm),
                //         api.APIdqlowotherCHECK(this.yearlookForm)
                //     ]);
                //     this.tempyearList = yearLowTempRes;
                //     this.yearlookList = yearLookRes;
                //     this.yearotherList = yearOtherRes;

                //     console.log('去年同月低温销售数据:', this.tempyearList);
                //     console.log('去年look系列:', this.yearlookList);
                //     console.log('去年330-310系列:', this.yearotherList);
                // }

                // 处理第九个本月单数API的响应
                this.MonthSIngList = montrhsinger

                this.MonthmaxList = this.filterMaxOrderNum(this.MonthSIngList)
                console.log('本月单数:', this.MonthSIngList, this.MonthmaxList)

                // 今日低温与班组/单位体数据表匹配
                this.TeamsAnList = this.TeamsAnList.map(team => {
                    const matchedItem = this.lowtempList.find(item => item.companyid === team.companyid);
                    return {
                        ...team,
                        box: matchedItem ? matchedItem.box : '' // 添加box字段，如果没匹配则为'''
                    };
                });
                //look与上一数据表匹配
                this.TeamsAnList = this.TeamsAnList.map(team => {
                    const matchedItem = this.templookList.find(item => item.companyid === team.companyid);
                    return {
                        ...team,
                        lookbox: matchedItem ? matchedItem.box : '' // 添加box字段，如果没匹配则为'''
                    };
                });

                //330-310与上一数据表匹配
                this.TeamsAnList = this.TeamsAnList.map(team => {
                    const matchedItem = this.tempotherList.find(item => item.companyid === team.companyid);
                    return {
                        ...team,
                        yezibox: matchedItem ? matchedItem.box : '' // 添加box字段，如果没匹配则为'''
                    };
                });

                // //去年look与上一数据表匹配
                // this.TeamsAnList = this.TeamsAnList.map(team => {
                //     const matchedItem = this.yearlookList.find(item => item.companyid === team.companyid);
                //     return {
                //         ...team,
                //         yearlookbox: matchedItem ? matchedItem.box : '' // 添加box字段，如果没匹配则为'''
                //     };
                // });

                // //去年330-310与上一数据表匹配
                // this.TeamsAnList = this.TeamsAnList.map(team => {
                //     const matchedItem = this.yearotherList.find(item => item.companyid === team.companyid);
                //     return {
                //         ...team,
                //         yearyezibox: matchedItem ? matchedItem.box : '' // 添加box字段，如果没匹配则为'''
                //     };
                // });


                //去年同月低温销售数据与上一数据表匹配
                this.TeamsAnList = this.TeamsAnList.map(team => {
                    const matchedItem = this.tempyearList.find(item => item.companyid === team.companyid);
                    return {
                        ...team,
                        yearbox: matchedItem ? matchedItem.lastgoal : '' // 添加box字段，如果没匹配则为'''
                    };
                });

                //低温增幅比数据表与上一数据表匹配
                this.TeamsAnList = this.TeamsAnList.map(team => {
                    const matchedItem = this.LowTempdataList.find(item => item.companyid === team.companyid);
                    return {
                        ...team,
                        lowtempStan: matchedItem ? matchedItem.lowtemp : '' // 添加box字段，如果没匹配则为'''
                    };
                });

                //本月单数数据表匹配
                this.TeamsAnList = this.TeamsAnList.map(team => {
                    const matchedItem = this.MonthmaxList.find(item => item.companyid === team.companyid);
                    return {
                        ...team,
                        ordernum: matchedItem ? matchedItem.ordernum : '' // 添加box字段，如果没匹配则为'''
                    };
                });

                //当前天单数匹配
                this.TeamsAnList = this.TeamsAnList.map(team => {
                    const matchedItem = this.MonthSIngList.find(item =>
                        item.companyid === team.companyid &&
                        item.days === this.dataForm.p_vouchdateend
                    );
                    return {
                        ...team,
                        orderdaynum: matchedItem ? matchedItem.ordernum : '' // 如果没匹配则赋空值
                    };
                });
                //计算本月低温任务
                this.TeamsAnList = this.TeamsAnList.map(item => {
                    // 1. 处理 lowtempStan（空值或格式错误时默认 0）
                    let lowtempStanNum = 0;
                    if (item.lowtempStan && typeof item.lowtempStan === 'string') {
                        const lowtempStanStr = item.lowtempStan.replace('%', '');
                        lowtempStanNum = Number(lowtempStanStr) / 100 || 0;
                    }
                    // 3. 计算 lowTask
                    const lowTask = (item.yearbox * (1 + lowtempStanNum)).toFixed(1); // 字符串形式
                    // 5. 返回新对象（保留原有字段，新增 lowTask）
                    return {
                        ...item,
                        lowTask  // 当月低温任务
                    };
                })
                //计算合计
                const addList = this.addNationalTotal(this.TeamsAnList)

                console.log(addList, 'addList')
                //计算班组小计
                this.dataList = this.mergeObjectsByTeamsno(this.TeamsAnList);

                this.dataList.push(...addList);


                //计算低温任务
                this.dataList = this.dataList.map(item => {

                    // 2. 计算 Astoday 
                    const lookbox = (Number(item.lookbox) || 0).toFixed(1); // 字符串形式 "80.0"
                    const yezibox = (Number(item.yezibox) || 0).toFixed(1); // 字符串形式 "50.0"
                    const box180 = (Number(item.box180) || 0).toFixed(1); // 字符串形式 "50.0"
                    const Astoday = (Number(lookbox) + Number(yezibox)+ Number(box180)).toFixed(1); // 直接返回字符串，如 "80.0"

                    // 4. 计算 Adddiff 
                    const Adddiff = (Number(item.lowTask) - Number(Astoday)).toFixed(1); // 字符串形式


                    // 计算本月平均单数
                    const ordernum = Number(item.ordernum) || 0;
                    const lowTaskNum = Number(item.lowTask) || 0;

                    // 计算平均值，处理除数为0或无效值的情况
                    let averordernum = '0.0'; // 默认值
                    if (ordernum !== 0 && !isNaN(lowTaskNum)) {
                        averordernum = (lowTaskNum / ordernum).toFixed(1);
                    }

                    //计算截至今日差额

                    const daydiff = (Number(item.orderdaynum) * Number(averordernum) - Number(Astoday)).toFixed(1);


                    //计算rate
                    const yearbox = Number(item.yearbox) || 0; //去年销售数据
                    const orderdaynum = Number(item.orderdaynum) || 0; //当天单数
                    const ordernum1 = Number(item.ordernum) || 0; //本月单数

                    const yearlinDate = ((yearbox / ordernum1) * orderdaynum).toFixed(1)


                    // 计算增长率（安全处理除零和无效值）
                    let rateValue = 0; // 默认值
                    const astodayNum = Number(Astoday) || 0; // 确保 Astoday 是有效数字

                    // 仅当分母和分子均有效时才计算
                    if (yearlinDate > 0 && astodayNum > 0) {
                        rateValue = ((astodayNum - Number(yearlinDate)) / Number(yearlinDate)) * 100;
                    }

                    // 格式化结果（避免 "-0.0%" 的情况）
                    const formattedRate = rateValue.toFixed(1) + '%'; // 字符串形式，如 "0.0%"

                    //计算完成率
                    let accomplishValue;
                    if (!item.lowTask || item.lowTask === '0.0' || !Astoday || Astoday === '0.0') {
                        accomplishValue = 0; // 被除数或除数为空/0时，强制结果为0
                    } else {
                        accomplishValue = Number(Astoday) / Number(item.lowTask) * 100;
                    }
                    const formattedAccmplish = accomplishValue.toFixed(1) + '%'; // 字符串形式，如 "0.8"

                    // 5. 返回新对象（保留原有字段，新增 lowTask、Astoday 和 Adddiff）
                    return {
                        ...item,
                        lookbox,      // 保留1位小数（字符串）
                        yezibox,      // 保留1位小数（字符串）
                        box180,
                        Astoday,  // 截至当天
                        Adddiff,
                        daydiff, // 差额
                        averordernum,
                        rate: formattedRate,//同比增幅
                        Accmplish: formattedAccmplish,
                        yearlinDate
                    };
                });
                console.log('班组/单位体数据表:', this.dataList);
                //计算区域平均每单任务
                this.dataList = this.sumAndAssignAverordernum(this.dataList);
                this.dataList = this.dataList.map(item => {
                    // 检查companyname是否包含"小计"
                    if (item.companyname && item.companyname.includes("小计")) {
                        const lookboxNum = Number(item.lookbox) || 0;
                        const yeziboxNum = Number(item.yezibox) || 0;
                        const box180Num = Number(item.box180) || 0;
                        const Astoday = (lookboxNum + yeziboxNum+ box180Num).toFixed(1);

                        // 计算增长率（安全处理除零和无效值）
                        let rateValue = 0; // 默认值
                        const astodayNum = Number(Astoday) || 0; // 确保 Astoday 是有效数字

                        // 仅当分母和分子均有效时才计算
                        if (item.yearlinDate > 0 && astodayNum > 0) {
                            rateValue = ((astodayNum - Number(item.yearlinDate)) / Number(item.yearlinDate)) * 100;
                        }

                        // 格式化结果（避免 "-0.0%" 的情况）
                        const formattedRate = rateValue.toFixed(1) + '%'; // 字符串形式，如 "0.0%"



                        // 返回新对象，包含原有属性和计算后的Astoday
                        return {
                            ...item,
                            rate: formattedRate,//同比增幅
                        };
                    }
                    return item; // 不包含"小计"的直接返回原对象
                });
                this.dataList = this.sumAndAssignToTotal(this.dataList);
                this.dataList = this.dataList.map(item => {
                    // 检查companyname是否包含"小计"
                    if (item.teamsno.includes("合计")) {
                        const lookboxNum = Number(item.lookbox) || 0;
                        const yeziboxNum = Number(item.yezibox) || 0;
                        const box180Num = Number(item.box180) || 0;
                        const Astoday = (lookboxNum + yeziboxNum+ box180Num).toFixed(1);

                        // 计算增长率（安全处理除零和无效值）
                        let rateValue = 0; // 默认值
                        const astodayNum = Number(Astoday) || 0; // 确保 Astoday 是有效数字

                        // 仅当分母和分子均有效时才计算
                        if (item.yearlinDate > 0 && astodayNum > 0) {
                            rateValue = ((astodayNum - Number(item.yearlinDate)) / Number(item.yearlinDate)) * 100;
                        }

                        // 格式化结果（避免 "-0.0%" 的情况）
                        const formattedRate = rateValue.toFixed(1) + '%'; // 字符串形式，如 "0.0%"



                        // 返回新对象，包含原有属性和计算后的Astoday
                        return {
                            ...item,
                            rate: formattedRate,//同比增幅
                        };
                    }
                    return item; // 不包含"小计"的直接返回原对象
                });


            } catch (error) {
                console.error("获取数据时出错:", error);
                // 可以在这里添加错误提示
                this.$message.error('数据加载失败，请重试');
            } finally {
                this.dataListLoading = false; // 确保无论成功失败都会重置加载状态
            }
        },
        //班组小计
        sumAndAssignAverordernum(arr) {
            // 1. 创建对象来存储每个teamsno的averordernum、daydiff和yearlinDate总和
            const sumMap = {};

            // 2. 计算每个teamsno对应的averordernum、daydiff和yearlinDate总和
            arr.forEach(item => {
                const parent = item.teamsno;
                if (!sumMap[parent]) {
                    sumMap[parent] = {
                        averordernum: 0,
                        daydiff: 0,
                        yearlinDate: 0
                    };
                }

                // 处理可能的NaN情况，确保转换为有效数字
                sumMap[parent].averordernum += parseFloat(item.averordernum) || 0;
                sumMap[parent].daydiff += parseFloat(item.daydiff) || 0;
                sumMap[parent].yearlinDate += parseFloat(item.yearlinDate) || 0;
            });

            // 3. 找到companyname为"teamsno小计"的对象并赋值，保留一位小数
            arr.forEach(item => {
                const parent = item.teamsno;
                if (item.companyname && item.companyname === parent + '小计') {
                    // 确保赋值时保留一位小数，并处理可能的NaN
                    item.averordernum = parseFloat(sumMap[parent].averordernum.toFixed(1));
                    item.daydiff = parseFloat(sumMap[parent].daydiff.toFixed(1));
                    item.yearlinDate = parseFloat(sumMap[parent].yearlinDate.toFixed(1));

                    // 确保不是NaN（虽然理论上不会出现，因为前面已经处理过）
                    if (isNaN(item.averordernum)) item.averordernum = 0;
                    if (isNaN(item.daydiff)) item.daydiff = 0;
                    if (isNaN(item.yearlinDate)) item.yearlinDate = 0;
                }
            });

            return arr;
        },
        //总计
        sumAndAssignToTotal(arr) {
            // 1. 初始化总和变量
            let total = {
                averordernum: 0,
                daydiff: 0,
                yearlinDate: 0
            };

            // 2. 遍历数组，累加所有"小计"的数据
            arr.forEach(item => {
                if (item.companyname && item.companyname.includes("小计")) {
                    total.averordernum += parseFloat(item.averordernum) || 0;
                    total.daydiff += parseFloat(item.daydiff) || 0;
                    total.yearlinDate += parseFloat(item.yearlinDate) || 0;
                }
            });

            // 3. 将总和赋给"总计"对象（保留1位小数）
            arr.forEach(item => {
                if (item.teamsno && item.teamsno.includes("合计")) {
                    item.averordernum = parseFloat(total.averordernum.toFixed(1)) || 0;
                    item.daydiff = parseFloat(total.daydiff.toFixed(1)) || 0;
                    item.yearlinDate = parseFloat(total.yearlinDate.toFixed(1)) || 0;
                }
            });

            return arr;
        },
        //合并相加
        mergeObjectsByTeamsno(arr) {
            const result = {};
            const groupedMap = {}; // 记录每个 teamsno 的最后位置

            // 1. 先遍历一次，记录每个 teamsno 的最后出现位置
            arr.forEach((obj, index) => {
                groupedMap[obj.teamsno] = index;
            });

            // 2. 合并相同 teamsno 的数据
            arr.forEach(obj => {
                const teamsno = obj.teamsno;
                if (!result[teamsno]) {
                    result[teamsno] = {
                        teamsno: teamsno,
                        companyname: teamsno + '小计',
                        teamsperson: obj.teamsperson,
                        box: 0,
                        lookbox: 0,
                        yezibox: 0,
                        box180: 0,
                        yearbox: 0,
                        lowTask: 0,
                        yearlookbox: 0,
                        yearyezibox: 0,

                    };
                }
                const target = result[teamsno];
                target.box += Number(obj.box) || 0;
                target.lookbox += Number(obj.lookbox) || 0;
                target.yezibox += Number(obj.yezibox) || 0;
                target.box180 += Number(obj.box180) || 0;
                target.yearbox += Number(obj.yearbox) || 0;
                target.lowTask += Number(obj.lowTask) || 0;

                target.yearlookbox += Number(obj.yearlookbox) || 0;
                target.yearyezibox += Number(obj.yearyezibox) || 0;

            });

            // 3. 将合并后的数据插入到对应 teamsno 组的末尾位置
            const output = [...arr]; // 复制原数组
            Object.values(result).forEach(mergedItem => {
                const teamsno = mergedItem.teamsno;
                const insertIndex = groupedMap[teamsno] + 1; // 插入到该 teamsno 最后出现的下一个位置
                output.splice(insertIndex, 0, {
                    ...mergedItem,
                    box: parseFloat(mergedItem.box.toFixed(1)),
                    lookbox: parseFloat(mergedItem.lookbox.toFixed(1)),
                    yezibox: parseFloat(mergedItem.yezibox.toFixed(1)),
                    box180: parseFloat(mergedItem.box180.toFixed(1)),
                    yearbox: parseFloat(mergedItem.yearbox.toFixed(1)),
                    lowTask: parseFloat(mergedItem.lowTask.toFixed(1)),

                    yearlookbox: parseFloat(mergedItem.yearlookbox.toFixed(1)),
                    yearyezibox: parseFloat(mergedItem.yearyezibox.toFixed(1)),

                });
                // 更新 groupedMap 中后续 teamsno 的位置（因为插入新元素会影响索引）
                Object.keys(groupedMap).forEach(key => {
                    if (groupedMap[key] >= insertIndex) {
                        groupedMap[key]++;
                    }
                });
            });

            return output;
        },
        //合计对象
        addNationalTotal(dataList) {
            // 1. 计算所有数值字段的总和
            const total = {
                box: 0,
                lookbox: 0,
                yezibox: 0,
                box180:0,
                yearbox: 0,
                lowTask: 0,
                yearlookbox: 0,
                yearyezibox: 0,

            };

            dataList.forEach(item => {
                total.box += Number(item.box) || 0;
                total.lookbox += Number(item.lookbox) || 0;
                total.yezibox += Number(item.yezibox) || 0;
                total.box180 += Number(item.box180) || 0;
                total.yearbox += Number(item.yearbox) || 0;
                total.lowTask += Number(item.lowTask) || 0;

                total.yearlookbox += Number(item.yearlookbox) || 0;
                total.yearyezibox += Number(item.yearyezibox) || 0;

            });

            // 2. 创建"全国合计"对象（保留1位小数）
            const nationalTotal = {
                ...Object.fromEntries(
                    Object.entries(total).map(([key, value]) => [
                        key,
                        parseFloat(value.toFixed(1))
                    ])
                ),
                teamsno: "全国合计",
                teamsperson: ""
            };

            // 3. 返回新数组（不修改原数组）
            return [nationalTotal];
        },
        //取最大值
        filterMaxOrderNum(data) {
            const result = data.reduce((acc, current) => {
                const currentNum = parseInt(current.ordernum, 10); // 转成数字比较
                if (acc[current.companyname]) {
                    const existingNum = parseInt(acc[current.companyname].ordernum, 10);
                    if (currentNum > existingNum) {
                        acc[current.companyname] = current;
                    }
                } else {
                    acc[current.companyname] = current;
                }
                return acc;
            }, {});

            return Object.values(result);
        },


        // 获取今年的日期数据
        calculateCurrentYearDates() {
            const today = new Date();

            // 获取当前月份的月初时间 
            const startOfMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);
            this.startOfMonth = this.formatDate(startOfMonthDate);

            // 获取截至今天的时间 
            this.endOfToday = this.formatDate(today);

            this.dataForm.p_vouchdatestart = this.startOfMonth;
            this.dataForm.p_vouchdateend = this.endOfToday;
            this.labelText = `${this.year}年${this.month}月班组单位体低温报单进度表--截止${this.month}月${this.day}日`; // 如果没有选择日期，显示默认文本
        },

        // 获取去年的日期数据
        calculateLastYearDates() {
            const today = new Date();

            // 获取上一年的同一天
            const lastYearDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
            const lastYearSameDay = this.formatDateyear(lastYearDate);

            // 获取上一年的同月月初
            const lastYearStartOfMonth = new Date(today.getFullYear() - 1, today.getMonth(), 1);
            const lastYearStartOfMonthStr = this.formatDateyear(lastYearStartOfMonth);

            // 赋值给 yearlookForm
            this.yearlookForm.startdate = lastYearStartOfMonthStr; // 上一年同月月初
            this.yearlookForm.enddate = lastYearSameDay; // 上一年同一天
            this.historyForm.curdate = lastYearSameDay;
        },

        // 格式化日期
        formatDate(date) {
            this.year = date.getFullYear();
            this.month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1 
            this.day = String(date.getDate()).padStart(2, '0');
            return `${this.year}-${this.month}-${this.day}`;
        },
        formatDateyear(date) {
            const year1 = date.getFullYear();
            const month1 = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1 
            const day1 = String(date.getDate()).padStart(2, '0');
            return `${year1}-${month1}-${day1}`;
        },
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                exportExcel(this.dataList, this.dataForm.p_vouchdateend, '班组单位体低温报单进度表.xlsx')

            })
        },
    }
};
</script>

<style scoped lang="scss">
.test {
    font-family: 'Microsoft YaHei', 微软雅黑, sans-serif;
    font-size: 20px;
    text-align: center;
}
</style>