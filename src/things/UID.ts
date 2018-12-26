import bigInt from 'big-integer';

export class UID {
    readonly objectUID: string;
    private _maskedUID: string | undefined;
    private _connectiveUID: string | undefined;
    public _mapID;

    constructor(type: UIDType.CONNECTIVE | UIDType.OBJECT | UIDType.ERROR, UID?: string) {
        if (type === UIDType.ERROR || !UID) {
            this.objectUID = "0";
        } else if (type === UIDType.OBJECT) {
            this.objectUID = UID;
        } else {
            this.objectUID = bigInt(UID)
                .and(bigInt("000000FFFFFFFFFF", 16))
                .or(bigInt("FFFFFE0000000000", 16))
                .toString();
            this._connectiveUID = UID;
            this._mapID = bigInt(UID)
                .and(bigInt("FFFFFF0000000000", 16))
                .shiftRight(40)
                .toString();
        }
    }

    get connectiveUID(): string {
        if (!this.mapID) {
            throw new Error("Can't get a Connective UID without a map ID attached");
        }
        if (!this._connectiveUID) {
            const shiftedMapID = bigInt(this.mapID).shiftLeft(40);
            this._connectiveUID = bigInt(this.objectUID, 16)
                .and(bigInt("000000FFFFFFFFFF", 16))
                .or(shiftedMapID)
                .toString();
        }
        return this._connectiveUID;
    }

    get mapID() {
        if (!this._mapID) {
            throw new Error("No map id to get");
        }
        return this._mapID;
    }

    hasMapID(): boolean {
        return !!this._mapID;
    }

    set mapID(id: string) {
        this._mapID = id;
        this._connectiveUID = undefined;
    }

    get maskedUID(): string {
        if (!this._maskedUID) {
            this._maskedUID = bigInt(this.objectUID, 16)
                .and(bigInt("000000FFFFFFFFFF", 16))
                .toString();
        }
        return this._maskedUID!;
    }
}

export enum UIDType {
    CONNECTIVE,
    OBJECT,
    MASKED,
    ERROR
}