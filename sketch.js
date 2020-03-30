class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(x) {
    this.x += x.x;
    this.y += x.y;
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
    this.a = new Vector(random(-5, 5), random(5, -5));
    this.v.add(this.a);
    this.infected = false;
    this.quarantine = false;
    this.accelerate();
  }

  move() {
    this.l.add(this.v);
  }

  reverseX() {
    this.v.x = -1 * this.v.x;
  }
  reverseY() {
    this.v.y = -1 * this.v.y;
  }

  infect() {
    this.infected = true;
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
    this.infected ? stroke(255, 0, 0) : stroke(255, 255, 255);
    this.infected ? strokeWeight(2) : strokeWeight(1);
    !this.infected ? noFill() : fill(255, 0, 0);
    ellipse(this.l.x, this.l.y, 5, 5);
    // point(this.l.x, this.l.y);
  }
}

function setup() {
  createCanvas(1600, 800);
  w = new World(1000);
}

function draw() {
  // frameRate(25);
  background(0);

  w.people.forEach((person, idx, arr) => {
    person.accelerate();
    person.move();
    idx == 0 && person.infect();

    // console.log(arr[2].l.x, arr[0].l.x);
    arr.filter(e => !e.infected).length === 0 && noLoop();

    arr
      .filter(e => !e.infected)
      .forEach(n => {
        // console.log(arr.length);
        if (n !== person) {
          const dx = person.l.x - n.l.x;
          const dy = person.l.y - n.l.y;
          if (dx > -10 && dx < 10 && dy > -10 && dy < 10 && person.infected) {
            n.infect();
          }
        }
      });
  });
}

function mousePressed() {
  noLoop();
}

function mouseReleased() {
  loop();
}
