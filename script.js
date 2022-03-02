function randint(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

let canvas_size = 700

class Player {
    constructor() {
        this.py = 0
        this.size_x = 30
        this.size_y = 250

        this.speed = 20
    }

    moveEntity(key) {

        if (key == 'ArrowUp') {
            let temp_speed = this.speed
            
            if (0 == this.py) return

            if (this.py - this.speed < 0) {
                temp_speed = this.py
            } 

            this.py -= temp_speed
        }

        if (key == 'ArrowDown') {
            let temp_speed = this.speed

            if (canvas_size == this.py + this.size_y) return

            if (this.py + this.size_y + this.speed > canvas_size) {
                temp_speed = (this.py + this.size_y + this.speed) - canvas_size
            } 

            this.py += temp_speed
        }

        
    }
}

class Shot {
    constructor() {
        this.moves_mode_list = ['line', 'diagonally(+)', 'diagonally(-)'] 

        this.size = 30

        this.px = canvas_size - this.size
        this.py = 250

        this.speed_backup = 5
        this.speed = 5

        this.move_mode = 'diagonally(+)'

        this.run = true
    }

    randomPosition() {
        let speed = this.speed
        let entitySize = this.size

        function randint(min, max) {
            return Math.random() * (max - min) + min;
        }

        let size = (canvas_size - entitySize) / speed
        const multiples = [];

        for (let i = speed; i <= speed * size; i += speed){
            multiples.push(i);
        };

        let pos = multiples[Math.floor(randint(0, size))]
        return pos
    }

    moveShot() {
        if (this.run) {
            if (this.move_mode == 'line') {
                this.px -= this.speed
            } else if (this.move_mode == 'diagonally(-)') {
                if (this.py + this.size >= 700) {
                    this.move_mode = 'diagonally(+)'
                    return
                }
                
                this.px -= this.speed
                this.py += this.speed


            } else if (this.move_mode ==  'diagonally(+)') {
                let temp_speed = this.speed
                if (this.py == 0) {
                    this.move_mode = 'diagonally(-)'
                    return
                } else if (this.py - this.speed < 0) {
                    temp_speed = this.py
                }  

                this.px -= temp_speed
                this.py -= temp_speed
            }
        }
    }

    restartShot() {
        this.px = canvas_size - this.size
        this.py = this.randomPosition()

        this.move_mode = this.moves_mode_list[randint(0, 2)]
        this.run = true 

        this.speed = this.speed_backup
    }
}

class Game {
    constructor(root, player_instance, shot_instance) {
        this.Player = player_instance
        this.Shot = shot_instance

        this.frames = 100
        this.points = 0

        this.displayText = 'Pontos: 0'
        this.ctx = root.getContext('2d')

        this.lost = false
    }

    init() {
        this.render()
        setInterval(() => {
            this.checkColision()
            this.Shot.moveShot()
            this.render()
            this.attText()
        }, 1000 / this.frames)
    }

    checkColision() {
        if (this.lost) return 

        if (this.Shot.px == this.Player.size_x) {
            if (this.Shot.py >= this.Player.py && this.Shot.py + this.Shot.size <= this.Player.size_y + this.Player.py) {
                this.points += 1
                this.displayText = `Pontos: ${this.points}`
                this.Shot.restartShot()
            } else {
                this.displayText = `Perdeu! Total de pontos: ${this.points}`
                this.lost = true
                this.Shot.run = false
            }
        } else if (this.Shot.px - this.Shot.speed < this.Player.size_x) {
            this.Shot.speed = this.Player.size_x - this.Shot.px
        } 
    }

    attText() {
        document.querySelector('.screenText').textContent = this.displayText
    }

    render() {
        this.ctx.clearRect(0, 0, 700, 700)
        
        // RENDER RED-PART
        this.ctx.fillStyle = '#E5243F'
        this.ctx.fillRect(0, 0, this.Player.size_x, 700)

        // RENDER PLAYER 
        this.ctx.fillStyle = '#3D85C6'
        this.ctx.fillRect(0, this.Player.py, this.Player.size_x, this.Player.size_y)
        
        // RENDER SHOT 
        this.ctx.fillStyle = '#F7B15B'
        this.ctx.fillRect(this.Shot.px, this.Shot.py, this.Shot.size, this.Shot.size)
    }
}


let GameInstance = new Game(document.querySelector('#screen'), new Player(), new Shot())
GameInstance.init()

document.addEventListener('keydown', ({key}) => {
    if (GameInstance.lost) return
    GameInstance.Player.moveEntity(key)
})


