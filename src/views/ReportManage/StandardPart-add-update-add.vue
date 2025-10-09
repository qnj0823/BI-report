<template>
  <!-- 基于 Element UI 新增和修改弹窗 -->
  <el-dialog :title="!dataForm3.id ? '新增-ADD' : '修改-EDITE'" :close-on-click-modal="false" :visible.sync="visible">
    <!-- 新增和创建表单表单 -->
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataSubmit()" label-width="160px">
      <el-form-item label="大类" prop="fgsbscName">
        <div style="display: flex; justify-content: space-between;">
          <div>
            <el-input v-if="bigcategory" :disabled=bigcatable style="width: 20rem; " v-model="bigName"
              placeholder="大类"></el-input>
            <el-select v-else style="width: 20rem; " v-model="selectedbigValue" placeholder="请选择"
              @change="handlebigChange">
              <el-option v-for="item in bigList" :key="item.productClassId" :label="item.name"
                :value="item.productClassId" />
            </el-select>
          </div>
          <div><el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
              @click="selectcategorybig">选择大类</el-button>
            <el-button v-if="addbigcate" class="filter-item" size="mini" type="success" icon="el-icon-plus"
              @click="addcategorybig">新增大类</el-button>
            <el-button v-else class="filter-item" size="mini" type="success" @click="getbigcategory">确定</el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="小类" prop="fgsbscName">
        <div style="display: flex; justify-content: space-between;">
          <div>
            <el-input v-if="mincategory" :disabled=mincatable style="width: 20rem; " v-model="minName"
              placeholder="小类"></el-input>
            <el-select v-else style="width: 20rem; " v-model="selectedminValue" placeholder="请选择"
              @change="handleminChange">
              <el-option v-for="item in minList" :key="item.productClassId" :label="item.name"
                :value="item.productClassId" />
            </el-select>
          </div>
          <div><el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
              @click="selectcategorymin">选择小类</el-button>
            <el-button v-if="addmincate" class="filter-item" size="mini" type="success" icon="el-icon-plus"
              @click="addcategorymin">新增小类</el-button>
            <el-button v-else class="filter-item" size="mini" type="success" @click="getmincategory">确定</el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="产品简称" prop="fgsbscName">
        <div style="display: flex; justify-content: space-between;">
          <div>
            <el-input v-if="procategory" :disabled=procatable style="width: 20rem; " v-model="proName"
              placeholder="产品简称"></el-input>
            <el-select v-else style="width: 20rem; " v-model="selectedproValue" placeholder="请选择"
              @change="handleproChange">
              <el-option v-for="item in proList" :key="item.productClassId" :label="item.name"
                :value="item.productClassId" />
            </el-select>
          </div>
          <div><el-button class="filter-item" size="mini" type="success" icon="el-icon-search"
              @click="selectcategorypro">选择简称</el-button>
            <el-button v-if="addprocate" class="filter-item" size="mini" type="success" icon="el-icon-plus"
              @click="addcategorypro">新增简称</el-button>
            <el-button v-else class="filter-item" size="mini" type="success" @click="getprocategory">确定</el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="产品名称" prop="fgsbscName">

        <el-select v-model="selectedmatValue" style="width: 20rem; " filterable placeholder="请选择"
          @change="handlematChange">
          <el-option v-for="item in MaterList" :key="item.code" :label="item.name" :value="item.code">
          </el-option>
        </el-select>

      </el-form-item>
      <el-form-item label="产品编号" prop="fgsbscName">
        <el-input v-model="dataForm2.code" placeholder="产品编号"></el-input>
      </el-form-item>
      <el-form-item label="换算单位（箱/盒）" prop="fgsbscName">
        <el-input v-model="dataForm3.converBox" placeholder="换算单位（箱/盒）"></el-input>
      </el-form-item>
      <el-form-item label="标准件换算" prop="fgsbscName">
        <el-input v-model="dataForm3.converBigPiece" placeholder="标准件换算"></el-input>
      </el-form-item>
      <el-form-item label="属性" prop="fzr" style="font-weight: 700;">
        <el-select v-model="dataForm3.attribute" placeholder="属性" style="width: 30%;">
          <el-option label="老品" value="老品"> </el-option>
          <el-option label="新品" value="新品"></el-option>
          <el-option label="其它" value="其它"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="Cancel()">取消</el-button>
      <el-button type="primary" @click="dataSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import * as api from '@/api/frame/customer.js'
