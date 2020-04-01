var infectDelay = prompt("Time Delay to Quarentine (ms)", "5000");
class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(x) {
    this.x += x.x;
    this.y += x.y;
  }

  sub(x) {
    this.x -= x.x;
    this.y -= x.y;
  }

  mul(x) {
    this.x *= x.x;
    this.y *= x.y;
  }

  print() {
    console.log(this.x, this.y);
  }
  unpack() {
    return this.x, this.y;
  }
}

class World {
  constructor(population) {
    this.stats = [
      [
        "Newly Infected",
        "Quarentined",
        "Dead",
        "Recovered",
        "Unaffected",
        "\n"
      ].join(",")
    ];
    this.population = population;
    this.s = this.population;
    this.i = 0;
    this.r = 0;
    this.people = [];
    for (let i = 0; i < this.population; i++) {
      this.people.push(
        new Person(
          random(width * 0.25, width * 0.75),
          // random(width * 0.25, width * 0.75),
          // random(height * 0.125, height * 0.325)
          random(height * 0.125, height * 0.325),
          i
        )
      );
    }
  }
}

class Person {
  constructor(x, y, i) {
    this.idx = i;
    this.l = new Vector(x, y);
    this.v = new Vector(0, 0);
    this.a = new Vector(parseInt(random(-3, 3)), parseInt(random(3, -3)));
    this.v.add(this.a);
    this.infected = false;
    this.quarantine = false;
    this.steerForce = new Vector(0, 0);
    this.accelerate();
    this.home = new Vector(35, 40);
    this.home1 = new Vector(windowWidth - 200, 40);
    this.p = random(1);
    this.reachedFlag = false;
    this.dead = false;
    this.recycled = false;
  }

  recycle() {
    if (this.reachedFlag) {
      const pidx = this.idx;
      w.people.splice(
        this.idx,
        1,
        new Person(
          random(width * 0.25, width * 0.75),
          random(height * 0.125, height * 0.325),
          pidx
        )
      );
    }
  }

  reached(x) {
    let xd = abs(parseInt(this.l.x - x.x));
    let yd = abs(parseInt(this.l.y - x.y));

    // console.log(d, this.l.x - x.x, this.l.y - x.y, this.l, x);
    if (xd <= 10 && yd <= 10) {
      this.reachedFlag = true;
      setTimeout(() => {
        this.recycle();
      }, 5000);
      return true;
    } else {
      return false;
    }
  }

  move() {
    // console.log(this.reached(this.home), this.reached(this.home1));

    if (this.quarantine) {
      if (this.p <= 0.2) {
        // dead
        this.a = new Vector(0, 0);
        const sx = this.home.x - this.l.x;
        const sy = this.home.y - this.l.y;
        const nsx = (sx / abs(sx)) * 14;
        const nsy = (sy / abs(sx)) * 1;
        this.steerForce = new Vector(nsx, nsy);
        // this.steerForce.mul(new Vector(5, 5));
        this.v = this.steerForce;
        // this.steerForce = new Vector(0, 0);
        if (!this.reached(this.home)) {
          this.l.add(this.v);
          // this.l = this.home;
          // } else {
        } else {
          this.dead = true;
        }
      } else {
        this.a = new Vector(0, 0);
        const sx = this.home1.x - this.l.x;
        const sy = this.home1.y - this.l.y;
        const nsx = (sx / abs(sx)) * 40 - 1;
        const nsy = (sy / abs(sx)) * 1 + 1;
        this.steerForce = new Vector(nsx, nsy);
        // this.steerForce.mul(new Vector(5, 5));
        this.v = this.steerForce;
        // this.steerForce = new Vector(0, 0);
        if (!this.reached(this.home1)) {
          this.l.add(this.v);
          // this.l = this.home1;
          // } else {
        }
      }
    } else {
      this.l.add(this.v);
    }
  }

  reverseX() {
    this.v.x = -1 * this.v.x;
    this.a.sub(new Vector(0.5, 0.5));
  }
  reverseY() {
    this.v.y = -1 * this.v.y;
    this.a.sub(new Vector(0.5, 0.5));
  }

  infect() {
    this.infected = true;
    setTimeout(() => {
      this.quarantine = true;
    }, parseInt(infectDelay));
  }

  accelerate() {
    if (this.l.x >= width * 0.76 - 10) {
      // l=true
      this.reverseX();
    }
    if (this.l.x < width * 0.2 - 10) {
      // l=true
      this.reverseX();
    }
    if (this.l.y > height * 0.6 - 10) {
      // l=true
      this.reverseY();
    }
    if (this.l.y < 10) {
      this.reverseY();
    }

    this.show();
  }

