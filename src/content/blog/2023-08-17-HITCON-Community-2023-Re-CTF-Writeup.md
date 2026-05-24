---
layout: post
title: HITCON Community 2023 - Re:CTF Writeup
description:  考古題
date: 2023-08-17 00:00:00 +0800
categories: Writeup CTF
tags: Writeup CTF
---

## misc
### 1. unreadable
#### 題目
![image](https://hackmd.io/_uploads/rkr2n8oSA.png)


#### 解題
嘗試了各種不同工具，像是 BinWalk, file, hexdump
最後使用 xxd 看到文字排列成的圖像
圖像就是 flag 的字串
還嘗試了 hexedit 也可以成功的
![image](https://hackmd.io/_uploads/HkRh2LsHA.png)

>頭要轉一下


### 2. fbi-warning
#### 題目
![image](https://hackmd.io/_uploads/SyIanIirR.png)


#### 解題
給了一個網站，介面應該是日本的 2ch 論壇
題目要我們找到使用者 Ωrange 的 IP 位置，並且提示了 ip 是 217.x.x.x

進去網站後可以看到，使用者 Ωrange 發布了一個回文，並且附帶一張圖片
![image](https://hackmd.io/_uploads/S106hIiBA.png)


推文中給了一個網址 [https://tinyurl.com/fbi-hack](https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley)
點進去後發現並沒有有用的資訊...
![image](https://hackmd.io/_uploads/S1ERn8iSC.png)


原本以為是 injection 類型的題目
在網頁亂點一通後，基本上功能都是死的
最後在網頁原始碼發現
```
<!-- GazouBBS v3.0 --><!-- ふたば改0.8 -->
```
爬文後發現原始碼有公開：https://hackmd.io/LsRB6pWMQKeGvv6HRb8Xk：

ID生成方式是將 ip 串 IDSEED 串 日期 後
使用 "id" 這個字串作為 slat 做 crypt 加密
最後取後 8 碼來當 ID
```php=
define("IDSEED", 'idの種');

if(DISP_ID){
if($email&&DISP_ID==1){
  $now .= " ID:???";
}else{
  $now.=" ID:".substr(crypt(md5($_SERVER["REMOTE_ADDR"].IDSEED.gmdate("Ymd", $time+9*60*60)),'id'),-8);
}
}
```

回推是不可能的，所以直接暴力解
因為題目有提示ip開頭為 217
所以就從 217.0.0.1 嘗試到 217.255.255.255
把每個結果拿去看發文者 ID:E98SXRsI 做比對
就可以抓出 ip 了
>前面一直認為 'idの種' 是伺服器那邊會隨便輸入一串字串，結果沒想到就是直接使用 'idの種' ...


### 3. EV3 Arm
#### 題目
![image](https://hackmd.io/_uploads/SkJ1pLirR.png)

#### 解題
題目給了一個 機器人寫字的影片 和 ev3arm.rbf 程式碼
影片中機器人寫出了 hitcon{ 影片就結束了
https://youtu.be/VNAVl6F1-7E

ev3arm.rbf 內則是控制馬達動作的程式碼
```=
ev3arm
 ├─ StartBlock
 ├─ MediumMotor.Time MotorPort: (馬達A) | Speed: -35 | Seconds: 0.55 | Brake_At_End: Brake
 ├─ MediumMotor.Degrees MotorPort: D | Speed: -10 | Degrees: 90 | Brake_At_End: Brake
 ├─ MediumMotor.Time MotorPort: A | Speed: 35 | Seconds: 0.4 | Brake_At_End: Brake
 ├─ MediumMotor.Degrees MotorPort: D | Speed: 10 | Degrees: 45 | Brake_At_End: Brake
 ├─ MediumMotor.Time MotorPort: A | Speed: -35 | Seconds: 0.55 | Brake_At_End: Brake
 ├─ Move.Degrees Ports: B+C | Steering: 0 | Speed: 20 | Degrees: 20 | Brake_At_End: Brake
 ├─ MediumMotor.Degrees MotorPort: D | Speed: -10 | Degrees: 45 | Brake_At_End: Brake
 ├─ MediumMotor.Time MotorPort: A | Speed: 35 | Seconds: 0.4 | Brake_At_End: Brake
 ├─ MediumMotor.Degrees MotorPort: D | Speed: 10 | Degrees: 90 | Brake_At_End: Brake
 ├─ Move.Degrees Ports: B+C | Steering: 0 | Speed: 30 | Degrees: 15 | Brake_At_End: Brake
 ├─ MediumMotor.Degrees MotorPort: D | Speed: -10 | Degrees: 30 | Brake_At_End: Brake
 ├─ MediumMotor.Time MotorPort: A | Speed: -35 | Seconds: 0.55 | Brake_At_End: Brake
 ├─ MediumMotor.Time MotorPort: A | Speed: 35 | Seconds: 0.4 | Brake_At_End: Brake
 ...
 ...
 ...
```

接著根據影片的動作去反推出每個馬達的代號
用 python 逐行提取用了哪個馬達和移動多少
我主要分成了六個動作
1. 筆往上(馬達A) (不寫字)
2. 筆往下(馬達A) (寫字)
4. 左移(馬達D)
5. 右移(馬達D)
6. 上移(馬達B+C)
7. 下移(馬達B+C)

接著用模擬書寫的功能就可以得到答案，雖然程式沒寫得很完整，但還是能看出 flag 內容XD
![image](https://hackmd.io/_uploads/SJL1TIoSA.png)



## web
### 1. papapa
#### 題目
![image](https://hackmd.io/_uploads/B1RyaLsrA.png)


#### 解題
題目只給了一個網址
![image](https://hackmd.io/_uploads/HkFxTLoB0.png)

原因是憑證無效
![image](https://hackmd.io/_uploads/HkkWpUjBR.png)

查看憑證內容
發現擁有者是
very-secret-area-for-ctf.chal.kikihost.xyz
![image](https://hackmd.io/_uploads/SyLWaIsrR.png)

直接修改網址看看能不能進，發現進不去
去查了一下 dns 發現也沒有對應的內容
應該是內部私人 dns 之類的
![image](https://hackmd.io/_uploads/Byh-68ir0.png)

使用 burp 改請求 host
![image](https://hackmd.io/_uploads/HyWMaIiSR.png)

順利噴出 flag
![image](https://hackmd.io/_uploads/rkLzpIsHR.png)


### 2. yeeclass
#### 題目
![image](https://hackmd.io/_uploads/HkozpLor0.png)


#### 解題
>當黑箱解的時候只解到把 cookie 砍掉進入 flag 頁面可以看到 flag 上傳者和詳細的上傳時間

進去網頁可以看到是一個繳作業的系統
不過都沒其他按鈕，所以先試著登入看看
帳號密碼亂打就可以進了，不過用同個帳號再登入就要使用剛剛亂打的密碼
所以這邊的登入是，如果帳號不存在就直接註冊一個
![image](https://hackmd.io/_uploads/HJ7OCIoS0.png)

登入之後出現了繳交和上傳作業的按鈕，不過 Flag 的作業已經被關閉了
沒按鈕可點
![image](https://hackmd.io/_uploads/HkYVAUsSA.png)

先去 Public Homework，發現網址有 ?homeworkid=2
![image](https://hackmd.io/_uploads/H1zVC8sH0.png)

試試看把 ?homeworkid=2 改成 ?homeworkid=1
發現權限不足，表示這頁面應該是 Flag 沒錯了
![image](https://hackmd.io/_uploads/r1sX0IsS0.png)

看看目前的 cookie
有 PHPSESSID 和 session
查資料後得知 PHPSESSID 是一個唯一值
伺服器會根據這個 ID 在伺服器內找資料
所以更改這個的意義不大
```
[
{
    "domain": "rectf.hitcon2023.online",
    "hostOnly": true,
    "httpOnly": false,
    "name": "PHPSESSID",
    "path": "/",
    "sameSite": "unspecified",
    "secure": false,
    "session": true,
    "storeId": "0",
    "value": "49d29fa6ee8451e390335c91487aeb67",
    "id": 1
},
{
    "domain": "rectf.hitcon2023.online",
    "expirationDate": 1692669998.959451,
    "hostOnly": true,
    "httpOnly": true,
    "name": "session",
    "path": "/",
    "sameSite": "lax",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "9d9eeef6-215a-457c-a960-2da4197305b2.fsR3JwH7egQWEOYt4tHDE0fcgwQ",
    "id": 2
}
]
```

不過在好奇心的驅使下，我嘗試把 cookie 刪除後重新整理頁面
發現順利的進入的 Flag 頁面
>拿到 SourceCode 後去看了
這時可以看到有一個名為 Flag 的作業
顯示了上傳者和異常詳細的上傳時間
![image](https://hackmd.io/_uploads/Sy6GCUjSR.png)

根據其他上傳頁面，可以看到上傳後作業的網址是一個 hash
所以如果我們知道時間，應該可以直接推測出上傳後的檔案名稱
![image](https://hackmd.io/_uploads/B1dG0UsHC.png)


黑箱解的時候卡在這，我嘗試使用自己上傳作業的時間
去做各種不同的 hash 來比對這網站是使用哪種
但都比不出來

有了 SourceCode 之後直接衝去看 hash 的部分
發現是使用了 uniqid 這個函數生成字串
它會使用微秒的部分去生成一組字串
並且這個字串的開頭會是 username_
接著把這個字串拿去做 sha1

```
$id = uniqid($_SESSION["username"]."_");
            $submit_query = $pdo->prepare("INSERT INTO submission (`hash`, userid, homeworkid, content) VALUES (?, ?, ?, ?)");
            $submit_query->execute(array(
                hash("sha1", $id),
                $_SESSION["userid"],
                $_POST["homeworkid"],
                $_POST["content"]
            ));
```

所以現在只要用上傳的時間
2023-08-16 04:09:35.584096
去做uniqid("flagholder_",)之後
拿去做 sha1 沒意外的話就可以得到 flag 的頁面了
```php!
$username = "flagholder_";
$id = uniqid("username",);
$myans = hash("sha1", $id)
```

先用自己上傳的時間和hash在本地端嘗試
```
奇怪我覺得我程式沒寫錯，弄了一個晚上炸不出答案
```
>最後發現程式邏輯沒錯，但時區錯了

確認程式沒問題後寫成腳本去戳網站
寫成只要 http code 200 就噴網址出來
最後拿到 flag


### 4. babyfirst(卡死，暫時放棄)
#### 題目
![image](https://hackmd.io/_uploads/Hk5WRLoBA.png)


#### 解題
題目給了一個網站，進去看到內容可以發現，這個網站會根據 ip 來分配 sandbox
```php=
<?php
    highlight_file(__FILE__);

    $dir = './sandbox/' . $_SERVER['REMOTE_ADDR'];echo 'Your sandbox:'.$dir.'/';
    if ( !file_exists($dir) )
        mkdir($dir,0777,true);
    chdir($dir);

    $args = $_GET['args'];
    for ( $i=0; $i<count($args); $i++ ){
        if ( !preg_match('/^\w+$/', $args[$i]) )
            exit();
    }
    exec("/bin/orange " . implode(" ", $args));
?>
Your sandbox:./sandbox/60.250.162.9/
Warning: implode(): Invalid arguments passed in /var/www/html/index.php on line 14
```

進去自己的空間看看，啥都沒有，返回上一層看有沒有其他東西
![image](https://hackmd.io/_uploads/BJNWRLiHA.png)


恩好
![image](https://hackmd.io/_uploads/SykW0Isr0.png)


總之先回到首頁看程式碼，可以看到
```php
$_GET['args']
```
表示我們是可以帶入參數的
但由於正規表達是: '/^\w+$/'
只能輸入大小寫英文字母和底線

想嘗試用 wget 載腳本過去
但網址符號幾乎都被擋了

忽然想到 AIS3 某堂課有講到 可以把 ip 變成純數字
之後可以試試看這個方向

## 一些紀錄
### 活動內容
[HITCON Community 2023 - CTF 回來了，讓我們歡迎「Re:CTF 活動」！](https://blog.hitcon.org/2023/08/blog-post.html)
https://hackmd.io/@HITCON/ReCTF

日期：8月 11日 21:00 (GMT+8)  - 8月 18日
平台開放時間：預計至 8 月 25 日

### 題目
![image](https://hackmd.io/_uploads/rkNlCLoBA.png)


### 大佬們的分數
![image](https://hackmd.io/_uploads/rkAJC8sBA.png)


