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
    './Thing': {
        Thing: {
            deserialize: deserializeStub
        }
    }
}
const { Section } = proxyquire
    .noCallThru()
    .load('../../src/things/Section', mockedDeps);

describe.only('Section deserialization', function () {
    it('doesn\'t break with empty sections', function () {
        const inputLines = ['XXXSectionStart QUEST;', 'XXXSectionEnd;'];
        const actual = Section.deserialize(inputLines);
        actual.things.length.should.equal(0);
        expect(actual.quest).to.equal("QUEST");
    });
    it('nulls out quest if NULL', function () {
        const inputLines = ['XXXSectionStart NULL;', 'XXXSectionEnd;'];
        const actual = Section.deserialize(inputLines);
        expect(actual.quest).to.equal(null);
    });
    it('deserializes child things', function () {
        const inputLines = [
            'XXXSectionStart Foo;',
            '',
            ...fakeThingFactory('a'),
            '',
            ...fakeThingFactory('b'),
            '',
            ...fakeThingFactory('c'),
            '',
            'XXXSectionEnd;'
        ];
        const actual = Section.deserialize(inputLines);
        deserializeStub.should.have.been.calledThrice;
        deserializeStub.should.have.been.calledWith(fakeThingFactory('a'));
    });
});

function fakeThingFactory(str: string): string[] {
    return [TNG_FILE_TOKENS.NEWTHING, str, str, str, TNG_FILE_TOKENS.ENDTHING];
}