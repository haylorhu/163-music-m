{
    view={
        el:'section#newSongs',
        template:`
        <li>
        <h3>{{song.name}}</h3>
        <p>
                <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-sq"></use>
                </svg>
                {{song.singer}}
        </p>
        <a href="./song.html?id={{song.id}}" class="playButton">
                <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-play"></use>
                </svg>
        </a>
        <div class="br"><div>
    </li>
        
        `,
        init(){
            this.$el = $(this.el)
        },
        render(data){
            let {songs} = data
            songs.map((song)=>{
            let $li = $(this.template
                .replace('{{song.name}}',song.name)
                .replace('{{song.singer}}',song.singer)
                .replace('{{song.id}}',song.id))

                $(this.el).find('ol#songs').append($li)
                console.log("$(this.el)");
            })
        }
    },
    model={
        data:{
            songs:[]
        },
        find(){
            var query = new AV.Query('Song');
            console.log(query.find())
            return query.find().then((songs)=>{
                this.data.songs = songs.map((song)=>{
                    return {id:song.id,...song.attributes}
                })
                return songs
            }

            )
        }
    },

    controller={
        init(view,model){
            this.view = view
            this.model = model
            this.bindEvents()
            this.eventHub()
            this.model.find().then(()=>{
                this.view.render(this.model.data)
            },()=>{
                console.log("233");
                
            })
        },
        bindEvents(){

        },
        eventHub(){

        }
    }
    controller.init(view,model)
    console.log(this.model.data);
    
}