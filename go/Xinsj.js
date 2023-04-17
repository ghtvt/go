var siteUrl = "https://www.6080dy3.com";

function homeContent() {
  var result = {},
    classes = {},
    dianying = {},
    dianshiju = {},
    zongyi = {},
    dongman = {};
  //电影
  dianying["type_id"] = "/vodshow/1--------";
  dianying["type_name"] = "电影";
  //电视剧
  dianshiju["type_id"] = "/vodshow/2--------";
  dianshiju["type_name"] = "电视剧";
  //综艺
  zongyi["type_id"] = "/vodshow/3--------";
  zongyi["type_name"] = "综艺";
  //动漫
  dongman["type_id"] = "/vodshow/4--------";
  dongman["type_name"] = "动漫";

  classes[0] = dianying;
  classes[1] = dianshiju;
  classes[2] = zongyi;
  classes[3] = dongman;

  result.class = classes;
  return JSON.stringify(result);
}

homeContent();
