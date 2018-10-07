{
    let view = {
        el: '#songList',
        template: `
        <div class="topic">
            <p>
                上传列表
            </p>
            <p>
                歌单列表
            </p>
        </div>
        <ul>
            <li>11</li>
            <li>21</li>
            <li>31</li>
            <li>41</li>
    
        </ul>`,
        render(data){
            $el=$(this.el)
            $el.html(this.template)
            let{songs,selectSongId} = data
            console.log(songs);
            
            let liList = songs.map(
                (song)=>{
                    let $li = $('<li></li>').html(song.name).attr("data-song-id",song.id)
                    console.log(song.name);
                    
                    if(song.id === selectSongId){
                        $li.addClass('active')
                    }
                    return $li
                }
            )
            // let liList = songs.map((song)=> {
            //     let $li = $('<li></li>').text(song.name).attr('data-song-id', song.id)
            //     if(song.id === selectedSongId){ $li.addClass('active') }
            //     return $li
            //   })
            //   console.log(5656);
            console.log(data)
            
            
            $el.find('ul').empty()
            liList.map((domLi)=>{
                $el.find('ul').append(domLi)
            })

        },
        clearActive(){
            $(this.el).find('.active').removeClass('active')
        }
    }
    let model= {
        data:{
            songs:[],
            selectSongId:undefined,
        },
        find(){
            
            var query = new AV.Query('Song');
            return query.find().then((songs)=>{
                console.log(songs);
                
                this.data.songs = songs.map((song)=>{
                    return {id:song.id,...song.attributes}
                })
                
                return songs
            },
            (error)=>{

            console.log(error);
            }
            
            )
        }
    }
    let controller ={
        init(view,model){
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.bindEvents()
            this.bindEventHub()
            
            this.getAllSongs()
            
        },
        getAllSongs(){
            console.log(1111);
            
            return this.model.find().then(()=>{

                console.log(this.model.data);
                
                this.view.render(this.model.data)}
            )
        },
        bindEvents(){
            $(this.view.el).on('click','li',(e)=>{
                let songId = e.currentTarget.getAttribute('data-song-id')
                this.model.data.selectSongId = songId
                this.view.render(this.model.data)
                let data
                let songs =this.model.data.songs
                for(let i =0;i<songs.length;i++){
                    if(songs[i].id===songId){
                        data = songs[i]
                        break
                    }
                }
                window.eventHub.emit('select',JSON.parse(JSON.stringify(data)))
            })
        },
        bindEventHub(){
            window.eventHub.on('create',(songData)=>{
                this.model.data.songs.push(songData)
                this.view.render(this.model.data)
            })
            window.eventHub.on('new',()=>{
                this.view.clearActive()
            })
            window.eventHub.on('update',(song)=>{
              let songs = this.model.data.songs
              for(let i=0;i<songs.length;i++){
                  if(songs[i].id === song.id){
                      Object.assign(songs[i],song)
                  }
              }  

            })
        }
    
    }
    controller.init(view,model)
} 
