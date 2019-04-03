class Sequence<T> {
  iter: IterableIterator<T>;

  constructor(iter: IterableIterator<T>) {
      this.iter = iter;
  }

  *chain(...generators: Array<(x: IterableIterator<any>) => IterableIterator<any>>): IterableIterator<any> {
      let result = this.iter;
      for (let gen of generators) {
          result = gen(result);
      }

      yield* result;
  }
}



class Seq {

  static from<T>(iter: Iterable<T>) {
      const sequence = function*<T>(iter: Iterable<T>) {
          yield* iter;
      }

      return new Sequence(sequence(iter));
  }
}


const filter = <T>(predicate: (x: T) => boolean) => {
  return function*(iter: Iterable<T>) {
      for (let val of iter) {
          if (predicate(val)) {
              yield val;
          }
      }
  };
}

const flatMap = <T, U>(fn: (x: T) => Iterable<U>) => {
  return function*(iter: Iterable<T>) {
    for (let val of iter) {
      for (let innerVal of fn(val)) {
        yield innerVal;
      }
    }
  };
}

const map = <T, U>(fn: (x: T) => U) => {
  return function*(iter: Iterable<T>) {
      for (let val of iter) {
          yield fn(val);
      }
  };
}


// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX Collectors XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
const collect = <T, U>(iter: IterableIterator<T>, collector: (x: IterableIterator<T>) => U) => {
  return collector(iter);
}

const toArray = <T>(iter: IterableIterator<T>) => [...iter];

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX TEST XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx
let something = 
  Seq.from([1, 2, 3, 4, 5]).chain(
          map(x => x + 1),
          filter(x => x % 2 === 0));

// let result = collect(something, toArray);
// // function Seq() {};

// // Seq.of = function<T>(args: Iterable<T>) {
// //   return sequence(args);
// // }
// // type sequence<T> = IterableIterator<T>;
// // export interface sequence<T> {
// //   (): IterableIterator<T>
// // }
// // type Seq<T> = IterableIterator<T>;

// // function pipe<T, U>(data: Seq<T>, ...fns: Array<(seq: Seq<T>) => Seq<U>>): Seq<T> {
// //   if (fns.length === 0) {
// //     return data;
// //   }

// //   let result = fns.reduce((acc, nextFn) => nextFn(acc), data);

// //   let fn = fns.shift();
// //   return pipe(fn(data), ...fns); 
// // }
// // interface Pipe<T> {
// //   <U>(fn: (x: T) => U): U;
// // }

// // class Seq<T> implements Pipe<T> {
// //   iter: IterableIterator<T>;

// //   constructor(iter: Iterable<T>) {
// //     this.iter = iter;
// //   }

// //   private *to_seq(iter: Iterable<T>): IterableIterator<T> {
// //     yield* iter;
// //   }

// //   l(): 
// // }
// let arr: Generator = [1, 2, 3, 4].values();

// abstract class Seq<T> implements Generator {
//   iter: IterableIterator<T>

//   constructor(iter: Iterable<T>) {
//     this.iter = this.sequence(iter);
//   }

//   next(): IteratorResult<T> {
//     return this.iter.next();
//   }

//   private *sequence(iterable: Iterable<T>): IterableIterator<T> {
//     yield* iterable;
//   }
// }

// class Sequence<T> extends Seq<T> {

//   *map<U>(fn: (x: T) => U): Seq<U> {
//     for (let val of this.iter) {
//       yield fn(val);
//     }
//   }
// }

// class Iter<T> {
//   iter: Iterable<T>;

//   constructor(iter: Iterable<T>) {
//     this.iter = iter;
//   }

//   *asSeq(): Generator {
//     yield* this.iter;
//   }
// }

// sequence.prototype.map = function<T, U>(fn: (x: T) => U) {
//   return mapIter(fn, this);
// }
// // sequence.prototype.map = function<T, U>(fn: (x: T) => U): IterableIterator<U> {
// //   return mapIter(fn, this);
// // }
// sequence.prototype.flatten = function<T>(): IterableIterator<T> {
//   return flattenIter(this);
// }

// sequence.prototype.flatMap = function<T, U>(fn: (x: Iterable<T>) => IterableIterator<U>)  {
//   return flatMapIter(fn, this);
// }

// sequence.prototype.filter = function<T>(predicate: (x: T) => boolean) {
//   return filtrator(predicate, this);
// }

// //recursive faster?
// sequence.prototype.take = function<T>(n: number): IterableIterator<T> {
//   return takeIter(n, this);
// }

// sequence.prototype.takeWhile = function<T>(predicate: (x: T) => boolean) {
//   return takeWhileIter(predicate, this);
// }

