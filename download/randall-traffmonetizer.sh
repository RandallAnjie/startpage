#!/bin/bash
#
# @Author : 转接
# @Date : 23/02/01
#
#/*传入参数 traffmonetizer 中的 application token, 
# *在 https://app.traffmonetizer.com/dashboard 中获取
# */

get_arch=`uname  -a`

if [[ $get_arch =~ "x86_64" ]];then
    echo "ARM64机器"
    if [[ $get_arch =~ "ubuntu" ]];then
        echo "ubuntu系统"
        sudo apt-get update
        sudo apt install docker.io -y
    elif [[ $get_arch =~ "centos" ]];then
        echo "centos系统"
        yum -y update
        yum -y install docker
    else
        echo "未适配系统"
        exit 2
    fi
    echo "开始安装……请等待"
    if [[ -n $(docker ps -q -f "name=^ra-tm$") ]];then
        echo "存在同名镜像，执行删除"
        sudo docker stop ra-tm
        sudo docker rm ra-tm
    fi
    sudo docker run -d --name ra-tm traffmonetizer/cli start accept --token $1

elif [[ $get_arch =~ "aarch64" ]];then
    echo "ARM64机器"
    if [[ $get_arch =~ "ubuntu" ]];then
        echo "ubuntu系统"
        sudo apt-get update
        sudo apt install docker.io -y
    elif [[ $get_arch =~ "centos" ]];then
        echo "centos系统"
        yum -y update
        yum -y install docker
    else
        echo "未适配系统"
        exit 2
    fi
    echo "开始安装……请等待"
    if [[ -n $(docker ps -q -f "name=^ra-tm$") ]];then
        echo "存在同名镜像，执行删除"
        sudo docker stop ra-tm
        sudo docker rm ra-tm
    fi
    sudo docker run -d --name ra-tm traffmonetizer/cli:arm64v8 start accept --token $1
    
elif [[ $get_arch =~ "mips64" ]];then
    echo "this is mips64"
else
    echo "未知架构!!"
    exit 1
fi
exit 0
