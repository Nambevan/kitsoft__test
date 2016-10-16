var gulp       = require('gulp'), // Подключаем Gulp
	sass         = require('gulp-sass'),
	scss         = require('gulp-scss'),//Подключаем Sass пакет,
	browserSync  = require('browser-sync'), // Подключаем Browser Sync
	concat       = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
	uglify       = require('gulp-uglifyjs'), // Подключаем gulp-uglifyjs (для сжатия JS)
	cssnano      = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
	rename       = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
	del          = require('del'), // Подключаем библиотеку для удаления файлов и папок
	imagemin     = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
	pngquant     = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
	cache        = require('gulp-cache'), // Подключаем библиотеку кеширования
	autoprefixer = require('gulp-autoprefixer');// Подключаем библиотеку для автоматического добавления префиксов



gulp.task('scss', function(){
	return gulp.src('app/scss/**/*.scss') 
		.pipe(sass()) 
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
		.pipe(gulp.dest('app/css')) 
		.pipe(browserSync.reload({stream: true})) 
});

gulp.task('browser-sync', function() { 
	browserSync({ 
		server: { 
			baseDir: 'app' 
		},
		notify: false 
	});
});

gulp.task('scripts', function() {
	return gulp.src('app/js/common.js')
		.pipe(concat('common.min.js')) 
		.pipe(uglify())
		.pipe(gulp.dest('app/js')); 
});

gulp.task('css-libs', ['scss'], function() {
	return gulp.src(['app/css/main.css','app/css/adaptive.css','app/libs/bootstrap.css','app/libs/font-awesome.css']) 
		.pipe(concat('main.min.css'))
		.pipe(cssnano()) 
		.pipe(gulp.dest('app/css')); 
});

gulp.task('watch', ['browser-sync', 'css-libs', 'scripts'], function() {
	gulp.watch('app/scss/**/*.scss', ['scss']); 
	gulp.watch('app/*.html', browserSync.reload); 
	gulp.watch('app/js/**/*.js', browserSync.reload);  
});

gulp.task('clean', function() {
	return del.sync('dist'); 
});

gulp.task('img', function() {
	return gulp.src('app/img/**/*') 
		.pipe(cache(imagemin({  
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest('dist/img')); 
});

gulp.task('build', ['clean', 'img', 'scss', 'scripts'], function() {

	var buildCss = gulp.src('app/css/main.min.css')
	.pipe(gulp.dest('dist/css'))

	var buildFonts = gulp.src('app/fonts/**/*') 
	.pipe(gulp.dest('dist/fonts'))

	var buildJs = gulp.src('app/js/**/*') 
	.pipe(gulp.dest('dist/js'))

	var buildHtml = gulp.src('app/*.html') 
	.pipe(gulp.dest('dist'));

	var buildslick = gulp.src('app/libs/slick/**/*')
		.pipe(gulp.dest('dist/libs'));

	var buildjquerry = gulp.src('app/libs/jquery-3.1.0.min.js')
	    .pipe(gulp.dest('dist/libs'));
});

gulp.task('clear', function (callback) {
	return cache.clearAll();
})

gulp.task('default', ['watch']);
