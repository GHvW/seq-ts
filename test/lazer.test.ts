import { Seq, any, chain, enumerate, filter, flatMap, flatten, forEach, map, nth, skip, skipWhile, take, takeWhile, zip,
         collect, all, count, find, max, maxByKey, min, minByKey, partition, position, product, reduce, sum, toArray } from "../src/lazer";


let arr = [1, 2, 3];
let bigArr = [1, 2, 3, 4, 5, 6];

test("Seq iter(): allows you to exhaust the underlying IterableIterator", () => {
  let seq = Seq.from(arr).iter();

  expect(seq.next().value).toBe(1);
  expect(seq.next().value).toBe(2);
  expect(seq.next().value).toBe(3);
  expect(seq.next().value).toBe(undefined);
});


test("any: returns true if any values match the predicate, false if not. Short circuits on match leaving the rest unconsumed", () => {
  let seq = bigArr.values();

  expect(any((x: number) => x % 2 === 0)(seq)).toBe(true);
  expect(seq.next().value).toBe(3);
});

test("test chain: chains two iterators together to yield values from the first then the second", () => {
  let arr1 = [0, 2];
  let arr2 = [4, 9];
  let seq = chain(arr1.values())(arr2.values());

  expect(seq.next().value).toBe(0);
  expect(seq.next().value).toBe(2);
  expect(seq.next().value).toBe(4);
  expect(seq.next().value).toBe(9);
  expect(seq.next().value).toBe(undefined);
});

test("enumerate: creates an iterator that includes the current iteration count as well as the next value", () => {
  let seq = enumerate(arr.values());

  expect(seq.next().value).toEqual({ count: 0, value: 1 });
  expect(seq.next().value).toEqual({ count: 1, value: 2 });
  expect(seq.next().value).toEqual({ count: 2, value: 3 });
  expect(seq.next().value).toBe(undefined);
});

test("filter: filters out values that do not satisfy the predicate", () => {
  let seq = filter((x: number) => x % 2 === 0)(arr.values());

  expect(seq.next().value).toBe(2);
  expect(seq.next().value).toBe(undefined);
});

test("flatMap: applies a mapping function to each element of the iterable and then flattens it", () => {
  let words = ["hi", "bye", "good"];
  let seq = flatMap((x: string) => x.split(""))(words.values());

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
  let seq = flatten(twoD.values());

  expect(seq.next().value).toBe(1);
  expect(seq.next().value).toBe(2);
  expect(seq.next().value).toBe(3);
  expect(seq.next().value).toBe(undefined);
});


test("forEach: forEach consumes the iterator, mimicing a for-loop's behavior", () => {
  let total = 10;

  forEach((x: number) => total += x)(bigArr.values());

  expect(total).toBe(31);
});


test("map: applies a mapping function to each element of the iterable", () => {
  let seq = map((x: number) => x * x)(arr.values());

  expect(seq.next().value).toBe(1);
  expect(seq.next().value).toBe(4);
  expect(seq.next().value).toBe(9);
  expect(seq.next().value).toBe(undefined);
});

test("nth: return the nth element from the sequence", () => {
  let seq = nth(1)(arr.values());

  expect(seq.next().value).toBe(2);
  expect(seq.next().value).toBe(undefined);
});

test("skip: skip n elements of the sequence, consuming them", () => {
  let seq = skip(4)(bigArr.values());

  expect(seq.next().value).toBe(5);
  expect(seq.next().value).toBe(6);
  expect(seq.next().value).toBe(undefined);
});


test("skipWhile: skip until predicate satisfied, consuming skipped values", () => {
  let seq = skipWhile(x => x < 5)(bigArr.values());

  expect(seq.next().value).toBe(5);
  expect(seq.next().value).toBe(6);
  expect(seq.next().value).toBe(undefined);
});


test("take: yields the first n elements of the iterator", () => {
  let seq = take(3)(bigArr.values());

  expect(seq.next().value).toBe(1);
  expect(seq.next().value).toBe(2);
  expect(seq.next().value).toBe(3);
  expect(seq.next().value).toBe(undefined);
});

test("takeWhile: take until predicate is false", () => {
    let seq = takeWhile(x => x < 2)(arr.values());

    expect(seq.next().value).toBe(1);
    expect(seq.next().value).toBe(undefined);
});


