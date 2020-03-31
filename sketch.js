var infectDelay = prompt("Time Delay to Quarentine", "5000");
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
    this.stats = [["NI", "Q", "D", "R", "S", "\n"].join(",")];
    this.population = population;
    this.s = this.population;
    this.i = 0;
    this.r = 0;
    this.people = [];
    for (let i = 0; i < this.population; i++) {
      this.people.push(new Person(random(width), random(height)));
    }
  }
}

class Person {
  constructor(x, y) {
    this.l = new Vector(x, y);
    this.v = new Vector(0, 0);
    this.a = new Vector(random(-3, 3), random(3, -3));
    this.v.add(this.a);
    this.infected = false;
    this.quarantine = false;
    this.steerForce = new Vector(0, 0);
    this.moved = false;
    this.accelerate();
    this.home = new Vector(30, 30);
    this.home1 = new Vector(windowWidth - 300, 30);
    this.p = random(1);
  }

  move() {
    if (this.quarantine) {
      if (this.p <= 0.2) {
        // dead
        this.a = new Vector(0, 0);
        const sx = this.home.x - this.l.x;
        const sy = this.home.y - this.l.y;
        const nsx = (sx / abs(sy)) * 2;
        const nsy = (sy / abs(sy)) * 2;
        this.steerForce = new Vector(nsx, nsy);
        this.v = this.steerForce;
        this.steerForce = new Vector(0, 0);
        this.l.add(this.v);
      } else {
        this.a = new Vector(0, 0);
        const sx = this.home1.x - this.l.x;
        const sy = this.home1.y - this.l.y;
        const nsx = (sx / abs(sy)) * 2;
        const nsy = (sy / abs(sy)) * 2;
        this.steerForce = new Vector(nsx, nsy);
        this.v = this.steerForce;
        this.steerForce = new Vector(0, 0);
        this.l.add(this.v);
      }
    } else {
      this.l.add(this.v);
    }
  }

  reverseX() {
    this.v.x = -1 * this.v.x;
  }
  reverseY() {
    this.v.y = -1 * this.v.y;
  }

  infect() {
    this.infected = true;
    setTimeout(() => {
      this.quarantine = true;
    }, parseInt(infectDelay));
  }

  accelerate() {
    if (this.l.x >= width - 10) {
      // l=true
      this.reverseX();
    }
    if (this.l.x < 10) {
      // l=true
      this.reverseX();
    }
    if (this.l.y > height - 10) {
      // l=true
      this.reverseY();
    }
    if (this.l.y < 10) {
      this.reverseY();
    }

    this.show();
  }

  show() {
    this.infected ? stroke("rgba(255, 0, 0, 1)") : stroke(255, 255, 255);
    this.infected
      ? this.quarantine
        ? stroke("rgba(255, 255, 0, 1)")
        : stroke("rgba(255, 0, 0, 1)")
      : stroke(255, 255, 255);
    this.infected ? strokeWeight(2) : strokeWeight(1);
    !this.infected ? noFill() : fill("rgba(255, 0, 0, 0.3)");
    ellipse(this.l.x, this.l.y, 5, 5);
    // point(this.l.x, this.l.y);
  }
}

function setup() {
  createCanvas(windowWidth - 50, windowHeight - 50);
  w = new World(750);
}

function draw() {
  // frameRate(10);
  background(0);
  noFill();
  rect(10, 10, 85, 65, 20);
  rect(windowWidth - 300, 10, 85, 65, 20);
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
  text(`Population - ${w.people.length}`, windowWidth - 200, 20);
  const i = w.people.filter(e => e.infected && !e.quarantine).length;
  const q = w.people.filter(e => e.quarantine).length;
  const s = w.people.filter(e => !e.infected).length;

  text(`Newly Infected - ${i}`, windowWidth - 200, 40);
  text(`Quarentined - ${q}`, windowWidth - 200, 60);
  text(`Safe - ${s}`, windowWidth - 200, 80);
  const d = w.people.filter(e => e.quarantine && e.p <= 0.2).length;
  const rec = q - d;
  text(`Dead - ${d}`, windowWidth - 200, 100);
  text(`Recovered - ${rec}`, windowWidth - 200, 120);

  w.stats.push([i, q, d, rec, s].join(",") + "\n");

  if (i === 0 && q !== 0) {
    noLoop();
    writeFile(w.stats, `corona-sim-data-${infectDelay}.csv`);
  }
}

// function mousePressed() {
//   noLoop();
// }

// function mouseReleased() {
//   loop();
// }
