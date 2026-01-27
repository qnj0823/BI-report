<template>
    <div class='plan'>
        <el-form :inline="true" style="width:75%; margin: 0 auto;">
            <el-form-item>
                <el-date-picker v-model="dataForm.p_vouchdatestart" value-format="yyyy-MM-dd" type="date"
                    placeholder="开始日期" clearable style="width: 100%"></el-date-picker>
            </el-form-item>
            <!-- <el-form-item>
                <el-date-picker v-model="dataForm.p_vouchdateend" value-format="yyyy-MM-dd" type="date"
                    placeholder="结束日期" clearable style="width: 100%"></el-date-picker>
            </el-form-item> -->
            <el-form-item>
                <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
                    @click="getDataList">查询</el-button>
            </el-form-item>
            <!-- <el-form-item>
               <el-input v-model="bullay" placeholder="模糊搜索" clearable @keyup.enter.native="searchEnterFun()"
                   ref="searchInput"></el-input>
           </el-form-item> -->
            <el-form-item>
                <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                    @click="exportData">导出</el-button>
            </el-form-item>
        </el-form>
        <el-table class="table" ref="table" :data="dataList" v-loading="dataListLoading"
            :row-class-name="tableRowClassName" style="width: 75%; margin: 0 auto; margin-bottom: 50px;">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="areaname" label="省区" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="piece" label="销售总计划" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="factory" label="供应链" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="xnl" label="鲜露乳" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="js" label="健爽" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="yznr" label="330/310" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="qxhl200" label="200清新活力" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="qxhl450" label="450清新活力" />
        </el-table>
    </div>
</template>

<script>

import * as api from '@/api/Business/analysis.js'

import {
    exportExcel
} from './proAreaDataExpro.js'

