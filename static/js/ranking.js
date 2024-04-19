var series = [
  { name: "obsidian-text-format", color: "#1c1c1c" },
  { name: "obsidian-underline", color: "#1a85ff" },
  { name: "metadata-icon", color: "#d6f3fe" },
  { name: "metadata-hider", color: "#ab78c8" },
  { name: "share-my-plugin-list", color: "#187b39" },
  { name: "plugin-reloader", color: "#ffc362" },
  { name: "default-query-in-backlink", color: "#d85888" },
  { name: "automation", color: "#ca7e72" },
];
$(function () {
  let shield_plugin = getQueryString("shield");
  if (shield_plugin) {
    console.log(shield_plugin);
    $("body").html(
      '{"schemaVersion": 1,"label": "hello","message": "sweet world","color": "orange"}'
    );
    return;
  }

  let getHistoryData = $.getJSON(
    "https://raw.githubusercontent.com/Benature/obsidian-ranking-trend/main/data.json",
    function (data, status) {}
  );

  let getNowData = $.getJSON(
    "https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugin-stats.json",
    function (data, status) {}
  );

  getHistoryData.done(function (historyData) {
    console.log("historyData");
    getNowData.done(function (nowData) {
      console.log("nowData");
      render_echarts(historyData, nowData);
    });
  });
});

function render_echarts(historyData, nowData) {
  var X = [];
  var legend = [];
  for (let j = 0; j < series.length; j++) {
    legend.push(series[j].name);
    series[j].type = "line";
    series[j].smooth = 0.2;
    series[j].data = [];
  }

  // render series data list
  for (let i = 0; i < historyData.length; i++) {
    let date = historyData[i].date.slice(0, 10);
    X.push(date);
    for (let j = 0; j < series.length; j++) {
      series[j].data.push(historyData[i].data[series[j].name]);
    }
  }
  // console.log(nowData);
  for (let j = 0; j < series.length; j++) {
    // console.log(nowData[series[j].name]);
    series[j].data.push(nowData[series[j].name].downloads);
  }
  X.push("now");

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
    dataZoom: [
      {
        type: "slider",
      },
    ],
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
