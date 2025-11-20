let paletaFiambre = ["#f33535","#ee5889","#f36e35","#ffac00","#ffb5b5"];

let mx, my; // MARGENES EN X / Y
let b; // BOCATA
let fiambres = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  calcMargins();
  b = new Bocata();
  noLoop();

  // Esperamos a que la fuente web "Titan One" esté cargada antes de aplicarla
  if (document && document.fonts && document.fonts.load) {
    document.fonts.load('1em "Titan One"').then(() => {
      // ahora la fuente está lista: aplicamos y redibujamos
      textFont("Titan One");
      redraw();
    }).catch((e) => {
      // si algo falla, aplicamos igual y redibujamos (fallback)
      console.warn("document.fonts.load falló:", e);
      textFont("Titan One");
      redraw();
    });
  } else {
    // navegadores muy antiguos: aplicamos y forzamos redraw (puede parpadear)
    textFont("Titan One");
    redraw();
  }
}


function draw() {
  background("#FFC421");
  b.show();

  //DIBUJA LOS FIAMBRES
  for (let f of fiambres) {
    f.show();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calcMargins();
  redraw();
}

//MARGENES
function calcMargins() {
  mx = width * 0.10;
  my = max(height * 0.06, 20);
}

//COLOCAR FIAMBRES
function mousePressed() {
  const left = mx;
  const top  = my;
  const w = width - 2 * mx;
  const h = height - 2 * my;

  if (mouseX >= left && mouseX <= left + w && mouseY >= top && mouseY <= top + h) {
    const u = constrain((mouseX - left) / w, 0, 1);
    const v = constrain((mouseY - top)  / h, 0, 1);
    const color = random(paletaFiambre);
    fiambres.push(new Fiambre(u, v, color));
    redraw();
  }
}

class Bocata {
  constructor() {}

  show() {
    // AREA DE LOS MARGENES
    const left = mx;
    const top  = my;
    const w = width - 2 * mx;
    const h = height - 2 * my;

    // HOJA
    noStroke();
    fill(255);
    beginShape();
    vertex(left + w * 0.10, top + h * 0.00);
    vertex(left + w * 0.90, top + h * 0.00);
    vertex(left + w * 1.00, top + h * 0.25);
    vertex(left + w * 0.90, top + h * 0.50);
    vertex(left + w * 1.00, top + h * 0.75);
    vertex(left + w * 0.90, top + h * 1.00);
    vertex(left + w * 0.10, top + h * 1.00);
    vertex(left + w * 0.00, top + h * 0.75);
    vertex(left + w * 0.10, top + h * 0.50);
    vertex(left + w * 0.00, top + h * 0.25);
    endShape(CLOSE);

    //CORDENADAS Y MARGEN DE LOS PANES
    const cx = left + w * 0.5; 
    const cy1 = top + h * 0.25; // PAN SUPERIOR
    const cy2 = top + h * 0.75; // PAN INFERIOR

    //SEPARACION
    const separation = abs(cy2 - cy1);
    const gap = min(12, h * 0.02);

    let panH = min(h * 0.3, separation - 2 * gap);
    panH = max(panH, 6);

    let panW = min(w * 0.75, w - 2 * gap);
    panW = max(panW, 10);

    if (panH < 0) panH = max(h * 0.08, 4);

    //PAN
    fill("#c89566");
    ellipseMode(CENTER);
    ellipse(cx, cy1, panW, panH);
    ellipse(cx, cy2, panW, panH);

    //TEXTO
    const textPan1 = "Prepara tu";
    const textPan2 = "Bocata";

    //REDUCCIÓN DE TEXTO EN FUNCION DEL TAMAÑO
    function drawTextInPan(txt, x, y, maxW, maxH) {
      push();
      textAlign(CENTER, CENTER);
      fill("#af6832");
      //TAMAÑO INICIAL
      let ts = max(8, maxH * 0.5);
      textSize(ts);
      //REDUCCIÓN DEL PAN DEPENDIENDO DEL ANCHO
      const maxAllowed = maxW * 0.9;
      let safety = 0;
      while (textWidth(txt) > maxAllowed && ts > 6 && safety < 30) {
        ts -= 1; 
        textSize(ts);
        safety++;
      }
      text(txt, x, y);
      pop();
    }

    drawTextInPan(textPan1, cx, cy1, panW, panH);
    drawTextInPan(textPan2, cx, cy2, panW, panH);
  }
}

//FIAMBRE
class Fiambre {
  constructor(u, v, color) {
    this.u = constrain(u, 0, 1);
    this.v = constrain(v, 0, 1);
    this.color = color;
    this.scale = 1;
  }

  show() {
    const left = mx;
    const top  = my;
    const w = width - 2 * mx;
    const h = height - 2 * my;

    const x = left + this.u * w;
    const y = top  + this.v * h;

    let baseW = w * 0.18;
    let baseH = h * 0.08;
    baseW = constrain(baseW, 8, w * 0.6);
    baseH = constrain(baseH, 6, h * 0.25);

    const drawW = baseW * this.scale;
    const drawH = baseH * this.scale;

    noStroke();
    fill(this.color);
    ellipseMode(CENTER);
    ellipse(x, y, drawW, drawH*2);

  }
}
