
export class Sequence<T> {
  seq: IterableIterator<T>;

  constructor(seq: IterableIterator<T>) {
      this.seq = seq;
  }

  *iter(): Generator<T, void, undefined> {
    yield* this.seq;
  }

  andThen<U>(fn: (x: IterableIterator<T>) => IterableIterator<U>): Sequence<U> {
    return new Sequence(fn(this.seq));
  }

  collect<U>(collector?: (x: IterableIterator<T>) => U): U | T[] {
    return collector 
      ? collector(this.seq)
      : toArray(this.seq);
  }
}


export class Seq {

  static from<T>(iter: Iterable<T>) {
      const sequence = function*<T>(iter: Iterable<T>) {
          yield* iter;
      }

      return new Sequence(sequence(iter));
  }

  static of<T>(...items: Array<T>) {
    return new Sequence(items.values());
  }
}

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX


export const chain = <T>(firstIter: IterableIterator<T>) => {
  return function*(secondIter: IterableIterator<T>) {
    for (let val of firstIter) {
      yield val;
    }

    for (let val of secondIter) {
      yield val;
    }
  }
}

export const enumerate = function*<T>(iter: IterableIterator<T>) {
  let count = 0;
  for (let val of iter) {
    yield { count: count, value: val };
    count += 1;
  }
}

export const filter = <T>(predicate: (x: T) => boolean) => {
  return function*(iter: IterableIterator<T>) {
      for (let val of iter) {
          if (predicate(val)) {
              yield val;
          }
      }
  };
}

export const flatMap = <T, U>(fn: (x: T) => Iterable<U>) => {
  return function*(iter: IterableIterator<T>) {
    for (let val of iter) {
      for (let innerVal of fn(val)) {
        yield innerVal;
      }
    }
  };
}

// TODO: look into whether it should be IterableIterator<IterableIterator<T> or as is, IterableIterator<Iterable<T>>
export const flatten = function*<T>(iter: IterableIterator<Iterable<T>>) {
  for (let innerIterable of iter) {
    for (let val of innerIterable) {
      yield val;
    }
  }
}


export const forEach = <T>(fn: (x: T) => void) => {
  return function(iter: IterableIterator<T>) {
    for (let val of iter) {
      fn(val);
    }
  }
}

export const map = <T, U>(fn: (x: T) => U) => {
  return function*(iter: IterableIterator<T>) {
      for (let val of iter) {
          yield fn(val);
      }
  };
}

export const nth = (n: number) => {
  return function*<T>(iter: IterableIterator<T>) {
    let count = 0;
    for (let val of iter) {
      if (count === n) {
        yield val;
      }
      count += 1;
    }
  }
}

export const skip = (n: number) => {
  return function*<T>(iter: IterableIterator<T>) {
    // consume
    for (let i = 0; i < n; i++) {
      iter.next()
    }

    for (let val of iter) {
      yield val;
    }
  }
}

export const skipWhile = <T>(predicate: (x: T) => boolean) => {
  return function*(iter: IterableIterator<T>) {
    let next = iter.next();
    while(predicate(next.value)) {
      next = iter.next();
    }

    while(!next.done) {
      yield next.value;
      next = iter.next();
    }
  }
}

export const take = (n: number) => {
  return function*<T>(iter: IterableIterator<T>) {
    for (let i = 0; i < n; i++) {
      yield iter.next().value;
    }
  }
}

export const takeWhile = <T>(predicate: (x: T) => boolean) => {
  return function*(iter: IterableIterator<T>) {
    let next = iter.next().value;
    while (predicate(next)) {
      yield next;
      next = iter.next().value;
    }
  }
}


export const zip = <T>(firstIter: IterableIterator<T>) => {
  return function*<U>(secondIter: IterableIterator<U>) {
    let first = firstIter.next();
    let second = secondIter.next();
    while(!first.done && !second.done) {
      yield { 0: first.value, 1: second.value };
      first = firstIter.next();
      second = secondIter.next();
    }
  }
}


// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX Collectors XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX


export const collect = <T, U>(collector: (x: IterableIterator<T>) => U) => (iter: IterableIterator<T>) => {
  return collector(iter);
}

export const toArray = <T>(iter: IterableIterator<T>) => [...iter];

export const all = <T>(predicate: (x: T) => boolean) => {
  return (iter:IterableIterator<T>) => {
    for (let val of iter) {
      if (!predicate(val)) {
        return false;
      }
    }

    return true;
  }
}

export const any = <T>(predicate: (x: T) => boolean) => {
  return function(iter: IterableIterator<T>) {
    let next = iter.next();
    while(!predicate(next.value) && !next.done) {
      next = iter.next();
    }
    return predicate(next.value);
  }
}

export const count = <T>(iter: IterableIterator<T>) => {
  let count = 0;
  for (let _ of iter) {
    count++;
  }
  return count;
}


export const find = <T>(predicate: (x: T) => boolean) => {
  return (iter: IterableIterator<T>) => {
    let next = iter.next();
    while (!next.done && !predicate(next.value)) {
      next = iter.next();
    }
    return next.value;
  }
}

export const max = <T>(iter: IterableIterator<T>) => {
  let max = iter.next().value;
  for (let val of iter) {
    if (val > max) {
      max = val;
    }
  }

  return max;
}

export const maxByKey = <T, U>(fn: (x: T) => U) => {
  return (iter: IterableIterator<T>) => {
    let max = iter.next().value;
    for (let val of iter) {
      if (fn(val) >= fn(max)) {
        max = val
      }
    }

    return max;
  }
}

export const min = <T>(iter: IterableIterator<T>) => {
  let min = iter.next().value;
  for (let val of iter) {
    if (val < min) {
      min = val;
    }
  }

  return min;
}

export const minByKey = <T, U>(fn: (x: T) => U) => {
  return (iter: IterableIterator<T>) => {
    let min = iter.next().value;
    for (let val of iter) {
      if (fn(val) <= fn(min)) {
        min = val
      }
    }

    return min;
  }
}

interface PartitionResult<T> {
  0: T[];
  1: T[];
}

export const partition = <T>(predicate: (x: T) => boolean) => {
  return (iter: IterableIterator<T>) => {
    let result: PartitionResult<T> = { 0: [], 1: [] };
    for (let val of iter) {
      if (predicate(val)) {
        result[0].push(val);
      } else {
        result[1].push(val);
      }
    }

    return result;
  }
}

export const position = <T>(predicate: (x: T) => boolean) => {
  return (iter: IterableIterator<T>) => {
    let count = 0;
    for (let val of iter) {
      if (predicate(val)) {
        return count;
      }
      count += 1;
    }

    return null;
  }
}

export const product = (iter: IterableIterator<number>) => {
  let result = 1;
  for (let val of iter) {
    result *= val;
  }
  return result;
}

// TODO: test recursive vs non-recursive implementation
// sometimes called fold
export const reduce = <T, U>(reducer: (acc: U, x: T) => U, initial: U) => {
  return function(iter: IterableIterator<T>): U {
    let next = iter.next();
    if (next.done) {
      return initial;
    }
    return reduce(reducer, reducer(initial, next.value))(iter);
  };
}

export function sum(iter: IterableIterator<number>): number {
  let result = iter.next().value;
  for (let val of iter) {
    result += val;
  }

  return result;
}


