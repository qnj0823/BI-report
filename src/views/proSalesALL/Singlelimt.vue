<template>
    <div class='single'>
        <el-form :inline="true" style="width: 90%; margin: 0 auto;">

            <el-form-item>
                <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                    @click="exportData">导出</el-button>
            </el-form-item>


        </el-form>

        <el-table class="table" ref="table" border :data="resultArray" v-loading="dataListLoading"
            style="width: 90%; margin: 0 auto; margin-bottom: 50px;">
            <el-table-column fixed :show-overflow-tooltip="true" align="center" prop="sqname" label="销售区域/省区" />
            <el-table-column fixed :show-overflow-tooltip="true" align="center" width="150" prop="ocustomerClass_name"
                label="分公司/办事处" />
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
                <el-table-column :show-overflow-tooltip="true" align="center" prop="qinxi450" label="450清新" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="djs" label="大健爽" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="xjs" label="小健爽" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="dlt" label="大0糖" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="xlt" label="小0糖" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="lsjs" label="蓝色健爽" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="jn" label="健能" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="jh" label="姜黄" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yz330" label="330" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yz310" label="310" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="snnb180" label="180酸乳酪(白）" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="snnred180" label="180酸乳酪(红）" />
            </el-table-column>

            <el-table-column :show-overflow-tooltip="true" align="center" prop="lowSeries" label="新品">

                <el-table-column :show-overflow-tooltip="true" align="center" prop="js180" width="120"
                    label="180活力健爽" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="ylr200" width="120"
                    label="200鲜酪乳" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="ylr450" width="120"
                    label="450鲜酪乳" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="js455" width="120"
                    label="455活力健爽" />

                <el-table-column :show-overflow-tooltip="true" align="center" prop="lyznr1" label="1L椰子牛乳" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="lyznrdz1" label="1L椰子牛乳(定制款）" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="cgb970" label="950常温(常规版）" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yxb970" label="950常温(宴席版）" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yxb300" label="300常温(宴席版）" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="jdb300" label="300常温(经典版）" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="cz380" label="380橙汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="cz135" label="1.35橙汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="syz380" label="380双柚汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="syz135" label="1.35双柚汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yzs1l" label="1L椰子水" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yzs380" width="120"
                    label="380椰子水" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yzz245" label="245椰子汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="lyzz1" label="1L椰子汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="yzz300" label="300椰子汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="hpyzz125" label="1.25L红瓶椰子汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="lpyzz125"
                    label="1.25L蓝瓶椰子汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="lkyzz300" label="300礼盒椰子汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="xqn300" label="300小青柠汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="xqn900" label="900小青柠汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="pgz300" label="300苹果汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="pgz900" label="900苹果汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="mgbl300" label="300芒果菠萝汁" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="mgbl900" label="900芒果菠萝汁" />
                

            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="Qtnmer" label="其它" />
            <el-table-column prop="sum" align="center" label="小计" />
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
                    id: '1520100033',
                    name: 'yzs380'
                },
                {
                    id: '1520100054',
                    name: 'js455'
                },

                {
                    id: '1520100053',
                    name: 'ylr450'
                },
                {
                    id: '1520100052',
                    name: 'ylr200'
                },

                {
                    id: '1520100051',
                    name: 'js180'
                },

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
                //     id: 'Y0003',
                //     name: 'le003'
                // },
                {
                    id: '3520100002',
                    name: 'xyw1'
                },
                {
                    id: '3520100012',
                    name: 'xbt1'
                },
                {
                    id: '3520100010',
                    name: 'dbt1'
                },
                {
                    id: '3520100001',
                    name: 'dyw1'
                },

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
                {
                    id: '1520100045',
                    name: 'qinxi450'
                },
                {
                    id: '1520100040',
                    name: 'xqn300'
                },
                {
                    id: '1520100039',
                    name: 'xqn900'
                },
                {
                    id: '1520100037',
                    name: 'pgz900'
                },
                {
                    id: '1520100038',
                    name: 'pgz300'
                },
                {
                    id: '1520100036',
                    name: 'mgbl300'
                },
                {
                    id: '1520100035',
                    name: 'mgbl900'
                },
                {
                    id: '1520100041',
                    name: 'yzz24541'
                },
                {
                    id: '1520100042',
                    name: 'yzz1ll'
                },
                {
                    id: '1520100043',
                    name: 'yzz30043'
                },
                {
                    id: '1520100044',
                    name: 'yzz125red'
                },
                {
                    id: '1520100046',
                    name: 'yzz300box'
                },

                {
                    id: '3520100006',
                    name: 'xqxjsh'
                },
                {
                    id: '3520100011',
                    name: 'yznr330h'
                },
                {
                    id: 'HBLK002',
                    name: 'HBLK002'
                },
                {
                    id: 'HBLK003',
                    name: 'HBLK003'
                },
                {
                    id: 'HBLK004',
                    name: 'HBLK004'
                },
                {
                    id: 'HNYZ0001',
                    name: 'HNYZ0001'
                },
                {
                    id: 'HNYZ0002',
                    name: 'HNYZ0002'
                },
                {
                    id: 'HNYZ0003',
                    name: 'HNYZ0003'
                },
                {
                    id: 'HNYZ0004',
                    name: 'HNYZ0004'
                },
                {
                    id: 'SCLK0001',
                    name: 'SCLK0001'
                },
                {
                    id: 'SCLK0002',
                    name: 'SCLK0002'
                },
                {
                    id: 'HFZF001',
                    name: 'HFZF001'
                },
                {
                    id: 'HFZF002',
                    name: 'HFZF002'
                },
                {
                    id: 'HFZF003',
                    name: 'HFZF003'
                },
                {
                    id: 'HFZF004',
                    name: 'HFZF004'
                },
                {
                    id: 'HFZF006',
                    name: 'HFZF006'
                },
                {
                    id: '1520100019',
                    name: 'gmxxmc900'
                },
                {
                    id: '1520100018',
                    name: 'gmxxmc420'
                },
                {
                    id: 'HBLK007',
                    name: 'HBLK007'
                },
                {
                    id: 'HBLK001',
                    name: 'HBLK001'
                },
                {
                    id: '1520100047',
                    name: 'CGB950'
                },
                {
                    id: '1520100048',
                    name: 'YXB950'
                },
                {
                    id: '1520100034',
                    name: 'yzs1l'
                },
                {
                    id: '1520100049',
                    name: 'yqb36'
                },
            ],
            dataForm: {
                p_vouchdatestart: '',
                p_vouchdateend: ''
            },
            p_orgname: '',
            dataListLoading: false,
            dataList: [],
            resultArray: []
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
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                exportExcel(this.resultArray, '分公司单品销量表.xlsx')

            })
        },
        mergeByCustomerClass(arr) {
            return Object.values(
                arr.reduce((acc, obj) => {
                    const { ocustomerClass_name, sqname, nAME, cname, cSiteName, ...rest } = obj;

                    // 初始化按 ocustomerClass_name 分组的对象  
                    if (!acc[ocustomerClass_name]) {
                        acc[ocustomerClass_name] = { ocustomerClass_name, sqname, nAME, cname, cSiteName };
                    }

                    // 累加除了特定字段之外的值  
                    for (const [key, value] of Object.entries(rest)) {
                        const numericValue = Number(value);
                        if (!isNaN(numericValue)) { // 确保它不是NaN  
                            acc[ocustomerClass_name][key] = (acc[ocustomerClass_name][key] || 0) + numericValue;
                        }
                    }

                    return acc;
                }, {})
            ).map(item => {
                // 在这里将累加的值格式化为两位小数  
                Object.keys(item).forEach(key => {
                    if (typeof item[key] === 'number') {
                        item[key] = item[key].toFixed(2);
                    }
                });
                return item;
            });
        },

        getDataList() {
            this.p_orgname = this.message;
            this.dataForm.p_vouchdatestart = this.startTime;
            this.dataForm.p_vouchdateend = this.endTime;
            console.log(this.p_orgname, this.startTime, this.endTime)
            this.dataListLoading = true

            api.productonesellsite(this.dataForm).then(res => {
                this.dataList = res
                this.dataList.forEach(item => {
                    if (item.cProductCode == 'HBLK007') {
                        item.box = item.box / 40
                    }
                })
                this.dataList = this.dataList.filter(item =>
                    (item.nAME && item.nAME.toLowerCase().includes(this.p_orgname))

                );
                this.dataList = Object.values(this.dataList.reduce((acc, item) => {
                    const key = `${item.cProductCode}-${item.cSiteName}-${item.ocustomerClass_name}-${item.sqname}-${item.cname} `; // 生成唯一键  
                    if (!acc[key]) {
                        // 如果不存在该键，则创建一个新的对象  
                        acc[key] = {
                            cProductCode: item.cProductCode,
                            cProductName: item.cProductName,
                            sqname: item.sqname,
                            ocustomerClass_name: item.ocustomerClass_name,
                            cSiteName: item.cSiteName,
                            cname: item.cname,
                            nAME: item.nAME,
                            box: 0, // 初始化 box 为 0  
                        };
                    }
                    // 将 box 转换为数字并相加  
                    acc[key].box += Number(item.box);

                    return acc;
                }, {}));

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



                //去除这些对象
                this.dataList = this.dataList.map(({ box, cProductCode, cProductName, product_class_pname, attribute, ...rest }) => rest);


                const result = this.mergeByCustomerClass(this.dataList);
                console.log(result, 'result')

                //计算小计
                this.resultArray = result.map(obj => {
                    // 计算非指定字段的和  
                    const sum = Object.keys(obj)
                        .filter(key => !["cSiteName", "cname", "nAME", "ocustomerClass_name", "sqname"].includes(key))
                        .reduce((acc, key) => {
                            // 转换为数字并相加，确保即使是字符串也会被正确转换  
                            const value = Number(obj[key]);
                            return acc + (typeof value === 'number' && !isNaN(value) ? value : 0);
                        }, 0);

                    // 转换为带有两位小数的数字  
                    const formattedSum = parseFloat(sum.toFixed(2));

                    return { ...obj, sum: formattedSum }; // 返回新对象，包含原有字段和计算的 sum 字段  
                });





                this.resultArray = this.resultArray.map(item => {
                    return {
                        ...item, // 保留所有原有字段  
                        dbt: ((Number(item.dbt) || 0) + (Number(item.dbt1) || 0)).toFixed(2), // 更新 dbt 字段  
                        xbt: ((Number(item.xbt) || 0) + (Number(item.xbt1) || 0)).toFixed(2), // 更新 xbt 字段  
                        bigyuanwei: ((Number(item.bigyuanwei) || 0) + (Number(item.dyw1) || 0)).toFixed(2), // 更新 bigyuanwei 字段  
                        smallyuanwei: ((Number(item.smallyuanwei) || 0) + (Number(item.xyw1) || 0)).toFixed(2), // 更新 smallyuanwei 字段  le003 yzz24599 HBLK004
                        yzz245: ((Number(item.yzz245) || 0) + (Number(item.yzz245h) || 0) + (Number(item.yzz24541) || 0) + (Number(item.yzz24599) || 0) + (Number(item.HBLK004) || 0) + (Number(item.HNYZ0004) || 0) + (Number(item.HFZF006) || 0)).toFixed(2),
                        lyzz1: ((Number(item.lyzz1) || 0) + (Number(item.yzz1Lh) || 0) + (Number(item.yzz1ll) || 0) + (Number(item.HNYZ0001) || 0) + (Number(item.SCLK0001) || 0) + (Number(item.HFZF001) || 0) + (Number(item.HBLK001) || 0)).toFixed(2),
                        yzz300: ((Number(item.yzz300) || 0) + (Number(item.yzz300h) || 0) + (Number(item.yzz30043) || 0) + (Number(item.HBLK003) || 0) + (Number(item.HNYZ0003) || 0) + (Number(item.HFZF003) || 0)).toFixed(2),
                        hpyzz125: ((Number(item.hpyzz125) || 0) + (Number(item.yzz125Lh) || 0) + (Number(item.yzz125red) || 0) + (Number(item.HBLK002) || 0) + (Number(item.HNYZ0002) || 0) + (Number(item.SCLK0002) || 0) + (Number(item.HFZF002) || 0)).toFixed(2),
                        lkyzz300: ((Number(item.lkyzz300) || 0) + (Number(item.yzz300h1) || 0) + (Number(item.HFZF004) || 0) + (Number(item.HBLK007) || 0)).toFixed(2),
                        yz330: ((Number(item.yz330) || 0) + (Number(item.yznr330h) || 0)).toFixed(2),
                        xjs: ((Number(item.xjs) || 0) + (Number(item.xqxjsh) || 0)).toFixed(2),
                        cgb970: ((Number(item.cgb970) || 0) + (Number(item.CGB950) || 0)).toFixed(2),
                        yxb970: ((Number(item.yxb970) || 0) + (Number(item.YXB950) || 0)).toFixed(2),
                        yxb300: ((Number(item.yxb300) || 0) + (Number(item.yqb36) || 0)).toFixed(2),
                    };
                });
                this.resultArray.forEach(item => {
                    if (item.sqname) { // 检查 sqname 是否存在且非空  
                        item.sqname = item.sqname.replace(/\d+/g, '').trim(); // 替换数字并去除空格  
                    }
                });

                this.resultArray.forEach(item => {
                    const xqmcValue = parseFloat(item.xqmc) || 0; // 如果没有值，则取0  
                    const gm1lValue = parseFloat(item.gm1l) || 0; // 如果没有值，则取0  
                    const pcbValue = parseFloat(item.pcb) || 0; // 如果没有值，则取0 
                    const gmxxmc900 = parseFloat(item.gmxxmc900) || 0;
                    const gmxxmc420 = parseFloat(item.gmxxmc420) || 0;
                    item.Qtnmer = xqmcValue + gm1lValue + pcbValue + gmxxmc900 + gmxxmc420; // 计算和并赋值给新字段  
                });

                this.addSummaryToDataArray(this.resultArray);
                this.resultArray = this.sortByCustomerClass(this.resultArray)
                console.log(this.resultArray, 'this.resultArray')

                this.dataListLoading = false
                this.dataForm.p_vouchdatestart = ''
                this.dataForm.p_vouchdateend = ''
                this.p_orgname = ''

            })
        },
        sortByCustomerClass(dataArray) {
            return dataArray.sort((a, b) => {
                const nameA = a.sqname || ''; // 获取对象 a 的 sqname  
                const nameB = b.sqname || ''; // 获取对象 b 的 sqname  

                // 判断对象 a 和 b 是否是合计对象  
                const isTotalA = a.ocustomerClass_name === '合计';
                const isTotalB = b.ocustomerClass_name === '合计';

                if (isTotalA && !isTotalB) {
                    return 1; // 将合计对象放到最后  
                }
                if (!isTotalA && isTotalB) {
                    return -1; // 将合计对象放到最后  
                }

                // 按 sqname 字段进行排序（Unicode排序）  
                return nameA.localeCompare(nameB);
            });
        },
        addSummaryToDataArray(dataArray) {
            // 计算并添加合计对象  
            const sumObject = dataArray.reduce((acc, obj) => {
                Object.keys(obj).forEach(key => {
                    // 过滤出不需要的字段  
                    if (!["cSiteName", "cname", "nAME", "ocustomerClass_name", "sqname"].includes(key)) {
                        // 转换为数字并累计和  
                        const value = parseFloat(obj[key]) || 0; // 确保转换为数字，如果转换失败则使用0  
                        acc[key] = (acc[key] || 0) + value; // 累加到对应字段  
                    }
                });
                return acc;
            }, {});

            // 确保数值保留两位小数  
            const roundedSumObject = Object.fromEntries(
                Object.entries(sumObject).map(([key, value]) => [key, parseFloat(value.toFixed(2))])
            );

            // 设置合计对象的 ocustomerClass_name 字段  
            const totalObject = {
                cSiteName: "",
                cname: "",
                nAME: "",
                ocustomerClass_name: "合计",
                sqname: "",
                ...roundedSumObject,
            };

            // 将合计对象添加到原数组中  
            dataArray.push(totalObject);
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

// ::v-deep .el-table .el-table__body-wrapper tbody tr:last-child {
//     font-size: 15px;
//     /* 根据需要设置字体大小 */
//     font-weight: 600;
// }

::v-deep .el-table th {
    background: #f5f7fa;
}
</style>