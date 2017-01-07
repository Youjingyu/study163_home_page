//简单封装获取dom对象的函数
function getElement(str){
    var selectType=str.substr(0,1),
        select=str.substr(1);
    if(selectType=='#'){
        return document.getElementById(select)  //id选择器
    }
    else if(selectType=='.'){       //class选择器
        if(document.getElementsByClassName){
            return document.getElementsByClassName(select)
        }
        //处理不支持getElementsByClassName的浏览器
        else{
            var tag= document.getElementsByTagName('*');
            var tagAll = [];
            for (var i = 0; i < tag.length; i++) {   //遍历所有元素，如果className相等，就赋值给tagnameAll
                    if(tag[i].className==select){
                        tagAll.push(tag[i]);
                }
            }
            return tagAll;
        }
    }
    else{
        return document.getElementsByTagName(str)  //标签选择器
    }
};
//Ajax对象
var Ajax={
    get : function(url,sucfunc){
        var data;
        var xmlhttp=new XMLHttpRequest();
        xmlhttp.onreadystatechange=function() {
            if (xmlhttp.readyState==4 && xmlhttp.status==200) {
                data=JSON.parse(xmlhttp.responseText);
                sucfunc(data);      //ajax的回调函数
                console.log('ajax success');
            }
        }
        xmlhttp.open("GET",url,true);
        xmlhttp.send();
    }
};
//Cookie对象
var Cookie={
    setCookie : function(c_name,value,expiredays){
        var exdate=new Date();
        exdate.setDate(exdate.getDate()+expiredays);
        document.cookie=c_name+ "=" +escape(value)+ ((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
    },
    getCookie : function(c_name){
        if (document.cookie.length>0) {
            var c_start=document.cookie.indexOf(c_name + "=");
            if (c_start!=-1) {
                c_start=c_start + c_name.length+1
                var c_end=document.cookie.indexOf(";",c_start);
                if (c_end==-1) c_end=document.cookie.length;
                return unescape(document.cookie.substring(c_start,c_end))
            }
        }
        return ""
    }
};
//轮播对象
var Banner={
    //设置元素透明度
    setOpacity:function(ele,level){
        if(ele.filters){
            ele.style.filter = "alpha(opacity="+level+")";  // 处理不支持opacity的浏览器
        }else{
            ele.style.opacity = level / 100;
        }
    },
    //元素淡入效果，调用setOpacity方法通过多次设置透明度实现
    fadeIn : function(ele){
        Banner.setOpacity(ele,0); //初始全透明
        for(var i = 0; i<21; i++){ //透明度改变 20 * 5 = 100
            (function(){
                var level = i * 5;  //透明度每次变化值
                setTimeout(function(){
                    Banner.setOpacity(ele, level);
                }, i*25); //i * 25 即为每次改变透明度的时间间隔
            })(i);     //每次循环变化一次
        }
    },
    //切换到指定banner
    changeTo : function(index){
        var curImg = getElement(".imgOn")[0],
            curInfo = getElement(".infoOn")[0];
        curImg.className='';    //隐藏当前 image
        curInfo.className='';
        var pointImg= getElement(".imglist")[0].getElementsByTagName('li')[index],
            pointInfo= getElement(".infolist")[0].getElementsByTagName('span')[index];
        pointImg.className='imgOn';
        pointInfo.className='infoOn';
        Banner.fadeIn(pointImg)//淡入目标 image
    }
}
//获取课程列表
function getCourse(pageNo,psize,type){
    function initCourse(data){
        //将课程列表和页码动态加入html
        var course=getElement('.course_list')[0];
        var courseList='',
            price='';
        for(var i=0; i<psize; i++){
            price=data.list[i].price=='0'? '免费' : '¥'+data.list[i].price;
            //courseList为要插入html的课程信息dom字符串，课程详情部分display：none
            courseList+='<div class="course_list_item"><a><div><img class="course_img" src="'+data.list[i].middlePhotoUrl +'"></div>'
                    +'<div>'+data.list[i].name+'</div>'
                    +'<div>'+data.list[i].provider+'</div>'
                    +'<div><img src="../images/learnerCount.png" class="learner_img">'+data.list[i].learnerCount+'</div>'
                    +'<div>'+price+'</div>' +'</a>'
                    +'<div class="course_detail hidden"><div class="detail"><div class="detail_img">'
                    +'<img src="'+data.list[i].middlePhotoUrl+'" class="course_img">'
                    +'</div><div class="detail_item">'
                    +'<h4>'+data.list[i].name+'</h4>'
                    +'<div><img src="../images/learnerCount.png" class="learner_img">'+data.list[i].learnerCount+'</div>'
                    +'<div>发布者：'+data.list[i].provider+'</div>'
                    +'<div>分类：'+data.list[i].categoryName +'</div>'
                    +'</div></div><div class="detail_descri">'+data.list[i].description+'</div></div>'
                    +'</div>';
        };
        var page='';
        //如果总页数大于8，根据当前页码显示其前后的页码
        if(data.totalPage>8){
            //当前页码大于5且比最大值小4时，将当前页码显示在中间
            var pageNum=pageNo>5 ? pageNo-4 : 1;
            if(pageNum+8>data.totalPage){
                for(var j=data.totalPage; j>data.totalPage-8 ;j--){
                    //改变当前页码按钮的字体颜色
                    if(j==pageNo){
                        page+='<li class="page_num onPage">'+j+'</li>';
                    } else{
                        page+='<li class="page_num">'+j+'</li>';
                    }
                }
            } else{
                for(var j=pageNum+7; j>pageNum-1 ;j--){
                    //改变当前页码按钮的字体颜色
                    if(j==pageNo){
                        page+='<li class="page_num onPage">'+j+'</li>';
                    } else{
                        page+='<li class="page_num">'+j+'</li>';
                    }
                }
            }
        }
        //如果总页数小于8，则显示所有页码
        else{
            for(var j=data.totalPage; j>0 ;j--){
                //改变当前页码按钮的字体颜色
                if(j==pageNo){
                    page+='<li class="page_num onPage">'+j+'</li>';
                } else{
                    page+='<li class="page_num">'+j+'</li>';
                }
            }
        }
        //插入课程列表和页码
        course.innerHTML='<div>'+courseList+'</div>'+
                        '<div class="page"><ul><li class="next">&gt</li>'+
                        page+
                        '<li class="prev">&lt</li></ul></div>';
        //添加翻页事件
        addPageEvent();
        //鼠标悬停事件
        hover();
    };
    var url='http://study.163.com/webDev/couresByCategory.htm?'+"pageNo="+pageNo+'&'+"psize="+psize+'&'+"type="+type;
    Ajax.get(url,initCourse);
}
//鼠标悬停显示课程的详细信息
function hover(){
    var course=getElement('.course_list_item');
    for(var i=0; i<course.length; i++){
        //闭包处理
        (function(_i){
        course[_i].onmouseover=function(event){

            var e=event||window.event;
            //避免子元素触发onmouseover要做的操作
            if(fixedMouse(e, this)) {
                var course_detail;
                //处理不支持getElementsByClassName的浏览器
                if(document.getElementsByClassName){
                    course_detail = this.getElementsByClassName('course_detail hidden')[0];
                } else{
                    var tagAll=this.getElementsByTagName('*');
                    for(var j=0; j<tagAll.length; j++){
                        if(tagAll[j].className=='course_detail hidden'){
                            course_detail=tagAll[j];
                            break;
                        }
                    }
                }
                //显示课程详情
                course_detail.className = 'course_detail';
                //当鼠标移出课程详情框，隐藏课程详情
                course_detail.onmouseout = function (event) {
                     var e = event||window.event;
                    if (fixedMouse(e, this)) {
                        this.className = 'course_detail hidden';
                    }
                }
            }
        }
        })(i);
    }
}
//为页码按钮添加事件
function addPageEvent(){
    var courseType,
        curType=getElement('#product');
    //根据选择的tab类型，确定获取课的程type
    //若果第一个tab的className=='onType'，课程类型是10，否则是20
    if(curType.className=='onType'){
        courseType=10;
    } else{
        courseType=20;
    }
    var pageBtn=getElement('.page_num');
    var curPage;
    for(var i=0; i<pageBtn.length; i++){
        //为页码按钮添加事件
        pageBtn[i].onclick=function(event){
            //通过当前按钮的innerHTML获取请求的pageNum
            var pageNum=parseInt(this.innerHTML);
            getCourse(pageNum,20,courseType);
        }
        if(pageBtn[i].className=='page_num onPage'){
            //将当前页码保存下来，供上一页、下一页按钮使用
            curPage=parseInt(pageBtn[i].innerHTML);
        }
    }
    getElement('.prev')[0].onclick=function(){
        //如果当前页码为1，点击上一页按钮不做处理
        //var url='http://study.163.com/webDev/couresByCategory.htm?'+"pageNo="+2+'&'+"psize="+20+'&'+"type="+10;
        //Ajax.get(url,function(){
        //    console.log(1)
        //});
        if(curPage-1<1){
            return
        } else{
            getCourse(curPage-1,20,courseType);
        }
    }
    getElement('.next')[0].onclick=function(){
        var totalPage=parseInt(pageBtn[0].innerHTML);
        //如果当前页码为等于最大值，点击下一页按钮不做处理
        if(curPage+1>totalPage){
            return
        } else{
            getCourse(curPage+1,20,courseType);
        }
    }
}
//热门课程滚动动画函数
function hotCourseScroll(ele){
    //如果课程列表滚动到最顶部，直接移到最底部，等待下一次滚动
    if(parseInt(ele.style.top)<-699){
        ele.style.top='700px';
    }
    for(var i = 0; i<35; i++){ //top属性值改变 14 * 5 = 70
        (function(){
            setTimeout(function(){
                //每次改变top值2px
                ele.style.top=parseInt(ele.style.top)-2+'px';
            }, i*25); //i * 25 即为每次改变top属性的时间间隔
        })(i);     //每次循环变化一次
    }
}
/*处理mouseover和mouseout事件，防止事件在元素内部多次触发，start*/
//判断元素之间的包含关系
function contains(p,c){
    return p.contains ?
    p != c && p.contains(c) :
        !!(p.compareDocumentPosition(c) & 16);
}
//判断当前元素是否是注册事件元素的子元素，如果是返回false
function fixedMouse(e,target){
    var related,
        type=e.type.toLowerCase();//获取事件名字
    if(type=='mouseover'){
        related=e.relatedTarget||e.fromElement
    }else if(type=='mouseout'){
        related=e.relatedTarget||e.toElement
    }else return true;
    return related && related.prefix!='xul' && !contains(target,related) && related!==target;
}
/*封装mouseover和mouseout事件，防止事件在元素内部多次触发，end*/
