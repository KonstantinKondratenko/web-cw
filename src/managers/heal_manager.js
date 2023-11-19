import { IMG_PATH } from "../paths";


export class Heal
{
    constructor(init_x, init_y)
    {
        this.x_map = init_x
        this.y_map = init_y 

        this.tile_pos = [240,838, 16, 16]
        this.cnv_pos = [16*this.x_map, 16*this.y_map, 16, 16]

        this.img = new Image
        this.img.src = IMG_PATH + "tiles_groung.jpeg"

        this.heal = 20
        this.healed = false
    }

    used()
    {
        this.cnv_pos = [0, 0, 0, 0]  
        this.heal = 0
    }
}