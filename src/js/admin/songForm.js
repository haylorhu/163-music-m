{
    view={
        el:"#songForm",
        init(){
            this.$el = $(this.el)
        },
        template:`
        <form >
        <div class="row"><label for=""><p>歌名</p></label><input type="text"  name="name" value="__name__"></div>
        <div class="row"><label for=""><p>歌手</p></label><input type="text"  name="singer" value="__singer__"></div>
        <div class="row"><label for=""><p>链接</p></label><input type="text"  name="url"value="__url__"></div>
        <div class="row"><label for=""><p>歌词</p></label><textarea name="lyrics" cols="10" rows="10"></textarea></div>
        <div class="row"><label for=""><p>封面</p></label><input type="text" name="cover" value="__cover__"></div>
        <div class="row"><button>提交</button></div>
      </form
        `,
        render(data={}){
          let placeHolders = ['name','url','singer','id','cover','lyric']
          let html = this.template
          placeHolders.map((string)=>{
              html = html.replace(`__${string}__`,data[string]||' ')
          })
          this.$el.html(html)  
        },
        reset(){
            this.render({})
        }
        
    },
    model={
        data:{
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
                let {id,attributes}=newSong
                Object.assign(this.data,{id,...attributes})
                alert('保存成功')
            },(error)=>{
                console.log(error)
            })
        }

    },
    controller={
        init(view,model){
            this.view = view
            this.model = model
            this.view.init()
            this.eventHub()
            this.view.render(this.model.data)

            this.bindEvents()

        },
        bindEvents(){
            this.view.$el.on('submit','form',(e)=>{
                e.preventDefault()
                if(this.model.data.id){
                    this.update
                }else{
                    console.log(22)
                    this.create()
                }
            })

        },
        create(){
            let need = 'name singer url cover lyrics'.split(" ")
            let data ={}
            need.map((string)=>{
                console.log(string)
                console.log(this.view.$el.find(`[name="${string}"]`).val())
                data[string] = this.view.$el.find(`[name="${string}"]`).val()
            })
            this.model.create(data)
                .then(()=>{
                    this.view.reset()
                    let copy = JSON.parse(JSON.stringify(this.model.data))
                    window.eventHub.emit('create',copy)
                }

                )
        },
        update(){
            var Song = AV.Object.createWithoutData('Song',this.data.id);
            console.log(55);
            return Song.save({
                name:data.name, 
                singer:data.singer,
                url:data.url, 
                lyrics:data.lyrics, 
                cover:data.cover
            })
        },
        eventHub(){
            eventHub.on("new",(data)=>{
                Object.assign(this.model.data,data)
                console.log(this.model.data)
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view,model)
}