// sequence.prototype.skip = function<T>(n: number): IterableIterator<T> {
//   return skipIter(n, this);
// }

// sequence.prototype.skipWhile = function<T>(predicate: (x: T) => boolean) {
//   return skipWhileIter(predicate, this);
// }

// sequence.prototype.zip = function<T>(seq: IterableIterator<T>) {
//   return ziperator(seq, this);
// }

// // generisize
// sequence.prototype.enumerate = function() {
//   return enumerateIter(this);
// }

// sequence.prototype.nth = function<T>(n: number): IterableIterator<T> {
//   return ntherator(n, this);
// }

// sequence.prototype.chain = function<T>(seq: IterableIterator<T>) {
//   return chainerator(seq, this);
// }

// // sequence.prototype.any = function<T>(predicate: (x: T) => boolean) {
// //   return anyIter(predicate, this);
// // }

// // sequence.prototype.peekable = function() {
// //   return peekableIter(this);
// // }


// //*******************Iterators************************* */
// function* mapIter<T, U>(fn: (x: T) => U, iterable: Iterable<T>) {
//   for (let val of iterable) {
//       yield fn(val);
//   }
// }
// mapIter.prototype = Object.create(sequence.prototype);

// function* flattenIter<T>(iterableOfIterables: Iterable<Iterable<T>>) {
//   for (let iter of iterableOfIterables) {
//     for (let val of iter) {
//       yield val;
//     }
//   }
// }
// flattenIter.prototype = Object.create(sequence.prototype);

// function* flatMapIter<T, U>(fn: (x: Iterable<T>) => IterableIterator<U>, iterable: Iterable<Iterable<T>>) {
//   for (let val of iterable) {
//     for (let innerVal of fn(val)) {
//       yield innerVal;
//     }
//   }
// }
// flatMapIter.prototype = Object.create(sequence.prototype);

// function* filtrator<T>(predicate: (x: T) => boolean, iterable: Iterable<T>) {
//   for (let val of iterable) {
//       if (predicate(val)) {
//           yield val;
//       }
//   }
// }
// filtrator.prototype = Object.create(sequence.prototype);

// //test
// function* takeIter<T>(n: number, iterable: IterableIterator<T>) {
//   for (let i = 0; i < n; i++) { //check for done?
//     yield iterable.next().value;
//   }
// }
// takeIter.prototype = Object.create(sequence.prototype);

// function* takeWhileIter<T>(predicate: (x: T) => boolean, iterable: IterableIterator<T>) {
//   let next = iterable.next();
//   while (predicate(next.value)) {
//     yield next.value;
//     next = iterable.next();
//   }
// }
// takeWhileIter.prototype = Object.create(sequence.prototype);

// function* skipIter<T>(n: number, iterable: IterableIterator<T>) {
//   for (let i = 0; i < n; i++) {
//     iterable.next();
//   }
//   for (let val of iterable) {
//     yield val;
//   }
// }
// skipIter.prototype = Object.create(sequence.prototype);

// function* skipWhileIter<T>(predicate: (x: T) => boolean, iterable: IterableIterator<T>) {
//   let next = iterable.next().value;
//   while (predicate(next)) {
//     next = iterable.next().value;
//   };
//   yield next;

//   for (let val of iterable) {
//     yield val;
//   }
// }
// skipWhileIter.prototype = Object.create(sequence.prototype)

// //will require array style access x[0], x[1] to access values
// function* ziperator<T>(sequence: IterableIterator<T>, iterable: IterableIterator<T>) {
//   let first = iterable.next();
//   let second = sequence.next();
//   while (!first.done && !second.done) {
//     yield { 0: first.value, 1: second.value };
//     first = iterable.next();
//     second = sequence.next();
//   }
// }
// ziperator.prototype = Object.create(sequence.prototype);

// function* enumerateIter<T>(iterable: Iterable<T>) {
//   let count = 0;
//   for (let val of iterable) {
//     yield { i: count, value: val };
//     count += 1;
//   }
// }
// enumerateIter.prototype = Object.create(sequence.prototype);

// function* ntherator<T>(n: number, iterable: Iterable<T>) {
//   let count = 0;
//   for (let val of iterable) {
//     if (count === n) {
//       yield val;
//     }
//     count += 1;
//   }
// }
// ntherator.prototype = Object.create(sequence.prototype);

// function* chainerator<T>(seq: IterableIterator<T>, iterable: IterableIterator<T>) {
//   for (let val of iterable) {
//     yield val;
//   }
//   for (let val of seq) {
//     yield val;
//   }
// }
// chainerator.prototype = Object.create(sequence.prototype);

// // function* cycleIter(iterable) {

// // }
// // cycleIter.prototype = Object.create(sequence.prototype);

