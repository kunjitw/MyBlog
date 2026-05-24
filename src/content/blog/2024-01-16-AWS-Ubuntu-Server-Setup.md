---
layout: post
title: 使用 AWS 架設免費 Ubuntu Linux Server 
description: 免費的 Linux Server
date: 2024-01-16 14:24:00 +0800
categories: 實作筆記 AWS
tags: AWS 環境設置 Ubuntu Linux 實作
---

## 建立步驟
### 註冊
https://ap-southeast-2.console.aws.amazon.com/

### 綁信用卡
綁就對了

### 進入 EC2 頁面
https://ap-southeast-2.console.aws.amazon.com/ec2/

### 建立執行個體
![image](https://hackmd.io/_uploads/H1j2cLjr0.png)

### 幫機器取名字
亂取 爽就好
![image](https://hackmd.io/_uploads/HkCp5LsrR.png)

### 選擇作業系統
我是安裝 Ubuntu Server 22.04 64位元的
![image](https://hackmd.io/_uploads/BJKA5UiHR.png)


### 選擇硬體設備
不用動，選免費的就好
![image](https://hackmd.io/_uploads/r1Q1iIsrA.png)

### 設定登入金鑰
- 選擇建立新的金鑰對
    ![image](https://hackmd.io/_uploads/HJglsLsS0.png)

- 設定金鑰檔案
    - 金鑰對名稱：（爽就好）
    - 金鑰對類型：RSA
    - 金鑰檔案格式：.pem
    ![image](https://hackmd.io/_uploads/rJbZs8jH0.png)

    
- 建立後會下載一個 .pem 檔案，之後 ssh 連線會用到，要存好
    ![image](https://hackmd.io/_uploads/r1_bsIsSA.png)


### 設定防火牆
- Allow SSH traffic from：0.0.0.0/0
    - 表示任何 IP 都可以使用 ssh 來對這台主機連線
- 允許來自網際網路的 HTTPS 和 HTTP 流量
    - 就是開放 80 和 443 port 可以進入

![image](https://hackmd.io/_uploads/Sy0Ws8jBC.png)

### 硬碟容量設置
沒動，8G 很夠用了
![image](https://hackmd.io/_uploads/HyYfoLoS0.png)

### 建立執行個體
上面都設定完成後，選擇啟動執行個體
![image](https://hackmd.io/_uploads/rJZmsLiH0.png)

## 使用機器
### 等待機器建立完成
啟動完成會跑出綠色的提示，然後選擇 連線至執行個體
![image](https://hackmd.io/_uploads/BJlVoLirA.png)

### ssh 連線
1. 選擇 SSH 用戶端
2. cd 到剛剛下載的 .pem 目錄
3. 使用命令 chmod 400 給金鑰檔案權限（直接複製他給的就好，他都幫你自動打好了）
4. 直接複製範例的 ssh 指令執行
![image](https://hackmd.io/_uploads/Hy7rj8oBA.png)
5. 成功連到會問你是否確定要連線，打 yes 後按 Enter
![image](https://hackmd.io/_uploads/SJ2BiIor0.png)
6. 成功連線會看到類似這樣的畫面
![image](https://hackmd.io/_uploads/rJQLi8iBR.png)


### 更新系統、安裝程式
1. 取得更新資訊
    ```shell=
    sudo apt update
    ```
2. 安裝更新
    ```shell=
    sudo apt upgrade
    ```
3. 裝一些基本工具（選自己想裝的就好）
    - nmap
        ```shell=
        sudo snap install nmap
        ```
    - dirsearch
        ```shell=
        sudo apt install dirsearch
        ```
    - dirb
        ```shell=
        sudo apt install dirb
        ```
    - sqlmap
        ```shell=
        sudo snap install sqlmap
        ```
    - sstimap
        ```shell=
        git clone https://github.com/vladko312/SSTImap.git
        ```
    - githack
        ```shell=
        git clone https://github.com/lijiejie/GitHack.git
        ```