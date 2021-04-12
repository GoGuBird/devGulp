## 基本指令
# 将src文件夹下文件，生成build下的识别文件
```bash
gulp
```
# 将开启服务，要先生成build文件，才能响应，请求到
```bash
gulp server
```
# 删除build文件夹
```bash
gulp clean
```

# 生成压缩文件
```bash
gulp build
```
# 删除压缩文件
```bash
gulp cleanweb
```

## 文件说明
* `file.path.js` 统一管理src文件路径
* `gulpfile.js` gulp配置文件
* `mockAPI.js` 模拟接口文档数据

## NODE环境版本升级连带着GULP问题
> 当前版本
```
## v15.11.0（node） 
## CLI version 2.0.1 (gulp-cli)
## Local version 4.0.2 (gulp)
```
> 上一版本
```
## v12.18.4(node)
## <4.0.0(gulp)
```