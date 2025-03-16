export interface IObserver<T> {
  notify(data: T): void;
}
