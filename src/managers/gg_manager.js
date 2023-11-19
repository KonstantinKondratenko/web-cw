import { IMG_PATH } from "../paths";

export class GG
{
    constructor()
    {
        this.x_map = 11
        this.y_map = 6

        this.hp = 30

        this.tile_pos = [16, 64, 16, 16]
        this.cnv_pos = [16*this.x_map, 16*this.y_map, 16, 16]

        this.img = new Image
        this.img.src = IMG_PATH + "per_res.png"
    }

    damage(val)
    {
        this.hp =  this.hp - val
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