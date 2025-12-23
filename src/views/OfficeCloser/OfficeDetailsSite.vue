<template>
    <div class='OfficeDetails'>
        <el-form :inline="true" style="width: 100%; margin: 0 auto;">
            <el-form-item>
                <el-date-picker v-model="dataForm.p_vouchdatestart" value-format="yyyy-MM-dd" type="date"
                    placeholder="开始日期" clearable style="width: 100%"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-date-picker v-model="dataForm.p_vouchdateend" value-format="yyyy-MM-dd" type="date" placeholder="日期"
                    clearable style="width: 100%"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-select style="width: 13rem; " v-model="bullay" filterable placeholder="请选择">
                    <el-option v-for="item in iParentNameList" :key="item.value" :label="item.name"
                        :value="item.name" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input v-model="bullay" placeholder="省区" clearable @keyup.enter.native="searchEnterFun()"
                    ref="searchInput"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
                    @click="getdataList">查询</el-button>
                <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download" v-if="showbutton"
                    @click="exportData">导出</el-button>
                <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
                    @click="getdataListLS">查询历史</el-button>
            </el-form-item>
            <div class="test">{{ this.labelText }}</div>
        </el-form>
        <el-table border ref="table" v-loading="dataListLoading" height="680" :data="currentData" style="width: 100%;">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="iParentName" label="省区" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="ocustomerClass_name" label="单位体" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="cSiteName" label="客户/站点" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="goalnumtotal" width="110"
                label="本月累计基数" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="converBigPiece" :label="`今日完成`">
                <el-table-column :show-overflow-tooltip="true" align="center" prop="looktodaybox" label="look系列">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="today330box" label="330/310">
                </el-table-column>
                <!-- <el-table-column :show-overflow-tooltip="true" align="center" prop="today180box" label="180宴席">
                </el-table-column> -->
                <el-table-column :show-overflow-tooltip="true" align="center" prop="todaylaorubox" label="鲜酪乳">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="todayjianshuangbox" label="活力健爽">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="todayend" label="今日完成">
                </el-table-column>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="daydiff" label="截止今日累计基数">
                <el-table-column :show-overflow-tooltip="true" align="center" prop="lejibox" label="截止今日基数">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="lookleijibox" label="look系列">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="leiji330box" label="330/310">
                </el-table-column>
                <!-- <el-table-column :show-overflow-tooltip="true" align="center" prop="leiji180box" label="180宴席">
                </el-table-column> -->
                <el-table-column :show-overflow-tooltip="true" align="center" prop="leijilaorubox" label="鲜酪乳">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="leijijianshuangbox" label="活力健爽">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="leijiend" label="累计完成">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="leijidiff" width="80"
                    label="持平累计缺口(正为缺口)">
                </el-table-column>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChangeHandle" ref="pagination" @current-change="handleCurrentChange"
            :current-page="currentPage" :page-sizes="[20, 40, 60, 80, 100, 1000]" :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="dataList.length">
        </el-pagination>
    </div>
</template>

