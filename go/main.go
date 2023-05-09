package main

import (
	"C"

	"github.com/robertkrimen/otto"
)
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
)

// func C.CString(string) *C.char              //go字符串转化为char*
// func C.CBytes([]byte) unsafe.Pointer        // go 切片转化为指针
// func C.GoString(*C.char) string             //C字符串 转化为 go字符串
// func C.GoStringN(*C.char, C.int) string
// func C.GoBytes(unsafe.Pointer, C.int) []byte

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
		resp, _ := client.Do(requset)
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

//export jsFunc
func jsFunc(c_jsStr *C.char) {
	jsStr := C.GoString(c_jsStr)
	vm := JsInit()
	_, err := vm.Run(jsStr)
	if err != nil {
		fmt.Println(err.Error())
		vm.Set("result", "")
	}
}

//export homeContent
func homeContent(c_jsStr *C.char) *C.char {
	jsStr := C.GoString(c_jsStr)
	vm := JsInit()
	_, err := vm.Run(jsStr)
	if err != nil {
		fmt.Println(err.Error())
		vm.Set("result", "")
	}
	result, _ := vm.Get("result")
	//fmt.Println(result)

	return C.CString(result.String())
}

//export categoryContent
func categoryContent(c_tid *C.char, c_pg C.int, c_jsStr *C.char) *C.char {
	jsStr := C.GoString(c_jsStr)
	tid := C.GoString(c_tid)
	pg := int(c_pg)
	vm := JsInit()
	vm.Set("type_id", tid)
	vm.Set("page", pg)
	_, err := vm.Run(jsStr)
	if err != nil {
		fmt.Println(err.Error())
		vm.Set("result", "")
	}
	result, _ := vm.Get("result")
	return C.CString(result.String())
}

//export detailContent
func detailContent(c_ids *C.char, c_jsStr *C.char) *C.char {
	jsStr := C.GoString(c_jsStr)
	vm := JsInit()
	_, err := vm.Run(jsStr)
	if err != nil {
		fmt.Println(err.Error())
		vm.Set("result", "")
	}
	result, _ := vm.Get("result")
	return C.CString(result.String())
}

//export searchContent
func searchContent(c_key *C.char, c_jsStr *C.char) *C.char {
	jsStr := C.GoString(c_jsStr)
	vm := JsInit()
	_, err := vm.Run(jsStr)
	if err != nil {
		fmt.Println(err.Error())
		vm.Set("result", "")
	}
	result, _ := vm.Get("result")
	return C.CString(result.String())
}

//export playerContent
func playerContent(c_flag *C.char, c_id *C.char, c_vipFlags *C.char, c_jsStr *C.char) *C.char {
	jsStr := C.GoString(c_jsStr)
	vm := JsInit()
	_, err := vm.Run(jsStr)
	if err != nil {
		fmt.Println(err.Error())
		vm.Set("result", "")
	}
	result, _ := vm.Get("result")
	return C.CString(result.String())
}

//export downLoadIMG
func downLoadIMG(c_url *C.char, c_path *C.char) {
	pic := C.GoString(c_path)
	url := C.GoString(c_url)
	v, err := http.Get(url)
	if err != nil {
		fmt.Println("下载文件失败:", err)
		return
	}
	defer v.Body.Close()
	content, _ := ioutil.ReadAll(v.Body)
	err = ioutil.WriteFile(pic, content, 0666)
	if err != nil {
		fmt.Println("保存文件失败!", err)
		return
	}
}

//export jsonGetValue
func jsonGetValue(c_path *C.char, c_key *C.char) *C.char {
	path := C.GoString(c_path)
	key := C.GoString(c_key)
	//fmt.Println("路径：" + path)
	//fmt.Println("key:" + key)
	content, err := ioutil.ReadFile(path)
	if err != nil {
		fmt.Println("读取[" + path + "]文件失败!请检查!!!")
	}
	str := string(content)
	res := gjson.Get(str, key)
	//fmt.Println(res.String())
	return C.CString(res.String())
}

//export checkFile
func checkFile(c_filePath *C.char) bool {
	filePath := C.GoString(c_filePath)
	_, err := os.Stat(filePath)
	if os.IsNotExist(err) {
		count := strings.Count(filePath, "/")
		if count > 1 {
			dir := filePath[:strings.LastIndex(filePath, "/")]
			//fmt.Println(dir)
			os.MkdirAll(dir, 0777)
		}
		os.Create(filePath)

		return false
	}
	return true

}

//export checkSource
func checkSource(c_filePath *C.char) {
	filePath := C.GoString(c_filePath)
	if !checkFile(C.CString(filePath)) {

		str := `{"111": {"sourceId": "111","jsFunc": "","homeContent": "","categoryContent": "","detailContent": "","searchContent": "","playerContent": ""}}
`
		ioutil.WriteFile(filePath, []byte(str), 0666)
	}
}

//export test
func test() {
	fmt.Println("外部链接库，链接成功！")
}

//export teststr
func teststr(c_str *C.char) {
	str := C.GoString(c_str)
	fmt.Print("链接库测试函数：")
	fmt.Println(str)

}
func main() {
}
