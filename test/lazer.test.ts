import { Seq, map, filter, flatMap, flatten, forEach } from "../src/lazer";


let arr = [1, 2, 3];
let bigArr = [1, 2, 3, 4, 5, 6];

test("Seq iter(): allows you to exhaust the underlying IterableIterator", () => {
  let seq = Seq.from(arr).iter();

  expect(seq.next().value).toBe(1);
  expect(seq.next().value).toBe(2);
  expect(seq.next().value).toBe(3);
  expect(seq.next().value).toBe(undefined);
});

test("map: applies a mapping function to each element of the iterable", () => {
  let seq = map((x: number) => x * x)(arr);

  expect(seq.next().value).toBe(1);
  expect(seq.next().value).toBe(4);
  expect(seq.next().value).toBe(9);
  expect(seq.next().value).toBe(undefined);
});


test("filter: filters out values that do not satisfy the predicate", () => {
  let seq = filter((x: number) => x % 2 === 0)(arr);

  expect(seq.next().value).toBe(2);
  expect(seq.next().value).toBe(undefined);
});

test("flatMap: applies a mapping function to each element of the iterable and then flattens it", () => {
  let words = ["hi", "bye", "good"];
  let seq = flatMap((x: string) => x.split(""))(words);

  expect(seq.next().value).toBe("h");
  expect(seq.next().value).toBe("i");
  expect(seq.next().value).toBe("b");

  let last = null;
  for (let val of seq) {
    last = val;
  }
  expect(last).toBe("d");
  expect(seq.next().value).toBe(undefined);
});


test("flatten: flattens a 2d iterable to a 1d iterable of the same elements", () => {
  let twoD = [[1], [2], [3]];
  let seq = flatten()(twoD);

  expect(seq.next().value).toBe(1);
  expect(seq.next().value).toBe(2);
  expect(seq.next().value).toBe(3);
  expect(seq.next().value).toBe(undefined);
});

// test("test collect (to Array): in 1, 2, 3, 4, 5, 6, filter evens, map to it's double, collect to array", () => {
//   let newArr = sequence(bigArr).filter(x => x % 2 === 0).map(x => x * 2).collect();

//   expect(newArr).toEqual([4, 8, 12]);
// });

// test("test take: in 1, 2, 3, 4, 5, 6, take the first 3 numbers", () => {
//   let seq = sequence(bigArr).take(3);

//   expect(seq.next().value).toBe(1);
//   expect(seq.next().value).toBe(2);
//   expect(seq.next().value).toBe(3);
//   expect(seq.next().value).toBe(undefined);
// });

// test("test takeWhile: take until applied predicate is false", () => {
//     let seq = sequence(bigArr).takeWhile(x => x < 2);

//     expect(seq.next().value).toBe(1);
//     expect(seq.next().value).toBe(undefined);
// });

test("forEach: forEach consumes the iterator, mimicing a for-loop's behavior", () => {
  let total = 10;

  forEach((x: number) => total += x)(bigArr);

  expect(total).toBe(31);
});

// test("test count: get the number of values in a sequence, consuming the sequence", () => {
//   let seq = sequence(bigArr);
//   let count = seq.count();

//   expect(count).toBe(6);
//   expect(seq.next().value).toBe(undefined);
// });

// test("test reduce: apply the function to each element, producing an accumulated value", () => {
//   let sum = sequence(bigArr).reduce((acc, x) => acc + x, 0);

//   expect(sum).toBe(21);
// });

// test("test skip: skip n elements of the sequence, consuming them", () => {
//   let seq = sequence(bigArr).skip(4);

//   expect(seq.next().value).toBe(5);
//   expect(seq.next().value).toBe(6);
//   expect(seq.next().value).toBe(undefined);
// });

// test("test skipWhile: skip until predicate satisfied, consuming skipped values", () => {
//   let seq = sequence(bigArr).skipWhile(x => x < 5);

//   expect(seq.next().value).toBe(5);
//   expect(seq.next().value).toBe(6);
//   expect(seq.next().value).toBe(undefined);
// });

// test("test zip: takes an iterator returns a new iterator that iterates over both at the same time", () => {
//   let one = [1, 2, 3];
//   let two = [4, 5, 6];
//   let seq = sequence(one).zip(sequence(two));

//   expect(seq.next().value).toEqual({ 0: 1, 1: 4});
//   expect(seq.next().value).toEqual({ 0: 2, 1: 5 });
//   expect(seq.next().value).toEqual({ 0: 3, 1: 6 });
//   expect(seq.next().value).toBe(undefined);
// });

// test("test enumerate: will create an iterator that includes the current iteration count as well as the next value", () => {
//   let seq = sequence(arr).enumerate();

//   expect(seq.next().value).toEqual({ i: 0, value: 1 });
//   expect(seq.next().value).toEqual({ i: 1, value: 2 });
//   expect(seq.next().value).toEqual({ i: 2, value: 3 });
//   expect(seq.next().value).toBe(undefined);
// });

// test("test nth: return the nth element from the sequence", () => {
//   let seq = sequence(arr).nth(1);

//   expect(seq.next().value).toBe(2);
//   expect(seq.next().value).toBe(undefined);
// });

