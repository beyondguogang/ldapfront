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
            //email:'guogang1201@163.com',
            /*控制输入框的交互状态 begin*/
            controlPassword:false,
            controlRepassword:false,
            /*控制输入框的交互状态 end*/
            cn:"",
            email:"",
        }
    },
    created() {
        this.cn=unescape(getUrlParam("cn"));
        this.email=getUrlParam("email");
        var key=getUrlParam("key");
        var time=getUrlParam("time");
        var signData={key:key,time:time,uid:this.cn};
        var signStatus=this.verifySign(signData);
        console.log("aaaaaaaaaaa",key);
        if(signStatus.code==1){
            /* this.shows=true;
            this.verification='签名不正确';
            setTimeout( ()=> {
                this.shows=false;
            },2000)
            $("#app").css("display","none");
            return false; */
            this.verification='签名不正确';
            alert(this.verification);
            $("#app").css("display","none");
            return false;
        }

        if(this.cn==""||this.email==""){
            /* this.shows=true;
            this.verification='此页不可编辑，缺少必要cn';
            setTimeout( ()=> {
                this.shows=false;
            },2000)
            $("#app").css("display","none");
            return false; */
            this.verification='此页不可编辑，缺少必要cn';
            alert(this.verification);
            $("#app").css("display","none");
            return false;
        }
    },
    computed:{
    },
    watch: {
    },
    methods: {
        verifySign(data){
            var sign=data['key'];
            var timestamp = Number(Date.parse(new Date()))/1000;
            if((timestamp-Number(data["time"])>(60*15))){
                return {code:1,msg:"签名已过期"};
            }
            
            var localSign=this.createSign(data);
            console.log(localSign);
            if(sign!=localSign){
                return {code:1,msg:"签名不正确"};
            }
            return {code:0,msg:"验证成功"};
            
        
        },

        createSign(param){
            var secret="a791baf0368a821630413272018f1ed5";
            var str=param.uid+param.time+"&&"+secret;
            var sign=md5(str);
            return sign;
        },
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
        submit(){
            let email=this.$refs.email.value;
            let password=this.$refs.password.value;
            let repassword=this.$refs.repassword.value;
           if(password.trim()===''||password.trim()===null){
               this.shows=true;
               this.verification='密码不能为空';
               setTimeout( ()=> {
                   this.shows=false;
               },1000)
               return false;
           }else if(password.length<6){
               this.shows=true;
               this.verification='请最少填写六位字符';
               setTimeout( ()=> {
                   this.shows=false;
               },1000)
               return false;
           }
           else if(repassword.trim()===''||repassword.trim()===null){
               this.shows=true;
               this.verification='确认密码不能为空';
               setTimeout( ()=> {
                   this.shows=false;
               },1000)
               return false;
           }
           else if(repassword!==password){
               this.shows=true;
               this.verification='请填写一致的密码';
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
           axios.post(serverUrl+'/modifyPwd',
               {
               cn:this.cn,
               password:password
               }
           ).then(res=>{
               this.shows=true;
               this.verification=res.data.msg;
               setTimeout( ()=> {
                   this.shows=false;
                   window.location.href='register.html';
               },1000)
           })
        },//验证表单字段
        //表达交互样式 begin
        focusPassword(){
            this.controlPassword=true;
        },
        blurPassword(){
            this.controlPassword=false;
        },
        focusRepassword(){
            this.controlRepassword=true;
        },
        blurRepassword(){
            this.controlRepassword=false;
        },
        //    表单交互样式 end
    },
    mounted() {
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
        });

    }
});