<template>
    <div class='DailyReport'>
        <el-form :inline="true" style="width:90%; margin: 0 auto;">
            <div class="test">{{ this.labelText }}</div>
            <el-form-item label="日期区间：">
                <el-date-picker v-model="dataForm.p_vouchdatestart" value-format="yyyy-MM-dd" type="date"
                    placeholder="开始日期" clearable style="width: 100%; "></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-date-picker v-model="dataForm.p_vouchdateend" value-format="yyyy-MM-dd" type="date"
                    placeholder="结束日期" clearable :picker-options="pickerend" style="width: 100%"></el-date-picker>
            </el-form-item>

            <el-form-item label="当前数据日期：">
                <el-date-picker v-model="dataForm.p_vouchdatecur" value-format="yyyy-MM-dd" type="date"
                    placeholder="截止日期" clearable :picker-options="pickerOptions" style="width: 100%"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-input v-model="bullay" placeholder="模糊查询" clearable @keyup.enter.native="searchEnterFun()"
                    ref="searchInput"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
                    @click="getDataList">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                    @click="exportData">导出</el-button>
            </el-form-item>
        </el-form>

        <!-- 三个小表格 -->
        <div class="summary-tables-container" style="width: 90%; margin: 20px auto;">
            <div class="summary-tables-row">
                <!-- 区间总增幅表格 -->
                <div class="summary-table">
                    <div class="summary-table-title">区间总增幅</div>
                    <table class="summary-table-content">
                        <tr>
                            <td class="label-cell">去年同区间累积</td>
                            <td class="data-cell">{{ SectionList.lastbox }}</td>
                        </tr>
                        <tr>
                            <td class="label-cell">今年同区间报单</td>
                            <td class="data-cell">{{ SectionList.currentbox }}</td>
                        </tr>
                        <tr>
                            <td class="label-cell">区间同比差额</td>
                            <td class="data-cell">{{ SectionList.areaDiff }}</td>
                        </tr>
                        <tr>
                            <td class="label-cell">区间同比完成率</td>
                            <td class="data-cell">{{ SectionList.areaRate }}</td>
                        </tr>
                    </table>
                </div>

                <!-- 截止今日增幅表格 -->
                <div class="summary-table">
                    <div class="summary-table-title">截止今日增幅</div>
                    <table class="summary-table-content">
                        <tr>
                            <td class="label-cell">截止去年同期累积</td>
                            <td class="data-cell">{{ dayList.lasttodaybox }}</td>
                        </tr>
                        <tr>
                            <td class="label-cell">截止今日当期累积</td>
                            <td class="data-cell">{{ dayList.todaybox }}</td>
                        </tr>
                        <tr>
                            <td class="label-cell">截止今日同比差额</td>
                            <td class="data-cell">{{ dayList.daydiff }}</td>
                        </tr>
                        <tr>
                            <td class="label-cell">截止今日同比完成率</td>
                            <td class="data-cell">{{ dayList.dayRate }}</td>
                        </tr>
                    </table>
                </div>

                <!-- 今日增幅表格 -->
                <div class="summary-table">
                    <div class="summary-table-title">今日增幅</div>
                    <table class="summary-table-content">
                        <tr>
                            <td class="label-cell">去年同期</td>
                            <td class="data-cell">{{ tadayList.lasttodaybox }}</td>
                        </tr>
                        <tr>
                            <td class="label-cell">今日报单</td>
                            <td class="data-cell">{{ tadayList.todaybox }}</td>
                        </tr>
                        <tr>
                            <td class="label-cell">今日差额</td>
                            <td class="data-cell">{{ tadayList.daydiff }}</td>
                        </tr>
                        <tr>
                            <td class="label-cell">日完成率</td>
                            <td class="data-cell">{{ tadayList.dayRate }}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>

        <el-table class="table" ref="table" :data="currentData" v-loading="dataListLoading"
            style="width: 90%; margin: 0 auto; margin-bottom: 50px;">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="vouchdate" label="日期" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="cityname" label="城市" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="areaname" label="区域" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="cSiteName" label="客户(站点)" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="lastbox" label="24年10月累积" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="currentbox" label="10月报单累积" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="yearcomplet" label="同比完成率" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="lasttodaybox" label="今日同期" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="todaybox" label="今日报单" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="tadaydifferen" label="今日同期差额" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="yearlate" label="累积同期差额" />
        </el-table>
        <el-pagination @size-change="sizeChangeHandle" ref="pagination" @current-change="handleCurrentChange"
            :current-page="currentPage" :page-sizes="[20, 40, 60, 80, 100, 1000]" :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="dataListTA.length">
        </el-pagination>

    </div>
