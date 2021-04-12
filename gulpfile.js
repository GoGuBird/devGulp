//开发环境
const url = require('url'); //node自带url插件
const gulp = require('gulp'); //gulp主件
const connect = require('gulp-connect'); //关联插件
const webserver = require('gulp-webserver'); //生成本地服务
const path = require('path'); //获取路径
const watch = require('gulp-watch'); //监听插件
const babel = require('gulp-babel'); //转移es6语法，依赖插件babel、gulp-babel、[babel-preset-env(低版本配置)]、[@babel/core、@babel/preset-env(高版本配置)],以及.babelrc配置文件 
const jshint = require('gulp-jshint'); //检测js语法,依赖插件jshint、gulp-jshint
const mapstream = require('map-stream'); //数据流插件引用，与自定义检测语法套用
const jade = require('gulp-jade'); //jade模板引擎,转码插件
const data = require('gulp-data'); //这个可以用来读取本地文件，数据库，模拟数据，很有用，与jade搭配
const less = require('gulp-less'); //less转码,依赖插cgrrs件less、gulp-less
const sass = require('gulp-sass'); //用来打包bootstrap
const clean = require('gulp-clean'); //删除打包后的文件
const open = require('gulp-open'); //打开浏览器
const uncss = require('gulp-uncss-sp'); //除掉无效css
//新增
const plumber = require('gulp-plumber'); //这是一款防止因gulp插件的错误而导致管道中断，plumber可以阻止 gulp 插件发生错误导致进程退出并输出错误日志
//关于autoprefixer插件，需要与浏览器兼容配合使用；https://github.com/browserslist/browserslist#browserslistrc
//一般有2种方法去配置 
/** 1、在package.json里面去配置
"browserslist": [
    "defaults",
    "not IE 11",
    "maintained node versions"
]
*/
/** 2、单独拎出来.browserlistrc文件去相应配置
"browserslist": [
    "defaults",
    "not IE 11",
    "maintained node versions"
]
*/
const gulpAutoprefixer = require("gulp-autoprefixer");
const debug = require('gulp-debug'); //打印控制调试、看日志用

//生产环境压缩
var concat = require('gulp-concat'); //合并文件
var rename = require('gulp-rename'); //重命名
var htmlmin = require('gulp-htmlmin'); //压缩html
var uglify = require('gulp-uglify'); //压缩JS
var uglifyCss = require('gulp-minify-css'); //压缩css
var rev = require('gulp-rev'); //对文件名加MD5后缀
var revCollector = require('gulp-rev-collector'); //路径替换
var gulpRemoveHtml = require('gulp-remove-html'); //清除标签，注释
var removeEmptyLines = require('gulp-remove-empty-lines'); //清除空白行
//引入路径
var _ = require('./file.path.js');
var mockapi = require('./mockAPI.js')
var node_path = path.join(__dirname, 'node_modules');
var browseropen = require('open'); //打开浏览器

/* --- 开发环境 ---*/

/*
 *@webserver用来生成本地服务环境
 *@jshint语法监听
 *@ES6代码转译
 *@jade转码
 *@less转码
 *@bootstrap打包插件
 *@copyhtml 用来复制hmtl在打包后的文件夹
 *@copyjs用来复制js在打包后的文件夹
 *@copycss用来复制css在打包后的文件夹
 *@copyimage用来复制image在打包后的文件夹
 *@copymock用来复制mock模拟数据在打包后的文件夹
 *#gulp clean 用来删除生成的dist文件夹下所有文件
 *#gulp 生成文件
 *#gulp server 启动服务
 */


//本地服务
gulp.task('webserver', async function() {
    //server的参数了解，https://github.com/AveVlad/gulp-connect/blob/master/README.md
    await gulp.src('./dist')
        .pipe(webserver({
            //name: '前端本地开发环境',
            port: 3002,
            livereload: true,
            directoryListing: {
                enable: true,
                path: './dist'
            },
            host: "0.0.0.0",
            middleware: function(req, res, next) {
                //这个中间件对模拟接口很有用*【5星】*

                var urlObj = url.parse(req.url, true);
                var path = urlObj.pathname;
                var method = req.method;
                var paramobj = urlObj.query;
                //引用mockAPI自己模拟请求数据，这里可以写逻辑包括请求mothod方法调用
                //异步请求url，及mockapi的path参数，数据需要自己在mockAPI，写对应的匹配
                mockapi(res, path, paramobj, next)
                // console.log('前台请求：',urlObj, '\n')
            },
        }));

    // console.log(process.env)
    browseropen('http://localhost:3002')
});

