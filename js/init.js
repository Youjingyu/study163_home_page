//检查cookie
(function(){
    //判断是否有不再提醒cookie，如果是，隐藏顶部通知栏
    if(Cookie.getCookie('closeRemind')=='yes'){
        var note=getElement('.note_parent')[0];
        note.className='note_parent hidden';
    }
    //检查是否有登陆成功和关注成功cookie，如果是，显示已关注
    if(Cookie.getCookie('loginSuc')=='success' && Cookie.getCookie('followSuc')=='success'){
        getElement('#follow_contain').innerHTML='<div class="follow_sunc">'
                                                +'<span>√已关注</span>'
                                                +'<span>|</span>'
                                                +'<a class="cancel">取消</a></div>';
        //为取消关注按钮注册事件
        cancelClick();
    } else{
        //若果没有关注，为关注按钮注册事件
        followBtnClick();
    }
})();

//初始化轮播图，并添加事件
(function() {
    var curIndex = 0, //当前index
        imgArr = getElement(".imglist")[0].getElementsByTagName("li"),//获取图片组
        infoArr = getElement(".infolist")[0].getElementsByTagName("span"),
        imgLen = imgArr.length;
    // 定时器自动变换5秒每次
    var autoChange = setInterval(function () {
        if (curIndex < imgLen - 1) {
            curIndex++;
        } else {
            curIndex = 0;
        }
        //调用变换处理函数
        Banner.changeTo(curIndex);
    }, 5000);
    addBannerEvent();
    //banner按钮的事件
    function addBannerEvent(){
        for (var i = 0; i < imgLen; i++) {
            //闭包防止作用域内活动对象item的影响
            (function (_i) {
                //鼠标滑过则清除定时器，并作变换处理
                infoArr[_i].onmouseover = function () {
                    clearTimeout(autoChange);
                    Banner.changeTo(_i);
                    curIndex = _i;
                };
                //鼠标滑出则重置定时器处理
                infoArr[_i].onmouseout = function () {
                    autoChange = setInterval(function () {
                        if (curIndex < imgLen - 1) {
                            curIndex++;
                        } else {
                            curIndex = 0;
                        }
                        //调用变换处理函数
                        Banner.changeTo(curIndex);
                    }, 5000);
                };
            })(i);
        }
    }
})();

//初始化课程列表
getCourse(1,20,10);

//加载右侧最热排行榜
(function(){
    function initHotCourse(data){
        var rankOne=getElement('.rank_list_one')[0];
        var rankTwo=getElement('.rank_list_two')[0];
        var rankListOne='',rankListTwo='';
        for(var i=0; i<10; i++){
            //第1到第10个课程的dom字符串
            rankListOne+='<div class="rank_list"><div class="list_img">'
                +'<img src="'+data[i].smallPhotoUrl+'">'
                +'</div><div class="list_detail"><div class="list_desc">'
                +'<span>'+data[i].name+'</span>'
                +'</div><div><img src="../images/learnerCount.png" class="learner_img">'
                +'<span class="learner">'+data[i].learnerCount +'</span>'
                +'</div></div></div>'
        }
        for(var j=10; j<20; j++){
            //第11到第20个课程的dom字符串，通过position：absolute隐藏在容器的底部
            rankListTwo+='<div class="rank_list"><div class="list_img">'
                +'<img src="'+data[j].smallPhotoUrl+'">'
                +'</div><div class="list_detail"><div class="list_desc">'
                +'<span>'+data[j].name+'</span>'
                +'</div><div><img src="../images/learnerCount.png" class="learner_img">'
                +'<span class="learner">'+data[j].learnerCount +'</span>'
                +'</div></div></div>'
        }
        rankOne.innerHTML=rankListOne;
        rankTwo.innerHTML=rankListTwo;
        //热门列表滚动,每5秒滚动一次
        setInterval(function(){
            //两部分课程同时滚动
            hotCourseScroll(rankOne);
            hotCourseScroll(rankTwo);
        },5000);
    }
    //var url='http://study.163.com/webDev/hotcouresByCategory.htm';
    var url = '../json/hotcoures.json';
    Ajax.get(url,initHotCourse);
})();

//为页面按钮注册点击事件
(function(){
    //不再提醒按钮
    var closeRemind=getElement('#closeRemind');
    closeRemind.onclick=function(){
        var note=getElement('.note_parent')[0];
        note.className='note_parent hidden';
        //设置不再提醒cookie
        Cookie.setCookie('closeRemind','yes',7);
    };
    //登录按钮
    var loginBtn=getElement('#loginBtn');
    loginBtn.onclick=function(){
        //md5加密账户信息
        var userName=getElement('#userName').value;
        userName=hex_md5(userName);
        var password=getElement('#passWord').value;
        password=hex_md5(password);
        //var url='http://study.163.com/webDev/login.htm?userName='+userName+'&password='+password;
        var url = '../json/login';
        Ajax.get(url,function(data){
            //登陆成功隐藏登陆窗口，设置登陆成功cookie
            if(data==1){
                Cookie.setCookie('loginSuc','success',7);
                var loginWindow=getElement('.login')[0];
                loginWindow.className='login hidden';
                //alert('登录成功');
            }
            if(data==0){
                alert('用户名或密码错误');
            }
        })
    }
    //关闭登录框按钮
    var closeBtn=getElement('#closeBtn');
    closeBtn.onclick=function(){
        var loginWindow=getElement('#loginWindow');
        loginWindow.className='login hidden';
    }
    //课程类型tab切换
    var product=getElement('#product');
    var program=getElement('#program');
    //切换到产品设计
    product.onclick=function(){
        program.className='';
        //切换到对应课程类型时，改变其tab样式
        product.className='onType';
        getCourse(1,20,10);
    };
    //切换到编程语言
    program.onclick=function(){
        product.className='';
        //切换到对应课程类型时，改变其tab样式
        program.className='onType';
        getCourse(1,20,20);
    };
    //打开视频窗口按钮
    getElement('#openVideo').onclick=function(){
        getElement('.videoPlayBg hidden')[0].className='videoPlayBg';
    }
    //关闭视频窗口按钮
    getElement("#closeVideo").onclick=function(){
        getElement('.videoPlayBg')[0].className='videoPlayBg hidden';
        var player=document.getElementsByTagName("video")[0];
        //关闭视频播放窗口，停止播放视频
        player.pause();
    }
})();
//为关注按钮添加事件函数
function followBtnClick(){
    var followBtn=getElement('#follow');
    if(followBtn) {
        followBtn.onclick = function () {
            //检查是否登陆成功
            if (Cookie.getCookie('loginSuc') == 'success') {
                getElement('#follow_contain').innerHTML = '<div class="follow_sunc">'
                                                        + '<span>√已关注</span>'
                                                        + '<span>|</span>'
                                                        + '<a class="cancel">取消</a></div>';
                //为取消按钮添加事件
                cancelClick();
                //设置关注cookie
                Cookie.setCookie('followSuc', 'success', 7);
            }
            //没有登陆，则弹出登录窗口
            else {
                getElement('#loginWindow').className = "login";
            }
        }
    }
}
//为取消关注按钮添加事件的函数
function cancelClick(){
    var cancel=getElement('.cancel')[0];
    if(cancel) {
        cancel.onclick = function () {
            getElement('#follow_contain').innerHTML = '<button  class="listen" id="follow">+&nbsp关注</button>';
            //为关注按钮添加事件
            followBtnClick();
            //将关注成功cookie置为空
            Cookie.setCookie('followSuc', '', 7);
        }
    }
}