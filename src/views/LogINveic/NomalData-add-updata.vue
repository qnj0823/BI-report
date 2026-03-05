<template>
    <!-- 基于 Element UI 新增和修改弹窗 -->
    <el-dialog  title="新增-ADD" :close-on-click-modal="false" :visible.sync="visible"  :width="'80rem'" custom-class="center-dialog">
        <!-- 新增和创建表单表单 -->
        <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataSubmit()" label-width="450px">
            <el-table :data="dataList">
                <el-table-column :show-overflow-tooltip="true" align="center" prop="productCode" label="集团产品编码" />
                <el-table-column :show-overflow-tooltip="true" align="center" prop="factoryProductCode" label="工厂产品编码" />
                <el-table-column :show-overflow-tooltip="true" prop="factoryProductName" width="350" align="center" label="产品" />
                <el-table-column :show-overflow-tooltip="true" prop="wlSiteCode" align="center" label="光明物流站点编码" />
                <el-table-column :show-overflow-tooltip="true" prop="wlSiteName" align="center" label="光明物流站点" />
                <el-table-column :show-overflow-tooltip="true" prop="piece" align="center" label="数量(盒)">
                    <template #default="{ row }">
                        <el-input v-model="row.piece" type="number" @change="handleInputChange" />
                    </template>
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="vouchdate" align="center" label="订单日期">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="days" align="center" label="T几天到货" />
                <el-table-column :show-overflow-tooltip="true" prop="deliverydate" align="center" label="到货日期" />
            </el-table>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="Cancel()">取消</el-button>
            <el-button type="primary" @click="dataSubmit()">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import * as api from '@/api/frame/customer.js'

