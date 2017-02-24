var gulp = require('gulp');
var inject = require('gulp-inject');
var edit = require('gulp-edit');

gulp.task('injectIntoJs',function(){
	 return gulp.src('files.js')
	  .pipe(inject(gulp.src(['webpage/**/*.js'], {read: false}), {
	    starttag: '/*inject:begin*/',
	    endtag: '/*inject:end*/',
	    transform: function (filepath, file, i, length) {
	      return '  "' + filepath + '"' + (i + 1 < length ? ',' : '');
	    }
	  }))
	  .pipe(gulp.dest('./'));
});


gulp.task('edit',['injectIntoJs'], function() {
  return gulp.src('files.js')
    .pipe(edit(function(src, cb){
      // this === file 
      var startIndex=src.indexOf('/*inject:begin*/');
      var endIndex=src.indexOf('/*inject:end*/');
      var front=src.substring(0,startIndex+16);
      var back=src.substring(endIndex);
      console.log('开始位置',startIndex,'结束位置',endIndex);
      //+16是为了剔除  开始tag
      var target=src.substring(startIndex+16,endIndex);
      // 去掉换行符和空格,引号也删掉（命名中不能有空格）
      var newTar=target.replace(/\s/g,'');
       // console.log(newTar);

      var arr=newTar.split(",");
       // console.log(arr);
      var obj={};
      arr.forEach(function(value,index,array){
            var temp=value.split('/');
             // console.log(temp);
             temp.splice(0,2)
             temp.splice(temp.length-1);
             var key=temp.join("-")
            if(!obj[key]){
                obj[key]=[];
            }
            obj[key].push(value);
        })
      var str='';
      for(key in obj){
      	str=str+"'"+key+"':";
      	str=str+"["+obj[key]+"],\n";
      }
      src=front+"\n"+str+"\n"+back;
      console.log(src)


      var err = null
      // src += '- modified!'
      cb(err, src)
    }))
    .pipe(gulp.dest('./'))
})


gulp.task('default', ['edit']);