<template>
  <div >
    <div class="header">
        <div class="nav">
<el-select v-model="value" @change="changeWeather">
    <el-option-group
      v-for="group in options"
      :key="group.label"
      :label="group.label">
      <el-option
        v-for="item in group.options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-option-group>
  </el-select>
   <p class="wind">
        {{temperature}}
      </p>
        </div>
    </div>
    <div class="main">
     
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
       options: [{
          label: '热门城市',
          options: [{
            value: 'Shanghai',
            label: '上海'
          }, {
            value: 'Beijing',
            label: '北京'
          }]
        }, {
          label: '城市名',
          options: [{
            value: 'Chengdu',
            label: '成都'
          }, {
            value: 'Shenzhen',
            label: '深圳'
          }, {
            value: 'Guangzhou',
            label: '广州'
          }, {
            value: 'Dalian',
            label: '大连'
          }]
        }],
        value: '南昌',
        chengshiId:"",
        temperature:0,
        index:0
    };
  },
  created () {
    this.chengshiInfo()

  },
  methods: {
    chengshiInfo(){
      this.Axios({
        method:'get',
        url:`https://geoapi.qweather.com/v2/city/lookup?location=${this.value}&key=48092b91a3ac4e89959e7db70ebb66ba`
      }).then(res=>{
        console.log(res);
      this.chengshiId =  res.data.location[0].id
      this.weatherInfo()
      })
    },
    changeWeather(){
    this.chengshiInfo()
    },
    weatherInfo(){
        this.Axios({
          method:'get',
          url:`https://yiketianqi.com/api?cityid=${this.chengshiId}&unescape=1&version=v1&appid=42241877&appsecret=bVc7Qhxv`
        }).then(res=>{
          console.log(res);
          this.temperature = res.data.data[this.index].tem
        })
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
    
 /deep/ .header{
    width: 99%;
    height: 600px;
    background-image: linear-gradient(#545F6C,#7A8998,#A5B7C8);
    margin: 0 auto;
    border-top-right-radius: 15px;
    border-top-left-radius: 15px;
     .el-input--suffix .el-input__inner {
    border-color: #C0C4CC;
    background-color: transparent;
}
    .el-input{
      width:35%;
    }
    
    .el-input__inner{
      border: 0px solid #DCDFE6;
      color: white;
    }
    .wind{
      text-align: center;
      height: 100px;
      line-height: 100px;
      font-size: 50px;
      color: #FFFFFF;
    }
  }

</style>
