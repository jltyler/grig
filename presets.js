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
}

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
}

export default {
  target,
  shiftySine
}