import { IMG_PATH } from "../paths";


export class Enemy
{
    constructor(init_x, init_y)
    {
        this.x_map = init_x
        this.y_map = init_y

        this.tile_pos = [80, 0, 16, 16]
        this.cnv_pos = [16*this.x_map, 16*this.y_map, 16, 16]

        this.img = new Image
        this.img.src = IMG_PATH + "per_res.png";
    }

   

    upd_cnv_pos()
    {
        this.cnv_pos = [16*this.x_map, 16*this.y_map, 16, 16]
    }

    right_move()
    {      
        this.x_map = this.x_map + 1
        this.upd_cnv_pos()
    }

    left_move()
    {
        this.x_map = this.x_map - 1
        this.upd_cnv_pos()
    }

    up_move()
    {
        this.y_map = this.y_map - 1
        this.upd_cnv_pos()
    }


    down_move()
    {
        this.y_map = this.y_map + 1
        this.upd_cnv_pos()
    }

}