</template>

<script>
import * as api from '@/api/frame/customer.js'

import {
    exportExcel
} from './DailyReportExpro.js'
export default {
    name: 'DailyReport-page',
    data() {
        return {
            msg: 'DailyReport-page',
            dataForm: {
                p_vouchdatestart: '',
                p_vouchdateend: '',
                p_vouchdatecur: ''
            },
            dataListLoading: false,
            bullay: '',
            dataList: [],
            dataListTA: [],
            currentData: [],
            currentPage: 1,
            pageSize: 20,
            totalItems: 0,
            labelText: '销售日订单跟进表',
            SectionList: [],
            dayList: [],
            tadayList: [],
            defaultMerged: {},
            pickerOptions: {
                disabledDate: (time) => this.handleDisabledDate(time)
            },
            pickerend:{
                disabledDate:(time) => this.handleDisabledend(time)
            }
        };
    },
    created() {
        this.calculateCurrentYearDates();
        // this.calculateLastYearDates()
    },
    mounted() {
        this.getDataList()
    },
    methods: {
        // 定义日期禁用逻辑的函数
        handleDisabledDate(time) {
            const currentTime = time.getTime();
            // 转换开始日期和结束日期为时间戳（因两者必存在，无需判断空值）
            const startTime = new Date(this.dataForm.p_vouchdatestart).getTime();
            const endTime = new Date(this.dataForm.p_vouchdateend).getTime();

            // 禁用：小于开始日期 或 大于结束日期 的日期
            return currentTime < startTime || currentTime > endTime;
        },
        handleDisabledend(time){
            const currentTime = time.getTime();
            const startTime = new Date(this.dataForm.p_vouchdatestart).getTime();
             // 禁用：小于开始日期 
             return currentTime < startTime;
        },
        getDataList() {
            this.dataListLoading = true
            api.APIdaily_report(this.dataForm).then(res => {
                this.dataList = res
                // 过滤掉provincename为空的对象
                this.dataList = this.dataList.filter(item => {
                    // 处理空字符串、null、undefined以及字段不存在的情况
                    return item.provincename || item.provincename === 0; // 特殊处理0的情况（如果需要）
                    // 若不需要保留0，直接用：return !!item.provincename;
                });
                this.dataList = this.dataList.filter(item =>
                    (item.cityname && item.cityname.toLowerCase().includes(this.bullay)) ||
                    (item.name && item.name.toLowerCase().includes(this.bullay)) ||
                    (item.areaname && item.areaname.toLowerCase().includes(this.bullay)) ||
                    (item.cSiteName && item.cSiteName.toLowerCase().includes(this.bullay)) ||
                    (item.provincename && item.provincename.toLowerCase().includes(this.bullay))
                );
                //计算区间小表数据小表
                this.SectionList = this.sumBoxFields(this.dataList)
                console.log(this.SectionList, '区间小表')
                //计算截止今日增幅小表,去年同期增幅
                const dayadd = this.sumBoxdayFields(this.dataList)
                console.log(dayadd, 'dayadd')
                //计算截止今日增幅小表
                this.dayList = this.sumStopBoxFields(this.dataList, this.dataForm.p_vouchdatecur, dayadd)
                console.log(this.dayList, '今日增幅')
                //计算今日增幅小表
                this.tadayList = this.sumStopBoxdayFields(this.dataList, this.dataForm.p_vouchdatecur)
                this.dataListTA = this.processData(this.dataList);
                console.log(this.dataListTA, 'this.dataListTA')
                this.defaultMerged = this.mergeThreeArraysIntoObject(this.SectionList, this.dayList, this.tadayList);
                console.log(this.defaultMerged, 'this.defaultMerged')
                // 处理数组，同时新增yearcomplet和tadaydifferen字段
                this.dataListTA = this.dataListTA.map(item => {

                    // 处理todaybox和lasttodaybox为空的情况（转为0）
                    const todayBoxVal = item.todaybox || 0; // 空值转为0
                    const lastTodayBoxVal = item.lasttodaybox || 0; // 空值转为0
                    const lastBoxVal = item.lastbox || 0; // 空值转为0
                    const currentBoxVal = item.currentbox || 0; // 空值转为0
                    // 处理yearcomplet(百分比)
                    let yearcomplet;
                    if (currentBoxVal === 0 || lastBoxVal === 0) {
                        yearcomplet = '0%';
                    } else {
                        const ratio = Number(currentBoxVal) / Number(lastBoxVal); // 显式转数字，避免类型问题
                        yearcomplet = (ratio * 100).toFixed(2) + '%';
                    }


                    // 确保是数字类型（处理可能的字符串数字，如"10"）
                    const todayNum = Number(todayBoxVal);
                    const lastTodayNum = Number(lastTodayBoxVal);

                    // 计算tadaydifferen
                    const tadaydifferen = todayNum - lastTodayNum;

                    return { ...item, yearcomplet, tadaydifferen };
                });

                // 排序逻辑：先按provincename升序，再按vouchdate降序，然后按cityname升序，最后按areaname升序
                this.dataListTA = [...this.dataListTA].sort((a, b) => {
                    // 安全的字符串比较函数，处理undefined/null值
                    const safeCompare = (val1, val2) => {
                        const str1 = val1 || '';
                        const str2 = val2 || '';
                        return str1.localeCompare(str2);
                    };

                    // 1. 先按省份升序
                    if (a.provincename !== b.provincename) {
                        return safeCompare(a.provincename, b.provincename);
                    }
                    // 2. 同一省份内，按日期降序（晚的日期在前）
                    if (a.vouchdate !== b.vouchdate) {
                        return safeCompare(a.vouchdate, b.vouchdate);
                    }
                    // 3. 同一省份同一日期内，按城市升序
                    if (a.cityname !== b.cityname) {
                        return safeCompare(a.cityname, b.cityname);
                    }
                    // 4. 同一省份同一日期同一城市内，按区域升序
                    if (a.areaname !== b.areaname) {
                        return safeCompare(a.areaname, b.areaname);
                    }
                    // 5. 最后按客户站点升序（保证完全有序）
                    return safeCompare(a.cSiteName, b.cSiteName);
                });

                // 添加日期合计行
                this.dataListTA = this.addDateSubtotals(this.dataListTA);

                this.currentData = {
                    ...this.dataListTA
                };
                this.dataListLoading = false
                this.sizeChangeHandle(this.pageSize);

            })
        },


        mergeThreeArraysIntoObject(arr1, arr2, arr3, keyNames = {}) {
            // 定义默认键名，若未传入则使用默认值
            const {
                key1 = 'firstArray',  // 第一个数组对应的子对象键名
                key2 = 'secondArray', // 第二个数组对应的子对象键名
                key3 = 'thirdArray'   // 第三个数组对应的子对象键名
            } = keyNames;

            // 合并为一个对象，三个子对象分别对应原数组
            return {
                [key1]: arr1,
                [key2]: arr2,
                [key3]: arr3
            };
        },

        exportData() {
            console.log(this.dataForm.p_vouchdatecur);
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                // 显示loading状态
                const loading = this.$loading({
                    lock: true,
                    text: '正在导出Excel文件，请稍候...\n数据量较大时可能需要等待几秒钟',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });

                try {
                    // 添加一个小延迟确保loading显示
                    await new Promise(resolve => setTimeout(resolve, 100));

                    // 执行导出操作
                    await exportExcel(this.dataListTA, this.dataForm.p_vouchdatestart, this.dataForm.p_vouchdateend, this.dataForm.p_vouchdatecur, '销售日订单跟进表.xlsx', this.defaultMerged);

                    // 导出成功提示
                    this.$message({
                        type: 'success',
                        message: 'Excel文件导出成功！',
                        duration: 3000
                    });
                } catch (error) {
                    console.error('导出失败:', error);
                    this.$message({
                        type: 'error',
                        message: '导出失败，请重试！',
                        duration: 5000
                    });
                } finally {
                    // 关闭loading状态
                    loading.close();
                }
            })
        },
        processData(originalArray) {
            // 工具函数：将空值（null/undefined/''等）转为0,非空值转为数字
            const getNumberValue = (value) => {
                // 判定为空值的情况：null、undefined、空字符串、纯空格字符串
                if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
                    return 0;
                }
                // 非空值转为数字（兼容数字型、字符串型数字）
                return Number(value);
            };

            // 1. 按cSiteName分组（复制原对象,避免修改原始数据）
            const groups = {};
            originalArray.forEach(item => {
                const siteName = item.cSiteName;
                if (!groups[siteName]) {
                    groups[siteName] = [];
                }
                groups[siteName].push({ ...item });
            });

            // 2. 处理每组：排序 + 计算yearlate（空字段按0处理）
            const dataListTA = [];
            Object.values(groups).forEach(group => {
                // 按vouchdate升序排序（空日期会排在最前,若需特殊处理可补充逻辑）
                group.sort((a, b) => {
                    const dateA = a.vouchdate ? new Date(a.vouchdate) : new Date(0);
                    const dateB = b.vouchdate ? new Date(b.vouchdate) : new Date(0);
                    return dateA - dateB;
                });

                // 计算累加yearlate,空字段通过getNumberValue转为0
                let accumulated = 0;
                group.forEach(item => {
                    const todayboxNum = getNumberValue(item.todaybox);
                    const lasttodayboxNum = getNumberValue(item.lasttodaybox);
                    const currentDiff = todayboxNum - lasttodayboxNum;

                    accumulated += currentDiff; // 直接累加（第一项自然是currentDiff，无需判断索引）
                    item.yearlate = accumulated; // 最终yearlate为数字类型
                });

                dataListTA.push(...group);
            });

            return dataListTA;
        },

        // 添加日期合计行
        addDateSubtotals(dataArray) {
            if (!dataArray || dataArray.length === 0) return dataArray;

            const result = [];
            let currentProvince = '';
            let currentDate = '';
            let dateGroup = [];

            // 工具函数：将空值转为0，非空值转为数字
            const getNumberValue = (value) => {
                if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
                    return 0;
                }
                return Number(value);
            };

            // 计算合计行数据
            const calculateSubtotal = (group, date, province) => {
                const subtotal = {
                    vouchdate: date,
                    cityname: '小计',
                    areaname: '',
                    cSiteName: '',
                    provincename: province,
                    lastbox: 0,
                    currentbox: 0,
                    yearcomplet: '0%',
                    lasttodaybox: 0,
                    todaybox: 0,
                    tadaydifferen: 0,
                    yearlate: 0,
                    isSubtotal: true // 标记为小计行
                };

                group.forEach(item => {
                    subtotal.lastbox += getNumberValue(item.lastbox);
                    subtotal.currentbox += getNumberValue(item.currentbox);
                    subtotal.lasttodaybox += getNumberValue(item.lasttodaybox);
                    subtotal.todaybox += getNumberValue(item.todaybox);
                    subtotal.tadaydifferen += getNumberValue(item.tadaydifferen);
                    subtotal.yearlate += getNumberValue(item.yearlate);
                });

                // 计算同比完成率
                if (subtotal.lastbox > 0) {
                    const ratio = subtotal.currentbox / subtotal.lastbox;
                    subtotal.yearcomplet = (ratio * 100).toFixed(2) + '%';
                }

                return subtotal;
            };

            // 遍历数据，按省份和日期分组
            for (let i = 0; i < dataArray.length; i++) {
                const item = dataArray[i];
                const itemProvince = item.provincename || '';
                const itemDate = item.vouchdate || '';

                // 如果省份或日期发生变化，处理之前的分组
                if ((itemProvince !== currentProvince || itemDate !== currentDate) && dateGroup.length > 0) {
                    // 添加当前分组的数据
                    result.push(...dateGroup);
                    // 添加合计行
                    result.push(calculateSubtotal(dateGroup, currentDate, currentProvince));
                    dateGroup = [];
                }

                // 更新当前省份和日期
                currentProvince = itemProvince;
                currentDate = itemDate;
                dateGroup.push(item);
            }

            // 处理最后一组数据
            if (dateGroup.length > 0) {
                result.push(...dateGroup);
                result.push(calculateSubtotal(dateGroup, currentDate, currentProvince));
            }

            return result;
        },
        //区间总增幅计算去年同区间累积，今年同区间报单
        sumBoxFields(inputArray) {
            // 1. 按 cNccSiteId 去重（保留第一个出现的对象）
            const uniqueMap = new Map();
            inputArray.forEach(obj => {
                const siteId = obj.cNccSiteId;
                // 仅保留第一次出现的 siteId 对应的对象
                if (!uniqueMap.has(siteId)) {
                    uniqueMap.set(siteId, obj);
                }
            });
            // 转为去重后的数组
            const uniqueArray = Array.from(uniqueMap.values());

            // 2. 计算去重后的总和
            let totalLasttodaybox = 0;
            let totalTodaybox = 0;

            uniqueArray.forEach(obj => {
                const lastVal = Number(obj.lastbox);
                totalLasttodaybox += isNaN(lastVal) ? 0 : lastVal;

                const todayVal = Number(obj.currentbox);
                totalTodaybox += isNaN(todayVal) ? 0 : todayVal;
            });

            // 3. 计算差值和比例
            const areaDiff = totalTodaybox - totalLasttodaybox;
            let areaRate = '0%';
            if (totalLasttodaybox !== 0) {
                areaRate = (totalTodaybox / totalLasttodaybox * 100).toFixed(2) + '%';
            }

            return {
                lastbox: Math.round(totalLasttodaybox),  // 四舍五入为整数
                currentbox: Math.round(totalTodaybox),
                areaDiff: Math.round(areaDiff),
                areaRate: areaRate  // 保留原始格式
            };
        },
        //截止今日增幅小表截止去年同期计算
        sumBoxdayFields(inputArray) {
            // 1. 按 cNccSiteId 去重（保留第一个出现的对象）
            const uniqueMap = new Map();
            inputArray.forEach(obj => {
                const siteId = obj.cNccSiteId;
                // 仅保留第一次出现的 siteId 对应的对象
                if (!uniqueMap.has(siteId)) {
                    uniqueMap.set(siteId, obj);
                }
            });
            // 转为去重后的数组
            const uniqueArray = Array.from(uniqueMap.values());

            // 2. 计算去重后的总和
            let totalLasttodaybox = 0;

            uniqueArray.forEach(obj => {
                const lastVal = Number(obj.lastdeadbox);
                totalLasttodaybox += isNaN(lastVal) ? 0 : lastVal;

            });

            return {
                lastdeadbox: Math.round(totalLasttodaybox),  // 四舍五入为整数
            };
        },
        //截止今日增幅小表
        sumStopBoxFields(inputArray, pVouchdatecur, deadBoxArray) {
            // 1. 过滤：只保留 vouchdate 与传入时间完全匹配的对象
            const filteredArray = inputArray.filter(obj => {
                const objVouchdate = obj.vouchdate;
                // 若对象无 vouchdate 字段，默认排除
                if (!objVouchdate) return false;
                // 精确匹配 yyyy-mm-dd 格式的日期
                return objVouchdate <= pVouchdatecur;
            });

            // 2. 计算总和（直接使用过滤后的数组，不做去重）
            let totalLaststopbox = 0;
            let totalTodaystopbox = 0;

            filteredArray.forEach(obj => {
                // 强制转换为数字，非数字按 0 处理
                const lastVal = Number(obj.lasttodaybox);
                totalLaststopbox += isNaN(lastVal) ? 0 : lastVal;

                const todayVal = Number(obj.todaybox);
                totalTodaystopbox += isNaN(todayVal) ? 0 : todayVal;
            });
            let thelist = deadBoxArray.lastdeadbox
            // 3. 计算差值和增长率
            const daydiff = thelist - totalLaststopbox;
            let dayRate = '0%';
            if (totalLaststopbox !== 0) {
                const rate = (thelist / totalLaststopbox - 1) * 100;
                dayRate = rate.toFixed(2) + '%';
            }

            return {

                lasttodaybox: Math.round(thelist),  // 四舍五入为整数
                todaybox: Math.round(totalTodaystopbox),
                daydiff: Math.round(daydiff),
                dayRate: dayRate  // 保留原始格式
            };
        },

        //今日增幅小表
        sumStopBoxdayFields(inputArray, pVouchdatecur) {
            // 1. 过滤：只保留 vouchdate 与传入时间完全匹配的对象
            const filteredArray = inputArray.filter(obj => {
                const objVouchdate = obj.vouchdate;
                // 若对象无 vouchdate 字段，默认排除
                if (!objVouchdate) return false;
                // 精确匹配 yyyy-mm-dd 格式的日期
                return objVouchdate == pVouchdatecur;
            });

            // 2. 计算总和（直接使用过滤后的数组，不做去重）
            let totalLaststopbox = 0;
            let totalTodaystopbox = 0;

            filteredArray.forEach(obj => {
                // 强制转换为数字，非数字按 0 处理
                const lastVal = Number(obj.lasttodaybox);
                totalLaststopbox += isNaN(lastVal) ? 0 : lastVal;

                const todayVal = Number(obj.todaybox);
                totalTodaystopbox += isNaN(todayVal) ? 0 : todayVal;
            });

            // 3. 计算差值和增长率
            const daydiff = totalTodaystopbox - totalLaststopbox;
            let dayRate = '0%';
            if (totalLaststopbox !== 0) {
                const rate = (totalTodaystopbox / totalLaststopbox - 1) * 100;
                dayRate = rate.toFixed(2) + '%';
            }

            return {
                // lasttodaybox: totalLaststopbox,
                // todaybox: totalTodaystopbox,
                // daydiff: daydiff,
                // dayRate: dayRate

                lasttodaybox: Math.round(totalLaststopbox),  // 四舍五入为整数
                todaybox: Math.round(totalTodaystopbox),
                daydiff: Math.round(daydiff),
                dayRate: dayRate  // 保留原始格式
            };
        },







        // 每页数
        sizeChangeHandle(val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.currentData = this.dataListTA.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this
                .pageSize);
        },
        // 当前页
        handleCurrentChange(val) {
            console.log(val)
            this.currentPage = val;
            this.currentData = this.dataListTA.slice((val - 1) * this.pageSize, val * this.pageSize);
        },
        // 获取今年的日期数据
        calculateCurrentYearDates() {
            const today = new Date();

            // 获取当前月份的月初时间 
            const startOfMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);
            this.startOfMonth = this.formatDate(startOfMonthDate);

            // 获取截至今天的时间 
            this.endOfToday = this.formatDate(today);

            // 获取当前月份的最后一天（月末）
            const endOfMonthDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            this.endOfMonth = this.formatDate(endOfMonthDate);

            this.dataForm.p_vouchdatestart = this.startOfMonth;
            this.dataForm.p_vouchdateend = this.endOfMonth;
            this.dataForm.p_vouchdatecur = this.endOfToday

        },
        // 格式化日期
        formatDate(date) {
            this.year = date.getFullYear();
            this.month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始,所以加1 
            this.day = String(date.getDate()).padStart(2, '0');
            return `${this.year}-${this.month}-${this.day}`;
        },

    }
};
</script>

