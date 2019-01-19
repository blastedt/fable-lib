const INTERESTING_FIELDS: string[] = ["PositionX", "PositionY", "PositionZ"];

export class CTCPhysicsStandard {
    PositionX: number;
    PositionY: number;
    PositionZ: number;
    lines: string[];
    static deserialize(lines: string[]): CTCPhysicsStandard {
        const props = {};
        for (const line of lines) {
            const tokens = line.replace(/[;]/g, '').split(' ');
            if (INTERESTING_FIELDS.includes(tokens[0])) {
                props[tokens[0]] = tokens[1];
            }
        }
        return new CTCPhysicsStandard(props);
    }

    serialize(): string {
        throw new Error("Implement CTCPhysicsStandard better you fuckin numbnut");
    }

    constructor(props: any) {
        this.lines = props.lines;
        this.PositionX = Number(props.PositionX);
        this.PositionY = Number(props.PositionY);
        this.PositionZ = Number(props.PositionZ);
        if (typeof this.PositionX !== 'number'
            || typeof this.PositionY !== 'number'
            || typeof this.PositionZ !== 'number') {
            throw new Error('non number dealie');
        }
    }
}