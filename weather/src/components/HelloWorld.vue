<template>
  <div class="bigdiv">
    <div class="header">
      <div class="nav">
        <div class="nav_header">
          <div id="app">
            <!-- 城市选择模块 -->
            <el-cascader
              size="large"
              :options="optionss"
              v-model="selectedOptions"
              :placeholder="placeholder"
              class="input"
              @change="addressChange"
            >
            </el-cascader>
            <div>
              <!-- 城市搜索模块 -->
              <van-search
                v-model="searchInfo"
                placeholder="输入城市"
                @keydown.enter="search"
              />
            </div>
          </div>
        </div>
        <div class="info">
          <p class="wind">
            <!-- 一天平均温度 -->
            {{ temperature }}
          </p>
          <p class="wea_day">
            <!-- 当天的天气状态以及风向和风向等级 -->
            {{ wea_day }}&nbsp;&nbsp;|&nbsp;&nbsp;{{ win }}{{ win_speed }}
          </p>
          <p class="quality">
            <!-- 空气质量 -->
            <span>{{ air }}</span>
            <span>{{ air_level }}</span>
            <span><img src="../assets/向右箭头.svg" alt="" /></span>
          </p>
          <div class="detail">
            <!-- 最高温度和最低温度风向的变化 -->
            {{ date.substring(5) }}:{{ wea }}&nbsp;{{ tem1 }}至{{
              tem2
            }}&nbsp;{{ win }}{{ win_speed }}
            <div class="hous">
              24小时预报
              <div></div>
            </div>
          </div>
          <div class="icon">
            <span v-for="(obj, index) in data2" :key="index">
              <!-- 每个小时的温度情况 -->
              <img :src="url[index]" alt="" />
              {{ obj }}℃
            </span>
          </div>
        </div>
        <!-- 把小时温度数据用echrats可视化 -->
        <div class="diagram"></div>
      </div>
    </div>
    <div class="main">
      <ul>
        <!-- 未来5天内的天气预报 -->
        <li v-for="(obj, index) in list" :key="index" @click="qiehuan(index)">
          <span v-if="index == 0">今天</span>
          <span v-else-if="index == 1">明天</span>
          <span v-else>{{ obj.week }}</span>
          <span>{{ obj.date.substring(5) }}</span>
          <img :src="img[index]" alt="" />
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
var myChart;
var option;
import { provinceAndCityData, CodeToText } from "element-china-area-data";
export default {
  name: "HelloWorld",
  data() {
    return {
      options: [
        {
          label: "热门城市",
          options: [
            {
              value: "上海",
              label: "上海",
            },
            {
              value: "北京",
              label: "北京",
            },
          ],
        },
        {
          label: "城市名",
          options: [
            {
              value: "成都",
              label: "成都",
            },
            {
              value: "深圳",
              label: "深圳",
            },
            {
              value: "广州",
              label: "广州",
            },
            {
              value: "大连",
              label: "大连",
            },
          ],
        },
      ],
      value: "南昌",
      chengshiId: "101240101",
      temperature: 0,
      index: 0,
      wea_day: "",
      win: "",
      win_speed: "",
      air: "",
      air_level: "",
      wea: "",
      tem1: "",
      tem2: "",
      data1: [],
      data2: [],
      list: [],
      date: "",
      // eslint-disable-next-line no-dupe-keys
      optionss: provinceAndCityData,
      selectedOptions: [],
      searchInfo: "",
      placeholder: "南昌",
      img: [
        require("../assets/taiyang.svg"),
        require("../assets/taiyangyu-baitian.svg"),
        require("../assets/xiayu.svg"),
        require("../assets/yintian.svg"),
        require("../assets/yinzhuanqing.svg"),
      ],
      url: [
        require("../assets/tianqi-daxue.svg"),
        require("../assets/tianqi-dayu.svg"),
        require("../assets/tianqi-leidiantianqi.svg"),
        require("../assets/tianqi-qing.svg"),
        require("../assets/tianqi-yintian.svg"),
      ],
    };
  },
  created() {
    // 发起城市选择请求
    this.chengshiInfo();
  },
  mounted() {
    // echarts
    this.diagram();
  },
  methods: {
    // 搜索城市
    search() {
      if ((this.searchInfo != null) & (this.searchInfo.length != 0)) {
        this.value = this.searchInfo;
        this.placeholder = this.value;
        this.searchInfo = "";
        this.chengshiInfo();
      }
    },
    addressChange(arr) {
      // 选择城市模块
      if (CodeToText[arr[1]] == "市辖区") {
        this.value = CodeToText[arr[0]];
        this.chengshiInfo();
      } else {
        this.value = CodeToText[arr[arr.length - 1]];
        this.chengshiInfo();
      }

      this.chengshiInfo();
    },
    chengshiInfo() {
      // 获取城市的cityId
      this.Axios({
        method: "get",
        url: `https://geoapi.qweather.com/v2/city/lookup?location=${this.value}&key=48092b91a3ac4e89959e7db70ebb66ba`,
      }).then((res) => {
        this.chengshiId = res.data.location[0].id;
        this.weatherInfo();
      });
    },
    changeWeather() {
      // 当城市选择事件触发就重新发起请求
      this.chengshiInfo();
    },
    weatherInfo() {
      // 通过城市id来获取对应的天气
      this.Axios({
        method: "get",
        url: `https://www.tianqiapi.com/api?version=v1&appid=42241877&appsecret=bVc7Qhxv&cityid=${this.chengshiId}`,
      }).then((res) => {
        this.temperature = res.data.data[this.index].tem;
        this.wea_day = res.data.data[this.index].wea_day;
        this.win = res.data.data[this.index].win[0];
        this.win_speed = res.data.data[this.index].win_speed;
        this.air = res.data.data[this.index].air;
        this.air_level = res.data.data[this.index].air_level;
        this.wea = res.data.data[this.index].wea;
        this.tem1 = res.data.data[this.index].tem1;
        this.tem2 = res.data.data[this.index].tem2;
        this.data1 = [];
        this.data2 = [];
        this.list = [];
        this.date = res.data.data[this.index].date;
        for (let i = 0; i < 5; i++) {
          this.data1.push(res.data.data[this.index].hours[i].hours);
          this.data2.push(res.data.data[this.index].hours[i].tem);
          this.list.push(res.data.data[i]);
        }
        this.diagram();
        this.index = 0;
      });
    },
    diagram() {
      // echarts
      if (myChart != null) {
        myChart.dispose();
      }
      myChart = this.echarts.init(document.querySelector(".diagram"));
      option = {
        xAxis: {
          type: "category",
          data: this.data1,
          display: false,
        },
        tooltip: {
          trigger: "axis", //坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "line", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        yAxis: {
          type: "value",
          splitLine: { show: false },
          axisLine: {
            show: false,
          },
        },
        series: [
          {
            data: this.data2,
            type: "line",
            smooth: true,
            display: false,
          },
        ],
      };
      myChart.setOption(option);
    },
    qiehuan(i) {
      this.index = i;
      this.weatherInfo();
    },
  },
};
</script>
<style lang="less" scoped>
.bigdiv {
  width: 100%;
  max-width: 480px;
  min-width: 375px;
  margin: 0 auto;
}
/deep/ .header {
  .el-cascader {
    position: relative;
    font-size: 14px;
    line-height: 40px;
    width: 140px;
  }
  width: 100%;
  height: 640px;
  background-image: linear-gradient(#545f6c, #7a8998, #a5b7c8);
  border-top-right-radius: 15px;
  border-top-left-radius: 15px;
  .el-input--suffix .el-input__inner {
    border-color: #c0c4cc;
    background-color: transparent;
  }
  .el-input {
    width: 75%;
  }

  .el-input__inner {
    border: 0px solid #dcdfe6;
    color: white;
  }
  .wind {
    text-align: center;
    height: 50px;
    line-height: 100px;
    font-size: 50px;
    color: #ffffff;
  }
  .info {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #ffffff;
    font-size: 18px;
  }
  .quality {
    width: 80px;
    height: 30px;
    background-color: #5fb06a;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
    border-radius: 15px;
    display: flex;
    justify-content: space-evenly;
    font-size: 16px;
    align-items: center;
    color: #ffffff;
    span {
      font-size: 0.5rem;
      img {
        width: 0.8rem;
        height: 0.8rem;
      }
    }
  }
  .detail {
    font-size: 12px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    .hous {
      width: 100px;
      height: 30px;
      background-color: #b0bdcb;
      border-radius: 15px;
      line-height: 30px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-evenly;
      div {
        width: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-bottom: 8px solid #ffffff;
      }
    }
  }
  .diagram {
    height: 260px;
  }
  .icon {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    margin-top: 20px;
    width: 95%;
    span {
      img {
        width: 30px;
        height: 30px;
      }
      display: flex;
      flex-direction: column;
    }
  }
}
.main {
  ul {
    display: flex;
    align-items: center;
    justify-content: space-around;
    li {
      display: flex;
      flex-direction: column;
      align-items: center;
      img {
        width: 30px;
        height: 30px;
      }
    }
    li:not(:last-child) {
      border-right: 1px solid #f2f2f2;
      padding-right: 15px;
      color: #1e1f24;
    }
  }
}
#app {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-right: 15px;
  .van-search__content {
    display: flex;
    flex: 1;
    padding-left: 0px;
    border-radius: 2px;
    background-color: transparent;
  }
  .van-search {
    height: 20px;
    background-color: #616d7b;
    border-radius: 10px;
    border: 1px solid white;
    outline: none;
    width: 130px;
  }
  button {
    font-size: 15px;
    border-radius: 4px;
    padding: 5px;
    letter-spacing: 2px;
    background-color: #ffffff;
    border: none;
  }
}
</style>