// //not chainable at the moment
// // function peekableIter(iterable) {
// //   let _next = undefined;
// //   let _nextCount = 0;
// //   let _peekCount = 0;
// //   return {
// //     next() {
// //       if (_nextCount < _peekCount) {
// //         _nextCount += 1;
// //         //assertEqual(_nextCount, _peekCount); shoudl be true at this point
// //       } else {
// //         _next = iterable.next();
// //         _nextCount += 1;
// //         _peekCount += 1;
// //       }
// //       return _next;
// //     },
// //     peek() {
// //       if (_nextCount === _peekCount) {
// //         _peekCount += 1;
// //         _next = iterable.next();
// //       }
// //       return _next;
// //     },
// //     *[Symbol.iterator]() {
// //       if (_nextCount !== _peekCount) {
// //         _nextCount += 1;
// //         //assertEqual(_nextCount, _peekCount); should be true at this point
// //         yield _next.value;
// //       }
// //       yield* iterable;
// //     } 
// //   }
// // }
// // peekableIter.prototype = Object.create(sequence.prototype);

// //cant make these lambdas because it doesn't bind this? "this" would be the window?
// //***********Terminal Operations****************************************** */
// sequence.prototype.collect = function<T>(): T[] {
//   return [...this];
// }

// sequence.prototype.count = function() {
//   let result = 0;
//   while (!this.next().done) {
//     result++
//   }
//   return result
// }

// sequence.prototype.forEach = function<T>(fn: (x: T) => void) {
//   for (let val of this) {
//     fn(val);
//   }
// }

// //sometimes called fold
// sequence.prototype.reduce = function<T, U>(fn: (acc: U, x: T) => U, start: U): U {
//   let next = this.next();
//   if (next.done) {
//     return start;
//   }
//   return this.reduce(fn, fn(start, next.value));
// }

// //look into this one later
// sequence.prototype.min = function<T>(): T {
//   let next = this.next()
//   let currMin = next.value;
//   while (!next.done) {
//     if (next.value < currMin) {
//       currMin = next.value;
//     }
//     next = this.next();
//   }
//   return currMin;
// }

// sequence.prototype.max = function<T>(): T {
//   let next = this.next();
//   let currMax = next.value;
//   while (!next.done) {
//     if (next.value > currMax) {
//       currMax = next.value;
//     }
//     next = this.next();
//   }
//   return currMax;
// }


// // check this
// sequence.prototype.partition = function<T>(predicate: (x: T) => boolean) {
//   let part: { first: T[], second: T[] } = { first: [], second: [] };
//   for (let val of this) {
//     if (predicate(val)) {
//       part.first.push(val);
//     } else {
//       part.second.push(val);
//     }
//   }
//   return part;
// }

// sequence.prototype.any = function<T>(predicate: (x: T) => boolean) {
//   let next = this.next();
//   while (!next.done && !predicate(next.value)) {
//     next = this.next();
//   }
//   return predicate(next.value); //look into this one
// }

// // this is wrong, check it
// // sequence.prototype.minByKey = function<T, U>(fn: (x: T) => U) {
// //   let currMin = this.next().value;
// //   for (let val of this) {
// //     if (fn(currMin) > fn(val)) {
// //       currMin = val;
// //     }
// //   }
// //   return currMin;
// // }

// // sequence.prototype.maxByKey = function(fn) {
// //   let currMax = this.next().value;
// //   for (let val of this) {
// //     if (fn(currMax) < fn(val)) {
// //       currMax = val;
// //     }
// //   }
// //   return currMax;
// // }

// //rework to work with other types?
// sequence.prototype.sum = function() {
//   let acc = 0;
//   for (let val of this) {
//     acc += val;
//   }
//   return acc;
// }

// //rework to work with other types?
// sequence.prototype.product = function() {
//   let acc = 1;
//   for(let val of this) {
//     acc *= val;
//   }
//   return acc;
// }

// sequence.prototype.find = function<T>(predicate: (x: T) => boolean): T {
//   let next = this.next();
//   if (!next.done && !predicate(next.value)) {
//     next = this.next();
//   }
//   return next.value;
// }

// // Iterable<T> -> (T => boolean) -> boolean
// sequence.prototype.all = function<T>(predicate: (x: T) => boolean): boolean {
//   let next = this.next();
//   while (!next.done) {
//     if (!predicate(next.value)) {
//       return false
//     }
//     next = this.next();
//   }
//   return true;
// }

// sequence.prototype.position = function<T>(predicate: (x: T) => boolean): number | null {
//   let count = 0;
//   for (let val of this) {
//     if (predicate(val)) {
//       return count;
//     }
//     count += 1;
//   }
//   return null;
// }
