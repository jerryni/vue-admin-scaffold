# 跳到当前文件所在目录
cd `dirname $0`

# 安装cnpm
if hash cnpm 2>/dev/null; then
    echo "-----------------cnpm already installed----------------------"
else
    echo "----------------------installing cnpm----------------------"
    npm i -g cnpm --registry=https://registry.npm.taobao.org
fi

echo "----------------------install dependencies----------------------"
npm i

#开始打包
echo "----------------------start pack----------------------"
npm run build
echo "----------------------end pack----------------------"