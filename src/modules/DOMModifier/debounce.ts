// debounce.ts

// Функция debounce, которая ограничивает частоту вызовов переданной функции
// Она возвращает новую функцию, которая при вызове очищает предыдущий таймаут и устанавливает новый, вызывая переданную функцию только после того, как прошло определённое время с момента последнего вызова.
export function debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout>;
  
    return function (this: unknown, ...args: Parameters<T>): void {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
}  