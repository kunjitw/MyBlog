---
layout: post
title: Windows11 WSL2 conda 安裝與使用
description: 記錄了在 W11 設置 WSL2 安裝 conda 的過程
date: 2024-04-15 17:00:00 +0800
categories: 實作筆記 Windows
tags: WSL2 Windows Python Conda 環境設置 實作
---

## WSL2 前置
必須開啟 CPU 虛擬化

## WSL2 安裝
使用系統管理員打開 PowerShell，輸入指令
```
wsl --install
```
![image](https://hackmd.io/_uploads/S1BGtUiBA.png)

先重開機，然後找到 Ubuntu
![image](https://hackmd.io/_uploads/BJgmtLiB0.png)


會跳出一個視窗，接著會提示你建立一個使用者
![image](https://hackmd.io/_uploads/Byamt8iHC.png)


建立完成後就會直接進入系統了
![image](https://hackmd.io/_uploads/B1UVFIsSC.png)

測試一下密碼有沒有手殘設定錯
```
sudo su
```
![image](https://hackmd.io/_uploads/ryQIK8jSR.png)


密碼沒問題，順利進入 root，離開 root 模式
```
exit
```
![image](https://hackmd.io/_uploads/B1wwY8iHR.png)


更新Ubuntu
```
sudo apt update; sudo apt upgrade
```

確認顯卡驅動
```
nvidia-smi
```
![image](https://hackmd.io/_uploads/rJRPtIsrC.png)

## WSL2 Ubuntu 關機方法 
在 Ubuntu 輸入
```
exit
```

開啟另一個視窗輸入
```
wsl --shutdown
```

## WSL2 內 conda 安裝
```
wget https://repo.anaconda.com/archive/Anaconda3-2024.02-1-Linux-x86_64.sh

bash Anaconda3-2024.02-1-Linux-x86_64.sh

source ~/.bashrc
```

如果找不到指令，在 .bashrc 最下面加入你的 anaconda3/bin 路徑
```
nano ~/.bashrc
```
![image](https://hackmd.io/_uploads/H1VuYIjB0.png)

然後再執行一次
```
source ~/.bashrc
```