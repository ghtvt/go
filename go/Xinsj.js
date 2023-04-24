var siteUrl = "https://www.6080dy3.com";

function getHeaders() {
  var res = "    method:Get\n" + "Upgrade-Insecure-Requests:1\n" + "DNT:1";
  return res;
}
function homeContent() {
  var result = {},
    classes = [],
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
function categoryContent(tid, pg) {
  var result = {};
  var list = [];
  var lists = [];

  var url = siteUrl + tid + pg + "---.html";
  //  var url = "http://httpbin.org/get";
  res = go_RequestClient(url, "get", getHeaders(), "");
  body = res.body;
  list = go_FindHtml(body, ".module-items .module-item");
  for (i = 0; i < list.length; i++) {
    var vod = {};
    vod_pic = go_FindAttr(list[i], ".module-item-pic img", "data-src");
    vod_id = go_FindAttr(list[i], ".module-item-pic a", "href");
    vod_name = go_FindAttr(list[i], ".module-item-pic a", "title");
    vod_remarks = go_FindText(list[i], ".module-item-text");
    vod["vod_pic"] = vod_pic;
    vod["vod_id"] = vod_id;
    vod["vod_name"] = vod_name;
    vod["vod_remarks"] = vod_remarks;
    lists[i] = vod;
    //    console.log(JSON.stringify(vod));
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
  var url = siteUrl + ids;
  res = go_RequestClient(url, "get", getHeaders(), "");
  body = res.body;
  //  var list = go_FindHtml(body, ".module-tab-content .module-tab-item");
  var list_play_name = go_FindHtml(
    body,
    ".module-tab-content .module-tab-item.tab-item"
  );
  var play_from_array = [];
  var vod_play_from_list = [];
  for (i = 0; i < list_play_name.length; i++) {
    //    console.log(list_play_name[i]);
    sname = go_FindText(list_play_name[i], "span");
    vod_play_from_list[i] = sname;
  }
  vod_play_from = vod_play_from_list.join("$$$");
  //  console.log(vod_play_from);

  sourceUrl_el = go_FindHtml(body, ".sort-item");
  for (i = 0; i < sourceUrl_el.length; i++) {
    arr = [];
    url_a = go_FindHtml(sourceUrl_el[i], "a");
    //    console.log(url_a);
    for (j = 0; j < url_a.length; j++) {
      arr[j] =
        go_FindText(url_a[j], "span") + "$" + go_FindAttr(url_a, "a", "href");
    }
    //    console.log(arr);
    source = arr.join("#");
    play_from_array[i] = source;
  }
  vod_play_url = play_from_array.join("$$$");

  //  console.log(vod_play_url);
  //info
  v_info_el = go_FindHtml(body, ".video-info");
  vod_name = go_FindText(v_info_el, ".page-title");
  vod_pic = go_FindAttr(body, ".lazyload", "data-src");
  //  console.log(vod_pic);
  var type_name = go_FindText(v_info_el, ".tag-link");
  var vod_year = "年份";
  var vod_year = "年份";
  var vod_area = "地区";
  var vod_remarks = "提示信息";
  var vod_actor = "主演";
  var vod_director = "导演";
  var vod_content = "简介";

  info.vod_id = ids;
  info.vod_name = vod_name;
  info.vod_pic = vod_pic;
  info.type_name = type_name;
  info.vod_year = vod_year;
  info.vod_area = vod_area;
  info.vod_remarks = vod_remarks;
  info.vod_actor = vod_actor;
  info.vod_director = vod_director;
  info.vod_content = vod_content;

  info.vod_play_from = vod_play_from;
  info.vod_play_url = vod_play_url;

  list_info.push(info);
  result.list = list_info;

  //  console.log(JSON.stringify(result));
  return JSON.stringify(result);
}
function playerContent(id) {
  url = siteUrl + id;
  res = go_RequestClient(url, "get", getHeaders(), "");
  body = res.body;
  playurl = go_FindAttr(body, "#bfurl", "href");
  var result = {};
  result.header = "";
  result.parse = 0;
  result.playurl = playurl;
  return JSON.stringify(result);
}
