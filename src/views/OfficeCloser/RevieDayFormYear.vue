<template>
    <div class='RevieDayFormYear'>
        <el-form :inline="true" style="margin: 0 auto;">
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
            style=" margin: 0 auto; margin-bottom: 50px;">
            <el-table-column fixed :show-overflow-tooltip="true" width="140" align="center" prop="dqname" label="战区" />
            <el-table-column fixed :show-overflow-tooltip="true" align="center" prop="sqname" label="省区" />
            <el-table-column fixed :show-overflow-tooltip="true" width="140" align="center" prop="companyname"
                label="分公司/办事处" />
            <el-table-column fixed :show-overflow-tooltip="true" align="center" width="200" prop="cname"
                label="客户营业执照" />
            <el-table-column fixed :show-overflow-tooltip="true" align="center" width="200" prop="ccitename"
                label="站点" />
            <el-table-column fixed :show-overflow-tooltip="true" align="center" width="150" prop="vouchdate"
                label="报单日期" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100001" label="大原味" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100002" label="小原味" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100008" label="优选原味" />
            <el-table-column :show-overflow-tooltip="true" align="center" width="140" prop="box1520100020"
                label="小原味（戴永红定制）" />
            <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="box1520100021"
                label="小原味（绿叶定制）" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100010" label="大白桃" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100009" label="小白桃" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100012" label="大清新" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100011" label="小清新" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100045" label="450清新" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100014" label="大健爽" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100015" label="小健爽" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100017" label="大0糖" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100016" label="小0糖" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100003" label="蓝色健爽" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100004" label="健能" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100007" label="姜黄" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520130001" label="330" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520130003" label="310" />
            <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="box1520100025"
                label="180酸乳酪(白）" />
            <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="box1520100026"
                label="180酸乳酪(红）" />
            <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="box1520100047"
                label="950常温(常规版）" />
            <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="box1520100048"
                label="950常温(宴席版）" />
            <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="box1520100027"
                label="300常温(宴席版）" />
            <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="box1520100028"
                label="300常温(经典版）" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100051" width="120"
                    label="180活力健爽" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100054" width="120"
                    label="455活力健爽" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100052" width="120"
                    label="200鲜酪乳" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100053" width="120"
                    label="450鲜酪乳" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100030" label="380橙汁" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100029" label="1.35橙汁" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100032" label="380双柚汁" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100031" label="1.35双柚汁" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100040" label="300小青柠汁" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100039" label="900小青柠汁" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100038" label="300苹果汁" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100037" label="900苹果汁" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100036" label="300芒果菠萝汁" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100035" label="900芒果菠萝汁" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520130002" label="1L椰子牛乳" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100034" label="椰子水" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100041" label="245椰子汁" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100042" label="1L椰子汁" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100043" label="300椰子汁" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100044" label="1.25L红瓶椰子汁" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100050" label="1.25L蓝瓶椰子汁" />
            <!-- <el-table-column prop="sum" align="center" label="小计" /> -->
        </el-table>
        <el-pagination @size-change="sizeChangeHandle" ref="pagination" @current-change="handleCurrentChange"
            :current-page="currentPage" :page-sizes="[20, 40, 60, 80, 100, 1000]" :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="results.length">
        </el-pagination>
    </div>
</template>

