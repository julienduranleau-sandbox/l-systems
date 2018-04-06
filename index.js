class Game {
    constructor() {
        createCanvas(window.innerWidth, window.innerHeight)

        this.len = 10
        this.angle = radians(25)
        this.iterations = 1
        this.currentDrawingStep = 0
        this.statusStack = null
        this.currentStatus = null
        this.structure = null
        this.rules = null

        this.setModelType("Wheat")

        this.button = createButton('Iterate')
        this.button.position(width - 80, 20)
        this.button.mousePressed(() => {
            this.iterateStructure()
            this.redraw()
        })

        this.selector = createSelect()
        this.selector.position(width - 80, 50)
        this.selector.option('Wheat')
        this.selector.option('Tree')
        this.selector.changed(() => {
            this.setModelType(this.selector.value())
            this.iterations = 1
            this.redraw()
            this.iterateStructure()
        })

        this.iterateStructure()
        this.redraw()
    }

    setModelType(type) {
        if (type == "Wheat") {
            this.structure = "X"
            this.rules = [
                {"search": "X", "replace": "F[-X][X]F[-X]+FX"},
                {"search": "F", "replace": "FF"}
            ]
        } else if("Tree") {
            this.structure = "F"
            this.rules = [
                {"search": "F", "replace": "FF+[+F-F-F]-[-F+F+F]"}
            ]
        }
    }

    iterateStructure() {
        let newStr = ""

        for (let i = 0; i < this.structure.length; i++) {
            let found = false
            for (let j = 0; j < this.rules.length; j++) {
                if (this.structure[i] == this.rules[j].search) {
                    found = true
                    newStr += this.rules[j].replace
                    break
                }
            }

            if ( ! found) {
                newStr += this.structure[i]
            }
        }

        this.structure = newStr
        this.iterations++
    }

    draw() {
        /*
        F means "draw forward"
        − means "turn left 25°"
        + means "turn right 25°"
        X does not correspond to any drawing action and is used to control the evolution of the curve.
        [ save the current values for position and angle
        ] restore position and angle
        */
        if (this.currentDrawingStep == 0) {
            background(255)
        }
        strokeWeight(2)

        let nStepsToDraw = ceil(this.structure.length / 60 / this.iterations)

        for (let i = this.currentDrawingStep; i < this.structure.length; i++) {
            let c = this.structure[i]

            if (c === "F") {
                stroke(50, 50 + this.currentStatus.depth, 50, 255)
                let newX = this.currentStatus.x + cos(this.currentStatus.angle) * this.len
                let newY = this.currentStatus.y + sin(this.currentStatus.angle) * this.len
                line(this.currentStatus.x, this.currentStatus.y, newX, newY)
                this.currentStatus.depth++
                this.currentStatus.x = newX
                this.currentStatus.y = newY
            } else if (c === "-") {
                this.currentStatus.angle -= radians(random(24.5, 25))
            } else if (c === "+") {
                this.currentStatus.angle += radians(random(24.5, 25))
            } else if (c === "[") {
                this.statusStack.push({
                    x: this.currentStatus.x,
                    y: this.currentStatus.y,
                    angle: this.currentStatus.angle,
                    depth: this.currentStatus.depth
                })
            } else if (c === "]") {
                this.currentStatus = this.statusStack.pop()
            }

            this.currentDrawingStep++

            if (--nStepsToDraw == 0) {
                break
            }
        }
    }

    redraw() {
        this.currentDrawingStep = 0
        this.statusStack = []
        this.len = 30 / this.iterations
        this.currentStatus = {
            x: width * 0.5,
            y: height - 50,
            angle: PI * -0.5,
            depth: 0
        }
    }

}
