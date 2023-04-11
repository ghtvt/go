var siteUrl = "http://ht.grelighting.cn/api.php";
var fakeDevice = "";
var tokenKey = "";
//随机字符串已完成

function getStrBytes(str) {
  var len, c;
  len = str.length;
  var bytes = [];
  for (var i = 0; i < len; i++) {
    c = str.charCodeAt(i);
    if (c >= 0x010000 && c <= 0x10ffff) {
      bytes.push(((c >> 18) & 0x07) | 0xf0);
      bytes.push(((c >> 12) & 0x3f) | 0x80);
      bytes.push(((c >> 6) & 0x3f) | 0x80);
      bytes.push((c & 0x3f) | 0x80);
    } else if (c >= 0x000800 && c <= 0x00ffff) {
      bytes.push(((c >> 12) & 0x0f) | 0xe0);
      bytes.push(((c >> 6) & 0x3f) | 0x80);
      bytes.push((c & 0x3f) | 0x80);
    } else if (c >= 0x000080 && c <= 0x0007ff) {
      bytes.push(((c >> 6) & 0x1f) | 0xc0);
      bytes.push((c & 0x3f) | 0x80);
    } else {
      bytes.push(c & 0xff);
    }
  }
  for (var j = 0; j < bytes.length; j++) {
    if (bytes[j] > 127) {
      bytes[j] = bytes[j] - 256;
    }
  }
  return bytes;
}
function randomString(length) {
  var res = "";
  var str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456";
  for (var i = 0; i < length; i++) {
    var num = Math.floor(go_random() * str.length);

    res = res + str[num];
  }
  return res;
}
function randomMACAddress() {
  var res = "";
  var bt = "0987654321ABCDEF";
  for (var i = 0; i < 12; i++) {
    var num = Math.floor(go_random() * bt.length);

    res = res + bt[num];
  }

  return res;
}

function fakeDid() {
  var i = "";
  var f = "";
  var d = "unknown";
  //d需要测试
  var e =
    "Readmi/alioth/alioth:11/RKQ1.200826.002/V12.5.19.0.RKHCNXM:user/release-keys";
  //e也需要测试
  var res =
    "" +
    i +
    "||" +
    f +
    "||" +
    randomMACAddress() +
    "||" +
    randomString(16) +
    "||" +
    d +
    "||" +
    e;
  return res;
}
function aa(str) {
  var bytes = [];
  var bArr = [];
  bytes = getStrBytes(str);

  for (var i9 = 0; i9 < 333; i9++) {
    if (i9 > 127) {
      bArr[i9] = i9 - 256;
    } else {
      bArr[i9] = i9;
    }
  }
  if (bytes.length == 0) {
    return null;
  }
  var i10 = 0;
  var i11 = 0;
  for (var i12 = 0; i12 < 333; i12++) {
    i11 = ((bytes[i10] & 255) + (bArr[i12] & 255) + i11) % 333;
    var b = bArr[i12];
    bArr[i12] = bArr[i11];
    bArr[i11] = b;
    i10 = (i10 + 1) % bytes.length;
  }
  return bArr;
}
//bArr是字节数组，str是字符串
function b(bArr, str) {
  var a = aa(str);
  var bArr2 = [];
  var i9 = 0;
  var i10 = 0;
  for (var i11 = 0; i11 < bArr.length; i11++) {
    i9 = (i9 + 1) % 333;
    i10 = ((a[i9] & 255) + i10) % 333;
    var b = a[i9];
    a[i9] = a[i10];
    a[i10] = b;
    bArr2[i11] = a[((a[i9] & 255) + (a[i10] & 255)) % 333] ^ bArr[i11];
  }
  return bArr2;
}
var tokenKey = null;
console.log("获得fakeDevice");
var fakeDevice = fakeDid();
//测试fake
//
fakeDevice =
  "||||B94264889291||I4hppZ10YEDPCUQO||unknown||Readmi/alioth/alioth:11/RKQ1.200826.002/V12.5.19.0.RKHCNXM:user/release-keys";
console.log(fakeDevice);
console.log("获的tokenkey");
tokenKey == null ? (tokenKey = "XPINGGUO") : tokenKey;
console.log(tokenKey);
console.log("获的fakeDevuce字节数组");
var zj_fakeDevice = getStrBytes(fakeDevice);
console.log(zj_fakeDevice);
console.log("获的b函数返回的字节数组");
console.log(b(zj_fakeDevice, tokenKey));
