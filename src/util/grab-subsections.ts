export function grabSubsectionFromLines(lines: string[], header: string, footer: string): null | { headerTokens: string[], footerTokens: string[], sectionLines: string[], remainingLines: string[] } {
    const headerIndex = lines.findIndex(line => line.includes(header));
    if (headerIndex === -1) {
        return null;
    }
    const headerTokens = lines[headerIndex].split(' ');
    const footerIndex = lines.findIndex(line => line.includes(footer));
    if (footerIndex === -1) {
        return null;
    }
    const footerTokens = lines[footerIndex].split(' ');
    const sectionLines = lines.slice(headerIndex, footerIndex + 1);
    const remainingLines = lines.slice(0, headerIndex)
        .concat(lines.slice(footerIndex + 1));
    return {
        headerTokens,
        footerTokens,
        sectionLines: sectionLines,
        remainingLines: remainingLines
    }
}