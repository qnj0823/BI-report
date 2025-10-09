<template>
    <div class='single'>
        <el-form :inline="true" style="width: 90%; margin: 0 auto;">

            <el-form-item>
                <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                    @click="exportData">导出</el-button>
            </el-form-item>


        </el-form>

        <el-table class="table" ref="table" border :data="dataList" v-loading="dataListLoading"
            style="width: 90%; margin: 0 auto; margin-bottom: 50px;">
            <el-table-column fixed :show-overflow-tooltip="true" align="center" prop="sqname" label="销售区域/省区" />
            <el-table-column fixed :show-overflow-tooltip="true" align="center" width="150" prop="companyname" label="分公司/办事处" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="lowSeries" label="老品">
                <el-table-column :show-overflow-tooltip="true" align="center" prop="bigyuanwei" label="大原味" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="smallyuanwei" label="小原味" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yxyuanwei" label="优选原味" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="xyuanweidyh" label="小原味（戴永红定制）" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="xyuanweily" label="小原味（绿叶定制）" />
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
                <el-table-column :show-overflow-tooltip="true" align="center" prop="snnb180" label="180酸乳酪(白）" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="snnred180" label="180酸乳酪(红）" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="lyznr1" label="1L椰子牛乳" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="lyznrdz1" label="1L椰子牛乳(定制款）" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="cgb970" label="970常温(常规版）" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yxb970" label="970常温(宴席版）" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yxb300" label="300常温(宴席版）" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="jdb300" label="300常温(经典版）" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="cz380" label="380橙汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="cz135" label="1.35橙汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="syz380" label="380双柚汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="syz135" label="1.35双柚汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yzz245" label="245椰子汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="lyzz1" label="1L椰子汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yzz300" label="300椰子汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="hpyzz125" label="1.25L红瓶椰子汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="lpyzz125"
                label="1.25L蓝瓶椰子汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="lkyzz300" label="300礼盒椰子汁" />
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="Qtnmer" label="其它" />
            <el-table-column prop="max" align="center" label="小计" />
        </el-table>
    </div>
</template>

<script>
import * as api from '@/api/frame/customer.js'
import * as echarts from 'echarts';
import {
    exportExcel
} from './SinglelimtExpro.js'
export default {
    props: {
        startTime: {
            type: String,
            required: true
        },
        endTime: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        }
    },
    name: 'single-page',
    data() {
        return {
            msg: 'single-page',
            codes: [
            {
                    id: '1520100050',
                    name: 'lpyzz125'
                },
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
            dataForm: {
                p_orgname: '',
                p_vouchdatestart: '',
                p_vouchdateend: ''
            },
            dataListLoading: false,
            dataList: [],
        };
    },
    // mounted() {
    //     console.log(this.message, this.startTime, this.endTime)
    //     this.dataForm.p_orgname = this.message;
    //     this.dataForm.p_vouchdatestart = this.startTime;
    //     this.dataForm.p_vouchdateend = this.endTime;
    //     this.getDataList();
    // },
    methods: {
        exportData() {
            this.$confirm('是否导出表格数据到Excel？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                exportExcel(this.dataList, '前十单位体分子公司销量表.xlsx')

            })
        },

        getDataList() {
            this.dataForm.p_orgname = this.message;
            this.dataForm.p_vouchdatestart = this.startTime;
            this.dataForm.p_vouchdateend = this.endTime;
            console.log(this.message,this.startTime,this.endTime)
            this.dataListLoading = true
            api.productonesellcompanybip(this.dataForm).then(res => {
                this.dataList = res

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
                    const existing = accumulator.find(item => item.companyname === current.companyname);
                    if (existing) {
                        // 合并非指定字段 
                        for (const key in current) {
                            if (!['cProductCode', 'cProductName', 'box', 'name'].includes(key)) {
                                //只合并非重复的值 
                                if (existing[key] !== current[key]) {
                                    existing[key] = current[key]; //只保留最新的值 
                                }
                            }
                        }
                    } else {
                        // 如果没有找到相同companyname的对象，就添加到数组中，移除不需要的字段 
                        const { cProductCode, cProductName, box, ...rest } = current; // 解构赋值，移除指定字段 
                        accumulator.push({ companyname: current.name, ...rest }); //只保留name和合并后的其他字段 
                    }
                    return accumulator;
                }, []);

                const total = this.dataList.reduce((acc, obj) => {
                    this.codes.forEach(field => {
                        const fieldName = field.name; // 获取需要累加的字段名 // 确保值被转换为数字进行累加 
                        const currentValue = Number(obj[fieldName]) || 0; // 确保转换为数字 
                        acc[fieldName] = (acc[fieldName] || 0) + currentValue; // 累加总值 
                    });
                    return acc;
                }, {});



                // 创建合计对象
                const totalObject = { companyname: "合计", ...total };

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
                        //只对非 name 字段进行求和，并确保将字符串转为数字 
                        if (key !== 'name') {
                            const value = Number(obj[key]); // 转换为数字 
                            return acc + (isNaN(value) ? 0 : value); //处理非数字情况 
                        }
                        return acc; // 针对 name 字段返回累加值 
                    }, 0);
                    // 将结果赋值到 max 字段 
                    obj.max = sum;
                });
                this.dataList = this.dataList.map(item => {
                    // 创建一个新的对象以保持原始的 name 字段 
                    const newItem = { companyname: item.companyname,sqname:item.sqname }; // 遍历对象的每个字段 
                    for (const key in item) {
                        if (key !== 'companyname' && key !== 'sqname') { // 排除 name 字段 
                            const numericValue = Number(item[key]); // 转换为数字 //只在转换成功时保留两位小数 
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
                        yzz245:(Number(item.yzz245) || 0) + (Number(item.yzz245h) || 0),
                        lyzz1:(Number(item.lyzz1) || 0) + (Number(item.yzz1Lh) || 0),
                        yzz300:(Number(item.yzz300) || 0) + (Number(item.yzz300h) || 0),
                        hpyzz125:(Number(item.hpyzz125) || 0) + (Number(item.yzz125Lh) || 0),
                        lkyzz300:(Number(item.lkyzz300) || 0) + (Number(item.yzz300h1) || 0),
                        // yz330:(Number(item.yz330) || 0) + (Number(item.yznr330h) || 0),
                        // xqx:(Number(item.xqx) || 0) + (Number(item.xqxjsh) || 0)
                    };
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

                    // 如果 companyname 是 "合计"，则确保其排到最后  
                    if (a.companyname === "合计") return 1;
                    if (b.companyname === "合计") return -1;

                    // 首先比较 ocustomerClass_name  
                    const classComparison = classNameA.localeCompare(classNameB);

                    // 如果 ocustomerClass_name 相同，则比较 sqname  
                    if (classComparison === 0) {
                        return nameA.localeCompare(nameB); // 次级排序  
                    }

                    return classComparison; // 返回 ocustomerClass_name 的比较结果  
                });
                this.dataList.forEach(item => {
                    const xqmcValue = parseFloat(item.xqmc) || 0; // 如果没有值，则取0  
                    const gm1lValue = parseFloat(item.gm1l) || 0; // 如果没有值，则取0  
                    const pcbValue = parseFloat(item.pcb) || 0; // 如果没有值，则取0 
                    item.Qtnmer = xqmcValue + gm1lValue +pcbValue; // 计算和并赋值给新字段  
                });
                console.log(this.dataList)

                this.dataListLoading = false
                this.dataForm.p_vouchdatestart = ''
                this.dataForm.p_vouchdateend = ''
                this.dataForm.p_orgname = ''

            })
        },


    },


};
</script>

<style scoped lang="scss">
::v-deep .table .el-table__cell {
  padding: 0px !important;
}

;

::v-deep th.el-table__cell>.cell {
  padding: 0px !important;
}

;

::v-deep .el-table__header-wrapper {
  font-size: 15px;
}

::v-deep .el-table .el-table__body-wrapper tbody tr:last-child {
  font-size: 15px;
  /* 根据需要设置字体大小 */
  font-weight: 600;
}

::v-deep .el-table th {
  background: #f5f7fa;
}
</style>