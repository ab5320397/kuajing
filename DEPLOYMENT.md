 # 网站部署教程
 
 ## 环境准备
 在开始部署前，请确保您的计算机已安装以下工具：
 
 ### 安装Git
 
 #### Windows
 1. 访问 [Git官网](https://git-scm.com/download/win) 下载Git安装程序
 2. 运行安装程序，按照默认选项完成安装
 3. 安装完成后，打开命令提示符(CMD)或PowerShell，输入 `git --version` 验证安装是否成功
 
 #### macOS
 1. 推荐使用Homebrew安装：`brew install git`
 2. 或通过Xcode命令行工具安装：`xcode-select --install`
 3. 验证安装：`git --version`
 
 #### Linux (Ubuntu/Debian)
 ```bash
 sudo apt update
 sudo apt install git
 git --version
 ```
 
 ### 安装Node.js和npm
 
 推荐使用Node版本管理器(NVM)安装，方便管理多个Node.js版本：
 
#### Windows
  1. 访问 [Node.js官网](https://nodejs.org/) 下载LTS版本安装程序
  2. 运行安装程序，勾选"Add to PATH"选项
  3. **默认安装目录**：`C:\Program Files\nodejs\`（可在安装过程中自定义）
  4. 安装完成后，打开命令提示符，输入以下命令验证：
  ```bash
  node --version
  npm --version
  ```
 
#### macOS/Linux
  使用NVM安装(推荐)：
  ```bash
  # 安装NVM
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
  # 或使用wget
  wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
  
  # 关闭并重新打开终端，然后安装Node.js
  nvm install --lts
  
  # 验证安装
  node --version
  npm --version
  ```
  **NVM安装目录**：`~/.nvm/versions/node/`（由NVM管理，无需手动指定）
 
 ## 部署选项
 - [使用Vercel部署](#使用vercel部署)
 - [使用腾讯云静态网站托管部署](#使用腾讯云静态网站托管部署)
 

## 使用腾讯云静态网站托管部署

 ### 前提条件
 - 一个腾讯云账号
 - 已完成[环境准备](#环境准备)（安装Git、Node.js和npm）
   - 已构建项目(执行`npm run build`生成dist目录，Windows用户如遇命令错误可先运行`npm install -g rimraf`)

### 部署步骤

#### 1. 准备项目构建文件
  1. 打开命令提示符，导航到您的项目目录:
  
  #### 查找项目路径:
  - 打开文件资源管理器，找到您的项目文件夹
  - 按住Shift键，同时右键点击项目文件夹空白处
  - 选择"复制为路径"选项
  
  #### Windows PowerShell:
  ```powershell
  cd "粘贴您复制的路径"
  ```
  
  #### 示例:
  ```powershell
  cd "C:\Users\您的用户名\Documents\shopease-project"
  ```
 
  2. 确保已完成项目构建:
  ```bash
  # 安装依赖
  npm install
  
    # 安装跨平台文件操作依赖（已自动复制index.html和404.html到dist目录）
   npm install --save-dev copyfiles
   
   # 在项目根目录下构建项目
   npm run build
   ```

  > **Windows用户特别说明**: 已使用跨平台命令替换Unix系统命令，上述命令适用于所有操作系统。如果之前安装过依赖，可能需要先删除node_modules和package-lock.json，然后重新执行`npm install`。
 构建完成后会生成`dist`目录，包含所有静态文件。构建成功后，dist目录应包含以下关键文件:
  - index.html (主页面文件)
  - 404.html (错误页面文件)
  - assets/ (包含JS、CSS和图片资源，这是最重要的目录，如果缺少此目录，网页无法加载)
  - favicon.ico (网站图标)
  
  **构建成功检查清单:**
  1. 确保构建过程中没有红色错误信息
  2. 检查dist目录大小，应该至少有几MB
  3. 确认dist/assets目录存在且包含多个.js和.css文件
  4. 打开dist/index.html，检查是否有类似`<script type="module" src="/assets/index-*.js"></script>`的标签
  5. 检查dist/assets目录中的文件是否有正确的大小(通常JS文件至少几百KB)
 如果构建失败或dist目录不完整，请检查以下几点:
 1. 确保没有错误出现在构建过程中
 2. 检查Node.js版本是否兼容 (推荐v16.x或v18.x)
 3. 删除node_modules和package-lock.json，重新运行`npm install`
 4. 查看详细错误信息: `npm run build -- --debug`

#### 2. 登录腾讯云控制台
1. 访问[腾讯云官网](https://cloud.tencent.com/)并登录账号
2. 进入[对象存储COS](https://console.cloud.tencent.com/cos5)控制台

#### 3. 创建存储桶
1. 点击"创建存储桶"按钮
2. 配置存储桶信息:
   - 存储桶名称: 输入唯一的名称(如`my-static-website-12345678`)
   - 地域: 选择离目标用户最近的地域(如"上海")
   - 访问权限: 选择"公有读私有写"
   - 其他选项保持默认
3. 点击"确定"创建存储桶

#### 4. 配置静态网站托管
1. 在存储桶列表中找到刚创建的存储桶，点击进入
2. 选择"基础配置" > "静态网站"标签
3. 点击"开启静态网站托管"
4. 配置网站参数:
   - 索引文档: 输入`index.html`
    - 错误文档: 输入`404.html`(必须设置，用于SPA路由)
5. 点击"保存"完成配置

#### 5. 上传网站文件
1. 选择"文件列表"标签
2. 点击"上传文件"按钮
  3. 打开本地项目的`dist`目录，选择其中的所有文件和文件夹（**重要：确保选择dist目录内的内容，而不是dist文件夹本身**）
 4. 点击"上传"按钮，等待所有文件上传完成
 5. 验证文件结构：确保index.html、404.html和assets文件夹直接出现在存储桶根目录，而非嵌套在dist文件夹中

#### 6. 访问网站
1. 上传完成后，返回"静态网站"配置页面
2. 在"访问域名"部分，可以看到腾讯云提供的默认域名(如`my-static-website-12345678.cos-website.ap-shanghai.myqcloud.com`)
3. 点击该域名即可访问部署好的网站

#### 7. 自定义域名配置(可选)
1. 在"静态网站"配置页面，点击"绑定自定义域名"
2. 输入已备案的域名
3. 按照指引完成DNS解析配置
4. 配置HTTPS证书(推荐)

### 注意事项
- 腾讯云静态网站托管提供免费额度(50GB存储、10GB/月流量)，超出后按使用量计费
- 确保项目构建路径正确，默认是`dist`目录
 - 如使用React Router的BrowserRouter，已自动配置404页面指向index.html
- 可通过CDN加速提升访问速度，在腾讯云CDN控制台配置

### 常见问题解决
    - **访问403错误(AccessDenied)**: 这通常是由于存储桶权限未正确配置导致的。解决方法：
      1. **验证基础访问权限**
         - 进入COS控制台，选择您的存储桶
         - 点击"权限管理"标签
         - 确保"公有读私有写"权限已勾选
         - 检查"访问控制列表(ACL)"设置，确保"匿名用户"有"读取对象"权限
       
       2. **添加存储桶策略**（关键步骤）
         - 在"权限管理"标签页中，找到"存储桶策略"部分
         - 点击"添加策略"按钮
         - 选择"自定义策略"
         - 复制并粘贴以下完整策略，**请勿修改格式**：
           ```json
           {
             "Version": "2.0",
             "Statement": [
               {
                 "Effect": "Allow",
                 "Principal": "*",
                 "Action": [
                   "cos:GetObject",
                   "cos:HeadObject",
                   "cos:ListBucket",
                   "cos:GetBucket",
                   "cos:ListMultipartUploads",
                   "cos:ListParts"
                 ],
                 "Resource": [
                   "qcs::cos:ap-guangzhou:uid/1318040446:star-1318040446/*",
                   "qcs::cos:ap-guangzhou:uid/1318040446:star-1318040446"
                 ],
                 "Condition": {
                   "StringEquals": {
                     "cos:Referer": [
                       "https://star-1318040446.cos-website.ap-guangzhou.myqcloud.com",
                       "http://star-1318040446.cos-website.ap-guangzhou.myqcloud.com"
                     ]
                   }
                 }
               }
             ]
           }
           ```
          > **重要提示**: 此策略已针对您的存储桶(star-1318040446)和地域(ap-guangzhou)预配置，直接复制使用即可，无需修改
       
       3. **配置跨域资源共享(CORS)**
         - 在"权限管理"标签页中，找到"跨域资源共享(CORS)"部分
         - 点击"添加规则"按钮
         - 来源Origin: 输入 "*" 允许所有来源
         - 允许Methods: 勾选GET, HEAD, OPTIONS
         - 允许Headers: 输入 "*"
         - 暴露Headers: 输入 "ETag"
         - 最大TTL: 输入 "3600"
         - 点击"保存"
      
      4. **验证静态网站配置**
         - 进入"基础配置" > "静态网站"标签
         - 确保"索引文档"设置为index.html
         - 确保"错误文档"设置为index.html
         - 复制并使用页面中提供的"访问域名"（格式通常为：xxx.cos-website.xx-xx.myqcloud.com）
   - **页面被下载而非显示**: 这通常是由于HTML文件MIME类型配置错误导致，解决方法：
     1. 确保使用静态网站访问域名而非对象存储域名（格式通常为：xxx.cos-website.xx-xx.myqcloud.com）
     2. 在COS控制台检查index.html文件的Content-Type是否为text/html
     3. 若MIME类型错误，可通过COS控制台的"文件属性"手动修改为text/html
   - **页面样式错乱**: 确保CSS/JS文件路径正确，或使用相对路径
   - **路由跳转问题**: 对于SPA应用，需要配置服务器将所有路由请求重定向到index.html。具体方法：
     - 腾讯云COS: 在"静态网站"配置中，将404页面设置为index.html
     - Nginx: 添加try_files $uri $uri/ /index.html;配置
     - Apache: 添加RewriteRule ^(.*)$ /index.html [L]配置
   - **空白页面问题**: 检查浏览器控制台是否有资源加载错误，确保所有dist目录文件已正确上传
   - **dist目录为空或不完整**: 重新运行`npm run build`并检查构建过程中是否有错误信息
   - **assets文件夹已上传但网站仍无法访问**: 
     1. 确认assets文件夹不是空的，包含至少一个.js文件和一个.css文件
     2. 检查index.html中的资源引用路径是否正确
      3. 验证文件访问权限:
         1. 确保所有文件都已上传到存储桶根目录，而非嵌套在dist文件夹中
         2. 检查文件的Content-Type是否正确:
            - HTML文件: text/html
            - JS文件: application/javascript
            - CSS文件: text/css
            - 图片文件: 对应正确的图片类型(image/jpeg, image/png等)
         3. 尝试直接访问资源文件以测试权限: 
          - 访问首页: <code>https://star-1318040446.cos-website.ap-guangzhou.myqcloud.com</code>
          - 访问index.html: <code>https://star-1318040446.cos-website.ap-guangzhou.myqcloud.com/index.html</code>
          - 访问JS资源: <code>https://star-1318040446.cos-website.ap-guangzhou.myqcloud.com/assets/index.js</code>
          - 检查存储桶权限: <code>https://console.cloud.tencent.com/cos5/bucket/permission?bucket=star-1318040446-1318040446&region=ap-guangzhou</code>
      4. 检查文件权限:
          - 在COS控制台找到index.html文件
          - 点击"更多" > "设置访问控制列表(ACL)"
          - 确保"公有读"权限已勾选
          - 对assets文件夹下的所有文件执行相同操作，确保它们都设置为"公有读"
          - 验证文件的Content-Type是否正确:
             - HTML文件: text/html
             - JS文件: application/javascript
             - CSS文件: text/css
             - 图片文件: 对应正确的图片类型(image/jpeg, image/png等)
      5. 检查访问日志:
         1. 进入COS控制台，选择您的存储桶
         2. 点击"日志管理"标签
         3. 启用访问日志记录（如果尚未启用）
         4. 等待10-15分钟后查看最新的访问日志
          5. 查找状态码为403的请求，检查"errorCode"字段获取具体拒绝原因
          6. 常见错误代码及解决方法:
             - AccessDenied: 权限被拒绝，检查存储桶策略和ACL
             - NoSuchBucket: 存储桶不存在，检查存储桶名称和地域
             - SignatureDoesNotMatch: 签名不匹配，检查访问链接是否正确

## 使用Vercel部署

  ## 前提条件
  - 一个GitHub账号
  - 一个Vercel账号
  - 已完成[环境准备](#环境准备)（安装Git、Node.js和npm）

## 部署步骤

### 1. 初始部署（首次部署）
按照以下步骤完成首次部署：

#### 准备项目代码
1. 打开命令提示符，导航到您的项目目录:
```bash
cd /path/to/your/project/folder
```
请将`/path/to/your/project/folder`替换为您实际的项目文件夹路径

2. 确保你的项目可以正常构建:
```bash
# 安装依赖
npm install

# 本地构建测试
npm run build
```

如果构建成功，继续下一步。

#### 将项目上传到GitHub
1. 在GitHub上创建一个新仓库
2. 在本地项目目录中执行以下命令:
```bash
# 初始化Git仓库（如果尚未初始化）
git init

# 添加所有文件
git add .

# 提交更改
git commit -m "Initial commit"

# 添加远程仓库
git remote add origin https://github.com/你的用户名/你的仓库名.git

# 推送到GitHub
git push -u origin main
```

#### 在Vercel上部署
1. 访问 [Vercel官网](https://vercel.com) 并使用GitHub账号登录
2. 点击"New Project"按钮
3. 导入你刚刚创建的GitHub仓库
4. 在项目配置页面，设置以下选项:
    - **Framework Preset**: 选择 "Vite"
     - **Build Command**: 确保为 `pnpm run build`
     - **Output Directory**: 确保为 `dist`
    - **Install Command**: 修改为 `pnpm install`

5. 点击"Deploy"按钮开始部署

### 2. 重新部署（代码更新后）
当你对项目进行修改后，只需执行以下步骤即可触发Vercel自动重新部署：

1. 将更改提交到本地仓库:
```bash
# 添加所有更改的文件
git add .

# 提交更改（请替换"描述你的更改内容"为实际修改说明）
git commit -m "描述你的更改内容"

# 推送到GitHub
git push origin main
```

2. Vercel会**自动检测**到GitHub仓库的更新，并在几分钟内完成重新部署，无需手动在Vercel中重新导入仓库。

### 3. 查看部署状态
1. 访问Vercel控制台，选择你的项目
2. 在"Deployments"标签页中可以查看所有部署记录和当前部署状态
3. 部署完成后，Vercel会提供一个URL，你可以通过该URL访问最新部署的网站

### 4. 等待部署完成
Vercel会自动构建并部署你的项目，这可能需要几分钟时间。部署完成后，你将看到一个成功页面，并获得一个自动生成的URL（类似 `your-project.vercel.app`）。

### 5. 访问你的网站
点击Vercel提供的URL，即可访问部署好的网站。

### 6. 后续设置（可选）
- **自定义域名**: 在Vercel项目设置中，你可以添加自定义域名
- **环境变量**: 如果项目需要环境变量，可以在Vercel的项目设置中添加
- **自动部署**: 之后每次推送到GitHub仓库，Vercel都会自动重新部署你的网站

## 常见问题解决
- **构建失败**: 确保本地可以成功运行`npm run build`
- **依赖问题**: 尝试删除`node_modules`和`package-lock.json`，重新安装依赖
- **路由问题**: 如果使用React Router，确保在Vercel中设置了正确的重写规则

如有其他问题，可以查看Vercel官方文档或在Vercel控制台查看构建日志。
   
    ### Windows PowerShell 配置指南
    
    #### 1. 执行策略设置
    如果运行npm命令时遇到"无法加载文件"错误，请按以下步骤解决：
    
    1. 以管理员身份打开PowerShell：
       - 在开始菜单搜索"PowerShell"
       - 右键点击"Windows PowerShell"，选择"以管理员身份运行"
    
    2. 执行以下命令更改执行策略：
    ```powershell
    Set-ExecutionPolicy RemoteSigned
    ```
    
    3. 当提示确认时，输入`Y`并按Enter
    
    4. 关闭并重新打开PowerShell
    
    #### 2. 常用PowerShell命令
    | 操作 | 命令 |
    |------|------|
    | 查看当前路径 | `Get-Location` 或 `pwd` |
    | 导航到目录 | `cd "路径"` |
    | 列出目录内容 | `dir` |
    | 创建目录 | `mkdir 目录名` |
    | 返回上一级目录 | `cd ..` |
    | 清除屏幕 | `cls` |
    
    #### 3. 查找项目路径
    1. 在文件资源管理器中找到您的项目文件夹
    2. 点击地址栏，路径将被高亮显示
    3. 按Ctrl+C复制路径
    4. 在PowerShell中使用 `cd "粘贴路径"` 导航到项目目录
    
    > 提示：在PowerShell中，您可以按Tab键自动补全路径
 ### 跨平台命令差异说明
  ### 跨平台命令差异说明
  
  #### 路径格式:
  - Windows: 使用反斜杠 `\` (例如: `C:\Users\用户名\项目文件夹`)
  - macOS/Linux: 使用正斜杠 `/` (例如: `/home/用户名/项目文件夹`)
  
  #### 常用命令对比:
  | 操作 | Windows (PowerShell) | macOS/Linux (终端) |
  |------|----------------------|-------------------|
  | 导航到目录 | `cd "C:\路径\到\项目"` | `cd /路径/到/项目` |
  | 列出文件 | `dir` | `ls` |
  | 删除目录 | `rmdir /s /q 目录名` | `rm -rf 目录名` |
  | 复制文件 | `copy 源文件 目标位置` | `cp 源文件 目标位置` |
  | 创建文件 | `New-Item 文件名` | `touch 文件名` |
 
 本项目已配置跨平台兼容的构建命令，直接使用`npm run build`即可。
   
### 本地测试已构建文件

构建完成后，如果您想在本地测试已构建的静态文件，**不建议直接双击打开dist/index.html**（由于浏览器安全限制和路径问题可能无法正常工作）。推荐使用以下方法：

#### 使用本地静态服务器

1. 安装一个简单的静态服务器（只需安装一次）:
```bash
npm install -g serve
```

2. 在项目根目录运行:
```bash
serve -s dist
```

3. 在浏览器中访问服务器提供的地址（通常是 http://localhost:3000）

#### 或使用Vite预览模式

Vite提供了内置的预览功能，可以直接预览构建后的文件:
```bash
npm run build
npm run preview
```

这将启动一个本地服务器，您可以通过浏览器访问预览地址。

### 为什么不能直接双击打开HTML文件?

现代浏览器出于安全考虑，对本地文件(`file://`协议)有严格的限制，特别是:
- JavaScript模块系统可能无法正常工作
- 资源文件路径解析方式不同
- 某些API（如fetch、localStorage）在本地文件模式下可能受限
- 跨域请求会被完全阻止

使用本地服务器可以模拟真实网站环境，避免这些问题。