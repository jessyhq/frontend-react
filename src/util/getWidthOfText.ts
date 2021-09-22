// Exports:
class GetWidthOfText {
  c: HTMLCanvasElement | undefined
  ctx: CanvasRenderingContext2D | null
  constructor() {
    this.c = document.createElement('canvas')
    this.ctx = this.c.getContext('2d')
  }
  compute = (text: string, fontName: string, fontSize: string, resolution: number = 5) => {
    if (this.c === undefined) {
      this.c = document.createElement('canvas')
      this.ctx = this.c.getContext('2d')
    } if (this.ctx === null) {
      return 0
    }
    const fontSpec = fontSize + ' ' + fontName
    if (this.ctx.font !== fontSpec) this.ctx.font = fontSpec
    return Math.ceil(this.ctx.measureText(text).width / resolution) * resolution
  }
}

export const getWidthOfText = new GetWidthOfText().compute
