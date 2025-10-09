<template>
  <div class='item'>
    <el-form :inline="true" style="width: 90%; margin: 5px auto;">
            <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download"
                @click="exportData">导出</el-button>
        </el-form>
        <el-table class="table" ref="table" border :data="currentData" v-loading="dataListLoading"
            style="width: 90%; margin: 0 auto; margin-bottom: 50px;">
            <el-table-column :show-overflow-tooltip="true" align="center" prop="sqname" label="销售区域/省区" />
            <el-table-column :show-overflow-tooltip="true" align="center" width="120" prop="ocustomerclassName" label="分公司/办事处" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="cSiteName" label="站点" />
            <el-table-column :show-overflow-tooltip="true" align="center" label="今日数据">
                <el-table-column :show-overflow-tooltip="true" align="center" width="70" prop="lowSeriesday" label="低温系列" />
                <el-table-column :show-overflow-tooltip="true" align="center"  width="70" prop="NorSeriesday" label="常温系列" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="70" prop="FruitSeriesday" label="果汁系列" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="100" prop="YzSeriesday"
                    label="椰子牛乳系列" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="95" prop="YzzSeriesday"
                    label="椰子汁系列" />
                    <el-table-column :show-overflow-tooltip="true" align="center" width="70" prop="QtSeriesday"
                    label="其它" />
                <el-table-column prop="sumday" align="center" label="今日报单" />
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" label="累计数据">
                <el-table-column :show-overflow-tooltip="true" align="center" width="70" prop="lowSeries" label="低温系列" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="70" prop="NorSeries" label="常温系列" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="70" prop="FruitSeries" label="果汁系列" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="100" prop="YzSeries"
                    label="椰子牛乳系列" />
                <el-table-column :show-overflow-tooltip="true" align="center" width="95" prop="YzzSeries"
                    label="椰子汁系列" />
                    <el-table-column :show-overflow-tooltip="true" align="center" width="70" prop="QtSeries"
                    label="其它" />
                <el-table-column prop="sum" align="center" label="累计报单" />
            </el-table-column>
        </el-table>
        <el-pagination style="width: 90%; margin: 0 auto; " @size-change="sizeChangeHandle" ref="pagination"
            @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20, 40, 60, 80, 100, 1000]"
            :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="mergedDataListall.length">
        </el-pagination>
  </div>
</template>

