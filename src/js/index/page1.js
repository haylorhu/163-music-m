{
    let view ={
        el:".page1",
        init(){
            this.$el=$(this.el)
        },
        show(){
            console.log(23);
           this.$el.addClass('active') 
        },
        hide(){
            this.$el.removeClass('active')
        }

    }
    let model = {
    }
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.view.init()
            this.bindEventHub()
            this.loadModule1()
            this.loadModule2()
        },
        bindEventHub(){
            window.eventHub.on("selectTab",(selectName)=>{
                if(selectName==="page1"){
                    this.view.show()
                }
                else{
                    this.view.hide()
                }
            })
        },
        loadModule1(){
            let script1 =document.createElement('script')
            script1.src="./js/index/page1-1.js"
            script1.onload = function(){
                console.log('模块一加载完毕');
                
            }
            document.body.appendChild(script1)
        },
        loadModule2(){
            let script2 =document.createElement('script')
            script2.src="./js/index/page1-2.js"
            script2.onload = function(){
                console.log('模块2加载完毕');
                
            }
            document.body.appendChild(script2)
        },
    }
    controller.init(view,model)
}