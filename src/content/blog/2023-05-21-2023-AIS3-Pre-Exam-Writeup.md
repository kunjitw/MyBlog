---
layout: post
title: 2023 AIS3 Pre-Exam Writeup
description: 人生第一場 CTF，瞭解到了通靈的重要
date: 2023-05-21 00:00:00 +0800
category: Writeup CTF
tags: AIS3 CTF
---

## Misc
### Welcome

第一個解出來的題目，題目是一個 pdf 檔，每一頁都是一個 flag 的字，直接一頁一頁看著手打出來就是 flag 了。

### Robot

連上伺服器後要在 90 秒內解開 30 題簡單的數學題，因為時間很充裕直接使用手解，解完之後就會跳出 flag 了，不過前面也是恍神，解了三次本地的檔案，所以沒拿到 flag，第四次才想起來要去抓伺服器的檔案來解…

![截圖 2024-06-16 凌晨3.39.23](https://hackmd.io/_uploads/SJuxAwoSR.png)


## Pwn
### Simply Pwn

在第三天解出來的題目，後面打到恍神，都已經 getshell 了還沒注意到，一直以為程式沒寫好，最後在喝葡萄汽水發呆的時候才發現到自己早就成功了。

用 IDA 打開後發現它 read 陣列的範圍超出了陣列本身的大小非常多，判斷這題是 overflow 的題目，並且有 shellcode 可以使用。

首先使用 GDB 找到 shellcode 進入點的記憶體位置，接著在使用者輸入後設置中斷點，並且故意輸入過多的字，觀察記憶體內容，直到輸入了 80 個 A 字母後發現成功蓋到了返回記憶體位置的值，所以可以知道 79 個可以完全塞爆前面，從第 80 個開始塞 shellcode 的記憶體位置就可以成功跳到 shellcode 了。

![截圖 2024-06-16 凌晨3.40.21](https://hackmd.io/_uploads/r1GNADsS0.png)

getshell 後 ls 發現 FLAG 檔案，使用 cat FLAG 得到 flag。

![截圖 2024-06-16 凌晨3.41.04](https://hackmd.io/_uploads/B1kDAvoS0.png)

## Web
### Login Panel

一開始知道 guest/guest 這組帳號密碼可以登入，先登入看看網站有哪些內容，登入後有一個 2FA 頁面，guest 輸入 9999999 就可以登入，來到 flag 頁面，不過這時被提示只有admin 能看到，接著嘗試使用 admin 用戶名登入，按照剛剛 guest 的帳號密碼邏輯，先嘗試了密碼 admin/admin ，沒意外的登入失敗，第一個就想到對密碼 SQL injection，使用了最基本的 'OR 1=1 *-- 就直接進去了，不過這時候卡在 2FA，但想到剛剛* guest  有進入看 flag 的頁面，就直接使用這個頁面的網址，成功拿到 flag。

## Reverse
### Simply Reverse

使用 IDA 打開後追到 ((unsigned __int8)((i ^ *(unsigned __int8 *)(i + a1)) << ((i ^ 9) & 3)) | (unsigned __int8)((i ^ *(unsigned __int8 *)(i + a1)) >> (8 - ((i ^ 9) & 3))))+ 8 這段用來驗證是否輸入正確的算法，輸入的文字會經過上面的運算後再和陣列比較，所以推測陣列內存放的是經過運算後加密的 flag ，並且可以從 IDA 中看出這個陣列的大小是 34 以及裡面存放的內容。

首先整理剛剛的算式

![image](https://hackmd.io/_uploads/Hk8_CwiBA.png)

接著使用 C 語言，從陣列第一個值開始一個一個嘗試，用 ascii 0~127 的範圍去試，把每一個 ascii 拿去做運算後和陣列的內容對比，如果對比的內容一致，就表示為原始文字，最後每個都比出來後就可以得到 flag。

```c
int main() {
    
    unsigned int anss[] = {
        0x8a, 0x50, 0x92, 0xc8, 0x06, 0x3d, 0x5b, 0x95,
        0xb6, 0x52, 0x1b, 0x35, 0x82, 0x5a, 0xea, 0xf8,
        0x94, 0x28, 0x72, 0xdd, 0xd4, 0x5d, 0xe3, 0x29,
        0xba, 0x58, 0x52, 0xa8, 0x64, 0x35, 0x81, 0xac,
        0x0a, 0x64
    };
    
    int numElements = sizeof(anss) / sizeof(anss[0]);
    unsigned int i = 0;
    
    for (unsigned int index = 0; index < numElements; index++){
        unsigned int ans = anss[index];
        printf("===========================index: %u\n", index);
        printf("===ans_hex = %X\n", ans);
        for (unsigned int myChar = 0; myChar <= 127; myChar++) {
            unsigned int a1, b1, c1, a2, b2, c2, result;
            
            a1 = i ^ myChar;
            b1 = (i ^ 9) & 3;
            c1 = (a1 << b1) & 0xFF;
            
            a2 = i ^ myChar;
            b2 = 8 - ((i ^ 9)& 3);
            c2 = a2 >> b2 ;
            //printf("a2: %u\n", c2);
            //printf("b2: %u\n", b2);
            //printf("c2: %u\n", c2);
            result = c1 | c2;
            result = (result + 8)  & 0xFF;
            if (result == ans) {
                printf("===Found myChar value: %u\n", myChar);
                printf("   Found myChar value: %c\n", myChar);
            }
        }
        i=i+1;
    }
}
```

## Crypto
### Fernet

題目給了兩個資訊，第一個是一支加密用的 pytonh 程式，輸入明文和密碼就可以獲得密文

第二個是一段加密後的訊息，可以推測這個加密後的訊息是由這支 python 程式產生的。

先照著程式碼中 encrypt 的方法，全部反過來做，寫出一個解密的方法，接著就剩下要如何在沒有 key 的狀況下解出這段密文，就在我找了大概 30 分鐘 “如何在沒有 key的情況下解開 Fernet 加密” 的時候，看著 Python 程式碼中的這一段leak_password = 'mysecretpassword'

忽然有一個念頭，該不會這就是 key 吧…

最後抱著試試看的心態跑了一下程式，flag 就出來了…

![image](https://hackmd.io/_uploads/rJf9RDoSR.png)