import * as oapi from '@/api/management/management.js'
export default {
  data() {
    return {
      constants: this.$constants,
      visible: false,
      dataForm: {
        createBy: "",
        deptSort: 0,
        enabled: true,
        name: "",
        pid: 0,
        productClassId: 0,
        subCount: 0,
        updateBy: ""
      },
      dataForm1: {
        page: 1,
        size: 10,
        sort: ''
      },
      dataForm2: {
        box: '',
        code: ''
      },
      dataForm3: {
        attribute: "",//	属性(老品/新品)
        code: "",//	产品编码
        converBigPiece: 0,//换算单位(小件/大件)
        converBox: 0,//	换算单位（箱/盒）
        deptSort: 0,
        enabled: true,
        id: 0,//
        name: "",//	名称
        productClassId: 0,//	产品子分类主键
        productClassName: "",//	产品子分类名称
        productClassPid: 0,//	产品父分类主键
        productClassPname: "",//	产品父分类名称
      },

      Material: {
        blurry: '',
        page: 0,
        size: this.$constants.page.size[0],
        sort: '',
      },
      selectedbigValue: '',
      selectedbigLabel: '',
      selectedminValue: '',
      selectedminLabel: '',
      selectedproValue: '',
      selectedproLabel: '',
      selectedmatValue: '',
      selectedmatLabel: '',
      bigName: '',
      minName: '',
      proName: '',
      MaterList: [],
      Bdegory: [],
      ProductList: [],
      bigList: [],
      minList: [],
      proList: [],
      dataListLoading: false,
      currentTime: '',
      Product: false,
      bigcategory: true,
      bigcatable: true,
      mincategory: true,
      mincatable: true,
      procategory: true,
      procatable: true,
      addbigcate: true,
      addmincate: true,
      addprocate: true,
      bigID: 0,
      minID: 0,
      proID: 0
    }
  },
  mounted() {
    // this.getMaterial()
    this.getMaterialvar()
    this.getbigBdegory()
  },
  methods: {
    //取消
    Cancel() {
      this.visible = false
      this.$emit('close')
    },
    //选择大类
    selectcategorybig() {
      this.bigcategory = false
      this.addbigcate = true
    },
    //新增大类
    addcategorybig() {
      this.bigcategory = true
      this.bigcatable = false
      this.addbigcate = false

    },
    //新增大类确定
    getbigcategory() {
      this.bigID = this.getCurrentTime()
      this.dataForm.name = this.bigName
      this.dataForm.productClassId = this.bigID
      console.log(this.bigID, 6666)
      this.dataForm.deptSort = 1
      api.TrackProductClassAdd(this.dataForm).then(res => {
        this.MaterList = res
        console.log(this.MaterList)
        this.$message.success('成功')
        this.addbigcate = true
        this.getMaterialvar()
      })
    },
    //类别查询
    getbigBdegory() {
      api.BdtrackProductClass().then(res => {
        this.Bdegory = res
        this.Bdegory.forEach(item => {
          switch (item.deptSort) {
            case 1:
              this.bigList.push(item);
              break;
            case 2:
              this.minList.push(item);
              break;
            case 3:
              this.proList.push(item);
              break;
            default:
              break;  // 如果需要处理其他情况，可以在这里添加逻辑  
          }
        });
        console.log('Big List:', this.bigList);
        console.log('Min List:', this.minList);
        console.log('Pro List:', this.proList);
        console.log(this.Bdegory, 66222)
      })
    },

    //选择小类
    selectcategorymin() {
      this.mincategory = false
      this.addmincate = true
    },
    //新增小类
    addcategorymin() {
      this.mincategory = true
      this.mincatable = false
      this.addmincate = false
    },
    //新增小类确定
    getmincategory() {
      this.minID = this.getCurrentTime()
      this.dataForm.productClassId = this.minID
      this.dataForm.pid = this.bigID ? this.bigID : this.selectedbigValue
      this.dataForm.name = this.minName
      this.dataForm.deptSort = 2
      api.TrackProductClassAdd(this.dataForm).then(res => {
        this.MaterList = res
        console.log(this.MaterList)
        this.$message.success('成功')
        this.addmincate = true
        this.getMaterialvar()
      })
    },
    //选择简称
    selectcategorypro() {
      this.procategory = false
      this.addprocate = true
    },
    //新增简称
    addcategorypro() {
      this.procategory = true
      this.procatable = false
      this.addprocate = false
    },
    //新增简称确定
    getprocategory() {
      console.log(this.selectedproValue, 99999)
      this.proID = this.getCurrentTime()
      this.dataForm.productClassId = this.proID
      this.dataForm.pid = this.minID ? this.minID : this.selectedminValue
      this.dataForm.name = this.proName
      this.dataForm.deptSort = 3
      api.TrackProductClassAdd(this.dataForm).then(res => {
        this.MaterList = res
        console.log(this.MaterList)
        this.$message.success('成功')
        this.addprocate = true
        this.getMaterialvar()
      })
    },
    //大类选择框
    handlebigChange(value) {
      const selectedItem = this.bigList.find(item => item.productClassId === value);
      if (selectedItem) {
        this.selectedbigLabel = selectedItem.name;
        console.log('选中的值:', this.selectedbigValue); // 打印选中的 value  
        console.log('选中的标签:', this.selectedbigLabel); // 打印选中的 label  
      }
    },
    //小类选择框
    handleminChange(value) {
      const selectedItem = this.minList.find(item => item.productClassId === value);
      if (selectedItem) {
        this.selectedminLabel = selectedItem.name;
        console.log('选中的值:', this.selectedminValue); // 打印选中的 value  
        console.log('选中的标签:', this.selectedminLabel); // 打印选中的 label  
      }
    },
    //简称选择框
    handleproChange(value) {
      const selectedItem = this.proList.find(item => item.productClassId === value);
      if (selectedItem) {
        this.selectedproLabel = selectedItem.name;
        console.log('选中的值:', this.selectedproValue); // 打印选中的 value  
        console.log('选中的标签:', this.selectedproLabel); // 打印选中的 label  
      }
    },
    //物料选择框
    handlematChange(value) {
      const selectedItem = this.MaterList.find(item => item.code === value);
      if (selectedItem) {
        this.selectedmatLabel = selectedItem.name;
        console.log('选中的值:', this.selectedmatValue); // 打印选中的 value  
        console.log('选中的标签:', this.selectedmatLabel); // 打印选中的 label  
        this.dataForm2.code = this.selectedmatValue
        this.dataForm3.name = this.selectedmatLabel
        this.dataForm3.code = this.dataForm2.code
      }
    },

    getMaterialvar() {
      api.varbdMaterialall().then(res => {
        this.MaterList = res
        console.log('Pro MaterList:', this.MaterList);
      })
    },
    //时间搓
    getCurrentTime() {
      // 生成一个 10 位的随机数  
      const randomNum = Math.floor(Math.random() * 100000000); // 生成一个 0 到 9999999999 的随机数  

      // 组合时间戳和随机数生成一个唯一 ID  
      const uniqueId = randomNum;
      return uniqueId;
    },
    init(id, data) { // 初始化表单验证规则
      console.log(data, 'bigName')
      this.dataForm3.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        if (this.dataForm3.id) {
          this.dataForm3 = data
          this.bigName = data.productClassPname
          this.minName = data.productClassName
          this.proName = data.simplename
          this.dataForm2.code = data.code
          this.selectedmatValue = data.name
        }
      })
    },

    // 表单数据提交
    dataSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dataForm3.id) {
            console.log(this.dataForm3)

            oapi.APIbasiEDIT(this.dataForm3).then(res => {
              // TODO 保存数据
              this.$emit('refreshDataList')
              this.$emit('close')
              this.$message.success('修改数据成功')
              // this.visible = false
            });

          } else {
            this.dataForm3.productClassPname = this.bigName ? this.bigName : this.selectedbigLabel;
            this.dataForm3.productClassPid = this.bigID ? this.bigID : this.selectedbigValue;

            this.dataForm3.productClassName = this.minName ? this.minName : this.selectedminLabel;
            this.dataForm3.productClassId = this.minID ? this.minID : this.selectedminValue;

            this.dataForm3.simplename = this.proName ? this.proName : this.selectedproLabel;
            this.dataForm3.deptSort = this.proID ? this.proID : this.selectedproValue;

            oapi.APIbasiADD(this.dataForm3).then(res => {
              // TODO 保存数据
              this.$emit('refreshDataList')
              this.$emit('close')
              this.$message.success('新增数据成功')
              // this.visible = false
            });
          }
        }
      })
    }
  }
}
</script>