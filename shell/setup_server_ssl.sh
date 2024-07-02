#!/bin/bash

# 检查是否提供了必要的参数
if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ]; then
  echo "Usage: $0 <DONAMEFRONT> <CF_Key> <CF_Email>"
  exit 1
fi

# 变量
DONAMEFRONT="$1"
CF_Key="$2"
CF_Email="$3"

# 更新系统并安装必要的软件包
sudo apt update && sudo apt upgrade -y && sudo apt install vim wget curl net-tools socat -y

# 设置主机名
sudo hostnamectl set-hostname "$DONAMEFRONT.randallanjie.net"

# 运行acme脚本安装acme
curl https://get.acme.sh | sh -s email="$DONAMEFRONT@randallanjie.net"

# 添加环境变量到.acme.sh/acme.sh.env文件
echo "export CF_Key=\"$CF_Key\"" >> ~/.acme.sh/acme.sh.env
echo "export CF_Email=\"$CF_Email\"" >> ~/.acme.sh/acme.sh.env

# 刷新环境变量
source ~/.profile

# 设置acme并申请证书
~/.acme.sh/acme.sh --upgrade --auto-upgrade
~/.acme.sh/acme.sh --set-default-ca --server letsencrypt
~/.acme.sh/acme.sh --issue -d "$DONAMEFRONT.randallanjie.net" -d "$DONAMEFRONT-cdn.randallanjie.net" --dns dns_cf

echo "Setup complete for $DONAMEFRONT.randallanjie.net and $DONAMEFRONT-cdn.randallanjie.net"
