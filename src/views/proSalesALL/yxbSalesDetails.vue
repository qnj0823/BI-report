<template>
    <div class='details'>
        <el-form :inline="true" style="width: 95%; margin: 10px auto;">
            <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                @click="exportData">导出</el-button>
        </el-form>
        <el-table class="table" ref="table" border :data="currentData" v-loading="dataListLoading"
            style="width: 95%; margin: 0 auto; margin-bottom: 50px;">
            <el-table-column fixed :show-overflow-tooltip="true" align="center" prop="sqname" label="销售区域/省区" />
            <el-table-column fixed :show-overflow-tooltip="true" width="140" align="center" prop="ocustomerClass_name"
                label="分公司/办事处" />
            <el-table-column fixed :show-overflow-tooltip="true" align="center" width="200" prop="cSiteName"
                label="站点" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="lowSeries" label="老品">
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
                <el-table-column :show-overflow-tooltip="true" align="center" prop="djs" label="大健爽" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="xjs" label="小健爽" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="dlt" label="大0糖" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="xlt" label="小0糖" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="lsjs" label="蓝色健爽" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="jn" label="健能" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="jh" label="姜黄" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yz330" label="330" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yz310" label="310" />
            </el-table-column>

            <el-table-column :show-overflow-tooltip="true" align="center" prop="lowSeries" label="新品">
                <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="snnb180"
                    label="180酸乳酪(白）" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="snnred180"
                    label="180酸乳酪(红）" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="lyznr1" label="1L椰子牛乳" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="140" prop="lyznrdz1"
                    label="1L椰子牛乳(定制款）" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="cgb970"
                    label="970常温(常规版）" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="yxb970"
                    label="970常温(宴席版）" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="yxb300"
                    label="300常温(宴席版）" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="jdb300"
                    label="300常温(经典版）" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="cz380" label="380橙汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="cz135" label="1.35橙汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="syz380" label="380双柚汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="syz135" label="1.35双柚汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yzz245" label="245椰子汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="lyzz1" label="1L椰子汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yzz300" label="300椰子汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="hpyzz125"
                    label="1.25L红瓶椰子汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="lkyzz300"
                    label="300礼盒椰子汁" />
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="Qtnmer" label="其它" />
            <el-table-column prop="max" align="center" label="小计" />
        </el-table>
        <el-pagination style="width: 80%; margin: 0 auto; " @size-change="sizeChangeHandle" ref="pagination"
            @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20, 40, 60, 80, 100, 1000]"
            :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="dataList.length">
        </el-pagination>
    </div>
</template>

