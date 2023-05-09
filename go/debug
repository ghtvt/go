package main

import (
	"crypto/md5"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/asters1/goquery"
	"github.com/tidwall/gjson"

	"github.com/robertkrimen/otto"
)

//func C.CString(string) *C.char              //go字符串转化为char*
//func C.CBytes([]byte) unsafe.Pointer        // go 切片转化为指针
//func C.GoString(*C.char) string             //C字符串 转化为 go字符串
//func C.GoStringN(*C.char, C.int) string
//func C.GoBytes(unsafe.Pointer, C.int) []byte

func JsInit() *otto.Otto {

	vm := otto.New()
	//随机数,4位小数
	vm.Set("go_random", func(call otto.FunctionCall) otto.Value {

		rand := int(time.Now().UnixNano() % 10000)

		frand := float32(rand) * 0.0001
		value, _ := strconv.ParseFloat(fmt.Sprintf("%.4f", frand), 64)
		vm_random, _ := vm.ToValue(value)
		return vm_random

	})
	//获取md5
	vm.Set("go_md5", func(call otto.FunctionCall) otto.Value {
		str, _ := call.Argument(0).ToString()
		data := []byte(str) //切片
		has := md5.Sum(data)
		md5str := fmt.Sprintf("%x", has) //将[]byte转成16进制
		vm_md5, _ := vm.ToValue(md5str)
		return vm_md5

	})
	//获取时间戳
	vm.Set("go_getTime", func(call otto.FunctionCall) otto.Value {
		i, _ := call.Argument(0).ToInteger()
		if i > 19 {
			i = 19
		}
		timeUnixNano := time.Now().UnixNano()
		str_time := strconv.FormatInt(timeUnixNano, 10)
		s, _ := vm.ToValue(str_time[:i])
		return s
	})
	//发送请求
	vm.Set("go_RequestClient", func(call otto.FunctionCall) otto.Value {
		FormatStr := func(jsonstr string) map[string]string {
			DataMap := make(map[string]string)
			Nslice := strings.Split(jsonstr, "\n")
			for i := 0; i < len(Nslice); i++ {
				if strings.Index(Nslice[i], ":") != -1 {
					a := Nslice[i][:strings.Index(Nslice[i], ":")]
					b := Nslice[i][strings.Index(Nslice[i], ":")+1:]
					DataMap[a] = b
				}
			}
			return DataMap

		}

		URL, _ := call.Argument(0).ToString()
		METHOD, _ := call.Argument(1).ToString()
		HEADER, _ := call.Argument(2).ToString()
		DATA, _ := call.Argument(3).ToString()

		URL = strings.TrimSpace(URL)
		METHOD = strings.TrimSpace(METHOD)
		HEADER = strings.TrimSpace(HEADER)
		DATA = strings.TrimSpace(DATA)
		if URL == "" || METHOD == "" {
			return otto.Value{}
		}

		HeaderMap := FormatStr(HEADER)
		DataMap := FormatStr(DATA)
		client := &http.Client{}
		if METHOD == "get" {
			METHOD = http.MethodGet
		} else if METHOD == "post" {
			METHOD = http.MethodPost

		}
		FormatData := ""
		for i, j := range DataMap {
			FormatData = FormatData + i + "=" + j + "&"
		}
		if FormatData != "" {
			FormatData = FormatData[:len(FormatData)-1]
		}
		requset, _ := http.NewRequest(
			METHOD,
			URL,
			strings.NewReader(FormatData),
		)
		if METHOD == http.MethodPost && requset.Header.Get("Content-Type") == "" {
			requset.Header.Set("Content-Type", "application/x-www-form-urlencoded")
		}
		requset.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.71 Safari/537.36")
		for i, j := range HeaderMap {
			requset.Header.Set(i, j)
		}
		resp, err := client.Do(requset)

		if err != nil {
			fmt.Println("请求发送失败")
			fmt.Println(err)
			os.Exit(0)
		}
		body_bit, _ := ioutil.ReadAll(resp.Body)
		headerMap := resp.Header
		jsonByte, err := json.Marshal(headerMap)
		if err != nil {
			fmt.Printf("Marshal with error: %+v\n", err)
		}
		header := string(jsonByte)

		defer resp.Body.Close()
		status := strconv.Itoa(resp.StatusCode)
		body := string(body_bit)
		res_str := make(map[string]string)

		res_str["status"] = status
		res_str["header"] = header
		res_str["body"] = body
		result, _ := vm.ToValue(res_str)

		return result
	})

	vm.Set("go_FindJsonKey", func(call otto.FunctionCall) otto.Value {
		JSON, _ := call.Argument(0).ToString()
		Key, _ := call.Argument(1).ToString()
		value := gjson.Get(JSON, Key).String()
		result, _ := vm.ToValue(value)
		return result

	})
	//	vm.Set("go_FindJsonKeyArray", func(call otto.FunctionCall) otto.Value {
	//		JSON, _ := call.Argument(0).ToString()
	//		Key, _ := call.Argument(1).ToString()
	//		value := gjson.Get(JSON, Key).Array()
	//		fmt.Println(value)
	//		result, _ := vm.ToValue(value)
	//		return result
	//
	//	})
	vm.Set("go_FindHtml", func(call otto.FunctionCall) otto.Value {
		HTML, _ := call.Argument(0).ToString()
		CSS, _ := call.Argument(1).ToString()

		// 加载 HTML document对象
		doc, err := goquery.NewDocumentFromReader(strings.NewReader(HTML))
		if err != nil {
			fmt.Println("加载HTML失败")
			os.Exit(0)
		}
		var res []string
		// Find the review items
		doc.Find(CSS).Each(func(i int, s *goquery.Selection) {
			// For each item found, get the band and title
			value, err := s.String()

			if err != nil {
				fmt.Println("获取Html列表出错")
			}

			res = append(res, value)
		})

		result, _ := vm.ToValue(res)
		return result
	})
	vm.Set("go_FindText", func(call otto.FunctionCall) otto.Value {
		HTML, _ := call.Argument(0).ToString()
		CSS, _ := call.Argument(1).ToString()

		// 加载 HTML document对象
		doc, err := goquery.NewDocumentFromReader(strings.NewReader(HTML))
		if err != nil {
			fmt.Println("加载节点失败")
			os.Exit(0)
		}
		// Find the review items
		res := doc.Find(CSS).Text()
		result, _ := vm.ToValue(res)
		return result
	})
	vm.Set("go_FindAttr", func(call otto.FunctionCall) otto.Value {
		HTML, _ := call.Argument(0).ToString()
		CSS, _ := call.Argument(1).ToString()
		KEY, _ := call.Argument(2).ToString()

		// 加载 HTML document对象
		doc, err := goquery.NewDocumentFromReader(strings.NewReader(HTML))
		if err != nil {
			fmt.Println("加载节点失败")
			os.Exit(0)
		}
		// Find the review items
		// For each item found, get the band and title
		res := ""
		bl := true
		if CSS == "" {
			res, bl = doc.Attr(KEY)

		} else {
			res, bl = doc.Find(CSS).Attr(KEY)
		}

		if !bl {
			fmt.Println("没有获取到" + KEY)
		}
		result, _ := vm.ToValue(res)
		return result
	})
	return vm
}

