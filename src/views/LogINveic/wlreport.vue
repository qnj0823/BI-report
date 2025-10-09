<template>
    <div class='wlreport'>
        <el-form :inline="true" style="margin-top: 10px;" :model="dataForm" @submit.native.prevent>
            <el-form-item>
                <el-date-picker v-model="dataForm.p_vouchdateend" value-format="yyyy-MM-dd" type="date"
                    placeholder="截至日期" clearable style="width: 100%"></el-date-picker>
            </el-form-item>

            <el-form-item>
                <el-input v-model="bullay" placeholder="模糊搜索" clearable @keyup.enter.native="searchEnterFun()"
                    ref="searchInput"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
                    @click="getDataList()">查询</el-button>
                <el-button size="mini" class="filter-item" type="primary"
                    @click="getDataList('湖南', '湖南雨帆噜渴乳业股份有限公司')">湖南</el-button>
                <el-button size="mini" class="filter-item" type="primary"
                    @click="getDataList('江西', '雨帆食品集团股份有限公司')">江西</el-button>
                <el-button size="mini" class="filter-item" type="primary" @click="getGuangxi">广西</el-button>
                <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                    @click="exportData">导出</el-button>
            </el-form-item>
        </el-form>
        <div class="test">{{ this.labelText }}</div>
        <el-table border ref="table" v-loading="dataListLoading" :data="dataList" style="width: 100%;">
            <el-table-column :show-overflow-tooltip="true" align="center" width="150" prop="wlSiteName" label="区域" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100001" label="大LOOK" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100002" label="小LOOK" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100004" label="健能" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100008" label="LOOK优选" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100010" label="大白桃" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100009" label="小白桃" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100014" label="大清新健爽（橙）" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100015" label="小清新健爽（橙）" />
            <el-table-column v-if="areas == '广西'" :show-overflow-tooltip="true" align="center" prop="box1520130001"
                label="330椰子牛乳" />
            <el-table-column v-if="areas == '广西'" :show-overflow-tooltip="true" align="center" prop="box1520130003"
                label="310椰子牛乳" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100017" label="大0糖0脂" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100016" label="小0糖0脂" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100020" label="小原味戴永红" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100021" label="小原味绿叶水果" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520110069" label="新鲜牧场" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100025" label="180噜渴(白)" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100026" label="180噜渴(红)" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="sum" label="合计" />
        </el-table>
    </div>
</template>

<script>
import {
    exportExcel
} from './wlreportExpro.js'

import {
    exportExcelgx
} from './wlreportgxExpro.js'

import {
    exportExceljx
} from './wlreportjxExpro.js'

import * as api from '@/api/frame/customer.js'

