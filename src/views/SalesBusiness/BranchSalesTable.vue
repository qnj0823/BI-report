<template>
    <div class='BT'>
        <el-form :inline="true" style="width: 100%; margin: 0 auto;">
            <!-- <el-form-item>
                <el-date-picker v-model="dataForm.p_vouchdatestart" value-format="yyyy-MM-dd" type="date"
                    placeholder="开始日期" clearable style="width: 100%"></el-date-picker>
            </el-form-item> -->
            <el-form-item>
                <el-date-picker v-model="dataForm.p_vouchdateend" value-format="yyyy-MM-dd" type="date"
                    placeholder="结束日期" clearable style="width: 100%" @change="handleDateChange"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
                    @click="getDataList">查询</el-button>
            </el-form-item>
            <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                @click="exportData">导出</el-button>
        </el-form>
        <div style="display: flex; justify-content: center; align-items: center;">
            <label>{{ labelText }}</label>
        </div>
        <el-table class="table" ref="table" :data="zoneList" border v-loading="dataListLoading"
            style="width: 100%; margin: 0 auto; margin-bottom: 50px;">
            <el-table-column :show-overflow-tooltip="true" align="center" width="80" prop="Rank" label="序号" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="orgdqname" label="战区" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="orgname" label="分公司" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="fzr" label="总经理" />
            <el-table-column align="center" label="老品增幅">
                <el-table-column :show-overflow-tooltip="true" align="center" prop="oldproductvalue" label="老品对赌增幅" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="oldbox1" label="同期老品" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="oldbox" label="累计达成" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="oldrate" label="老品増幅" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="oldtite" label="是否达标" />
            </el-table-column>
            <el-table-column align="center" label="光明椰子汁(10%)">
                <el-table-column :show-overflow-tooltip="true" align="center" prop="totalorder" label="累计销售额" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yzztotal" label="椰子汁(万元)" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yzzrate" label="占比" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="YZZtite" label="是否达标" />
            </el-table-column>
            <el-table-column align="center" label="全品增幅">
                <el-table-column :show-overflow-tooltip="true" align="center" prop="allproductvalue" label="全品对赌增幅" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="Mallsum1" label="同期全品" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="Mallsum" label="累计达成" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="totalrate" label="全品增幅" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="alltite" label="是否达标" />
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import * as api from '@/api/frame/customer.js'
import {
    exportExcel
} from './BranchSalesTableExpro.js'
export default {
    name: 'BT-page',
    data() {
        return {
            msg: 'BT-page',
            labelText: '全国分公司(对赌)销售跟进表',
            dataForm: {
                p_vouchdateend: '',
                p_vouchdatestart: '',
            },
            dataForm1: {
                p_vouchdateend: '',
                p_vouchdatestart: '',
            },
            dataForm2: {
                blurry: '',
            },
            taskForm: {
                page: 0,
                size: 800,
                sort: '',
            },
            taskList: [],
            dataList: [],
            result: [],
            dataPreList: [],
            resultPre: [],
            updatedArray: [],
            salseList: [],
            dataListLoading: false,
            zoneList: [],
            AttribList: []
        };
    },
    created() {
        this.calculateDates();
    },
    mounted() {
        this.getDataList()
    },
    methods: {
        // rowStyle({
        //     rowIndex,
        //     row
        // }) {
        //     if (row.orgdqname == '两湖战区') {
        //         return {
        //             background: '#fed817',
        //         }
        //     }
        //     if (row.orgdqname == '华东战区') {
        //         return {
        //             background: '#C00000',
        //         }
        //     }
        // },
        addOrderTotal(data) {
            // 先进行分组并计算 totalorder  
            const groupedTotals = data.reduce((accumulator, current) => {
                const key = `${current.dqname}-${current.ocustomerClass_name}`;

                // 确保分组存在  
                if (!accumulator[key]) {
                    accumulator[key] = {
                        dqname: current.dqname,
                        ocustomerClass_name: current.ocustomerClass_name,
                        totalorder: 0
                    };
                }

                // 累加 order_amount 确保转为数字  
                accumulator[key].totalorder += Number(current.order_amount) || 0;

                return accumulator;
            }, {});

            // 将 totalorder 添加到每个对应的原对象中  
            return data.map(item => {
                const key = `${item.dqname}-${item.ocustomerClass_name}`;
                const total = groupedTotals[key].totalorder;

                return {
                    ...item,
                    totalorder: total / 10000
                };
            });
        },
        calculateYzztotal(products) {
            // 对产品进行分组  
            const groupedProducts = products.reduce((acc, product) => {
                const key = `${product.dqname}-${product.ocustomerClass_name}`; // 生成唯一的分组键  
                if (!acc[key]) {
                    acc[key] = []; // 如果键不存在，创建一个空数组  
                }
                acc[key].push(product); // 将产品添加到对应的分组  
                return acc;
            }, {});

            // 计算每个分组的椰子汁系列订单总量  
            for (const group in groupedProducts) {
                const totalAmount = groupedProducts[group].reduce((sum, product) => {
                    // 只有 product_class_pname 为椰子汁系列才加  
                    return product.product_class_pname === "椰子汁系列"
                        ? sum + Number(product.order_amount)  // 确保 order_amount 为数字  
                        : sum;
                }, 0);

                // 将总量赋值给每个相关对象的 yzztotal 属性  
                groupedProducts[group].forEach(product => {
                    product.yzztotal = totalAmount / 10000 || 0; // 确保默认为 0  
                });
            }

            // 将分组结果转换回一个数组  
            return Object.values(groupedProducts).flat();
        },
        //去重
        uniqueByDqnameAndClass(products) {
            const seen = new Set(); // 用于存储唯一的组合作为标识  
            const uniqueProducts = products.reduce((acc, product) => {
                // 构造唯一键  
                const key = `${product.dqname}-${product.ocustomerClass_name}`;
                if (!seen.has(key)) {
                    seen.add(key); // 添加到 Set  
                    acc.push(product); // 将未重复的对象推入结果数组  
                }
                return acc;
            }, []);
            return uniqueProducts; // 返回去重后的数组  
        },
        updateArrayWithTotals(uniqueProducts, updatedArray) {
            // 遍历 uniqueProducts 数组  
            uniqueProducts.forEach(product => {
                // 在 updatedArray 中查找匹配的对象  
                const matchedItem = updatedArray.find(item =>
                    item.orgdqname === product.dqname && item.orgname === product.ocustomerClass_name
                );

                // 如果找到了匹配项，将 totalorder 和 yzztotal 添加到其中  
                if (matchedItem) {
                    matchedItem.totalorder = product.totalorder.toFixed(2) || 0; // 确保为数字，即使没有数值也设置为 0  
                    matchedItem.yzztotal = product.yzztotal || 0; // 同样确保为数字  
                }
            });
        },
        calculateYzzrate(products) {
            products.forEach(product => {
                // 确保 totalorder 不为 0，避免除以 0 的情况  
                if (product.totalorder > 0) {
                    // 计算 yzzrate，保留两位小数并加上百分号  
                    product.yzzrate = ((product.yzztotal / product.totalorder) * 100).toFixed(2) + '%';
                } else {
                    // 如果 totalorder 为 0，则 yzzrate 可设为 0%  
                    product.yzzrate = '0.00%';
                }
            });
        },
        rankData(data) {
            // 转换 oldrate 为数字并按 orgdqname 分组  
            const groupedData = data.reduce((acc, obj) => {
                const rate1 = parseFloat(obj.oldrate) / 100; // 将 oldrate 转换为数字  
                if (!acc[obj.orgdqname]) {
                    acc[obj.orgdqname] = [];
                }
                acc[obj.orgdqname].push({ ...obj, oldrate1: rate1 });
                return acc;
            }, {});

            // 按 oldrate 排序并添加 Rank  
            const rankedData = [];
            Object.keys(groupedData).forEach(orgdqname => {
                const items = groupedData[orgdqname];
                items.sort((a, b) => b.oldrate1 - a.oldrate1); // 降序排序 oldrate  
                items.forEach((item, index) => {
                    rankedData.push({ ...item, Rank: index + 1 }); // 添加 Rank 字段  
                });
            });

            return rankedData;
        },
        sortAndGroupByFzr(data) {
            // 第一步：按 orgdqname 分组  
            const grouped = data.reduce((acc, curr) => {
                const key = curr.orgdqname;
                if (!acc[key]) {
                    acc[key] = [];
                }
                acc[key].push(curr);
                return acc;
            }, {});

            // 第二步：对每个组内的对象进行排序  
            const sortedData = Object.values(grouped).flatMap(group => {
                return group.sort((a, b) => {
                    // fzr 有值的对象排前面  
                    const aHasFzr = a.fzr ? 1 : 0;
                    const bHasFzr = b.fzr ? 1 : 0;
                    return bHasFzr - aHasFzr; // b - a 为了将有值的排在前面  
                });
            });

            return sortedData;
        },
        filterEmptyFzr(data) {
            // 使用 filter 方法提取 fzr 字段为空的对象  
            const emptyFzrObjects = data.filter(item => !item.fzr);

            return emptyFzrObjects; // 返回新数组  
        },
        removeEmptyFzr(data) {
            // 使用 filter 方法过滤掉 fzr 字段为空的对象  
            const filteredData = data.filter(item => item.fzr);

            return filteredData; // 返回新的数组，包含 fzr 字段不为空的对象  
        },
        getAttribute() {
            api.BdallCustomer(this.dataForm1).then(res => {
                this.AttribList = res
                this.AttribList.forEach(item => {
                    const levels = item.levelName.split(' -> ');
                    item.levelName1 = levels[0] || "";
                    // 去掉 levelName2 中的数字  
                    item.levelName2 = levels[1] ? levels[1].replace(/\d+/g, '').trim() : "";
                    item.levelName3 = levels[2] || "";
                });
                this.AttribList = Array.from(
                    new Map(this.AttribList.map(item => [`${item.levelName1}-${item.levelName2}-${item.levelName3}`, item])).values()
                );

                this.AttribList = this.AttribList.filter(item =>
                    item.def17Name === '集团分公司' || item.def17Name === '集团合资公司'
                );

                console.log(this.AttribList, 'this.AttribList')
                this.getPreDataList()
            })
        },
        getsalseList() {
            api.companysalesApi(this.dataForm).then(res => {
                this.salseList = res
                this.salseList = this.salseList.map(salse => ({
                    cName: salse.cName,
                    dqname: salse.dqname,
                    box: salse.box,
                    fSalePrice: salse.fSalePrice,
                    ocustomerClass_name: salse.ocustomerClass_name,
                    order_amount: salse.order_amount,
                    product_class_pname: salse.product_class_pname
                }))

                const salsetotal = this.addOrderTotal(this.salseList)

                const untotal = this.calculateYzztotal(salsetotal);

                const uniqueProducts = this.uniqueByDqnameAndClass(untotal);

                this.updateArrayWithTotals(uniqueProducts, this.updatedArray);
                this.calculateYzzrate(this.updatedArray);

                this.updatedArray.forEach(item => {
                    const oldrateValue = parseFloat(item.oldrate) / 100 || 0; // 将百分比字符串转换为小数  
                    const oldproductvalueValue = parseFloat(item.oldproductvalue) / 100 || 0; // 将百分比字符串转换为小数  
                    item.oldtite = oldrateValue > oldproductvalueValue ? "达标" : "不达标";

                    const yzzrateValue = parseFloat(item.yzzrate) / 100 || 0;
                    const yezizhiproductValue = parseFloat(item.yezizhiproductvalue) / 100 || 0;
                    item.YZZtite = yzzrateValue > yezizhiproductValue ? "达标" : "不达标";

                    const totalrateValue = parseFloat(item.totalrate) / 100 || 0;
                    const allproductValue = parseFloat(item.allproductvalue) / 100 || 0;

                    item.alltite = totalrateValue > allproductValue ? "达标" : "不达标";

                });

                this.zoneList = [...this.updatedArray]
                //排序添加rank
                // this.zoneList = this.rankData(this.zoneList);
                 //根据战区，把战区内有fzr字段对象的排序到一起
                 this.zoneList = this.sortAndGroupByFzr(this.zoneList);
                //过滤出fzr字段为空的对象，放到数组
                const result = this.filterEmptyFzr(this.zoneList);
                //过滤掉fzr字段为空的对象
                this.zoneList = this.removeEmptyFzr(this.zoneList);

                this.zoneList = [...this.zoneList,...result]
                console.log(result, 'result')

                this.zoneList = this.zoneList.filter(zone =>
                    this.AttribList.some(attrib => attrib.levelName3 === zone.orgname)
                );

                //计算合计对象
                const totals = this.zoneList.reduce((acc, item) => {
                    acc.oldbox1 += Number(item.oldbox1) || 0;
                    acc.oldbox += Number(item.oldbox) || 0;
                    acc.totalorder += Number(item.totalorder) || 0;
                    acc.yzztotal += Number(item.yzztotal) || 0;
                    acc.Mallsum1 += Number(item.Mallsum1) || 0;
                    acc.Mallsum += Number(item.Mallsum) || 0;

                    return acc;
                }, {
                    oldbox1: 0,
                    oldbox: 0,
                    totalorder: 0,
                    yzztotal: 0,
                    Mallsum1: 0,
                    Mallsum: 0
                });

                // 创建合计对象  
                const totalObj = {
                    orgname: "合计",
                    oldbox1: totals.oldbox1.toFixed(2),
                    oldbox: totals.oldbox.toFixed(2),
                    totalorder: totals.totalorder.toFixed(2),
                    yzztotal: totals.yzztotal.toFixed(2),
                    Mallsum1: totals.Mallsum1.toFixed(2),
                    Mallsum: totals.Mallsum.toFixed(2)
                };

                // 计算 oldrate  
                const oldbox = Number(totalObj.oldbox);
                const oldbox1 = Number(totalObj.oldbox1);

                if (oldbox1 > 0) {
                    const oldrate = ((oldbox - oldbox1) / oldbox1 * 100).toFixed(2) + '%';
                    totalObj.oldrate = oldrate;
                } else {
                    totalObj.oldrate = '0.00%';
                }

                // 计算 yzzrate  
                const totalorder = Number(totalObj.totalorder);
                const yzztotal = Number(totalObj.yzztotal);

                if (totalorder > 0) {
                    const yzzrate = ((yzztotal / totalorder) * 100).toFixed(2) + '%';
                    totalObj.yzzrate = yzzrate;
                } else {
                    totalObj.yzzrate = '0.00%';
                }

                // 计算 totalrate  
                const Mallsum = Number(totalObj.Mallsum);
                const Mallsum1 = Number(totalObj.Mallsum1);

                if (Mallsum1 > 0) {
                    const totalrate = (((Mallsum - Mallsum1) / Mallsum1) * 100).toFixed(2) + '%';
                    totalObj.totalrate = totalrate;
                } else {
                    totalObj.totalrate = '0.00%';
                }

                // 将合计对象添加到原数组的末尾  
                this.zoneList.push(totalObj);
               
                //添加总共Rank字段
                this.zoneList.forEach((item, index) => {
                    item.Rank = index + 1; // 从1开始  
                });

                this.dataListLoading = false
                console.log(this.updatedArray, '销售')
            })
        },


        getTaskList() {
            api.CompanyTrackcheckApi(this.taskForm).then(res => {
                this.taskList = res.content
                this.taskList = this.taskList.map(product => ({
                    allproductvalue: product.allproductvalue,
                    fzr: product.fzr,
                    id: product.id,
                    oldproductvalue: product.oldproductvalue,
                    orgdqname: product.orgdqname,
                    orgname: product.orgname,
                    orgsqname: product.orgsqname,
                    userid: product.userid,
                    year: product.year,
                    yezizhiproductvalue: product.yezizhiproductvalue
                }));
                // 对比并累加 oldbox  同期
                this.resultPre.forEach(result => {
                    const task = this.taskList.find(
                        t => t.orgdqname === result.nAME && t.orgname === result.ocustomerClass_name
                    );

                    if (task) {
                        task.oldbox1 = Number(result.oldbox).toFixed(2);
                        task.newbox1 = Number(result.newbox).toFixed(2);
                    }
                });
                // 对比并累加 oldbox  本期
                this.result.forEach(result => {
                    const task = this.taskList.find(
                        t => t.orgdqname === result.nAME && t.orgname === result.ocustomerClass_name
                    );

                    if (task) {
                        task.oldbox = Number(result.oldbox).toFixed(2);
                        task.newbox = Number(result.newbox).toFixed(2);
                    }
                });
                console.log(this.taskList, '计划数据')
                //计算
                this.updatedArray = this.taskList.map(item => {
                    const oldboxValue = Number(item.oldbox) || 0; // 转换为数字  
                    const newboxValue = Number(item.newbox) || 0; // 转换为数字  
                    const Mallsum = oldboxValue + newboxValue;//总计

                    const oldbox1Value = Number(item.oldbox1) || 0; // 转换为数字  
                    const newbox1Value = Number(item.newbox1) || 0; // 转换为数字  
                    const Mallsum1 = oldbox1Value + newbox1Value;//总计



                    const oldrate = (!item.oldbox || !item.oldbox1 || item.oldbox1 === 0)
                        ? '0%'
                        : (((item.oldbox - item.oldbox1) / item.oldbox1) * 100).toFixed(2) + '%';
                    const totalrate = (Mallsum1 > 0 && Mallsum != null) ? (((Mallsum - Mallsum1) / Mallsum1) * 100).toFixed(2) + '%' : '0%';


                    return {
                        ...item, // 保留原来的属性  
                        Mallsum: Mallsum, // 计算并赋值 Mallsum
                        Mallsum1: Mallsum1,
                        oldrate: oldrate,
                        totalrate: totalrate
                    };
                });
                console.log(this.updatedArray, '计划数据结果')
                this.getsalseList()
            })
        },
        getDataList() {
            this.dataListLoading = true
            api.companygoalApi(this.dataForm).then(res => {
                this.dataList = res
                this.convertBoxFields(this.dataList)

                this.result = Object.values(
                    this.dataList.reduce((accumulator, current) => {
                        const key = `${current.ocustomerClass_name}-${current.nAME}`;

                        // 检查累加器中是否已存在该键  
                        if (!accumulator[key]) {
                            accumulator[key] = {
                                ocustomerClass_name: current.ocustomerClass_name,
                                nAME: current.nAME,
                                oldbox: 0,
                                newbox: 0  // 确保 newbox 初始值为 0  
                            };
                        }

                        // 累加 oldbox 和 newbox，确保为 0 如果字段为空或不存在  
                        accumulator[key].oldbox += (current.oldbox || 0);
                        accumulator[key].newbox += (current.newbox || 0);

                        return accumulator;
                    }, {})
                );

                console.log(this.result, '本年同月');
                this.getAttribute()
            })

        },
        //变老新品字段
        convertBoxFields(dataList) {
            dataList.forEach(item => {
                // 检查 attribute 字段并进行相应修改  
                if (typeof item.attribute === 'string') {
                    if (item.attribute.includes('老品')) {
                        item.oldbox = Number(item.box); // 将 box 转换为数字并赋值给 oldbox  
                        delete item.box; // 删除原来的 box 字段  
                    } else if (item.attribute.includes('新品')) {
                        item.newbox = Number(item.box); // 将 box 转换为数字并赋值给 newbox  
                        delete item.box; // 删除原来的 box 字段  
                    }
                }
            });
        },
        getPreDataList() {
            api.companygoalApi(this.dataForm1).then(res => {
                this.dataPreList = res
                this.convertBoxFields(this.dataPreList)

                this.resultPre = Object.values(
                    this.dataPreList.reduce((accumulator, current) => {
                        const key = `${current.ocustomerClass_name}-${current.nAME}`;

                        // 检查累加器中是否已存在该键  
                        if (!accumulator[key]) {
                            accumulator[key] = {
                                ocustomerClass_name: current.ocustomerClass_name,
                                nAME: current.nAME,
                                oldbox: 0,
                                newbox: 0  // 确保 newbox 初始值为 0  
                            };
                        }

                        // 累加 oldbox 和 newbox，确保为 0 如果字段为空或不存在  
                        accumulator[key].oldbox += (current.oldbox || 0);
                        accumulator[key].newbox += (current.newbox || 0);

                        return accumulator;
                    }, {})
                );

                console.log(this.resultPre, '上年同月');
                this.getTaskList()
            })
        },
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                exportExcel(this.zoneList, '全国分公司(对赌)销售跟进表.xlsx')

            })
        },


        //获取时间
        calculateDates() {
            const today = new Date();

            // 获取当前月份的月初时间   
            const startOfMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);
            this.startOfMonth = this.formatDate(startOfMonthDate);

            // 获取截至今天的时间   
            this.endOfToday = this.formatDate(today);
            this.dataForm.p_vouchdatestart = this.startOfMonth;
            this.dataForm.p_vouchdateend = this.endOfToday;

            console.log(this.dataForm.p_vouchdatestart, this.dataForm.p_vouchdateend)

            // 获取当前时间的上一年当前时间  
            const lastYearDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
            this.lastYearDate = this.formatDate(lastYearDate); // 格式化为 YYYY-MM-DD  
            // 获取上一年当前月份的第一天  
            const lastYearStartOfMonthDate = new Date(today.getFullYear() - 1, today.getMonth(), 1);
            this.lastYearStartOfMonth = this.formatDate(lastYearStartOfMonthDate); // 格式化为 YYYY-MM-DD 
            this.dataForm1.p_vouchdatestart = this.lastYearStartOfMonth;
            this.dataForm1.p_vouchdateend = this.lastYearDate;
            // 打印上一年当前时间  
            console.log("上一年当前时间:", this.lastYearDate);
            console.log("上一年当前月份的第一天:", this.lastYearStartOfMonth);

            //获取动态月份
            const selectedDate = new Date(this.dataForm.p_vouchdateend);
            const month = selectedDate.getMonth() + 1; // getMonth() 返回 0-11，因此加 1   
            this.dynamicLabel = `${month}`;
            const day = selectedDate.getDate();
            this.dayLabel = `${day}`;
        },

        formatDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1   
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },
        handleDateChange(newValue) {
            if (newValue) {
                const selectedDate = new Date(newValue);
                const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1   
                // const month = selectedDate.getMonth() + 1; // 获取月份（0-11，需要加 1）
                const year = selectedDate.getFullYear(); // 获取年份 
                const day = selectedDate.getDate(); // 获取日期  
                this.dynamicLabel = `${month}`
                this.dayLabel = `${day}`;
                // 创建该月份的第一天  
                this.firstDayOfMonth = `${year}-${month}-01`
                this.dataForm.p_vouchdatestart = this.firstDayOfMonth

                console.log(this.dataForm.p_vouchdatestart)

                // 假设 获取上一年 
                const p_vouchdateend = this.dataForm.p_vouchdateend;

                // 将字符串转换为 Date 对象  
                const currentDate = new Date(p_vouchdateend);

                // 获取当前年份和月份  
                const currentYear = currentDate.getFullYear();
                const currentMonth = currentDate.getMonth(); // 注意：getMonth() 返回 0-11  

                // 获取上一年当前月份的第一天  
                const firstDayLastYear = new Date(currentYear - 1, currentMonth, 1); // 上一年当前月份的第一天  

                // 获取上一年当前日期  
                const lastYearCurrentDate = new Date(currentYear - 1, currentMonth, currentDate.getDate()); // 上一年当前日期  

                // 获取格式化字符串 
                const formattedFirstDayLastYear = this.formatDate(firstDayLastYear);
                const formattedLastYearCurrentDate = this.formatDate(lastYearCurrentDate); // '2024-01-09'  
                this.dataForm1.p_vouchdatestart = formattedFirstDayLastYear;
                this.dataForm1.p_vouchdateend = formattedLastYearCurrentDate;

                // 输出结果  
                console.log("上一年当前月份的第一天:", formattedFirstDayLastYear); // 输出: 2024-01-01  
                console.log("上一年当前日期:", formattedLastYearCurrentDate); // 输出: 2024-01-09  

                this.updateLabel()
            } else {
                this.firstDayOfMonth = ''; // 如果没有选择日期，重置  
            }
        },



    }
};
</script>

<style scoped lang="scss">
::v-deep .table .el-table__cell {
    padding: 2px !important;

}

;

::v-deep th.el-table__cell>.cell {
    padding: 0px !important;
}

;

::v-deep .el-table__header-wrapper {
    font-size: 13px;
    background: #f5f7fa;
}

::v-deep .el-table th {
    background: #f5f7fa;
}
</style>