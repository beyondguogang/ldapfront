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
            // maxwidth: 454,
            maxwidth: 554,
            /*拖动最大宽度，依据滑块宽度算出来的*/
            confirmWords: '拖动滑块验证',
            /*滑块文字*/
            confirmSuccess: false, /*验证成功判断*/
            shows:false,  /*弹框显示隐藏*/
            verification:'',/*弹框内容*/
            /*控制输入框的交互状态 begin*/
            controlUsername:false,
            controlRealname_surname:false,
            controlRealname_name:false,
            controlEmail:false,
            controlDepartment:false,
            controlPhone:false,
            controlPassword:false,
            controlRepassword:false,
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
            var realName_surname=this.$refs.realName_surname.value;
            var realName_name=this.$refs.realName_name.value;
            var email=this.$refs.email.value;
            var department=this.$refs.department.value;
            console.log("department:"+department);
            var phone=this.$refs.phone.value;
            var password=this.$refs.password.value;
            var repassword=this.$refs.repassword.value;
            if(userName.trim()===''||userName.trim()===null){
                this.shows=true;
                this.verification='用户名不能为空';
                setTimeout( ()=> {
                    this.shows=false;
                },1000)
                return false;
            }else if(realName_surname.trim()===''||realName_surname.trim()===null){
                this.shows=true;
                this.verification='姓不能为空';
                setTimeout( ()=> {
                    this.shows=false;
                },1000)
                return false;
            }else if(realName_name.trim()===''||realName_name.trim()===null){
                this.shows=true;
                this.verification='名不能为空';
                setTimeout( ()=> {
                    this.shows=false;
                },1000)
                return false;
            }else if(!/^([a-zA-Z]|[0-9]|[\.])(\w|\-|\.)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(email)){
                alert(1)
                this.shows=true;
                this.verification='请输入正确格式的邮箱';
                setTimeout( ()=> {
                    this.shows=false;
                },1000)
                return false;
            }else if(department.trim()===''||department.trim()===null){
                this.shows=true;
                this.verification='请输入正确的部门';
                setTimeout( ()=> {
                    this.shows=false;
                },1000)
                return false;
            }else if(!(/^1[3456789]\d{9}$/.test(phone))){
                this.shows=true;
                this.verification='请输入正确的电话号码';
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
            } else if(repassword.trim()===null||repassword.trim()===''){
                this.shows=true;
                this.verification='确认密码不能为空';
                setTimeout( ()=> {
                    this.shows=false;
                },1000)
                return false;
            } else if(password!==repassword){
                this.shows=true;
                this.verification='输入的两次密码不相同';
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
                .post(serverUrl+'/ldapUserAdd',
                {
                    cn:userName,
                    sn:realName_surname,
                    givenName:realName_name,
                    uid:userName,
                    phone:phone,
                    email:email,
                    department:department,
                    password:password,

                })
                .then(response => {
                        if(response.data.code==1){
                            this.shows=true;
                            this.verification=response.data.msg;
                             setTimeout( ()=> {
                            this.shows=false;
                            
                            },3000)
                            setTimeout( ()=> {
                            window.location.reload();
                        },3000)
                        }else{
                            this.shows=true;
                            this.verification=response.data.msg;
                            setTimeout( ()=> {
                            this.shows=false;
                        },3000) 
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
        focusRealname_surname(){
            this.controlRealname_surname=true;
        },
        blurRealname_surname(){
            this.controlRealname_surname=false;
        },
        focusRealname_name(){
            this.controlRealname_name=true;
        },
        blurRealname_name(){
            this.controlRealname_name=false;
        },
        focusEmail(){
            this.controlEmail=true;
        },
        blurEmail(){
            this.controlEmail=false;
        },
        focusDepartment(){
            this.controlDepartment=true;
        },
        blurDepartment(){
            this.controlDepartment=false;
        },
        focusPhone(){
            this.controlPhone=true;
        },
        blurPhone(){
            this.controlPhone=false;
        },
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