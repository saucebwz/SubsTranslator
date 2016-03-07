var gulp = require('gulp'),
    jade = require('gulp-jade'),
    lr = require('tiny-lr'),
    livereload = require('gulp-livereload'),
    server = lr();



gulp.task('jade', function(){
  gulp.src('./assets/templates/*.jade').pipe(jade({
    pretty: true,
    data: {
      title: "Subs"
    }
  })).on('error', console.log)
  .pipe(gulp.dest('./_includes/'))
  .pipe(livereload(server));
});

gulp.task('watch', function(){
  server.listen(35729, function(err){
    if(err) return console.log(err);
    gulp.watch('./assets/templates/*.jade', ['jade']);
  })
})

gulp.task('default', ['jade'])