export default {
    name: 'proAreaData-page',
    data() {
        return {
            msg: 'proAreaData-page',
            dataListLoading: false,
            addOrUpdateVisible: false,
            dataList: [],
            monthSumList: [],
            editList: [],
            factoryList: [
                { province: "广东省", factory: "广州工厂" },
                { province: "广西壮族自治区", factory: "广州工厂" },
                { province: "湖南省", factory: "望城工厂" },
                { province: "四川省", factory: "成都工厂" },
                { province: "重庆市", factory: "成都工厂" },
                { province: "云南省", factory: "成都工厂" },
                { province: "贵州省", factory: "成都工厂" },
                { province: "西藏自治区", factory: "成都工厂" },
                { province: "浙江省", factory: "金华工厂" },
                { province: "上海市", factory: "金华工厂" },
                { province: "福建省", factory: "金华工厂" },
                { province: "江西省", factory: "武汉工厂" },
                { province: "湖北省", factory: "武汉工厂" },
                { province: "河南省", factory: "武汉工厂" },
                { province: "山西省", factory: "武汉工厂" },
                { province: "陕西省", factory: "武汉工厂" },
                { province: "安徽省", factory: "武汉工厂" },
                { province: "天津市", factory: "武汉工厂" },
                { province: "北京市", factory: "武汉工厂" },
                { province: "山西省", factory: "武汉工厂" },
                { province: "江苏省", factory: "" },
                { province: "山东省", factory: "射阳工厂" },
                { province: "海南省", factory: "海南工厂" },
                { province: "海南look常温", factory: "海南工厂" },
                { province: "海南look椰汁", factory: "海南工厂" },
                { province: "海南look果汁", factory: "海南工厂" }
            ],

            dataForm: {
                p_vouchdatestart: '',
                p_vouchdateend: ''
            },
            editForm: {
                page: 0,
                size: 500,
            },
            startOfMonth: '',
            endOfToday: '',
        };
    },
    created() {
        this.calculateDates();
    },
    mounted() {
        this.getDataList()
    },
    methods: {
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                exportExcel(this.dataList, 'LOOK屋顶每日报单计划.xlsx')
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
            this.dataForm.p_vouchdatestart = this.endOfToday
            this.dataForm.p_vouchdateend = this.endOfToday
        },
        formatDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },
        // 新增 / 修改
        addOrUpdateHandle(id, data) {
            this.addOrUpdateVisible = true
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(id, data)
            })
        },
        async getDataList() {
            this.dataListLoading = true
            this.dataForm.p_vouchdateend = this.dataForm.p_vouchdatestart

            // api.GetareaDataAPi(this.dataForm).then(res => {
            //     this.dataList = res
            //     this.dataList = this.addMultipleFieldsAndRemoveSource(this.dataList)
            //     this.factoryList = this.updateFactoryByCycle(this.factoryList)
            //     console.log(this.factoryList, ' this.factoryList')
            //     this.dataList = this.mergeFactoryData(this.dataList, this.factoryList)
            //     // this.dataList = this.dataList.filter(item => item.areaname);
            //     this.dataList = this.dataList.map(item => {
            //         // 如果没有areaname字段，或者areaname为空值
            //         if (!item.hasOwnProperty('areaname') || !item.areaname) {
            //             return { ...item, areaname: "其它" };
            //         }
            //         return item;
            //     });
            //     this.dataList = this.sortByCustomOrder(this.dataList)
            //     // 添加工厂总计行
            //     this.dataList = this.addFactoryTotals(this.dataList);
            //     this.dataList = this.addFactoryMonthTotals(this.dataList);
            //     this.dataListLoading = false
            //     console.log(this.dataList)
            // })


            this.dataListLoading = true

            // 1. 同步等待API数据
            const res = await api.GetareaDataAPi(this.dataForm)
            const res1 = await api.GetareaDataAPi({
                p_vouchdatestart: this.startOfMonth,
                p_vouchdateend: this.endOfToday
            })
            // 2. 同步处理数据
            this.dataList = res
            this.dataList = this.addMultipleFieldsAndRemoveSource(this.dataList)

            this.monthSumList = res1
            this.monthSumList = this.addMultipleFieldsAndRemoveSource(this.monthSumList)


            // 3. 同步更新工厂列表
            this.factoryList = this.updateFactoryByCycle(this.factoryList)
            console.log(this.factoryList, ' this.factoryList')

            // 4. 合并数据
            this.dataList = this.mergeFactoryData(this.dataList, this.factoryList)

            this.monthSumList = this.mergeFactoryData(this.monthSumList, this.factoryList)

            // 5. 处理空值
            this.dataList = this.dataList.map(item => {
                if (!item.hasOwnProperty('areaname') || !item.areaname) {
                    return { ...item, areaname: "其它" }
                }
                return item
            })

            this.monthSumList = this.monthSumList.map(item => {
                if (!item.hasOwnProperty('areaname') || !item.areaname) {
                    return { ...item, areaname: "其它" }
                }
                return item
            })

            // 6. 排序
            this.dataList = this.sortByCustomOrder(this.dataList)
            this.monthSumList = this.sortByCustomOrder(this.monthSumList)


            // 7. 添加总计
            this.dataList = this.addFactoryTotals(this.dataList)
            this.monthSumList = this.addFactoryMonthTotals(this.monthSumList)
            this.dataList = this.insertBothMonthlyTotals(this.monthSumList, this.dataList)
            console.log(this.dataList, this.monthSumList);

            this.dataListLoading = false
            console.log(this.dataList)

        },
        addMultipleFieldsAndRemoveSource(dataArray) {
            const result = JSON.parse(JSON.stringify(dataArray));

            // 定义源区域和对应的目标字段名映射
            const fieldMapping = {
                "鲜露乳": "xnl",
                "健爽": "js",
                "330/310": "yznr",
                "清新活力200": "qxhl200",
                "清新活力450": "qxhl450"
            };

            // 为广东对象添加各个字段
            const guangdongItem = result.find(item => item.areaname === "广东省");

            if (guangdongItem) {
                // 遍历映射关系，为每个源区域添加对应的字段
                Object.entries(fieldMapping).forEach(([sourceArea, fieldName]) => {
                    const sourceItem = result.find(item => item.areaname === sourceArea);
                    if (sourceItem && sourceItem.piece) {
                        guangdongItem[fieldName] = sourceItem.piece;
                    }
                });
            }

            // 删除源对象
            const sourceAreas = Object.keys(fieldMapping);
            return result.filter(item => !sourceAreas.includes(item.areaname));
        },
        sortByCustomOrder(dataArray) {
            // 定义排序顺序
            const customOrder = [
                "广东省", "广西壮族自治区", "湖南省", "四川省", "重庆市",
                "云南省", "贵州省", "西藏自治区", "浙江省", "上海市",
                "福建省", "江西省", "湖北省", "河南省", "山西省",
                "陕西省", "安徽省", "天津市", "北京市", "山西省",
                "江苏省", "山东省", "海南省", "海南look常温",
                "海南look椰汁", "海南look果汁", "其它"
            ];

            // 深拷贝数组
            const result = JSON.parse(JSON.stringify(dataArray));

            // 按照自定义顺序排序
            result.sort((a, b) => {
                const indexA = customOrder.indexOf(a.areaname);
                const indexB = customOrder.indexOf(b.areaname);

                // 如果都在排序列表中，按照列表顺序排序
                if (indexA !== -1 && indexB !== -1) {
                    return indexA - indexB;
                }
                // 如果a在列表中，b不在，a排在前面
                else if (indexA !== -1) {
                    return -1;
                }
                // 如果b在列表中，a不在，b排在前面
                else if (indexB !== -1) {
                    return 1;
                }
                // 如果都不在列表中，保持原顺序（或者按其他规则排序）
                else {
                    return 0;
                }
            });

            return result;
        },
        mergeFactoryData(dataList, factoryList) {
            // 深拷贝数组，避免修改原数组
            const result = JSON.parse(JSON.stringify(dataList));
            const factoryMap = JSON.parse(JSON.stringify(factoryList));

            // 创建 factoryList 的映射表，便于快速查找
            const factoryMapping = {};
            factoryMap.forEach(item => {
                factoryMapping[item.province] = item.factory;
            });

            // 遍历 dataList，匹配并添加 factory 字段
            result.forEach(item => {
                if (item.areaname && factoryMapping[item.areaname]) {
                    item.factory = factoryMapping[item.areaname];
                }
            });

            return result;
        },
        updateFactoryByCycle(factoryList, baseDate1 = '2025-10-16', factory1 = '射阳工厂', baseDate2 = '2025-10-18', factory2 = '金华工厂') {
            const result = JSON.parse(JSON.stringify(factoryList));

            // 获取当前时间
            const currentDate = new Date(this.dataForm.p_vouchdatestart);
            const baseDate1Obj = new Date(baseDate1);
            const baseDate2Obj = new Date(baseDate2);

            // 计算与两个基准时间的天数差
            const diff1 = Math.floor((currentDate - baseDate1Obj) / (1000 * 60 * 60 * 24));
            const diff2 = Math.floor((currentDate - baseDate2Obj) / (1000 * 60 * 60 * 24));

            console.log(`当前时间与 ${baseDate1} 相差 ${diff1} 天`);
            console.log(`当前时间与 ${baseDate2} 相差 ${diff2} 天`);

            let targetFactory = null;

            // 检查是否是4的倍数
            if (diff1 % 4 === 0 && diff1 >= 0) {
                targetFactory = factory1;
                console.log(`与 ${baseDate1} 相差 ${diff1} 天是4的倍数,使用 ${factory1}`);
            }

            if (diff2 % 4 === 0 && diff2 >= 0) {
                targetFactory = factory2;
                console.log(`与 ${baseDate2} 相差 ${diff2} 天是4的倍数,使用 ${factory2}`);
            }

            // 如果两个条件都满足，后面的覆盖前面的
            if (targetFactory) {
                // 更新江苏省的 factory 字段
                result.forEach(item => {
                    if (item.province === '江苏省') {
                        item.factory = targetFactory;
                    }
                });
            }

            return result; // 直接返回数组对象
        },
        addFactoryTotals(dataList) {
            // 深拷贝数组，避免修改原数组
            const result = JSON.parse(JSON.stringify(dataList));

            // 计算光明工厂总计（除了海南工厂的所有数据）
            let guangmingTotal = {
                areaname: '光明工厂每日总计',
                factory: '',
                piece: 0,
                xnl: 0,
                js: 0,
                yznr: 0,
                isTotal: true // 标记为总计行
            };

            // 计算海南工厂总计
            let hainanTotal = {
                areaname: '海南工厂每日总计',
                factory: '',
                piece: 0,
                xnl: 0,
                js: 0,
                yznr: 0,
                isTotal: true // 标记为总计行
            };

            // 遍历数据进行分类汇总
            result.forEach(item => {
                const piece = Number(item.piece) || 0;
                const xnl = Number(item.xnl) || 0;
                const js = Number(item.js) || 0;
                const yznr = Number(item.yznr) || 0;

                if (item.factory === '海南工厂') {
                    // 海南工厂的数据
                    hainanTotal.piece += piece;
                    hainanTotal.xnl += xnl;
                    hainanTotal.js += js;
                    hainanTotal.yznr += yznr;
                } else {
                    // 其他工厂的数据归入光明工厂总计
                    guangmingTotal.piece += piece;
                    guangmingTotal.xnl += xnl;
                    guangmingTotal.js += js;
                    guangmingTotal.yznr += yznr;
                }
            });

            // 查找"海南look常温"行的索引
            const hainanLookIndex = result.findIndex(item => item.areaname === '海南look常温');

            if (hainanLookIndex !== -1) {
                // 在"海南look常温"行前面插入"光明工厂总计"
                result.splice(hainanLookIndex, 0, guangmingTotal);
            } else {
                // 如果找不到"海南look常温"，则将"光明工厂总计"添加到末尾
                result.push(guangmingTotal);
            }

            // "海南工厂总计"始终放在最后
            result.push(hainanTotal);

            return result;
        },
        addFactoryMonthTotals(dataList) {
            // 深拷贝数组，避免修改原数组
            const result = JSON.parse(JSON.stringify(dataList));

            // 计算光明工厂总计（除了海南工厂的所有数据）
            let guangmingTotal = {
                areaname: '光明工厂月度总计',
                factory: '',
                piece: 0,
                xnl: 0,
                js: 0,
                yznr: 0,
                isTotal: true // 标记为总计行
            };

            // 计算海南工厂总计
            let hainanTotal = {
                areaname: '海南工厂月度总计',
                factory: '',
                piece: 0,
                xnl: 0,
                js: 0,
                yznr: 0,
                isTotal: true // 标记为总计行
            };

            // 遍历数据进行分类汇总
            result.forEach(item => {
                const piece = Number(item.piece) || 0;
                const xnl = Number(item.xnl) || 0;
                const js = Number(item.js) || 0;
                const yznr = Number(item.yznr) || 0;

                if (item.factory === '海南工厂') {
                    // 海南工厂的数据
                    hainanTotal.piece += piece;
                    hainanTotal.xnl += xnl;
                    hainanTotal.js += js;
                    hainanTotal.yznr += yznr;
                } else if (item.factory != '海南工厂' && item.areaname != '光明工厂总计' && item.areaname != '海南工厂总计') {
                    // 其他工厂的数据归入光明工厂总计
                    guangmingTotal.piece += piece;
                    guangmingTotal.xnl += xnl;
                    guangmingTotal.js += js;
                    guangmingTotal.yznr += yznr;
                }
            });

            // 查找"海南look常温"行的索引
            const hainanLookIndex = result.findIndex(item => item.areaname === '海南look常温');

            if (hainanLookIndex !== -1) {
                // 在"海南look常温"行前面插入"光明工厂月度总计"
                result.splice(hainanLookIndex, 0, guangmingTotal);
            } else {
                // 如果找不到"海南look常温"，则将"光明工厂总计"添加到末尾
                result.push(guangmingTotal);
            }

            // "海南工厂总计"始终放在最后
            result.push(hainanTotal);

            return result;
        },

        insertBothMonthlyTotals(source, target) {
            // 创建目标数组的深拷贝
            let result = JSON.parse(JSON.stringify(target));

            // 1. 从源数组中提取两个月度总计
            const brightMonthly = source.find(item =>
                item.areaname === "光明工厂月度总计"
            );

            const hainanMonthly = source.find(item =>
                item.areaname === "海南工厂月度总计"
            );

            if (!brightMonthly) {
                console.warn("未找到'光明工厂月度总计'");
            }

            if (!hainanMonthly) {
                console.warn("未找到'海南工厂月度总计'");
            }

            // 2. 先插入光明工厂月度总计
            if (brightMonthly) {
                const brightTotalIndex = result.findIndex(item =>
                    item.areaname === "光明工厂每日总计"
                );

                if (brightTotalIndex !== -1) {
                    // 在光明工厂总计后面插入光明工厂月度总计
                    result.splice(brightTotalIndex + 1, 0, { ...brightMonthly });
                    console.log("已插入'光明工厂月度总计'");
                } else {
                    console.warn("未找到'光明工厂每日总计'，无法插入月度总计");
                }
            }

            // 3. 再插入海南工厂月度总计
            if (hainanMonthly) {
                const hainanTotalIndex = result.findIndex(item =>
                    item.areaname === "海南工厂每日总计"
                );

                if (hainanTotalIndex !== -1) {
                    // 在海南工厂总计后面插入海南工厂月度总计
                    // 注意：因为上面可能已经插入了一个元素，所以索引可能变化
                    const currentHainanIndex = result.findIndex(item =>
                        item.areaname === "海南工厂每日总计"
                    );
                    if (currentHainanIndex !== -1) {
                        result.splice(currentHainanIndex + 1, 0, { ...hainanMonthly });
                        console.log("已插入'海南工厂月度总计'");
                    }
                } else {
                    console.warn("未找到'海南工厂每日总计'，无法插入月度总计");
                }
            }

            return result;
        },

        tableRowClassName({ row, rowIndex }) {
            // 为总计行添加特殊样式类名
            if (row.isTotal) {
                return 'total-row';
            }
            return '';
        }
    }
};
</script>

<style scoped lang="scss">
// 总计行样式
::v-deep .total-row {
    font-weight: bold;
}
</style>