export default {
    name: 'wlreport-page',
    data() {
        return {
            msg: 'wlreport-page',
            bullay: '',
            dataForm: {
                p_vouchdateend: '',
                p_areaname: '',
                p_orgname: ''
            },
            guangxiForm: {
                p_vouchdateend: '',
                p_areaname: '广西',
                p_orgname: '雨帆食品集团股份有限公司'
            },
            hainanForm: {
                p_vouchdateend: '',
                p_areaname: '海南',
                p_orgname: '雨帆食品集团股份有限公司'
            },
            siteForm: {
                p_areaname: ''
            },
            areas: '',
            dataList: [],
            proList: [],
            siteList: [],
            newArray: [],
            hainanList: [],
            hnDateList: [],
            dateLable: '',
            dataListLoading: false,
            dictForm: {
                page: 0,
                size: 800,
                sort: '',
            },
            calForm: {
                p_vouchdateend: ''
            },
        };
    },
    mounted() {
        this.getDataList()
        this.wlpersonList()
        // this.getproductList()
    },
    created() {
        this.calculateDates();
    },
    methods: {
        getGuangxi() {
            this.areas = '广西'
            this.dataListLoading = true
            const [year, month, day] = this.dataForm.p_vouchdateend.split('-').map(Number);
            this.labelText = `${this.areas}区域到货明细表--截止${year}年${month}月${day + 1}日`; // 如果没有选择日期，显示默认文本
            this.dateLable = `${month}月${day}日`
            console.log(this.dateLable)
            this.guangxiForm.p_vouchdateend = this.dataForm.p_vouchdateend
            this.hainanForm.p_vouchdateend = this.dataForm.p_vouchdateend
            api.wlguangxiApi(this.guangxiForm).then(res => {
                this.dataList = res
                // 过滤掉满足条件的对象
                this.dataList = this.dataList.filter(item =>
                    !(item.wlSiteName == '桂百河雨帆商贸' && item.productCode == '1520100008')
                );
                this.dataList = this.mergeObjectsByCodes(this.dataList);
                this.dataList = this.dataList.map(item => ({
                    ...item, // 展开原对象的所有属性
                    ["box" + item.productCode]: item.box // 新增动态属性
                }));
                this.dataList = Object.values(
                    this.dataList.reduce((acc, item) => {
                        const key = item.wlSiteCode; // 使用 wlSiteCode 作为分组依据

                        if (!acc[key]) {
                            // 初始化新对象，并删除不合并的字段
                            acc[key] = { ...item }; // 先复制所有字段

                            // 删除不合并的字段
                            const fieldsToRemove = [
                                'box',
                                'deliverydate',
                                'factoryProductCode',
                                'factoryProductName',
                                'piece',
                                'productCode',
                                'vouchdate',
                                'tel'
                            ];
                            fieldsToRemove.forEach(field => delete acc[key][field]);
                        } else {
                            // 合并其他字段（如 jtProductCode）
                            Object.keys(item).forEach(field => {
                                // 如果字段不在排除列表，则合并
                                if (![
                                    'wlSiteCode',
                                    'box',
                                    'deliverydate',
                                    'factoryProductCode',
                                    'factoryProductName',
                                    'piece',
                                    'productCode',
                                    'vouchdate'
                                ].includes(field)) {
                                    acc[key][field] = item[field]; // 后出现的值会覆盖前面的
                                }
                            });
                        }

                        return acc;
                    }, {})
                );
                this.dataList = this.dataList.map(item => {
                    let sum = 0;
                    for (const key in item) {
                        // 跳过保留字段
                        if (['areaName', 'days', 'wlSiteCode', 'wlSiteName', 'tel', 'address', 'contacts'].includes(key)) continue;
                        // 其他字段转为数字并累加
                        sum += Number(item[key]) || 0;
                    }
                    // 返回新对象（保留原字段 + 新增 sum）
                    return { ...item, sum };
                });

                // 初始化总计对象
                const totalObj = {
                    areaName: "广西总计",
                    contacts: '广西总计',
                    tel: '广西总计',
                    days: 0,
                    wlSiteCode: "TOTAL",
                    wlSiteName: "广西总计"
                };

                // 遍历数组中的每个对象
                this.dataList.forEach(item => {
                    // 遍历每个对象的属性
                    Object.keys(item).forEach(key => {
                        // 跳过不需要求和的字段
                        if (['areaName', 'days', 'wlSiteCode', 'wlSiteName', 'tel', 'contacts'].includes(key)) {
                            return;
                        }

                        // 初始化总计对象中的字段（如果不存在）
                        if (!totalObj.hasOwnProperty(key)) {
                            totalObj[key] = 0;
                        }

                        // 将值转为数字并累加
                        const value = Number(item[key]) || 0;
                        totalObj[key] += value;
                    });

                    // 累加days字段（如果需要）
                    totalObj.days += Number(item.days) || 0;
                });

                // 将总计对象添加到原数组（如果需要）
                this.dataList.push(totalObj);
                //不足50件放桂桂林振兴
                this.dataList = this.processData(this.dataList)
                this.dataList = this.processData1(this.dataList)
                this.dataList = this.processData2(this.dataList)
                this.dataList = this.processData3(this.dataList)
                this.dataList = this.processDataall(this.dataList)
                this.dataList = this.processDataall1(this.dataList)

                this.dataList = this.processData1_1(this.dataList)
                this.dataList = this.processData1_2(this.dataList)
                this.dataList = this.processData1_3(this.dataList)
                this.dataList = this.processData1_4(this.dataList)
                this.dataList = this.processData1_5(this.dataList)
                this.dataList = this.processData1_6(this.dataList)



                console.log(this.dataList, '广西')

                this.dataList = this.dataList.filter(item =>
                    item.wlSiteName.includes(this.bullay)
                );
                api.wlguangxiApi(this.hainanForm).then(res => {
                    this.hainanList = res
                    console.log(this.hainanList, ' this.hainanList')
                    this.hainanList.forEach(item => {
                        item["box" + item.productCode] = item.box; // 动态字段名：productCode 的值作为 key，box 的值作为 value
                    });
                    this.hainanList = Object.values(
                        this.hainanList.reduce((acc, item) => {
                            const key = item.wlSiteCode; // 使用 wlSiteCode 作为分组依据

                            if (!acc[key]) {
                                // 初始化新对象，并删除不合并的字段
                                acc[key] = { ...item }; // 先复制所有字段

                                // 删除不合并的字段
                                const fieldsToRemove = [
                                    'box',
                                    'deliverydate',
                                    'factoryProductCode',
                                    'factoryProductName',
                                    'piece',
                                    'productCode',
                                    'vouchdate',
                                    'tel'
                                ];
                                fieldsToRemove.forEach(field => delete acc[key][field]);
                            } else {
                                // 合并其他字段（如 jtProductCode）
                                Object.keys(item).forEach(field => {
                                    // 如果字段不在排除列表，则合并
                                    if (![
                                        'wlSiteCode',
                                        'box',
                                        'deliverydate',
                                        'factoryProductCode',
                                        'factoryProductName',
                                        'piece',
                                        'productCode',
                                        'vouchdate'
                                    ].includes(field)) {
                                        acc[key][field] = item[field]; // 后出现的值会覆盖前面的
                                    }
                                });
                            }

                            return acc;
                        }, {})
                    );
                    this.hainanList = this.hainanList.map(item => {
                        let sum = 0;
                        for (const key in item) {
                            // 跳过保留字段
                            if (['areaName', 'days', 'wlSiteCode', 'wlSiteName', 'tel', 'address', 'contacts'].includes(key)) continue;
                            // 其他字段转为数字并累加
                            sum += Number(item[key]) || 0;
                        }
                        // 返回新对象（保留原字段 + 新增 sum）
                        return { ...item, sum };
                    });
                    // 初始化总计对象
                    const totalObj = {
                        wlSiteName: "海南提货",
                        days: 0,
                        contacts: "海南提货",
                        tel: "海南提货"
                    };

                    // 遍历数组中的每个对象
                    this.hainanList.forEach(item => {
                        // 遍历每个对象的属性
                        Object.keys(item).forEach(key => {
                            // 跳过不需要求和的字段
                            if (['areaName', 'days', 'wlSiteCode', 'wlSiteName', 'tel'].includes(key)) {
                                return;
                            }

                            // 初始化总计对象中的字段（如果不存在）
                            if (!totalObj.hasOwnProperty(key)) {
                                totalObj[key] = 0;
                            }

                            // 将值转为数字并累加
                            const value = Number(item[key]) || 0;
                            totalObj[key] += value;
                        });

                        // 累加days字段（如果需要）
                        totalObj.days += Number(item.days) || 0;
                    });

                    // 将总计对象添加到原数组（如果需要）
                    this.dataList.push(totalObj);
                    this.dataList = this.addTotalFromLastTwoItems(this.dataList)
                    // 直接修改原数组
                    this.dataList.forEach((item, index) => {
                        // 如果不是最后三个元素，则添加 startDate
                        if (index < this.dataList.length - 3) {
                            item.startDate = this.dateLable;
                        }
                    });

                    console.log(this.dataList)
                    this.dataListLoading = false

                })


            })
        },
        addTotalFromLastTwoItems(arr) {
            // 检查数组长度是否足够
            if (arr.length < 2) return arr;

            // 获取最后两个对象
            const last = arr[arr.length - 1];
            const secondLast = arr[arr.length - 2];

            // 需要特殊处理的固定值字段
            const fixedValueFields = {
                wlSiteName: "合计",  // 固定显示"合计"
                contacts: "合计",    // 固定显示"合计"
                tel: "合计",         // 固定显示"合计"
                days: 0             // 固定显示0
            };

            // 需要排除的字段列表（这些字段不参与求和）
            const excludedFields = {
                productName: true   // 示例：productName不参与求和
                // 可以添加其他需要排除的字段
            };

            // 创建合计对象
            const totalItem = {};

            // 首先设置固定值字段
            for (const field in fixedValueFields) {
                totalItem[field] = fixedValueFields[field];
            }

            // 收集所有可能的字段（合并两个对象的键）
            const allFields = new Set([...Object.keys(last), ...Object.keys(secondLast)]);

            // 处理需要相加的字段
            for (const field of allFields) {
                // 跳过固定值字段和排除字段
                if (fixedValueFields[field] !== undefined || excludedFields[field]) continue;

                // 获取值（没有则视为0）
                const lastVal = (last[field] !== undefined && last[field] !== null) ? last[field] : 0;
                const secondLastVal = (secondLast[field] !== undefined && secondLast[field] !== null) ? secondLast[field] : 0;

                // 数值相加处理
                if (typeof lastVal === 'number' && typeof secondLastVal === 'number') {
                    totalItem[field] = lastVal + secondLastVal;
                } else {
                    // 尝试转换为数字相加
                    const num1 = parseFloat(lastVal) || 0;
                    const num2 = parseFloat(secondLastVal) || 0;
                    totalItem[field] = num1 + num2;
                }
            }

            // 返回包含合计的新数组
            return [...arr, totalItem];
        },
        calculate() {
            this.calForm.p_vouchdateend = this.dataForm.p_vouchdateend
            alert('正在计算中')
            api.getrunArrivedApi(this.calForm).then(res => {

            })
        },
        wlpersonList() {
            api.wlsitepersonApi(this.siteForm).then(res => {
                this.siteList = res
                console.log(res)
            })
        },
        getDataList(area, org) {
            this.areas = area ? area : '湖南';
            this.dataForm.p_areaname = area ? area : '湖南';
            this.dataForm.p_orgname = org ? org : '湖南雨帆噜渴乳业股份有限公司';
            this.siteForm.p_areaname = area ? area : '湖南';
            this.wlpersonList()
            this.dataListLoading = true
            const [year, month, day] = this.dataForm.p_vouchdateend.split('-').map(Number);
            this.labelText = `${this.areas}区域到货明细表--截止${year}年${month}月${day}日`; // 如果没有选择日期，显示默认文本
            api.wlhunanarrivedApi(this.dataForm).then(res => {
                this.dataList = res
                this.hnDateList = res
                // this.hnDateList = this.formatData(this.hnDateList)
                this.newArray = this.dataList
                    .filter(item => item.jiuxjinangproductlist)
                    .flatMap(item => item.jiuxjinangproductlist);

                

                // 2. 过滤掉原数组中包含 jiuxjinangproductlist 的对象
                this.dataList = this.dataList.filter(item => !item.jiuxjinangproductlist);
                if (this.newArray.length != 0) {
                    this.newArray.forEach(item => {
                        item["box" + item.cProductCode] = item.box; // 动态字段名：productCode 的值作为 key，box 的值作为 value
                    });
                    this.newArray = Object.values(
                        this.newArray.reduce((acc, item) => {
                            const key = item.vcol2_name; // 使用 wlSiteCode 作为分组依据

                            if (!acc[key]) {
                                // 初始化新对象，并删除不合并的字段
                                acc[key] = { ...item }; // 先复制所有字段

                                // 删除不合并的字段
                                const fieldsToRemove = [
                                    'box',
                                    'vouchdate',
                                    'cProductCode',
                                    'cProductName',
                                ];
                                fieldsToRemove.forEach(field => delete acc[key][field]);
                            } else {
                                // 合并其他字段（如 jtProductCode）
                                Object.keys(item).forEach(field => {
                                    // 如果字段不在排除列表，则合并
                                    if (![
                                        'box',
                                        'cProductCode',
                                        'cProductName',
                                        'vouchdate',
                                        'vcol2_name'
                                    ].includes(field)) {
                                        acc[key][field] = item[field]; // 后出现的值会覆盖前面的
                                    }
                                });
                            }

                            return acc;
                        }, {})
                    );
                    this.newArray = this.newArray.map(item => {
                        let sum = 0;
                        for (const key in item) {
                            // 跳过保留字段
                            if (['vcol6_name', 'vcol6_code', 'vcol2_name', 'vcol2'].includes(key)) continue;
                            // 其他字段转为数字并累加
                            sum += Number(item[key]) || 0;
                        }
                        // 返回新对象（保留原字段 + 新增 sum）
                        return { ...item, sum };
                    });
                    // 初始化总计对象
                    const totalObj = {
                        vcol2_name: "总计",
                        days: 0,
                        wlSiteCode: "TOTAL",
                        wlSiteName: "总计"
                    };

                    // 遍历数组中的每个对象
                    this.newArray.forEach(item => {
                        // 遍历每个对象的属性
                        Object.keys(item).forEach(key => {
                            // 跳过不需要求和的字段
                            if (['vcol6_name', 'vcol6_code', 'vcol2_name', 'vcol2'].includes(key)) {
                                return;
                            }

                            // 初始化总计对象中的字段（如果不存在）
                            if (!totalObj.hasOwnProperty(key)) {
                                totalObj[key] = 0;
                            }

                            // 将值转为数字并累加
                            const value = Number(item[key]) || 0;
                            totalObj[key] += value;
                        });

                        // 累加days字段（如果需要）
                        totalObj.days += Number(item.days) || 0;
                    });

                    // 将总计对象添加到原数组（如果需要）
                    this.newArray.push(totalObj);

                }

                // console.log(this.newArray);
                // console.log(this.dataList, 'this.dataList')
                this.dataList = this.mergeObjectsByCodes(this.dataList);
                this.dataList = this.dataList.map(item => ({
                    ...item, // 展开原对象的所有属性
                    ["box" + item.productCode]: item.box // 新增动态属性
                }));
                this.dataList = Object.values(
                    this.dataList.reduce((acc, item) => {
                        const key = item.wlSiteCode; // 使用 wlSiteCode 作为分组依据

                        if (!acc[key]) {
                            // 初始化新对象，并删除不合并的字段
                            acc[key] = { ...item }; // 先复制所有字段

                            // 删除不合并的字段
                            const fieldsToRemove = [
                                'box',
                                'deliverydate',
                                'factoryProductCode',
                                'factoryProductName',
                                'piece',
                                'productCode',
                                'vouchdate'
                            ];
                            fieldsToRemove.forEach(field => delete acc[key][field]);
                        } else {
                            // 合并其他字段（如 jtProductCode）
                            Object.keys(item).forEach(field => {
                                // 如果字段不在排除列表，则合并
                                if (![
                                    'wlSiteCode',
                                    'box',
                                    'deliverydate',
                                    'factoryProductCode',
                                    'factoryProductName',
                                    'piece',
                                    'productCode',
                                    'vouchdate'
                                ].includes(field)) {
                                    acc[key][field] = item[field]; // 后出现的值会覆盖前面的
                                }
                            });
                        }

                        return acc;
                    }, {})
                );
                this.dataList = this.dataList.map(item => {
                    let sum = 0;
                    for (const key in item) {
                        // 跳过保留字段
                        if (['areaName', 'days', 'wlSiteCode', 'wlSiteName'].includes(key)) continue;
                        // 其他字段转为数字并累加
                        sum += Number(item[key]) || 0;
                    }
                    // 返回新对象（保留原字段 + 新增 sum）
                    return { ...item, sum };
                });
                // 初始化总计对象
                const totalObj = {
                    areaName: "总计",
                    days: 0,
                    wlSiteCode: "TOTAL",
                    wlSiteName: "总计"
                };

                // 遍历数组中的每个对象
                this.dataList.forEach(item => {
                    // 遍历每个对象的属性
                    Object.keys(item).forEach(key => {
                        // 跳过不需要求和的字段
                        if (['areaName', 'days', 'wlSiteCode', 'wlSiteName'].includes(key)) {
                            return;
                        }

                        // 初始化总计对象中的字段（如果不存在）
                        if (!totalObj.hasOwnProperty(key)) {
                            totalObj[key] = 0;
                        }

                        // 将值转为数字并累加
                        const value = Number(item[key]) || 0;
                        totalObj[key] += value;
                    });

                    // 累加days字段（如果需要）
                    totalObj.days += Number(item.days) || 0;
                });

                // 将总计对象添加到原数组（如果需要）
                this.dataList.push(totalObj);


                this.dataList = this.dataList.filter(item =>
                    item.wlSiteName.includes(this.bullay)
                );

                this.dataListLoading = false
                console.log(this.dataList, 'this.dataList')
            })

        },
        formatData(data) {
            return data.map(item => {
                const formattedItem = {};
                for (const key in item) {
                    if (key === 'areaName' || key === 'days' || key === 'wlSiteCode' || key === 'wlSiteName' || key === 'vouchdate' || key === 'deliverydate' || key === 'factoryProductCode' || key === 'productCode') {
                        formattedItem[key] = item[key];
                    } else {
                        // 尝试转换为数字并保留两位小数
                        const num = parseFloat(item[key]);
                        formattedItem[key] = isNaN(num) ? item[key] : parseFloat(num.toFixed(0));
                    }
                }
                return formattedItem;
            });
        },
        mergeObjectsByCodes(array) {
            const resultMap = new Map();

            array.forEach(obj => {
                const key = `${obj.wlSiteCode}_${obj.productCode}`;

                if (resultMap.has(key)) {
                    // 如果已存在相同键的对象，则合并box值
                    const existingObj = resultMap.get(key);
                    existingObj.box = (parseFloat(existingObj.box) || 0) + (parseFloat(obj.box) || 0);

                    // 保留其他字段（如果原对象中有新字段，也会被保留）
                    resultMap.set(key, { ...obj, ...existingObj });
                } else {
                    // 如果是新键，则直接添加，同时确保box是数字
                    resultMap.set(key, {
                        ...obj,
                        box: parseFloat(obj.box) || 0
                    });
                }
            });

            return Array.from(resultMap.values());
        },

        processData(data) {
            // 1. 找到目标对象（wlSiteName === "桂桂林振兴"）
            const targetSite = data.find(item => item.wlSiteName === "桂桂林振兴");

            if (!targetSite) {
                console.log("未找到 wlSiteName 为 '桂桂林振兴' 的对象");
                return data;
            }

            // 2. 需要匹配的站点名称（不包括 "桂桂林振兴"）
            const siteNames = [
                "桂桂林振兴0069",
                "桂桂林资源荣熙",
                "桂桂林全州斌丽",
                "桂桂林永福百佳",
                "桂桂林兴安美思"
            ];

            // 3. 遍历数据，处理符合条件的对象
            const result = data.filter(item => {
                if (siteNames.includes(item.wlSiteName)) {
                    if (item.sum < 50) {
                        // 获取所有字段名
                        const allFields = Object.keys(item);
                        const fieldsToRemove = ["wlSiteName", "wlSiteCode", "tel", "productName", "contacts", "areaName", "address"];

                        // 遍历所有字段，把非 fieldsToRemove 的字段转为数字后相加到 targetSite
                        allFields.forEach(field => {
                            if (!fieldsToRemove.includes(field)) {
                                // 尝试将值转为数字
                                const numValue = parseFloat(item[field]);
                                if (!isNaN(numValue)) { // 如果是有效数字
                                    // 如果 targetSite 没有该字段，初始化为 0
                                    if (targetSite[field] === undefined) {
                                        targetSite[field] = 0;
                                    }
                                    // 确保 targetSite[field] 是数字（如果不是，尝试转换）
                                    const targetNum = parseFloat(targetSite[field]);
                                    if (!isNaN(targetNum)) {
                                        targetSite[field] = targetNum + numValue;
                                    }
                                }
                            }
                        });

                        // 过滤掉这个对象（sum < 50 的站点）
                        return false;
                    }
                }
                // 保留其他对象（sum >= 50 或非目标站点）
                return true;
            });

            return result;
        },
        processData1(data) {
            // 1. 找到目标对象（wlSiteName === "桂南宁青秀永明福"）
            const targetSite = data.find(item => item.wlSiteName === "桂南宁青秀永明福");

            if (!targetSite) {
                console.log("未找到 wlSiteName 为 '桂南宁青秀永明福' 的对象");
                return data;
            }

            // 2. 需要匹配的站点名称（不包括 "桂南宁青秀永明福"）
            const siteNames = [
                "桂南宁江南众焱"
            ];

            // 3. 遍历数据，处理符合条件的对象
            const result = data.filter(item => {
                if (siteNames.includes(item.wlSiteName)) {
                    if (item.sum < 50) {
                        // 获取所有字段名
                        const allFields = Object.keys(item);
                        const fieldsToRemove = ["wlSiteName", "wlSiteCode", "tel", "productName", "contacts", "areaName", "address"];

                        // 遍历所有字段，把非 fieldsToRemove 的字段转为数字后相加到 targetSite
                        allFields.forEach(field => {
                            if (!fieldsToRemove.includes(field)) {
                                // 尝试将值转为数字
                                const numValue = parseFloat(item[field]);
                                if (!isNaN(numValue)) { // 如果是有效数字
                                    // 如果 targetSite 没有该字段，初始化为 0
                                    if (targetSite[field] === undefined) {
                                        targetSite[field] = 0;
                                    }
                                    // 确保 targetSite[field] 是数字（如果不是，尝试转换）
                                    const targetNum = parseFloat(targetSite[field]);
                                    if (!isNaN(targetNum)) {
                                        targetSite[field] = targetNum + numValue;
                                    }
                                }
                            }
                        });

                        // 过滤掉这个对象（sum < 50 的站点）
                        return false;
                    }
                }
                // 保留其他对象（sum >= 50 或非目标站点）
                return true;
            });

            return result;
        },
        processData1_1(data) {
            // 1. 找到目标对象（wlSiteName === "桂南宁青秀永明福"）
            const targetSite = data.find(item => item.wlSiteName === "桂防城港锐鑫帆");

            if (!targetSite) {
                console.log("未找到 wlSiteName 为 '桂防城港锐鑫帆' 的对象");
                return data;
            }

            // 2. 需要匹配的站点名称（不包括 "桂南宁青秀永明福"）
            const siteNames = [
                "桂防城港东兴丹桂"
            ];

            // 3. 遍历数据，处理符合条件的对象
            const result = data.filter(item => {
                if (siteNames.includes(item.wlSiteName)) {
                    if (item.sum < 50) {
                        // 获取所有字段名
                        const allFields = Object.keys(item);
                        const fieldsToRemove = ["wlSiteName", "wlSiteCode", "tel", "productName", "contacts", "areaName", "address"];

                        // 遍历所有字段，把非 fieldsToRemove 的字段转为数字后相加到 targetSite
                        allFields.forEach(field => {
                            if (!fieldsToRemove.includes(field)) {
                                // 尝试将值转为数字
                                const numValue = parseFloat(item[field]);
                                if (!isNaN(numValue)) { // 如果是有效数字
                                    // 如果 targetSite 没有该字段，初始化为 0
                                    if (targetSite[field] === undefined) {
                                        targetSite[field] = 0;
                                    }
                                    // 确保 targetSite[field] 是数字（如果不是，尝试转换）
                                    const targetNum = parseFloat(targetSite[field]);
                                    if (!isNaN(targetNum)) {
                                        targetSite[field] = targetNum + numValue;
                                    }
                                }
                            }
                        });

                        // 过滤掉这个对象（sum < 50 的站点）
                        return false;
                    }
                }
                // 保留其他对象（sum >= 50 或非目标站点）
                return true;
            });

            return result;
        },
        processData1_2(data) {
            // 1. 找到目标对象（wlSiteName === "桂南宁青秀永明福"）
            const targetSite = data.find(item => item.wlSiteName === "桂百色平果牛牛顺");

            if (!targetSite) {
                console.log("未找到 wlSiteName 为 '桂百色平果牛牛顺' 的对象");
                return data;
            }

            // 2. 需要匹配的站点名称（不包括 "桂南宁青秀永明福"）
            const siteNames = [
                "桂百色田东冠程", "桂南宁良庆牛牛顺","桂南宁良庆福润"
            ];

            // 3. 遍历数据，处理符合条件的对象
            const result = data.filter(item => {
                if (siteNames.includes(item.wlSiteName)) {
                    if (item.sum < 50) {
                        // 获取所有字段名
                        const allFields = Object.keys(item);
                        const fieldsToRemove = ["wlSiteName", "wlSiteCode", "tel", "productName", "contacts", "areaName", "address"];

                        // 遍历所有字段，把非 fieldsToRemove 的字段转为数字后相加到 targetSite
                        allFields.forEach(field => {
                            if (!fieldsToRemove.includes(field)) {
                                // 尝试将值转为数字
                                const numValue = parseFloat(item[field]);
                                if (!isNaN(numValue)) { // 如果是有效数字
                                    // 如果 targetSite 没有该字段，初始化为 0
                                    if (targetSite[field] === undefined) {
                                        targetSite[field] = 0;
                                    }
                                    // 确保 targetSite[field] 是数字（如果不是，尝试转换）
                                    const targetNum = parseFloat(targetSite[field]);
                                    if (!isNaN(targetNum)) {
                                        targetSite[field] = targetNum + numValue;
                                    }
                                }
                            }
                        });

                        // 过滤掉这个对象（sum < 50 的站点）
                        return false;
                    }
                }
                // 保留其他对象（sum >= 50 或非目标站点）
                return true;
            });

            return result;
        },
        processData1_3(data) {
            // 1. 找到目标对象（wlSiteName === "桂南宁青秀永明福"）
            const targetSite = data.find(item => item.wlSiteName === "桂梧州鑫皓");

            if (!targetSite) {
                console.log("未找到 wlSiteName 为 '桂梧州鑫皓' 的对象");
                return data;
            }

            // 2. 需要匹配的站点名称（不包括 "桂南宁青秀永明福"）
            const siteNames = [
                "桂梧州岑溪恒顺", "桂梧州藤县政顺"
            ];

            // 3. 遍历数据，处理符合条件的对象
            const result = data.filter(item => {
                if (siteNames.includes(item.wlSiteName)) {
                    if (item.sum < 50) {
                        // 获取所有字段名
                        const allFields = Object.keys(item);
                        const fieldsToRemove = ["wlSiteName", "wlSiteCode", "tel", "productName", "contacts", "areaName", "address"];

                        // 遍历所有字段，把非 fieldsToRemove 的字段转为数字后相加到 targetSite
                        allFields.forEach(field => {
                            if (!fieldsToRemove.includes(field)) {
                                // 尝试将值转为数字
                                const numValue = parseFloat(item[field]);
                                if (!isNaN(numValue)) { // 如果是有效数字
                                    // 如果 targetSite 没有该字段，初始化为 0
                                    if (targetSite[field] === undefined) {
                                        targetSite[field] = 0;
                                    }
                                    // 确保 targetSite[field] 是数字（如果不是，尝试转换）
                                    const targetNum = parseFloat(targetSite[field]);
                                    if (!isNaN(targetNum)) {
                                        targetSite[field] = targetNum + numValue;
                                    }
                                }
                            }
                        });

                        // 过滤掉这个对象（sum < 50 的站点）
                        return false;
                    }
                }
                // 保留其他对象（sum >= 50 或非目标站点）
                return true;
            });

            return result;
        },
        processData1_4(data) {
            // 1. 找到目标对象（wlSiteName === "桂南宁青秀永明福"）
            const targetSite = data.find(item => item.wlSiteName === "桂贵港雨顺");

            if (!targetSite) {
                console.log("未找到 wlSiteName 为 '桂南宁青秀永明福' 的对象");
                return data;
            }

            // 2. 需要匹配的站点名称（不包括 "桂南宁青秀永明福"）
            const siteNames = [
                "桂贵港平南明威"
            ];

            // 3. 遍历数据，处理符合条件的对象
            const result = data.filter(item => {
                if (siteNames.includes(item.wlSiteName)) {
                    if (item.sum < 50) {
                        // 获取所有字段名
                        const allFields = Object.keys(item);
                        const fieldsToRemove = ["wlSiteName", "wlSiteCode", "tel", "productName", "contacts", "areaName", "address"];

                        // 遍历所有字段，把非 fieldsToRemove 的字段转为数字后相加到 targetSite
                        allFields.forEach(field => {
                            if (!fieldsToRemove.includes(field)) {
                                // 尝试将值转为数字
                                const numValue = parseFloat(item[field]);
                                if (!isNaN(numValue)) { // 如果是有效数字
                                    // 如果 targetSite 没有该字段，初始化为 0
                                    if (targetSite[field] === undefined) {
                                        targetSite[field] = 0;
                                    }
                                    // 确保 targetSite[field] 是数字（如果不是，尝试转换）
                                    const targetNum = parseFloat(targetSite[field]);
                                    if (!isNaN(targetNum)) {
                                        targetSite[field] = targetNum + numValue;
                                    }
                                }
                            }
                        });

                        // 过滤掉这个对象（sum < 50 的站点）
                        return false;
                    }
                }
                // 保留其他对象（sum >= 50 或非目标站点）
                return true;
            });

            return result;
        },
        processData1_5(data) {
            // 1. 找到目标对象（wlSiteName === "桂南宁青秀永明福"）
            const targetSite = data.find(item => item.wlSiteName === "桂百色宝庆");

            if (!targetSite) {
                console.log("未找到 wlSiteName 为 '桂南宁青秀永明福' 的对象");
                return data;
            }

            // 2. 需要匹配的站点名称（不包括 "桂南宁青秀永明福"）
            const siteNames = [
                "桂百色凌云百货"
            ];

            // 3. 遍历数据，处理符合条件的对象
            const result = data.filter(item => {
                if (siteNames.includes(item.wlSiteName)) {
                    if (item.sum < 50) {
                        // 获取所有字段名
                        const allFields = Object.keys(item);
                        const fieldsToRemove = ["wlSiteName", "wlSiteCode", "tel", "productName", "contacts", "areaName", "address"];

                        // 遍历所有字段，把非 fieldsToRemove 的字段转为数字后相加到 targetSite
                        allFields.forEach(field => {
                            if (!fieldsToRemove.includes(field)) {
                                // 尝试将值转为数字
                                const numValue = parseFloat(item[field]);
                                if (!isNaN(numValue)) { // 如果是有效数字
                                    // 如果 targetSite 没有该字段，初始化为 0
                                    if (targetSite[field] === undefined) {
                                        targetSite[field] = 0;
                                    }
                                    // 确保 targetSite[field] 是数字（如果不是，尝试转换）
                                    const targetNum = parseFloat(targetSite[field]);
                                    if (!isNaN(targetNum)) {
                                        targetSite[field] = targetNum + numValue;
                                    }
                                }
                            }
                        });

                        // 过滤掉这个对象（sum < 50 的站点）
                        return false;
                    }
                }
                // 保留其他对象（sum >= 50 或非目标站点）
                return true;
            });

            return result;
        },

        processData1_6(data) {
            // 1. 找到目标对象（wlSiteName === "桂崇左盛昌源"）
            let targetSite = data.find(item => item.wlSiteName === "桂崇左盛昌源");

            if (!targetSite) {
                targetSite = data.find(item => item.wlSiteName === "桂崇左凭祥隆润");
                if (!targetSite) {
                    console.warn("未找到目标站点：既没有'桂崇左盛昌源'，也没有'桂崇左凭祥隆润'");
                    return data; // 如果两个目标站点都不存在，直接返回原数据
                }
            }

            // 2. 需要匹配的站点名称（不包括 "桂南宁青秀永明福"）
            const siteNames = [
                "桂崇左宁明恒佑"
            ];

            // 3. 遍历数据，处理符合条件的对象
            const result = data.filter(item => {
                if (siteNames.includes(item.wlSiteName)) {
                    if (item.sum < 50) {
                        // 获取所有字段名
                        const allFields = Object.keys(item);
                        const fieldsToRemove = ["wlSiteName", "wlSiteCode", "tel", "productName", "contacts", "areaName", "address"];

                        // 遍历所有字段，把非 fieldsToRemove 的字段转为数字后相加到 targetSite
                        allFields.forEach(field => {
                            if (!fieldsToRemove.includes(field)) {
                                // 尝试将值转为数字
                                const numValue = parseFloat(item[field]);
                                if (!isNaN(numValue)) { // 如果是有效数字
                                    // 如果 targetSite 没有该字段，初始化为 0
                                    if (targetSite[field] === undefined) {
                                        targetSite[field] = 0;
                                    }
                                    // 确保 targetSite[field] 是数字（如果不是，尝试转换）
                                    const targetNum = parseFloat(targetSite[field]);
                                    if (!isNaN(targetNum)) {
                                        targetSite[field] = targetNum + numValue;
                                    }
                                }
                            }
                        });

                        // 过滤掉这个对象（sum < 50 的站点）
                        return false;
                    }
                }
                // 保留其他对象（sum >= 50 或非目标站点）
                return true;
            });

            return result;
        },

        processData2(data) {
            // 1. 找到目标对象（wlSiteName === "桂柳州米德"）
            const targetSite = data.find(item => item.wlSiteName === "桂柳州米德");

            if (!targetSite) {
                console.log("未找到 wlSiteName 为 '桂柳州米德' 的对象");
                return data;
            }

            // 2. 需要匹配的站点名称（不包括 "桂柳州米德"）
            const siteNames = [
                "桂柳州柳江何芳"
            ];

            // 3. 遍历数据，处理符合条件的对象
            const result = data.filter(item => {
                if (siteNames.includes(item.wlSiteName)) {
                    if (item.sum < 50) {
                        // 获取所有字段名
                        const allFields = Object.keys(item);
                        const fieldsToRemove = ["wlSiteName", "wlSiteCode", "tel", "productName", "contacts", "areaName", "address"];

                        // 遍历所有字段，把非 fieldsToRemove 的字段转为数字后相加到 targetSite
                        allFields.forEach(field => {
                            if (!fieldsToRemove.includes(field)) {
                                // 尝试将值转为数字
                                const numValue = parseFloat(item[field]);
                                if (!isNaN(numValue)) { // 如果是有效数字
                                    // 如果 targetSite 没有该字段，初始化为 0
                                    if (targetSite[field] === undefined) {
                                        targetSite[field] = 0;
                                    }
                                    // 确保 targetSite[field] 是数字（如果不是，尝试转换）
                                    const targetNum = parseFloat(targetSite[field]);
                                    if (!isNaN(targetNum)) {
                                        targetSite[field] = targetNum + numValue;
                                    }
                                }
                            }
                        });

                        // 过滤掉这个对象（sum < 50 的站点）
                        return false;
                    }
                }
                // 保留其他对象（sum >= 50 或非目标站点）
                return true;
            });

            return result;
        },
        processData3(data) {
            // 1. 找到目标对象（wlSiteName === "桂百色宝庆"）
            const targetSite = data.find(item => item.wlSiteName === "桂百色宝庆");

            if (!targetSite) {
                console.log("未找到 wlSiteName 为 '桂百色宝庆' 的对象");
                return data;
            }

            // 2. 需要匹配的站点名称（不包括 "桂百色宝庆"）
            const siteNames = [
                "桂百色田阳程顺"
            ];

            // 3. 遍历数据，处理符合条件的对象
            const result = data.filter(item => {
                if (siteNames.includes(item.wlSiteName)) {
                    if (item.sum < 50) {
                        // 获取所有字段名
                        const allFields = Object.keys(item);
                        const fieldsToRemove = ["wlSiteName", "wlSiteCode", "tel", "productName", "contacts", "areaName", "address"];

                        // 遍历所有字段，把非 fieldsToRemove 的字段转为数字后相加到 targetSite
                        allFields.forEach(field => {
                            if (!fieldsToRemove.includes(field)) {
                                // 尝试将值转为数字
                                const numValue = parseFloat(item[field]);
                                if (!isNaN(numValue)) { // 如果是有效数字
                                    // 如果 targetSite 没有该字段，初始化为 0
                                    if (targetSite[field] === undefined) {
                                        targetSite[field] = 0;
                                    }
                                    // 确保 targetSite[field] 是数字（如果不是，尝试转换）
                                    const targetNum = parseFloat(targetSite[field]);
                                    if (!isNaN(targetNum)) {
                                        targetSite[field] = targetNum + numValue;
                                    }
                                }
                            }
                        });

                        // 过滤掉这个对象（sum < 50 的站点）
                        return false;
                    }
                }
                // 保留其他对象（sum >= 50 或非目标站点）
                return true;
            });

            return result;
        },
        processDataall(data) {
            // 目标站点名称列表
            const targetNames = ["桂南宁宾阳汇成", "桂南宁横县湘旺", "桂南宁上林海硕"];

            // 获取目标站点
            const targetSites = data.filter(item => targetNames.includes(item.wlSiteName));

            if (targetSites.length === 0) {
                return data; // 没有目标站点，直接返回原数据
            }

            // 按sum值排序，取最大
            const sortedSites = [...targetSites].sort((a, b) => b.sum - a.sum);
            const maxSumSite = sortedSites[0];

            // 其他的目标站点，将它们的数值字段合并到maxSumSite
            const others = sortedSites.slice(1);
            others.forEach(site => {
                Object.keys(site).forEach(field => {
                    const excludedFields = ["wlSiteName", "wlSiteCode", "tel", "productName", "contacts", "areaName", "address"];
                    if (!excludedFields.includes(field)) {
                        const value = parseFloat(site[field]);
                        if (!isNaN(value)) {
                            if (maxSumSite[field] === undefined) {
                                maxSumSite[field] = 0;
                            }
                            const targetNum = parseFloat(maxSumSite[field]);
                            if (!isNaN(targetNum)) {
                                // 累加后保留一位小数
                                maxSumSite[field] = parseFloat((targetNum + value).toFixed(1));
                            }
                        }
                    }
                });
            });

            // 从原始数据中移除除了最大站点外的其他目标站点
            const result = data.filter(item => !others.includes(item));

            return result;
        },
        processDataall1(data) {
            // 目标站点名称列表
            const targetNames = ["桂贺州富川聚益", "桂贺州钟山小何"];

            // 获取目标站点
            const targetSites = data.filter(item => targetNames.includes(item.wlSiteName));

            if (targetSites.length === 0) {
                return data; // 没有目标站点，直接返回原数据
            }

            // 按sum值排序，取最大
            const sortedSites = [...targetSites].sort((a, b) => b.sum - a.sum);
            const maxSumSite = sortedSites[0];

            // 其他的目标站点，将它们的数值字段合并到maxSumSite
            const others = sortedSites.slice(1);
            others.forEach(site => {
                Object.keys(site).forEach(field => {
                    const excludedFields = ["wlSiteName", "wlSiteCode", "tel", "productName", "contacts", "areaName", "address"];
                    if (!excludedFields.includes(field)) {
                        const value = parseFloat(site[field]);
                        if (!isNaN(value)) {
                            if (maxSumSite[field] === undefined) {
                                maxSumSite[field] = 0;
                            }
                            const targetNum = parseFloat(maxSumSite[field]);
                            if (!isNaN(targetNum)) {
                                // 累加后保留一位小数
                                maxSumSite[field] = parseFloat((targetNum + value).toFixed(1));
                            }
                        }
                    }
                });
            });

            // 从原始数据中移除除了最大站点外的其他目标站点
            const result = data.filter(item => !others.includes(item));

            return result;
        },


        getproductList() {
            api.wlProductaFactcheckApi(this.dictForm).then(res => {
                this.proList = res.content
                this.getDataList()
                console.log(this.proList)
            })
        },
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (this.areas == '广西') {
                    exportExcelgx(this.dataList, this.dataForm.p_vouchdateend, `广西区域物流报表.xlsx`,)
                } else if (this.areas == '江西') {
                    exportExceljx(this.dataList, this.dataForm.p_vouchdateend, `江西区域物流报表.xlsx`, this.siteList, this.newArray)
                } else {
                    exportExcel(this.hnDateList, this.dataForm.p_vouchdateend, `湖南区域物流报表.xlsx`, this.siteList, this.areas)
                }

            })
        },
        // 获取今年的日期数据
        calculateDates() {
            const today = new Date();

            // 获取当前月份的月初时间 
            const startOfMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);
            this.startOfMonth = this.formatDate(startOfMonthDate);

            // 获取截至今天的时间 
            this.endOfToday = this.formatDate(today);

            // this.dataForm.p_vouchdatestart = this.startOfMonth;
            this.dataForm.p_vouchdateend = this.endOfToday;
            this.labelText = `${this.areas}区域到货明细表--截止${this.year}年${this.month}月${this.day}日`;
        },
        // 格式化日期
        formatDate(date) {
            this.year = date.getFullYear();
            this.month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1 
            this.day = String(date.getDate()).padStart(2, '0');
            return `${this.year}-${this.month}-${this.day}`;
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