func jsFunc(js_str string) {
	vm := JsInit()
	vm.Run(js_str)
}

func Jsoninit() *otto.Otto {

	js := os.Args[1]
	js_func := ""
	vm := JsInit()
	if len(os.Args) > 2 {
		js_func = os.Args[2]
		js_func_con, err := ioutil.ReadFile(js_func)
		if err != nil {
			fmt.Println("打开文件[ " + js_func + " ]失败！")
			os.Exit(0)
		}
		js_func_str := string(js_func_con)
		jsFunc(js_func_str)

	}
	js_con, err := ioutil.ReadFile(js)
	if err != nil {
		fmt.Println("打开文件[ " + js + " ]失败！")
		os.Exit(0)
	}
	js_str := string(js_con)
	//js初始化
	_, err = vm.Run(js_str)
	if err != nil {
		fmt.Println(err)
	}
	return vm
}
func CheckHomeContent(vm *otto.Otto) string {
	fmt.Print("==========homeContent:=======\n\n")

	//	//运行homeContent
	result, err := vm.Run("homeContent()")
	if err != nil {
		fmt.Println("运行homeContent时出错！")
		fmt.Println(err)

		os.Exit(0)
	}
	resjson, err := result.ToString()
	if resjson == "undefined" {

		fmt.Println("homeContent返回为undefined,没有返回值")
		os.Exit(0)
	}
	//	fmt.Println("resjson:" + resjson)
	if resjson == "" {
		fmt.Println("homeContent返回为空")
		os.Exit(0)
	}

	if err != nil {
		fmt.Println("运行homeContent后转换string时出错！")
		fmt.Println(err)
		os.Exit(0)
	}
	jstr := string(resjson)
	//	fmt.Println(jstr)
	classes := gjson.Get(jstr, "class").Array()
	//	fmt.Println(res)
	for i := 0; i < len(classes); i++ {

		fmt.Print(classes[i].Get("type_name"))
		fmt.Print("[" + classes[i].Get("type_id").String() + "]\n\n")

	}

	return jstr

}
func CheckCategoryContent(tid string, pg int, vm *otto.Otto) []string {

	fmt.Print("==========categoryContent:=======\n\n")
	page := strconv.Itoa(pg)
	result, err := vm.Run("categoryContent(\"" + tid + "\"," + page + ")")
	if err != nil {
		fmt.Println("运行categoryContent时出错！")
		fmt.Println(err)

		os.Exit(0)
	}
	resjson, err := result.ToString()
	if resjson == "undefined" {

		fmt.Println("categoryContent返回为undefined,没有返回值")
		os.Exit(0)
	}

	if resjson == "" {
		fmt.Println("categoryContent返回为空")
		os.Exit(0)
	}

	if err != nil {
		fmt.Println("运行categoryContent后转换string时出错！")
		fmt.Println(err)
		os.Exit(0)
	}
	page_json := gjson.Get(resjson, "page")
	fmt.Println("//当前页")
	fmt.Println("page:" + page_json.String())
	pagecount_json := gjson.Get(resjson, "pagecount")
	fmt.Println("//总共多少页")
	fmt.Println("pagecount_json:" + pagecount_json.String())
	limit := gjson.Get(resjson, "limit")
	fmt.Println("//每页多少数据")
	fmt.Println("limit:" + limit.String())
	total := gjson.Get(resjson, "total")
	fmt.Println("//总共多少数据")
	fmt.Println("total" + total.String())
	fmt.Println("//视频列表")
	list := gjson.Get(resjson, "list").Array()
	var res []string
	for i := 0; i < len(list); i++ {
		vod_name := list[i].Get("vod_name").String()
		vod_id := list[i].Get("vod_id").String()
		fmt.Println(vod_name + "[" + vod_id + "]")
		resstr := vod_name + "#" + vod_id
		res = append(res, resstr)

	}

	return res
}
func CheckdetailContent(ids string, vm *otto.Otto) string {

	res := ""
	fmt.Print("==========detailContent:=======\n\n")
	result, err := vm.Run("detailContent(\"" + ids + "\")")

	if err != nil {
		fmt.Println("运行detailContent时出错！")
		fmt.Println(err)

		os.Exit(0)
	}
	resjson, err := result.ToString()

	if resjson == "undefined" {

		fmt.Println("detailContent返回为undefined,没有返回值")
		os.Exit(0)
	}
	if resjson == "" {
		fmt.Println("detailContent返回为空")
		os.Exit(0)
	}

	if err != nil {
		fmt.Println("运行detailContent后转换string时出错！")
		fmt.Println(err)
		os.Exit(0)
	}
	//	fmt.Println("=====" + resjson)
	//
	Video_name := gjson.Get(resjson, "list.0.vod_name").String()
	Video_Id := gjson.Get(resjson, "list.0.vod_id").String()
	Video_pic := gjson.Get(resjson, "list.0.vod_pic").String()
	Video_type_name := gjson.Get(resjson, "list.0.type_name").String()
	Video_year := gjson.Get(resjson, "list.0.vod_year").String()
	Video_area := gjson.Get(resjson, "list.0.vod_area").String()
	Video_remarks := gjson.Get(resjson, "list.0.vod_remarks").String()
	Video_actor := gjson.Get(resjson, "list.0.vod_actor").String()
	Video_director := gjson.Get(resjson, "list.0.vod_director").String()
	Video_content := gjson.Get(resjson, "list.0.vod_content").String()
	Video_play_from := gjson.Get(resjson, "list.0.vod_play_from").String()
	Video_play_url := gjson.Get(resjson, "list.0.vod_play_url").String()
	fmt.Println("视频名:" + Video_name)
	fmt.Println("视频Id:" + Video_Id)
	fmt.Println("封面:" + Video_pic)
	fmt.Println("类型:" + Video_type_name)
	fmt.Println("年份:" + Video_year)
	fmt.Println("地区:" + Video_area)
	fmt.Println("提示信息:" + Video_remarks)
	fmt.Println("演员:" + Video_actor)
	fmt.Println("导演:" + Video_director)
	fmt.Println("简介:" + Video_content)
	fmt.Println()
	fmt.Println("播放源:" + strings.ReplaceAll(Video_play_from, "$$$", " "))
	fmt.Println()

	play_from := strings.Split(Video_play_from, "$$$")
	urlstr := strings.Split(Video_play_url, "$$$")
	for i := 0; i < len(play_from); i++ {
		urls := strings.Split(urlstr[i], "#")
		for j := 0; j < len(urls); j++ {
			if i == 0 && j == 0 {
				res = urls[j]
			}
			u := strings.Split(urls[j], "$")
			fmt.Println(play_from[i] + "--->" + u[0] + "[" + u[1] + "]")
		}
		fmt.Println()
	}
	return res

}
func CheckplayContent(id string, vm *otto.Otto) {

	fmt.Print("==========playerContent:=======\n\n")
	result, err := vm.Run("playerContent(\"" + id + "\")")

	if err != nil {
		fmt.Println("运行playerContent时出错！")
		fmt.Println(err)

		os.Exit(0)
	}
	resjson, err := result.ToString()

	if resjson == "undefined" {

		fmt.Println("playerContent返回为undefined,没有返回值")
		os.Exit(0)
	}
	if resjson == "" {
		fmt.Println("playerContent返回为空")
		os.Exit(0)
	}

	if err != nil {
		fmt.Println("运行playerContent后转换string时出错！")
		fmt.Println(err)
		os.Exit(0)
	}
	fmt.Println(resjson)
	fmt.Println()
	//	header := gjson.Get(resjson, "header").String()
	parse := gjson.Get(resjson, "parse").Int()
	playurl := gjson.Get(resjson, "playurl").String()
	//	fmt.Println("请求头:"+header)
	if parse == 0 {
		fmt.Println("播放方式--->直连")
	} else if parse == 1 {
		fmt.Println("播放方式为--->嗅探")
	} else {
		fmt.Println("播放方式为--->解析")

	}

	fmt.Println("播放地址为--->" + playurl)
}
func main() {
	//初始化json,vm
	vm := Jsoninit()
	//===============HomeContent=================
	resHomeContent := CheckHomeContent(vm)
	//测试分类的下标,电影，电视剧.....,可以是0,1,2...
	//	CheckHomeNum := 0
	CheckHomeNum := 2
	CheckHomeVideoName := gjson.Get(resHomeContent, "class").Array()[CheckHomeNum].Get("type_name").String()
	CheckHomeVideoId := gjson.Get(resHomeContent, "class").Array()[CheckHomeNum].Get("type_id").String()
	fmt.Print("你要测试的分类是:" + CheckHomeVideoName + "[" + CheckHomeVideoId + "]\n\n")
	//===============categoryContent=============
	//type_id
	tid := CheckHomeVideoId
	//页码
	pg := 1
	resCategoryContent := CheckCategoryContent(tid, pg, vm)
	//	fmt.Println(resCategoryContent)
	//测试视频的下标
	CategoryNum := 5
	CategoryName := resCategoryContent[CategoryNum][:strings.Index(resCategoryContent[CategoryNum], "#")]
	CategoryId := resCategoryContent[CategoryNum][strings.Index(resCategoryContent[CategoryNum], "#")+1:]
	fmt.Println("\n你要测试的视频是:" + CategoryName + "[" + CategoryId + "]")
	//===============detailContent=============
	resDetail := CheckdetailContent(CategoryId, vm)
	rdetail := strings.Split(resDetail, "$")
	fmt.Println("你要测试的地址是--->" + rdetail[0] + "[" + rdetail[1] + "]")

	//===============playContent=============
	CheckplayContent(rdetail[1], vm)
}
