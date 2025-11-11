<template>
    <div class='wlreport'>
        <el-form :inline="true" style="margin-top: 10px;" :model="dataForm" @submit.native.prevent>
            <el-form-item>
                <el-date-picker v-model="dataForm.p_vouchdateend" value-format="yyyy-MM-dd" type="date"
                    placeholder="截至日期" clearable style="width: 100%"></el-date-picker>
            </el-form-item>

            <el-form-item>
                <el-input v-model="bullay" placeholder="模糊搜索" clearable @keyup.enter.native="searchEnterFun()"
                    ref="searchInput"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
                    @click="getDataList()">查询</el-button>
                <el-button size="mini" class="filter-item" type="primary"
                    @click="getDataList('湖南', '湖南雨帆噜渴乳业股份有限公司')">湖南</el-button>
                <!-- <el-button size="mini" class="filter-item" type="primary"
                    @click="getDataList('江西', '雨帆食品集团股份有限公司')">江西</el-button> -->
                <el-button size="mini" class="filter-item" type="primary" @click="getGuangxi">广西</el-button>
                <el-button size="mini" class="filter-item" type="primary" @click="getsichuan">四川</el-button>
                <el-button size="mini" class="filter-item" type="primary" @click="getchingqin">重庆</el-button>
                <el-button size="mini" class="filter-item" type="primary" @click="getyunnan">云南</el-button>
                <el-button size="mini" class="filter-item" type="primary" @click="getguizhou">贵州</el-button>
                <el-button size="mini" class="filter-item" type="primary" @click="getshanghai">浙江</el-button>
                <el-button size="mini" class="filter-item" type="primary" @click="getfujian">福建</el-button>
                <el-button size="mini" class="filter-item" type="primary" @click="getjiangsu">江苏</el-button>
                <el-button size="mini" class="filter-item" type="primary" @click="getshandong">山东</el-button>
                <!-- <el-button size="mini" class="filter-item" type="primary" @click="getanhui">安徽</el-button> -->
                <!-- <el-button size="mini" class="filter-item" type="primary" @click="getshanghai">上海</el-button> -->
                <el-button size="mini" class="filter-item" type="warning" icon="el-icon-download" @click="exportData"
                    v-if="showExportButton">导出</el-button>
                <el-button size="mini" class="filter-item" type="primary" @click="calculate">计算(湖南)</el-button>
                <el-button size="mini" class="filter-item" type="primary" @click="calculateXInan">计算(西南)</el-button>
                <el-button size="mini" class="filter-item" type="primary" @click="calculateZJ">计算(浙江)</el-button>
                <el-button size="mini" class="filter-item" type="primary" @click="calculateFJ">计算(福建)</el-button>
                <el-button size="mini" class="filter-item" type="primary" @click="calculateGX">计算(广西)</el-button>
                <el-button size="mini" class="filter-item" type="primary" @click="calculateJS">计算(江苏)</el-button>
                <!-- <el-button size="mini" class="filter-item" type="primary" @click="calculateAH">计算(安徽)</el-button> -->
            </el-form-item>
        </el-form>
        <div class="test">{{ this.labelText }}</div>
        <el-table border ref="table" v-loading="dataListLoading" :data="dataList" style="width: 100%;">
            <!-- <el-table-column v-if="['四川'].includes(areas)" :show-overflow-tooltip="true" align="center" prop="linename"
                label="客户分类" /> -->
            <el-table-column :show-overflow-tooltip="true" align="center" width="150" prop="wlSiteName" label="区域" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100001" label="大LOOK" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100002" label="小LOOK" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100004" label="健能" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100008" label="LOOK优选" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100010" label="大白桃" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100009" label="小白桃" />
            <el-table-column v-if="['四川', '重庆', '云南', '贵州'].includes(areas)" :show-overflow-tooltip="true"
                align="center" prop="box1520100012" label="大清新" />
            <el-table-column v-if="['四川', '重庆', '云南', '贵州'].includes(areas)" :show-overflow-tooltip="true"
                align="center" prop="box1520100011" label="小清新" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100014" label="大清新健爽(橙)" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100015" label="小清新健爽(橙)" />
            <el-table-column v-if="areas == '广西'" :show-overflow-tooltip="true" align="center" prop="box1520130001"
                label="330椰子牛乳" />
            <el-table-column v-if="areas == '广西'" :show-overflow-tooltip="true" align="center" prop="box1520130003"
                label="310椰子牛乳" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100017" label="大0糖0脂" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100016" label="小0糖0脂" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100052" label="200鲜酪乳" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100053" label="450鲜酪乳" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100051" label="180健爽" />
            <el-table-column v-if="!['四川', '重庆', '云南', '贵州'].includes(areas)" :show-overflow-tooltip="true"
                align="center" prop="box1520100020" label="小原味戴永红" />
            <el-table-column v-if="!['四川', '重庆', '云南', '贵州'].includes(areas)" :show-overflow-tooltip="true"
                align="center" prop="box1520100021" label="小原味绿叶水果" />
            <el-table-column v-if="!['四川', '重庆', '云南', '贵州'].includes(areas)" :show-overflow-tooltip="true"
                align="center" prop="box1520110069" label="新鲜牧场" />
            <el-table-column v-if="!['四川', '重庆', '云南', '贵州'].includes(areas)" :show-overflow-tooltip="true"
                align="center" prop="box1520100025" label="180噜渴(白)" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="box1520100026" label="180噜渴(红)" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="sum" label="合计" />
            <el-table-column :show-overflow-tooltip="true" align="center" prop="vnote" label="备注" />
        </el-table>
    </div>
</template>

<script>
import {
    exportExcel
} from './LogisArrivedExpro.js'

import {
    exportExcelgx
} from './LogisArrivedgxExpro.js'

import {
    exportExcelzj
} from './LogisArrivedzjExpro.js'

import {
    exportExceljs
} from './LogisArrivedjsExpro.js'

import {
    exportExcelfj
} from './LogisArrivedfjExpro.js'

import {
    exportscExcel
} from './LogisArrivedscExpro.js'
import {
    exportscTwoExcel
} from './LogisArrivedscTwoExpro.js'

import * as api from '@/api/frame/customer.js'

