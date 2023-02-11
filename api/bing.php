<?php
$str = file_get_contents('http://cn.bing.com/HPImageArchive.aspx?idx=0&n=1');   // 从bing获取数据
 
if(preg_match('/<url>([^<]+)<\/url>/isU', $str, $matches)) { // 正则匹配抓取图片url
    $imgurl = 'http://cn.bing.com'.$matches[1];
} else {  // 如果由于某些原因，没抓取到图片地址
    $imgurl = 'http://startpage.zhuanjie.ltd/404.html'; // 使用默认的图像(默认图像链接可修改为自己的)
}
 
header("Location: {$imgurl}");    // 跳转至目标图像