<template>
  <div class="bigdiv">
    <div class="header">
        <div class="nav">
          <div class="nav_header">
            <div id="app">
              <div id="app">
    <el-cascader
      size="large"
      :options="options"
      v-model="selectedOptions"
      placeholder="南昌"
      @change="addressChange">
    </el-cascader>
  </div>
  </div>
          </div>
  <div class="info">
    <p class="wind">
        {{temperature}}
      </p>
      <p class="wea_day">
        {{wea_day}}&nbsp;&nbsp;|&nbsp;&nbsp;{{win}}{{win_speed}}
      </p>
      <p class="quality">
        <span>{{air}}</span>
      <span>{{air_level}}</span>
      <span><img src="../assets/向右箭头.svg" alt=""></span>
      </p>
      <div class="detail">
          今天:{{wea}}&nbsp;{{tem1}}至{{tem2}}&nbsp;{{win}}{{win_speed}}
      <div class="hous">
        24小时预报
        <div></div>
      </div>

      </div>
      <div class="icon">
        <span v-for="(obj,index) in data2" :key="index">
          <img src="../../Icons/icons/100.svg" alt="" />
          {{obj}}℃
        </span>
        </div>
  </div>
      <div class="diagram">

      </div>
      
        </div>
    </div>
    <div class="main">
      <ul>
        <li v-for="(obj,index) in list" :key="index" @click="qiehuan(index)">
          <span v-if="index==0">今天</span>
          <span v-else-if="index==1">明天</span>
          <span v-else>{{obj.week}}</span>
          <span>{{obj.date.substring(5)}}</span>
          <img src="../../Icons/icons/100.svg" alt="">
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
var myChart;
var option;
import { provinceAndCityData ,CodeToText } from 'element-china-area-data'
export default {
  name: 'HelloWorld',
  data() {
    return {
       options: [{
          label: '热门城市',
          options: [{
            value: '上海',
            label: '上海'
          }, {
            value: '北京',
            label: '北京'
          }]
        }, {
          label: '城市名',
          options: [{
            value: '成都',
            label: '成都'
          }, {
            value: '深圳',
            label: '深圳'
          }, {
            value: '广州',
            label: '广州'
          }, {
            value: '大连',
            label: '大连'
          }]
        }],
        value: '南昌',
        chengshiId:"101240101",
        temperature:0,
        index:0,
        wea_day:'',
        win:'',
        win_speed:'',
        air:'',
        air_level:'',
        wea:'',
        tem1:'',
        tem2:'',
        data1:[],
        data2:[],
        list:[],
        options: provinceAndCityData ,
        selectedOptions: []
    };
  },
  created () {
    this.chengshiInfo()

  },
  mounted () {
    this.diagram()
  },
  methods: {
    addressChange(arr) {
          console.log(arr);
          console.log(CodeToText[arr[1]]=="市辖区");
          if (CodeToText[arr[1]]=="市辖区") {          
            console.log(arr);
            this.value = CodeToText[arr[0]]
            this.chengshiInfo()
          }else{
            this.value = CodeToText[arr[arr.length-1]]
            this.chengshiInfo()
          }
         
          this.chengshiInfo()
      },
    chengshiInfo(){
      this.Axios({
        method:'get',
        url:`https://geoapi.qweather.com/v2/city/lookup?location=${this.value}&key=48092b91a3ac4e89959e7db70ebb66ba`
      }).then(res=>{
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
          url:`https://www.tianqiapi.com/api?version=v1&appid=12944217&appsecret=qS3aHmNC&cityid=${this.chengshiId}`,
        }).then(res=>{
          this.temperature = res.data.data[this.index].tem
          this.wea_day = res.data.data[this.index].wea_day
          this.win = res.data.data[this.index].win[0]
          this.win_speed = res.data.data[this.index].win_speed
          this.air = res.data.data[this.index].air
          this.air_level = res.data.data[this.index].air_level
          this.wea = res.data.data[this.index].wea
          this.tem1 = res.data.data[this.index].tem1
          this.tem2 = res.data.data[this.index].tem2
          this.data1 = []
          this.data2 = []
          this.list = []
          for (let i = 0; i < 5; i++) {
           this.data1.push(res.data.data[this.index].hours[i].hours)
            this.data2.push(res.data.data[this.index].hours[i].tem)        
            this.list.push(res.data.data[i])          
          }
          this.diagram()
        })
        
    },
    diagram(){
      if (myChart!=null) {
        myChart.dispose();
      }
       myChart = this.echarts.init(document.querySelector('.diagram'));
         option = {
      xAxis: {
        type: 'category',
        data: this.data1
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: this.data2,
          type: 'line',
          smooth: true
        }
      ]
      
    };
    myChart.setOption(option);
    },
    qiehuan(i){
      this.index = i
      this.weatherInfo()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
      .bigdiv{
        width: 100%;
      }
 /deep/ .header{
    width: 100%;
    height: 640px;
    background-image: linear-gradient(#545F6C,#7A8998,#A5B7C8);
    border-top-right-radius: 15px;
    border-top-left-radius: 15px;
     .el-input--suffix .el-input__inner {
    border-color: #C0C4CC;
    background-color: transparent;
}
    .el-input{
      width:75%;
    }
    
    .el-input__inner{
      border: 0px solid #DCDFE6;
      color: white;
    }
    .wind{
      text-align: center;
      height: 50px;
      line-height: 100px;
      font-size: 50px;
      color: #FFFFFF;
    }
    .info{
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #FFFFFF;
      font-size: 18px;
    }
    .quality{
      width: 80px;
      height: 30px;
      background-color: #5FB06A;
      border-radius: 15px;
      display: flex;
      justify-content: space-evenly;
      font-size: 16px;
      align-items: center;
      color: #FFFFFF;
      span{
        font-size: .5rem;
        img{
          width: .8rem;
          height: .8rem;
        }
      }
    }
    .detail{
      font-size: 12px;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      width: 100%;
      .hous{
        width: 100px;
      height: 30px;
      background-color: #B0BDCB;
      border-radius: 15px;
      line-height: 30px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-evenly;
      div{
        width: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-bottom: 8px solid #FFFFFF;
      }
      }
    }
    .diagram{
      height: 260px;
    }
    .icon{
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      margin-top: 20px;
    width: 95%;
      span{
        img{
          width: 30px;
          height: 30px;
        }
        display: flex;
        flex-direction: column;
      }
    }
  }
  .main{
    ul{
      display: flex;
      align-items: center;
      justify-content: space-around;
      li{
      display: flex;
      flex-direction: column;   
      align-items: center;
      img{
        width: 30px;
        height: 30px;
      }
      }
      li:not(:last-child){
        border-right: 1px solid #F2F2F2;
        padding-right: 15px;
        color: #1E1F24;
      }
    }
  }

</style>
