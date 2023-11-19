import { MapManager } from "./managers/map_manager";
import { MAP_PATH_1 } from "./paths";
import { MAP_PATH_2 } from "./paths";
import { GG } from "./managers/gg_manager";
import { Enemy } from "./managers/enemy_manager";
import { SoundManager } from "./managers/sound_manager";
import { Heal } from "./managers/heal_manager";
 
class Engine
{
    constructor()
    {
        this.alive = true
        this.lvl = 1

        this.score = 1
        this.start_date = new Date()

        this.heal_list = [new Heal(1, 1), new Heal(15, 16), new Heal(7, 8)]
        this.sound = new SoundManager()
        this.mapManager = new MapManager(this.lvl)
        this.ggManager = new GG()
        this.enemy1 = new Enemy(12, 1)

        this.interrupt_keyboard()


        this.info_canvas = document.querySelector('.player_info')
        this.info_canvas.width = 160
        this.info_canvas.height = 50
        this.info_canvas_ctx = this.info_canvas.getContext("2d")

        this.score_canvas = document.querySelector('.score_info')
        this.score_canvas.width = 160
        this.score_canvas.height = 50
        this.score_canvas_ctx = this.info_canvas.getContext("2d")
    }

    start()
    {
        this.init()
    }

    lvl_2_start()
    {
        this.lvl = 2
        this.heal_list = [new Heal(1, 1), new Heal(15, 16), new Heal(11, 8)]
        this.mapManager = new MapManager(this.lvl)
        let hp = this.ggManager.hp
        this.ggManager = new GG()
        this.ggManager.hp = hp
        this.enemy1 = new Enemy(1, 16)
        this.init()

    }
    async init()
    {
        this.sound.sting.play()

        if (this.lvl == 1)
            await this.loadMap(MAP_PATH_1).then((json) => this.mapManager.parseMap(json))
        else
            await this.loadMap(MAP_PATH_2).then((json) => this.mapManager.parseMap(json))
        this.mapManager.map_canvas.getContext("2d").drawImage(this.mapManager.background, 0, 0, 480, 320)
        this.mapManager.map_canvas.getContext("2d").drawImage(this.ggManager.img, this.ggManager.tile_pos[0], this.ggManager.tile_pos[1], this.ggManager.tile_pos[2], this.ggManager.tile_pos[3], this.ggManager.cnv_pos[0],this.ggManager.cnv_pos[1], this.ggManager.cnv_pos[2], this.ggManager.cnv_pos[3])
        this.mapManager.map_canvas.getContext("2d").drawImage(this.enemy1.img, this.enemy1.tile_pos[0], this.enemy1.tile_pos[1], this.enemy1.tile_pos[2], this.enemy1.tile_pos[3], this.enemy1.cnv_pos[0], this.enemy1.cnv_pos[1], this.enemy1.cnv_pos[2], this.enemy1.cnv_pos[3])

        while (1)
        {
            if (this.alive)
                this.is_alive()
            let path
            
            path = this.Lee_alg(this.enemy1.x_map, this.ggManager.x_map, this.enemy1.y_map, this.ggManager.y_map)

            let px = path[0]
            let py = path[1]

            let x1 = px[1]
            let y1 = py[1]

            let x0 = this.enemy1.x_map
            let y0 = this.enemy1.y_map

            if (x0 == x1) // движение по Y 
                {
                    if (y1 > y0)                    
                        this.down_move_enemy()                    
                    else
                        this.up_move_enemy()
                }   
                else // движеине по Х
                {
                    if (x1 > x0)                    
                        this.right_move_enemy()                    
                    else                    
                        this.left_move_enemy()                    
                }
            await new Promise(r => setTimeout(r, 600/this.lvl + 50)) // задержка врага
        }
    }

    async loadMap(path) 
    {
        let tilesParsedJSON = null
        await fetch(
            path,
            {
                headers:
                {
                    'Content-Type': 'application/json',
                },
                method: "GET"
            }
        )
        .then(response => response.json())
        .then(response => {
            tilesParsedJSON = response
        })

        return tilesParsedJSON
    }

  
    check_heal()
    {
        for (let i = 0; i < this.heal_list.length; i++)
        {
            if ((this.ggManager.x_map == this.heal_list[i].x_map) && (this.ggManager.y_map == this.heal_list[i].y_map))
            {
                if (!this.heal_list[i].healed)
                {
                this.ggManager.hp += this.heal_list[i].heal
                this.heal_list[i].healed = true
                this.sound.heal.play()
                console.log("Healed!")
                this.heal_list[i].used()
                }
            }
        }
    }


    right_move_gg()
    {
        if (this.mapManager.Matrix_field[this.ggManager.y_map][this.ggManager.x_map + 1] != -1)
        {
            this.ggManager.right_move()
            this.reload_draw_map()
            this.check_heal()
        }
        else
        {
            this.wall_damage()
            this.reload_draw_info()
        }
    }

