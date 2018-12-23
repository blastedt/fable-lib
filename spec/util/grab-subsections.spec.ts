import chai from 'chai';
import cap from 'chai-as-promised';
import { grabSubsectionFromLines } from '../../dist/util/grab-subsections';

chai.should();
chai.use(cap);
const expect = chai.expect;

describe('grabbing subsections', function () {

    describe('happy path', function () {
        const beforeLines = ['0', '1'];
        const midLines = ['A', 'B', 'C'];
        const afterLines = ['D', 'E'];
        const lines = [
            ...beforeLines,
            'XXXSectionStart Quest',
            ...midLines,
            'XXXSectionEnd Quest',
            ...afterLines,
        ];
        const expLinesNoMutate = [
            ...beforeLines,
            'XXXSectionStart Quest',
            ...midLines,
            'XXXSectionEnd Quest',
            ...afterLines,
        ];
        let headerTokens, footerTokens, sectionLines, remainingLines;
        beforeEach(function () {
            const res = grabSubsectionFromLines(lines, 'XXXSectionStart', 'XXXSectionEnd');
            headerTokens = res.headerTokens;
            footerTokens = res.footerTokens;
            sectionLines = res.sectionLines;
            remainingLines = res.remainingLines;
        });
        it('gets header tokens', function () {
            headerTokens.should.deep.equal(['XXXSectionStart', 'Quest']);
        });
        it('gets footer tokens', function () {
            footerTokens.should.deep.equal(['XXXSectionEnd', 'Quest']);
        });
        it('gets sectionLines', function () {
            sectionLines.should.deep.equal(midLines);
        });
        it('gets remaining lines with section removed', function () {
            remainingLines.should.deep.equal([...beforeLines, ...afterLines]);
        });
        it('does not mutate the original array', function () {
            lines.should.deep.equal(expLinesNoMutate);
        });
    });

    describe('no header present', function () {
        const lines = [
            'A',
            'B',
            'C',
            'XXXSectionEnd',
            'D'
        ];
        const linesCopy = [
            'A',
            'B',
            'C',
            'XXXSectionEnd',
            'D'
        ];
        let res;
        beforeEach(function () {
            res = grabSubsectionFromLines(lines, 'XXXSectionStart', 'XXXSectionEnd');
        });
        it('returns null', function () {
            expect(res).to.equal(null);
        });
        it('does not mutate the line array', function () {
            lines.should.deep.equal(linesCopy, 'input array mutated');
        });
    });
    describe('no footer present', function () {
        const lines = [
            'A',
            'XXXSectionStart',
            'B',
            'C',
            'D'
        ];
        const linesCopy = [
            'A',
            'XXXSectionStart',
            'B',
            'C',
            'D'
        ];
        let res;
        beforeEach(function () {
            res = grabSubsectionFromLines(lines, 'XXXSectionStart', 'XXXSectionEnd');
        });
        it('returns null', function () {
            expect(res).to.equal(null);
        });
        it('does not mutate the line array', function () {
            lines.should.deep.equal(linesCopy, 'input array mutated');
        });
    });
});