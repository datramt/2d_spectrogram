const mic = new p5.AudioIn()
const fft = new p5.FFT(0.8, 512)
let speed, started
let linLogButton, startAudioContextButton

setup = () => {
  /////// GLOBAL VARIABLES ///////
  speed = 1
  started = false

  /////// AUDIO UNITS ///////
  fft.setInput(mic)

  /////// GRAPHICS ///////
  createCanvas(400, 256)
  pixelDensity(1)
  graph = createGraphics(400, 256)
  graph.strokeWeight(1)
  graph.background(255)

  /////// DOM ///////
  startAudioContextAndToggleButton = createButton('toggle audio')
    .position(10, 30)
    .mouseClicked(() => {
      if (started) {
        mic.stop()
        frameRate(0)
      } else {
        userStartAudio().then(() => {
          mic.start()
          frameRate(60)
        })
      }
      started = !started
    })

  linLogButton = createSelect()
    .position(10, 10)
  linLogButton.option('Linear')
  linLogButton.option('Logarithmic')
}

draw = () => {
  let spectrum = fft.analyze()
  switch (linLogButton.value()) {
    case 'Linear':
      drawLinGraph(spectrum)
      break;
    case 'Logarithmic':
      drawLogGraph(spectrum)
      break;
  }
  image(graph, 0, 0)
}

drawLinGraph = (_spectrum) => {
  for (let i = 0; i < _spectrum.length; i++) {
    graph.stroke(255 - _spectrum[i])
    graph.line(
      (frameCount * speed) % width,
      height - i * height / _spectrum.length,
      (frameCount * speed) % width,
      height - (i + 1) * height / _spectrum.length + 1
    )
  }
}

drawLogGraph = (_spectrum) => {
  for (let i = 0; i < _spectrum.length; i++) {
    graph.stroke(255 - _spectrum[i])
    graph.line(
      (frameCount * speed) % width,
      height - log(i) * height / log(_spectrum.length),
      (frameCount * speed) % width,
      height - log(i + 1) * height / log(_spectrum.length) + 1
    )
  }
}