<script>
import * as api from '@/api/frame/customer.js'
import {
    exportExcel
} from './SalesRateDetailsExpro.js'
  export default {
    name: 'item-page',
    data() {
      return {
        dataListLoading: false,
        dataForm: {
                p_orgname: '',
                p_vouchdatestart: '',
                p_vouchdateend: ''
            },
            dataForm1: {
                p_orgname: '',
                p_vouchdatestart: '',
                p_vouchdateend: ''
            },
            dataListLoading: false,
            dataList: [],
            result: [],
            chartList: [],
            mergedDataList: [],

            dataListday: [],
            chartListday: [],
            resultday: [],
            mergedDataListday: [],
            mergedDataListall: [],
            currentData: [],
            currentPage: 1,
            pageSize: 20,
            totalItems: 0,
      };
    },
    created() {
        this.calculateDates();
    },
    mounted() {
        this.dataForm.p_orgname = this.$route.query.param1;
        this.dataForm.p_vouchdatestart = this.$route.query.startdate;
        this.dataForm.p_vouchdateend = this.$route.query.enddata;
        this.getDataListall()
    },
    methods: {
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

                exportExcel(this.mergedDataListall, '销量进度更进表-站点.xlsx')

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
            this.dataForm.p_vouchdatestart = this.startOfMonth
            this.dataForm.p_vouchdateend = this.endOfToday
        },
        formatDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1 
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },
        getDataListall() {
            this.getDataListday()
        },

        getDataListday() {
            this.dataForm1.p_vouchdatestart = this.endOfToday
            this.dataForm1.p_vouchdateend = this.endOfToday
            this.chartListday = []
            this.dataListLoading = true
            api.productxisiteteam(this.dataForm1).then(res => {
                this.dataListday = res
                // this.dataListday = this.dataListday.filter(item => item.productClassPname !== '其它');
                const sumMap = new Map();
                // 遍历原数组，将 box 值相加  
                this.dataListday.forEach(item => {
                    if (sumMap.has(item.cSiteName)) {
                        sumMap.set(item.cSiteName, sumMap.get(item.cSiteName) + item.box);
                    } else {
                        sumMap.set(item.cSiteName, item.box);
                    }
                });
                // 创建修改后的数组  
                this.dataListday = this.dataListday.map(item => ({
                    ...item, // 保留原对象的字段  
                    sum: sumMap.get(item.cSiteName) // 添加新字段 sum  
                }));
                this.dataListLoading = false




                const currData = this.dataListday.map(item => {
                    // 确定新的属性名 
                    let newFieldName;
                    switch (item.productClassPname) {
                        case "低温系列":
                            newFieldName = "lowSeriesday";
                            break;
                        case "常温系列":
                            newFieldName = "NorSeriesday";
                            break;
                        case "果汁系列":
                            newFieldName = "FruitSeriesday";
                            break;
                        case "椰子牛乳系列":
                            newFieldName = "YzSeriesday";
                            break;
                        case "椰子汁系列":
                            newFieldName = "YzzSeriesday";
                            break;
                        case "其它":
                            newFieldName = "QtSeriesday";
                            break;
                        default:
                            newFieldName = "boxday"; // 如果没有匹配的项，保持原字段名 
                    }

                    // 创建一个新的对象，使用新字段名并保留原 box 值 
                    return {
                        [newFieldName]: item.box, // 使用动态属性名 
                        ocustomerclassName: item.ocustomerclassName,
                        productClassPname: item.productClassPname,
                        sumday: item.sum,
                        sqname: item.sqname,
                        cSiteName:item.cSiteName

                    };
                });
                console.log(currData, 122233)

                this.mergedDataListday = currData.reduce((acc, item) => {
                    // 查找已存在的对象
                    let existingOrg = acc.find(org => org.cSiteName === item.cSiteName);

                    if (existingOrg) {
                        // 如果找到了，合并当前对象的字段 
                        Object.assign(existingOrg, item); // 将 item 的字段合并到 
                        existingOrg
                    } else {
                        // 如果没有找到，将当前对象添加到数组 
                        acc.push({ ...item }); // 使用展开运算符复制当前对象 
                    }

                    return acc; // 返回累加器
                }, []);
                console.log(this.mergedDataListday, 'this.mergedDataListday')
                this.mergedDataListday = this.mergedDataListday.map(item => {
                    // 检查 ocustomerclassName 是否为 "合计"  
                    if (item.cSiteName === "合计") {
                        return {
                            ...item,
                            sumday: item.boxday, // 将 box 的值赋给 
                            box: undefined // 删除原来的 box 字段 
                        };
                    }
                    return item; // 返回原对象
                });


                // 指定需要累加的字段
                const fieldsToSum = ['FruitSeriesday', 'NorSeriesday', 'QtSeriesday', 'YzSeriesday', 'YzzSeriesday', 'lowSeriesday', 'sumday'];

                // 使用 reduce 方法计算合计
                const total = this.mergedDataListday.reduce((acc, obj) => {
                    fieldsToSum.forEach(field => {
                        acc[field] = (acc[field] || 0) + (obj[field] || 0);
                    });
                    return acc;
                }, {});

                // 创建合计对象
                const totalObject = { cSiteName: "合计", ...total };

                // 将合计对象添加到原数组中
                this.mergedDataListday.push(totalObject);


                //预设的分类数据
                const data = ['低温系列', '常温系列', '果汁系列', '椰子牛乳系列', '椰子汁系列', '其它'];

                // 根据 cSiteName 分组
                const groupedData = {};
                this.dataList.forEach(item => {
                    if (!groupedData[item.cSiteName]) {
                        groupedData[item.cSiteName] = []; // 初始化为空数组 
                    }
                    groupedData[item.cSiteName].push(item); // 添加对象到对应的组
                });
                // console.log( 'groupedData', groupedData)


                // 检查每组，并添加缺失的分类
                for (const cSiteName in groupedData) {
                    const items = groupedData[cSiteName];
                    console.log('titems', items);
                    // 提取现有的 productClassPname 
                    const existingPnames = new Set(items.map(item => item.productClassPname));

                    // 将原有数据添加到 this.chartList 中 
                    this.chartList.push(...items);

                    // 检查 data 中每个分类是否存在 
                    data.forEach(pname => {
                        if (!existingPnames.has(pname)) {
                            // 如果不存在，新增一个对象，box 为0，其余字段相同 
                            this.chartListday.push({ productClassPname: pname, box: 0, cSiteName: cSiteName });
                        }
                    });
                }


                // 输出结果
                console.log(this.mergedDataListday, 'day999');

                this.getDataList()

            })
        },
        getDataList() {
            this.chartList = []
            this.dataListLoading = true
            api.productxisiteteam(this.dataForm).then(res => {
                this.dataList = res
                // this.dataList = this.dataList.filter(item => item.productClassPname !== '其它');
                const sumMap = new Map();
                // 遍历原数组，将 box 值相加  
                this.dataList.forEach(item => {
                    if (sumMap.has(item.cSiteName)) {
                        sumMap.set(item.cSiteName, sumMap.get(item.cSiteName) + item.box);
                    } else {
                        sumMap.set(item.cSiteName, item.box);
                    }
                });
                // 创建修改后的数组  
                this.dataList = this.dataList.map(item => ({
                    ...item, // 保留原对象的字段  
                    sum: sumMap.get(item.cSiteName) // 添加新字段 sum  
                }));
                this.dataListLoading = false

                console.log(this.dataList, 122233)


                const currData = this.dataList.map(item => {
                    // 确定新的属性名 
                    let newFieldName;
                    switch (item.productClassPname) {
                        case "低温系列":
                            newFieldName = "lowSeries";
                            break;
                        case "常温系列":
                            newFieldName = "NorSeries";
                            break;
                        case "果汁系列":
                            newFieldName = "FruitSeries";
                            break;
                        case "椰子牛乳系列":
                            newFieldName = "YzSeries";
                            break;
                        case "椰子汁系列":
                            newFieldName = "YzzSeries";
                            break;
                        case "其它":
                            newFieldName = "QtSeries";
                            break;
                        default:
                            newFieldName = "box"; // 如果没有匹配的项，保持原字段名 
                    }

                    // 创建一个新的对象，使用新字段名并保留原 box 值 
                    return {
                        [newFieldName]: item.box, // 使用动态属性名 
                        ocustomerclassName: item.ocustomerclassName,
                        productClassPname: item.productClassPname,
                        sum: item.sum,
                        sqname: item.sqname,
                        cSiteName:item.cSiteName
                    };
                });

                this.mergedDataList = currData.reduce((acc, item) => {
                    // 查找已存在的对象
                    let existingOrg = acc.find(org => org.cSiteName === item.cSiteName);

                    if (existingOrg) {
                        // 如果找到了，合并当前对象的字段 
                        Object.assign(existingOrg, item); // 将 item 的字段合并到 
                        existingOrg
                    } else {
                        // 如果没有找到，将当前对象添加到数组 
                        acc.push({ ...item }); // 使用展开运算符复制当前对象 
                    }

                    return acc; // 返回累加器
                }, []);
                this.mergedDataList = this.mergedDataList.map(item => {
                    // 检查 cSiteName 是否为 "合计"  
                    if (item.cSiteName === "合计") {
                        return {
                            ...item,
                            sum: item.box, // 将 box 的值赋给 
                            box: undefined // 删除原来的 box 字段 
                        };
                    }
                    return item; // 返回原对象
                });

                // 指定需要累加的字段
                const fieldsToSum = ['FruitSeries', 'NorSeries', 'QtSeries', 'YzSeries', 'YzzSeries', 'lowSeries', 'sum'];

                // 使用 reduce 方法计算合计
                const total = this.mergedDataList.reduce((acc, obj) => {
                    fieldsToSum.forEach(field => {
                        acc[field] = (acc[field] || 0) + (obj[field] || 0);
                    });
                    return acc;
                }, {});

                // 创建合计对象
                const totalObject = { cSiteName: "合计", ...total };

                // 将合计对象添加到原数组中
                this.mergedDataList.push(totalObject);


                //预设的分类数据
                const data = ['低温系列', '常温系列', '果汁系列', '椰子牛乳系列', '椰子汁系列','其它'];

                // 根据 cSiteName 分组
                const groupedData = {};
                this.dataList.forEach(item => {
                    if (!groupedData[item.cSiteName]) {
                        groupedData[item.cSiteName] = []; // 初始化为空数组 
                    }
                    groupedData[item.cSiteName].push(item); // 添加对象到对应的组
                });
                // console.log( 'groupedData', groupedData)


                // 检查每组，并添加缺失的分类
                for (const cSiteName in groupedData) {
                    const items = groupedData[cSiteName];
                    console.log('titems', items);
                    // 提取现有的 productClassPname 
                    const existingPnames = new Set(items.map(item => item.productClassPname));

                    // 将原有数据添加到 this.chartList 中 
                    this.chartList.push(...items);

                    // 检查 data 中每个分类是否存在 
                    data.forEach(pname => {
                        if (!existingPnames.has(pname)) {
                            // 如果不存在，新增一个对象，box 为0，其余字段相同 
                            this.chartList.push({ productClassPname: pname, box: 0, cSiteName: cSiteName });
                        }
                    });
                }
                // 使用 reduce 合并数组
                this.mergedDataListall = this.mergedDataListday.map(item2 => {
                    const matchingItem = this.mergedDataList.find(item1 => item1.cSiteName === item2.cSiteName);
                    return {
                        ...item2,
                        ...(matchingItem || {}) // 如果找到匹配项则合并，不找到则不合并 
                    };
                });

                //处理 array1 中未在 array2 中出现的对象
                this.mergedDataList.forEach(item1 => {
                    if (!this.mergedDataListday.some(item2 => item2.cSiteName === item1.cSiteName)) {
                        this.mergedDataListall.push(item1);
                    }
                });
                this.mergedDataListall = this.mergedDataListall.filter(item => item.cSiteName !== "合计").concat(this.mergedDataListall.filter(item => item.cSiteName === "合计"));
                // 输出结果
                console.log(this.mergedDataListall, 'all');
                // 按 sqname 字段排序  
                this.mergedDataListall.sort((a, b) => {
                    if (a.sqname < b.sqname) {
                        return -1; // a 在 b 前面  
                    }
                    if (a.sqname > b.sqname) {
                        return 1; // a 在 b 后面  
                    }
                    return 0; // 相等  
                });
                this.currentData = {
                    ...this.mergedDataListall
                };
                this.sizeChangeHandle(this.pageSize);

            })
        },
          // 每页数
          sizeChangeHandle(val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.currentData = this.mergedDataListall.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this
                .pageSize);
        },
        // 当前页
        handleCurrentChange(val) {
            console.log(val)
            this.currentPage = val;
            this.currentData = this.mergedDataListall.slice((val - 1) * this.pageSize, val * this.pageSize);
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
    font-size: 15px;
    background: #f5f7fa;
}


::v-deep .el-table th {
    background: #f5f7fa;
}
</style>