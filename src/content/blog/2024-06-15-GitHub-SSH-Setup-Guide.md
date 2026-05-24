---
layout: post
title: Github SSH 設置
description: 設置 GitHub SSH clone, push 專案
date: 2024-06-15 22:00:00 +0800
categories: 實作筆記 GitHub
tags: Github 環境設置 SSH macOS 實作
---

## 環境
macOS

## 實作
- 生成 SSH Key
    ```
    ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
    ```

- 取得生成的公鑰
    ```
    cat /Users/你的使用者名稱/.ssh/id_rsa.pub
    例如：cat /Users/kunjili/.ssh/id_rsa.pub
    ```
    會輸出類似以下的內容，稍後設置會用到
    ```
    ssh-rsa AAAAB3Nza（中間略）b9gOxL0tSVMBQ== kunji.li@outlook.com
    ```

- 將公鑰設置到 Github\
    到 Github 頁面找到你的頭像
    ![001](https://hackmd.io/_uploads/ryrN5LjHA.png)

    Settings
    ![002](https://hackmd.io/_uploads/r13V5UjHC.png)

    SSH and GPG keys
    ![003](https://hackmd.io/_uploads/ryeD9LjB0.png)


    在 SSH keys 的地方選擇 New SSH keys
    ![004](https://hackmd.io/_uploads/SkgL9IsSA.png)


    然後標題可以隨便取\
    內容輸入剛剛資料夾內的 id_rsa.pub 檔案全部內容
    ![005](https://hackmd.io/_uploads/HkADqUoS0.png)


- 測試
    
    新增成功後測試看看
    ```
    ssh -T git@github.com
    ```

    成功的話會看到類似以下訊息
    ```
    Hi occultationtw! You've successfully authenticated, but GitHub does not provide shell access.
    ```

## 參考資料
- [Generating a new SSH key and adding it to the ssh-agent](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)