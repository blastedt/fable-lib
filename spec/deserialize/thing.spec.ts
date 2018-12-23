import * as chai from 'chai';
import * as sinon from 'sinon';
import * as fs from 'fs';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
// import { parseTngContents, parseTngFile } from '../../src/tng/parse-tng';
import { Thing } from '../../src/models/thing.model';
import * as proxyquire from 'proxyquire';
const expect = chai.expect;
chai.should();
chai.use(chaiAsPromised as any);
chai.use(sinonChai);

const mockedDeps = {
    fs: {
        readFile: sinon.stub()
    }
};
const { parseTngContents, deserializeThingFile } = proxyquire
    .noCallThru()
    .load('../../src/deserialize/thing', mockedDeps);

describe('tng processor', function () {
    let mockError: any, mockBuffer: any;
    let expThings: Thing[];
    beforeEach(function () {
        mockedDeps.fs.readFile.callsFake(function (file, callback) {
            callback(mockError, mockBuffer);
        });
        expThings = parseTngContents(TNGBUF
            .toString()
            .split(/\r?\n/g)
            .map(s => s.replace(/[;"]/g, '')));
        mockError = null;
        mockBuffer = TNGBUF;
    });

    describe('greedy grabber', function () {

    });

    describe('parser integration', function () {
        let things: Thing[];
        beforeEach(function () {
            things = parseTngContents(TNGBUF
                .toString()
                .split(/\r?\n/g)
                .map(s => s.replace(/[;"]/g, '')));
        });
        it('should parse', function () {
            things.length.should.equal(3);
        });
        it('should strip bad chars', function () {
            things[0].DefinitionType.includes(';').should.equal(false);
            things[0].DefinitionType.includes('"').should.equal(false);
        });
        it('should ignore unknown keys', function () {
            chai.expect((things[0] as any).ThingLevelPersistent, "Defined an unknown key").to.be.undefined;
            ;
        });
        it('should ignore unknown sections', function () {
            chai.expect((things[0] as any).StartCTCEditor, "Defined an unknown section").to.be.undefined;
        });
    });

    describe('file opener', function () {
        it('returns a bunch of things', function () {
            return deserializeThingFile('foo').should.eventually.deep.equal(expThings);
        });
        it('errors out', function () {
            mockError = "Whoops!";
            return deserializeThingFile('foo').should.be.rejected;
        })
    });
});


const TNGBUF: Buffer = Buffer.from(`Version 2;

XXXSectionStart NULL;

NewThing Object;
Player 4;
UID 18446741874686303210;
DefinitionType "OBJECT_PRISON_CELL_STOOL_01";
CreateTC "CTCOwnedEntity";
ScriptName NULL;
ScriptData "NULL";
ThingGamePersistent FALSE;
ThingLevelPersistent FALSE;
StartCTCPhysicsStandard;
PositionX 30.494629;
PositionY 46.559814;
PositionZ 100.255394;
RHSetForwardX 0.0;
RHSetForwardY 0.999994;
RHSetForwardZ 0.0;
RHSetUpX 0.0;
RHSetUpY 0.0;
RHSetUpZ 0.999994;
EndCTCPhysicsStandard;
StartCTCEditor;
EndCTCEditor;
StartCTCOwnedEntity;
SwitchableNavigationTCAdded FALSE;
VersionNumber 1;
OwnerUID 18446741874686296104;
EndCTCOwnedEntity;
Health 1.0;
EndThing;

NewThing Object;
Player 4;
UID 18446741874686303207;
DefinitionType "OBJECT_PRISON_CELL_STOOL_01";
CreateTC "CTCOwnedEntity";
ScriptName NULL;
ScriptData "NULL";
ThingGamePersistent FALSE;
ThingLevelPersistent FALSE;
StartCTCPhysicsStandard;
PositionX 30.779053;
PositionY 47.05249;
PositionZ 100.255394;
RHSetForwardX 0.0;
RHSetForwardY 0.999994;
RHSetForwardZ 0.0;
RHSetUpX 0.0;
RHSetUpY 0.0;
RHSetUpZ 0.999994;
EndCTCPhysicsStandard;
StartCTCEditor;
EndCTCEditor;
StartCTCOwnedEntity;
SwitchableNavigationTCAdded FALSE;
VersionNumber 1;
OwnerUID 18446741874686296104;
EndCTCOwnedEntity;
Health 1.0;
EndThing;

NewThing Thing;
Player 4;
UID 18446741874686296068;
DefinitionType "REGION_EXIT_POINT";
ScriptName NULL;
ScriptData "NULL";
ThingGamePersistent FALSE;
ThingLevelPersistent FALSE;
StartCTCPhysicsStandard;
PositionX 24.714722;
PositionY 57.746094;
PositionZ 49.577816;
RHSetForwardX 0.0;
RHSetForwardY 0.999994;
RHSetForwardZ 0.0;
RHSetUpX 0.0;
RHSetUpY 0.0;
RHSetUpZ 0.999994;
EndCTCPhysicsStandard;
StartCTCEditor;
EndCTCEditor;
StartCTCDRegionExit;
Active TRUE;
Radius 2.5;
MessageRadius 10.5;
ReversedOnMiniMap FALSE;
HiddenOnMiniMap FALSE;
EntranceConnectedToUID 72195032991399938;
EndCTCDRegionExit;
EndThing;
`);