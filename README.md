<p align="center">
    <img style="width: 120px; border: 1px solid #e4e4e4; border-radius: 10px" src="https://web-online-career.oss-cn-hangzhou.aliyuncs.com/resource/icon.png" />
</p>
<h1 align="center" style="margin: 30px 0 30px; font-weight: bold;">网上求职与招聘系统</h1>
<h4 align="center">基于SpringBoot+Vue前后端分离的开发</h4>

## 一、项目介绍

> ​        这是一款专门针对于网上求职与招聘系统设计的框架，代码简单，结构清晰，使用起来很方便。为了生活中求职与招聘服务更好的智能化操作，能为求职招聘人员提供便捷的服务、准确可靠的信息、数字化的管理。
> ​		PS：设计初衷是毕业设计...

### 1.1  需求环境

- 操作系统：Windows10
- 数据库：MySQL5.7、Navicat
- 软件：VSCode、WebStorm、IDEA、Postman

### 1.2  技术栈

| 前端                                       | 后端                      |
| ------------------------------------------ | ------------------------- |
| Vue2全家桶：Vuex、Vue-Router等             | SpringBoot（Maven包管理） |
| ElementUI组件库                            | Hutool工具库              |
| Element-China-Area-Data 中国省市区数据联动 | LomBok                    |
| Axios网络请求                              | MyBatis/MyBatis-Plus      |
| Mavon-Editor（MarkDown编辑器）             | 阿里云OSS对象存储服务     |

------

## 二、系统功能

> 这里就挑几个重要的模块作为介绍

### 2.1  登录模块

> 用户通过账户密码登录（目前没有提供忘记密码的模块），根据登录用户所属的角色，分配不同的菜单（数据访问权限）
> 登录后的路由是基于其角色菜单列表的加载而动态加载路由。
>
> 角色：1、系统开发者；2、招聘者；3、求职者；
>
> - 
>
> 1. 

<p style="display: flex">
  <img style="width: 50%" src="https://web-online-career.oss-cn-hangzhou.aliyuncs.com/document/login.png" />
  <img style="width: 50%" src="https://web-online-career.oss-cn-hangzhou.aliyuncs.com/document/home.png" />
</p>

### 2.2  角色模块

> 系统所有角色的管理，角色信息的CRUD，以及为角色分配不同菜单的访问权限，属于系统超级管理员所有。

<p style="display: flex">
  <img style="width: 50%" src="https://web-online-career.oss-cn-hangzhou.aliyuncs.com/document/role_view.png" />
  <img style="width: 50%" src="https://web-online-career.oss-cn-hangzhou.aliyuncs.com/document/role_divide.png" />
</p>

### 2.3  菜单模块

> 系统所有菜单的管理（除基本菜单，如404、登录），菜单信息的CRUD，菜单路径即路由组件路径，属于系统超级管理员所有。

<p style="display: flex; flex-flow: row wrap;">
  <img style="width: 50%" src="https://web-online-career.oss-cn-hangzhou.aliyuncs.com/document/menu_view.png" />
  <img style="width: 50%" src="https://web-online-career.oss-cn-hangzhou.aliyuncs.com/document/menu_add.png" />
  <img style="flex: 1" src="https://web-online-career.oss-cn-hangzhou.aliyuncs.com/document/menu_update.png" />
</p>

### 2.4  招聘信息模块

> 该模块属于招聘管理员使用，切换招聘者用户（98938761），可对招聘信息的CRUD以及招聘信息类别的筛选。

<p style="display: flex">
  <img style="width: 50%" src="https://web-online-career.oss-cn-hangzhou.aliyuncs.com/document/career_view.png" />
  <img style="width: 50%" src="https://web-online-career.oss-cn-hangzhou.aliyuncs.com/document/career_update.png" />
</p>

---

## 三、系统扩展性

### 3.1  整合高德地图与Element UI 中国省市区级联数据

> 在开发前期，由于第一次接触使用生疏，加上时间紧迫，思路：使用elementUI组件库中，将地图图层渲染到对话框组件中，在使用Element UI 中国省市区级联数据传给maploader中去定位到目的区域，再根据键盘输入自动提示与POI搜索，用户再选择心仪选项即可。

<p style="display: flex">
  <img style="width: 50%" src="https://web-online-career.oss-cn-hangzhou.aliyuncs.com/document/maploader.png" />
  <img style="width: 50%" src="https://web-online-career.oss-cn-hangzhou.aliyuncs.com/document/elm_pca.png" />
</p>

### 3.2  整合移动端Vant组件库

> 由于时间原因，前端页面交互未实现（PS：其实是去练车和写论文去了），布局的话界面预期是参考黑马头条移动端布局，参考图如下。

<p style="display: flex">
  <img style="width: 50%" src="https://web-online-career.oss-cn-hangzhou.aliyuncs.com/document/vant_home.png" />
  <img style="width: 50%" src="https://web-online-career.oss-cn-hangzhou.aliyuncs.com/document/vant_category.png" />
</p>

---

## 四、总结

> 呃，感觉写的很简陋，当然有很多不完美的地方，比如适配多端，开发初期本来是准备直接用[若依后台管理框架](https://gitee.com/y_project/RuoYi-Vue#https://gitee.com/link?target=http%3A%2F%2Fvue.ruoyi.vip)，后面想了想还是算了，就当锻炼锻炼自己参考文档的阅读、性能调解、鬼点子啊，想法太多也是错...
>
> 主要是前后端都是我自学写的，后端目前没学到中间件的使用，比如说Redis缓存、MongoDB、Sa-Token权限认证，要学的东西太多了唉，后面准备学习Vue3与TypeScript，移动端，小程序等，欧太糟糕要找工作了，悲催的失业游民。
>
> Vite搭建脚手架简直不要太爽，特别是webstorm默认是cli，慢死了，之前使用它主要是集成ElementUI组件时候有相应提示比较走心，个人还是比较喜欢VSC的，多提一句组合式开发YYDS，选项式开发太low了，忠实的面向函数开发主义者。
>
> 我恨每个不会论文排版的，因为导师把有问题的全交给我了md，也不知道未来有没有小伙伴会看到，附上俺联系方式吧，QQ：906645272（好东西好资源要一起分享啊，手动狗头）

