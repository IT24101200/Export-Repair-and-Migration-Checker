// Markdown reference parser for extracting internal links and image paths

export interface ParsedMarkdownRef {
  rawMatch: string;
  linkText: string;
  target: string;
  isImage: boolean;
  line: number;
  startIndex: number;
  endIndex: number;
}

// Scans Markdown text and extracts links and image references outside code blocks
export function scanMarkdownReferences(markdownText: string): ParsedMarkdownRef[] {
  const references: ParsedMarkdownRef[] = [];

  // Split lines to accurately calculate line numbers
  const lines = markdownText.split("\n");
  let inCodeBlock = false;
  let runningCharOffset = 0;

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];
    const trimmed = line.trim();

    // Check for fenced code block toggle (``` or ~~~)
    if (trimmed.startsWith("```") || trimmed.startsWith("~~~")) {
      inCodeBlock = !inCodeBlock;
      runningCharOffset += line.length + 1; // +1 for newline
      continue;
    }

    // Skip parsing if inside a fenced code block
    if (inCodeBlock) {
      runningCharOffset += line.length + 1;
      continue;
    }

    // Match inline links and images: [text](url) or ![alt](url)
    // Regex matches !(optional) [text] (url)
    const regex = /(!?)\[([^\]]+)\]\(([^)]+)\)/g;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(line)) !== null) {
      const isImage = match[1] === "!";
      const linkText = match[2];
      const target = match[3].trim();
      const matchIndexInLine = match.index;

      references.push({
        rawMatch: match[0],
        linkText,
        target,
        isImage,
        line: lineIndex + 1,
        startIndex: runningCharOffset + matchIndexInLine,
        endIndex: runningCharOffset + matchIndexInLine + match[0].length,
      });
    }

    runningCharOffset += line.length + 1;
  }

  return references;
}