<script>
import * as api from '@/api/frame/customer.js'
import {
    exportExcel
} from './RevieDayFormYearExpro.js'
export default {
    name: 'RevieDayFormYear-page',
    data() {
        return {
            msg: 'RevieDayFormYear-page',
            dataForm: {
                p_vouchdateend: '',
                p_vouchdatestart: '',
                p_orgname: ''
            },
            currentData: [],
            currentPage: 1,
            pageSize: 20,
            totalItems: 0,
            dataList: [],
            results: [],
            bullay: '',
            dataListLoading: false
        };
    },
    created() {
        this.calculateDates();
    },
    mounted() {
        this.getDataList()
    },
    methods: {
        async getDataList() {
            this.dataListLoading = true;
            this.results = []
            const startDate = new Date(this.dataForm.p_vouchdatestart); // 开始日期  
            const endDate = new Date(this.dataForm.p_vouchdateend); // 结束日期  
            const dateArray = []; // 用于存储要调用的日期 
            // 存储所有未处理的原始数据
            const rawResults = [];
            // 生成日期数组  
            for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
                dateArray.push(new Date(d).toISOString().split('T')[0]); // 将日期格式化为 YYYY-MM-DD  
            }
            console.log(dateArray)

            for (const date of dateArray) {
                // 设置 dataForm 的日期  
                const dictForm = {
                    p_vouchdatestart: date,
                    p_vouchdateend: date,
                };

                // 调用 API  
                const res = await api.onesellSite(dictForm);

                this.dataList = res
                rawResults.push(...this.dataList);
            }
            // 统一处理合并后的数据
            this.results = rawResults
                .map(item => {
                    // 1. 处理 sqname（去掉开头的数字）
                    if (item.sqname) {
                        item = { ...item, sqname: item.sqname.replace(/^\d+/, '') };
                    }
                    return item;
                })
                .map(item => {
                    // 2. 替换 cProductCode
                    if (item.cProductCode == 1520100022) {
                        item = { ...item, cProductCode: 1520100047 };
                    } else if (item.cProductCode == 1520100023) {
                        item = { ...item, cProductCode: 1520100048 };
                    } else if (["1103010003", "HNLK001", "HNYZ0001", "SCLK0001", "HFZF001", "HBLK001"].includes(item.cProductCode)) {
                        item = { ...item, cProductCode: 1520100042 };
                    } else if (["HNLK005", "1102010001", "HBLK004", "HNYZ0004", "HFZF006"].includes(item.cProductCode)) {
                        item = { ...item, cProductCode: 1520100041 };
                    } else if (["1103010005", "HNLK003", "HBLK003", "HNYZ0003", "HFZF003"].includes(item.cProductCode)) {
                        item = { ...item, cProductCode: 1520100043 };
                    } else if (["1103010006", "HNLK002", "HBLK002", "HNYZ0002", "SCLK0002", "HFZF002"].includes(item.cProductCode)) {
                        item = { ...item, cProductCode: 1520100044 };
                    }
                    return item;
                })
                .map(item => ({
                    // 3. 添加动态属性 box + cProductCode
                    ...item,
                    ["box" + item.cProductCode]: parseFloat(Number(item.box).toFixed(2))
                }))
                .filter(item =>
                    // 4. 过滤数据
                    (item.dqname && item.dqname.toLowerCase().includes(this.bullay)) ||
                    (item.sqname && item.sqname.toLowerCase().includes(this.bullay)) ||
                    (item.companyname && item.companyname.toLowerCase().includes(this.bullay)) ||
                    (item.cname && item.cname.toLowerCase().includes(this.bullay)) ||
                    (item.ccitename && item.ccitename.toLowerCase().includes(this.bullay))
                );

            this.currentData = [...this.results];
            this.sizeChangeHandle(this.pageSize);

            this.dataListLoading = false;
            // api.onesellSite(this.dataForm).then(res => {
            //     this.dataList = res
            //     this.dataList = this.dataList.map(item => {
            //         if (!item.sqname) return item;    // 如果 sqname 为空、null 或 undefined，直接返回原对象
            //         return {
            //             ...item,
            //             sqname: item.sqname.replace(/^\d+/, ''), // 否则去掉开头的数字
            //         };
            //     });
            //     for (let i = 0; i < this.dataList.length; i++) {
            //         const item = this.dataList[i];
            //         if (item.cProductCode == 1520100022) {
            //             item.cProductCode = 1520100047;
            //         } else if (item.cProductCode == 1520100023) {
            //             item.cProductCode = 1520100048;
            //         }
            //     }
            //     this.dataList = this.dataList.map(item => ({
            //         ...item, // 展开原对象的所有属性
            //         ["box" + item.cProductCode]: parseFloat(Number(item.box).toFixed(2)) // 新增动态属性
            //     }));
            //     this.dataList = this.dataList.filter(item =>
            //         (item.dqname && item.dqname.toLowerCase().includes(this.bullay)) ||
            //         (item.sqname && item.sqname.toLowerCase().includes(this.bullay)) ||
            //         (item.companyname && item.companyname.toLowerCase().includes(this.bullay)) ||
            //         (item.cname && item.cname.toLowerCase().includes(this.bullay)) ||
            //         (item.ccitename && item.ccitename.toLowerCase().includes(this.bullay))
            //     );
            //     this.currentData = {
            //         ...this.dataList
            //     };
            //     this.sizeChangeHandle(this.pageSize);

            //     this.dataListLoading = false;
            // })
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
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                exportExcel(this.results, '已审核报单明细(站点).xlsx')

            })
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
    }
};
</script>

<style scoped lang="scss"></style>