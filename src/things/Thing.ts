export class ThingFile {
    ThingFile(buf: Buffer) {
        const lines: string[] = buf
            .toString()
            .split(/\r?\n/g)
            .map(s => s.replace(/[;"]/g, ''));
    }
}