//自定义语法检测
/* file.jshint.success = true; // or false 代码检查是否成功
file.jshint.errorCount = 0; // 错误的数量
file.jshint.results = []; // 错误的结果集
file.jshint.data = []; // JSHint returns details about implied globals, cyclomatic complexity, etc
file.jshint.opt = {}; // The options you passed to JSHint
*/
var myReporter = function(file, cd) {
    if (!file.jshint.success) {
        console.log('[' + file.jshint.errorCount + ' error in ]' + file.path)
        file.jshint.results.forEach(function(err) {
            if (err) {
                /*
                    err.line 错误所在的行号
                    err.col  错误所在的列号
                    err.message/err.reason 错误信息
                */
                console.log(' ' + file.path + ': line ' + err.line + ', col ' + err.character + ', code ' + err.code + ', ' + err.reason)
            }
        })
    }
    cb(null, file);
}

//语法检测
gulp.task('jshint', async function() {
    await gulp.src(_.babel.all)
        .pipe(plumber())
        .pipe(jshint())
        .pipe(debug({
            title: '-'
        }))
        .pipe(jshint.reporter('default'))
        .pipe(connect.reload(), console.log('/* -- 嘶,检测javascript 语法 -- */'))
})

//转译es6，注册一个事件
gulp.task('babel', async function() {
    await gulp.src(_.babel.all)
        .pipe(plumber())
        .pipe(babel())
        .pipe(debug({
            title: '-'
        }))
        .pipe(uglify())
        .pipe(gulp.dest(_.babel.dest))
        .pipe(connect.reload(), console.log('/* -- 嘻嘻,es6 => javascript 转译 -- */'))
})

//jade模板引擎，注册一个事件,更多，了解模拟数据gulp-data； 参考 https://www.npmjs.com/package/gulp-jade
gulp.task('jade', async function() {
    //var obj = {data: '模拟本地数据数据'}
    //client将hmtl转成js
    await gulp.src(_.jade.all)
        .pipe(plumber())
        .pipe(jade({
            //locals: obj,
            //client: true,
            pretty: true
        }))
        .pipe(gulp.dest(_.jade.dest))
        .pipe(connect.reload(), console.log('/* -- jade模板 转码 -- */'));
})

//less模板引擎
gulp.task('less', async function() {
    // base 保留路径 
    // src: 'src/less/99805/*.less' ->  build: 'build/css/99805/*.css'
    // 若设置base: '.', 那边 build: 'build/src/less/99805/*.css'
    await gulp.src(_.less.all, { base: 'src/less' })
        .pipe(plumber())
        .pipe(less())
        .pipe(gulpAutoprefixer())
        .pipe(debug({
            title: '-'
        }))
        .pipe(gulp.dest(_.less.dest))
        .pipe(connect.reload(), console.log('/* -- less模板 转码 -- */'));
});

//sass
gulp.task("sass", async function() {
    await gulp.src("./src/css/*.scss")
        .pipe(plumber())
        // .pipe(changed("./dist/css"))
        // .pipe(sass().on('error', sass.logError))
        .pipe(gulpAutoprefixer())
        // .pipe(cleanCSS())
        .pipe(gulp.dest("./dist/css"))
});

