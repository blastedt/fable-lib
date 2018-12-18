import * as chai from 'chai';
import * as sinon from 'sinon';
import * as fs from 'fs';
import chaiAsPromised from 'chai-as-promised';
import { parseTngContents, parseTngFile } from '../../src/tng/parse-tng';
import { Thing } from '../../src/tng/tng.model';
const expect = chai.expect;
chai.should();
chai.use(chaiAsPromised as any);
describe('tng processor', function () {
    describe('parser', function () {
        let things: Thing[];
        beforeEach(function () {
            things = parseTngContents(TNGBUF);
        });
        it('should parse', function () {
            things.length.should.equal(2);
        });
        it('should strip bad chars', function () {
            things[0].ScriptData.indexOf(';').should.equal(-1);
            things[0].ScriptData.indexOf('"').should.equal(-1);
        });
    });
    describe('file opener', function () {
        let readFileStub: sinon.SinonStub;
        let expThings: Thing[];
        let mockError: any, mockBuffer: any;
        beforeEach(function() {
            readFileStub = sinon.stub(fs, 'readFile');
            readFileStub.callsFake(function (file, callback) {
                console.log("in sinon stub");
                callback(mockError, mockBuffer);
            });
            expThings = parseTngContents(TNGBUF);
            mockError = null;
            mockBuffer = TNGBUF;
        });
        afterEach(function() {
            readFileStub.restore();
        });
        it('returns a bunch of things', function () {
            return parseTngFile('foo').should.eventually.deep.equal(expThings);
        });
        it('errors out', function () {
            mockError = "Whoops!";
            return parseTngFile('foo').should.be.rejected;
        })
    });
});


const TNGBUF: Buffer = new Buffer(`Version 2;

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
`);