var siteUrl = "";
function getHeaders() {
  var res =
    "    User-Agent:okhttp/3.12.0\n" +
    "Referer:http://api.kunyu77.com\n" +
    "Host:api.kunyu77.com";
  return res;
}
function homeContent() {
  var result = {},
    classes = [],
    quanbu = {},
    dianying = {},
    dianshiju = {},
    zongyi = {},
    dongman = {};
  //全部
  quanbu["type_id"] = "0";
  quanbu["type_name"] = "全部";
  //电影
  dianying["type_id"] = "1";
  dianying["type_name"] = "电影";
  //电视剧
  dianshiju["type_id"] = "2";
  dianshiju["type_name"] = "电视剧";
  //综艺
  zongyi["type_id"] = "3";
  zongyi["type_name"] = "综艺";
  //动漫
  dongman["type_id"] = "4";
  dongman["type_name"] = "动漫";

  classes[1] = dianying;
  classes[2] = dianshiju;
  classes[3] = zongyi;
  classes[4] = dongman;

  result.class = classes;
  return JSON.stringify(result);
}
function categoryContent(tid, pg) {
  var result = {};
  var list = [];
  var lists = [];
  url =
    "http://api.kunyu77.com/api.php/provide/searchFilter?type_id=" +
    tid +
    "&pagesize=24&pagenum=" +
    pg +
    "&year=&category=&area=";
  res = go_RequestClient(url, "get", getHeaders(), "");
  body = res.body;
  listArray = eval("(" + go_FindJsonKey(body, "data.result") + ")");
  //  console.log(body);
  //  console.log(listArray[0].videoCover);
  //    console.log(listArray.length);
  for (i = 0; i < listArray.length; i++) {
    var vod = {};
    vod_pic = listArray[i].videoCover;
    vod_name = listArray[i].title;
    vod_id = listArray[i].id;
    vod_remarks = listArray[i].msg;
    vod["vod_pic"] = vod_pic;
    vod["vod_id"] = vod_id;
    vod["vod_name"] = vod_name;
    vod["vod_remarks"] = vod_remarks;
    lists[i] = vod;
  }

  result["page"] = pg;
  result["pagecount"] = 65535;
  result["limit"] = 40;
  result["total"] = 65535;
  result["list"] = lists;
  re = JSON.stringify(result);
  //  console.log(re);

  return re;
}
function detailContent(ids) {
  var result = {};
  var info = {};
  var list_info = [];
  var urlInfo =
    "http://api.kunyu77.com/api.php/provide/videoDetail?devid=453CA5D864457C7DB4D0EAA93DE96E66&package=com.sevenVideo.app.android&version=1.8.7&ids=" +
    ids;
  var urlList =
    "http://api.kunyu77.com/api.php/provide/videoPlaylist?devid=453CA5D864457C7DB4D0EAA93DE96E66&package=com.sevenVideo.app.android&version=1.8.7&ids=" +
    ids;
  videoInfo = go_RequestClient(urlInfo, "get", getHeaders(), "").body;
  videolist = go_RequestClient(urlList, "get", getHeaders(), "").body;
  //  console.log(videoInfo);
  //  console.log("================");
  //  console.log(videolist);
  vod_name = go_FindJsonKey(videoInfo, "data.videoName");
  vod_id = ids;
  vod_year = go_FindJsonKey(videoInfo, "data.year");
  vod_pic = go_FindJsonKey(videoInfo, "data.videoCover");
  vod_area = go_FindJsonKey(videoInfo, "data.area");
  vod_actor = go_FindJsonKey(videoInfo, "data.actor");
  vod_remarks = go_FindJsonKey(videoInfo, "data.msg");
  vod_director = go_FindJsonKey(videoInfo, "data.director");
  vod_content = go_FindJsonKey(videoInfo, "data.brief").trim();
  type_name = go_FindJsonKey(videoInfo, "data.subCategory");

  info["vod_id"] = vod_id;
  info["vod_name"] = vod_name;
  info["vod_pic"] = vod_pic;
  info["type_name"] = type_name;
  info["vod_year"] = vod_year;
  info["vod_area"] = vod_area;
  info["vod_remarks"] = vod_remarks;
  info["vod_actor"] = vod_actor;
  info["vod_director"] = vod_director;
  info["vod_content"] = vod_content;
  //  console.log(JSON.stringify(info));
  play_url_JsonArray = eval(
    "(" + go_FindJsonKey(videolist, "data.episodes") + ")"
  );
  play_url_name = "";
  playfrom_Map = {};
  for (i = 0; i < play_url_JsonArray.length; i++) {
    jSONArray3 = play_url_JsonArray[i].playurls;
    //    console.log(JSON.stringify(jSONArray3));

    for (i2 = 0; i2 < jSONArray3.length; i2++) {
      jSONObject5 = jSONArray3[i2];
      play_url_name = jSONObject5.playfrom;
      if (playfrom_Map[play_url_name] == null) {
        playfrom_Map[play_url_name] = [];
      }
      name1 = jSONObject5.title.replace(vod_name, "");
      playurl = jSONObject5.playurl;

      playfrom_Map[play_url_name].push(name1 + "$" + playurl);
    }
  }

  console.log(JSON.stringify(Object.keys(playfrom_Map)));
}
function playerContent(id) {}