<style scoped lang="scss">
.test {
    font-family: 'Microsoft YaHei', 微软雅黑, sans-serif;
    font-size: 22px;
    text-align: center;
    margin-bottom: 10px;
}

/* 三个小表格的样式 */
.summary-tables-container {
    margin-bottom: 20px;
}

.summary-tables-row {
    display: flex;
    justify-content: space-between;
    gap: 20px;
}

.summary-table {
    flex: 1;
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
}

.summary-table-title {
    background: #f5f7fa;
    padding: 8px 12px;
    font-weight: bold;
    text-align: center;
    border-bottom: 1px solid #ddd;
    font-size: 14px;
}

.summary-table-content {
    width: 100%;
    border-collapse: collapse;

    tr {
        border-bottom: 1px solid #eee;

        &:last-child {
            border-bottom: none;
        }
    }

    td {
        padding: 6px 8px;
        font-size: 12px;
        border-right: 1px solid #eee;

        &:last-child {
            border-right: none;
        }
    }

    .label-cell {
        background: #fafafa;
        font-weight: 500;
        width: 60%;
        text-align: left;
    }

    .data-cell {
        background: #fff;
        text-align: right;
        font-weight: normal;
        width: 40%;
    }
}

/* 响应式设计 */
@media (max-width: 768px) {
    .summary-tables-row {
        flex-direction: column;
        gap: 10px;
    }
}
</style>