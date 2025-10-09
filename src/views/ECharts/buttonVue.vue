<template>
    <div class='btn'>
        <el-dialog :close-on-click-modal="false" :visible.sync="visible">
            <el-form :inline="true">
                <el-form-item
                    style="width:60%; display: flex; flex-wrap: wrap; justify-content: flex-start; margin: 0 auto;">
                    <el-cascader style="width: 300px;" v-model="value" :options="options"
                        @change="handleChange"></el-cascader>
                    <el-button size="mini" class="filter-item" type="success" @click="gethubData">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

    </div>
</template>

<script>
import {
    mapGetters,
} from 'vuex'
import * as api from '@/api/frame/customer.js'
export default {
    name: 'btn-page',

    data() {
        return {
            visible: false,
            msg: 'btn-page',
            value: [],
            custList: [],
            string1: '',
            string2: '',
            ruid: '',
            options:[]
        };
    },
    computed: {
        ...mapGetters(['id', 'dept', 'jobs'])
    },
    mounted() {
        this.getcustList()
        if (this.id != '') {
            sessionStorage.setItem('id', this.id);
        }
        const ids = sessionStorage.getItem('id');
        this.ruid = ids
        console.log(66666, this.ruid)
        if (this.ruid == 35) {
            this.options = this.options.filter(option => option.value === '营销四部');
        } else if (this.ruid == 36) {
            this.options = this.options.filter(option =>
                option.value === '营销二部' || option.value === '营销五部'
            );
            // 找到“营销五部”并过滤其 children，只保留 value 为 "江苏省"  
            const filteredMarketingFiveChildren = this.options
                .filter(option => option.value === '营销五部') // 找到“营销五部”  
                .flatMap(option => option.children) // 获取其 children  
                .filter(child => child.value === '江苏省'); // 只保留 value 为 “江苏省” 的项  

            // 找到“营销五部”对象并替换它的 children  
            this.options = this.options.map(option => {
                if (option.value === '营销五部') {
                    return {
                        ...option,
                        children: filteredMarketingFiveChildren // 更新为只包含 “江苏省”  
                    };
                }
                return option; // 不改变其它  
            });

            console.log(666555, this.options);
        }
        else if (this.ruid == 37) {
            this.options = this.options.filter(option => option.value === '营销一部');
        }
    },
    methods: {
        getcustList() {
            api.BdallCustomer(this.dataForm1).then(res => {
                this.custList = res
                this.custList.forEach(item => {
                    const levels = item.levelName.split(' -> ');
                    item.levelName1 = levels[0] || "";
                    // 去掉 levelName2 中的数字  
                    item.levelName2 = levels[1] ? levels[1].replace(/\d+/g, '').trim() : "";
                    item.levelName3 = levels[2] || "";
                });
                this.custList = Array.from(
                    new Set(this.custList.map(item => `${item.levelName1}-${item.levelName2}`))
                ).map(combo => {
                    const [levelName1, levelName2] = combo.split('-'); // 分割字符串重新形成对象  
                    return { levelName1, levelName2 };
                });
                //分组
                this.options = Object.values(this.custList.reduce((acc, item) => {
                    const { levelName1, levelName2 } = item;

                    // 构建以 levelName1 为键的唯一对象  
                    if (!acc[levelName1]) {
                        acc[levelName1] = {
                            value: levelName1,
                            label: levelName1,
                            children: []
                        };
                    }

                    // 将 levelName2 的值添加到 children 数组中  
                    acc[levelName1].children.push({
                        value: levelName2,
                        label: levelName2
                    });

                    return acc;
                }, {}));
                

                console.log(this.custList)
                console.log(this.options,666)
            })

        },
        init() { // 初始化表单验证规则
            this.visible = true
        },
        handleChange(value) {
            this.string1 = value[0]
            this.string2 = value[1]
            console.log(this.string1, this.string2);
        },
        gethubData() {
            this.$emit('string1Sent', this.string1);
            this.$emit('string2Sent', this.string2);
            this.$emit('requestBillList');
            this.$emit('requestBillList1');
            this.visible = false

        }
    }
};
</script>

<style scoped lang="scss">
.filter-item {
    margin: 5px;
}
</style>