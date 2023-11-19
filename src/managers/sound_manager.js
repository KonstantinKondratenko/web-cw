import { SOUND_PATH } from "../paths";

export class SoundManager
{
    constructor()
    {
        this.sting = new Audio(SOUND_PATH + "sting.mp3")
        this.sting.volume = 0.3

        this.damage = new Audio(SOUND_PATH + "damage.mp3")
        this.damage.volume = 0.5

        this.wall = new Audio(SOUND_PATH + "wall.mp3")
        this.wall.volume = 1

        this.lose = new Audio(SOUND_PATH + "lose.mp3")
        this.lose.volume = 1

        this.heal = new Audio(SOUND_PATH + "heal.mp3")
        this.heal.volume = 1
    }
}