//插件bootstarp，打包引用
gulp.task('bootstarp', async function() {
    await gulp.src(node_path + '/bootstrap/scss/bootstrap.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(gulp.dest(_.public.dest), console.log('/* -- bootstrap打包在public文 -- */'));
})

//赋值公共资源
gulp.task('copystatic', async function() {
    await gulp.src(_.public.all)
        .pipe(plumber())
        .pipe(gulp.dest(_.public.dest), console.log('/* -- 公共资源搬家 -- */'))
})


//复制html文件移动
gulp.task('copyhtml', async function() {
    await gulp.src(_.htmls.all)
        .pipe(plumber())
        .pipe(gulp.dest(_.htmls.dest), console.log('/* -- 哟吼,HTML文件抖动  -- */'))
})

//复制js文件移动
gulp.task('copyjs', async function() {
    await gulp.src(_.js.all)
        .pipe(plumber())
        .pipe(gulp.dest(_.js.dest), console.log('/* -- js文件搬家 -- */'))
})

//复制css样式移动与less编译后统一的文件夹下面
gulp.task('copycss', async function() {
    await gulp.src(_.css.all)
        .pipe(plumber())
        .pipe(gulp.dest(_.css.dest))
        .pipe(connect.reload(), console.log('/* -- css文件搬家 -- */'))
});


//复制images
gulp.task('copyimage', async function() {
    await gulp.src(_.image.src)
        .pipe(plumber())
        .pipe(gulp.dest(_.image.dest), console.log('/* -- image文件搬家 -- */'))
})

//复制mock模拟数据,模拟接口
gulp.task('copymock', async function() {
    await gulp.src(_.mock.all)
        .pipe(plumber())
        .pipe(gulp.dest(_.mock.dest), console.log('/* -- mock文件搬家 -- */'))
})

//想删除文件单独用 gulp clean
gulp.task('clean', async function() {
    await gulp.src(_.clean.dest)
        .pipe(plumber())
        .pipe(clean(), console.log('/* -- build文件夹已删除！ -- */'))
})

//监听任务
gulp.task('watcher', async function() {
    //监听src下面所有js文件，第一个参数为路径，第二个为已注册的事件
    await gulp.watch(_.babel.all, gulp.series('babel'))
    await gulp.watch(_.babel.all, gulp.series('jshint'))
    // await gulp.watch(_.jade.all, gulp.series('jade'))
    await gulp.watch(_.less.all, gulp.series('less'))
    // await gulp.watch(_.css.all, gulp.series('copycss'))
    // await gulp.watch(_.js.all, gulp.series('copyjs'))
    await gulp.watch(_.htmls.all, gulp.series('copyhtml'))
    await gulp.watch(_.mock.all, gulp.series('copymock'))
    await gulp.watch(_.image.src, gulp.series('copyimage'))
})

//启动服务
// gulp.task('server', ['jshint', 'webserver', 'watcher'])
gulp.task('server', gulp.series(gulp.parallel('jshint', 'webserver', 'watcher')))

//默认启动打包生成开发环境文件
// gulp.task('default', ['jshint', 'babel', 'less', 'copyhtml', 'copyimage', 'copystatic', 'copymock'])
gulp.task('default', gulp.series(gulp.parallel('jshint', 'babel', 'less', 'copyhtml', 'copyimage', 'copystatic', 'copymock')))


/* --- 开发环境基本准备完毕，end --- */



/* --- 投产打包 ---*/

//压缩JS
gulp.task('minifyjs', async function() {
    await gulp.src(_.babel.fs)
        .pipe(plumber())
        .pipe(concat('build.js'))
        .pipe(gulp.dest(_.transit.js))
        .pipe(uglify())
        .pipe(concat('build.min.js'))
        .pipe(gulp.dest(_.zip.js))
})

//jsMD5 压缩并命名
gulp.task('minifyjsmd5', async function() {
    await gulp.src(_.babel.fs)
        .pipe(plumber())
        .pipe(concat('build.min.js'))
        .pipe(uglify())
        .pipe(rename('build.min.js'))
        .pipe(rev()) //文件名加MD5后缀
        .pipe(gulp.dest(_.zip.js))
        .pipe(rev.manifest('rev-js-manifest.json')) //生成mainfest.json文件
        .pipe(gulp.dest(_.zip.rev), console.log('/* -- 压缩JS成功 -- */\n'))
})

//MD5 css
gulp.task('minifycssmd5', async function() {
    await gulp.src(_.css.fs)
        .pipe(plumber())
        .pipe(concat('build.css')) //CSS整合到一个build.css文件里面
        .pipe(uglifyCss()) //压缩为一行
        .pipe(rename('build.min.css')) //重命名
        .pipe(rev()) //添加MDS后缀
        .pipe(gulp.dest(_.zip.css))
        .pipe(rev.manifest('rev-css-manifest.json')) //生成manifest文件
        .pipe(gulp.dest(_.zip.rev), console.log('/* -- 压缩CSS成功 -- */\n'))
})

//MD5 images
gulp.task('minifyimagemd5', async function() {
    await gulp.src(_.images.fs)
        .pipe(plumber())
        .pipe(rev())
        .pipe(gulp.dest(_.zip.image))
        .pipe(rev.manifest('rev-img-manifest.json'))
        .pipe(gulp.dest(_.zip.rev), console.log('/* -- 压缩IMAGE成功 -- */\n'))
})

//html压缩
gulp.task('minifyhtml', async function() {
    var options = {
        removeComments: true, //清除HTML注释
        collapseWhitespace: false, //压缩HTML
        collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
        minifyJS: true, //压缩页面JS
        minifyCSS: true //压缩页面CSS
    };
    await gulp.src(_.htmls.fs)
        .pipe(plumber())
        .pipe(gulpRemoveHtml()) //清除特定标签
        .pipe(removeEmptyLines({ removeComments: true })) //清除空白行
        .pipe(htmlmin(options))
        .pipe(gulp.dest(_.zip.html), console.log('/* -- 压缩HTML成功 -- */\n'));
});

//想删除投产文件 gulp cleanweb
gulp.task('cleanweb', async function() {
    await gulp.src(_.zip.file)
        .pipe(plumber())
        .pipe(clean(), console.log('/* -- web文件夹已删除！ -- */\n'))
})


// gulp.task('build', ['minifyjsmd5'])
// gulp.task('build', ['minifyjsmd5', 'minifycssmd5', 'minifyimagemd5', 'minifyhtml'])
gulp.task('build', gulp.series(gulp.parallel('minifyjsmd5', 'minifycssmd5', 'minifyimagemd5', 'minifyhtml')))




//处理无效css 源文件css与 指定html类名、id做匹配
gulp.task('simple', async function() {
    return await gulp.src('./build/style/textiles.css')
        .pipe(plumber())
        .pipe(uncss({
            html: ['./build/textiles.html']
        }))
        .pipe(gulp.dest('./out'));
});