export default {
    name: 'wlreport-page',
    data() {
        return {
            msg: 'wlreport-page',
            showExportButton: false,
            bullay: '',
            dataForm: {
                p_vouchdateend: '',
                p_areaname: '',
                p_orgname: ''
            },
            guangxiForm: {
                p_vouchdateend: '',
                p_areaname: '广西',
                p_orgname: '雨帆食品集团股份有限公司'
            },
            guangxiCalForm: {
                p_vouchdatecur: '',
                p_vouchdateend: '',
                p_areaname: '广西',
                p_orgname: '雨帆食品集团股份有限公司'
            },
            hainanForm: {
                p_vouchdateend: '',
                p_areaname: '海南',
                p_orgname: '雨帆食品集团股份有限公司'
            },
            sichuanForm: {
                p_vouchdateend: '',
                p_areaname: '四川',
                p_orgname: '雨帆食品集团股份有限公司'
            },
            sichuanTwoForm: {
                p_vouchdatecur: '',
                p_areaname: '四川',
                p_orgname: '雨帆食品集团股份有限公司'
            },
            chongqingForm: {
                p_vouchdateend: '',
                p_areaname: '重庆',
                p_orgname: '雨帆食品集团股份有限公司'
            },
            yunnanForm: {
                p_vouchdateend: '',
                p_areaname: '云南',
                p_orgname: '雨帆食品集团股份有限公司'
            },
            guizhouForm: {
                p_vouchdateend: '',
                p_areaname: '贵州',
                p_orgname: '雨帆食品集团股份有限公司'
            },
            zhejiangForm: {
                p_vouchdateend: '',
                p_areaname: '浙江',
                p_orgname: '雨帆食品集团股份有限公司'
            },
            zhejiangForm1: {
                p_vouchdateend: '',
                p_areaname: '浙江',
                p_orgname: '雨帆食品集团股份有限公司'
            },
            fujianForm: {
                p_vouchdateend: '',
                p_areaname: '福建',
                p_orgname: '雨帆食品集团股份有限公司'
            },
            jiangsuForm: {
                p_vouchdateend: '',
                p_areaname: '江苏',
                p_orgname: '雨帆食品集团股份有限公司'
            },
            shandongForm: {
                p_vouchdateend: '',
                p_areaname: '山东',
                p_orgname: '雨帆食品集团股份有限公司'
            },
            fujianForm1: {
                p_vouchdateend: '',
                p_areaname: '福建',
                p_orgname: '雨帆食品集团股份有限公司'
            },
            shanghaiForm: {
                p_vouchdateend: '',
                p_areaname: '上海',
                p_orgname: '雨帆食品集团股份有限公司'
            },
            anhuiForm: {
                p_vouchdateend: '',
                p_areaname: '安徽',
                p_orgname: '雨帆食品集团股份有限公司'
            },
            anhuiCalForm: {
                p_vouchdatecur: '',
                p_vouchdateend: '',
                p_areaname: '安徽',
                p_orgname: '雨帆食品集团股份有限公司'
            },

            siteForm: {
                p_areaname: ''
            },

            areas: '',
            dataList: [],
            dataList1: [],
            proList: [],
            siteList: [],
            newArray: [],
            hainanList: [],
            hnDateList: [],
            wlDataList: [],
            wlDataList1: [],
            sichuanList: [],
            gxNoSpecialList: [],

            dateLable: '',
            dataListLoading: false,
            dictForm: {
                page: 0,
                size: 800,
                sort: '',
            },
            wlForm: {
                blurry: ''
            },
            calForm: {
                p_vouchdateend: ''
            },
            GXDataList: [
                {
                    oldsite: ['桂桂林全州斌丽', '桂桂林资源荣熙', '桂桂林兴安美思'],
                    newsite: '桂桂林振兴'
                }, {
                    oldsite: ['桂贵港平南明威'],
                    newsite: '桂贵港雨顺'
                }, {
                    oldsite: ['桂南宁江南众焱'],
                    newsite: '桂南宁青秀永明福'
                }, {
                    oldsite: ['桂百色田东冠程', '桂南宁良庆福润'],
                    newsite: '桂百色平果牛牛顺'
                }
            ],
            GXDataList1: [
                {
                    oldsite: ['桂南宁宾阳汇成', '桂南宁横县湘旺', '桂南宁上林海硕']
                }
            ],
            GXDataList2: [
                {
                    oldsite: ['桂贺州富川聚益', '桂贺州钟山小何']
                },
            ],
            GXDataList3: [
                {
                    oldsite: ['桂柳州柳北李建重', '桂柳州城中严明高'],
                    newsite: '桂柳州米德'
                }, {
                    oldsite: ['桂南宁宾阳汇成', '桂南宁上林海硕'],
                    newsite: '桂南宁横县湘旺'
                }
            ],
            GXfinalResult: [],
            FJDataList: [
                {
                    oldsite: ['闽漳州东山昱阳食品'],
                    newsite: '闽漳州云霄协辉食品'
                }, {
                    oldsite: ['闽厦门朴朴李西华'],
                    newsite: '闽厦门湖里李西华'
                }, {
                    oldsite: ['闽龙岩永定凯哥商行'],
                    newsite: '闽龙岩新罗姜楠'
                }, {
                    oldsite: ['闽漳州南靖余艺强'],
                    newsite: '闽漳州龙海华慕华平和'
                }, {
                    oldsite: ['闽三明沙县噜渴食品', '闽三明尤溪合盛酒水', '三明大田县', '连城县', '闽三明宁化向德洪', '闽三明宁化义捷', '闽三明永安松鼠百货'],
                    newsite: '闽三明三元辰诺食品'
                }, {
                    oldsite: ['闽泉州南安柳城乐鲜水头镇'],
                    newsite: '闽泉州晋江安海'
                }, {
                    oldsite: ['闽莆田涵江友善乳制涵江', '闽莆田涵江友善乳制莆田江口'],
                    newsite: '闽莆田涵江友善乳制'
                }, {
                    oldsite: ['闽宁德福鼎鑫中贸易', '闽宁德福鼎长旺食品', '闽宁德寿宁龚继魁'],
                    newsite: '闽宁德蕉城宝丽信'
                }, {
                    oldsite: ['闽龙岩永定凯哥商行', '闽龙岩漳平陈小兰', '闽龙岩长汀杰杰高'],
                    newsite: '闽龙岩新罗姜楠'
                }, {
                    oldsite: ['闽福州台江区松旺', '闽福州晋安三金源'],
                    newsite: '闽福州鼓楼晟嘉枫锦'
                }, {
                    oldsite: ['闽福州仓山恒佑源仓山特渠', '闽福州平潭圣荣', '闽福州平潭三金源平潭流水镇', '闽福州马尾酒源', '闽福州永泰军顶贸易', '闽宁德古田绿品汇', '闽南平邵武齐创贸易', '闽南平武夷瑜戈食品', '闽南平武夷山恒诚副食品商行', '闽南平建瓯羽晨'],
                    newsite: '闽福州仓山恒佑源'
                }
            ],
            FJDataList1: [
                {
                    oldsite: ['闽漳州云霄协辉食品', '闽漳州漳州轩恒贸易']
                }
            ],
            FJfinalResult: [],
            JSfinalResult: [],
            JSDataList1: [{
                oldsite: ['苏苏州昆山玉山', '苏苏州太仓贾旭东'],
            }],
            JSDataList: [
                {
                    oldsite: ['苏苏州吴中何伟', '苏苏州园区杨圣召', '苏苏州吴江李海军', '苏苏州虎丘杨振武'],
                    newsite: '苏苏州吴中邱裕铭'
                },
                {
                    oldsite: ['苏苏州直营部'],
                    newsite: '苏苏州相城田君'
                },
                {
                    oldsite: ['苏常州钟楼葛树胜'],
                    newsite: '苏常州武进澜鑫'
                },
                {
                    oldsite: ['苏常州市区直营', '苏常州溧阳赵宇', '苏常州金坛张志良', '苏常州天宁刘正'],
                    newsite: '苏常州新北正良原食品'
                },
                {
                    oldsite: ['苏无锡惠山陈君'],
                    newsite: '苏无锡锡山瑞宝'
                },
                {
                    oldsite: ['苏南京袁国旗', '苏南京江宁优润'],
                    newsite: '苏南京江宁君一诺'
                },
                {
                    oldsite: ['苏南京恒缘丰', '苏南京江北聚帆', '苏南京溧水依依'],
                    newsite: '苏南京建邺雨花鹏誉'
                },
                {
                    oldsite: ['苏南京浦口吉顺', '苏南京栖霞博源久'],
                    newsite: '苏南京秦淮鼓楼米米'
                },
                {
                    oldsite: ['苏镇江丁卯帆之雨'],
                    newsite: '苏无锡新腾百货'
                },
                {
                    oldsite: ['苏泰州姜堰熠辉', '苏泰州兴化熠辉王凯'],
                    newsite: '苏泰州熠辉'
                },
            ],
            ZJDataList: [
                {
                    oldsite: ['浙温州永嘉玉熙'],
                    newsite: '浙温州瓯海站前领域'
                },
                {
                    oldsite: ['浙衢州江山志成', '浙衢州开化慧琴', '浙衢州常山承运'],
                    newsite: '浙衢州金满堂'
                }, {
                    oldsite: ['浙金华浦江众鑫'],
                    newsite: '浙金华义乌晖汉'
                }, {
                    oldsite: ['浙杭州上城紫芸'],
                    newsite: '浙杭州城北噜可'
                }, {
                    oldsite: ['沪浦东新区金桥齐晟'],
                    newsite: '沪浦东新区新函'
                }
            ],
            ZJDataList1: [
                {
                    oldsite: ['浙杭州江干怡明', '浙杭州西湖轩康'],
                },
                {
                    oldsite: ['浙台州温岭琪权', '浙台州玉环噜渴'],
                }
            ],
            zjfinalResult: [],
        };
    },
    mounted() {
        this.getDataList()
        this.wlpersonList()
        // this.getproductList()
    },
    created() {
        this.calculateDates();
    },
    methods: {
        //四川
        getsichuan() {
            this.dataListLoading = true
            this.showExportButton = false
            this.areas = '四川'
            this.sichuanForm.p_vouchdateend = this.dataForm.p_vouchdateend
            this.sichuanTwoForm.p_vouchdatecur = this.dataForm.p_vouchdateend
            const [year, month, day] = this.dataForm.p_vouchdateend.split('-').map(Number);
            this.labelText = `${this.areas}区域到货明细表--截止${year}年${month}月${day}日`; // 如果没有选择日期，显示默认文本
            api.wlarrivedsichuanApi(this.sichuanForm).then(res => {
                this.dataList = res
                console.log(this.dataList, '四川')
                this.dataList = this.mergeBoxFields(this.dataList)
                this.dataList = this.dataList.map(item => ({
                    ...item, // 展开原对象的所有属性
                    ["box" + item.productCode]: item.box // 新增动态属性
                }));

                ///数据合并（根据wlSiteCode分组）
                this.dataList = this.mergeDataList(this.dataList);
                //计算小计
                this.dataList = this.dataList.map(item => {
                    let sum = 0;
                    for (const key in item) {
                        // 跳过保留字段
                        if (['areaName', 'days', 'wlSiteCode', 'wlSiteName'].includes(key)) continue;
                        // 其他字段转为数字并累加
                        sum += Number(item[key]) || 0;
                    }
                    // 返回新对象（保留原字段 + 新增 sum）
                    return { ...item, sum };
                });

                // 去除开头的数字
                this.dataList = this.dataList.map(item => ({
                    ...item,
                    linename: item.linename.replace(/^\d+/, '') // 替换开头的数字
                }));
                //相同排序在一起
                this.dataList.sort((a, b) => {
                    if (a.linename < b.linename) return -1;
                    if (a.linename > b.linename) return 1;
                    return 0;
                });


                console.log(this.dataList, 'this.dataList四川')
                //计算总计
                this.calculateTotals(this.dataList, {
                    excludeFields: ['vcol6_name', 'vcol6_code', 'vcol2_name', 'vcol2', 'vnote'],
                    totalFields: {
                        vcol2_name: "总计",
                        wlSiteCode: "TOTAL",
                        wlSiteName: "总计",
                        days: 0
                    },
                    addToOriginal: true
                })
                // this.calculateTotals(this.dataList);
                this.dataList = this.groupAndSumWithTotal(this.dataList);
                api.wlarrivedbuildApi(this.sichuanTwoForm).then(res => {
                    console.log(res, '二次物流')
                    this.sichuanList = res
                    this.sichuanList = this.mergeBoxFields(this.sichuanList)
                    this.sichuanList = this.sichuanList.map(item => ({
                        ...item, // 展开原对象的所有属性
                        ["box" + item.productCode]: item.box // 新增动态属性
                    }));

                    ///数据合并（根据wlSiteCode分组）
                    this.sichuanList = this.mergeDataList(this.sichuanList);
                    //计算小计
                    this.sichuanList = this.sichuanList.map(item => {
                        let sum = 0;
                        for (const key in item) {
                            // 跳过保留字段
                            if (['areaName', 'days', 'wlSiteCode', 'wlSiteName'].includes(key)) continue;
                            // 其他字段转为数字并累加
                            sum += Number(item[key]) || 0;
                        }
                        // 返回新对象（保留原字段 + 新增 sum）
                        return { ...item, sum };
                    });
                    //计算总计
                    this.calculateTotals(this.sichuanList, {
                        excludeFields: ['vcol6_name', 'vcol6_code', 'vcol2_name', 'vcol2', 'vnote'],
                        totalFields: {
                            vcol2_name: "总计",
                            wlSiteCode: "TOTAL",
                            wlSiteName: "总计",
                            days: 0
                        },
                        addToOriginal: true
                    })
                    this.dataListLoading = false
                    this.showExportButton = true
                })

            })
        },
        groupAndSumWithTotal(arr) {
            const result = [];
            const groups = {};
            const totalItems = [];

            // 首先分离出总计对象和普通对象
            arr.forEach(item => {
                if (item.wlSiteName === '总计') {
                    totalItems.push(item);
                } else {
                    const linename = item.linename;
                    if (!groups[linename]) {
                        groups[linename] = [];
                    }
                    groups[linename].push(item);
                }
            });

            // 对每个分组进行处理
            Object.keys(groups).forEach(linename => {
                const groupItems = groups[linename];

                // 添加原始对象
                result.push(...groupItems);

                // 创建汇总对象
                const summary = {
                    linename: `${linename}汇总`,
                    wlSiteName: `${linename}汇总`  // wlSiteName 取 linename 的值
                };

                // 收集所有可能的数字字段（遍历所有对象）
                const allNumberFields = new Set();

                // 首先收集所有可能的数字字段
                groupItems.forEach(item => {
                    Object.keys(item).forEach(key => {
                        if (key !== 'linename' && key !== 'wlSiteName' && typeof item[key] === 'number') {
                            allNumberFields.add(key);
                        }
                    });
                });

                // 计算所有数值字段的总和
                allNumberFields.forEach(key => {
                    summary[key] = groupItems.reduce((sum, item) => {
                        // 安全地获取值，如果字段不存在或不是数字，则视为0
                        const value = item[key];
                        return sum + (typeof value === 'number' ? value : 0);
                    }, 0);
                });

                result.push(summary);
            });

            // 最后添加总计对象
            result.push(...totalItems);

            return result;
        },
        mergeBoxFields(data) {
            const result = [];
            const map = new Map();

            // 遍历数组，按 wlSiteName 和 productCode 分组
            for (const item of data) {
                const key = `${item.wlSiteName}_${item.productCode}`;
                if (!map.has(key)) {
                    // 如果是新组合，直接添加到 map 中
                    map.set(key, {
                        ...item,
                        box: Number(item.box) || 0 // 转为数字，避免非数字情况
                    });
                } else {
                    // 如果已存在，合并 box 字段
                    const existing = map.get(key);
                    existing.box += Number(item.box) || 0;
                }
            }

            // 将 map 中的值转为数组
            return Array.from(map.values());
        },
        mergeBoxFieldsShandong(data) {
            const result = [];
            const map = new Map();

            // 遍历数组，按 wlSiteName 和 productCode 分组
            for (const item of data) {
                const key = `${item.vcol2Name}_${item.cproductcode}`;
                if (!map.has(key)) {
                    // 如果是新组合，直接添加到 map 中
                    map.set(key, {
                        ...item,
                        box: Number(item.box) || 0 // 转为数字，避免非数字情况
                    });
                } else {
                    // 如果已存在，合并 box 字段
                    const existing = map.get(key);
                    existing.box += Number(item.box) || 0;
                }
            }

            // 将 map 中的值转为数组
            return Array.from(map.values());
        },
        //安徽
        getanhui() {
            this.dataListLoading = true
            this.showExportButton = false
            this.areas = '安徽'
            this.anhuiForm.p_vouchdateend = this.dataForm.p_vouchdateend
            const [year, month, day] = this.dataForm.p_vouchdateend.split('-').map(Number);
            this.labelText = `${this.areas}区域到货明细表--截止${year}年${month}月${day}日`; // 如果没有选择日期，显示默认文本
            api.wlarrivedApi(this.anhuiForm).then(res => {
                this.dataList = res
                this.dataList = this.mergeBoxFields(this.dataList)
                this.dataList = this.dataList.map(item => ({
                    ...item, // 展开原对象的所有属性
                    ["box" + item.productCode]: item.box // 新增动态属性
                }));
                ///数据合并（根据wlSiteCode分组）
                this.dataList = this.mergeDataList(this.dataList);
                //计算小计
                this.dataList = this.dataList.map(item => {
                    let sum = 0;
                    for (const key in item) {
                        // 跳过保留字段
                        if (['areaName', 'days', 'wlSiteCode', 'wlSiteName'].includes(key)) continue;
                        // 其他字段转为数字并累加
                        sum += Number(item[key]) || 0;
                    }
                    // 返回新对象（保留原字段 + 新增 sum）
                    return { ...item, sum };
                });
                //计算总计
                this.calculateTotals(this.dataList, {
                    excludeFields: ['vcol6_name', 'vcol6_code', 'vcol2_name', 'vcol2', 'vnote'],
                    totalFields: {
                        vcol2_name: "总计",
                        wlSiteCode: "TOTAL",
                        wlSiteName: "总计",
                        days: 0
                    },
                    addToOriginal: true
                })
                // this.calculateTotals(this.dataList);
                this.dataListLoading = false
                this.showExportButton = true
                console.log(this.dataList, 'this.dataList')
            })
        },
        //重庆
        getchingqin() {
            this.dataListLoading = true
            this.showExportButton = false
            this.areas = '重庆'
            this.chongqingForm.p_vouchdateend = this.dataForm.p_vouchdateend
            const [year, month, day] = this.dataForm.p_vouchdateend.split('-').map(Number);
            this.labelText = `${this.areas}区域到货明细表--截止${year}年${month}月${day}日`; // 如果没有选择日期，显示默认文本
            api.wlarrivedApi(this.chongqingForm).then(res => {
                this.dataList = res
                this.dataList = this.mergeBoxFields(this.dataList)
                this.dataList = this.dataList.map(item => ({
                    ...item, // 展开原对象的所有属性
                    ["box" + item.productCode]: item.box // 新增动态属性
                }));
                ///数据合并（根据wlSiteCode分组）
                this.dataList = this.mergeDataList(this.dataList);
                //计算小计
                this.dataList = this.dataList.map(item => {
                    let sum = 0;
                    for (const key in item) {
                        // 跳过保留字段
                        if (['areaName', 'days', 'wlSiteCode', 'wlSiteName'].includes(key)) continue;
                        // 其他字段转为数字并累加
                        sum += Number(item[key]) || 0;
                    }
                    // 返回新对象（保留原字段 + 新增 sum）
                    return { ...item, sum };
                });
                //计算总计
                this.calculateTotals(this.dataList, {
                    excludeFields: ['vcol6_name', 'vcol6_code', 'vcol2_name', 'vcol2', 'vnote'],
                    totalFields: {
                        vcol2_name: "总计",
                        wlSiteCode: "TOTAL",
                        wlSiteName: "总计",
                        days: 0
                    },
                    addToOriginal: true
                })
                // this.calculateTotals(this.dataList);
                this.dataListLoading = false
                this.showExportButton = true
                console.log(this.dataList, 'this.dataList')
            })
        },
        //云南
        getyunnan() {
            this.dataListLoading = true
            this.showExportButton = false
            this.areas = '云南'
            this.yunnanForm.p_vouchdateend = this.dataForm.p_vouchdateend
            const [year, month, day] = this.dataForm.p_vouchdateend.split('-').map(Number);
            this.labelText = `${this.areas}区域到货明细表--截止${year}年${month}月${day}日`; // 如果没有选择日期，显示默认文本
            api.wlarrivedApi(this.yunnanForm).then(res => {
                this.dataList = res
                this.dataList = this.mergeBoxFields(this.dataList)
                this.dataList = this.dataList.map(item => ({
                    ...item, // 展开原对象的所有属性
                    ["box" + item.productCode]: item.box // 新增动态属性
                }));
                ///数据合并（根据wlSiteCode分组）
                this.dataList = this.mergeDataList(this.dataList);
                //计算小计
                this.dataList = this.dataList.map(item => {
                    let sum = 0;
                    for (const key in item) {
                        // 跳过保留字段
                        if (['areaName', 'days', 'wlSiteCode', 'wlSiteName'].includes(key)) continue;
                        // 其他字段转为数字并累加
                        sum += Number(item[key]) || 0;
                    }
                    // 返回新对象（保留原字段 + 新增 sum）
                    return { ...item, sum };
                });
                //计算总计
                this.calculateTotals(this.dataList, {
                    excludeFields: ['vcol6_name', 'vcol6_code', 'vcol2_name', 'vcol2', 'vnote'],
                    totalFields: {
                        vcol2_name: "总计",
                        wlSiteCode: "TOTAL",
                        wlSiteName: "总计",
                        days: 0
                    },
                    addToOriginal: true
                })
                // this.calculateTotals(this.dataList);
                this.dataListLoading = false
                this.showExportButton = true
                console.log(this.dataList, 'this.dataList')
            })
        },
        //贵州
        getguizhou() {
            this.dataListLoading = true
            this.showExportButton = false
            this.areas = '贵州'
            this.guizhouForm.p_vouchdateend = this.dataForm.p_vouchdateend
            const [year, month, day] = this.dataForm.p_vouchdateend.split('-').map(Number);
            this.labelText = `${this.areas}区域到货明细表--截止${year}年${month}月${day}日`; // 如果没有选择日期，显示默认文本
            api.wlarrivedApi(this.guizhouForm).then(res => {
                this.dataList = res
                this.dataList = this.mergeBoxFields(this.dataList)
                this.dataList = this.dataList.map(item => ({
                    ...item, // 展开原对象的所有属性
                    ["box" + item.productCode]: item.box // 新增动态属性
                }));
                ///数据合并（根据wlSiteCode分组）
                this.dataList = this.mergeDataList(this.dataList);
                //计算小计
                this.dataList = this.dataList.map(item => {
                    let sum = 0;
                    for (const key in item) {
                        // 跳过保留字段
                        if (['areaName', 'days', 'wlSiteCode', 'wlSiteName'].includes(key)) continue;
                        // 其他字段转为数字并累加
                        sum += Number(item[key]) || 0;
                    }
                    // 返回新对象（保留原字段 + 新增 sum）
                    return { ...item, sum };
                });
                //计算总计
                this.calculateTotals(this.dataList, {
                    excludeFields: ['vcol6_name', 'vcol6_code', 'vcol2_name', 'vcol2', 'vnote'],
                    totalFields: {
                        vcol2_name: "总计",
                        wlSiteCode: "TOTAL",
                        wlSiteName: "总计",
                        days: 0
                    },
                    addToOriginal: true
                })
                // this.calculateTotals(this.dataList);
                this.dataListLoading = false
                this.showExportButton = true
                console.log(this.dataList, 'this.dataList')
            })
        },
        //浙江
        getzhejiang() {
            this.areas = '浙江'
            this.wlForm.blurry = this.areas
            this.dataListLoading = true
            this.showExportButton = false
            const [year, month, day] = this.dataForm.p_vouchdateend.split('-').map(Number);
            this.labelText = `${this.areas}区域到货明细表--截止${year}年${month}月${day}日`; // 如果没有选择日期，显示默认文本
            this.dateLable = `${month}月${day}日`
            console.log(this.dateLable)
            this.zhejiangForm.p_vouchdateend = this.dataForm.p_vouchdateend
            //转时间
            const date = new Date(this.dataForm.p_vouchdateend);
            date.setDate(date.getDate() - 2);
            // this.hainanForm.p_vouchdateend = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            this.hainanForm.p_vouchdateend = this.dataForm.p_vouchdateend

            api.WlsiteAndContactsAPI(this.wlForm).then(res => {
                console.log(res, 'res6666')
                this.wlDataList = res
                this.wlDataList = this.wlDataList.filter(item => item.areaName == '浙江');
                api.wlarrivedApi(this.zhejiangForm).then(res => {
                    this.dataList = res
                    this.dataList = this.mergeBoxFields(this.dataList)
                    this.dataList = this.mergeObjectsByCodes(this.dataList);
                    this.dataList = this.dataList.map(item => ({
                        ...item, // 展开原对象的所有属性
                        ["box" + item.productCode]: item.box // 新增动态属性
                    }));
                    this.dataList = Object.values(
                        this.dataList.reduce((acc, item) => {
                            const key = item.wlSiteCode; // 使用 wlSiteCode 作为分组依据

                            if (!acc[key]) {
                                // 初始化新对象，并删除不合并的字段
                                acc[key] = { ...item }; // 先复制所有字段

                                // 删除不合并的字段
                                const fieldsToRemove = [
                                    'box',
                                    'deliverydate',
                                    'factoryProductCode',
                                    'factoryProductName',
                                    'piece',
                                    'productCode',
                                    'vouchdate',
                                    'tel'
                                ];
                                fieldsToRemove.forEach(field => delete acc[key][field]);
                            } else {
                                // 合并其他字段（如 jtProductCode）
                                Object.keys(item).forEach(field => {
                                    // 如果字段不在排除列表，则合并
                                    if (![
                                        'wlSiteCode',
                                        'box',
                                        'deliverydate',
                                        'factoryProductCode',
                                        'factoryProductName',
                                        'piece',
                                        'productCode',
                                        'vouchdate'
                                    ].includes(field)) {
                                        acc[key][field] = item[field]; // 后出现的值会覆盖前面的
                                    }
                                });
                            }

                            return acc;
                        }, {})
                    );
                    this.dataList = this.dataList.map(item => {
                        let sum = 0;
                        for (const key in item) {
                            // 跳过保留字段
                            if (['areaName', 'days', 'wlSiteCode', 'wlSiteName', 'tel', 'address', 'contacts'].includes(key)) continue;
                            // 其他字段转为数字并累加
                            sum += Number(item[key]) || 0;
                        }
                        // 返回新对象（保留原字段 + 新增 sum）
                        return { ...item, sum };
                    });

                    // 初始化总计对象
                    const totalObj = {
                        areaName: "浙江总计",
                        contacts: '浙江总计',
                        tel: '浙江总计',
                        days: 0,
                        wlSiteCode: "TOTAL",
                        wlSiteName: "浙江总计"
                    };

                    // 遍历数组中的每个对象
                    this.dataList.forEach(item => {
                        // 遍历每个对象的属性
                        Object.keys(item).forEach(key => {
                            // 跳过不需要求和的字段
                            if (['areaName', 'days', 'wlSiteCode', 'wlSiteName', 'tel', 'contacts', 'vnote'].includes(key)) {
                                return;
                            }

                            // 初始化总计对象中的字段（如果不存在）
                            if (!totalObj.hasOwnProperty(key)) {
                                totalObj[key] = 0;
                            }

                            // 将值转为数字并累加
                            const value = Number(item[key]) || 0;
                            totalObj[key] += value;
                        });

                        // 累加days字段（如果需要）
                        totalObj.days += Number(item.days) || 0;
                    });

                    // 将总计对象添加到原数组（如果需要）
                    this.dataList.push(totalObj);


                    this.dataList = this.dataList.map(dataItem => {
                        // 在wlDataList中查找匹配的对象
                        const matchedItem = this.wlDataList.find(wlItem =>
                            wlItem.wlSiteName === dataItem.wlSiteName
                        );

                        // 如果找到匹配项，则添加需要的字段
                        if (matchedItem) {
                            return {
                                ...dataItem, // 保留原有属性
                                address: matchedItem.address, // 添加address
                                contacts: matchedItem.contacts, // 添加contacts
                                tel: matchedItem.tel // 添加tel
                            };
                        }

                        // 如果没有找到匹配项，返回原对象
                        return dataItem;
                    });
                    console.log(this.dataList, '第二张表')
                    // const filteredResult = [
                    //     { oldsite: '浙温州瓯海站前领域', newsite: '浙温州永嘉玉熙' },
                    //     { oldsite: '浙杭州上城紫芸', newsite: '浙杭州城北噜可' },
                    //     { oldsite: '浙衢州金满堂', newsite: '浙温州永嘉玉熙' },
                    //     { oldsite: '浙衢州金满堂', newsite: '浙温州永嘉玉熙2' }
                    // ];
                    //第二个特殊
                    const matchedResults = this.matchAndAddSortFields(this.dataList, this.ZJDataList1);

                    const matresult = this.processGroupsBySum(matchedResults);

                    console.log(matchedResults, 'matchedResults')

                    const filteredSites = this.filterSites(this.ZJDataList, this.dataList);
                    const filteredResult = this.filterByNewsiteMatch(filteredSites, this.dataList);
                    const onderList = this.matchSitesToOnderList(filteredResult, this.dataList);

                    const transformedArray = this.transformFilteredResult(filteredResult);
                    const calculatedList = this.sortAndCalculateOnderList(onderList, transformedArray);

                    const uniqueArray = Array.from(
                        new Map(
                            calculatedList.map(item => [item.wlSiteName, item])
                        ).values()
                    );

                    this.zjfinalResult = this.calculateGroupTotals(uniqueArray);
                    console.log(matresult, 'matresult')

                    // 如果 zjfinalResult 可能为 undefined，先初始化
                    this.zjfinalResult = this.zjfinalResult || [];

                    // 将 matresult 数组元素添加到 zjfinalResult
                    this.zjfinalResult.push(...matresult);

                    console.log(filteredSites, '完整1')
                    console.log(filteredResult, '完整2')
                    console.log(onderList, '完整3')
                    console.log(transformedArray, '完整4')
                    console.log(calculatedList, '完整5')
                    console.log(this.zjfinalResult, '完整6')
                    this.dataList = this.zhejianData2(this.dataList)
                    this.dataList = this.zhejianData2_1(this.dataList)
                    this.dataList = this.zhejianData1(this.dataList)
                    this.dataList = this.zhejianData1_1(this.dataList)
                    this.dataList = this.zhejianData1_2(this.dataList)
                    this.dataList = this.zhejianData1_3(this.dataList)
                    this.dataList = this.zhejianData1_4(this.dataList)
                    this.dataList = this.zhejianData1_5(this.dataList)

                    // 直接修改原数组
                    this.dataList.forEach((item, index) => {
                        // 如果不是最后三个元素，则添加 startDate
                        if (index < this.dataList.length - 1) {
                            item.startDate = this.dateLable;
                        }
                    });
                    this.dataList = this.dataList.filter(item =>
                        item.wlSiteName.includes(this.bullay)
                    );
                    this.dataList.push(...this.dataList1)
                    this.mergeAndSumData()

                    console.log(this.dataList, ' this.dataList')
                    this.dataListLoading = false
                    this.showExportButton = true
                })

            })
        },

        //第一个规则
        filterSites(zjDataList, dataList) {
            const result = [];

            // 遍历ZJDataList中的每个对象
            for (const zjItem of zjDataList) {
                // 遍历每个对象的oldsite数组
                for (const oldsite of zjItem.oldsite) {
                    // 在dataList中查找匹配的站点
                    const matchedItem = dataList.find(item => item.wlSiteName == oldsite);
                    console.log(matchedItem, 'matchedItem')
                    // 如果找到匹配项且sum小于50
                    if (matchedItem) {
                        if (matchedItem.sum < 50 || matchedItem.wlSiteName === "闽龙岩永定凯哥商行") {
                            result.push({
                                oldsite: oldsite,
                                newsite: zjItem.newsite
                            });
                        }
                    }
                }
            }

            return result;
        },
        //放国定点规则
        filterSites1(zjDataList, dataList) {
            const result = [];

            // 遍历ZJDataList中的每个对象
            for (const zjItem of zjDataList) {
                // 遍历每个对象的oldsite数组
                for (const oldsite of zjItem.oldsite) {
                    // 在dataList中查找匹配的站点
                    const matchedItem = dataList.find(item => item.wlSiteName == oldsite);
                    console.log(matchedItem, 'matchedItem')

                    // 如果找到匹配项（移除sum < 50的判断，保留特殊站点判断或也一并移除）
                    if (matchedItem) {
                        // 如果你也想移除“闽龙岩永定凯哥商行”的特殊判断，直接写成 if (matchedItem) 即可
                        result.push({
                            oldsite: oldsite,
                            newsite: zjItem.newsite
                        });
                    }
                }
            }

            return result;
        },
        //判断放入的站点是否存在
        filterByNewsiteMatch(filteredSites, dataList) {
            // 使用filter方法创建新数组，只保留匹配成功的对象
            return filteredSites.filter(filteredItem => {
                // 检查newsite是否在dataList中有匹配项
                return dataList.some(item => item.wlSiteName == filteredItem.newsite);
            });
        },
        // 通过newsite和oldsite字段匹配，将结果放入同一个数组
        matchSitesToOnderList(filteredSites, dataList) {
            const onderList = [];

            // 通过newsite字段匹配
            for (const filteredItem of filteredSites) {
                const matchedByNewsite = dataList.find(item =>
                    item.wlSiteName === filteredItem.newsite
                );

                if (matchedByNewsite) {
                    onderList.push(matchedByNewsite);
                }
            }

            // 通过oldsite字段匹配
            for (const filteredItem of filteredSites) {
                const matchedByOldsite = dataList.find(item =>
                    item.wlSiteName === filteredItem.oldsite
                );

                if (matchedByOldsite) {
                    onderList.push(matchedByOldsite);
                }
            }

            return onderList;
        },
        //数组转换
        transformFilteredResult(filteredResult) {
            // 创建一个Map来按newsite分组oldsite
            const newsiteMap = new Map();

            // 遍历数组，按newsite分组
            for (const item of filteredResult) {
                if (!newsiteMap.has(item.newsite)) {
                    newsiteMap.set(item.newsite, []);
                }
                newsiteMap.get(item.newsite).push(item.oldsite);
            }

            // 转换为所需的二维数组格式
            const result = [];
            for (const [newsite, oldsites] of newsiteMap) {
                result.push([...oldsites, newsite]);
            }

            return result;
        },
        //排序添加标识符
        sortAndCalculateOnderList(onderList, transformedArray) {
            const result = [];

            // 遍历每个组，并添加序号
            for (let i = 0; i < transformedArray.length; i++) {
                const group = transformedArray[i];
                const sortValue = i + 1; // 第一组是1，第二组是2，依此类推

                const matchedObjects = onderList.filter(item =>
                    group.includes(item.wlSiteName)
                );

                // 为每个匹配的对象添加 sort 字段
                const objectsWithSort = matchedObjects.map(item => ({
                    ...item,
                    sort: sortValue
                }));

                result.push(...objectsWithSort);
            }

            console.log(result, 'result');
            return result; // 记得返回结果
        },
        //计算合计
        calculateGroupTotals(result) {
            const finalResult = [];

            // 获取所有的 sort 值并排序
            const sortValues = [...new Set(result.map(item => item.sort))].sort();

            for (const sortValue of sortValues) {
                // 获取当前组的所有对象
                const groupObjects = result.filter(item => item.sort === sortValue);

                // 将原始对象添加到最终结果
                finalResult.push(...groupObjects);
                const firstObjectWlSiteName = groupObjects[0].wlSiteName;
                // 初始化当前组的合计对象（按照你的模板格式）
                const totalObj = {
                    areaName: "总计",
                    contacts: '总计',
                    tel: '',
                    days: 0,
                    wlSiteCode: "TOTAL",
                    wlSiteName: firstObjectWlSiteName,
                    sort: sortValue  // 保持相同的 sort 值
                };

                // 遍历当前组的所有对象进行累加
                groupObjects.forEach(item => {
                    // 遍历每个对象的属性
                    Object.keys(item).forEach(key => {
                        // 跳过不需要求和的字段
                        if (['areaName', 'wlSiteCode', 'wlSiteName', 'tel', 'contacts', 'sort'].includes(key)) {
                            return;
                        }

                        // 初始化总计对象中的字段（如果不存在）
                        if (!totalObj.hasOwnProperty(key)) {
                            totalObj[key] = 0;
                        }

                        // 将值转为数字并累加
                        const value = Number(item[key]) || 0;
                        totalObj[key] += value;
                    });

                    // 特别处理 days 字段
                    totalObj.days += Number(item.days) || 0;
                });

                // 将合计对象添加到该组后面
                finalResult.push(totalObj);
            }

            return finalResult;
        },
        //特殊规则二
        matchAndAddSortFields(onderList, transformedArray) {
            const result = [];
            transformedArray.forEach((item, index) => {
                const sortValue = `A${index + 1}`; // A1, A2, A3...
                const oldsiteArray = item.oldsite;
                console.log(oldsiteArray, 'oldsiteArray');

                // 遍历每个 oldsite 进行匹配
                oldsiteArray.forEach(oldsite => {
                    // 在 onderList 中查找匹配的对象
                    const matchedObjects = onderList.filter(dataItem =>
                        dataItem.wlSiteName == oldsite
                    );

                    // 为匹配的对象添加 sort 字段，并过滤掉 sum >= 50 的对象
                    const objectsWithSort = matchedObjects
                        .map(matchedItem => ({
                            ...matchedItem,
                            sort: sortValue
                        }))
                        .filter(matchedItem => matchedItem.sum < 50); // 只保留 sum < 50 的对象

                    result.push(...objectsWithSort);
                });
            });
            return result;
        },
        matchAndAddSortFields1(onderList, transformedArray) {
            const result = [];
            transformedArray.forEach((item, index) => {
                const sortValue = `A${index + 1}`; // A1, A2, A3...
                const oldsiteArray = item.oldsite;
                console.log(oldsiteArray, 'oldsiteArray');

                // 遍历每个 oldsite 进行匹配
                oldsiteArray.forEach(oldsite => {
                    // 在 onderList 中查找匹配的对象
                    const matchedObjects = onderList.filter(dataItem =>
                        dataItem.wlSiteName == oldsite
                    );

                    // 为匹配的对象添加 sort 字段，并过滤掉 sum >= 50 的对象
                    const objectsWithSort = matchedObjects
                        .map(matchedItem => ({
                            ...matchedItem,
                            sort: sortValue
                        }))

                    result.push(...objectsWithSort);
                });
            });
            return result;
        },
        //特殊规则三
        matchAndAddSort(onderList, transformedArray) {
            const result = [];
            transformedArray.forEach((item, index) => {
                const sortValue = `A${index + 1}`; // A1, A2, A3...
                const oldsiteArray = item.oldsite;
                console.log(oldsiteArray, 'oldsiteArray');

                // 遍历每个 oldsite 进行匹配
                oldsiteArray.forEach(oldsite => {
                    // 在 onderList 中查找匹配的对象
                    const matchedObjects = onderList.filter(dataItem =>
                        dataItem.wlSiteName == oldsite
                    );

                    // 为匹配的对象添加 sort 字段，保留所有对象
                    const objectsWithSort = matchedObjects.map(matchedItem => ({
                        ...matchedItem,
                        sort: sortValue
                    }));

                    result.push(...objectsWithSort);
                });
            });
            return result;
        },
        processGroupsBySum(dataArray) {
            if (!Array.isArray(dataArray)) return [];

            const excludeFields = ['areaName', 'wlSiteCode', 'wlSiteName', 'tel', 'contacts', 'sort'];
            const result = [];
            const groups = {};

            // 分组
            for (let i = 0; i < dataArray.length; i++) {
                const item = dataArray[i];
                if (item && item.sort !== undefined && item.sort !== null) {
                    const sortKey = item.sort;
                    if (!groups[sortKey]) {
                        groups[sortKey] = [];
                    }
                    groups[sortKey].push(item);
                }
            }

            // 按 sort 排序处理分组
            const sortKeys = Object.keys(groups).sort();

            for (let j = 0; j < sortKeys.length; j++) {
                const sortKey = sortKeys[j];
                const group = groups[sortKey];

                // 添加原始数据
                for (let k = 0; k < group.length; k++) {
                    result.push(group[k]);
                }

                // 检查是否需要添加合计
                let hasValidObject = false;
                for (let l = 0; l < group.length; l++) {
                    const sumValue = Number(group[l].sum) || 0;
                    if (sumValue <= 50) {
                        hasValidObject = true;
                        break;
                    }
                }

                if (!hasValidObject) continue;

                // 找出最大 sum 的对象作为模板
                let maxSumItem = group[0];
                let maxSum = Number(group[0].sum) || 0;

                for (let m = 1; m < group.length; m++) {
                    const currentSum = Number(group[m].sum) || 0;
                    if (currentSum > maxSum) {
                        maxSum = currentSum;
                        maxSumItem = group[m];
                    }
                }

                // 创建总计对象，先复制模板对象的非数字字段
                const totalObj = {
                    wlSiteName: maxSumItem.wlSiteName,
                    sort: sortKey,
                    contacts: '总计',
                    sum: maxSum,
                    _isTotal: true
                };

                // 初始化所有数字字段为0
                for (let n = 0; n < group.length; n++) {
                    const item = group[n];
                    const keys = Object.keys(item);

                    for (let o = 0; o < keys.length; o++) {
                        const key = keys[o];
                        if (excludeFields.indexOf(key) !== -1) continue;

                        if (typeof item[key] === 'number') {
                            totalObj[key] = 0; // 初始化为0，避免重复累加
                        } else if (totalObj[key] === undefined) {
                            totalObj[key] = maxSumItem[key]; // 复制非数字字段
                        }
                    }
                }

                // 累加所有数字字段
                for (let n = 0; n < group.length; n++) {
                    const item = group[n];
                    const keys = Object.keys(item);

                    for (let o = 0; o < keys.length; o++) {
                        const key = keys[o];
                        if (excludeFields.indexOf(key) !== -1) continue;

                        if (typeof item[key] === 'number') {
                            totalObj[key] += Number(item[key]) || 0;
                        }
                    }
                }

                result.push(totalObj);
            }

            return result;
        },


        mergeAndSumData() {
            // 找出浙江总计对象
            const zhejiangTotal = this.dataList.find(item => item.wlSiteName === '浙江总计');
            // 找出上海总计对象
            const shanghaiTotal = this.dataList1.find(item => item.wlSiteName === '上海总计');

            if (!zhejiangTotal || !shanghaiTotal) {
                console.error('未找到浙江总计或上海总计对象');
                return;
            }

            // 创建新对象
            const newObj = {
                areaName: "浙江省+上海合计",
                contacts: '浙江省+上海合计',
                tel: '浙江省+上海合计',
                days: 0,
                wlSiteCode: "TOTAL",
                wlSiteName: "浙江省+上海合计"
            };

            // 复制不需要求和的字段
            const excludeFields = ['areaName', 'days', 'wlSiteCode', 'wlSiteName', 'tel', 'contacts', 'vnote'];
            // excludeFields.forEach(field => {
            //     if (zhejiangTotal.hasOwnProperty(field)) {
            //         newObj[field] = zhejiangTotal[field];
            //     }
            // });

            // 对数值字段求和
            Object.keys(zhejiangTotal).forEach(key => {
                if (!excludeFields.includes(key) && typeof zhejiangTotal[key] === 'number') {
                    newObj[key] = (zhejiangTotal[key] || 0) + (shanghaiTotal[key] || 0);
                }
            });

            // 将新对象添加到dataList数组最后
            this.dataList.push(newObj);

            return newObj;
        },
        //上海
        getshanghai() {
            this.areas = '上海'
            this.wlForm.blurry = this.areas
            this.dataListLoading = true
            this.showExportButton = false
            const [year, month, day] = this.dataForm.p_vouchdateend.split('-').map(Number);
            this.labelText = `${this.areas}区域到货明细表--截止${year}年${month}月${day}日`; // 如果没有选择日期，显示默认文本
            this.dateLable = `${month}月${day}日`
            console.log(this.dateLable)
            this.shanghaiForm.p_vouchdateend = this.dataForm.p_vouchdateend
            //转时间
            const date = new Date(this.dataForm.p_vouchdateend);
            date.setDate(date.getDate() - 2);
            this.shanghaiForm.p_vouchdateend = this.dataForm.p_vouchdateend

            api.WlsiteAndContactsAPI(this.wlForm).then(res => {
                console.log(res, 'res6666')
                this.wlDataList1 = res
                this.wlDataList1 = this.wlDataList1.filter(item => item.areaName == '上海');
                api.wlarrivedApi(this.shanghaiForm).then(res => {
                    this.dataList1 = res
                    this.dataList1 = this.mergeBoxFields(this.dataList1)
                    this.dataList1 = this.mergeObjectsByCodes(this.dataList1);
                    this.dataList1 = this.dataList1.map(item => ({
                        ...item, // 展开原对象的所有属性
                        ["box" + item.productCode]: item.box // 新增动态属性
                    }));
                    this.dataList1 = Object.values(
                        this.dataList1.reduce((acc, item) => {
                            const key = item.wlSiteCode; // 使用 wlSiteCode 作为分组依据

                            if (!acc[key]) {
                                // 初始化新对象，并删除不合并的字段
                                acc[key] = { ...item }; // 先复制所有字段

                                // 删除不合并的字段
                                const fieldsToRemove = [
                                    'box',
                                    'deliverydate',
                                    'factoryProductCode',
                                    'factoryProductName',
                                    'piece',
                                    'productCode',
                                    'vouchdate',
                                    'tel'
                                ];
                                fieldsToRemove.forEach(field => delete acc[key][field]);
                            } else {
                                // 合并其他字段（如 jtProductCode）
                                Object.keys(item).forEach(field => {
                                    // 如果字段不在排除列表，则合并
                                    if (![
                                        'wlSiteCode',
                                        'box',
                                        'deliverydate',
                                        'factoryProductCode',
                                        'factoryProductName',
                                        'piece',
                                        'productCode',
                                        'vouchdate'
                                    ].includes(field)) {
                                        acc[key][field] = item[field]; // 后出现的值会覆盖前面的
                                    }
                                });
                            }

                            return acc;
                        }, {})
                    );
                    this.dataList1 = this.dataList1.map(item => {
                        let sum = 0;
                        for (const key in item) {
                            // 跳过保留字段
                            if (['areaName', 'days', 'wlSiteCode', 'wlSiteName', 'tel', 'address', 'contacts'].includes(key)) continue;
                            // 其他字段转为数字并累加
                            sum += Number(item[key]) || 0;
                        }
                        // 返回新对象（保留原字段 + 新增 sum）
                        return { ...item, sum };
                    });

                    // 初始化总计对象
                    const totalObj = {
                        areaName: "上海总计",
                        contacts: '上海总计',
                        tel: '上海总计',
                        days: 0,
                        wlSiteCode: "TOTAL",
                        wlSiteName: "上海总计"
                    };

                    // 遍历数组中的每个对象
                    this.dataList1.forEach(item => {
                        // 遍历每个对象的属性
                        Object.keys(item).forEach(key => {
                            // 跳过不需要求和的字段
                            if (['areaName', 'days', 'wlSiteCode', 'wlSiteName', 'tel', 'contacts', 'vnote'].includes(key)) {
                                return;
                            }

                            // 初始化总计对象中的字段（如果不存在）
                            if (!totalObj.hasOwnProperty(key)) {
                                totalObj[key] = 0;
                            }

                            // 将值转为数字并累加
                            const value = Number(item[key]) || 0;
                            totalObj[key] += value;
                        });

                        // 累加days字段（如果需要）
                        totalObj.days += Number(item.days) || 0;
                    });

                    // 将总计对象添加到原数组（如果需要）
                    this.dataList1.push(totalObj);
                    // 直接修改原数组
                    this.dataList1.forEach((item, index) => {
                        // 如果不是最后三个元素，则添加 startDate
                        if (index < this.dataList1.length - 1) {
                            item.startDate = this.dateLable;
                        }
                    });

                    this.dataList1 = this.dataList1.map(dataItem => {
                        // 在wlDataList1中查找匹配的对象
                        const matchedItem = this.wlDataList1.find(wlItem =>
                            wlItem.wlSiteName === dataItem.wlSiteName
                        );

                        // 如果找到匹配项，则添加需要的字段
                        if (matchedItem) {
                            return {
                                ...dataItem, // 保留原有属性
                                address: matchedItem.address, // 添加address
                                contacts: matchedItem.contacts, // 添加contacts
                                tel: matchedItem.tel // 添加tel
                            };
                        }

                        // 如果没有找到匹配项，返回原对象
                        return dataItem;
                    });
                    this.dataList1 = this.shanghaiData1(this.dataList1)
                    this.dataList1 = this.shanghaiData1_1(this.dataList1)
                    // 直接修改原数组
                    this.dataList1.forEach((item, index) => {
                        // 如果不是最后三个元素，则添加 startDate
                        if (index < this.dataList1.length - 1) {
                            item.startDate = this.dateLable;
                        }
                    });
                    this.dataList1 = this.dataList1.filter(item =>
                        item.wlSiteName.includes(this.bullay)
                    );
                    this.getzhejiang()
                    console.log(this.dataList1, 'this.dataList1')
                    this.dataListLoading = false
                    this.showExportButton = true
                })

            })
        },
        //福建
        getfujian() {
            this.areas = '福建'
            this.wlForm.blurry = this.areas
            this.dataListLoading = true
            this.showExportButton = false
            const [year, month, day] = this.dataForm.p_vouchdateend.split('-').map(Number);
            this.labelText = `${this.areas}区域到货明细表--截止${year}年${month}月${day}日`; // 如果没有选择日期，显示默认文本
            this.dateLable = `${month}月${day}日`
            console.log(this.dateLable)
            this.fujianForm.p_vouchdateend = this.dataForm.p_vouchdateend
            //转时间
            const date = new Date(this.dataForm.p_vouchdateend);
            date.setDate(date.getDate() - 2);
            // this.hainanForm.p_vouchdateend = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            this.hainanForm.p_vouchdateend = this.dataForm.p_vouchdateend

            api.WlsiteAndContactsAPI(this.wlForm).then(res => {
                console.log(res, 'res6666')
                this.wlDataList = res
                this.wlDataList = this.wlDataList.filter(item => item.areaName == '福建');
                api.wlarrivedApi(this.fujianForm).then(res => {
                    this.dataList = res
                    this.dataList = this.mergeBoxFields(this.dataList)
                    this.dataList = this.mergeObjectsByCodes(this.dataList);
                    this.dataList = this.dataList.map(item => ({
                        ...item, // 展开原对象的所有属性
                        ["box" + item.productCode]: item.box // 新增动态属性
                    }));
                    this.dataList = Object.values(
                        this.dataList.reduce((acc, item) => {
                            const key = item.wlSiteCode; // 使用 wlSiteCode 作为分组依据

                            if (!acc[key]) {
                                // 初始化新对象，并删除不合并的字段
                                acc[key] = { ...item }; // 先复制所有字段

                                // 删除不合并的字段
                                const fieldsToRemove = [
                                    'box',
                                    'deliverydate',
                                    'factoryProductCode',
                                    'factoryProductName',
                                    'piece',
                                    'productCode',
                                    'vouchdate',
                                    'tel'
                                ];
                                fieldsToRemove.forEach(field => delete acc[key][field]);
                            } else {
                                // 合并其他字段(如 jtProductCode）
                                Object.keys(item).forEach(field => {
                                    // 如果字段不在排除列表，则合并
                                    if (![
                                        'wlSiteCode',
                                        'box',
                                        'deliverydate',
                                        'factoryProductCode',
                                        'factoryProductName',
                                        'piece',
                                        'productCode',
                                        'vouchdate'
                                    ].includes(field)) {
                                        acc[key][field] = item[field]; // 后出现的值会覆盖前面的
                                    }
                                });
                            }

                            return acc;
                        }, {})
                    );
                    this.dataList = this.dataList.map(item => {
                        let sum = 0;
                        for (const key in item) {
                            // 跳过保留字段
                            if (['areaName', 'days', 'wlSiteCode', 'wlSiteName', 'tel', 'address', 'contacts'].includes(key)) continue;
                            // 其他字段转为数字并累加
                            sum += Number(item[key]) || 0;
                        }
                        // 返回新对象(保留原字段 + 新增 sum）
                        return { ...item, sum };
                    });

                    // 初始化总计对象
                    const totalObj = {
                        areaName: "福建总计",
                        contacts: '福建总计',
                        tel: '福建总计',
                        days: 0,
                        wlSiteCode: "TOTAL",
                        wlSiteName: "福建总计"
                    };

                    // 遍历数组中的每个对象
                    this.dataList.forEach(item => {
                        // 遍历每个对象的属性
                        Object.keys(item).forEach(key => {
                            // 跳过不需要求和的字段
                            if (['areaName', 'days', 'wlSiteCode', 'wlSiteName', 'tel', 'contacts', 'vnote'].includes(key)) {
                                return;
                            }

                            // 初始化总计对象中的字段(如果不存在)
                            if (!totalObj.hasOwnProperty(key)) {
                                totalObj[key] = 0;
                            }

                            // 将值转为数字并累加
                            const value = Number(item[key]) || 0;
                            totalObj[key] += value;
                        });

                        // 累加days字段(如果需要)
                        totalObj.days += Number(item.days) || 0;
                    });

                    // 将总计对象添加到原数组（如果需要)
                    this.dataList.push(totalObj);
                    // 直接修改原数组
                    this.dataList.forEach((item, index) => {
                        // 如果不是最后三个元素，则添加 startDate
                        if (index < this.dataList.length - 1) {
                            item.startDate = this.dateLable;
                        }
                    });

                    this.dataList = this.dataList.map(dataItem => {
                        // 在wlDataList中查找匹配的对象
                        const matchedItem = this.wlDataList.find(wlItem =>
                            wlItem.wlSiteName === dataItem.wlSiteName
                        );

                        // 如果找到匹配项，则添加需要的字段
                        if (matchedItem) {
                            return {
                                ...dataItem, // 保留原有属性
                                address: matchedItem.address, // 添加address
                                contacts: matchedItem.contacts, // 添加contacts
                                tel: matchedItem.tel // 添加tel
                            };
                        }

                        // 如果没有找到匹配项，返回原对象
                        return dataItem;
                    });

                    //第二个特殊
                    const matchedResults = this.matchAndAddSortFields(this.dataList, this.FJDataList1);

                    const matresult = this.processGroupsBySum(matchedResults);

                    console.log(matchedResults, 'matchedResults')

                    const filteredSites = this.filterSites(this.FJDataList, this.dataList);
                    const filteredResult = this.filterByNewsiteMatch(filteredSites, this.dataList);
                    const onderList = this.matchSitesToOnderList(filteredResult, this.dataList);

                    const transformedArray = this.transformFilteredResult(filteredResult);
                    const calculatedList = this.sortAndCalculateOnderList(onderList, transformedArray);

                    const uniqueArray = Array.from(
                        new Map(
                            calculatedList.map(item => [item.wlSiteName, item])
                        ).values()
                    );

                    this.FJfinalResult = this.calculateGroupTotals(uniqueArray);
                    console.log(matresult, 'matresult')

                    // 如果 FJfinalResult 可能为 undefined，先初始化
                    this.FJfinalResult = this.FJfinalResult || [];

                    // 将 matresult 数组元素添加到 FJfinalResult
                    this.FJfinalResult.push(...matresult);


                    this.dataList = this.fujianData1(this.dataList)
                    this.dataList = this.fujianData1_1(this.dataList)
                    this.dataList = this.fujianData1_2(this.dataList)
                    this.dataList = this.fujianData1_3(this.dataList)
                    this.dataList = this.fujianData1_4(this.dataList)
                    this.dataList = this.fujianData1_5(this.dataList)
                    this.dataList = this.fujianData1_6(this.dataList)
                    this.dataList = this.fujianData1_7(this.dataList)
                    this.dataList = this.fujianData1_8(this.dataList)
                    this.dataList = this.fujianData1_9(this.dataList)
                    this.dataList = this.fujianData1_10(this.dataList)
                    this.dataList = this.fujianData1_11(this.dataList)

                    // 直接修改原数组
                    this.dataList.forEach((item, index) => {
                        // 如果不是最后三个元素，则添加 startDate
                        if (index < this.dataList.length - 1) {
                            item.startDate = this.dateLable;
                        }
                    });

                    this.dataList = this.dataList.filter(item =>
                        item.wlSiteName.includes(this.bullay)
                    );
                    this.dataListLoading = false
                    this.showExportButton = true
                })
            })
        },
        getjiangsu() {
            this.areas = '江苏'
            this.wlForm.blurry = this.areas
            this.dataListLoading = true
            this.showExportButton = false
            const [year, month, day] = this.dataForm.p_vouchdateend.split('-').map(Number);
            this.labelText = `${this.areas}区域到货明细表--截止${year}年${month}月${day}日`; // 如果没有选择日期，显示默认文本
            this.dateLable = `${month}月${day}日`
            console.log(this.dateLable)
            this.jiangsuForm.p_vouchdateend = this.dataForm.p_vouchdateend
            //转时间
            const date = new Date(this.dataForm.p_vouchdateend);
            date.setDate(date.getDate() - 2);
            // this.hainanForm.p_vouchdateend = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            this.hainanForm.p_vouchdateend = this.dataForm.p_vouchdateend

            api.WlsiteAndContactsAPI(this.wlForm).then(res => {
                console.log(res, 'res6666')
                this.wlDataList = res
                this.wlDataList = this.wlDataList.filter(item => item.areaName == '江苏');
                api.wlarrivedApi(this.jiangsuForm).then(res => {
                    this.dataList = res
                    this.dataList = this.mergeBoxFields(this.dataList)
                    this.dataList = this.mergeObjectsByCodes(this.dataList);
                    this.dataList = this.dataList.map(item => ({
                        ...item, // 展开原对象的所有属性
                        ["box" + item.productCode]: item.box // 新增动态属性
                    }));
                    this.dataList = Object.values(
                        this.dataList.reduce((acc, item) => {
                            const key = item.wlSiteCode; // 使用 wlSiteCode 作为分组依据

                            if (!acc[key]) {
                                // 初始化新对象，并删除不合并的字段
                                acc[key] = { ...item }; // 先复制所有字段

                                // 删除不合并的字段
                                const fieldsToRemove = [
                                    'box',
                                    'deliverydate',
                                    'factoryProductCode',
                                    'factoryProductName',
                                    'piece',
                                    'productCode',
                                    'vouchdate',
                                    'tel'
                                ];
                                fieldsToRemove.forEach(field => delete acc[key][field]);
                            } else {
                                // 合并其他字段(如 jtProductCode）
                                Object.keys(item).forEach(field => {
                                    // 如果字段不在排除列表，则合并
                                    if (![
                                        'wlSiteCode',
                                        'box',
                                        'deliverydate',
                                        'factoryProductCode',
                                        'factoryProductName',
                                        'piece',
                                        'productCode',
                                        'vouchdate'
                                    ].includes(field)) {
                                        acc[key][field] = item[field]; // 后出现的值会覆盖前面的
                                    }
                                });
                            }

                            return acc;
                        }, {})
                    );
                    this.dataList = this.dataList.map(item => {
                        let sum = 0;
                        for (const key in item) {
                            // 跳过保留字段
                            if (['areaName', 'days', 'wlSiteCode', 'wlSiteName', 'tel', 'address', 'contacts'].includes(key)) continue;
                            // 其他字段转为数字并累加
                            sum += Number(item[key]) || 0;
                        }
                        // 返回新对象(保留原字段 + 新增 sum）
                        return { ...item, sum };
                    });

                    // 初始化总计对象
                    const totalObj = {
                        areaName: "江苏总计",
                        contacts: '江苏总计',
                        tel: '江苏总计',
                        days: 0,
                        wlSiteCode: "TOTAL",
                        wlSiteName: "江苏总计"
                    };

                    // 遍历数组中的每个对象
                    this.dataList.forEach(item => {
                        // 遍历每个对象的属性
                        Object.keys(item).forEach(key => {
                            // 跳过不需要求和的字段
                            if (['areaName', 'days', 'wlSiteCode', 'wlSiteName', 'tel', 'contacts', 'vnote'].includes(key)) {
                                return;
                            }

                            // 初始化总计对象中的字段(如果不存在)
                            if (!totalObj.hasOwnProperty(key)) {
                                totalObj[key] = 0;
                            }

                            // 将值转为数字并累加
                            const value = Number(item[key]) || 0;
                            totalObj[key] += value;
                        });

                        // 累加days字段(如果需要)
                        totalObj.days += Number(item.days) || 0;
                    });

                    // 将总计对象添加到原数组（如果需要)
                    this.dataList.push(totalObj);
                    // 直接修改原数组
                    this.dataList.forEach((item, index) => {
                        // 如果不是最后三个元素，则添加 startDate
                        if (index < this.dataList.length - 1) {
                            item.startDate = this.dateLable;
                        }
                    });

                    this.dataList = this.dataList.map(dataItem => {
                        // 在wlDataList中查找匹配的对象
                        const matchedItem = this.wlDataList.find(wlItem =>
                            wlItem.wlSiteName === dataItem.wlSiteName
                        );

                        // 如果找到匹配项，则添加需要的字段
                        if (matchedItem) {
                            return {
                                ...dataItem, // 保留原有属性
                                address: matchedItem.address, // 添加address
                                contacts: matchedItem.contacts, // 添加contacts
                                tel: matchedItem.tel // 添加tel
                            };
                        }

                        // 如果没有找到匹配项，返回原对象
                        return dataItem;
                    });


                    //第二个特殊
                    const matchedResults = this.matchAndAddSortFields1(this.dataList, this.JSDataList1);

                    const matresult = this.processGroupsBySum(matchedResults);

                    console.log(matchedResults, 'matchedResults')

                    const filteredSites = this.filterSites(this.JSDataList, this.dataList);
                    const filteredResult = this.filterByNewsiteMatch(filteredSites, this.dataList);
                    const onderList = this.matchSitesToOnderList(filteredResult, this.dataList);

                    const transformedArray = this.transformFilteredResult(filteredResult);
                    const calculatedList = this.sortAndCalculateOnderList(onderList, transformedArray);

                    const uniqueArray = Array.from(
                        new Map(
                            calculatedList.map(item => [item.wlSiteName, item])
                        ).values()
                    );

                    this.JSfinalResult = this.calculateGroupTotals(uniqueArray);
                    console.log(matresult, 'matresult')

                    // 如果 JSfinalResult 可能为 undefined，先初始化
                    this.JSfinalResult = this.JSfinalResult || [];

                    // 将 matresult 数组元素添加到 JSfinalResult
                    this.JSfinalResult.push(...matresult);

                    this.dataList = this.jiangsuData1_1(this.dataList)
                    this.dataList = this.jiangsuData1_2(this.dataList, this.JSDataList)

                    // 直接修改原数
                    this.dataList.forEach((item, index) => {
                        // 如果不是最后三个元素，则添加 startDate
                        if (index < this.dataList.length - 1) {
                            item.startDate = this.dateLable;
                        }
                    });

                    this.dataList = this.dataList.filter(item =>
                        item.wlSiteName.includes(this.bullay)
                    );
                    console.log(this.dataList)
                    this.dataListLoading = false
                    this.showExportButton = true
                })
            })
        },

        getshandong() {
            this.areas = '山东'
            // this.wlForm.blurry = this.areas
            this.dataListLoading = true
            this.showExportButton = false
            const [year, month, day] = this.dataForm.p_vouchdateend.split('-').map(Number);
            this.labelText = `${this.areas}区域到货明细表--截止${year}年${month}月${day}日`; // 如果没有选择日期，显示默认文本
            this.dateLable = `${month}月${day}日`
            console.log(this.dateLable)
            this.shandongForm.p_vouchdateend = this.dataForm.p_vouchdateend
            //转时间
            const date = new Date(this.dataForm.p_vouchdateend);
            date.setDate(date.getDate() - 2);
            api.wlarrivedShanDongApi({
                p_vouchdateend: this.dataForm.p_vouchdateend
            }).then(res => {
                console.log(res)
                this.dataList = res
                this.dataList = this.mergeBoxFieldsShandong(this.dataList)
                this.dataList = this.dataList.map(item => ({
                    ...item, // 展开原对象的所有属性
                    ["box" + item.cproductcode]: item.box // 新增动态属性
                }));
                this.dataList = this.dataList.map(({ vcol2Name, ...rest }) => ({
                    ...rest,
                    wlSiteName: vcol2Name
                }));
                this.dataList = this.mergeSitesAndRemoveFields(this.dataList);

                // 为每一行追加合计（sum），仅累加 box* 动态列
                this.dataList = this.dataList.map(item => {
                    let rowSum = 0;
                    Object.keys(item).forEach(key => {
                        if (!key.startsWith('box')) return;
                        const val = Number(item[key]);
                        if (Number.isFinite(val)) {
                            rowSum += val;
                        }
                    });
                    return { ...item, sum: rowSum };
                });

                // 在末尾追加合计行
                const totalObj = {
                    wlSiteName: `合计`
                };
                this.dataList.forEach(item => {
                    Object.keys(item).forEach(key => {
                        // 仅累加 box* 动态列
                        if (!key.startsWith('box')) return;

                        // 初始化总计对象中的字段(如果不存在)
                        if (!Object.prototype.hasOwnProperty.call(totalObj, key)) {
                            totalObj[key] = 0;
                        }
                        const value = Number(item[key]) || 0;
                        totalObj[key] += value;
                    });
                });
                // 计算总计行的 sum，仅按 box* 动态列
                let totalSum = 0;
                Object.keys(totalObj).forEach(key => {
                    if (!key.startsWith('box')) return;
                    totalSum += Number(totalObj[key]) || 0;
                });
                totalObj.sum = totalSum;

                this.dataList.push(totalObj);

                console.log(this.dataList)
                this.dataListLoading = false
                this.showExportButton = true
            })
        },



        //数据合并(根据wlSiteCode分组)
        mergeDataList(dataList) {
            return Object.values(
                dataList.reduce((acc, item) => {
                    const key = item.wlSiteCode; // 使用 wlSiteCode 作为分组依据

                    if (!acc[key]) {
                        // 初始化新对象，并删除不合并的字段
                        acc[key] = { ...item }; // 先复制所有字段

                        // 删除不合并的字段
                        const fieldsToRemove = [
                            'box',
                            'deliverydate',
                            'factoryProductCode',
                            'factoryProductName',
                            'piece',
                            'productCode',
                            'vouchdate',
                            'tel'
                        ];
                        fieldsToRemove.forEach(field => delete acc[key][field]);
                    } else {
                        // 合并其他字段(如 jtProductCode)
                        Object.keys(item).forEach(field => {
                            // 如果字段不在排除列表，则合并
                            if (![
                                'wlSiteCode',
                                'box',
                                'deliverydate',
                                'factoryProductCode',
                                'factoryProductName',
                                'piece',
                                'productCode',
                                'vouchdate'
                            ].includes(field)) {
                                acc[key][field] = item[field]; // 后出现的值会覆盖前面的
                            }
                        });
                    }

                    return acc;
                }, {})
            );
        },
        //计算总计
        calculateTotals(dataArray, options = {}) {
            // 默认配置
            const defaultOptions = {
                excludeFields: ['vcol6_name', 'vcol6_code', 'vcol2_name', 'vcol2'],
                totalFields: {
                    vcol2_name: "总计",
                    wlSiteCode: "TOTAL",
                    wlSiteName: "总计",
                    days: 0
                },
                addToOriginal: true
            };

            // 合并用户配置和默认配置
            const finalOptions = { ...defaultOptions, ...options };
            console.log(finalOptions, 'finalOptions')

            // 初始化总计对象
            const totalObj = { ...finalOptions.totalFields };

            // 遍历数组中的每个对象
            dataArray.forEach(item => {
                // 遍历每个对象的属性
                Object.keys(item).forEach(key => {
                    // 跳过不需要求和的字段
                    if (finalOptions.excludeFields.includes(key)) {
                        return;
                    }

                    // 初始化总计对象中的字段(如果不存在且不是特殊字段)
                    if (!totalObj.hasOwnProperty(key) && !finalOptions.totalFields.hasOwnProperty(key)) {
                        totalObj[key] = 0;
                    }

                    // 将值转为数字并累加(如果不是特殊字段)
                    if (!finalOptions.totalFields.hasOwnProperty(key)) {
                        const value = Number(item[key]) || 0;
                        totalObj[key] += value;
                    }
                });

                // 特殊处理days字段(如果配置中存在)
                if (finalOptions.totalFields.hasOwnProperty('days')) {
                    totalObj.days += Number(item.days) || 0;
                }
            });

            // 将总计对象添加到原数组(如果需要)
            if (finalOptions.addToOriginal) {
                dataArray.push(totalObj);
            }

            return totalObj;
        },
        //广西无特殊规则
        getGuangxiNo() {
            this.areas = '广西'
            this.wlForm.blurry = this.areas
            // this.dataListLoading = true
            const [year, month, day] = this.dataForm.p_vouchdateend.split('-').map(Number);
            this.labelText = `${this.areas}区域到货明细表--截止${year}年${month}月${day}日`; // 如果没有选择日期，显示默认文本
            this.dateLable = `${month}月${day}日`
            console.log(this.dateLable)
            this.guangxiForm.p_vouchdateend = this.dataForm.p_vouchdateend
            //转时间
            const date = new Date(this.dataForm.p_vouchdateend);
            date.setDate(date.getDate() - 2);
            // this.hainanForm.p_vouchdateend = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            this.hainanForm.p_vouchdateend = this.dataForm.p_vouchdateend

            api.WlsiteAndContactsAPI(this.wlForm).then(res => {
                this.wlDataList = res

                api.wlarrivedApi(this.guangxiForm).then(res => {
                    this.gxNoSpecialList = res
                    this.gxNoSpecialList = this.mergeBoxFields(this.gxNoSpecialList)
                    // 过滤掉满足条件的对象
                    this.gxNoSpecialList = this.gxNoSpecialList.filter(item =>
                        !(item.wlSiteName == '桂百河雨帆商贸' && item.productCode == '1520100008')
                    );
                    this.gxNoSpecialList = this.mergeObjectsByCodes(this.gxNoSpecialList);
                    this.gxNoSpecialList = this.gxNoSpecialList.map(item => ({
                        ...item, // 展开原对象的所有属性
                        ["box" + item.productCode]: item.box // 新增动态属性
                    }));
                    this.gxNoSpecialList = Object.values(
                        this.gxNoSpecialList.reduce((acc, item) => {
                            const key = item.wlSiteCode; // 使用 wlSiteCode 作为分组依据

                            if (!acc[key]) {
                                // 初始化新对象，并删除不合并的字段
                                acc[key] = { ...item }; // 先复制所有字段

                                // 删除不合并的字段
                                const fieldsToRemove = [
                                    'box',
                                    'deliverydate',
                                    'factoryProductCode',
                                    'factoryProductName',
                                    'piece',
                                    'productCode',
                                    'vouchdate',
                                    'tel'
                                ];
                                fieldsToRemove.forEach(field => delete acc[key][field]);
                            } else {
                                // 合并其他字段（如 jtProductCode）
                                Object.keys(item).forEach(field => {
                                    // 如果字段不在排除列表，则合并
                                    if (![
                                        'wlSiteCode',
                                        'box',
                                        'deliverydate',
                                        'factoryProductCode',
                                        'factoryProductName',
                                        'piece',
                                        'productCode',
                                        'vouchdate'
                                    ].includes(field)) {
                                        acc[key][field] = item[field]; // 后出现的值会覆盖前面的
                                    }
                                });
                            }

                            return acc;
                        }, {})
                    );
                    this.gxNoSpecialList = this.processArray(this.gxNoSpecialList)
                    // console.log(this.dataList, 'this.dataList广西')
                    this.gxNoSpecialList = this.gxNoSpecialList.map(item => {
                        let sum = 0;
                        for (const key in item) {
                            // 跳过保留字段
                            if (['areaName', 'days', 'wlSiteCode', 'wlSiteName', 'tel', 'address', 'contacts'].includes(key)) continue;
                            // 其他字段转为数字并累加
                            sum += Number(item[key]) || 0;
                        }
                        // 返回新对象（保留原字段 + 新增 sum）
                        return { ...item, sum };
                    });

                    // 初始化总计对象
                    const totalObj = {
                        areaName: "广西总计",
                        contacts: '广西总计',
                        tel: '广西总计',
                        days: 0,
                        wlSiteCode: "TOTAL",
                        wlSiteName: "广西总计"
                    };

                    // 遍历数组中的每个对象
                    this.gxNoSpecialList.forEach(item => {
                        // 遍历每个对象的属性
                        Object.keys(item).forEach(key => {
                            // 跳过不需要求和的字段
                            if (['areaName', 'days', 'wlSiteCode', 'wlSiteName', 'tel', 'contacts'].includes(key)) {
                                return;
                            }

                            // 初始化总计对象中的字段(如果不存在)
                            if (!totalObj.hasOwnProperty(key)) {
                                totalObj[key] = 0;
                            }

                            // 将值转为数字并累加
                            const value = Number(item[key]) || 0;
                            totalObj[key] += value;
                        });

                        // 累加days字段(如果需要)
                        totalObj.days += Number(item.days) || 0;
                    });

                    // 将总计对象添加到原数组(如果需要)
                    this.gxNoSpecialList.push(totalObj);
                    console.log(this.gxNoSpecialList, '广西')

                    this.gxNoSpecialList = this.gxNoSpecialList.filter(item =>
                        item.wlSiteName.includes(this.bullay)
                    );
                    api.wlguangxiApi(this.hainanForm).then(res => {
                        this.hainanList = res
                        console.log(this.hainanList, ' this.hainanList')
                        this.hainanList.forEach(item => {
                            item["box" + item.productCode] = item.box; // 动态字段名：productCode 的值作为 key，box 的值作为 value
                        });
                        this.hainanList = Object.values(
                            this.hainanList.reduce((acc, item) => {
                                const key = item.wlSiteCode; // 使用 wlSiteCode 作为分组依据

                                if (!acc[key]) {
                                    // 初始化新对象，并删除不合并的字段
                                    acc[key] = { ...item }; // 先复制所有字段

                                    // 删除不合并的字段
                                    const fieldsToRemove = [
                                        'box',
                                        'deliverydate',
                                        'factoryProductCode',
                                        'factoryProductName',
                                        'piece',
                                        'productCode',
                                        'vouchdate',
                                        'tel'
                                    ];
                                    fieldsToRemove.forEach(field => delete acc[key][field]);
                                } else {
                                    // 合并其他字段（如 jtProductCode）
                                    Object.keys(item).forEach(field => {
                                        // 如果字段不在排除列表，则合并
                                        if (![
                                            'wlSiteCode',
                                            'box',
                                            'deliverydate',
                                            'factoryProductCode',
                                            'factoryProductName',
                                            'piece',
                                            'productCode',
                                            'vouchdate'
                                        ].includes(field)) {
                                            acc[key][field] = item[field]; // 后出现的值会覆盖前面的
                                        }
                                    });
                                }

                                return acc;
                            }, {})
                        );
                        this.hainanList = this.hainanList.map(item => {
                            let sum = 0;
                            for (const key in item) {
                                // 跳过保留字段
                                if (['areaName', 'days', 'wlSiteCode', 'wlSiteName', 'tel', 'address', 'contacts'].includes(key)) continue;
                                // 其他字段转为数字并累加
                                sum += Number(item[key]) || 0;
                            }
                            // 返回新对象（保留原字段 + 新增 sum）
                            return { ...item, sum };
                        });
                        // 初始化总计对象
                        const totalObj = {
                            wlSiteName: "海南提货",
                            days: 0,
                            contacts: "海南提货",
                            tel: "海南提货"
                        };

                        // 遍历数组中的每个对象
                        this.hainanList.forEach(item => {
                            // 遍历每个对象的属性
                            Object.keys(item).forEach(key => {
                                // 跳过不需要求和的字段
                                if (['areaName', 'days', 'wlSiteCode', 'wlSiteName', 'tel'].includes(key)) {
                                    return;
                                }

                                // 初始化总计对象中的字段（如果不存在）
                                if (!totalObj.hasOwnProperty(key)) {
                                    totalObj[key] = 0;
                                }

                                // 将值转为数字并累加
                                const value = Number(item[key]) || 0;
                                totalObj[key] += value;
                            });

                            // 累加days字段（如果需要）
                            totalObj.days += Number(item.days) || 0;
                        });

                        // 将总计对象添加到原数组（如果需要）
                        this.gxNoSpecialList.push(totalObj);
                        this.gxNoSpecialList = this.addTotalFromLastTwoItems(this.gxNoSpecialList)
                        // 直接修改原数组
                        this.gxNoSpecialList.forEach((item, index) => {
                            // 如果不是最后三个元素，则添加 startDate
                            if (index < this.gxNoSpecialList.length - 3) {
                                item.startDate = this.dateLable;
                            }
                        });

                        this.gxNoSpecialList = this.gxNoSpecialList.map(dataItem => {
                            // 在wlDataList中查找匹配的对象
                            const matchedItem = this.wlDataList.find(wlItem =>
                                wlItem.wlSiteName === dataItem.wlSiteName
                            );

                            // 如果找到匹配项，则添加需要的字段
                            if (matchedItem) {
                                return {
                                    ...dataItem, // 保留原有属性
                                    address: matchedItem.address, // 添加address
                                    contacts: matchedItem.contacts, // 添加contacts
                                    tel: matchedItem.tel // 添加tel
                                };
                            }

                            // 如果没有找到匹配项，返回原对象
                            return dataItem;
                        });
                        console.log(this.wlDataList, 'this.wlDataList')
                        console.log(this.gxNoSpecialList)
                        this.dataListLoading = false
                        this.showExportButton = true

                    })


                })

            })
        },
        //广西特殊规则
        getGuangxi() {
            this.areas = '广西'
            this.wlForm.blurry = this.areas
            this.dataListLoading = true
            this.showExportButton = false
            const [year, month, day] = this.dataForm.p_vouchdateend.split('-').map(Number);
            this.labelText = `${this.areas}区域到货明细表--截止${year}年${month}月${day}日`; // 如果没有选择日期，显示默认文本
            this.dateLable = `${month}月${day}日`
            console.log(this.dateLable)
            this.guangxiForm.p_vouchdateend = this.dataForm.p_vouchdateend
            //转时间
            const date = new Date(this.dataForm.p_vouchdateend);
            date.setDate(date.getDate() - 2);
            // this.hainanForm.p_vouchdateend = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            this.hainanForm.p_vouchdateend = this.dataForm.p_vouchdateend

            api.WlsiteAndContactsAPI(this.wlForm).then(res => {
                console.log(res, 'res6666')
                this.wlDataList = res
                this.wlDataList = this.wlDataList.filter(item => item.areaName == '广西');


                api.wlarrivedApi(this.guangxiForm).then(res => {
                    this.dataList = res
                    this.dataList = this.mergeBoxFields(this.dataList)
                    // 过滤掉满足条件的对象
                    this.dataList = this.dataList.filter(item =>
                        !(item.wlSiteName == '桂百河雨帆商贸' && item.productCode == '1520100008')
                    );
                    this.dataList = this.mergeObjectsByCodes(this.dataList);
                    this.dataList = this.dataList.map(item => ({
                        ...item, // 展开原对象的所有属性
                        ["box" + item.productCode]: item.box // 新增动态属性
                    }));

                    this.dataList = Object.values(
                        this.dataList.reduce((acc, item) => {
                            const key = item.wlSiteCode; // 使用 wlSiteCode 作为分组依据

                            if (!acc[key]) {
                                // 初始化新对象，并删除不合并的字段
                                acc[key] = { ...item }; // 先复制所有字段

                                // 删除不合并的字段
                                const fieldsToRemove = [
                                    'box',
                                    'deliverydate',
                                    'factoryProductCode',
                                    'factoryProductName',
                                    'piece',
                                    'productCode',
                                    'vouchdate',
                                    'tel'
                                ];
                                fieldsToRemove.forEach(field => delete acc[key][field]);
                            } else {
                                // 合并其他字段（如 jtProductCode）
                                Object.keys(item).forEach(field => {
                                    // 如果字段不在排除列表，则合并
                                    if (![
                                        'wlSiteCode',
                                        'box',
                                        'deliverydate',
                                        'factoryProductCode',
                                        'factoryProductName',
                                        'piece',
                                        'productCode',
                                        'vouchdate'
                                    ].includes(field)) {
                                        acc[key][field] = item[field]; // 后出现的值会覆盖前面的
                                    }
                                });
                            }

                            return acc;
                        }, {})
                    );
                    console.log(this.dataList, '广西广西')
                    this.dataList = this.processDataassets(this.dataList)
                    // this.dataList = this.processArray(this.dataList)

                    // console.log(this.dataList, 'this.dataList广西')
                    this.dataList = this.dataList.map(item => {
                        let sum = 0;
                        for (const key in item) {
                            // 跳过保留字段
                            if (['areaName', 'days', 'wlSiteCode', 'wlSiteName', 'tel', 'address', 'contacts'].includes(key)) continue;
                            // 其他字段转为数字并累加
                            sum += Number(item[key]) || 0;
                        }
                        // 返回新对象（保留原字段 + 新增 sum）
                        return { ...item, sum };
                    });

                    // 初始化总计对象
                    const totalObj = {
                        areaName: "广西总计",
                        contacts: '广西总计',
                        tel: '广西总计',
                        days: 0,
                        wlSiteCode: "TOTAL",
                        wlSiteName: "广西总计"
                    };

                    // 遍历数组中的每个对象
                    this.dataList.forEach(item => {
                        // 遍历每个对象的属性
                        Object.keys(item).forEach(key => {
                            // 跳过不需要求和的字段
                            if (['areaName', 'days', 'wlSiteCode', 'wlSiteName', 'tel', 'contacts', 'vnote'].includes(key)) {
                                return;
                            }

                            // 初始化总计对象中的字段（如果不存在）
                            if (!totalObj.hasOwnProperty(key)) {
                                totalObj[key] = 0;
                            }

                            // 将值转为数字并累加
                            const value = Number(item[key]) || 0;
                            totalObj[key] += value;
                        });

                        // 累加days字段（如果需要）
                        totalObj.days += Number(item.days) || 0;
                    });

                    // 将总计对象添加到原数组（如果需要）
                    this.dataList.push(totalObj);

                    console.log(this.dataList, ' this.dataListy第一')

                    this.dataList = this.dataList.map(dataItem => {
                        // 在wlDataList中查找匹配的对象
                        const matchedItem = this.wlDataList.find(wlItem =>
                            wlItem.wlSiteName === dataItem.wlSiteName
                        );

                        // 如果找到匹配项，则添加需要的字段
                        if (matchedItem) {
                            return {
                                ...dataItem, // 保留原有属性
                                address: matchedItem.address, // 添加address
                                contacts: matchedItem.contacts, // 添加contacts
                                tel: matchedItem.tel // 添加tel
                            };
                        }

                        // 如果没有找到匹配项，返回原对象
                        return dataItem;
                    });

                    //第二个特殊
                    // const matchedResults = this.matchAndAddSortFields(this.dataList, this.GXDataList1);
                    // const matresult = this.processGroupsBySum(matchedResults);

                    //第三种
                    const treematchedResults = this.matchAndAddSort(this.dataList, this.GXDataList2);
                    const treematresult = this.processGroupsBySum(treematchedResults);

                    const filteredSites = this.filterSites(this.GXDataList, this.dataList);
                    const filteredResult = this.filterByNewsiteMatch(filteredSites, this.dataList);
                    const onderList = this.matchSitesToOnderList(filteredResult, this.dataList);

                    const transformedArray = this.transformFilteredResult(filteredResult);
                    const calculatedList = this.sortAndCalculateOnderList(onderList, transformedArray);

                    const uniqueArray = Array.from(
                        new Map(
                            calculatedList.map(item => [item.wlSiteName, item])
                        ).values()
                    );
                    this.GXfinalResult = this.calculateGroupTotals(uniqueArray);
                    //放固定点规则
                    const gudingList = this.filterSites1(this.GXDataList3, this.dataList)
                    const gudingResult = this.filterByNewsiteMatch(gudingList, this.dataList);
                    const gudingonderList = this.matchSitesToOnderList(gudingResult, this.dataList);
                    const gudingformedArray = this.transformFilteredResult(gudingResult);
                    const gudingculatedList = this.sortAndCalculateOnderList(gudingonderList, gudingformedArray);
                    const gudinguniqueArray = Array.from(
                        new Map(
                            gudingculatedList.map(item => [item.wlSiteName, item])
                        ).values()
                    );
                    const gudingGXfinalResult = this.calculateGroupTotals(gudinguniqueArray);
                    console.log(gudingList, 'gudingList')



                    // 如果 GXfinalResult 可能为 undefined，先初始化
                    this.GXfinalResult = this.GXfinalResult || [];

                    // 将 matresult 数组元素添加到 zjfinalResult
                    // this.GXfinalResult.push(...matresult);
                    this.GXfinalResult.push(...treematresult);
                    this.GXfinalResult.push(...gudingGXfinalResult);





                    //不足50件放桂桂林振兴
                    this.dataList = this.processData(this.dataList)
                    this.dataList = this.processData1(this.dataList)
                    this.dataList = this.processData2(this.dataList)
                    this.dataList = this.processData3(this.dataList)
                    this.dataList = this.processDataall(this.dataList)
                    // this.dataList = this.processDataall1(this.dataList)
                    this.dataList = this.processData2_1(this.dataList)
                    this.dataList = this.processData1_1(this.dataList)
                    this.dataList = this.processData1_2(this.dataList)
                    this.dataList = this.processData1_3(this.dataList)
                    this.dataList = this.processData1_4(this.dataList)
                    this.dataList = this.processData1_5(this.dataList)
                    this.dataList = this.processData1_6(this.dataList)
                    // this.dataList = this.processData1_7(this.dataList)
                    // this.dataList = this.processData1_8(this.dataList)
                    // this.dataList = this.processData1_9(this.dataList)
                    // this.dataList = this.processData1_10(this.dataList)



                    this.dataList = this.dataList.filter(item =>
                        item.wlSiteName.includes(this.bullay)
                    );
                    api.wlguangxiApi(this.hainanForm).then(res => {
                        this.hainanList = res
                        console.log(this.hainanList, ' this.hainanList')
                        this.hainanList.forEach(item => {
                            item["box" + item.productCode] = item.box; // 动态字段名：productCode 的值作为 key，box 的值作为 value
                        });
                        this.hainanList = Object.values(
                            this.hainanList.reduce((acc, item) => {
                                const key = item.wlSiteCode; // 使用 wlSiteCode 作为分组依据

                                if (!acc[key]) {
                                    // 初始化新对象，并删除不合并的字段
                                    acc[key] = { ...item }; // 先复制所有字段

                                    // 删除不合并的字段
                                    const fieldsToRemove = [
                                        'box',
                                        'deliverydate',
                                        'factoryProductCode',
                                        'factoryProductName',
                                        'piece',
                                        'productCode',
                                        'vouchdate',
                                        'tel'
                                    ];
                                    fieldsToRemove.forEach(field => delete acc[key][field]);
                                } else {
                                    // 合并其他字段（如 jtProductCode）
                                    Object.keys(item).forEach(field => {
                                        // 如果字段不在排除列表，则合并
                                        if (![
                                            'wlSiteCode',
                                            'box',
                                            'deliverydate',
                                            'factoryProductCode',
                                            'factoryProductName',
                                            'piece',
                                            'productCode',
                                            'vouchdate'
                                        ].includes(field)) {
                                            acc[key][field] = item[field]; // 后出现的值会覆盖前面的
                                        }
                                    });
                                }

                                return acc;
                            }, {})
                        );
                        this.hainanList = this.hainanList.map(item => {
                            let sum = 0;
                            for (const key in item) {
                                // 跳过保留字段
                                if (['areaName', 'days', 'wlSiteCode', 'wlSiteName', 'tel', 'address', 'contacts'].includes(key)) continue;
                                // 其他字段转为数字并累加
                                sum += Number(item[key]) || 0;
                            }
                            // 返回新对象（保留原字段 + 新增 sum）
                            return { ...item, sum };
                        });
                        // 初始化总计对象
                        const totalObj = {
                            wlSiteName: "海南提货",
                            days: 0,
                            contacts: "海南提货",
                            tel: "海南提货"
                        };

                        // 遍历数组中的每个对象
                        this.hainanList.forEach(item => {
                            // 遍历每个对象的属性
                            Object.keys(item).forEach(key => {
                                // 跳过不需要求和的字段
                                if (['areaName', 'days', 'wlSiteCode', 'wlSiteName', 'tel'].includes(key)) {
                                    return;
                                }

                                // 初始化总计对象中的字段（如果不存在）
                                if (!totalObj.hasOwnProperty(key)) {
                                    totalObj[key] = 0;
                                }

                                // 将值转为数字并累加
                                const value = Number(item[key]) || 0;
                                totalObj[key] += value;
                            });

                            // 累加days字段（如果需要）
                            totalObj.days += Number(item.days) || 0;
                        });

                        // 将总计对象添加到原数组（如果需要）
                        this.dataList.push(totalObj);
                        this.dataList = this.addTotalFromLastTwoItems(this.dataList)
                        // 直接修改原数组
                        this.dataList.forEach((item, index) => {
                            // 如果不是最后三个元素，则添加 startDate
                            if (index < this.dataList.length - 3) {
                                item.startDate = this.dateLable;
                            }
                        });

                        this.dataList = this.dataList.map(dataItem => {
                            // 在wlDataList中查找匹配的对象
                            const matchedItem = this.wlDataList.find(wlItem =>
                                wlItem.wlSiteName === dataItem.wlSiteName
                            );

                            // 如果找到匹配项，则添加需要的字段
                            if (matchedItem) {
                                return {
                                    ...dataItem, // 保留原有属性
                                    address: matchedItem.address, // 添加address
                                    contacts: matchedItem.contacts, // 添加contacts
                                    tel: matchedItem.tel // 添加tel
                                };
                            }

                            // 如果没有找到匹配项，返回原对象
                            return dataItem;
                        });
                        console.log(this.wlDataList, 'this.wlDataList')
                        console.log(this.dataList)
                        this.getGuangxiNo()
                        // this.dataListLoading = false

                    })


                })

            })

        },


        processDataassets(data) {
            // 定义需要处理的字段列表
            const targetFields = [
                'box1520100001', 'box1520100002', 'box1520100010',
                'box1520100009', 'box1520100052', 'box1520100053',
                'box1520100051', 'box1520130001'
            ];

            // 查找两个目标对象
            const sourceObj = data.find(item => item.wlSiteName === '桂南宁奈思商贸');
            const targetObj = data.find(item => item.wlSiteName === '桂南宁兴宁圣泽宇');

            // 检查对象是否存在
            if (!sourceObj) {
                console.log('未找到 wlSiteName 为 "桂南宁奈思商贸" 的对象');
                return data;
            }

            if (!targetObj) {
                console.log('未找到 wlSiteName 为 "桂南宁兴宁圣泽宇" 的对象');
                return data;
            }

            // 计算指定字段的总和
            let totalSum = 0;
            targetFields.forEach(field => {
                const value = parseFloat(sourceObj[field]) || 0;
                totalSum += value;
            });

            console.log(`指定字段总和: ${totalSum}`);

            // 如果总和小于50，执行转移操作
            if (totalSum < 50) {
                targetFields.forEach(field => {
                    const value = parseFloat(sourceObj[field]) || 0;

                    // 将值转移到目标对象（累加）
                    targetObj[field] = (parseFloat(targetObj[field]) || 0) + value;

                    // 将源对象的字段值置空
                    sourceObj[field] = '';
                });

                console.log('字段值转移完成');
            } else {
                console.log('字段值总和大于等于50，不执行转移操作');
            }

            return data;
        },
        processArray(arr) {
            // 找到桂南宁奈思商贸对象
            const sourceObj = arr.find(item => item.wlSiteName === "桂南宁奈思商贸");
            console.log(sourceObj, 'sourceObj')
            if (!sourceObj) {
                console.log("未找到桂南宁奈思商贸对象");
                return arr;
            }

            // 获取两个字段的值并转为数字
            const value1 = Number(sourceObj.box1520100001) || 0;
            const value2 = Number(sourceObj.box1520100002) || 0;
            const sum = value1 + value2;

            // 检查相加是否小于50
            if (sum >= 50) {
                console.log("两个字段值相加不小于50,不进行处理");
                return arr;
            }

            // 找到桂南宁西乡塘祁拓对象
            const targetObj = arr.find(item => item.wlSiteName === "桂南宁西乡塘祁拓");
            if (!targetObj) {
                console.log("未找到桂南宁西乡塘祁拓对象");
                return arr;
            }

            // 进行值相加
            targetObj.box1520100001 = (Number(targetObj.box1520100001) || 0) + value1;
            targetObj.box1520100002 = (Number(targetObj.box1520100002) || 0) + value2;

            // 从源对象中移除这两个字段
            delete sourceObj.box1520100001;
            delete sourceObj.box1520100002;

            return arr;
        },
        addTotalFromLastTwoItems(arr) {
            // 检查数组长度是否足够
            if (arr.length < 2) return arr;

            // 获取最后两个对象
            const last = arr[arr.length - 1];
            const secondLast = arr[arr.length - 2];

            // 需要特殊处理的固定值字段
            const fixedValueFields = {
                wlSiteName: "合计",  // 固定显示"合计"
                contacts: "合计",    // 固定显示"合计"
                tel: "合计",         // 固定显示"合计"
                days: 0             // 固定显示0
            };

            // 需要排除的字段列表（这些字段不参与求和）
            const excludedFields = {
                productName: true   // 示例：productName不参与求和
                // 可以添加其他需要排除的字段
            };

            // 创建合计对象
            const totalItem = {};

            // 首先设置固定值字段
            for (const field in fixedValueFields) {
                totalItem[field] = fixedValueFields[field];
            }

            // 收集所有可能的字段（合并两个对象的键）
            const allFields = new Set([...Object.keys(last), ...Object.keys(secondLast)]);

            // 处理需要相加的字段
            for (const field of allFields) {
                // 跳过固定值字段和排除字段
                if (fixedValueFields[field] !== undefined || excludedFields[field]) continue;

                // 获取值（没有则视为0）
                const lastVal = (last[field] !== undefined && last[field] !== null) ? last[field] : 0;
                const secondLastVal = (secondLast[field] !== undefined && secondLast[field] !== null) ? secondLast[field] : 0;

                // 数值相加处理
                if (typeof lastVal === 'number' && typeof secondLastVal === 'number') {
                    totalItem[field] = lastVal + secondLastVal;
                } else {
                    // 尝试转换为数字相加
                    const num1 = parseFloat(lastVal) || 0;
                    const num2 = parseFloat(secondLastVal) || 0;
                    totalItem[field] = num1 + num2;
                }
            }

            // 返回包含合计的新数组
            return [...arr, totalItem];
        },
        calculate() {
            this.dataListLoading = true
            this.calForm.p_vouchdateend = this.dataForm.p_vouchdateend
            // alert('正在计算中')
            api.getrunOrderArrivedApi(this.calForm).then(res => {
                this.dataListLoading = false
            })
        },
        calculateXInan() {
            this.dataListLoading = true
            this.calForm.p_vouchdateend = this.dataForm.p_vouchdateend
            api.getrunOrderArrivedXINANApi(this.calForm).then(res => {
                this.dataListLoading = false
            })
        },
        calculateFJ() {
            this.dataListLoading = true
            this.fujianForm1.p_vouchdateend = this.dataForm.p_vouchdateend
            api.getrunArrivedFJApi(this.fujianForm1).then(res => {
                this.dataListLoading = false
            })
        },
        calculateZJ() {
            this.dataListLoading = true
            this.zhejiangForm1.p_vouchdateend = this.dataForm.p_vouchdateend
            api.getrunArrivedZJApi(this.zhejiangForm1).then(res => {
                this.dataListLoading = false
            })
        },
        calculateGX() {
            this.guangxiCalForm.p_vouchdatecur = this.dataForm.p_vouchdateend
            this.guangxiCalForm.p_vouchdateend = this.dataForm.p_vouchdateend
            this.dataListLoading = true
            api.getrunArrivedGXApi(this.guangxiCalForm).then(res => {
                this.dataListLoading = false
            })

        },
        calculateJS() {
            this.jiangsuForm.p_vouchdateend = this.dataForm.p_vouchdateend
            this.dataListLoading = true
            api.getrunArrivedJSApi(this.jiangsuForm).then(res => {
                this.dataListLoading = false
            })
        },
        calculateAH() {
            this.anhuiCalForm.p_vouchdatecur = this.dataForm.p_vouchdateend
            this.anhuiCalForm.p_vouchdateend = this.dataForm.p_vouchdateend
            this.dataListLoading = true
            api.getrunArrivedAHApi(this.anhuiCalForm).then(res => {
                this.dataListLoading = false
            })
        },



        wlpersonList() {
            api.wlsitepersonApi(this.siteForm).then(res => {
                this.siteList = res
                console.log(res, 'res')
            })
        },
        getDataList(area, org) {
            this.areas = area ? area : '湖南';
            this.dataForm.p_areaname = area ? area : '湖南';
            this.dataForm.p_orgname = org ? org : '湖南雨帆噜渴乳业股份有限公司';
            this.siteForm.p_areaname = area ? area : '湖南';
            this.wlpersonList()
            this.dataListLoading = true
            this.showExportButton = false
            const [year, month, day] = this.dataForm.p_vouchdateend.split('-').map(Number);
            this.labelText = `${this.areas}区域到货明细表--截止${year}年${month}月${day}日`; // 如果没有选择日期，显示默认文本
            api.wlarrivedApi(this.dataForm).then(res => {
                this.dataList = res
                //所有vnote赋值
                this.dataList = this.propagateVnoteToSameSiteCode(this.dataList)
                this.hnDateList = res
                console.log(this.hnDateList, 'hnDateList')
                this.newArray = this.dataList
                    .filter(item => item.jiuxjinangproductlist)
                    .flatMap(item => item.jiuxjinangproductlist);

                // 2. 过滤掉原数组中包含 jiuxjinangproductlist 的对象
                this.dataList = this.dataList.filter(item => !item.jiuxjinangproductlist);
                if (this.newArray.length != 0) {
                    // this.newArray.forEach(item => {
                    //     item["box" + item.cProductCode] = item.box; // 动态字段名：productCode 的值作为 key，box 的值作为 value
                    // });

                    this.newArray = this.newArray.map(item => ({
                        ...item, // 展开原对象的所有属性
                        ["box" + item.cProductCode]: item.box // 新增动态属性
                    }));
                    this.newArray = Object.values(
                        this.newArray.reduce((acc, item) => {
                            const key = item.vcol2_name; // 使用 wlSiteCode 作为分组依据

                            if (!acc[key]) {
                                // 初始化新对象，并删除不合并的字段
                                acc[key] = { ...item }; // 先复制所有字段

                                // 删除不合并的字段
                                const fieldsToRemove = [
                                    'box',
                                    'vouchdate',
                                    'cProductCode',
                                    'cProductName',
                                ];
                                fieldsToRemove.forEach(field => delete acc[key][field]);
                            } else {
                                // 合并其他字段（如 jtProductCode）
                                Object.keys(item).forEach(field => {
                                    // 如果字段不在排除列表，则合并
                                    if (![
                                        'box',
                                        'cProductCode',
                                        'cProductName',
                                        'vouchdate',
                                        'vcol2_name'
                                    ].includes(field)) {
                                        acc[key][field] = item[field]; // 后出现的值会覆盖前面的
                                    }
                                });
                            }

                            return acc;
                        }, {})
                    );
                    this.newArray = this.newArray.map(item => {
                        let sum = 0;
                        for (const key in item) {
                            // 跳过保留字段
                            if (['vcol6_name', 'vcol6_code', 'vcol2_name', 'vcol2'].includes(key)) continue;
                            // 其他字段转为数字并累加
                            sum += Number(item[key]) || 0;
                        }
                        // 返回新对象（保留原字段 + 新增 sum）
                        return { ...item, sum };
                    });

                    // 初始化总计对象
                    const totalObj = {
                        vcol2_name: "总计",
                        days: 0,
                        wlSiteCode: "TOTAL",
                        wlSiteName: "总计"
                    };

                    // 遍历数组中的每个对象
                    this.newArray.forEach(item => {
                        // 遍历每个对象的属性
                        Object.keys(item).forEach(key => {
                            // 跳过不需要求和的字段
                            if (['vcol6_name', 'vcol6_code', 'vcol2_name', 'vcol2', 'vnote'].includes(key)) {
                                return;
                            }

                            // 初始化总计对象中的字段（如果不存在）
                            if (!totalObj.hasOwnProperty(key)) {
                                totalObj[key] = 0;
                            }

                            // 将值转为数字并累加
                            const value = Number(item[key]) || 0;
                            totalObj[key] += value;
                        });

                        // 累加days字段（如果需要）
                        totalObj.days += Number(item.days) || 0;
                    });

                    // 将总计对象添加到原数组（如果需要）
                    this.newArray.push(totalObj);

                }

                // console.log(this.newArray);
                // console.log(this.dataList, 'this.dataList')


                this.dataList = this.mergeObjectsByCodes(this.dataList);


                const filteredList = this.dataList.filter(item => item.wlSiteCode === "1013190");
                console.log(filteredList, '筛选后的数组');


                this.dataList = this.dataList.map(item => ({
                    ...item, // 展开原对象的所有属性
                    ["box" + item.productCode]: item.box // 新增动态属性
                }));

                console.log(this.dataList, ' this.dataList')


                this.dataList = Object.values(
                    this.dataList.reduce((acc, item) => {
                        const key = item.wlSiteCode; // 使用 wlSiteCode 作为分组依据

                        if (!acc[key]) {
                            // 初始化新对象，并删除不合并的字段
                            acc[key] = { ...item }; // 先复制所有字段

                            // 删除不合并的字段
                            const fieldsToRemove = [
                                'box',
                                'deliverydate',
                                'factoryProductCode',
                                'factoryProductName',
                                'piece',
                                'productCode',
                                'vouchdate'
                            ];
                            fieldsToRemove.forEach(field => delete acc[key][field]);
                        } else {
                            // 合并其他字段（如 jtProductCode）
                            Object.keys(item).forEach(field => {
                                // 如果字段不在排除列表，则合并
                                if (![
                                    'wlSiteCode',
                                    'box',
                                    'deliverydate',
                                    'factoryProductCode',
                                    'factoryProductName',
                                    'piece',
                                    'productCode',
                                    'vouchdate'
                                ].includes(field)) {
                                    acc[key][field] = item[field]; // 后出现的值会覆盖前面的
                                }
                            });
                        }

                        return acc;
                    }, {})
                );



                // 定义排序顺序
                const order = [
                    "市外双号线路一",
                    "市外双号线路二",
                    "市外双号线路三",
                    "市外双号线路四",
                    "市外双号线路五",
                    "市外双号线路六",
                    "市外双号线路七",
                    "市外单号线路一",
                    "市外单号线路二",
                    "市外单号线路三",
                    "市外单号线路四",
                    "市外单号线路五",
                    "市外单号线路六",
                    "市外单号线路七",
                    "市内单号",
                    "市内双号",
                ];

                // 按自定义顺序排序
                this.dataList = this.dataList.sort((a, b) => {
                    const indexA = order.indexOf(a.linename);
                    const indexB = order.indexOf(b.linename);
                    return indexA - indexB;
                });
                this.dataList = this.dataList.map(item => {
                    let sum = 0;
                    for (const key in item) {
                        // 跳过保留字段
                        if (['areaName', 'days', 'wlSiteCode', 'wlSiteName', 'vnot'].includes(key)) continue;
                        // 其他字段转为数字并累加
                        sum += Number(item[key]) || 0;
                    }
                    // 返回新对象（保留原字段 + 新增 sum）
                    return { ...item, sum };
                });


                // 初始化总计对象
                const totalObj = {
                    areaName: "总计",
                    days: 0,
                    wlSiteCode: "TOTAL",
                    wlSiteName: "总计"
                };

                // 遍历数组中的每个对象
                this.dataList.forEach(item => {
                    // 遍历每个对象的属性
                    Object.keys(item).forEach(key => {
                        // 跳过不需要求和的字段
                        if (['areaName', 'days', 'wlSiteCode', 'wlSiteName', 'vnote'].includes(key)) {
                            return;
                        }

                        // 初始化总计对象中的字段（如果不存在）
                        if (!totalObj.hasOwnProperty(key)) {
                            totalObj[key] = 0;
                        }

                        // 将值转为数字并累加
                        const value = Number(item[key]) || 0;
                        totalObj[key] += value;
                    });

                    // 累加days字段（如果需要）
                    totalObj.days += Number(item.days) || 0;
                });

                // 将总计对象添加到原数组（如果需要）
                this.dataList.push(totalObj);


                this.dataList = this.dataList.filter(item =>
                    item.wlSiteName.includes(this.bullay)
                );


                this.dataList = this.formatData(this.dataList)



                this.dataListLoading = false
                this.showExportButton = true
                console.log(this.dataList, '湖南')
            })

        },

        propagateVnoteToSameSiteCode(array) {
            // 首先创建一个映射，记录每个wlSiteCode对应的vnote值
            const siteCodeToVnote = new Map();

            // 第一次遍历：收集所有有vnote的值
            for (const item of array) {
                if (item.vnote) {
                    // 如果这个siteCode还没有记录，或者当前记录的vnote为空，则更新
                    if (!siteCodeToVnote.has(item.wlSiteCode)) {
                        siteCodeToVnote.set(item.wlSiteCode, item.vnote);
                    }
                }
            }

            // 第二次遍历：将收集到的vnote赋给所有相同siteCode的对象
            for (const item of array) {
                if (siteCodeToVnote.has(item.wlSiteCode)) {
                    item.vnote = siteCodeToVnote.get(item.wlSiteCode);
                }
            }

            return array;
        },
        mergeObjectsByCodes(array) {
            const resultMap = new Map();

            array.forEach(obj => {
                const key = `${obj.wlSiteCode}_${obj.productCode}`;

                if (resultMap.has(key)) {
                    // 如果已存在相同键的对象，则合并box值
                    const existingObj = resultMap.get(key);
                    existingObj.box = (parseFloat(existingObj.box) || 0) + (parseFloat(obj.box) || 0);

                    // 保留其他字段（如果原对象中有新字段，也会被保留）
                    resultMap.set(key, { ...obj, ...existingObj });
                } else {
                    // 如果是新键，则直接添加，同时确保box是数字
                    resultMap.set(key, {
                        ...obj,
                        box: parseFloat(obj.box) || 0
                    });
                }
            });

            return Array.from(resultMap.values());
        },
        mergeSitesAndRemoveFields(data) {
            if (!Array.isArray(data)) return [];

            const resultMap = new Map();

            data.forEach(item => {
                const siteName = item.wlSiteName;
                const { box, cproductname, cproductcode, ...cleanItem } = item;

                if (!resultMap.has(siteName)) {
                    resultMap.set(siteName, cleanItem);
                } else {
                    const existing = resultMap.get(siteName);
                    Object.keys(cleanItem).forEach(key => {
                        if (key !== 'wlSiteName') {
                            const val = parseFloat(cleanItem[key]) || 0;
                            const existingVal = parseFloat(existing[key]) || 0;
                            existing[key] = existingVal + val;
                        }
                    });
                }
            });

            return Array.from(resultMap.values());
        },
        formatData(data) {
            return data.map(item => {
                const formattedItem = {};
                for (const key in item) {
                    if (key === 'areaName' || key === 'days' || key === 'wlSiteCode' || key === 'wlSiteName' || key === 'vnote') {
                        formattedItem[key] = item[key];
                    } else {
                        // 尝试转换为数字并保留两位小数
                        const num = parseFloat(item[key]);
                        formattedItem[key] = isNaN(num) ? item[key] : parseFloat(num.toFixed(0));
                    }
                }
                return formattedItem;
            });
        },

        processData(data) {
            // 1. 找到目标对象（wlSiteName === "桂桂林振兴"）
            const targetSite = data.find(item => item.wlSiteName === "桂桂林振兴");

            if (!targetSite) {
                console.log("未找到 wlSiteName 为 '桂桂林振兴' 的对象");
                return data;
            }

            // 2. 需要匹配的站点名称（不包括 "桂桂林振兴"）
            const siteNames = [
                "桂桂林振兴0069",
                "桂桂林资源荣熙",
                "桂桂林全州斌丽",
                "桂桂林永福百佳",
                "桂桂林兴安美思"
            ];

            // 3. 遍历数据，处理符合条件的对象
            const result = data.filter(item => {
                if (siteNames.includes(item.wlSiteName)) {
                    if (item.sum < 50) {
                        // 获取所有字段名
                        const allFields = Object.keys(item);
                        const fieldsToRemove = ["wlSiteName", "wlSiteCode", "tel", "productName", "contacts", "areaName", "address"];

                        // 遍历所有字段，把非 fieldsToRemove 的字段转为数字后相加到 targetSite
                        allFields.forEach(field => {
                            if (!fieldsToRemove.includes(field)) {
                                // 尝试将值转为数字
                                const numValue = parseFloat(item[field]);
                                if (!isNaN(numValue)) { // 如果是有效数字
                                    // 如果 targetSite 没有该字段，初始化为 0
                                    if (targetSite[field] === undefined) {
                                        targetSite[field] = 0;
                                    }
                                    // 确保 targetSite[field] 是数字（如果不是，尝试转换）
                                    const targetNum = parseFloat(targetSite[field]);
                                    if (!isNaN(targetNum)) {
                                        targetSite[field] = targetNum + numValue;
                                    }
                                }
                            }
                        });

                        // 过滤掉这个对象（sum < 50 的站点）
                        return false;
                    }
                }
                // 保留其他对象（sum >= 50 或非目标站点）
                return true;
            });

            return result;
        },
        processData1(data) {
            // 1. 找到目标对象（wlSiteName === "桂南宁青秀永明福"）
            const targetSite = data.find(item => item.wlSiteName === "桂南宁青秀永明福");

            if (!targetSite) {
                console.log("未找到 wlSiteName 为 '桂南宁青秀永明福' 的对象");
                return data;
            }

            // 2. 需要匹配的站点名称（不包括 "桂南宁青秀永明福"）
            const siteNames = [
                "桂南宁江南众焱"
            ];

            // 3. 遍历数据，处理符合条件的对象
            const result = data.filter(item => {
                if (siteNames.includes(item.wlSiteName)) {
                    if (item.sum < 50) {
                        // 获取所有字段名
                        const allFields = Object.keys(item);
                        const fieldsToRemove = ["wlSiteName", "wlSiteCode", "tel", "productName", "contacts", "areaName", "address"];

                        // 遍历所有字段，把非 fieldsToRemove 的字段转为数字后相加到 targetSite
                        allFields.forEach(field => {
                            if (!fieldsToRemove.includes(field)) {
                                // 尝试将值转为数字
                                const numValue = parseFloat(item[field]);
                                if (!isNaN(numValue)) { // 如果是有效数字
                                    // 如果 targetSite 没有该字段，初始化为 0
                                    if (targetSite[field] === undefined) {
                                        targetSite[field] = 0;
                                    }
                                    // 确保 targetSite[field] 是数字（如果不是，尝试转换）
                                    const targetNum = parseFloat(targetSite[field]);
                                    if (!isNaN(targetNum)) {
                                        targetSite[field] = targetNum + numValue;
                                    }
                                }
                            }
                        });

                        // 过滤掉这个对象（sum < 50 的站点）
                        return false;
                    }
                }
                // 保留其他对象（sum >= 50 或非目标站点）
                return true;
            });

            return result;
        },
        processData1_1(data) {
            // 1. 找到目标对象（wlSiteName === "桂防城港锐鑫帆"）
            const targetSite = data.find(item => item.wlSiteName === "桂防城港锐鑫帆");

            if (!targetSite) {
                console.log("未找到 wlSiteName 为 '桂防城港锐鑫帆' 的对象");
                return data;
            }

            // 2. 需要匹配的站点名称（不包括 "桂南宁青秀永明福"）
            const siteNames = [
                "桂防城港东兴丹桂"
            ];

            // 3. 遍历数据，处理符合条件的对象
            const result = data.filter(item => {
                if (siteNames.includes(item.wlSiteName)) {
                    if (item.sum < 50) {
                        // 获取所有字段名
                        const allFields = Object.keys(item);
                        const fieldsToRemove = ["wlSiteName", "wlSiteCode", "tel", "productName", "contacts", "areaName", "address"];

                        // 遍历所有字段，把非 fieldsToRemove 的字段转为数字后相加到 targetSite
                        allFields.forEach(field => {
                            if (!fieldsToRemove.includes(field)) {
                                // 尝试将值转为数字
                                const numValue = parseFloat(item[field]);
                                if (!isNaN(numValue)) { // 如果是有效数字
                                    // 如果 targetSite 没有该字段，初始化为 0
                                    if (targetSite[field] === undefined) {
                                        targetSite[field] = 0;
                                    }
                                    // 确保 targetSite[field] 是数字（如果不是，尝试转换）
                                    const targetNum = parseFloat(targetSite[field]);
                                    if (!isNaN(targetNum)) {
                                        targetSite[field] = targetNum + numValue;
                                    }
                                }
                            }
                        });

                        // 过滤掉这个对象（sum < 50 的站点）
                        return false;
                    }
                }
                // 保留其他对象（sum >= 50 或非目标站点）
                return true;
            });

            return result;
        },
        processData1_2(data) {
            // 1. 找到目标对象（wlSiteName === "桂南宁青秀永明福"）
            const targetSite = data.find(item => item.wlSiteName === "桂百色平果牛牛顺");

            if (!targetSite) {
                console.log("未找到 wlSiteName 为 '桂百色平果牛牛顺' 的对象");
                return data;
            }

            // 2. 需要匹配的站点名称（不包括 "桂南宁青秀永明福"）
            const siteNames = [
                "桂百色田东冠程", "桂南宁良庆福润"
            ];

            // 3. 遍历数据，处理符合条件的对象
            const result = data.filter(item => {
                if (siteNames.includes(item.wlSiteName)) {
                    if (item.sum < 50) {
                        // 获取所有字段名
                        const allFields = Object.keys(item);
                        const fieldsToRemove = ["wlSiteName", "wlSiteCode", "tel", "productName", "contacts", "areaName", "address"];

                        // 遍历所有字段，把非 fieldsToRemove 的字段转为数字后相加到 targetSite
                        allFields.forEach(field => {
                            if (!fieldsToRemove.includes(field)) {
                                // 尝试将值转为数字
                                const numValue = parseFloat(item[field]);
                                if (!isNaN(numValue)) { // 如果是有效数字
                                    // 如果 targetSite 没有该字段，初始化为 0
                                    if (targetSite[field] === undefined) {
                                        targetSite[field] = 0;
                                    }
                                    // 确保 targetSite[field] 是数字（如果不是，尝试转换）
                                    const targetNum = parseFloat(targetSite[field]);
                                    if (!isNaN(targetNum)) {
                                        targetSite[field] = targetNum + numValue;
                                    }
                                }
                            }
                        });

                        // 过滤掉这个对象（sum < 50 的站点）
                        return false;
                    }
                }
                // 保留其他对象（sum >= 50 或非目标站点）
                return true;
            });

            return result;
        },
        processData1_3(data) {
            // 1. 找到目标对象（wlSiteName === "桂南宁青秀永明福"）
            const targetSite = data.find(item => item.wlSiteName === "桂梧州鑫皓");

            if (!targetSite) {
                console.log("未找到 wlSiteName 为 '桂梧州鑫皓' 的对象");
                return data;
            }

            // 2. 需要匹配的站点名称（不包括 "桂南宁青秀永明福"）
            const siteNames = [
                "桂梧州岑溪恒顺", "桂梧州藤县政顺"
            ];

            // 3. 遍历数据，处理符合条件的对象
            const result = data.filter(item => {
                if (siteNames.includes(item.wlSiteName)) {
                    if (item.sum < 50) {
                        // 获取所有字段名
                        const allFields = Object.keys(item);
                        const fieldsToRemove = ["wlSiteName", "wlSiteCode", "tel", "productName", "contacts", "areaName", "address"];

                        // 遍历所有字段，把非 fieldsToRemove 的字段转为数字后相加到 targetSite
                        allFields.forEach(field => {
                            if (!fieldsToRemove.includes(field)) {
                                // 尝试将值转为数字
                                const numValue = parseFloat(item[field]);
                                if (!isNaN(numValue)) { // 如果是有效数字
                                    // 如果 targetSite 没有该字段，初始化为 0
                                    if (targetSite[field] === undefined) {
                                        targetSite[field] = 0;
                                    }
                                    // 确保 targetSite[field] 是数字（如果不是，尝试转换）
                                    const targetNum = parseFloat(targetSite[field]);
                                    if (!isNaN(targetNum)) {
                                        targetSite[field] = targetNum + numValue;
                                    }
                                }
                            }
                        });

                        // 过滤掉这个对象（sum < 50 的站点）
                        return false;
                    }
                }
                // 保留其他对象（sum >= 50 或非目标站点）
                return true;
            });

            return result;
        },
        processData1_4(data) {
            // 1. 找到目标对象（wlSiteName === "桂南宁青秀永明福"）
            const targetSite = data.find(item => item.wlSiteName === "桂贵港雨顺");

            if (!targetSite) {
                console.log("未找到 wlSiteName 为 '桂南宁青秀永明福' 的对象");
                return data;
            }

            // 2. 需要匹配的站点名称（不包括 "桂南宁青秀永明福"）
            const siteNames = [
                "桂贵港平南明威"
            ];

            // 3. 遍历数据，处理符合条件的对象
            const result = data.filter(item => {
                if (siteNames.includes(item.wlSiteName)) {
                    if (item.sum < 50) {
                        // 获取所有字段名
                        const allFields = Object.keys(item);
                        const fieldsToRemove = ["wlSiteName", "wlSiteCode", "tel", "productName", "contacts", "areaName", "address"];

                        // 遍历所有字段，把非 fieldsToRemove 的字段转为数字后相加到 targetSite
                        allFields.forEach(field => {
                            if (!fieldsToRemove.includes(field)) {
                                // 尝试将值转为数字
                                const numValue = parseFloat(item[field]);
                                if (!isNaN(numValue)) { // 如果是有效数字
                                    // 如果 targetSite 没有该字段，初始化为 0
                                    if (targetSite[field] === undefined) {
                                        targetSite[field] = 0;
                                    }
                                    // 确保 targetSite[field] 是数字（如果不是，尝试转换）
                                    const targetNum = parseFloat(targetSite[field]);
                                    if (!isNaN(targetNum)) {
                                        targetSite[field] = targetNum + numValue;
                                    }
                                }
                            }
                        });

                        // 过滤掉这个对象（sum < 50 的站点）
                        return false;
                    }
                }
                // 保留其他对象（sum >= 50 或非目标站点）
                return true;
            });

            return result;
        },
        processData1_5(data) {
            // 1. 找到目标对象（wlSiteName === "桂南宁青秀永明福"）
            const targetSite = data.find(item => item.wlSiteName === "桂百色宝庆");

            if (!targetSite) {
                console.log("未找到 wlSiteName 为 '桂南宁青秀永明福' 的对象");
                return data;
            }

            // 2. 需要匹配的站点名称（不包括 "桂南宁青秀永明福"）
            const siteNames = [
                "桂百色凌云百货"
            ];

            // 3. 遍历数据，处理符合条件的对象
            const result = data.filter(item => {
                if (siteNames.includes(item.wlSiteName)) {
                    if (item.sum < 50) {
                        // 获取所有字段名
                        const allFields = Object.keys(item);
                        const fieldsToRemove = ["wlSiteName", "wlSiteCode", "tel", "productName", "contacts", "areaName", "address"];

                        // 遍历所有字段，把非 fieldsToRemove 的字段转为数字后相加到 targetSite
                        allFields.forEach(field => {
                            if (!fieldsToRemove.includes(field)) {
                                // 尝试将值转为数字
                                const numValue = parseFloat(item[field]);
                                if (!isNaN(numValue)) { // 如果是有效数字
                                    // 如果 targetSite 没有该字段，初始化为 0
                                    if (targetSite[field] === undefined) {
                                        targetSite[field] = 0;
                                    }
                                    // 确保 targetSite[field] 是数字（如果不是，尝试转换）
                                    const targetNum = parseFloat(targetSite[field]);
                                    if (!isNaN(targetNum)) {
                                        targetSite[field] = targetNum + numValue;
                                    }
                                }
                            }
                        });

                        // 过滤掉这个对象（sum < 50 的站点）
                        return false;
                    }
                }
                // 保留其他对象（sum >= 50 或非目标站点）
                return true;
            });

            return result;
        },

        processData1_6(data) {
            // 1. 找到目标对象（wlSiteName === "桂崇左盛昌源"）
            let targetSite = data.find(item => item.wlSiteName === "桂崇左盛昌源");

            if (!targetSite) {
                targetSite = data.find(item => item.wlSiteName === "桂崇左凭祥隆润");
                if (!targetSite) {
                    console.warn("未找到目标站点：既没有'桂崇左盛昌源'，也没有'桂崇左凭祥隆润'");
                    return data; // 如果两个目标站点都不存在，直接返回原数据
                }
            }

            // 2. 需要匹配的站点名称（不包括 "桂南宁青秀永明福"）
            const siteNames = [
                "桂崇左宁明恒佑"
            ];

            // 3. 遍历数据，处理符合条件的对象
            const result = data.filter(item => {
                if (siteNames.includes(item.wlSiteName)) {
                    if (item.sum < 50) {
                        // 获取所有字段名
                        const allFields = Object.keys(item);
                        const fieldsToRemove = ["wlSiteName", "wlSiteCode", "tel", "productName", "contacts", "areaName", "address"];

                        // 遍历所有字段，把非 fieldsToRemove 的字段转为数字后相加到 targetSite
                        allFields.forEach(field => {
                            if (!fieldsToRemove.includes(field)) {
                                // 尝试将值转为数字
                                const numValue = parseFloat(item[field]);
                                if (!isNaN(numValue)) { // 如果是有效数字
                                    // 如果 targetSite 没有该字段，初始化为 0
                                    if (targetSite[field] === undefined) {
                                        targetSite[field] = 0;
                                    }
                                    // 确保 targetSite[field] 是数字（如果不是，尝试转换）
                                    const targetNum = parseFloat(targetSite[field]);
                                    if (!isNaN(targetNum)) {
                                        targetSite[field] = targetNum + numValue;
                                    }
                                }
                            }
                        });

                        // 过滤掉这个对象（sum < 50 的站点）
                        return false;
                    }
                }
                // 保留其他对象（sum >= 50 或非目标站点）
                return true;
            });

            return result;
        },

        processData1_7(data) {
            // 1. 找到目标对象（wlSiteName === "桂河池嘉希"）
            const targetSite = data.find(item => item.wlSiteName === "桂河池嘉希");

            if (!targetSite) {
                console.log("未找到 wlSiteName 为 '桂河池嘉希' 的对象");
                return data;
            }

            // 2. 需要匹配的站点名称（不包括 "桂河池嘉希"）
            const siteNames = [
                "桂河池巴马叶师傅"
            ];

            // 3. 遍历数据，处理符合条件的对象
            const result = data.filter(item => {
                if (siteNames.includes(item.wlSiteName)) {
                    if (item.sum < 50) {
                        // 获取所有字段名
                        const allFields = Object.keys(item);
                        const fieldsToRemove = ["wlSiteName", "wlSiteCode", "tel", "productName", "contacts", "areaName", "address"];

                        // 遍历所有字段，把非 fieldsToRemove 的字段转为数字后相加到 targetSite
                        allFields.forEach(field => {
                            if (!fieldsToRemove.includes(field)) {
                                // 尝试将值转为数字
                                const numValue = parseFloat(item[field]);
                                if (!isNaN(numValue)) { // 如果是有效数字
                                    // 如果 targetSite 没有该字段，初始化为 0
                                    if (targetSite[field] === undefined) {
                                        targetSite[field] = 0;
                                    }
                                    // 确保 targetSite[field] 是数字（如果不是，尝试转换）
                                    const targetNum = parseFloat(targetSite[field]);
                                    if (!isNaN(targetNum)) {
                                        targetSite[field] = targetNum + numValue;
                                    }
                                }
                            }
                        });

                        // 过滤掉这个对象（sum < 50 的站点）
                        return false;
                    }
                }
                // 保留其他对象（sum >= 50 或非目标站点）
                return true;
            });

            return result;
        },

        processData1_8(data) {
            // 1. 找到目标对象（wlSiteName === "桂南宁良庆福润"）
            const targetSite = data.find(item => item.wlSiteName === "桂百色平果牛牛顺");

            if (!targetSite) {
                console.log("未找到 wlSiteName 为 '桂百色平果牛牛顺' 的对象");
                return data;
            }

            // 2. 需要匹配的站点名称（不包括 "桂柳州米德"）
            const siteNames = [
                "桂南宁良庆福润"
            ];

            // 3. 遍历数据，处理符合条件的对象
            const result = data.filter(item => {
                if (siteNames.includes(item.wlSiteName)) {
                    if (item.sum < 50) {
                        // 获取所有字段名
                        const allFields = Object.keys(item);
                        const fieldsToRemove = ["wlSiteName", "wlSiteCode", "tel", "productName", "contacts", "areaName", "address"];

                        // 遍历所有字段，把非 fieldsToRemove 的字段转为数字后相加到 targetSite
                        allFields.forEach(field => {
                            if (!fieldsToRemove.includes(field)) {
                                // 尝试将值转为数字
                                const numValue = parseFloat(item[field]);
                                if (!isNaN(numValue)) { // 如果是有效数字
                                    // 如果 targetSite 没有该字段，初始化为 0
                                    if (targetSite[field] === undefined) {
                                        targetSite[field] = 0;
                                    }
                                    // 确保 targetSite[field] 是数字（如果不是，尝试转换）
                                    const targetNum = parseFloat(targetSite[field]);
                                    if (!isNaN(targetNum)) {
                                        targetSite[field] = targetNum + numValue;
                                    }
                                }
                            }
                        });

                        // 过滤掉这个对象（sum < 50 的站点）
                        return false;
                    }
                }
                // 保留其他对象（sum >= 50 或非目标站点）
                return true;
            });

            return result;
        },
        processData1_9(data) {
            // 1. 找到目标对象（wlSiteName === "桂河池宜州金顺"）
            const targetSite = data.find(item => item.wlSiteName === "桂河池宜州金顺");

            if (!targetSite) {
                console.log("未找到 wlSiteName 为 '桂河池宜州金顺' 的对象");
                return data;
            }

            // 2. 需要匹配的站点名称（不包括 "桂柳州米德"）
            const siteNames = [
                "桂河池环江云乐食品"
            ];

            // 3. 遍历数据，处理符合条件的对象
            const result = data.filter(item => {
                if (siteNames.includes(item.wlSiteName)) {
                    if (item.sum < 50) {
                        // 获取所有字段名
                        const allFields = Object.keys(item);
                        const fieldsToRemove = ["wlSiteName", "wlSiteCode", "tel", "productName", "contacts", "areaName", "address"];

                        // 遍历所有字段，把非 fieldsToRemove 的字段转为数字后相加到 targetSite
                        allFields.forEach(field => {
                            if (!fieldsToRemove.includes(field)) {
                                // 尝试将值转为数字
                                const numValue = parseFloat(item[field]);
                                if (!isNaN(numValue)) { // 如果是有效数字
                                    // 如果 targetSite 没有该字段，初始化为 0
                                    if (targetSite[field] === undefined) {
                                        targetSite[field] = 0;
                                    }
                                    // 确保 targetSite[field] 是数字（如果不是，尝试转换）
                                    const targetNum = parseFloat(targetSite[field]);
                                    if (!isNaN(targetNum)) {
                                        targetSite[field] = targetNum + numValue;
                                    }
                                }
                            }
                        });

                        // 过滤掉这个对象（sum < 50 的站点）
                        return false;
                    }
                }
                // 保留其他对象（sum >= 50 或非目标站点）
                return true;
            });

            return result;
        },


        processData1_10(data) {
            // 1. 找到目标对象（wlSiteName === "桂河池嘉希"）
            const targetSite = data.find(item => item.wlSiteName === "桂河池嘉希");

            if (!targetSite) {
                console.log("未找到 wlSiteName 为 '桂河池嘉希' 的对象");
                return data;
            }

            // 2. 需要匹配的站点名称（不包括 "桂柳州米德"）
            const siteNames = [
                "桂河池南丹源亿"
            ];

            // 3. 遍历数据，处理符合条件的对象
            const result = data.filter(item => {
                if (siteNames.includes(item.wlSiteName)) {
                    if (item.sum < 100) {
                        // 获取所有字段名
                        const allFields = Object.keys(item);
                        const fieldsToRemove = ["wlSiteName", "wlSiteCode", "tel", "productName", "contacts", "areaName", "address"];

                        // 遍历所有字段，把非 fieldsToRemove 的字段转为数字后相加到 targetSite
                        allFields.forEach(field => {
                            if (!fieldsToRemove.includes(field)) {
                                // 尝试将值转为数字
                                const numValue = parseFloat(item[field]);
                                if (!isNaN(numValue)) { // 如果是有效数字
                                    // 如果 targetSite 没有该字段，初始化为 0
                                    if (targetSite[field] === undefined) {
                                        targetSite[field] = 0;
                                    }
                                    // 确保 targetSite[field] 是数字（如果不是，尝试转换）
                                    const targetNum = parseFloat(targetSite[field]);
                                    if (!isNaN(targetNum)) {
                                        targetSite[field] = targetNum + numValue;
                                    }
                                }
                            }
                        });

                        // 过滤掉这个对象（sum < 50 的站点）
                        return false;
                    }
                }
                // 保留其他对象（sum >= 50 或非目标站点）
                return true;
            });

            return result;
        },


        processData2(data) {
            // 1. 找到目标对象（wlSiteName === "桂柳州米德"）
            const targetSite = data.find(item => item.wlSiteName === "桂柳州米德");

            if (!targetSite) {
                console.log("未找到 wlSiteName 为 '桂柳州米德' 的对象");
                return data;
            }

            // 2. 需要匹配的站点名称（不包括 "桂柳州米德"）
            const siteNames = [
                "桂柳州柳北李建重", "桂柳州城中严明高"
            ];

            // 3. 遍历数据，处理符合条件的对象
            const result = data.filter(item => {
                if (siteNames.includes(item.wlSiteName)) {
                    if (item.sum > 0) {
                        // 获取所有字段名
                        const allFields = Object.keys(item);
                        const fieldsToRemove = ["wlSiteName", "wlSiteCode", "tel", "productName", "contacts", "areaName", "address"];

                        // 遍历所有字段，把非 fieldsToRemove 的字段转为数字后相加到 targetSite
                        allFields.forEach(field => {
                            if (!fieldsToRemove.includes(field)) {
                                // 尝试将值转为数字
                                const numValue = parseFloat(item[field]);
                                if (!isNaN(numValue)) { // 如果是有效数字
                                    // 如果 targetSite 没有该字段，初始化为 0
                                    if (targetSite[field] === undefined) {
                                        targetSite[field] = 0;
                                    }
                                    // 确保 targetSite[field] 是数字（如果不是，尝试转换）
                                    const targetNum = parseFloat(targetSite[field]);
                                    if (!isNaN(targetNum)) {
                                        targetSite[field] = targetNum + numValue;
                                    }
                                }
                            }
                        });

                        // 过滤掉这个对象（sum < 50 的站点）
                        return false;
                    }
                }
                // 保留其他对象（sum >= 50 或非目标站点）
                return true;
            });

            return result;
        },
        processData2_1(data) {
            // 1. 找到目标对象（wlSiteName === "桂南宁横县湘旺"）
            const targetSite = data.find(item => item.wlSiteName === "桂南宁横县湘旺");

            if (!targetSite) {
                console.log("未找到 wlSiteName 为 '桂南宁横县湘旺' 的对象");
                return data;
            }

            // 2. 需要匹配的站点名称（不包括 "桂南宁横县湘旺"）
            const siteNames = [
                "桂南宁宾阳汇成", "桂南宁上林海硕"
            ];

            // 3. 遍历数据，处理符合条件的对象
            const result = data.filter(item => {
                if (siteNames.includes(item.wlSiteName)) {
                    if (item.sum > 0) {
                        // 获取所有字段名
                        const allFields = Object.keys(item);
                        const fieldsToRemove = ["wlSiteName", "wlSiteCode", "tel", "productName", "contacts", "areaName", "address"];

                        // 遍历所有字段，把非 fieldsToRemove 的字段转为数字后相加到 targetSite
                        allFields.forEach(field => {
                            if (!fieldsToRemove.includes(field)) {
                                // 尝试将值转为数字
                                const numValue = parseFloat(item[field]);
                                if (!isNaN(numValue)) { // 如果是有效数字
                                    // 如果 targetSite 没有该字段，初始化为 0
                                    if (targetSite[field] === undefined) {
                                        targetSite[field] = 0;
                                    }
                                    // 确保 targetSite[field] 是数字（如果不是，尝试转换）
                                    const targetNum = parseFloat(targetSite[field]);
                                    if (!isNaN(targetNum)) {
                                        targetSite[field] = targetNum + numValue;
                                    }
                                }
                            }
                        });

                        // 过滤掉这个对象（sum < 50 的站点）
                        return false;
                    }
                }
                // 保留其他对象（sum >= 50 或非目标站点）
                return true;
            });

            return result;
        },
        processData3(data) {
            // 1. 找到目标对象（wlSiteName === "桂百色宝庆"）
            const targetSite = data.find(item => item.wlSiteName === "桂百色宝庆");

            if (!targetSite) {
                console.log("未找到 wlSiteName 为 '桂百色宝庆' 的对象");
                return data;
            }

            // 2. 需要匹配的站点名称（不包括 "桂百色宝庆"）
            const siteNames = [
                "桂百色田阳程顺"
            ];

            // 3. 遍历数据，处理符合条件的对象
            const result = data.filter(item => {
                if (siteNames.includes(item.wlSiteName)) {
                    if (item.sum < 50) {
                        // 获取所有字段名
                        const allFields = Object.keys(item);
                        const fieldsToRemove = ["wlSiteName", "wlSiteCode", "tel", "productName", "contacts", "areaName", "address"];

                        // 遍历所有字段，把非 fieldsToRemove 的字段转为数字后相加到 targetSite
                        allFields.forEach(field => {
                            if (!fieldsToRemove.includes(field)) {
                                // 尝试将值转为数字
                                const numValue = parseFloat(item[field]);
                                if (!isNaN(numValue)) { // 如果是有效数字
                                    // 如果 targetSite 没有该字段，初始化为 0
                                    if (targetSite[field] === undefined) {
                                        targetSite[field] = 0;
                                    }
                                    // 确保 targetSite[field] 是数字（如果不是，尝试转换）
                                    const targetNum = parseFloat(targetSite[field]);
                                    if (!isNaN(targetNum)) {
                                        targetSite[field] = targetNum + numValue;
                                    }
                                }
                            }
                        });

                        // 过滤掉这个对象（sum < 50 的站点）
                        return false;
                    }
                }
                // 保留其他对象（sum >= 50 或非目标站点）
                return true;
            });

            return result;
        },
        processDataall(data) {
            // 目标站点名称列表
            const targetNames = ["桂南宁宾阳汇成", "桂南宁横县湘旺", "桂南宁上林海硕"];

            // 获取目标站点
            const targetSites = data.filter(item => targetNames.includes(item.wlSiteName));

            if (targetSites.length === 0) {
                return data; // 没有目标站点，直接返回原数据
            }

            // 分离sum≥50和sum<50的站点
            const sitesOver50 = targetSites.filter(item => item.sum >= 50);
            const sitesUnder50 = targetSites.filter(item => item.sum < 50);

            // 如果没有需要合并的站点（全部≥50或没有<50的）
            if (sitesUnder50.length <= 1) {
                return data;
            }

            // 对sum<50的站点执行合并逻辑
            const sortedSites = [...sitesUnder50].sort((a, b) => b.sum - a.sum);
            const maxSumSite = sortedSites[0];
            const others = sortedSites.slice(1);

            // 创建新对象用于合并（避免修改原数据）
            const mergedSite = { ...maxSumSite };

            // 合并数值字段
            others.forEach(site => {
                Object.keys(site).forEach(field => {
                    const excludedFields = ["wlSiteName", "wlSiteCode", "tel", "productName",
                        "contacts", "areaName", "address"];
                    if (!excludedFields.includes(field)) {
                        const value = parseFloat(site[field]);
                        if (!isNaN(value)) {
                            mergedSite[field] = (mergedSite[field] || 0) + value;
                            // 保留1位小数（如果是数值字段）
                            if (typeof site[field] === 'number') {
                                mergedSite[field] = parseFloat(mergedSite[field].toFixed(1));
                            }
                        }
                    }
                });
            });

            // 构造最终结果（保留所有原始站点，只替换被合并的站点）
            return data.map(item => {
                if (item === maxSumSite) {
                    return mergedSite; // 替换为合并后的站点
                }
                if (others.includes(item)) {
                    return null; // 标记被合并的站点
                }
                return item;
            }).filter(item => item !== null); // 移除被合并的站点
        },
        processDataall1(data) {
            // 目标站点名称列表
            const targetNames = ["桂贺州富川聚益", "桂贺州钟山小何"];

            // 获取目标站点
            const targetSites = data.filter(item => targetNames.includes(item.wlSiteName));

            if (targetSites.length === 0) {
                return data; // 没有目标站点，直接返回原数据
            }

            // 按sum值排序，取最大
            const sortedSites = [...targetSites].sort((a, b) => b.sum - a.sum);
            const maxSumSite = sortedSites[0];
            const maxSumSite1 = sortedSites[1];
            console.log(maxSumSite, 'maxSumSite')

            // 如果 maxSumSite.sum ≥ 50，直接返回原数据
            if (maxSumSite && maxSumSite1 &&
                parseFloat(maxSumSite.sum) >= 50 &&
                parseFloat(maxSumSite1.sum) >= 50) {
                return data;
            }

            // 其他的目标站点，将它们的数值字段合并到maxSumSite
            const others = sortedSites.slice(1);
            others.forEach(site => {
                Object.keys(site).forEach(field => {
                    const excludedFields = ["wlSiteName", "wlSiteCode", "tel", "productName", "contacts", "areaName", "address"];
                    if (!excludedFields.includes(field)) {
                        const value = parseFloat(site[field]);
                        if (!isNaN(value)) {
                            if (maxSumSite[field] === undefined) {
                                maxSumSite[field] = 0;
                            }
                            const targetNum = parseFloat(maxSumSite[field]);
                            if (!isNaN(targetNum)) {
                                // 累加后保留一位小数
                                maxSumSite[field] = parseFloat((targetNum + value).toFixed(1));
                            }
                        }
                    }
                });
            });

            // 从原始数据中移除除了最大站点外的其他目标站点
            const result = data.filter(item => !others.includes(item));

            return result;
        },

        zhejianData2(data) {
            // 1. 处理浙杭州西湖轩康和浙杭州江干怡明的逻辑
            const site1 = data.find(item => item.wlSiteName === "浙杭州西湖轩康");
            const site2 = data.find(item => item.wlSiteName === "浙杭州江干怡明");

            // 如果只有一个站点存在，直接返回
            if (!site1 || !site2) {
                return data;
            }

            // 如果两个站点都存在
            if (site1 && site2) {
                // 如果都大于等于50，直接返回原始数据
                if (site1.sum >= 50 && site2.sum >= 50) {
                    return data;
                }

                // 比较两个站点的sum值，将小的合并到大的中
                const largerSite = site1.sum >= site2.sum ? site1 : site2;
                const smallerSite = site1.sum < site2.sum ? site1 : site2;

                // 获取所有字段名
                const allFields = Object.keys(smallerSite);
                const fieldsToRemove = ["wlSiteName", "wlSiteCode", "tel", "productName", "contacts", "areaName", "address"];

                // 将smallerSite的数据合并到largerSite中
                allFields.forEach(field => {
                    if (!fieldsToRemove.includes(field)) {
                        const numValue = parseFloat(smallerSite[field]);
                        if (!isNaN(numValue)) {
                            if (largerSite[field] === undefined) {
                                largerSite[field] = 0;
                            }
                            const targetNum = parseFloat(largerSite[field]);
                            if (!isNaN(targetNum)) {
                                largerSite[field] = targetNum + numValue;
                            }
                        }
                    }
                });

                // 从数据中移除smallerSite
                data = data.filter(item => item.wlSiteName !== smallerSite.wlSiteName);
            }

            return data;
        },
        zhejianData2_1(data) {
            // 1. 处理浙台州温岭琪权和浙台州玉环噜渴的逻辑
            const site1 = data.find(item => item.wlSiteName === "浙台州温岭琪权");
            const site2 = data.find(item => item.wlSiteName === "浙台州玉环噜渴");

            // 如果只有一个站点存在，直接返回
            if (!site1 || !site2) {
                return data;
            }

            // 如果两个站点都存在
            if (site1 && site2) {
                // 如果都大于等于50，直接返回原始数据
                if (site1.sum >= 50 && site2.sum >= 50) {
                    return data;
                }

                // 比较两个站点的sum值，将小的合并到大的中
                const largerSite = site1.sum >= site2.sum ? site1 : site2;
                const smallerSite = site1.sum < site2.sum ? site1 : site2;

                // 获取所有字段名
                const allFields = Object.keys(smallerSite);
                const fieldsToRemove = ["wlSiteName", "wlSiteCode", "tel", "productName", "contacts", "areaName", "address"];

                // 将smallerSite的数据合并到largerSite中
                allFields.forEach(field => {
                    if (!fieldsToRemove.includes(field)) {
                        const numValue = parseFloat(smallerSite[field]);
                        if (!isNaN(numValue)) {
                            if (largerSite[field] === undefined) {
                                largerSite[field] = 0;
                            }
                            const targetNum = parseFloat(largerSite[field]);
                            if (!isNaN(targetNum)) {
                                largerSite[field] = targetNum + numValue;
                            }
                        }
                    }
                });

                // 从数据中移除smallerSite
                data = data.filter(item => item.wlSiteName !== smallerSite.wlSiteName);
            }

            return data;
        },

        shanghaiData1(data) {
            // 1. 找到目标对象（wlSiteName === "沪嘉定鸿骏兴"）
            const targetSite = data.find(item => item.wlSiteName === "沪嘉定鸿骏兴");

            if (!targetSite) {
                console.log("未找到 wlSiteName 为 '沪嘉定鸿骏兴' 的对象");
                return data;
            }

            // 2. 需要匹配的站点名称（不包括 "浙杭州上城紫芸"）
            const siteNames = [
                "沪宝山佳谷兴"
            ];

            // 3. 遍历数据，处理符合条件的对象
            const result = data.filter(item => {
                if (siteNames.includes(item.wlSiteName)) {
                    if (item.sum < 50) {
                        // 获取所有字段名
                        const allFields = Object.keys(item);
                        const fieldsToRemove = ["wlSiteName", "wlSiteCode", "tel", "productName", "contacts", "areaName", "address"];

                        // 遍历所有字段，把非 fieldsToRemove 的字段转为数字后相加到 targetSite
                        allFields.forEach(field => {
                            if (!fieldsToRemove.includes(field)) {
                                // 尝试将值转为数字
                                const numValue = parseFloat(item[field]);
                                if (!isNaN(numValue)) { // 如果是有效数字
                                    // 如果 targetSite 没有该字段，初始化为 0
                                    if (targetSite[field] === undefined) {
                                        targetSite[field] = 0;
                                    }
                                    // 确保 targetSite[field] 是数字（如果不是，尝试转换）
                                    const targetNum = parseFloat(targetSite[field]);
                                    if (!isNaN(targetNum)) {
                                        targetSite[field] = targetNum + numValue;
                                    }
                                }
                            }
                        });
                        // 过滤掉这个对象（sum < 50 的站点）
                        return false;
                    }
                }
                // 保留其他对象（sum >= 50 或非目标站点）
                return true;
            });
            return result;
        },

        shanghaiData1_1(data) {
            // 1. 找到目标对象（wlSiteName === "沪浦东新区新函"）
            const targetSite = data.find(item => item.wlSiteName === "沪浦东新区新函");

            if (!targetSite) {
                console.log("未找到 wlSiteName 为 '沪浦东新区新函' 的对象");
                return data;
            }

            // 2. 需要匹配的站点名称（不包括 "浙杭州上城紫芸"）
            const siteNames = [
                "沪浦东新区金桥齐晟"
            ];

            // 3. 遍历数据，处理符合条件的对象
            const result = data.filter(item => {
                if (siteNames.includes(item.wlSiteName)) {
                    if (item.sum < 50) {
                        // 获取所有字段名
                        const allFields = Object.keys(item);
                        const fieldsToRemove = ["wlSiteName", "wlSiteCode", "tel", "productName", "contacts", "areaName", "address"];

                        // 遍历所有字段，把非 fieldsToRemove 的字段转为数字后相加到 targetSite
                        allFields.forEach(field => {
                            if (!fieldsToRemove.includes(field)) {
                                // 尝试将值转为数字
                                const numValue = parseFloat(item[field]);
                                if (!isNaN(numValue)) { // 如果是有效数字
                                    // 如果 targetSite 没有该字段，初始化为 0
                                    if (targetSite[field] === undefined) {
                                        targetSite[field] = 0;
                                    }
                                    // 确保 targetSite[field] 是数字（如果不是，尝试转换）
                                    const targetNum = parseFloat(targetSite[field]);
                                    if (!isNaN(targetNum)) {
                                        targetSite[field] = targetNum + numValue;
                                    }
                                }
                            }
                        });
                        // 过滤掉这个对象（sum < 50 的站点）
                        return false;
                    }
                }
                // 保留其他对象（sum >= 50 或非目标站点）
                return true;
            });
            return result;
        },


        zhejianData1(data) {
            // 1. 找到目标对象（wlSiteName === "浙杭州城北噜可"）
            const targetSite = data.find(item => item.wlSiteName === "浙杭州城北噜可");

            if (!targetSite) {
                console.log("未找到 wlSiteName 为 '浙杭州城北噜可' 的对象");
                return data;
            }

            // 2. 需要匹配的站点名称（不包括 "浙杭州上城紫芸"）
            const siteNames = [
                "浙杭州上城紫芸"
            ];

            // 3. 遍历数据，处理符合条件的对象
            const result = data.filter(item => {
                if (siteNames.includes(item.wlSiteName)) {
                    if (item.sum < 50) {
                        // 获取所有字段名
                        const allFields = Object.keys(item);
                        const fieldsToRemove = ["wlSiteName", "wlSiteCode", "tel", "productName", "contacts", "areaName", "address"];

                        // 遍历所有字段，把非 fieldsToRemove 的字段转为数字后相加到 targetSite
                        allFields.forEach(field => {
                            if (!fieldsToRemove.includes(field)) {
                                // 尝试将值转为数字
                                const numValue = parseFloat(item[field]);
                                if (!isNaN(numValue)) { // 如果是有效数字
                                    // 如果 targetSite 没有该字段，初始化为 0
                                    if (targetSite[field] === undefined) {
                                        targetSite[field] = 0;
                                    }
                                    // 确保 targetSite[field] 是数字（如果不是，尝试转换）
                                    const targetNum = parseFloat(targetSite[field]);
                                    if (!isNaN(targetNum)) {
                                        targetSite[field] = targetNum + numValue;
                                    }
                                }
                            }
                        });
                        // 过滤掉这个对象（sum < 50 的站点）
                        return false;
                    }
                }
                // 保留其他对象（sum >= 50 或非目标站点）
                return true;
            });
            return result;
        },
        zhejianData1_1(data) {
            // 1. 找到目标对象（wlSiteName === "浙衢州金满堂"）
            const targetSite = data.find(item => item.wlSiteName === "浙衢州金满堂");

            if (!targetSite) {
                console.log("未找到 wlSiteName 为 '浙衢州金满堂' 的对象");
                return data;
            }

            // 2. 需要匹配的站点名称（不包括 "浙杭州上城紫芸"）
            const siteNames = [
                "浙衢州江山志成", "浙衢州开化慧琴"
            ];

            // 3. 遍历数据，处理符合条件的对象
            const result = data.filter(item => {
                if (siteNames.includes(item.wlSiteName)) {
                    if (item.sum < 50) {
                        // 获取所有字段名
                        const allFields = Object.keys(item);
                        const fieldsToRemove = ["wlSiteName", "wlSiteCode", "tel", "productName", "contacts", "areaName", "address"];

                        // 遍历所有字段，把非 fieldsToRemove 的字段转为数字后相加到 targetSite
                        allFields.forEach(field => {
                            if (!fieldsToRemove.includes(field)) {
                                // 尝试将值转为数字
                                const numValue = parseFloat(item[field]);
                                if (!isNaN(numValue)) { // 如果是有效数字
                                    // 如果 targetSite 没有该字段，初始化为 0
                                    if (targetSite[field] === undefined) {
                                        targetSite[field] = 0;
                                    }
                                    // 确保 targetSite[field] 是数字（如果不是，尝试转换）
                                    const targetNum = parseFloat(targetSite[field]);
                                    if (!isNaN(targetNum)) {
                                        targetSite[field] = targetNum + numValue;
                                    }
                                }
                            }
                        });
                        // 过滤掉这个对象（sum < 50 的站点）
                        return false;
                    }
                }
                // 保留其他对象（sum >= 50 或非目标站点）
                return true;
            });
            return result;
        },
        zhejianData1_2(data) {
            // 1. 找到目标对象（wlSiteName === "浙温州瓯海站前领域"）
            const targetSite = data.find(item => item.wlSiteName === "浙温州瓯海站前领域");

            if (!targetSite) {
                console.log("未找到 wlSiteName 为 '浙温州瓯海站前领域' 的对象");
                return data;
            }

            // 2. 需要匹配的站点名称（不包括 "浙杭州上城紫芸"）
            const siteNames = [
                "浙温州永嘉玉熙"
            ];

            // 3. 遍历数据，处理符合条件的对象
            const result = data.filter(item => {
                if (siteNames.includes(item.wlSiteName)) {
                    if (item.sum < 50) {
                        // 获取所有字段名
                        const allFields = Object.keys(item);
                        const fieldsToRemove = ["wlSiteName", "wlSiteCode", "tel", "productName", "contacts", "areaName", "address"];

                        // 遍历所有字段，把非 fieldsToRemove 的字段转为数字后相加到 targetSite
                        allFields.forEach(field => {
                            if (!fieldsToRemove.includes(field)) {
                                // 尝试将值转为数字
                                const numValue = parseFloat(item[field]);
                                if (!isNaN(numValue)) { // 如果是有效数字
                                    // 如果 targetSite 没有该字段，初始化为 0
                                    if (targetSite[field] === undefined) {
                                        targetSite[field] = 0;
                                    }
                                    // 确保 targetSite[field] 是数字（如果不是，尝试转换）
                                    const targetNum = parseFloat(targetSite[field]);
                                    if (!isNaN(targetNum)) {
                                        targetSite[field] = targetNum + numValue;
                                    }
                                }
                            }
                        });
                        // 过滤掉这个对象（sum < 50 的站点）
                        return false;
                    }
                }
                // 保留其他对象（sum >= 50 或非目标站点）
                return true;
            });
            return result;
        },
        zhejianData1_3(data) {
            // 1. 找到目标对象（wlSiteName === "浙金华义乌晖汉"）
            const targetSite = data.find(item => item.wlSiteName === "浙金华义乌晖汉");

            if (!targetSite) {
                console.log("未找到 wlSiteName 为 '浙金华义乌晖汉' 的对象");
                return data;
            }

            // 2. 需要匹配的站点名称（不包括 "浙杭州上城紫芸"）
            const siteNames = [
                "浙金华浦江众鑫"
            ];

            // 3. 遍历数据，处理符合条件的对象
            const result = data.filter(item => {
                if (siteNames.includes(item.wlSiteName)) {
                    if (item.sum < 50) {
                        // 获取所有字段名
                        const allFields = Object.keys(item);
                        const fieldsToRemove = ["wlSiteName", "wlSiteCode", "tel", "productName", "contacts", "areaName", "address"];

                        // 遍历所有字段，把非 fieldsToRemove 的字段转为数字后相加到 targetSite
                        allFields.forEach(field => {
                            if (!fieldsToRemove.includes(field)) {
                                // 尝试将值转为数字
                                const numValue = parseFloat(item[field]);
                                if (!isNaN(numValue)) { // 如果是有效数字
                                    // 如果 targetSite 没有该字段，初始化为 0
                                    if (targetSite[field] === undefined) {
                                        targetSite[field] = 0;
                                    }
                                    // 确保 targetSite[field] 是数字（如果不是，尝试转换）
                                    const targetNum = parseFloat(targetSite[field]);
                                    if (!isNaN(targetNum)) {
                                        targetSite[field] = targetNum + numValue;
                                    }
                                }
                            }
                        });
                        // 过滤掉这个对象（sum < 50 的站点）
                        return false;
                    }
                }
                // 保留其他对象（sum >= 50 或非目标站点）
                return true;
            });
            return result;
        },
        zhejianData1_4(data) {
            // 1. 找到目标对象(wlSiteName === "沪浦东新区新函")
            const targetSite = data.find(item => item.wlSiteName === "沪浦东新区新函");

            if (!targetSite) {
                console.log("未找到 wlSiteName 为 '沪浦东新区新函' 的对象");
                return data;
            }

            // 2. 需要匹配的站点名称(不包括 "浙杭州上城紫芸")
            const siteNames = [
                "沪浦东新区金桥齐晟"
            ];

            // 3. 遍历数据，处理符合条件的对象
            const result = data.filter(item => {
                if (siteNames.includes(item.wlSiteName)) {
                    if (item.sum < 50) {
                        // 获取所有字段名
                        const allFields = Object.keys(item);
                        const fieldsToRemove = ["wlSiteName", "wlSiteCode", "tel", "productName", "contacts", "areaName", "address"];

                        // 遍历所有字段，把非 fieldsToRemove 的字段转为数字后相加到 targetSite
                        allFields.forEach(field => {
                            if (!fieldsToRemove.includes(field)) {
                                // 尝试将值转为数字
                                const numValue = parseFloat(item[field]);
                                if (!isNaN(numValue)) { // 如果是有效数字
                                    // 如果 targetSite 没有该字段，初始化为 0
                                    if (targetSite[field] === undefined) {
                                        targetSite[field] = 0;
                                    }
                                    // 确保 targetSite[field] 是数字（如果不是，尝试转换）
                                    const targetNum = parseFloat(targetSite[field]);
                                    if (!isNaN(targetNum)) {
                                        targetSite[field] = targetNum + numValue;
                                    }
                                }
                            }
                        });
                        // 过滤掉这个对象(sum < 50 的站点)
                        return false;
                    }
                }
                // 保留其他对象(sum >= 50 或非目标站点)
                return true;
            });
            return result;
        },
        zhejianData1_5(data) {
            // 1. 找到目标对象(wlSiteName === "浙衢州金满堂")
            const targetSite = data.find(item => item.wlSiteName === "浙衢州金满堂");

            if (!targetSite) {
                console.log("未找到 wlSiteName 为 '浙衢州金满堂' 的对象");
                return data;
            }

            // 2. 需要匹配的站点名称(不包括 "浙杭州上城紫芸")
            const siteNames = [
                "浙衢州常山承运"
            ];

            // 3. 遍历数据，处理符合条件的对象
            const result = data.filter(item => {
                if (siteNames.includes(item.wlSiteName)) {
                    if (item.sum < 50) {
                        // 获取所有字段名
                        const allFields = Object.keys(item);
                        const fieldsToRemove = ["wlSiteName", "wlSiteCode", "tel", "productName", "contacts", "areaName", "address"];

                        // 遍历所有字段，把非 fieldsToRemove 的字段转为数字后相加到 targetSite
                        allFields.forEach(field => {
                            if (!fieldsToRemove.includes(field)) {
                                // 尝试将值转为数字
                                const numValue = parseFloat(item[field]);
                                if (!isNaN(numValue)) { // 如果是有效数字
                                    // 如果 targetSite 没有该字段，初始化为 0
                                    if (targetSite[field] === undefined) {
                                        targetSite[field] = 0;
                                    }
                                    // 确保 targetSite[field] 是数字(如果不是，尝试转换)
                                    const targetNum = parseFloat(targetSite[field]);
                                    if (!isNaN(targetNum)) {
                                        targetSite[field] = targetNum + numValue;
                                    }
                                }
                            }
                        });
                        // 过滤掉这个对象(sum < 50 的站点)
                        return false;
                    }
                }
                // 保留其他对象(sum >= 50 或非目标站点)
                return true;
            });
            return result;
        },

        fujianData1(data) {
            // 1. 找到目标对象(wlSiteName === "闽漳州漳州轩恒贸易")
            const targetSite = data.find(item => item.wlSiteName === "闽漳州漳州轩恒贸易");

            if (!targetSite) {
                console.log("未找到 wlSiteName 为 '闽漳州漳州轩恒贸易' 的对象");
                return data;
            }

            // 2. 需要匹配的站点名称（不包括 "浙杭州上城紫芸"）
            const siteNames = [
                "闽漳州云霄协辉食品"
            ];

            // 3. 遍历数据，处理符合条件的对象
            const result = data.filter(item => {
                if (siteNames.includes(item.wlSiteName)) {
                    if (item.sum < 50) {
                        // 获取所有字段名
                        const allFields = Object.keys(item);
                        const fieldsToRemove = ["wlSiteName", "wlSiteCode", "tel", "productName", "contacts", "areaName", "address"];

                        // 遍历所有字段，把非 fieldsToRemove 的字段转为数字后相加到 targetSite
                        allFields.forEach(field => {
                            if (!fieldsToRemove.includes(field)) {
                                // 尝试将值转为数字
                                const numValue = parseFloat(item[field]);
                                if (!isNaN(numValue)) { // 如果是有效数字
                                    // 如果 targetSite 没有该字段，初始化为 0
                                    if (targetSite[field] === undefined) {
                                        targetSite[field] = 0;
                                    }
                                    // 确保 targetSite[field] 是数字（如果不是，尝试转换）
                                    const targetNum = parseFloat(targetSite[field]);
                                    if (!isNaN(targetNum)) {
                                        targetSite[field] = targetNum + numValue;
                                    }
                                }
                            }
                        });
                        // 过滤掉这个对象（sum < 50 的站点）
                        return false;
                    }
                }
                // 保留其他对象（sum >= 50 或非目标站点）
                return true;
            });
            return result;
        },

        fujianData1_1(data) {
            // 1. 找到目标对象(wlSiteName === "闽漳州云霄协辉食品")
            const targetSite = data.find(item => item.wlSiteName === "闽漳州云霄协辉食品");

            if (!targetSite) {
                console.log("未找到 wlSiteName 为 '闽漳州云霄协辉食品' 的对象");
                return data;
            }

            // 2. 需要匹配的站点名称(不包括 "浙杭州上城紫芸")
            const siteNames = [
                "闽漳州漳州轩恒贸易", "闽漳州东山昱阳食品"
            ];

            // 3. 遍历数据，处理符合条件的对象
            const result = data.filter(item => {
                if (siteNames.includes(item.wlSiteName)) {
                    if (item.sum < 50) {
                        // 获取所有字段名
                        const allFields = Object.keys(item);
                        const fieldsToRemove = ["wlSiteName", "wlSiteCode", "tel", "productName", "contacts", "areaName", "address"];

                        // 遍历所有字段，把非 fieldsToRemove 的字段转为数字后相加到 targetSite
                        allFields.forEach(field => {
                            if (!fieldsToRemove.includes(field)) {
                                // 尝试将值转为数字
                                const numValue = parseFloat(item[field]);
                                if (!isNaN(numValue)) { // 如果是有效数字
                                    // 如果 targetSite 没有该字段，初始化为 0
                                    if (targetSite[field] === undefined) {
                                        targetSite[field] = 0;
                                    }
                                    // 确保 targetSite[field] 是数字(如果不是，尝试转换)
                                    const targetNum = parseFloat(targetSite[field]);
                                    if (!isNaN(targetNum)) {
                                        targetSite[field] = targetNum + numValue;
                                    }
                                }
                            }
                        });
                        // 过滤掉这个对象(sum < 50 的站点）
                        return false;
                    }
                }
                // 保留其他对象(sum >= 50 或非目标站点）
                return true;
            });
            return result;
        },

        fujianData1_2(data) {
            // 1. 找到目标对象(wlSiteName === "闽漳州龙海华慕华平和")
            const targetSite = data.find(item => item.wlSiteName === "闽漳州龙海华慕华平和");

            if (!targetSite) {
                console.log("未找到 wlSiteName 为 '闽漳州龙海华慕华平和' 的对象");
                return data;
            }

            // 2. 需要匹配的站点名称(不包括 "浙杭州上城紫芸")
            const siteNames = [
                "闽漳州南靖余艺强"
            ];

            // 3. 遍历数据，处理符合条件的对象
            const result = data.filter(item => {
                if (siteNames.includes(item.wlSiteName)) {
                    if (item.sum < 50) {
                        // 获取所有字段名
                        const allFields = Object.keys(item);
                        const fieldsToRemove = ["wlSiteName", "wlSiteCode", "tel", "productName", "contacts", "areaName", "address"];

                        // 遍历所有字段，把非 fieldsToRemove 的字段转为数字后相加到 targetSite
                        allFields.forEach(field => {
                            if (!fieldsToRemove.includes(field)) {
                                // 尝试将值转为数字
                                const numValue = parseFloat(item[field]);
                                if (!isNaN(numValue)) { // 如果是有效数字
                                    // 如果 targetSite 没有该字段，初始化为 0
                                    if (targetSite[field] === undefined) {
                                        targetSite[field] = 0;
                                    }
                                    // 确保 targetSite[field] 是数字(如果不是，尝试转换)
                                    const targetNum = parseFloat(targetSite[field]);
                                    if (!isNaN(targetNum)) {
                                        targetSite[field] = targetNum + numValue;
                                    }
                                }
                            }
                        });
                        // 过滤掉这个对象(sum < 50 的站点)
                        return false;
                    }
                }
                // 保留其他对象(sum >= 50 或非目标站点)
                return true;
            });
            return result;
        },

        fujianData1_3(data) {
            // 1. 找到目标对象(wlSiteName === "闽三明三元辰诺食品")
            const targetSite = data.find(item => item.wlSiteName === "闽三明三元辰诺食品");

            if (!targetSite) {
                console.log("未找到 wlSiteName 为 '闽三明三元辰诺食品' 的对象");
                return data;
            }

            // 2. 需要匹配的站点名称(不包括 "浙杭州上城紫芸")
            const siteNames = [
                "闽三明沙县噜渴食品", "闽三明尤溪合盛酒水", "三明大田县", "连城县", "闽三明宁化向德洪", "闽三明宁化义捷", "闽三明永安松鼠百货"
            ];

            // 3. 遍历数据，处理符合条件的对象
            const result = data.filter(item => {
                if (siteNames.includes(item.wlSiteName)) {
                    if (item.sum < 50) {
                        // 获取所有字段名
                        const allFields = Object.keys(item);
                        const fieldsToRemove = ["wlSiteName", "wlSiteCode", "tel", "productName", "contacts", "areaName", "address"];

                        // 遍历所有字段，把非 fieldsToRemove 的字段转为数字后相加到 targetSite
                        allFields.forEach(field => {
                            if (!fieldsToRemove.includes(field)) {
                                // 尝试将值转为数字
                                const numValue = parseFloat(item[field]);
                                if (!isNaN(numValue)) { // 如果是有效数字
                                    // 如果 targetSite 没有该字段，初始化为 0
                                    if (targetSite[field] === undefined) {
                                        targetSite[field] = 0;
                                    }
                                    // 确保 targetSite[field] 是数字(如果不是，尝试转换)
                                    const targetNum = parseFloat(targetSite[field]);
                                    if (!isNaN(targetNum)) {
                                        targetSite[field] = targetNum + numValue;
                                    }
                                }
                            }
                        });
                        // 过滤掉这个对象(sum < 50 的站点)
                        return false;
                    }
                }
                // 保留其他对象(sum >= 50 或非目标站点)
                return true;
            });
            return result;
        },

        fujianData1_4(data) {
            // 1. 找到目标对象(wlSiteName === "闽泉州晋江安海")
            const targetSite = data.find(item => item.wlSiteName === "闽泉州晋江安海");

            if (!targetSite) {
                console.log("未找到 wlSiteName 为 '闽泉州晋江安海' 的对象");
                return data;
            }

            // 2. 需要匹配的站点名称(不包括 "浙杭州上城紫芸")
            const siteNames = [
                "闽泉州南安柳城乐鲜水头镇"
            ];

            // 3. 遍历数据，处理符合条件的对象
            const result = data.filter(item => {
                if (siteNames.includes(item.wlSiteName)) {
                    if (item.sum < 50) {
                        // 获取所有字段名
                        const allFields = Object.keys(item);
                        const fieldsToRemove = ["wlSiteName", "wlSiteCode", "tel", "productName", "contacts", "areaName", "address"];

                        // 遍历所有字段，把非 fieldsToRemove 的字段转为数字后相加到 targetSite
                        allFields.forEach(field => {
                            if (!fieldsToRemove.includes(field)) {
                                // 尝试将值转为数字
                                const numValue = parseFloat(item[field]);
                                if (!isNaN(numValue)) { // 如果是有效数字
                                    // 如果 targetSite 没有该字段，初始化为 0
                                    if (targetSite[field] === undefined) {
                                        targetSite[field] = 0;
                                    }
                                    // 确保 targetSite[field] 是数字(如果不是，尝试转换)
                                    const targetNum = parseFloat(targetSite[field]);
                                    if (!isNaN(targetNum)) {
                                        targetSite[field] = targetNum + numValue;
                                    }
                                }
                            }
                        });
                        // 过滤掉这个对象(sum < 50 的站点)
                        return false;
                    }
                }
                // 保留其他对象(sum >= 50 或非目标站点)
                return true;
            });
            return result;
        },

        fujianData1_5(data) {
            // 1. 找到目标对象(wlSiteName === "闽莆田涵江友善乳制")
            const targetSite = data.find(item => item.wlSiteName === "闽莆田涵江友善乳制");

            if (!targetSite) {
                console.log("未找到 wlSiteName 为 '闽莆田涵江友善乳制' 的对象");
                return data;
            }

            // 2. 需要匹配的站点名称(不包括 "浙杭州上城紫芸")
            const siteNames = [
                "闽莆田涵江友善乳制涵江", "闽莆田涵江友善乳制莆田江口"
            ];

            // 3. 遍历数据，处理符合条件的对象
            const result = data.filter(item => {
                if (siteNames.includes(item.wlSiteName)) {
                    if (item.sum < 50) {
                        // 获取所有字段名
                        const allFields = Object.keys(item);
                        const fieldsToRemove = ["wlSiteName", "wlSiteCode", "tel", "productName", "contacts", "areaName", "address"];

                        // 遍历所有字段，把非 fieldsToRemove 的字段转为数字后相加到 targetSite
                        allFields.forEach(field => {
                            if (!fieldsToRemove.includes(field)) {
                                // 尝试将值转为数字
                                const numValue = parseFloat(item[field]);
                                if (!isNaN(numValue)) { // 如果是有效数字
                                    // 如果 targetSite 没有该字段，初始化为 0
                                    if (targetSite[field] === undefined) {
                                        targetSite[field] = 0;
                                    }
                                    // 确保 targetSite[field] 是数字(如果不是，尝试转换)
                                    const targetNum = parseFloat(targetSite[field]);
                                    if (!isNaN(targetNum)) {
                                        targetSite[field] = targetNum + numValue;
                                    }
                                }
                            }
                        });
                        // 过滤掉这个对象(sum < 50 的站点）
                        return false;
                    }
                }
                // 保留其他对象(sum >= 50 或非目标站点）
                return true;
            });
            return result;
        },

        fujianData1_6(data) {
            // 1. 找到目标对象(wlSiteName === "闽宁德蕉城宝丽信"）
            const targetSite = data.find(item => item.wlSiteName === "闽宁德蕉城宝丽信");

            if (!targetSite) {
                console.log("未找到 wlSiteName 为 '闽宁德蕉城宝丽信' 的对象");
                return data;
            }

            // 2. 需要匹配的站点名称(不包括 "浙杭州上城紫芸"）
            const siteNames = [
                "闽宁德福鼎鑫中贸易", "闽宁德福鼎长旺食品", "闽宁德寿宁龚继魁"
            ];

            // 3. 遍历数据，处理符合条件的对象
            const result = data.filter(item => {
                if (siteNames.includes(item.wlSiteName)) {
                    if (item.sum < 50) {
                        // 获取所有字段名
                        const allFields = Object.keys(item);
                        const fieldsToRemove = ["wlSiteName", "wlSiteCode", "tel", "productName", "contacts", "areaName", "address"];

                        // 遍历所有字段，把非 fieldsToRemove 的字段转为数字后相加到 targetSite
                        allFields.forEach(field => {
                            if (!fieldsToRemove.includes(field)) {
                                // 尝试将值转为数字
                                const numValue = parseFloat(item[field]);
                                if (!isNaN(numValue)) { // 如果是有效数字
                                    // 如果 targetSite 没有该字段，初始化为 0
                                    if (targetSite[field] === undefined) {
                                        targetSite[field] = 0;
                                    }
                                    // 确保 targetSite[field] 是数字（如果不是，尝试转换）
                                    const targetNum = parseFloat(targetSite[field]);
                                    if (!isNaN(targetNum)) {
                                        targetSite[field] = targetNum + numValue;
                                    }
                                }
                            }
                        });
                        // 过滤掉这个对象(sum < 50 的站点）
                        return false;
                    }
                }
                // 保留其他对象(sum >= 50 或非目标站点）
                return true;
            });
            return result;
        },

        fujianData1_7(data) {
            // 1. 找到目标对象(wlSiteName === "闽龙岩新罗姜楠"）
            const targetSite = data.find(item => item.wlSiteName === "闽龙岩新罗姜楠");

            if (!targetSite) {
                console.log("未找到 wlSiteName 为 '闽龙岩新罗姜楠' 的对象");
                return data;
            }

            // 2. 需要匹配的站点名称(不包括 "浙杭州上城紫芸"）
            const siteNames = [
                "闽龙岩永定凯哥商行", "闽龙岩漳平陈小兰", "闽龙岩长汀杰杰高"
            ];

            // 3. 遍历数据，处理符合条件的对象
            const result = data.filter(item => {
                if (siteNames.includes(item.wlSiteName)) {
                    if (item.sum < 50) {
                        // 获取所有字段名
                        const allFields = Object.keys(item);
                        const fieldsToRemove = ["wlSiteName", "wlSiteCode", "tel", "productName", "contacts", "areaName", "address"];

                        // 遍历所有字段，把非 fieldsToRemove 的字段转为数字后相加到 targetSite
                        allFields.forEach(field => {
                            if (!fieldsToRemove.includes(field)) {
                                // 尝试将值转为数字
                                const numValue = parseFloat(item[field]);
                                if (!isNaN(numValue)) { // 如果是有效数字
                                    // 如果 targetSite 没有该字段，初始化为 0
                                    if (targetSite[field] === undefined) {
                                        targetSite[field] = 0;
                                    }
                                    // 确保 targetSite[field] 是数字(如果不是，尝试转换）
                                    const targetNum = parseFloat(targetSite[field]);
                                    if (!isNaN(targetNum)) {
                                        targetSite[field] = targetNum + numValue;
                                    }
                                }
                            }
                        });
                        // 过滤掉这个对象(sum < 50 的站点）
                        return false;
                    }
                }
                // 保留其他对象(sum >= 50 或非目标站点）
                return true;
            });
            return result;
        },

        fujianData1_8(data) {
            // 1. 找到目标对象(wlSiteName === "闽福州鼓楼晟嘉枫锦")
            const targetSite = data.find(item => item.wlSiteName === "闽福州鼓楼晟嘉枫锦");

            if (!targetSite) {
                console.log("未找到 wlSiteName 为 '闽福州鼓楼晟嘉枫锦' 的对象");
                return data;
            }

            // 2. 需要匹配的站点名称(不包括 "浙杭州上城紫芸")
            const siteNames = [
                "闽福州台江区松旺", "闽福州晋安三金源"
            ];

            // 3. 遍历数据，处理符合条件的对象
            const result = data.filter(item => {
                if (siteNames.includes(item.wlSiteName)) {
                    if (item.sum < 50) {
                        // 获取所有字段名
                        const allFields = Object.keys(item);
                        const fieldsToRemove = ["wlSiteName", "wlSiteCode", "tel", "productName", "contacts", "areaName", "address"];

                        // 遍历所有字段，把非 fieldsToRemove 的字段转为数字后相加到 targetSite
                        allFields.forEach(field => {
                            if (!fieldsToRemove.includes(field)) {
                                // 尝试将值转为数字
                                const numValue = parseFloat(item[field]);
                                if (!isNaN(numValue)) { // 如果是有效数字
                                    // 如果 targetSite 没有该字段，初始化为 0
                                    if (targetSite[field] === undefined) {
                                        targetSite[field] = 0;
                                    }
                                    // 确保 targetSite[field] 是数字(如果不是，尝试转换)
                                    const targetNum = parseFloat(targetSite[field]);
                                    if (!isNaN(targetNum)) {
                                        targetSite[field] = targetNum + numValue;
                                    }
                                }
                            }
                        });
                        // 过滤掉这个对象(sum < 50 的站点）
                        return false;
                    }
                }
                // 保留其他对象(sum >= 50 或非目标站点）
                return true;
            });
            return result;
        },

        fujianData1_9(data) {
            // 1. 找到目标对象(wlSiteName === "闽福州仓山恒佑源")
            const targetSite = data.find(item => item.wlSiteName === "闽福州仓山恒佑源");

            if (!targetSite) {
                console.log("未找到 wlSiteName 为 '闽福州仓山恒佑源' 的对象");
                return data;
            }

            // 2. 需要匹配的站点名称(不包括 "浙杭州上城紫芸")
            const siteNames = [
                "闽福州仓山恒佑源仓山特渠",
                "闽福州平潭圣荣",
                "闽福州平潭三金源平潭流水镇",
                "闽福州马尾酒源",
                "闽福州永泰军顶贸易",
                "闽宁德古田绿品汇",
                "闽宁德古田绿品汇",
                "闽南平邵武齐创贸易",
                "闽南平武夷瑜戈食品",
                "闽南平武夷山恒诚副食品商行",
                "闽南平建瓯羽晨"
            ];

            // 3. 遍历数据，处理符合条件的对象
            const result = data.filter(item => {
                if (siteNames.includes(item.wlSiteName)) {
                    if (item.sum < 50) {
                        // 获取所有字段名
                        const allFields = Object.keys(item);
                        const fieldsToRemove = ["wlSiteName", "wlSiteCode", "tel", "productName", "contacts", "areaName", "address"];

                        // 遍历所有字段，把非 fieldsToRemove 的字段转为数字后相加到 targetSite
                        allFields.forEach(field => {
                            if (!fieldsToRemove.includes(field)) {
                                // 尝试将值转为数字
                                const numValue = parseFloat(item[field]);
                                if (!isNaN(numValue)) { // 如果是有效数字
                                    // 如果 targetSite 没有该字段，初始化为 0
                                    if (targetSite[field] === undefined) {
                                        targetSite[field] = 0;
                                    }
                                    // 确保 targetSite[field] 是数字(如果不是，尝试转换)
                                    const targetNum = parseFloat(targetSite[field]);
                                    if (!isNaN(targetNum)) {
                                        targetSite[field] = targetNum + numValue;
                                    }
                                }
                            }
                        });
                        // 过滤掉这个对象(sum < 50 的站点)
                        return false;
                    }
                }
                // 保留其他对象(sum >= 50 或非目标站点)
                return true;
            });
            return result;
        },

        fujianData1_10(data) {
            // 1. 找到目标对象(wlSiteName === "闽厦门湖里李西华")
            const targetSite = data.find(item => item.wlSiteName === "闽厦门湖里李西华");

            if (!targetSite) {
                console.log("未找到 wlSiteName 为 '闽厦门湖里李西华' 的对象");
                return data;
            }

            // 2. 需要匹配的站点名称(不包括 "浙杭州上城紫芸")
            const siteNames = [
                "闽厦门朴朴李西华"
            ];

            // 3. 遍历数据，处理符合条件的对象
            const result = data.filter(item => {
                if (siteNames.includes(item.wlSiteName)) {
                    if (item.sum < 50) {
                        // 获取所有字段名
                        const allFields = Object.keys(item);
                        const fieldsToRemove = ["wlSiteName", "wlSiteCode", "tel", "productName", "contacts", "areaName", "address"];

                        // 遍历所有字段，把非 fieldsToRemove 的字段转为数字后相加到 targetSite
                        allFields.forEach(field => {
                            if (!fieldsToRemove.includes(field)) {
                                // 尝试将值转为数字
                                const numValue = parseFloat(item[field]);
                                if (!isNaN(numValue)) { // 如果是有效数字
                                    // 如果 targetSite 没有该字段，初始化为 0
                                    if (targetSite[field] === undefined) {
                                        targetSite[field] = 0;
                                    }
                                    // 确保 targetSite[field] 是数字(如果不是，尝试转换)
                                    const targetNum = parseFloat(targetSite[field]);
                                    if (!isNaN(targetNum)) {
                                        targetSite[field] = targetNum + numValue;
                                    }
                                }
                            }
                        });
                        // 过滤掉这个对象(sum < 50 的站点）
                        return false;
                    }
                }
                // 保留其他对象(sum >= 50 或非目标站点）
                return true;
            });
            return result;
        },
        fujianData1_11(data) {
            // 1. 找到目标对象(wlSiteName === "闽龙岩新罗姜楠")
            const targetSite = data.find(item => item.wlSiteName === "闽龙岩新罗姜楠");

            if (!targetSite) {
                console.log("未找到 wlSiteName 为 '闽龙岩新罗姜楠' 的对象");
                return data;
            }

            // 2. 需要匹配的站点名称(不包括 "浙杭州上城紫芸")
            const siteNames = [
                "闽龙岩永定凯哥商行"
            ];

            // 3. 遍历数据，处理符合条件的对象
            const result = data.filter(item => {
                if (siteNames.includes(item.wlSiteName)) {
                    // 获取所有字段名
                    const allFields = Object.keys(item);
                    const fieldsToRemove = ["wlSiteName", "wlSiteCode", "tel", "productName", "contacts", "areaName", "address"];

                    // 遍历所有字段，把非 fieldsToRemove 的字段转为数字后相加到 targetSite
                    allFields.forEach(field => {
                        if (!fieldsToRemove.includes(field)) {
                            // 尝试将值转为数字
                            const numValue = parseFloat(item[field]);
                            if (!isNaN(numValue)) { // 如果是有效数字
                                // 如果 targetSite 没有该字段，初始化为 0
                                if (targetSite[field] === undefined) {
                                    targetSite[field] = 0;
                                }
                                // 确保 targetSite[field] 是数字(如果不是，尝试转换)
                                const targetNum = parseFloat(targetSite[field]);
                                if (!isNaN(targetNum)) {
                                    targetSite[field] = targetNum + numValue;
                                }
                            }
                        }
                    });
                    // 过滤掉这个对象(sum < 50 的站点）
                    return false;

                }
                // 保留其他对象(sum >= 50 或非目标站点）
                return true;
            });
            return result;
        },

        jiangsuData1_1(data) {
            // 1. 定义要比较的两个站点
            const siteA = "苏苏州太仓贾旭东"; // 请替换为实际站点名称
            const siteB = "苏苏州昆山玉山"; // 请替换为实际站点名称

            // 2. 找到两个站点的对象
            const siteAObj = data.find(item => item.wlSiteName === siteA);
            const siteBObj = data.find(item => item.wlSiteName === siteB);

            if (!siteAObj || !siteBObj) {
                console.log(`未找到 ${siteA} 或 ${siteB} 的对象`);
                return data;
            }

            // 3. 比较 sum 值
            const sumA = parseFloat(siteAObj.sum) || 0;
            const sumB = parseFloat(siteBObj.sum) || 0;

            console.log(`${siteA} 的 sum: ${sumA}, ${siteB} 的 sum: ${sumB}`);

            // 4. 确定哪个站点保留，哪个被合并
            let targetSite, sourceSite, sourceSiteName;

            if (sumA >= sumB) {
                // siteA 的 sum 更多，保留 siteA，合并 siteB
                targetSite = siteAObj;
                sourceSite = siteBObj;
                sourceSiteName = siteB;
                console.log(`${siteA} 的 sum 更多，将合并 ${siteB}`);
            } else {
                // siteB 的 sum 更多，保留 siteB，合并 siteA
                targetSite = siteBObj;
                sourceSite = siteAObj;
                sourceSiteName = siteA;
                console.log(`${siteB} 的 sum 更多，将合并 ${siteA}`);
            }

            // 5. 定义要保护的字段（不合并的字段）
            const fieldsToRemove = [
                "wlSiteName", "wlSiteCode", "tel", "productName",
                "contacts", "areaName", "address"
            ];

            // 6. 合并源站点的数值字段到目标站点
            const allFields = Object.keys(sourceSite);
            allFields.forEach(field => {
                if (!fieldsToRemove.includes(field)) {
                    const numValue = parseFloat(sourceSite[field]);
                    if (!isNaN(numValue)) {
                        if (targetSite[field] === undefined) {
                            targetSite[field] = 0;
                        }
                        const targetNum = parseFloat(targetSite[field]);
                        if (!isNaN(targetNum)) {
                            targetSite[field] = targetNum + numValue;
                        }
                    }
                }
            });

            // 7. 过滤掉被合并的站点
            const result = data.filter(item =>
                item.wlSiteName !== sourceSiteName
            );

            console.log(`合并完成，保留了 ${targetSite.wlSiteName}，合并了 ${sourceSiteName}`);
            return result;
        },

        jiangsuData1_2(data, siteConfigs) {
            if (!Array.isArray(data) || !Array.isArray(siteConfigs)) {
                console.error("参数必须是数组");
                return data;
            }

            // 定义要保护的字段
            const fieldsToRemove = ["wlSiteName", "wlSiteCode", "tel", "productName", "contacts", "areaName", "address"];

            // 遍历每个配置项
            siteConfigs.forEach(config => {
                const { oldsite, newsite } = config;

                // 1. 找到目标对象
                const targetSite = data.find(item => item.wlSiteName == newsite);

                if (!targetSite) {
                    console.log(`未找到 wlSiteName 为 '${newsite}' 的对象`);
                    return; // 继续下一个配置
                }

                // 2. 遍历需要匹配的站点名称
                oldsite.forEach(siteName => {
                    // 在数据中查找匹配的对象
                    const sourceSites = data.filter(item => item.wlSiteName == siteName && item.sum < 50);

                    // 处理每个符合条件的源站点
                    sourceSites.forEach(sourceSite => {
                        // 获取所有字段名
                        const allFields = Object.keys(sourceSite);

                        // 遍历所有字段，把非 fieldsToRemove 的字段转为数字后相加到 targetSite
                        allFields.forEach(field => {
                            if (!fieldsToRemove.includes(field)) {
                                // 尝试将值转为数字
                                const numValue = parseFloat(sourceSite[field]);
                                if (!isNaN(numValue)) { // 如果是有效数字
                                    // 如果 targetSite 没有该字段，初始化为 0
                                    if (targetSite[field] == undefined) {
                                        targetSite[field] = 0;
                                    }
                                    // 确保 targetSite[field] 是数字(如果不是，尝试转换)
                                    const targetNum = parseFloat(targetSite[field]);
                                    if (!isNaN(targetNum)) {
                                        targetSite[field] = targetNum + numValue;
                                    }
                                }
                            }
                        });

                        console.log(`已将 ${sourceSite.wlSiteName} (sum: ${sourceSite.sum}) 合并到 ${targetSite.wlSiteName}`);
                    });
                });
            });

            // 过滤掉所有被合并的源站点（sum < 50 且在 oldsite 中的站点）
            const result = data.filter(item => {
                // 检查当前站点是否在任一配置的 oldsite 中且 sum < 50
                const shouldBeRemoved = siteConfigs.some(config =>
                    config.oldsite.includes(item.wlSiteName) && item.sum < 50
                );

                // 如果应该被移除，返回 false；否则保留
                return !shouldBeRemoved;
            });

            return result;
        },

        getproductList() {
            api.wlProductaFactcheckApi(this.dictForm).then(res => {
                this.proList = res.content
                this.getDataList()
                console.log(this.proList)
            })
        },
        exportData() {
            this.$confirm('是否导出表格数据到Excel?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (this.areas == '广西') {
                    exportExcelgx(this.dataList, this.gxNoSpecialList, this.dataForm.p_vouchdateend, `广西区域物流报表.xlsx`, this.GXfinalResult)
                } else if (this.areas == '四川') {
                    exportscTwoExcel(this.dataList, this.sichuanList, this.dataForm.p_vouchdateend, '四川区域物流报表.xlsx', this.areas)
                } else if (this.areas == '云南') {
                    exportscExcel(this.dataList, this.dataForm.p_vouchdateend, '云南区域物流报表.xlsx', this.areas)
                } else if (this.areas == '重庆') {
                    exportscExcel(this.dataList, this.dataForm.p_vouchdateend, '重庆区域物流报表.xlsx', this.areas)
                } else if (this.areas == '贵州') {
                    exportscExcel(this.dataList, this.dataForm.p_vouchdateend, '贵州区域物流报表.xlsx', this.areas)
                } else if (this.areas == '浙江') {
                    exportExcelzj(this.dataList, this.dataForm.p_vouchdateend, '浙江区域物流报表.xlsx', this.zjfinalResult)
                } else if (this.areas == '福建') {
                    exportExcelfj(this.dataList, this.dataForm.p_vouchdateend, '福建区域物流报表.xlsx', this.FJfinalResult)
                } else if (this.areas == '江苏') {
                    exportExceljs(this.dataList, this.dataForm.p_vouchdateend, '江苏区域物流报表.xlsx', this.JSfinalResult)
                } else if (this.areas == '山东') {
                    window.open('http://bi.yufanjtbip.com:8069/file/%E6%96%87%E6%A1%A3/newfilepdatashandongout.xlsx')
                } else {
                    exportExcel(this.dataList, this.dataForm.p_vouchdateend, `湖南区域物流报表.xlsx`, this.siteList, this.areas)
                }

            })
        },
        // 获取今年的日期数据
        calculateDates() {
            const today = new Date();

            // 获取当前月份的月初时间 
            const startOfMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);
            this.startOfMonth = this.formatDate(startOfMonthDate);

            // 获取截至今天的时间 
            this.endOfToday = this.formatDate(today);

            // this.dataForm.p_vouchdatestart = this.startOfMonth;
            this.dataForm.p_vouchdateend = this.endOfToday;
            this.labelText = `${this.areas}区域到货明细表--截止${this.year}年${this.month}月${this.day}日`;
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