test("zip: takes two iterators and returns a new iterator that iterates over both at the same time", () => {
  let one = [1, 2, 3];
  let two = [4, 5, 6];
  let seq = zip(one.values())(two.values());

  expect(seq.next().value).toEqual({ 0: 1, 1: 4});
  expect(seq.next().value).toEqual({ 0: 2, 1: 5 });
  expect(seq.next().value).toEqual({ 0: 3, 1: 6 });
  expect(seq.next().value).toBe(undefined);
});

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx Collector tests XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

test("toArray: consumes the sequence, returning an array of its values", () => {
  let result = toArray(arr.map(x => x + 1).values());

  expect(result).toEqual([2, 3, 4]);
});

test("all: tests if all values of the sequence match the given predicate. Short circuits on false value", () => {
  let seq1 = arr.values();
  let result1 = all(x => x < 10)(seq1);

  expect(result1).toBe(true);
  expect(seq1.next().value).toBe(undefined);

  let seq2 = arr.values();
  let result2 = all(x => x < 2)(seq2);

  expect(result2).toBe(false);
  expect(seq2.next().value).toBe(3);
});

test("count: counts the number of values in the sequence, consuming it in the process", () => {
  let seq = bigArr.values();
  let result = count(seq);

  expect(result).toBe(6);
  expect(seq.next().value).toBe(undefined);
});


test("find: finds a value that satisfies the given predicate and returns it. Does not consume the rest of the sequence", () => {
  let seq = arr.values();
  let val = find((x: number) => x === 2)(seq);

  expect(val).toBe(2);
  expect(seq.next().value).toBe(3);
  expect(seq.next().value).toBe(undefined);

  let seq2 = arr.values();
  let val2 = find((x: number) => x === 5)(seq2);
  expect(val2).toBe(undefined);
  expect(seq2.next().value).toBe(undefined);
});

test("max: returns the maximum value of the sequence, consuming the sequence", () => {
  let result = max(arr.values());

  expect(result).toBe(3);
});

test("maxByKey: returns the element that gives the max value from the function", () => {
  let max = maxByKey((x: number) => x - 2 * x)(bigArr.values());

  expect(max).toBe(1);

  let empty: number[] = [];
  let emptyMax = maxByKey((x: number) => x * 2)(empty.values());

  expect(emptyMax).toBe(undefined);
});

test("min: returns the minimum value of the sequence, consuming the sequence", () => {
  let result = min(arr.values());

  expect(result).toBe(1);
});


test("minByKey: returns the element that gives the min value from the function", () => {
  let min = minByKey((x: number) => x * -x)(bigArr.values());

  expect(min).toBe(6)

  let empty: number[] = [];
  let emptyMin = minByKey((x: number) => x * 2)(empty.values());

  expect(emptyMin).toBe(undefined);
});

test("partition: consumes the sequence creating two arrays. one with values that satisfy the predicate and one with values that do not", () => {
  let part = partition((x: number) => x % 2 === 0)(bigArr.values());

  expect(part[0]).toEqual([2, 4, 6]);
  expect(part[1]).toEqual([1, 3, 5]);
});

// TODO expand this test
test("position: returns the position of the value that matches the predicate or null if there is not a match", () => {
  let index = position((x: number) => x === 2)(arr.values());

  expect(index).toBe(1);
});


test("product: returns the product of all values in the sequence, consuming the sequence", () => {
  let result = product(arr.values());

  expect(result).toBe(6);
});

test("reduce: applys a reducer function to each element and an accumulated value, producing a single result", () => {
  let sum = reduce((acc: number, x: number) => acc + x, 0)(bigArr.values());

  expect(sum).toBe(21);
});

test("sum: returns the sum of all values in the sequence, consuming the sequence", () => {
  let result = sum(arr.values());

  expect(result).toBe(6);
});


//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
test("collect: applies a collector function to the sequence, consuming it and producing a final value", () => {
  const plus5er = (iter: IterableIterator<number>) => {
    let arr = [];
    for (let val of iter) {
      arr.push(val + 5);
    }
    return arr;
  }

  let result = collect(arr.values(), plus5er);

  expect(result).toEqual([6, 7, 8]);
});

test("pipe: pipes a sequence through a series of generator functions", () => {
  let seq = Seq.from(bigArr).pipe(
    map(x => x + 10),
    filter(x => x % 2 === 0)
  );

  let result = collect(seq, toArray);
  
  expect(result).toEqual([12, 14, 16]);
});