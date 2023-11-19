import { IMG_PATH } from "../paths";

export class MapManager 
{
    constructor(lvl) 
    {
        this.mapData = null
        this.tileLayers = null
        this.xCount = 0
        this.yCount = 0
        this.tileSize = {x: 0, y: 0}
        this.mapSize = {x: 0, y: 0}

        this.background = new Image    

        if (lvl == 1)                    
            this.background.src = IMG_PATH + "map_img.png"
        
        if (lvl == 2)        
            this.background.src = IMG_PATH + "map_img_2.png"     

        this.jsonLoaded = false

        this.map_canvas = document.querySelector('.playground_map')
        this.map_canvas.width = 480
        this.map_canvas.height = 320

        this.pers_img = new Image
        this.pers_img.src = IMG_PATH + "pers_res.jpeg"


        // нумирация - верхний левый угло - 0;0
        // движение по оси ox - индекс j
        // движение по оси oy - индекс i
        this.Matrix_field = new Array(20)
        for (let i=0; i < 20; i++)
        {
            this.Matrix_field[i] = new Array(30)
        }

        for (let i=0; i < 20; i++)
        {
            for (let j=0; j < 30; j++)
                this.Matrix_field[i][j] = 0
        }      

        this.gg_x = 1
        this.gg_y = 1
    }


    parseMap(tilesParsedJSON)
    {
        let img = new Image();
        img.src = IMG_PATH + "pers_res.jpeg"
        this.map_canvas.getContext("2d").drawImage(img, 0, 0, 480, 320)
        
        this.mapData = tilesParsedJSON
        this.xCount = this.mapData.width
        this.yCount = this.mapData.height
        this.tileSize.x = this.mapData.tilewidth 
        this.tileSize.y = this.mapData.tileheight      

        this.mapSize.x = this.xCount * this.tileSize.x
        this.mapSize.y = this.yCount * this.tileSize.y

        this.tileLayers = this.mapData.layers               

        this.jsonLoaded = true // когда разобран весь json
        this.make_wall()
    }


    make_wall()
    {
        for(let idx = 0; idx < this.tileLayers.length; idx++)
        {
            if(this.tileLayers[idx].name === 'wall')
            {
                let wall_strings = new Array(20)
                
                for (let i=0; i < 20; i++)
                {
                    wall_strings[i] = new Array(30)
                    for (let j=0; j < 30; j++)
                    {
                        wall_strings[i][j] = this.tileLayers[idx].data[j+30*i]
                    }
                }

                for (let i=0; i < 20; i++)
                {
                    for (let j=0; j < 30; j++)
                    {
                        if (wall_strings[i][j] == 804)                        
                            this.Matrix_field[i][j] = -1                        
                    }
                }
            }
        }
    }
}