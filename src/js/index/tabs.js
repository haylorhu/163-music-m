{
    let view = {
        el:'#tabs',
        init (){
            this.$el=$(this.el)
            $aa=$("[data-tab-name='page1']").parent().addClass("active")
            console.log($aa);
            
        }
    }
    let model ={}
    let controller = {
        init (view,model){
            this.view=view
            this.model=model
            this.view.init()
            this.bindEvents()
        },
        bindEvents (){
            this.view.$el.on('click',".tabWaper",(e)=>{
                let $tab = $(e.currentTarget)
                let tabName = $tab.children().attr('data-tab-name')
                $tab.addClass("active")
                    .siblings().removeClass('active')
                window.eventHub.emit('selectTab',tabName)
            })
        }
    }
    controller.init(view,model)
    
}