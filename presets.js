const shiftySine = {
  a: 15,
  b: 12,
  c: 25,
  d: 66,
  code: `(i) => {
  const centerX = i.width / 2;
  let originX = (i.x - centerX) + i.c * Math.cos(i.timestamp / 1000);
  if (originX === 0) originX = 0.01;
  const centerY = i.height / 2;
  let originY = (i.y - centerY);
  const fx = (1 / originX) * 25 * Math.sin(originX * 0.075 * i.b * Math.cos(i.timestamp / 1000));
  const width = i.a;
  const value = (100 / width) * (width - Math.abs(originY - fx));
  const hue = i.d * 3.6;
  return \`hsl(\${hue}, 75%, \${value}%)\`;
}`
};

const target = {
  a: 15,
  b: 10,
  c: 10,
  d: 10,
  code: `(i) => {
  const centerX = i.width / 2 + i.c * Math.cos(i.timestamp * i.d / 10000);
  const centerY = i.height / 2 + i.c * Math.sin(i.timestamp * i.d / 10000);
  const distance = Math.hypot(i.x - centerX, i.y - centerY);
  const hue = distance * 10 + (i.timestamp / 100);
  const value = 30 + 30 * Math.sin(distance * i.a / 25 + i.timestamp / -2000 * i.b);
  return \`hsl(\${hue}, 100%, \${value}%)\`
}`
};

const spiraly = {
  a: 12,
  b: 4,
  c: 20,
  d: 50,
  code: `(i) => {
  const centerX = i.width / 2 - 1;
  const centerY = i.height / 2 - 1;
  const dist = Math.hypot(i.x - centerX, i.y - centerY);
  const angle = Math.atan2(i.x - centerX, i.y - centerY) - (i.timestamp / 800);
  const spiralArmLength = (dist / (i.a + (i.a * 0.75) * Math.sin(i.timestamp / 3200)));
  const spiralArmCount = Math.round(i.b);
  const value = i.d + 50 * Math.sin((spiralArmLength + angle / 1) * spiralArmCount);
  const hue = (dist * i.c) + i.timestamp / -6.67;
  const saturation = 50 + 50 * Math.sin(dist / -6.67 + i.timestamp / 1600);
  return \`hsl(\${hue},\${saturation}%,\${value}%)\`;
  }`
};

const ringAround = {
  a: 50,
  b: 50,
  c: 50,
  d: 50,
  code: `(()=>{
  const length = 9;
  const mx = 6 + Math.random() * 20;
  const my = 3 + Math.random() * 15;
  const r = [];
  const ints = [];
  const tsx = (0.002 + Math.random() * 0.003) * (Math.random() > 0.5 ? 1 : -1);
  const tsy = (0.002 + Math.random() * 0.003) * Math.sign(tsx);
  for (let i = 0; i < length; i++) {
    r.push(3 + Math.random() * 3);
    ints.push(0.75 + Math.random() * 1.5);
  }
  return ((o) => {
    let red = 0;
    let blue = 0;
    let green = 0;
    for (let i = 0; i < length; i++) {
      const cx = 24 + mx * Math.cos(i*0.6 + o.timestamp * tsx * o.c / 40) + (-50 + o.a) / 2;
      const cy = 15 + my * Math.sin(i*0.6 + o.timestamp * tsy * o.c / 40) + (-50 + o.b) / 3;
      const dist = Math.hypot(o.x - cx, o.y- cy);
      const ra = r[i] * (0.8 + 0.4 * Math.sin(i*0.6 + o.timestamp * tsx * o.c / 40)) * (o.d / 25);
      const brightness = Math.min(Math.max(((ra - dist) / ra) * ints[i], 0), 1);
      red += Math.min(255, 255 * brightness) * (1 & i ? 1 : 0);
      green += Math.min(255, 255 * brightness) * (2 & i ? 1 : 0);
      blue += Math.min(255, 255 * brightness) * (4 & i ? 1 : 0);
    }
    return \`rgb(\${red},\${green},\${blue})\`;
  });
})()`
};

