var vm = new Vue({

    el: "#app",
    name: '',
    components: {},
    props: {},
    data() {
        return {
            beginClientX: 0,
            /*距离屏幕左端距离*/
            mouseMoveStata: false,
            /*触发拖动状态 判断*/
            // maxwidth: 258,
            maxwidth: 554,
            /*拖动最大宽度，依据滑块宽度算出来的*/
            confirmWords: '拖动滑块验证',
            /*滑块文字*/
            confirmSuccess: false, /*验证成功判断*/
            shows:false,  /*弹框显示隐藏*/
            verification:'',/*弹框内容*/
            /*控制输入框的交互状态 begin*/
            controlUsername:false,
            controlPassword:false,
            /*控制输入框的交互状态 end*/
        }
    },
    created(){},
    mounted(){
        location.reload();
    },
    watch: {},
    methods: {
        mousedownFn: function(e) {
            this.mouseMoveStata = true;
            this.beginClientX = e.clientX;
        }, //按下滑块函数
        successFunction() {
            $(".handler").removeClass('handler_bg').addClass('handler_ok_bg');
            this.confirmWords = '验证通过'
            $(".drag").css({
                'color': '#fff'
            });
            $(".drag").css({
                'background-color': '#13CE66'
            });
            $(".handler").css({
                'left': this.maxwidth
            });
            $(".drag_bg").css({
                'width': this.maxwidth
            });
            $('body').unbind('mousemove');
            $('body').unbind('mouseup');
            this.confirmSuccess = true;

        }, //验证成功函数
        userAdd:function(){
            var userName=this.$refs.userName.value;
            var password=this.$refs.password.value;
            if(userName.trim()===''||userName.trim()===null){
                this.shows=true;
                this.verification='用户名不能为空';
                setTimeout( ()=> {
                    this.shows=false;
                },1000)
                return false;
            }else if(password.trim()===''||password.trim()===null){
                this.shows=true;
                this.verification='密码不能为空';
                setTimeout( ()=> {
                    this.shows=false;
                },1000)
                return false;
            }else if(password.length<6){
                this.shows=true;
                this.verification='密码不能小于六位字符';
                setTimeout( ()=> {
                    this.shows=false;
                },1000)
                return false;
            }else if(this.confirmSuccess===false){
                this.shows=true;
                this.verification='请拖动滑块';
                setTimeout( ()=> {
                    this.shows=false;
                },1000)
                return false;
            }
            axios
                .post(serverUrl+'/login',
                {
                    username:userName,
                    password:md5(password),

                })
                .then(response => {
                        if(response.data.code==1){
                            //设置登陆session和时间
                            this.userInfo=response.data.userInfo;
                            sessionStorage.setItem('user', JSON.stringify(this.userInfo));
                            var time = parseInt(new Date().getTime() / 1000);
                            sessionStorage.setItem('startTime', time);

                            this.shows=true;
                            this.verification=response.data.msg;
                             setTimeout( ()=> {
                            this.shows=false;
                            
                            },1000)
                            setTimeout( ()=> {
                            window.location.href="./ldapUser.html"
                        },1000)
                        }else{
                            this.shows=true;
                            this.verification=response.data.msg;
                            setTimeout( ()=> {
                            this.shows=false;
                        },1000) 
                        }
                   
                    
                })

        }, //验证表单字段
        //表达交互样式 begin
        focus(){
            this.controlUsername=true;
        },
        blur(){
            this.controlUsername=false;

        },
        focusPassword(){
            this.controlPassword=true;
        },
        blurPassword(){
            this.controlPassword=false;
        },
    //    表单交互样式 end
    },
    mounted() {
        //console.log(this.$el)
        $('body').on('mousemove', (e) => {
            //拖动，这里需要用箭头函数，不然this的指向不会是vue对象
            if(this.mouseMoveStata) {
                var width = e.clientX - this.beginClientX;
                if(width > 0 && width <= this.maxwidth) {
                    $(".handler").css({
                        'left': width
                    });
                    $(".drag_bg").css({
                        'width': width
                    });
                } else if(width > this.maxwidth) {
                    this.successFunction();
                }
            }
        });
        $('body').on('mouseup', (e) => {
            //鼠标放开
            this.mouseMoveStata = false;
            var width = e.clientX - this.beginClientX;
            if(width < this.maxwidth) {
                $(".handler").css({
                    'left': 0
                });
                $(".drag_bg").css({
                    'width': 0
                });
            }
        })
    }
});