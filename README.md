### BOSS_Batch_Deliver

[Google 扩展商店](https://chromewebstore.google.com/detail/boss%E7%9B%B4%E8%81%98%E6%89%B9%E9%87%8F%E6%B2%9F%E9%80%9A/ijmifekpgajhmnmmcmldbmocjagcekmg)

BOSS 直聘批量沟通职位 chrome 插件，将根目录下 [“chrome-extension.zip”](https://github.com/wvit/BOSS_batch_deliver/raw/main/chorme-extension.zip) 下载并解压后，在 chrome://extensions/ 插件管理页面加载即可使用。

主要使用 react + ts + antd + tailwindcss 编写。


### 功能特性

1. 批量向招聘者发送“自定义消息” 或 “打招呼语”

2. 支持过滤排除猎头、公司名称、已沟通职位、职位描述中包含的关键字、活跃状态、发送消息间隔时间、查看批量沟通进度。

3. 不收集和记录任何用户信息，打开Boss直聘网站就能使用，用法简单。


### 帮助说明

1. 当您跳转到 BOSS 直聘[推荐职位](https://www.zhipin.com/web/geek/job-recommend)页面后，页面会展示【推荐职位】或您自己添加【求职期望】，这时候打开插件，职位列表就是当前网站中展示职位列表。

2. 在添加自定义打招呼消息文案后，然后开始批量沟通已选中职位，这时候会自动打开一个最小化浏览器窗口帮您自动发送沟通消息。

3. 如果你在平台配置过【打招呼语】，那么将不会使用在插件中配置的自定义消息。并且批量沟通的进度也比发送自定义消息要快，因为会少几个处理步骤。

4. 请注意您当日沟通的职位数量，因为 Boss 直聘平台对每日沟通数量有限制，大概在 80 多个。
   建议批量沟通超过最好不要超过 70 个，因为如果你再看到心动的职位，会陷入“您沟通的职位已达当日上限”。

5. 如果在使用过程中出现问题，您可以尝试网页或重新加载插件。 本插件不会记录和获取你在招聘平台的任何用户信息，请放心使用。
   这是插件的代码仓库地址：[Github](https://github.com/wvit/BOSS_batch_deliver.git)

### 插件预览

###### 插件内容.jpg

![插件内容](https://wvit.github.io/static/boss-batch/img1.jpg)

---

###### 批量沟通进度.jpg

![批量沟通进度](https://wvit.github.io/static/boss-batch/img2.jpg)
