var src = './src';	//存放开发的文件路径
var dest = './dist';	//编译处理后的文件路径
var transition = './transition';		//文件合并时存放的路径
var zip = './web';		//压缩投产最终路径

module.exports = {
	/*
		all 所有路径
		src 需要编译的路径
		dest 输出目录
		settings 编译less需要的配置
	*/
	less:{
		all: [src + '/less/**/**/*.less', src + '/less/**/*.less' ,src + '/less/*.less'],
		src: src + '/less/',
		dest: dest + '/css',
		fs: dest + '/css/*.css',
		settings: {

		}
	},

	/*
		all 找到src下js文件夹下的1~2目录
		src js需要编译的路径
		dest js输出目录
	*/
	babel:{
		all: [src + '/js/**/**/*.js', src + '/js/**/*.js' ,src + '/js/*.js'],
		src: src + '/js/',
		dest: dest + '/js',
		fs: dest + '/js/*.js'
	},

	/*
		src html需要编译的路径
		dest html输出目录
	*/
	jade:{
		all: [src + '/jade/**/**/*.jade', src + '/jade/**/*.jade',src + '/jade/*.jade'],
		src: src + '/jade/',
		dest: dest + '/html',
		fs: dest + '/html/*.html'
	},

	/*
		用来将html搬家到生成文件的对应文件夹
	*/
	htmls:{
		all: [src + '/html/**/**/*.html', src + '/html/**/*.html',src + '/html/*.html', src + '/*.html'],
		src: src + '/html/',
		dest: dest,
		fs: dest + '/*.html'
	},


	/*
		用来将css文件搬家到与less一个文件夹
	*/
	css:{
		all: [src + '/css/**/**/*.css', src + '/css/**/*.css' ,src + '/css/*.css'],
		src: src + '/css/',
		dest: dest + '/css',
		fs: dest + '/css/*.css',
	},

	/*
		用来将js文件搬家到生成文件的对应文件夹
	*/
	js:{
		all: [src + '/js/**/**/*.js', src + '/js/**/*.js',src + '/js/*.js'],
		src: src + '/js/',
		dest: dest + '/js',
		fs: dest + '/js/*.js'
	},

	/*
		用来将模拟数据文件搬家到生成文件的对应文件夹
	*/
	mock:{
		all: [src + '/mock/**/**/*', src + '/mock/**/*',src + '/mock/*'],
		src: src + '/mock/',
		dest: dest + '/mock',
		fs: dest + '/mock/*'
	},

	/*
		src image需要编译的路径
		dest image输出目录
	*/
	image:{
		src: [src + '/images/**/**/*', src + '/images/**/*',src + '/images/*'],
		dest: dest + '/images',
		fs: dest + '/images/*'
	},

	//公共资源

	public:{
		all: src + '/static/*',
		dest: dest + '/public',
	},
	/*
		src 清理文件的路径
	*/	
	clean:{
		dest: dest
	},

	/*
		过渡整合文件
	*/	
	transit: {
		file: transition,
		js: transition + '/js',
		html: transition + '/html',
		css: transition + '/css',
		image: transition + '/image',
		static: transition + '/static',
	},

	/*
		投产文件
	*/	
	zip: {
		file: zip,
		js: zip + '/js',
		html: zip + '/views',
		css: zip + '/css',
		image: zip + '/image',
		public: zip + '/static',
		rev: zip + '/rev',
		md5: zip + '/md5',
	}
}