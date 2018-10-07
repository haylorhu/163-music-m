{
    view = {
        el:'#songForm',
        init(){
            this.$el = $(this.el)
        },
        template:`
        <form >
                      <div class="row"><label for="">歌名</label><input type="text"  name="name" value="__name__"></div>
                      <div class="row"><label for="">歌手</label><input type="text"  name="singer" value="__singer__"></div>
                      <div class="row"><label for="">链接</label><input type="text"  name="url"value="__url__"></div>
                      <div class="row"><label for="">歌词</label><textarea name="lyrics" cols="10" rows="10"></textarea></div>
                      <div class="row"><label for="">封面</label><input type="text" name="cover" value="__lyrics__"></div>
                      <div class="row"><button>提交</button></div>
                    </form>
       `,
        render(data = {}){
            
            let placeholders = ['name','url','singer','id','cover','lyrics']
            let html =this.template
            placeholders.map((string)=>{
                html = html.replace(`__${string}__`,data[string]||' ')
            }
            )
            $(this.el).html(html)
        },        
        reset(){
            this.render({})
        },

    },

    model = {
        data:{
            name:'',url:'',id:'',singer:'',lyrics:'',cover:'',
        },
        create(data){
            var Song = AV.Object.extend('Song');
            var song = new Song();
            return song.save({
                name:data.name, 
                singer:data.singer,
                url:data.url, 
                lyrics:data.lyrics, 
                cover:data.cover
            }).then((newSong)=>{
                let {id,attributes} = newSong
                Object.assign(this.data,{id,...attributes})
                alert("保存成功")
            },(error)=>{
                console.error(error)
            }
            )
        },
        update(data){
            var Song = AV.Object.createWithoutData('Song',this.data.id);
            console.log(55);
            return Song.save({
                name:data.name, 
                singer:data.singer,
                url:data.url, 
                lyrics:data.lyrics, 
                cover:data.cover
            }).then((response)=>{
                Object.assign(this,data,data)
                return response
            }
                
            )
        }
    },
    controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.view.init()
            this.view.render(this.model.data)
            this.eventHub()
            this.bindEvents()
        },

        eventHub(){
            window.eventHub.on('new',(data)=>{
                if(this.model.data.id){
                    this.model.data={
                        name:'',url:'',id:'',singer:'',lyrics:''
                    }
                }
                else{
                    Object.assign(this.model.data,data)
                }
                this.view.render(this.model.data)
            })
            window.eventHub.on('select',(song)=>{
                this.model.data=song
                this.view.render(this.model.data)
                
            })
        },        
        bindEvents(){
            this.view.$el.on('submit','form',(e)=>{
                e.preventDefault()
                console.log(e);
                if(this.model.data.id){
                    this.update()
                }else{
                    console.log("A");
                    this.create()
                }
            }
            )
        },
        create(){
            let needs = 'name singer url cover lyrics'.split(' ')
            let data = {}
            needs.map((string)=>{
                data[string] = this.view.$el.find(`[name="${string}"]`).val()
            },
            )
            this.model.create(data)
                .then(()=>{
                    this.view.reset()
                    let copy = JSON.parse(JSON.stringify(this.model.data))
                    window.eventHub.emit('create',copy)
                }

                )
        },
        update(){
            let needs = "name singer url cover lyrics".split(' ')
            let data = {}
            needs.map((string)=>{
                data[string]=this.view.$el.find(`[name=${string}]`).val()
            })
            this.model.update(data)
            .then(
                ()=>{window.eventHub.emit('update',JSON.parse(JSON.stringify(this.model.data)))}
            )
        }
    }
    controller.init(view,model)
}