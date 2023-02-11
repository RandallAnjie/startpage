<?php
$str = file_get_contents('http://192.168.10.16:8000/accounts/login/?next=/');   // 从内网获取信息
$array = get_headers($str,1);
if(preg_match('/200/',$array[0])){
    $url = 'http://192.168.10.16:8000/';
}else{
    $url = 'http://randallseafile.vaiwan.cn/'; // 使用默认
}
header("Location: {$url}");    // 跳转至目标图像