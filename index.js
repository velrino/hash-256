var crypto = require('crypto');

function gameResult(lastSeed) {
  const clientSeed =
    '0000000000000000000918ebb64b0d51ccee0bb1826e43846e5bea777d91782';
  const seed = crypto
    .createHash('sha256')
    .update(lastSeed.toString())
    .digest('hex');
  const hash = crypto
    .createHmac('sha256', seed)
    .update(clientSeed)
    .digest('hex');
  const number = Number(getPoint(hash));

  return {
    seed,
    hash,
    number,
  };
}

function divisible(hash, mod) {
  let val = 0;

  let o = hash.length % 4;
  for (let i = o > 0 ? o - 4 : 0; i < hash.length; i += 4) {
    val = ((val << 16) + parseInt(hash.substring(i, i + 4), 16)) % mod;
  }

  return val === 0;
}

function getPoint(hash) {
  // In 1 of 15 games the game crashes instantly.
  if (divisible(hash, 15)) return 0;

  // Use the most significant 52-bit from the hash to calculate the crash point
  let h = parseInt(hash.slice(0, 52 / 4), 16);
  let e = Math.pow(2, 52);

  const point = (Math.floor((100 * e - h) / (e - h)) / 100).toFixed(2);

  return point;
}

const test = gameResult(``);
const test2 = gameResult(test.seed);
const test3 = gameResult(test2.seed);
console.log(test);
console.log(test2);
console.log(test3);
