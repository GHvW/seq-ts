abstract class Seq<T> implements IterableIterator<T> {
  iter: IterableIterator<any>;

  constructor(iter: IterableIterator<any>) {
    this.iter = iter;
  }

  abstract [Symbol.iterator](): IterableIterator<T>;

  abstract next(): IteratorResult<T>;

  map<U>(fn: (x: T) => U): Seq<U> {
    return new MapSeq(fn, this);
  }

  filter(predicate: (x: T) => boolean): Seq<T> {
    return new FilterSeq(predicate, this);
  }

  collect(): Array<T> {
    return [...this];
  }

  count(): number {
    let count = 0;
    while (!this.next().done) {
      count++
    }
    return count;
  }
}

class Sequence<T> extends Seq<T> {
  // iter: IterableIterator<T>;

  constructor(iter: IterableIterator<T>) {
    super(iter);
  }

  *[Symbol.iterator](): IterableIterator<T> {
    yield* this.iter;
  } 

  next(): IteratorResult<T> {
    return this.iter.next();
  }
}

class FilterSeq<T> extends Seq<T> {
  predicate: (x: T) => boolean;

  constructor(predicate: (x: T) => boolean, iter: IterableIterator<T>) {
    super(iter);
    this.predicate = predicate;
  }

  *[Symbol.iterator](): IterableIterator<T> {
    for (let val of this.iter) {
      if (this.predicate(val)) {
        yield val;
      }
    }
  }

  next(): IteratorResult<T> {
    let result = this.iter.next();
    while (!result.done) {
      if (this.predicate(result.value)) {
        return { value: result.value, done: false };
      }
      result = this.iter.next();
    }
    return { value: result.value, done: true };
  }
}

class MapSeq<T, U> extends Seq<U> {
  fn: (x: T) => U;

  constructor(fn: (x: T) => U, iter: IterableIterator<T>) {
    super(iter);
    this.fn = fn;
  }

  *[Symbol.iterator](): IterableIterator<U> {
    for (let val of this.iter) {
      yield this.fn(val);
    }
  }

  next(): IteratorResult<U> {
    let result = this.iter.next();
    return !result.done
      ? { value: this.fn(result.value), done: false}
      : { value: this.fn(result.value), done: true }
  }
}


// let x = [1,2,3,4,5,6,7,8,9,10,11,12,13,14];

// let y = new Sequence(x.values());

// let z = y.map(x => x + 1);

// let w = z.filter(x => x % 2 === 0);

// let v = w.collect();

// console.log(y);
// console.log(z);
// console.log(w);
// console.log(v);