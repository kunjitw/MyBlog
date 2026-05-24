---
layout: post
title: 透過 Github Page 使用 jekyll 架設免費的個人網站
description: 會寫 markdown 就可以架屬於自己的網站欸欸欸欸，還不用顧 Server
date: 2024-06-15 23:25:00 +0800
categories: 實作筆記 GitHub
tags: Web Github 環境設置 macOS 實作
published: true
---

## 取得模板 Chirpy
登入 GitHub 後\
https://github.com/cotes2020/chirpy-starter

選 Use this template -> Create a new repository\
![001](https://hackmd.io/_uploads/r1XCtIoH0.png)

Repository name 用 你的Github帳號.github.io\
像我的話就是 occultationtw.github.io\
然後如果你沒買 Github Pro 的話要選 Public\
最後 Create repository

![002](https://hackmd.io/_uploads/rJzJcUsHA.png)

到 Settings -> Pages -> Source\
選GitHub Actions
![截圖 2024-06-16 清晨5.47.52](https://hackmd.io/_uploads/rJb8nKjrA.png)


## 安裝環境（MacOS M 晶片）
首先安裝 Homebrew\
可以在下列網址取得安裝指令

https://brew.sh/zh-tw/
```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

安裝完成後會提示要執行兩個指令來設定環境\
（不要複製以下指令，每個人的指令會不一樣）
```
(echo; echo 'eval "$(/opt/homebrew/bin/brew shellenv)"') >> /Users/kunjili/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

確認設定成功
```
brew doctor
```

安裝 Ruby
```
brew install ruby
```

把 Ruby 加入環境，編輯 zshrc
```
sudo nano -e ~/.zshrc
```

在文件最後端加入以下內容後儲存
```
if [ -d "/opt/homebrew/opt/ruby/bin" ]; then
  export PATH=/opt/homebrew/opt/ruby/bin:$PATH
  export PATH=`gem environment gemdir`/bin:$PATH
fi
```

然後重整，確認版本
```
source ~/.zshrc
ruby -v
brew pin ruby #鎖定版本，不更新
```

更新 Gem\
安裝 Jekyll
```
sudo gem update --system
sudo gem install jekyll
```

## 編輯模板
### 拉檔案到自己電腦編輯
- 設置 GitHub SSH\
    這邊使用 SSH 的方式來和 GitHub 互動\
    需要的可以參考 [Github SSH 設置](https://occultationtw.github.io/posts/GitHub-SSH-Setup-Guide/)
    
- clone 專案並安裝套件
    ```
    git clone git@github.com:occultationtw/occultationtw.github.io.git
    cd occultationtw.github.io
    sudo bundle

    #如果你目前的系統不是linux，要執行下面這一行
    bundle lock --add-platform x86_64-linux 
    ```

- 在電腦上啟動測試網站（只有自己看得到）
    ```
    bundle exec jekyll s
    ```
    成功啟動後，使用瀏覽器開啟以下網址，可以看到網站
    
    http://127.0.0.1:4000


### 編輯網站基本資料：_config.yml
我有改的部分
```
#語言改成台灣
lang: zh-TW

#時區改成台北
timezone: Asia/Taipei 

#網站的標題
title: 我酷酷的網站

#網站的副標題
tagline: 希望我能持之以恆的更新

#網站的描述
description: >- # used by seo meta and the atom feed
  描述你的網站
  
github:
  username: occultationtw # 更改為您的 GitHub 用戶名
  
social:
  #名字
  name: KunJi-Li
  
  #信箱
  email: kunji.li@outlook.com # change to your email address
  
  #網站連結
  links:
    - https://github.com/occultationtw # change to your github homepage
```

### 設置網站頭像
- 放入自己的頭像\
    我放在 /assets/img/favicons/my.jpg
- 設置頭像路徑\
    更改 _config.yml 中的圖片路徑
    ```
    avatar: "/assets/img/favicons/my.jpg"
    ```

### 佈置 About 頁面
找到 _tabs/about.md\
可以使用 markdown 語法撰寫自己的 About 頁面

### 刪除左下角 twitter(x) 圖像
找到 _data/contact.yml\
註解掉這兩行
```
#- type: twitter
#  icon: "fa-brands fa-x-twitter"
```

### 建立第一篇文章
在目錄 _posts 下建立檔案\
檔案名稱要符合這個格式\
YYYY-MM-DD-文章標題.md\
例如：2024-06-16-my-first-post.md

- 2024-06-16-my-first-post.md 檔案內容
    ```
    ---
    layout: post
    title: 文章的標題，如果空白就會顯示檔案名稱的標題
    description: 文章點進去之前，會顯示的簡短描述
    date: 2024-04-15 17:00:00
    categories: 類別 子類別
    tags: 標籤1 標籤2
    published: false|true 是否要發布文章，不打這行的話預設就是發布（true）
    ---
    
    這邊就是內文，使用 markdown 格式撰寫
    ```


## 部署網站，讓網站上線
push 到 github 上
```
git add .
git commit -m "init"
git push
```

接著進入專案的 Action 頁面可以看到正在動作了
![003](https://hackmd.io/_uploads/HJlx98or0.png)

等它變成綠色後，點進去，點 deploy
![截圖 2024-06-16 清晨5.41.34](https://hackmd.io/_uploads/ryPhcFiSR.png)

點開 Complete job\
可以看到有網址，點進去就是你的網站了
![截圖 2024-06-16 清晨5.42.36](https://hackmd.io/_uploads/SywxjYoSA.png)

## 參考資料
- 建置參考：https://chirpy.cotes.page/posts/getting-started/
- 使用的模板：https://github.com/cotes2020/chirpy-starter