// // test("test peekable: allows access to the next value in the sequence without consuming it", () => {
// //   let seq = sequence(arr).peekable();

// //   expect(seq.peek().value).toBe(1);
// //   expect(seq.next().value).toBe(1);
// //   expect(seq.peek().value).toBe(2);
// //   expect(seq.peek().value).toBe(2);
// //   expect(seq.next().value).toBe(2);
// //   expect(seq.next().value).toBe(3);
// //   expect(seq.next().value).toBe(undefined);

// //   let secondsequence = sequence(bigArr).peekable();

// //   expect(secondsequence.next().value).toBe(1);
// //   expect(secondsequence.peek().value).toBe(2);

// //   let next = 2;
// //   for (let val of secondsequence) {
// //     expect(val).toBe(next);
// //     next += 1;
// //   }

// //   let testPeek = sequence(arr).peekable().max();
// //   expect(testPeek).toBe(3);
// // });

// test("test partition: consumes the sequence creating two lists. one with values that satisfy the predicate and one with values that do not", () => {
//   let part = sequence(bigArr).partition(x => x % 2 === 0);

//   expect(part[0]).toEqual([2, 4, 6]);
//   expect(part[1]).toEqual([1, 3, 5]);
// });

// test("test any: tests whether any values match the predicate, returns true if so, false if not. Short circuits on match leaving the rest unconsumed", () => {
//   let seq = sequence(bigArr);

//   expect(seq.any(x => x % 2 === 0)).toBe(true);
//   expect(seq.next().value).toBe(3);
// });

// test("test min: returns the min value of the sequence, consuming the sequence", () => {
//   let min = sequence(arr).min();

//   expect(min).toBe(1);
// });

// test("test max: returns the max value of the sequence, consuming the sequence", () => {
//   let max = sequence(arr).max();

//   expect(max).toBe(3);
// });

// // test("test unzip:", () => {

// // });

// test("test minByKey: returns the element that gives the min value from the function", () => {
//   let min = sequence(bigArr).minByKey(x => x * -x);

//   expect(min).toBe(6)
// });

// test("test maxByKey: returns the element that gives the max value from the function", () => {
//   let max = sequence(bigArr).maxByKey(x => x - 2 * x);

//   expect(max).toBe(1);
// });

// test("test sum: returns the sum of all values in the sequence, consuming the sequence", () => {
//   let sum = sequence(arr).sum();

//   expect(sum).toBe(6);
// });

// test("test product: returns the product of all values in the sequence, consuming the sequence", () => {
//   let product = sequence(arr).product();

//   expect(product).toBe(6);
// });

// // test("test cycle: repeats the sequence endlessly", () => {
// //   let seq = sequence(arr);

// //   for (let i = 0; i < 8; i++) {
// //     seq.next();
// //   }
// //   expect(seq.next().value).toBe(3);
// // });

// test("test all: tests if all values of the sequence matches the given predicate. Short circuits on false value", () => {
//   let seq1 = sequence(arr);
//   let result1 = seq1.all(x => x < 10);

//   expect(result1).toBe(true);
//   expect(seq1.next().value).toBe(undefined);

//   let seq2 = sequence(arr);
//   let result2 = seq2.all(x => x < 2);

//   expect(result2).toBe(false);
//   expect(seq2.next().value).toBe(3);
// });

// test("test find: finds a value that satisfies the given predicate and returns it. Does not consume the rest of the sequence", () => {
//   let seq = sequence(arr)
//   let val = seq.find(x => x === 2);

//   expect(val).toBe(2);
//   expect(seq.next().value).toBe(3);
//   expect(seq.next().value).toBe(undefined);
// });

// test("test position:", () => {
//   let index = sequence(arr).position(x => x === 2);

//   expect(index).toBe(1);
// });

// test("test chain:", () => {
//   let arr1 = [0, 2];
//   let arr2 = [4];
//   let seq = sequence(arr1).chain(sequence(arr2));

//   expect(seq.next().value).toBe(0);
//   expect(seq.next().value).toBe(2);
//   expect(seq.next().value).toBe(4);
//   expect(seq.next().value).toBe(undefined);
// });

// test("test prototype: check prototype chain of each method", () => {
//   let seq =
//     sequence(bigArr)
//       .map(x => x)
//       .filter(x => x !== 100)
//       .takeWhile(x => x < 100)
//       .skipWhile(x => x < 0)
//       .skip(0)
//       .take(6)
//       .map(x => [[x]])
//       .flatten()
//       .flatMap(x => x.concat(x))
//       // .peekable()
//       .collect();

//   expect(seq).toEqual([1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6]);

//   let zipped = sequence(bigArr).zip(sequence(arr)).filter(x => x[0] === 3 && x[1] === 3);
//   expect(zipped.next().value).toEqual({ 0: 3, 1: 3 });

//   let enumerated = sequence(arr).enumerate().filter(x => x.i === 0);
//   expect(enumerated.next().value).toEqual({ i: 0, value: 1 });
  
//   let nth = sequence(arr).nth(1).map(x => x + 1);
//   expect(nth.next().value).toBe(3);

//   let sec = [4, 5, 6];
//   let chain = sequence(arr).chain(sequence(sec)).nth(5);
//   expect(chain.next().value).toBe(6);
// });