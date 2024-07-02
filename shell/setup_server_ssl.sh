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

# 添加或更新环境变量到.acme.sh/acme.sh.env文件
ENV_FILE="$HOME/.acme.sh/acme.sh.env"
grep -q '^export CF_Key=' $ENV_FILE && sed -i "s/^export CF_Key=.*/export CF_Key=\"$CF_Key\"/" $ENV_FILE || echo "export CF_Key=\"$CF_Key\"" >> $ENV_FILE
grep -q '^export CF_Email=' $ENV_FILE && sed -i "s/^export CF_Email=.*/export CF_Email=\"$CF_Email\"/" $ENV_FILE || echo "export CF_Email=\"$CF_Email\"" >> $ENV_FILE

# 直接导出环境变量到当前会话
export CF_Key="$CF_Key"
export CF_Email="$CF_Email"

# 设置acme并申请证书
~/.acme.sh/acme.sh --upgrade --auto-upgrade
~/.acme.sh/acme.sh --set-default-ca --server letsencrypt
~/.acme.sh/acme.sh --issue -d "$DONAMEFRONT.randallanjie.net" -d "$DONAMEFRONT-cdn.randallanjie.net" --dns dns_cf --dnssleep

echo "Setup complete for $DONAMEFRONT.randallanjie.net and $DONAMEFRONT-cdn.randallanjie.net"
