import * as proxyquire from 'proxyquire';
import chaiAsPromised from 'chai-as-promised';
import * as chai from 'chai';
import * as sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { TNG_FILE_TOKENS } from '../../dist/models/thing.model';
const expect = chai.expect;
chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

const deserializeStub = sinon.stub();
const mockedDeps = {
    fs: {
        readFile: sinon.stub()
    },
    './Section': {
        Section: {
            deserialize: deserializeStub
        }
    }
}
const { ThingFile } = proxyquire.noCallThru().load('../../src/things/ThingFile', mockedDeps);

describe('thing file deserialization', function () {
    let mockBuffer, mockError;
    beforeEach(function () {
        mockedDeps.fs.readFile.callsFake(function (file, cb) {
            cb(mockError, mockBuffer);
        })
        mockError = null;
    });
    it('returns empty thing file on fillers', async function () {
        mockBuffer = Buffer.from("\nVersion 2;\n\n");
        const res = await ThingFile.deserialize('foo');
        res.sections.length.should.equal(0);
        res.unparsedLines.should.include('Version 2;');
        res.unparsedLines.length.should.equal(1); // remove unparsed lines
    });

    it('deserializes sections', async function () {
        const fakeQuests = ['A', 'B', 'C'];
        mockBuffer = Buffer.from(`
Version 2;

${makeFakeSection(fakeQuests[0], 'section0')}

${makeFakeSection(fakeQuests[1], 'section1')}

${makeFakeSection(fakeQuests[2], 'section2')}

`);
        const res = await ThingFile.deserialize('foo');
        deserializeStub.callCount.should.equal(3);
        deserializeStub.calledWith(makeFakeSection(fakeQuests[0], 'section0').split('\n')).should.be.true;
    });

    it('keeps a record of unknown things', async function () {
        mockBuffer = Buffer.from(`

Version 2;

SomeWeirdThing
`);
        const res = await ThingFile.deserialize('foo');
        res.unparsedLines.should.include('SomeWeirdThing');
        res.unparsedLines.should.include('Version 2;');
    })
});

function makeFakeSection(quest: string, fakeLine) {
    return `${TNG_FILE_TOKENS.NEWSECTION} ${quest};
${fakeLine}
${fakeLine}
${fakeLine}
${TNG_FILE_TOKENS.ENDSECTION}`
}