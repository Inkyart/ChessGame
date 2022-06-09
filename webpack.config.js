const path = require('path');

module.exports = {
    target: "web", // 添加这一句
    entry: './src/main.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './dist')
    },
    devServer: {  //本地调试服务配置
        port: 8080, //端口   
        host: '0.0.0.0', //局域网访问可填写'0.0.0.0'
        hot: true, //启动热更新 
        filename: 'bundle.js', //入口文件引入
        contentBase: path.join(__dirname), //映射资源目录位置 
    },
    mode: 'development'
};