<script>
import * as api from '@/api/frame/customer.js'
import {
    exportExcel
} from './SingleDetailsExpro.js'
export default {
    name: 'details-page',
    data() {
        return {
            msg: 'details-page',
            dataForm: {
                p_vouchdatestart: '',
                p_vouchdateend: '',
                p_orgname: ''
            },
            yxb: '',
            dataListLoading: false,
            dataList: [],
            currentData: [],
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
                //     id: '3520100002',
                //     name: 'xyw1'
                // },
                // {
                //     id: '3520100012',
                //     name: 'xbt1'
                // },
                // {
                //     id: '3520100010',
                //     name: 'dbt1'
                // },
                // {
                //     id: '3520100001',
                //     name: 'dyw1'
                // },

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
                // {
                //     id: '3520100006',
                //     name: 'xqxjsh'
                // },
                // {
                //     id: '3520100011',
                //     name: 'yznr330h'
                // },
            ],
        };
    },
    mounted() {
        this.yxb = this.$route.query.param1;
        this.dataForm.p_vouchdatestart = this.$route.query.startdate;
        this.dataForm.p_vouchdateend = this.$route.query.enddata;
        this.getDataList()
    },
    methods: {
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                exportExcel(this.dataList, '单品销量表-站点.xlsx')

            })
        },
        getDataList() {
            this.dataListLoading = true;
            api.productonesellsitebip(this.dataForm).then(res => {
                this.dataList = res;

                if (this.yxb) { // 检查战区是否为空  
                    this.dataList = this.dataList.filter(item => item.nAME === this.yxb);
                }
                console.log(this.dataList);
                // 遍历 this.dataList 数组   
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

                this.dataList = this.dataList.reduce((accumulator, current) => {
                    // 查找已有的对象   
                    const existing = accumulator.find(item => item.cSiteName === current.cSiteName);
                    if (existing) {
                        // 合并非指定字段   
                        for (const key in current) {
                            if (!['cProductCode', 'cProductName', 'box', 'name'].includes(key)) {
                                // 只合并非重复的值   
                                if (existing[key] !== current[key]) {
                                    existing[key] = current[key]; // 只保留最新的值   
                                }
                            }
                        }
                    } else {
                        // 如果没有找到相同 cSiteName 的对象，就添加到数组中，移除不需要的字段   
                        const { cProductCode, cProductName, box, ...rest } = current; // 解构赋值，移除指定字段   
                        accumulator.push({
                            cSiteName: current.name,
                            ...rest,
                            ocustomerClass_name: current.ocustomerClass_name, // 保留 ocustomerClass_name  
                            sqname: current.sqname // 保留 sqname  
                        });
                    }
                    return accumulator;
                }, []);

                const total = this.dataList.reduce((acc, obj) => {
                    this.codes.forEach(field => {
                        const fieldName = field.name; // 获取需要累加的字段名   
                        const currentValue = Number(obj[fieldName]) || 0; // 确保转换为数字   
                        acc[fieldName] = (acc[fieldName] || 0) + currentValue; // 累加总值   
                    });
                    return acc;
                }, {});

                // 创建合计对象  
                const totalObject = { cSiteName: "合计", ...total };

                // 将合计对象中的值为0替换为空字符串  
                this.codes.forEach(field => {
                    const fieldName = field.name;
                    if (totalObject[fieldName] === 0) {
                        totalObject[fieldName] = ""; // 将0赋值为空字符串   
                    }
                });
                // 将合计对象添加到原数组中  
                this.dataList.push(totalObject);

                // 遍历每个对象  
                this.dataList.forEach(obj => {
                    //计算除了 name 字段之外的其他字段的和   
                    const sum = Object.keys(obj).reduce((acc, key) => {
                        // 只对非 name 字段进行求和，并确保将字符串转为数字   
                        if (key !== 'name') {
                            const value = Number(obj[key]); // 转换为数字   
                            return acc + (isNaN(value) ? 0 : value); // 处理非数字情况   
                        }
                        return acc; // 针对 name 字段返回累加值   
                    }, 0);
                    // 将结果赋值到 max 字段   
                    obj.max = sum;
                });

                this.dataList = this.dataList.map(item => {
                    // 创建一个新的对象以保持原始的 cSiteName、ocustomerClass_name 和 sqname 字段   
                    const newItem = {
                        cSiteName: item.cSiteName,
                        ocustomerClass_name: item.ocustomerClass_name,
                        sqname: item.sqname // 保留 sqname  
                    };
                    for (const key in item) {
                        if (key !== 'cSiteName' && key !== 'ocustomerClass_name' && key !== 'sqname') { // 排除 name、ocustomerClass_name 和 sqname 字段   
                            const numericValue = Number(item[key]); // 转换为数字   
                            newItem[key] = !isNaN(numericValue) ? numericValue.toFixed(0) : ''; // 可以选择默认值   
                        }
                    }
                    return newItem; // 返回新对象  
                });

                this.dataList = this.dataList.map(item => {
                    return {
                        ...item, // 保留所有原有字段  
                        // dbt: (Number(item.dbt) || 0) + (Number(item.dbt1) || 0), // 更新 dbt 字段  
                        // xbt: (Number(item.xbt) || 0) + (Number(item.xbt1) || 0), // 更新 xbt 字段  
                        // bigyuanwei: (Number(item.bigyuanwei) || 0) + (Number(item.dyw1) || 0), // 更新 bigyuanwei 字段  
                        // smallyuanwei: (Number(item.smallyuanwei) || 0) + (Number(item.xyw1) || 0), // 更新 smallyuanwei 字段  
                        yzz245: (Number(item.yzz245) || 0) + (Number(item.yzz245h) || 0),
                        lyzz1: (Number(item.lyzz1) || 0) + (Number(item.yzz1Lh) || 0),
                        yzz300: (Number(item.yzz300) || 0) + (Number(item.yzz300h) || 0),
                        hpyzz125: (Number(item.hpyzz125) || 0) + (Number(item.yzz125Lh) || 0),
                        lkyzz300: (Number(item.lkyzz300) || 0) + (Number(item.yzz300h1) || 0),
                        // yz330:(Number(item.yz330) || 0) + (Number(item.yznr330h) || 0),
                        // xqx:(Number(item.xqx) || 0) + (Number(item.xqxjsh) || 0) 
                    };
                });
                this.dataList.forEach(item => {
                    const xqmcValue = parseFloat(item.xqmc) || 0; // 如果没有值，则取0  
                    const gm1lValue = parseFloat(item.gm1l) || 0; // 如果没有值，则取0  
                    const pcbValue = parseFloat(item.pcb) || 0; // 如果没有值，则取0 
                    item.Qtnmer = xqmcValue + gm1lValue + pcbValue; // 计算和并赋值给新字段  
                });
                this.dataList.forEach(item => {
                    if (item.sqname) { // 检查 sqname 是否存在且非空  
                        item.sqname = item.sqname.replace(/\d+/g, '').trim(); // 替换数字并去除空格  
                    }
                });
                // 按照 ocustomerClass_name、sqname 和 cSiteName 排序  
                this.dataList.sort((a, b) => {
                    // 处理比较时确保处理了空值情况  
                    const classNameA = a.ocustomerClass_name || ''; // 默认值为空字符串  
                    const classNameB = b.ocustomerClass_name || ''; // 默认值为空字符串  
                    const nameA = a.sqname || ''; // 默认值为空字符串  
                    const nameB = b.sqname || ''; // 默认值为空字符串  

                    // 如果 cSiteName 是 "合计"，则确保其排到最后  
                    if (a.cSiteName === "合计") return 1;
                    if (b.cSiteName === "合计") return -1;

                    // 首先比较 ocustomerClass_name  
                    const classComparison = classNameA.localeCompare(classNameB);

                    // 如果 ocustomerClass_name 相同，则比较 sqname  
                    if (classComparison === 0) {
                        return nameA.localeCompare(nameB); // 次级排序  
                    }

                    return classComparison; // 返回 ocustomerClass_name 的比较结果  
                });

                // 处理排序后的结果  
                console.log(this.dataList);

                this.currentData = {
                    ...this.dataList
                };
                this.dataListLoading = false;
                this.sizeChangeHandle(this.pageSize);
            });
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
    font-size: 12px;
    background: #f5f7fa;
}


::v-deep .el-table th {
    background: #f5f7fa;
}
</style>