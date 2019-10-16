/**
 * RFC4122 version 4 
 * create 32 uuid
 */
Mil.uuidv4 = function() {
  return 'xxxxxxxxxxxxxxxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * get url parameter
 * @param {url address} urlStr
 * @return Object
 */
Mil.getUrlParams = function (urlStr) {
  let urlSearch = urlStr ? (urlStr.indexOf("?") ? urlStr.substr(urlStr.indexOf("?")) : '') : ''
  let url = urlSearch || location.search; //获取url中"?"符后的字串 
  let theRequest = new Object();
  if (url.indexOf("?") != -1) {
    let str = url.substr(1);
    let strs = str.split("&");
    for (let i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = decodeURIComponent((strs[i].split("=")[1]));
    }
  }
  return theRequest;
}

/**
 * 根据身份证获取年龄
 * @param {身份证号码} idCard 
 * @return String
 */
Mil.getAge = function (idCard) {
  if (idCard) {
    let birthday = idCard.substr(6, 4) + '/' + Number(idCard.substr(10, 2)) + '/' + Number(idCard.substr(12, 2));
    let beginDay = new Date(birthday);
    let endDay = new Date()
    let ageDiff = endDay.getFullYear() - beginDay.getFullYear()
    if (ageDiff > 0) {
      if (endDay.getMonth() - beginDay.getMonth() === 0) {
        if (endDay.getDate() - beginDay.getDate() < 0) {
          ageDiff = ageDiff - 1
        }
      } else {
        if (endDay.getMonth() - beginDay.getMonth() < 0) {
          ageDiff = ageDiff - 1
        }
      }
    }
    return ageDiff
  } else {
    return ''
  }
}
/**
 * 根据身份证获取性别
 * @param {身份证号码} idCard
 * @return String
 */
Mil.getSex = function (idCard) {
  if (idCard) {
    let sexNumber = Number(idCard.substr(16, 1))
    if (sexNumber % 2 === 0) {
      return '女'
    } else {
      return '男'
    }
  } else {
    return ''
  }
}
/**
 * 设置浏览器的cookie
 * @param {cookie key}} c_name 
 * @param {cookie value} value 
 * @param {expiredays} expiredays
 */
Mil.setCookie = function(c_name, value, expiredays) {
  let exdate = new Date()
  exdate.setDate(exdate.getDate() + expiredays)
  if (expiredays < 0) {
    document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString()) + ";path=/insurance-web"
    // document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString()) + ";domain=10.200.13.35;path=/insurance-web/order"
  } else {
    document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString()) + ";path=/insurance-web"
  }
}
/**
 * 获取浏览器的cookie
 * @param {cookie key name}} c_name 
 */
Mil.getCookie = function (c_name) {
  if (document.cookie.length > 0) {
    let c_start = document.cookie.indexOf(c_name + "=")
    if (c_start != -1) {
      c_start = c_start + c_name.length + 1
      let c_end = document.cookie.indexOf(";", c_start)
      if (c_end == -1) c_end = document.cookie.length
      return unescape(document.cookie.substring(c_start, c_end))
    }
  }
  return ""
}
/**
 * 转中文数字
 * @param {number} money 
 */
Mil.changeMoneyToChinese = function (money) {
  var cnNums = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"); //汉字的数字  
  var cnIntRadice = new Array("", "拾", "佰", "仟"); //基本单位  
  var cnIntUnits = new Array("", "万", "亿", "兆"); //对应整数部分扩展单位  
  var cnDecUnits = new Array("角", "分", "毫", "厘"); //对应小数部分单位  
  //var cnInteger = "整"; //整数金额时后面跟的字符  
  var cnIntLast = "元"; //整型完以后的单位  
  var maxNum = 999999999999999.9999; //最大处理的数字  

  var IntegerNum; //金额整数部分  
  var DecimalNum; //金额小数部分  
  var ChineseStr = ""; //输出的中文金额字符串  
  var parts; //分离金额后用的数组，预定义  
  if (money == "") {
    return "";
  }
  money = parseFloat(money);
  if (money >= maxNum) {
    $.alert('超出最大处理数字');
    return "";
  }
  if (money == 0) {
    //ChineseStr = cnNums[0]+cnIntLast+cnInteger;
    ChineseStr = cnNums[0] + cnIntLast
    //document.getElementById("show").value=ChineseStr;
    return ChineseStr;
  }
  money = money.toString(); //转换为字符串
  if (money.indexOf(".") == -1) {
    IntegerNum = money;
    DecimalNum = '';
  } else {
    parts = money.split(".");
    IntegerNum = parts[0];
    DecimalNum = parts[1].substr(0, 4);
  }
  if (parseInt(IntegerNum, 10) > 0) {//获取整型部分转换
    let zeroCount = 0;
    let IntLen = IntegerNum.length;
    for (let i = 0; i < IntLen; i++) {
      let n = IntegerNum.substr(i, 1);
      let p = IntLen - i - 1;
      let q = p / 4;
      let m = p % 4;
      if (n == "0") {
        zeroCount++;
      } else {
        if (zeroCount > 0) {
          ChineseStr += cnNums[0];
        }
        zeroCount = 0; //归零
        ChineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
      }
      if (m == 0 && zeroCount < 4) {
        ChineseStr += cnIntUnits[q];
      }
    }
    ChineseStr += cnIntLast;
    //整型部分处理完毕
  }
  if (DecimalNum != '') {//小数部分
    let decLen = DecimalNum.length;
    for (let i = 0; i < decLen; i++) {
      let n = DecimalNum.substr(i, 1);
      if (n != '0') {
        ChineseStr += cnNums[Number(n)] + cnDecUnits[i];
      }
    }
  }
  if (ChineseStr == '') {
    //ChineseStr += cnNums[0]+cnIntLast+cnInteger;  
    ChineseStr += cnNums[0] + cnIntLast;
  }/* else if( DecimalNum == '' ){ 
    ChineseStr += cnInteger; 
    ChineseStr += cnInteger; 
  } */
  return ChineseStr;
}
