var series = [
  { name: "obsidian-underline", color: "#1a85ff" },
  { name: "obsidian-text-format", color: "#1c1c1c" },
];
$(function () {
  $.get(
    "https://raw.githubusercontent.com/Benature/obsidian-ranking-trend/main/data.json",
    function (data, status) {
      if (status == "success") {
        data = JSON.parse(data);
        render_echarts(data);
      }
    }
  );
});

function render_echarts(data) {
  var X = [];
  var legend = [];
  for (let j = 0; j < series.length; j++) {
    legend.push(series[j].name);
    series[j].type = "line";
    series[j].smooth = 0.2;
    series[j].data = [];
  }

  for (let i = 0; i < data.length; i++) {
    let date = data[i].date.slice(0, 10);
    X.push(date);
    for (let j = 0; j < series.length; j++) {
      series[j].data.push(data[i].data[series[j].name]);
    }
  }
  console.log(X);
  console.log(series);

  let myChart = echarts.init(document.getElementById("echarts"));

  option = {
    title: {
      show: true,
      text: "Obsidian Plugin Downloads",
      subtext: "Benature's plugin",
      textStyle: {
        color: "#757575",
        fontWeight: "normal",
      },
      // textStyle: {
      //     color: "#333",
      // },
    },
    legend: {
      data: legend,
      orient: "vertical",
      //   right: "right",
      //   padding: [50, -100, 150, 20],
    },
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
        dataView: { show: true, readOnly: true },
        magicType: { show: true, type: ["line", "bar"] },
        restore: { show: true },
        saveAsImage: { show: true },
      },
    },
    calculable: true,
    xAxis: {
      show: true,
      type: "category",
      boundaryGap: false,
      data: X,
    },
    yAxis: {
      // show: false,
      type: "value",
      // axisLine: {
      //     lineStyle: {
      //         color: '#1a85ff'
      //     }
      // }
    },
    series: series,
    tooltip: {
      //提示框组件
      trigger: "item", //item数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用。
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
      },
      formatter: "{a} <br/>date: {b}<br/>downloads: {c}", //{a}（系列名称），{b}（数据项名称），{c}（数值）, {d}（百分比）
    },
  };
  myChart.setOption(option);
}
