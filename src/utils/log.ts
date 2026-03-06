export function log(string: string, needToLog: boolean): void {
    if (needToLog) {
        console.log(string);
    }
}