<script>
import {
    exportExcel
} from './OfficeDetailsSiteExpro.js'
import * as api from '@/api/frame/customer.js'
export default {
    name: 'OfficeDetails-page',
    data() {
        return {
            msg: 'OfficeDetails-page',
            dataForm: {
                p_vouchdatestart: '',
                p_vouchdateend: ''
            },
            yearForm: {
                p_vouchdatestart: '',
                p_vouchdateend: ''
            },
            orderForm: {
                p_vouchdatestart: '',
                p_vouchdateend: ''
            },
            dataListLoading: false,
            currentData: [],
            currentPage: 1,
            pageSize: 20,
            totalItems: 0,
            labelText: '',
            bullay: '',
            dataList: [],
            ALLList: [],
            bsczdList: [],
            goalList: [],
            yearBipList: [],
            iParentNameList: [],
            showbutton: false,
        };
    },
    created() {
        this.calculateCurrentYearDates();
        // this.calculateLastYearDates()
    },
    mounted() {
        // this.getdataList()
    },
    methods: {

        getdataListLS() {
            this.showbutton = false
            this.dataListLoading = true,
                this.dataList = this.$store.getters.getSiteDataList
            console.log(this.dataList, '111');
            this.dataList = this.dataList.filter(item =>
                (item.iParentName && item.iParentName.includes(this.bullay))
            );
            this.currentData = [...this.dataList]

            this.dataListLoading = false,
                setTimeout(() => {
                    this.showbutton = true
                }, 2000)
            console.log(this.currentData);
        },

        async getdataList() {
            this.dataListLoading = true;
            this.showbutton = false;


            const [year, month, day] = this.dataForm.p_vouchdatestart.split('-').map(Number);
            const [yearend, monthend, dayend] = this.dataForm.p_vouchdateend.split('-').map(Number);

            // 获取去年，不需要判断
            const endDate = new Date(this.dataForm.p_vouchdateend);
            endDate.setFullYear(endDate.getFullYear() - 1);
            this.yearForm.p_vouchdateend = endDate.toISOString().split('T')[0];

            const startDate = new Date(this.dataForm.p_vouchdatestart);
            startDate.setFullYear(startDate.getFullYear() - 1);
            this.yearForm.p_vouchdatestart = startDate.toISOString().split('T')[0];
            console.log(this.yearForm, 999)



            this.labelText = `${year}年${month}.${day}—${monthend}.${dayend}${this.bullay || '全部'}客户 完成进度---截至到(${monthend}/${dayend})`;

            try {
                const [oerdebip, goal, yearBip] = await Promise.all([
                    api.companyorderBip(this.dataForm),
                    api.MagSiteorderdata(this.orderForm),
                    api.companyorderBip(this.yearForm)
                ]);
                //第一个接口
                this.dataList = oerdebip
                console.log(this.dataList, 'this.dataList')

                this.iParentNameList = [...new Set(
                    this.dataList.map(item =>
                        item.iParentName ? item.iParentName.replace(/\d+/g, '') : null
                    )
                )]
                    .filter(Boolean) // 过滤掉 null/undefined/空字符串
                    .map((name, index) => ({
                        name: name,
                        value: index + 1 // 生成唯一数字（从1开始）
                    }));
                console.log(this.iParentNameList, 'this.iParentNameList')

                //处理第二个接口
                this.goalList = goal
                console.log(this.goalList, 'this.goalList')

                //处理第三个接口
                this.yearBipList = yearBip
                console.log(this.yearBipList, '123456')
                this.yearBipList = this.yearBipList.map(item => {
                    // 1. 计算今日完成
                    const lejibox = (Number(item.leiji180box) || 0) + (Number(item.leiji330box) || 0) + (Number(item.lookleijibox) || 0);

                    return {
                        ...item,
                        lejibox
                    };
                });
                console.log(this.yearBipList, 'this.yearBipList')

                this.dataList = this.dataList.map(dataItem => {
                    const matchedUniqueItem = this.yearBipList.find(uniqueItem => uniqueItem.cSiteName == dataItem.cSiteName);
                    if (matchedUniqueItem) {
                        return { ...dataItem, lejibox: matchedUniqueItem.lejibox, }; // 合并字段(不修改原对象)
                    }
                    return dataItem; // 无匹配则返回原对象
                });


                this.dataList = this.dataList.map(dataItem => {
                    const matchedUniqueItem = this.goalList.find(uniqueItem => uniqueItem.sitename == dataItem.cSiteName);
                    if (matchedUniqueItem) {
                        return { ...dataItem, goalnumtotal: matchedUniqueItem.leijiboxhistory, }; // 合并字段（不修改原对象）
                    }
                    return dataItem; // 无匹配则返回原对象
                });
                console.log(this.dataList, 'his.dataList')
                this.dataList = this.dataList.map(item => {
                    // 1. 计算今日完成
                    const todayend = (Number(item.today180box) || 0) + (Number(item.today330box) || 0) + (Number(item.looktodaybox) || 0) + (Number(item.todayjianshuangbox) || 0) + (Number(item.todaylaorubox) || 0);

                    const leijiend = (Number(item.leiji180box) || 0) + (Number(item.leiji330box) || 0) + (Number(item.lookleijibox) || 0) + (Number(item.leijilaorubox) || 0) + (Number(item.leijijianshuangbox) || 0);//累计完成

                    const leijidiff = (Number(item.lejibox) || 0) - (Number(leijiend) || 0)//累计差额

                    return {
                        ...item,
                        todayend,
                        leijiend,
                        leijidiff
                    };
                });
                this.dataList.forEach(item => {
                    item.looktodaybox = parseInt(item.looktodaybox) || '';
                    item.today330box = parseInt(item.today330box) || '';
                    item.today180box = parseInt(item.today180box) || '';
                    item.lookleijibox = parseInt(item.lookleijibox) || '';
                    item.leiji330box = parseInt(item.leiji330box) || '';
                    item.leiji180box = parseInt(item.leiji180box) || '';

                    item.todayjianshuangbox = parseInt(item.todayjianshuangbox) || '';
                    item.todaylaorubox = parseInt(item.todaylaorubox) || '';
                    item.leijijianshuangbox = parseInt(item.leijijianshuangbox) || '';
                    item.leijilaorubox = parseInt(item.leijilaorubox) || '';
                });
                this.dataList = this.dataList.map(item => {
                    // 如果 iParentName 不存在或为空，直接返回原对象
                    if (!item.iParentName) {
                        return item;
                    }
                    // 否则去除数字
                    return {
                        ...item,
                        iParentName: item.iParentName.replace(/\d+/g, ''),
                        goalnumtotal: Number(item.goalnumtotal) || ''
                    };
                });
                this.dataList = this.dataList.filter(item =>
                    (item.iParentName && item.iParentName.includes(this.bullay))
                );
                //排序
                this.dataList = this.groupByCustomerClass(this.dataList);
                //计算单位体合计
                this.dataList = this.ocustomerClassObject(this.dataList);
                // //计算省区合计
                this.dataList = this.iParentNameyObject(this.dataList);
                // //计算合计
                this.dataList = this.addSummaryObject(this.dataList);

                this.dataList = this.dataList.map(item => {
                    if (
                        item.ocustomerClass_name.includes("小计") ||  //包含"小计"
                        item.ocustomerClass_name.includes("合计") &&
                        item.goalnumtotal != null  //不为 null 或 undefined
                    ) {
                        return {
                            ...item,  //保留其他字段
                            goalnumtotal: String(item.goalnumtotal)  // 转为字符串
                        };
                    }
                    return item;  //不满足条件的对象保持不变
                });

                this.dataList = this.dataList.filter(obj => {
                    return obj.leijiend; //会过滤掉所有假值
                });
                console.log(this.dataList, 'this.dataList112255')
                this.dataList = this.dataList.map(item => ({
                    ...item,           // 保留其他属性
                    goalnumtotal: '',  // 覆盖这两个字段
                    lejibox: '',
                    leijidiff: ''
                }));
                this.currentData = {
                    ...this.dataList
                };
                this.$store.commit('officeSite/SET_DATA_LIST', this.dataList)
                this.sizeChangeHandle(this.pageSize);
                this.showbutton = true;
                console.log(this.dataList, ' this.dataList')

            } catch (error) {
                console.error("获取数据时出错:", error);
                // 可以在这里添加错误提示
                this.$message.error('数据加载失败，请重试');
            } finally {
                this.dataListLoading = false; // 确保无论成功失败都会重置加载状态

            }
        },

        groupByCustomerClass(array) {
            return array.sort((a, b) => {
                // 检查是否是 "合计"
                const isATotal = a.ocustomerClass_name === "合计";
                const isBTotal = b.ocustomerClass_name === "合计";

                // 如果 a 是 "合计"，则 a 排在后面
                if (isATotal) return 1;
                // 如果 b 是 "合计"，则 b 排在后面
                if (isBTotal) return -1;

                // 先按 iParentName 排序
                const parentA = a.iParentName || '';
                const parentB = b.iParentName || '';
                if (parentA < parentB) return -1;
                if (parentA > parentB) return 1;

                // 如果 iParentName 相同，再按 ocustomerClass_name 排序
                const classA = a.ocustomerClass_name || '';
                const classB = b.ocustomerClass_name || '';
                return classA.localeCompare(classB);
            });
        },
        //计算合计
        addSummaryObject(array) {
            // 定义需要求和的字段
            const sumFields = [
                'goalnumtotal', 'goalnum', 'looktodaybox', 'today330box', 'today180box',
                'todayend', 'todaydiff', 'ordersnumStage', 'lookleijibox', 'leiji330box',
                'leiji180box', 'leijiend', 'leijidiff', 'lejibox', 'todayjianshuangbox', 'todaylaorubox', 'leijijianshuangbox', 'leijilaorubox'
            ];

            // 创建合计对象，初始化字段为0
            const summary = {
                ocustomerClass_name: '合计'
            };

            // 初始化所有求和字段为0
            sumFields.forEach(field => {
                summary[field] = 0;
            });

            // 过滤掉ocustomerClass_name包含"小计"或"合计"的对象
            const filteredArray = array.filter(item => {
                const name = item.ocustomerClass_name || '';
                return !name.includes('小计') && !name.includes('合计');
            });

            // 遍历过滤后的数组中的每个对象，累加指定字段的值
            filteredArray.forEach(item => {
                sumFields.forEach(field => {
                    // 将字段值转为数字（如果无法转换则为0），然后累加
                    const value = parseFloat(item[field]) || 0;
                    summary[field] += value;
                });
            });

            // 将合计对象添加到数组最后
            array.push(summary);

            return array;
        },

        //省区计算合计
        iParentNameyObject(array) {
            // 定义需要求和的字段
            const sumFields = [
                'goalnumtotal', 'goalnum', 'looktodaybox', 'today330box', 'today180box',
                'todayend', 'todaydiff', 'ordersnumStage', 'lookleijibox', 'leiji330box',
                'leiji180box', 'leijiend', 'leijidiff', 'lejibox', 'todayjianshuangbox', 'todaylaorubox', 'leijijianshuangbox', 'leijilaorubox'
            ];

            // 按 iParentName 分组（忽略空值）
            const grouped = {};

            array.forEach(item => {
                const key = item.iParentName;
                if (!grouped[key]) {
                    grouped[key] = [];
                }
                grouped[key].push(item);
            });

            // 最终结果数组
            const result = [];

            // 1. 处理有分组的项
            Object.keys(grouped).forEach(key => {
                // 先添加原始数据（包括"小计"项）
                result.push(...grouped[key]);

                // 计算当前分组合计（排除"小计"项）
                const summary = {
                    ocustomerClass_name: `${key}合计`,
                    iParentName: key
                };

                // 初始化并累加（过滤掉包含"小计"的对象）
                sumFields.forEach(field => {
                    summary[field] = grouped[key].reduce((sum, item) => {
                        // 如果ocustomerClass_name包含"小计"，则不参与求和
                        if (item.ocustomerClass_name && item.ocustomerClass_name.includes('小计')) {
                            return sum;
                        }
                        return sum + (parseFloat(item[field]) || 0);
                    }, 0);
                });

                // 添加合计对象
                result.push(summary);
            });

            return result;
        },
        //单位体计算小计
        ocustomerClassObject(array) {
            // 定义需要求和的字段
            const sumFields = [
                'goalnumtotal', 'goalnum', 'looktodaybox', 'today330box', 'today180box',
                'todayend', 'todaydiff', 'ordersnumStage', 'lookleijibox', 'leiji330box',
                'leiji180box', 'leijiend', 'leijidiff', 'lejibox', 'todayjianshuangbox', 'todaylaorubox', 'leijijianshuangbox', 'leijilaorubox'
            ];

            // 按 ocustomerClass_name 分组（忽略已合计项）
            const grouped = {};

            array.forEach(item => {

                const key = item.ocustomerClass_name || '未分组';
                if (!grouped[key]) {
                    grouped[key] = [];
                }
                grouped[key].push(item);
            });

            // 对每个分组计算合计
            const result = [];

            // 1. 先处理有分组的项
            Object.keys(grouped).forEach(key => {
                // 添加原始数据
                result.push(...grouped[key]);

                // 计算当前分组合计
                const summary = {
                    ocustomerClass_name: `${key}小计`,
                    iParentName: (grouped[key][0] && grouped[key][0].iParentName) ? grouped[key][0].iParentName : ''
                };

                // 初始化并累加（过滤掉包含"小计"的对象）
                sumFields.forEach(field => {
                    summary[field] = grouped[key].reduce((sum, item) => {
                        // 如果ocustomerClass_name包含"小计"，则不参与求和
                        if (item.ocustomerClass_name && item.ocustomerClass_name.includes('小计')) {
                            return sum;
                        }
                        return sum + (parseFloat(item[field]) || 0);
                    }, 0);
                });
                // 添加合计对象
                result.push(summary);
            });
            return result;
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
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                exportExcel(this.dataList, this.dataForm.p_vouchdatestart, this.dataForm.p_vouchdateend, this.bullay, '办事处售销完成进度明细表.xlsx')
            })
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
            this.dataForm.p_vouchdateend = this.endOfToday;

            this.orderForm.p_vouchdatestart = this.startOfMonth;
            this.orderForm.p_vouchdateend = this.endOfMonth;
            console.log(this.orderForm.p_vouchdateend)

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