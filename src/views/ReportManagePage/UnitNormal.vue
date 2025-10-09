<template>
    <div class='WorkLow'>
        <el-form :inline="true" style="width: 100%; margin: 0 auto;">
            <!-- <el-form-item>
                <el-date-picker v-model="dataForm.p_vouchdatestart" value-format="yyyy-MM-dd" type="date"
                    placeholder="开始日期" clearable style="width: 100%"></el-date-picker>
            </el-form-item> -->
            <el-form-item>
                <el-date-picker v-model="dataForm.p_vouchdateend" value-format="yyyy-MM-dd" type="date" placeholder="日期"
                    clearable style="width: 100%"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-input v-model="bullay" placeholder="模糊查询" clearable @keyup.enter.native="searchEnterFun()"
                    ref="searchInput"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
                    @click="fetchAllData">查询</el-button>
            </el-form-item>
            <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                @click="exportData">导出</el-button>
        </el-form>
        <div class="test">{{ this.labelText }}</div>
        <el-divider></el-divider>
        <el-table border ref="table" v-loading="dataListLoading" height="680" :data="dataList" style="width: 100%;">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="dqname" label="战区" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="companyname" label="单位体" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="companyperson" label="负责人" />
            <el-table-column prop="box" width="80" align="center" label="今日报单(常温系列)" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="yzzgoal" width="150"
                :label="`${month}月目标(椰子汁系列)`" />
            <el-table-column :show-overflow-tooltip="true" width="80" align="center" prop="nomalgoal"
                :label="`${month}月目标(其它常温)`" />
            <el-table-column :show-overflow-tooltip="true" width="80" align="center" prop="otherbox"
                :label="`${month}月目标(常温全品)`">
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" :label="`${month}月累计-常温系列(标准件)`">
                <el-table-column :show-overflow-tooltip="true" align="center" prop="box300" label="300常温">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="box950" label="950常温">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="gzbox" label="果汁系列">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yzbox1l" label="1L椰乳">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yezibox" label="椰子汁系列截止今日累计完成">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" align="center" prop="nomalTemp" label="常温系列截止今日累计完成">
                </el-table-column>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" width="80" align="center" prop="nomaldiff"
                :label="`${month}月差额(常温全品)`">
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="diffyzz" :label="`${month}月差额(光明椰子汁)`">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import {
    exportExcel
} from './UnitNormalExpro.js'
import * as api from '@/api/management/management.js'
export default {
    name: 'WorkLow-page',
    data() {
        return {
            msg: '单位体常温报单进度表',
            dataListLoading: false,
            bullay: '',//查询
            dataList: [],//总数据存储
            lowtempList: [],//今日低温
            LowTempdataList: [],//低温增幅比
            lowtempForm: {
                curdate: ''
            },
            TeamsAnList: [],//班组/单位体数据表
            TeamsAnForm: {
                page: 0,
                size: 2000,
            },
            templookList: [],//look系列累计
            templookForm: {
                startdate: '',
                enddate: ''
            },
            yznomarList: [],
            tempotherList: [],//330-310
            tempyearList: [],//去年同月低温销售数据
            dqdaList: [],
            dataForm: {
                p_vouchdateend: '',
                p_vouchdatestart: '',
            },
            //只允许点击当月
            pickerOptions: {
                disabledDate(time) {
                    const now = new Date();
                    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
                    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                    return time.getTime() < firstDay.getTime() || time.getTime() > lastDay.getTime();
                }
            },
            year: '',//年
            month: '',//月
            day: '',//日
            labelText: ''//抬头标题
        };
    },
    created() {
        this.calculateDates();
    },
    mounted() {
        this.fetchAllData()
    },
    methods: {
        //全部api接口
        async fetchAllData() {
            this.dataListLoading = true;
            this.lowtempForm.curdate = this.dataForm.p_vouchdateend
            this.templookForm.startdate = this.dataForm.p_vouchdatestart
            this.templookForm.enddate = this.dataForm.p_vouchdateend
            const [year, month, day] = this.lowtempForm.curdate.split('-').map(Number);
            this.labelText = `${year}年${month}月单位体常温报单进度表--截止${month}月${day}日`; // 如果没有选择日期，显示默认文本
            try {
                const [lowtempres, TeamsAnres, templookres, tempother, tempyear, LowTempdata, dqdaListres, yznomares] = await Promise.all([
                    api.APIdqnormaltempCHECK(this.lowtempForm),//常温全品
                    api.APIdqnormaltemp300CHECK(this.templookForm),//300常温
                    api.APIdqnormaltemp950CHECK(this.templookForm), //950常温
                    api.APIdqnormaltempcoconutCHECK(this.templookForm),//椰子汁系列常温
                    api.APIdqnormaltempfruitCHECK(this.templookForm),//大区&单位体果汁系列常温
                    api.APIdqnormaltempmilkCHECK(this.templookForm),//单位体1L椰乳常温
                    api.APIdqlowtempallCHECK(),//大区/单位体数据表
                    api.APIMonthGoalCHECK(this.TeamsAnForm)//椰子汁常温目标数据表
                ]);

                // 处理第一个今日常温全品API的响应
                this.lowtempList = lowtempres;
                console.log('常温全品:', this.lowtempList);

                // 处理300常温API的响应
                this.TeamsAnList = TeamsAnres;
                console.log('300常温', this.TeamsAnList)


                // 处理第三个950常温的响应
                this.templookList = templookres
                console.log('950常温:', this.templookList)

                // 处理第四个椰子汁系列常温的响应
                this.tempotherList = tempother
                console.log('椰子汁系列常温:', this.tempotherList)

                // 处理第五个去年单位体果汁系列常温API的响应
                this.tempyearList = tempyear
                console.log('单位体果汁系列常温:', this.tempyearList)

                // 处理第六个1L椰乳常温API的响应
                this.LowTempdataList = LowTempdata
                console.log('1L椰乳常温:', this.LowTempdataList)

                // 处理第七个大区/单位体数据表API的响应
                this.dqdaList = dqdaListres
                this.dqdaList.forEach(item => {
                    if (item.iParentName) { // 检查是否非空（非 null、非 undefined、非空字符串）
                        item.iParentName = item.iParentName.replace(/\d+/g, '');
                    }
                    // 如果为空，则跳过
                });

                // 处理第八个椰子汁常温目标数据表API的响应
                this.yznomarList = yznomares.content

                const dateStr = this.dataForm.p_vouchdateend;
                const dateParts = dateStr.split('-');
                const formattedDate = dateParts[0] + parseInt(dateParts[1]);

                this.yznomarList = this.yznomarList.filter(item => item.months == formattedDate);

                console.log('椰子汁常温目标数据表:', this.yznomarList)



                // 今日大区&单位体负责人数据表与300常温全品匹配
                this.dqdaList = this.dqdaList.map(team => {
                    const matchedItem = this.TeamsAnList.find(item => item.companyid === team.companyid);
                    return {
                        ...team,
                        box300: matchedItem && !isNaN(matchedItem.box) ? parseFloat(matchedItem.box).toFixed(1) : '' // 转为数字并保留一位小数  
                    };
                });
                // 今日大区&单位体负责人数据表与常温匹配
                this.dqdaList = this.dqdaList.map(team => {
                    const matchedItem = this.lowtempList.find(item => item.companyid === team.companyid);
                    return {
                        ...team,
                        box: matchedItem ? matchedItem.box : '' // 添加box字段，如果没匹配则为'''
                    };
                });


                //950常温数据表匹配
                this.dqdaList = this.dqdaList.map(team => {
                    const matchedItem = this.templookList.find(item => item.companyid === team.companyid);
                    return {
                        ...team,
                        box950: matchedItem ? matchedItem.box : '' // 添加box字段，如果没匹配则为'''
                    };
                });

                //椰子汁系列与上一数据表匹配
                this.dqdaList = this.dqdaList.map(team => {
                    const matchedItem = this.tempotherList.find(item => item.companyid === team.companyid);
                    return {
                        ...team,
                        yezibox: matchedItem ? matchedItem.box : '' // 添加box字段，如果没匹配则为'''
                    };
                });

                //单位体果汁系列上一数据表匹配
                this.dqdaList = this.dqdaList.map(team => {
                    const matchedItem = this.tempyearList.find(item => item.companyid === team.companyid);
                    return {
                        ...team,
                        gzbox: matchedItem ? matchedItem.box : '' // 添加box字段，如果没匹配则为'''
                    };
                });
                //1L椰乳常温API的响应与上一数据表匹配
                this.dqdaList = this.dqdaList.map(team => {
                    const matchedItem = this.LowTempdataList.find(item => item.companyid === team.companyid);
                    return {
                        ...team,
                        yzbox1l: matchedItem ? matchedItem.box : '' // 添加box字段，如果没匹配则为'''
                    };
                });
                //椰子汁常温目标数据表API的响应与上一数据表匹配
                this.dqdaList = this.dqdaList.map(team => {
                    const matchedItem = this.yznomarList.find(item => item.companyname === team.companyname);
                    return {
                        ...team,
                        yzzgoal: matchedItem ? matchedItem.yezizhimonthgoal : '', // 添加box字段，如果没匹配则为'''
                        nomalgoal: matchedItem ? matchedItem.othermonthgoal : ''
                    };
                });
                console.log('大区/单位体数据表:', this.dqdaList)

                //计算合计
                const addList = this.addNationalTotal(this.dqdaList)

                //计算大区区域小计
                this.dataList = this.mergeObjectsByTeamsno(this.dqdaList);
                this.dataList.push(...addList);
                this.dataList.forEach(item => {
                    const goal = Number(item.yzzgoal) || 0;
                    const box = Number(item.yezibox) || 0;
                    const nomalgoal = Number(item.nomalgoal) || 0;

                    const box300 = Number(item.box300) || 0;
                    const box950 = Number(item.box950) || 0;
                    const gzbox = Number(item.gzbox) || 0;
                    const yzbox1l = Number(item.yzbox1l) || 0;
                    const yezibox = Number(item.yezibox) || 0;

                    item.diffyzz = parseFloat((goal - box).toFixed(1));
                    item.otherbox = parseFloat((goal + nomalgoal).toFixed(1));
                    item.nomalTemp = parseFloat((box300 + box950 + gzbox + yzbox1l + yezibox).toFixed(1));
                    item.nomaldiff = parseFloat((item.otherbox - item.nomalTemp).toFixed(1));
                });

                //不保留一位小数
                this.dataList = this.dataList.map(item => {
                    const newItem = {};

                    // 遍历对象的每个属性
                    for (const key in item) {
                        if (key === 'companyid' || key === 'companyname'|| key === 'companyperson'|| key === 'dqname'|| key === 'iParentName'|| key === 'dqperson') {
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
        //合计对象
        addNationalTotal(dataList) {
            // 1. 计算所有数值字段的总和
            const total = {
                box: 0,
                box300: 0,
                box950: 0,
                nomalgoal: 0,
                yzbox1l: 0,
                yezibox: 0,
                yzzgoal: 0,
                gzbox: 0
            };

            dataList.forEach(item => {
                total.box += Number(item.box) || 0;
                total.box300 += Number(item.box300) || 0;
                total.box950 += Number(item.box950) || 0;
                total.nomalgoal += Number(item.nomalgoal) || 0;
                total.yzbox1l += Number(item.yzbox1l) || 0;
                total.yezibox += Number(item.yezibox) || 0;
                total.yzzgoal += Number(item.yzzgoal) || 0;
                total.gzbox += Number(item.gzbox) || 0;
            });

            // 2. 创建"全国合计"对象（保留1位小数）
            const nationalTotal = {
                ...Object.fromEntries(
                    Object.entries(total).map(([key, value]) => [
                        key,
                        parseFloat(value.toFixed(1))
                    ])
                ),
                companyname: "全国合计",
                companyperson: ""
            };

            // 3. 返回新数组（不修改原数组）
            return [nationalTotal];
        },
        //区域小计计算
        mergeObjectsByTeamsno(arr) {
            const result = {};
            const groupedMap = {}; // 记录每个 iParentName 的最后位置

            // 1. 先遍历一次，记录每个 iParentName 的最后出现位置
            arr.forEach((obj, index) => {
                groupedMap[obj.iParentName] = index;
            });

            // 2. 合并相同 iParentName 的数据
            arr.forEach(obj => {
                const iParentName = obj.iParentName;
                if (!result[iParentName]) {
                    result[iParentName] = {
                        iParentName: iParentName,
                        companyname: iParentName + '小计',
                        teamsperson: '',
                        box: 0,
                        box300: 0,
                        box950: 0,
                        nomalgoal: 0,
                        yzbox1l: 0,
                        yezibox: 0,
                        yzzgoal: 0,
                        gzbox: 0
                    };
                }
                const target = result[iParentName];
                target.box += Number(obj.box) || 0;
                target.box300 += Number(obj.box300) || 0;
                target.box950 += Number(obj.box950) || 0;
                target.nomalgoal += Number(obj.nomalgoal) || 0;
                target.yzbox1l += Number(obj.yzbox1l) || 0;
                target.yezibox += Number(obj.yezibox) || 0;
                target.yzzgoal += Number(obj.yzzgoal) || 0;
                target.gzbox += Number(obj.gzbox) || 0;
            });

            // 3. 将合并后的数据插入到对应 iParentName 组的末尾位置
            const output = [...arr]; // 复制原数组
            Object.values(result).forEach(mergedItem => {
                const iParentName = mergedItem.iParentName;
                const insertIndex = groupedMap[iParentName] + 1; // 插入到该 iParentName 最后出现的下一个位置
                output.splice(insertIndex, 0, {
                    ...mergedItem,
                    box: parseFloat(mergedItem.box.toFixed(1)),
                    box300: parseFloat(mergedItem.box300.toFixed(1)),
                    box950: parseFloat(mergedItem.box950.toFixed(1)),
                    nomalgoal: parseFloat(mergedItem.nomalgoal.toFixed(1)),
                    yzbox1l: parseFloat(mergedItem.yzbox1l.toFixed(1)),
                    yezibox: parseFloat(mergedItem.yezibox.toFixed(1)),
                    yzzgoal: parseFloat(mergedItem.yzzgoal.toFixed(1)),
                    gzbox: parseFloat(mergedItem.gzbox.toFixed(1))
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
        //获取时间
        calculateDates() {
            const today = new Date();

            // 获取当前月份的月初时间 
            const startOfMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);
            this.startOfMonth = this.formatDate(startOfMonthDate);

            // 获取截至今天的时间 
            this.endOfToday = this.formatDate(today);
            this.dataForm.p_vouchdatestart = this.startOfMonth
            this.dataForm.p_vouchdateend = this.endOfToday

            this.labelText = `${this.year}年${this.month}月单位体常温报单进度表--截止${this.month}月${this.day}日`; // 如果没有选择日期，显示默认文本
        },
        formatDate(date) {
            this.year = date.getFullYear();
            this.month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1 
            this.day = String(date.getDate()).padStart(2, '0');
            return `${this.year}-${this.month}-${this.day}`;
        },
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                exportExcel(this.dataList, this.dataForm.p_vouchdateend, '单位体常温报单进度表.xlsx')

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