  show() {
    if (this.infected && !this.quarantine) {
      strokeWeight(2);
      stroke("rgba(255, 0, 0, 1)");
      fill("rgba(255, 0, 0, 0.7)");
    }
    if (this.quarantine) {
      strokeWeight(1);
      stroke("rgba(255, 255, 0, 1)");
      fill("rgba(255, 255, 0, .41)");
    }

    if (!this.infected && !this.quarantine) {
      strokeWeight(1);
      stroke("rgba(255, 255, 255, 1)");
      fill("rgba(255, 255, 255, .71)");
    }

    ellipse(this.l.x, this.l.y, 5, 5);
  }
}

function setup() {
  cvs = createCanvas(windowWidth - 50, windowHeight - 50);
  w = new World(750);
}

function draw() {
  // frameRate(10);
  background(0);
  // noFill();
  rect(10, 10, 200, 100, 20);
  text("dead", 10, 20);
  rect(windowWidth - 300, 10, 200, 100, 20);
  text("Recovered", windowWidth - 300, 20);

  // console.log(arr[2].l.x, arr[0].l.x);
  w.people.filter(e => !e.infected).length === 0 &&
    w.people.forEach(e => (e.infected = false));

  w.people.forEach((person, idx, arr) => {
    person.accelerate();
    person.move();
    idx == 0 && person.infect();

    arr
      .filter(e => !e.infected)
      .forEach(n => {
        // console.log(arr.length);
        if (n !== person) {
          const dx = person.l.x - n.l.x;
          const dy = person.l.y - n.l.y;
          if (
            dx > -10 &&
            dx < 10 &&
            dy > -10 &&
            dy < 10 &&
            person.infected &&
            !person.quarantine
          ) {
            n.infect();
          }
        }
      });
  });
  strokeWeight(1);
  fill(255);
  textSize(15);
  const i = w.people.filter(e => e.infected && !e.quarantine).length;
  const q = w.people.filter(e => e.quarantine).length;
  const s = w.people.filter(e => !e.infected).length;

  const d = w.people.filter(e => e.quarantine && e.p <= 0.2).length;
  const rec = q - d;

  // w.stats.push([i, q, d, rec, s].join(",") + "\n");
  w.stats.push([i, q, d, rec, s]);
  if (i === 0 && q !== 0) {
    setTimeout(() => {
      noLoop();
    }, 6000);
    // writeFile(w.stats, `corona-sim-data-${infectDelay}.csv`);
  }
  if (i >= w.population * 0.65) {
    setTimeout(() => {
      noLoop();
    }, 60);
    // writeFile(w.stats, `corona-sim-data-${infectDelay}.csv`);
  }

  w.stats.forEach((e, idx) => {
    strokeWeight(1);
    y = height - e[0] * (400 / height);
    y1 = height - e[1] * (400 / height);
    y2 = height - e[2] * (400 / height);
    y3 = height - e[3] * (400 / height);
    y4 = height - e[4] * (400 / height);
    textSize(18);
    stroke("white"); // Change the color
    text(`Population - ${w.people.length}`, windowWidth - 400, height - 220);
    const dot = 1;
    stroke("red"); // Change the color
    fill("black");
    strokeWeight(5);
    ellipse(idx + 95, parseInt(y), dot);
    text(`Newly Infected - ${i}`, windowWidth - 400, height - 200);

    stroke("yellow"); // Change the color
    ellipse(idx + 95, parseInt(y1), dot);
    text(`Quarentined - ${q}`, windowWidth - 400, height - 180);

    stroke("gray"); // Change the color
    ellipse(idx + 95, parseInt(y2), dot);
    text(`Dead - ${d}`, windowWidth - 400, height - 160);

    stroke("green"); // Change the color
    ellipse(idx + 95, parseInt(y3), dot);
    text(`Recovered - ${rec}`, windowWidth - 400, height - 140);

    stroke("purple"); // Change the color
    ellipse(idx + 95, parseInt(y4), dot);
    text(`Safe - ${s}`, windowWidth - 400, height - 120);

    stroke("white"); // Change the color
    ellipse(idx + 95, height, dot);
    line(95, height, 95, height - w.population * (400 / height));
  });
}

function mousePressed() {
  noLoop();
}

function mouseReleased() {
  loop();
}