    async right_move_enemy()
    {
        if (this.mapManager.Matrix_field[this.enemy1.y_map][this.enemy1.x_map + 1] != -1)
        {
            this.enemy1.right_move()
            this.reload_draw_map()
            if (this.enemy1.x_map == this.ggManager.x_map && this.enemy1.y_map == this.ggManager.y_map)
            {
                console.log("Enemy damage!")
                this.ggManager.damage(5)
                this.sound.damage.play()
                await new Promise(r => setTimeout(r, 2000))
            }
        }
        else        
            this.reload_draw_info()
        
    }

    left_move_gg()
    {
        if (this.mapManager.Matrix_field[this.ggManager.y_map][this.ggManager.x_map - 1] != -1)
        {
            this.ggManager.left_move()
            this.reload_draw_map()
            this.check_heal()
        }
        else
        {
            this.wall_damage()
            this.reload_draw_info()
        }
    }

    async left_move_enemy()
    {
        if (this.mapManager.Matrix_field[this.enemy1.y_map][this.enemy1.x_map - 1] != -1)
        {
            this.enemy1.left_move()
            this.reload_draw_map()
            if (this.enemy1.x_map == this.ggManager.x_map && this.enemy1.y_map == this.ggManager.y_map)
            {
                this.ggManager.damage(5)
                console.log("Enemy damage!")
                this.sound.damage.play()
                await new Promise(r => setTimeout(r, 2000))
            }
        }
        else        
            this.reload_draw_info()
        
    }

    up_move_gg()
    {
        if (this.mapManager.Matrix_field[this.ggManager.y_map-1][this.ggManager.x_map] != -1)
        {
            this.ggManager.up_move()
            this.reload_draw_map()
            this.check_heal()
        }
        else
        {
            this.wall_damage()
            this.reload_draw_info()
        }

    }

    async up_move_enemy()
    {
        if (this.mapManager.Matrix_field[this.enemy1.y_map-1][this.enemy1.x_map] != -1)
        {
            this.enemy1.up_move()
            this.reload_draw_map()
            if (this.enemy1.x_map == this.ggManager.x_map && this.enemy1.y_map == this.ggManager.y_map)
            {
                this.ggManager.damage(5)
                console.log("Enemy damage!")
                this.sound.damage.play()
                await new Promise(r => setTimeout(r, 2000))
            }
        }
        else        
            this.reload_draw_info()
        
    }

    down_move_gg()
    {
        if (this.mapManager.Matrix_field[this.ggManager.y_map+1][this.ggManager.x_map] != -1)
        {
            this.ggManager.down_move()
            this.reload_draw_map()
            this.check_heal()
        }
        else
        {
            this.wall_damage()
            this.reload_draw_info()
        }

    }

    async down_move_enemy()
    {
        if (this.mapManager.Matrix_field[this.enemy1.y_map+1][this.enemy1.x_map] != -1)
        {
            this.enemy1.down_move()            
            this.reload_draw_map()
            if (this.enemy1.x_map == this.ggManager.x_map && this.enemy1.y_map == this.ggManager.y_map)
            {
                console.log("Enemy damage!")
                this.ggManager.damage(5)
                this.sound.damage.play()
                await new Promise(r => setTimeout(r, 2000))
            }
        }
        else        
            this.reload_draw_info()
        
    }

    wall_damage()
    {
        console.log("Wall damage!")
        this.sound.wall.play()
        this.ggManager.damage(1)
    }

    is_alive()
    {
        if (this.ggManager.hp < 1)
        {
            this.alive = false
            this.sound.sting.pause() 
            this.sound.wall.pause()     
            this.sound.damage.pause()      
            localStorage.setItem("tmp_user_score", this.score)
            this.compare_storage()            
            this.sound.lose.play()
            alert("Game over 😞")

            window.location.href = 'index.html'
        }
    }

    compare_storage()
    {

        if(!localStorage.getItem("records_table"))
            localStorage.setItem("records_table", JSON.stringify([]))        
        let recordsTable = JSON.parse(localStorage.getItem("records_table"))    
        let user_score = localStorage.getItem("tmp_user_score")
        let user_name = localStorage.getItem("tmp_user_name")
        console.log(user_name, " :: ",user_score )
        const user = recordsTable.find(({ name }) => name === user_name ) || {name: user_name }
        recordsTable = recordsTable.filter(({name}) => name != user_name)
        user.score = Math.max(user?.score || 0, user_score)
        recordsTable.push(user)
        localStorage.setItem("records_table", JSON.stringify(recordsTable))
        localStorage.removeItem("tmp_user_score")
        localStorage.removeItem("tmp_user_name")
    
    }

    reload_draw_info()
    {
        this.info_canvas_ctx.strokeStyle = "#F00"
        this.info_canvas_ctx.clearRect(0, 0, 160, 100)
        this.info_canvas_ctx.font = "15px serif"
        if (this.ggManager.hp < 0)
            this.ggManager.hp = 0
        
        let str_to_print = "HP : "  + this.ggManager.hp
        this.info_canvas_ctx.strokeText(str_to_print, 5, 40)

        let tmp_date = new Date()
        tmp_date = tmp_date - this.start_date 
        this.score = Math.round(tmp_date/1000)
        this.score_canvas_ctx.font = "15px serif"
        str_to_print = "Score : "  + this.score
        this.score_canvas_ctx.strokeText(str_to_print, 5, 20)

        if (this.score  > 30 && this.lvl == 1)
        {
            this.lvl_2_start()
        }

    }

