{
    view={
        el:"upload"
    },
    model={
        data:{

        }
    },
    controller={
        init(view,model){
            this.view = view
            this.model = model
            var observable = qiniu.upload(file, key, token, putExtra, config)
            var subscription = observable.subscribe(observer) // 上传开始
            // or
            var subscription = observable.subscribe(next, error, complete) // 这样传参形式也可以
            subscription.unsubscribe() // 上传取消
            console.log(qiniu);
            
        },
        initQiniu(){
            var uploader = Qiniu.uploader({
                runtimes: 'html5',    //上传模式,依次退化
                browse_button: 'clickUpload',       //上传选择的点选按钮，**必需**
                uptoken_url : 'http://localhost:8888/uptoken',
                domain: 'http://pfqsx9xrg.bkt.clouddn.com/',   //bucket 域名，下载资源时用到，**必需**
                get_new_uptoken: false,  //设置上传文件的时候是否每次都重新获取新的token
                max_file_size: '40mb',           //最大文件体积限制
                dragdrop: true,                   //开启可拖曳上传
                drop_element: 'uploadArea',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                init: {
                    'FilesAdded': function(up, files) {
                        plupload.each(files, function(file) {
                            // 文件添加进队列后,处理相关的事情
                        });
                    },
                    'BeforeUpload': function(up, file) {
                        // 每个文件上传前,处理相关的事情
                    },
                    'UploadProgress': function(up, file) {
                        // 每个文件上传时,处理相关的事情
                        // uploadStatus.textContent = '上传中'
                    },
                    'FileUploaded': function(up, file, info) {
                        // uploadStatus.textContent = '上传完毕'
                        // 每个文件上传成功后,处理相关的事情
                        var domain = up.getOption('domain');
                        var response = JSON.parse(info.response);
                        var sourceLink = domain +'/'+ encodeURIComponent(response.key)
                        window.eventHub.emit('new',{
                            url:sourceLink,
                            name:response.key
                        })
                        // console.log(data);
                            
                        
                        // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html
       
                       
                    },
                    'Error': function(up, err, errTip) {
                        //上传出错时,处理相关的事情
                    },
                    'UploadComplete': function() {
                        //队列文件处理完毕后,处理相关的事情
                    },
                }
            });
        },


    }
    controller.initQiniu()
}