export default {
    props: {
        date: {
            type: String,       // 类型校验
            required: true      // 必传
        },
    },
    data() {
        return {
            constants: this.$constants,
            visible: false,
            exportList: [],
            dataForm: {
                areaName: '',
                deliverydate: '',//到货周期
                vouchdate: '',//下单日期
                factoryProductCode: '',
                factoryProductName: '',
                productCode: '',
                piece: '',
                wlSiteName: '',
                wlSiteCode: '',
                days: ''
            },
            addOrUpdateVisible: false,
            dataList: [{
                areaName: '四川',
                deliverydate: '',//到货周期
                vouchdate: '',//下单日期
                factoryProductCode: '10500063',
                factoryProductName: '950g噜渴原味酸奶饮品(常规版)',
                productCode: '1520100047',
                piece: '',
                wlSiteName: 'LOOK雨帆自提',
                wlSiteCode: '12117991',
                days: '8',
                createdate: ''

            }, {
                areaName: '四川',
                deliverydate: '',//到货周期
                vouchdate: '',//下单日期
                factoryProductCode: '10500064',
                factoryProductName: '950g噜渴原味酸奶饮品(宴席版)',
                productCode: '1520100048',
                piece: '',
                wlSiteName: 'LOOK雨帆自提',
                wlSiteCode: '12117991',
                days: '8',
                createdate: ''

            }, {
                areaName: '四川',
                deliverydate: '',//到货周期
                vouchdate: '',//下单日期
                factoryProductCode: '10500065',
                factoryProductName: '300ml噜渴原味酸奶饮品(常温-宴席版)',
                productCode: '1520100027',
                piece: '',
                wlSiteName: 'LOOK雨帆自提',
                wlSiteCode: '12117991',
                days: '8',
                createdate: ''

            }, {
                areaName: '四川',
                deliverydate: '',//到货周期
                vouchdate: '',//下单日期
                factoryProductCode: '10500066',
                factoryProductName: '300ml噜渴原味酸奶饮品(常温-经典版)',
                productCode: '1520100028',
                piece: '',
                wlSiteName: 'LOOK雨帆自提',
                wlSiteCode: '12117991',
                days: '8',
                createdate: ''
            }, {
                areaName: '四川',
                deliverydate: '',//到货周期
                vouchdate: '',//下单日期
                factoryProductCode: '10400018',
                factoryProductName: '328g噜渴零食有鸣定制常温酸奶饮品',
                productCode: '1520100055',
                piece: '',
                wlSiteName: 'LOOK雨帆自提',
                wlSiteCode: '12117991',
                days: '8',
                createdate: ''
            }, {
                areaName: '四川',
                deliverydate: '',//到货周期
                vouchdate: '',//下单日期
                factoryProductCode: '10500082',
                factoryProductName: '光明噜渴原味酸奶饮品(常温)300ml-1*12纸箱(藏文版)',
                productCode: '1520100062',
                piece: '',
                wlSiteName: 'LOOK雨帆自提',
                wlSiteCode: '12117991',
                days: '8',
                createdate: ''
            }, {
                areaName: '四川',
                deliverydate: '',//到货周期
                vouchdate: '',//下单日期
                factoryProductCode: '10500095',
                factoryProductName: '光明噜渴原味酸奶饮品(常温-宴席版)300g-1*12纸箱(成都)',
                productCode: '1520100064',
                piece: '',
                wlSiteName: 'LOOK雨帆自提',
                wlSiteCode: '12117991',
                days: '8',
                createdate: ''
            }, {
                areaName: '四川',
                deliverydate: '',//到货周期
                vouchdate: '',//下单日期
                factoryProductCode: '10500096',
                factoryProductName: '光明噜渴原味酸奶饮品(常温-常规版)300g-1*12纸箱(成都)',
                productCode: '1520100065',
                piece: '',
                wlSiteName: 'LOOK雨帆自提',
                wlSiteCode: '12117991',
                days: '8',
                createdate: ''
            }],
        }
    },
    created() {
        console.log(this.date)
        this.calculateCurrentYearDates(this.date);
    },
    mounted() {

    },
    methods: {

        // 获取今年的日期数据
        calculateCurrentYearDates(dateString) {
            // 1. 解析传入的日期字符串（yyyy-mm-dd）
            const [year, month, day] = dateString.split('-').map(Number);
            const baseDate = new Date(year, month - 1, day); // 月份需要减1，因为JS月份是0-11

            // 2. 获取当前月份的月初时间 
            const startOfMonthDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
            this.startOfMonth = this.formatDate(startOfMonthDate);

            // 3. 获取传入日期的格式化版本
            this.endOfToday = this.formatDate(baseDate);

            // 4. 计算传入日期 +8 天的日期
            const todayPlus8Days = new Date(baseDate);
            todayPlus8Days.setDate(baseDate.getDate() + 8); // 加 8 天
            this.endOfToday8 = this.formatDate(todayPlus8Days);

            // 5. 获取传入日期的当前时间（时分秒）
            this.endOfTodayTime = this.formatDateTime(baseDate);

            this.dataList = this.dataList.map(item => ({
                ...item,          // 保留其他字段
                vouchdate: this.endOfToday, // 日期部分（yyyy-mm-dd）
                createdate: this.endOfTodayTime, // 日期 + 时间（yyyy-mm-dd HH:mm:ss）
                deliverydate: this.endOfToday8 // 日期 +8 天（yyyy-mm-dd）
            }));
        },

        // 格式化日期（yyyy-MM-dd）
        formatDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1 
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },

        // 格式化日期 + 时间（yyyy-MM-dd HH:mm:ss）
        formatDateTime(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        },
        handleInputChange() {
            // 这里可以获取更新后的整个数组
            console.log(this.dataList);
            // 如果需要可以在这里触发其他操作
        },
        //取消
        Cancel() {
            this.visible = false
            this.$emit('close')
            this.$emit('refreshDataList')
        },

        init() { //初始化表单验证规则
            this.visible = true
        },
        // 表单数据提交
        dataSubmit() {
            this.dataList = this.dataList.filter(item => item.piece !== '' && item.piece != null);
            console.log(this.dataList);
            // 批量提交 dataList 中的所有对象
            const promises = this.dataList.map(item => {
                return api.NormalListaddAPI({
                    ...item            // 合并当前数组项的数据
                });
            });

            Promise.all(promises)
                .then(() => {
                    this.$emit('refreshDataList');
                    this.$emit('close');
                    this.$message.success('批量新增数据成功');
                    this.visible = false;
                })
                .catch(error => {
                    this.$message.error('提交失败: ' + error.message);
                });

            // api.NormalListaddAPI(this.dataForm).then(res => {
            //     // TODO 保存数据
            //     this.$emit('refreshDataList')
            //     this.$emit('close')
            //     this.$message.success('新增数据成功')
            //     this.visible = false
            // });
        }
    }
}
</script>