    reload_draw_map()
    {      
        this.reload_draw_info()
        this.mapManager.map_canvas.getContext("2d").clearRect(0, 0, 480, 320)
        this.mapManager.map_canvas.getContext("2d").drawImage(this.mapManager.background, 0, 0, 480, 320)
        for (let i = 0; i < this.heal_list.length; i++)
            this.mapManager.map_canvas.getContext("2d").drawImage(this.heal_list[i].img, this.heal_list[i].tile_pos[0], this.heal_list[i].tile_pos[1], this.heal_list[i].tile_pos[2], this.heal_list[i].tile_pos[3], this.heal_list[i].cnv_pos[0], this.heal_list[i].cnv_pos[1], this.heal_list[i].cnv_pos[2], this.heal_list[i].cnv_pos[3])
        
        this.mapManager.map_canvas.getContext("2d").drawImage(this.ggManager.img, this.ggManager.tile_pos[0], this.ggManager.tile_pos[1], this.ggManager.tile_pos[2], this.ggManager.tile_pos[3], this.ggManager.cnv_pos[0],this.ggManager.cnv_pos[1], this.ggManager.cnv_pos[2], this.ggManager.cnv_pos[3])
        this.mapManager.map_canvas.getContext("2d").drawImage(this.enemy1.img, this.enemy1.tile_pos[0], this.enemy1.tile_pos[1], this.enemy1.tile_pos[2], this.enemy1.tile_pos[3], this.enemy1.cnv_pos[0], this.enemy1.cnv_pos[1], this.enemy1.cnv_pos[2], this.enemy1.cnv_pos[3])
    }

    Lee_alg(x0, x1, y0, y1)
    {
        const  W      = 30         // ширина рабочего поля
        const  H      = 20         // высота рабочего поля
        const  WALL   = -1         // непроходимая ячейка
        const  BLANK  = -2         // не помеченная ячейка

        let px = new Array(W*H)
        let py = new Array(W*H)
        let len = 1000

        let grid = this.mapManager.Matrix_field
        for (let i = 0; i < grid.length; i++)
        {
            for(let j = 0; j < grid[0].length; j++)
            {
                if (grid[i][j] != -1)
                    grid[i][j] = BLANK
            } 
        }

        function bool_lee(ax,  ay,  bx,  by)
        {
            let dx = [1, 0, -1, 0]
            let dy = [0, 1, 0, -1]
            let d, x, y, k, stop  

            if (grid[ay][ax] == WALL || grid[by][bx] == WALL) return false
            d = 0
            grid[ay][ax] = 0
            do {
                stop = true               // предполагаем, что все свободные клетки уже помечены
                for ( y = 0; y < H; ++y )
                    for ( x = 0; x < W; ++x )
                        if ( grid[y][x] == d )                         // ячейка (x, y) помечена числом d
                        {
                            for ( k = 0; k < 4; ++k )                    // проходим по всем непомеченным соседям
                            {
                                let iy=y + dy[k], ix = x + dx[k]
                                if ( iy >= 0 && iy < H && ix >= 0 && ix < W && grid[iy][ix] == BLANK )
                                {
                                    stop = false              // найдены непомеченные клетки
                                    grid[iy][ix] = d + 1      // распространяем волну
                                }
                            }
                        }
                d++
              } while ( !stop && grid[by][bx] == BLANK )

            if (grid[by][bx] == BLANK) return false

            len = grid[by][bx]            // длина кратчайшего пути из (ax, ay) в (bx, by)
            x = bx
            y = by
            d = len

            while ( d > 0 )
            {
                px[d] = x
                py[d] = y                   // записываем ячейку (x, y) в путь
                d--
                for (k = 0; k < 4; ++k)
                {
                    let iy=y + dy[k], ix = x + dx[k]
                    if ( iy >= 0 && iy < H && ix >= 0 && ix < W && grid[iy][ix] == d)
                    {
                        x = x + dx[k]
                        y = y + dy[k]           // переходим в ячейку, которая на 1 ближе к старту
                        break
                    }
                }
            }
            px[0] = ax
            py[0] = ay
            return true
        }

        let result = bool_lee(x0, y0, x1, y1)
        // console.log("res : ", result)
        // console.log("Px : ", px)
        // console.log("Py : ", py
        return [px, py]
    }
    
    // обработчик кливиатурных прерываний
    interrupt_keyboard() {
        document.addEventListener('keydown', (event) => {

            const key_name = event.key

            if (key_name === 'ArrowLeft')            
                this.left_move_gg()            

            if (key_name === 'ArrowRight')            
                this.right_move_gg()            

            if (key_name === 'ArrowUp')            
                this.up_move_gg()
            
            if (key_name === 'ArrowDown')            
                this.down_move_gg()
            
            if (key_name == '2')
            {
                if (this.lvl == 1)
                    this.lvl_2_start()
            }
        }               )
    }


}

let engine = new Engine()
engine.start()
