#!/bin/bash

# 检查是否提供了公钥参数
if [ -z "$1" ]; then
  echo "Usage: $0 <ssh-public-key>"
  exit 1
fi

# 公钥变量
SSH_KEY="$1"

# 创建 .ssh 目录并设置权限
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# 将公钥添加到 authorized_keys 文件
echo "$SSH_KEY" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# 检查并配置sshd_config文件
SSHD_CONFIG="/etc/ssh/sshd_config"
if grep -q "^#PasswordAuthentication" $SSHD_CONFIG; then
    sudo sed -i 's/^#PasswordAuthentication.*/PasswordAuthentication no/' $SSHD_CONFIG
elif grep -q "^PasswordAuthentication" $SSHD_CONFIG; then
    sudo sed -i 's/^PasswordAuthentication.*/PasswordAuthentication no/' $SSHD_CONFIG
else
    echo "PasswordAuthentication no" | sudo tee -a $SSHD_CONFIG
fi

if grep -q "^#PermitRootLogin" $SSHD_CONFIG; then
    sudo sed -i 's/^#PermitRootLogin.*/PermitRootLogin prohibit-password/' $SSHD_CONFIG
elif grep -q "^PermitRootLogin" $SSHD_CONFIG; then
    sudo sed -i 's/^PermitRootLogin.*/PermitRootLogin prohibit-password/' $SSHD_CONFIG
else
    echo "PermitRootLogin prohibit-password" | sudo tee -a $SSHD_CONFIG
fi

# 重启ssh服务以应用更改
sudo systemctl restart sshd

echo "SSH key added and password login disabled."
