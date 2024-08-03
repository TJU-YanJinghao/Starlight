# Starlight——自闭症儿童情感辅助系统

## 开发手册

1. ###### 安装`Node.js`和`npm`。

   首先，新版的`Node.js`中包含`npm`，只需要安装`Node.js`即可。
   具体的安装教程可以百度(考虑到大部分同学的开发环境是Windows，而Windows的安装比较简单，下载安装包按照提示安装即可)。
   安装完成后，检查一下是否安装成功。打开命令行(`cmd`)，输入

   - 检查`Node.js`版本

     ```powershell
     node -v
     ```

   - 检查`npm`版本

     ```powershell
     npm -v
     ```

   如果无法显示版本号，可能是环境变量配置等问题(很常见了)，同样的，因为不是今天分享的重点，所以如果出现这样的问题可以百度解决。

   

2. ###### 关于`npm`换源

   - 一种方法是每次使用`npm install`命令时，在后面加参数使用淘宝源，即

     ```powershell
     npm install <packageName> --registry=https://registry.npm.taobao.org
     ```

   - 另一种方法是安装`cpnm`

     ```powershell
     npm install -g cnpm --registry=https://registry.npm.taobao.org
     ```

     之后使用`cpnm`命令(本质也是淘宝还原)，即

     ```
     cnpm install <packageName>
     ```

   方便起见，后面的命令都用`npm`，但你可以自行选择是否换源、用哪种换源方式。

   

3. ###### `Vue`和`Vue CLI`的区别

   - `Vue`全称是`Vue.js`，是一套用于构建用户界面的渐进式`JavaScript`框架。

   - `Vue CLI`是一个脚手架，通俗地说，`Vue CLI = Vue + JS plugins`。`Vue CLI`是代码生成器，可以快速生成一套基于`Vue`完整的前端框架，单独编译，单独部署；可以再集成各种第三方插件，扩展出更多的功能。

   - 对应关系

     | `Vue CLI`版本 | `Vue`版本       |
     | ------------- | --------------- |
     | `< 4.5`       | `Vue 2`         |
     | `>= 4.5`      | `Vue 2`/`Vue 3` |

   

4. ###### 安装`Vue CLI`

   至于为什么不安装`Vue`后面解释
   用`npm`或`cnpm`安装某个版本的`Vue CLI`。

   ```powershell
   npm install -g @vue/cli@3.11.0
   ```

   检查是否安装成功

    ```powershell
   vue -V
    ```

5. ###### clone项目到本地

6. ###### 运行npm install

   ```powershell
   npm install
   ```

   ![image-20240803104504715](C:\Users\86139\AppData\Roaming\Typora\typora-user-images\image-20240803104504715.png)

7. ###### 切换目录

   ```powershell
   cd DZLGZ_vue
   ```
   
   ![image-20240803104954178](C:\Users\86139\AppData\Roaming\Typora\typora-user-images\image-20240803104954178.png)

8. ###### 运行npm run dev

   ```powershell
   npm run dev
   ```
   
   ![image-20240803105037832](C:\Users\86139\AppData\Roaming\Typora\typora-user-images\image-20240803105037832.png)
   
9. ###### 打开链接即可

   ![image-20240803105205754](C:\Users\86139\AppData\Roaming\Typora\typora-user-images\image-20240803105205754.png)