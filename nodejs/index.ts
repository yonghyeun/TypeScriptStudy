type Singer = { sing: () => void };
type Actor = { acting: () => void };

const a: Singer = { sing: () => {} };
const b: Singer = { sing: () => {} };
const c: Singer = { sing: () => {} };
const d: Actor = { acting: () => {} };
const e: Actor = { acting: () => {} };
const f: Actor = { acting: () => {} };

const singerArr: Singer[] = [];
const actorArr: Actor[] = [];
const All: (Singer | Actor)[] = [a, b, c, d, e, f];

type dog = { walk: () => void };

const isSinger = (person: Singer | Actor): person is Actor => 'sing' in person;

All.forEach((person) => {
  if (isSinger(person)) {
    singerArr.push(person);
  } else actorArr.push(person);
});

console.log(singerArr);
