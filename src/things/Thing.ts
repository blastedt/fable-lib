export class ThingFile {
    ThingFile(buf: Buffer) {
        const lines: string[] = data
            .toString()
            .split(/\r?\n/g)
            .map(s => s.replace(/[;"]/g, ''));
    }
}