var gulp = require('gulp'), 
    inline = require('gulp-inline'),
    rename = require('gulp-rename');
    minifyJs = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    minifyHTML = require('gulp-minify-html');

gulp.task('minifyCss', function() {
	return gulp.src('css/*.css')
		.pipe(minifyCss())
		.pipe(rename({
            suffix: '.min'
        }))
		.pipe(gulp.dest('dist'));
});

gulp.task('minifyJs', function() {
	return gulp.src('js/*.js')
		.pipe(minifyJs())
		.pipe(rename({
            suffix: '.min'
        }))
		.pipe(gulp.dest('dist'));
});

gulp.task('inline', ['minifyCss', 'minifyJs'], function() {
	var opts = {
	    empy: true,
	    spare: true
	};

	return gulp.src('index.htm')
		.pipe(minifyHTML(opts))
  		.pipe(inline({
	    	base: '/'
	  	}))
  		.pipe(gulp.dest('dist'));
});

gulp.task('default', ['inline']);
