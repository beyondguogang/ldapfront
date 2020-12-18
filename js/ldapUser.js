let vm=new Vue({
    el:'#app',
    data:{
        //弹框的显示隐藏
        shows:false,
        page:1,
        uid:"",
        userList:"",
        total:0,
        pageNum:0,
        userInfo:"",
        //密码框的显示隐藏
        modify_shows:false,
        //重置密码框显示隐藏
        reset_shows:false,
        adUserName:"",
        verification:'',
        p_shows:false
    },

    mounted() {
        var user=sessionStorage.getItem('user');
        if(user==""||user==null ||user==undefined ||user=='null'){
            window.location.href="./login.html";
            return false;
        }
        var startTime=sessionStorage.getItem('startTime');
        var time=parseInt(new Date().getTime()/1000);
        var timeCha=(time-startTime)-(30*60);
        if(timeCha>0){
            sessionStorage.setItem('user',null);
            window.location.href="./login.html";
            return false;
        }


        this.getUserList();
    },
    computed:{
        // num:function(){
        //     return this.userList.forEach((item,index)=>{
        //          index+(this.page-1)*15
        //     })
        // }
    },
    methods: {
        //重置密码弹框
        reset_pas(cn){
            //获取用户信息
            this.$refs.userN.innerHTML=cn;
            this.reset_shows=true;
        },
        //关闭重置弹框
        reset_close(){
            this.reset_shows=false;
        },
        //确定修改
        resetSubmit(){
            //调用修改用户密码
            var username=this.$refs.userN.innerHTML;
            var userPwd=this.$refs.userPwd.value;
            var userRePwd=this.$refs.userRePwd.value;
            if(userPwd!==userRePwd){
                // alert("输入的两次密码不一致");
                this.p_shows=true;
                this.verification='输入的两次密码不一致';
                setTimeout( ()=> {
                    this.p_shows=false;
                },1000)
                return false;
            }

            var url=serverUrl+'/modifyPwd';
            axios
            .post(url,{
                cn:username,
                password:userPwd
            })
            .then(response => {
                var code=response.data.code;
                //  alert(response.data.msg);
                this.p_shows=true;
                this.verification=response.data.msg;
                setTimeout( ()=> {
                    this.p_shows=false;
                },1000)
                this.reset_shows=false;
                
            })

        },
        //修改密码弹框
        modify_pas(){
            //获取管理员信息
            var admin=sessionStorage.getItem('user');
            var adminInfo=JSON.parse(admin);
            this.adUserName=this.$refs.adUserName.innerHTML=adminInfo.username;

            //展示管理员信息
            this.modify_shows=true;
        },
        //关闭修改密码框
        modify_close(){
            this.modify_shows=false;
        },
        //确定修改
        modifySubmit(){
            //调用管理员修改密码接口
            var username=this.$refs.adUserName.innerHTML;
            var adPwd=this.$refs.adminPwd.value;
            var adRePwd=this.$refs.adminRePwd.value;
            if(adPwd!==adRePwd){
                // alert("输入的两次密码不一致");
                this.p_shows=true;
                this.verification='输入的两次密码不一致';
                setTimeout( ()=> {
                    this.p_shows=false;
                },1000)
                return false;
            }

            var url=serverUrl+'/modifyAdminPwd';
            axios
            .post(url,{
                username:username,
                password:md5(adPwd)
            })
            .then(response => {
                var code=response.data.code;
                // alert(response.data.msg);
                this.p_shows=true;
                this.verification=response.data.msg;
                console.log(this.verification)
                setTimeout( ()=> {
                    this.p_shows=false;
                },1000)
                this.modify_shows=false;
                
            })


        },
        // 控制弹框显示
        editUserShow(e){
            var uid=e.target.getAttribute('user_uid');
            var url=serverUrl+'/ldapGetUserInfo?uid='+uid;
            axios
                .get(url)
                .then(response => {
                    this.userInfo=response.data.userInfo[0];
                    console.log(this.userInfo)
                    if(this.userInfo!==undefined){
                        $("#u_uid").val(this.userInfo.uid);
                        $("#u_mail").val(this.userInfo.mail);
                        $("#u_cn").val(this.userInfo.cn);
                        $("#u_sn").val(this.userInfo.sn);
                    }
                    
                    
                    this.shows=true;
                })
            
        },

        // 控制弹框显示
        editUserSubmit(){
            var uid=$("#u_uid").val();
            var mail=$("#u_mail").val();
            var cn=$("#u_cn").val();
            var sn=$("#u_sn").val();
            var url=serverUrl+'/modifyUser';
            axios
                .post(url,{
                    uid:uid,
                    mail:mail,
                    cn:cn,
                    sn:sn
                })
                .then(response => {
                   alert(this.userInfo=response.data.msg);
                   this.getUserList();
                   this.shows=false;
                })
            
        },

        //用户删除Del
        userDel(e){
            var cn=e.target.getAttribute('user_cn')
            var url=serverUrl+'/delUser';
            axios
                .post(url,{
                    cn:cn
                })
                .then(response => {
                   alert(this.userInfo=response.data.msg);
                   this.getUserList();
                })
            
        },
        //关闭弹框
        close(){
            this.shows=false;
        },

        //获取用户列表
        getUserList:function(){
            var url=serverUrl+'/ldapUserList?page='+this.page;
            if(this.uid!==""){
                url+="&&uid="+this.uid;
            }

            axios
                .get(url)
                .then(response => {
                    this.userList=response.data.userList;
                    this.total=response.data.total;
                    this.pageNum=response.data.pageNum;

                })
        },

        //首页
        firstPage:function(){
            this.page=1;
            this.getUserList();
        },

        //上一页
        prePage:function(){
            if(this.page>1){
                this.page=this.page-1;
            }
            this.getUserList();
        },
        //下一页
        nextPage:function(){
            if(this.page<this.pageNum){
                this.page=this.page+1;
            }
            this.getUserList();
        },
        //尾页
        footPage:function(){
            this.page=this.pageNum;
            this.getUserList();
        },

        //搜索
        userSearch:function(){
            this.uid=this.$refs.uid.value;
            this.page=1;
            this.getUserList();

        },
    },
    computed: {
        
    }
});