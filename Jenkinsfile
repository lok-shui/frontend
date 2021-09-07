#!groovy
library 'dm-ai-default'

def map = [:]
/*参数化变量,运行时可选择*/

// 构建发送邮件地址
map.put('emailAddress','raojianwei@dm-ai.cn')

// 应用名称，全局唯一，依据这个来，分配端口和资源，部署，默认为git仓库地址，项目名, 建议和gitlab上进行统一
map.put('appName','aiep-platform-frontend')

// 运行主应用
dmaiBuild(map, env)