const snowFall = {
  a: 50,
  b: 33,
  c: 55,
  d: 30,
  code: `((i) => {
  const num = 100;
  const x = Array(num);
  const y = Array(num);
  const r = Array(num);
  for (let j = 0; j < x.length; ++j) {
    x[j] = Math.random() * 64;
    y[j] = Math.random() * 40;
    r[j] = 0.015 + Math.random() * 0.015;
  }
  return ((i) => {
    let val = 0;
    const num = Math.min(100, Math.max(0, i.a));
    for (let j = 0; j < num; ++j) {
      y[j] += i.delta / 100 * Math.min(1.7, Math.max(0.3, i.b / 50));
      x[j] += (-10 + Math.max(0, Math.min(20, i.c / 5))) * (i.delta / 300 + Math.sin(j + i.timestamp / 400) / 30000);
      if (y[j] > i.height + 1) {
        y[j] -= (i.height + 2 + Math.random() * 10);
        x[j] = Math.random() * (i.width);
      }
      if (x[j] > i.width + 1.5) x[j] -= i.width + 3;
      else if (x[j] < -1.5) x[j] += i.width + 3;
      const distance = Math.hypot(i.x - x[j], i.y - y[j]);
      val += Math.max(100 - distance / r[j], 0);
    }
    return \`hsl(210, 33%, \${Math.max(i.d, val)}%)\`;
  });
})();`
}

const tendrils = {
  a: 50,
  b: 100,
  c: 60,
  d: 2,
  code:`(() => {
  const angleVariation = Math.PI * customValueC / 100;
  const radiusDecay = 0.08 * 100 / customValueA;
  const speedDecay = 0.0001 + (0.003 * 100 / customValueB);

  const tendrils = [];
  for (let i = 0; i < 2 + Math.round(Math.random() * 8); ++i) {
    tendrils.push({
      angle: Math.random() * Math.PI * 2,
      radius: 2 + Math.random() * 3,
      speed: 1 + Math.random() * 1.5,
      x: gridWidth / 2,
      y: gridHeight / 2,
    });
  }

  const grid = Array(gridWidth);
  for(let x = 0; x < gridWidth; ++x) {
    grid[x] = Array(gridHeight);
    for(let y = 0; y < gridHeight; ++y) {
      grid[x][y] = [0,0];
    }
  }
  let timer = customValueD;
  const burnDecay = 2;
  const scorchDecay = 0.999;
  const scorchDist = 2 + Math.random() * 8;
  let baseHue = Math.random() * 360;

  return ((i) => {
    const cell = grid[i.x][i.y];
    if (i.x === 0 && i.y === 0) { // Only on first iteration
      if (timer-- <= 0) {
        timer = customValueD;
        for(let j = 0; j < tendrils.length; j++) {
          const radius = tendrils[j].radius;
          const speed = tendrils[j].speed;
          const angle = tendrils[j].angle;
          if (radius >= 0.5 && speed > 0) {
            const cx = tendrils[j].x + Math.cos(angle) * speed;
            const cy = tendrils[j].y + Math.sin(angle) * speed;
            tendrils[j].x = cx;
            tendrils[j].y = cy;
            const startX = Math.round(Math.max(cx - radius - scorchDist - 2, 0));
            const startY = Math.round(Math.max(cy - radius - scorchDist - 2, 0));
            const endX = Math.round(Math.min(cx + radius + scorchDist + 2, gridWidth - 1));
            const endY = Math.round(Math.min(cy + radius + scorchDist + 2, gridHeight - 1));
            for (let x = startX; x < endX; ++x) {
              for (let y = startY; y < endY; ++y) {
                const dist = Math.hypot(x - cx, y - cy);
                if (dist < radius && grid[x][y][1] != 1) {
                  grid[x][y] = [100, 1]; // Burned
                } else if (dist < radius + scorchDist && grid[x][y][1] != 1) {
                  const scorchVal = Math.max(100 -  100 * ((dist - radius) / scorchDist), grid[x][y][0]);
                  grid[x][y] = [scorchVal, 2]; // Scorched
                }
              }
            }
            tendrils[j].speed -= speedDecay;
            tendrils[j].radius -= radiusDecay;
            tendrils[j].angle += angleVariation / 2 - Math.random() * angleVariation;
            baseHue += i.delta * 100;
          }
        }
      }
    }
    if (cell[1] === 1) {
      cell[0] -= burnDecay;
    } else if (cell[1] === 2) {
      cell[0] *= scorchDecay;
    }
    const val = cell[0] - Math.random() * 3;
    const hue = baseHue + (cell[1] === 1 ? 170 : (cell[1] === 2 ? 60 : 0));
    return \`hsl(\${hue},50%,\${Math.max(0, val)}%)\`;
  });
})();`
}

export default {
  target,
  shiftySine,
  spiraly,
  ringAround,
  snowFall,
  tendrils
}