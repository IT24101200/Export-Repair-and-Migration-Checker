// Utility functions for safe path resolution and Notion title normalization

// Normalize slashes to forward slashes and trim whitespace
export function normalizeSlashes(path: string): string {
  return path.replace(/\\/g, "/").trim();
}

// Safely decode percent-encoded strings without crashing on malformed %
export function safeDecodeUriComponent(str: string): string {
  try {
    return decodeURIComponent(str);
  } catch {
    return str;
  }
}

// Extract directory from a file path (e.g. "Notes/Work/todo.md" -> "Notes/Work")
export function getDirectoryName(filePath: string): string {
  const normalized = normalizeSlashes(filePath);
  const lastSlash = normalized.lastIndexOf("/");
  if (lastSlash === -1) return "";
  return normalized.substring(0, lastSlash);
}

// Resolve a relative target path from a source note's directory
// Example: sourceDir = "Notes/Work", target = "../Images/pic.png" -> "Notes/Images/pic.png"
export function resolveRelativePath(sourceDir: string, rawTarget: string): string | null {
  // Strip off fragment anchors (#heading) and query params (?id=1)
  const cleanTarget = rawTarget.split(/[?#]/)[0];
  const decodedTarget = safeDecodeUriComponent(cleanTarget);
  const normalizedTarget = normalizeSlashes(decodedTarget);

  // If path starts with slash, treat as relative to archive root
  const baseParts = sourceDir ? sourceDir.split("/").filter(Boolean) : [];
  const targetParts = normalizedTarget.split("/").filter(Boolean);

  if (normalizedTarget.startsWith("/")) {
    baseParts.length = 0; // root relative
  }

  const resultParts = [...baseParts];

  for (const part of targetParts) {
    if (part === ".") {
      continue;
    } else if (part === "..") {
      if (resultParts.length > 0) {
        resultParts.pop();
      } else {
        // Escapes archive root
        return null;
      }
    } else {
      resultParts.push(part);
    }
  }

  return resultParts.join("/");
}

// Check if a URL is an external link (http, https, mailto, etc.)
export function isExternalLink(target: string): boolean {
  return /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(target.trim());
}

// Normalize a Notion exported filename by stripping Notion's 32-character hex ID
// Example: "Sprint Planning 7f102a.md" -> "Sprint Planning.md"
export function stripNotionExportId(fileName: string): string {
  return fileName.replace(/\s+[a-f0-9]{6,32}(\.[a-zA-Z0-9]+)$/i, "$1");
}

// Generate relative path from source note folder to destination target
export function makeRelativePath(sourceDir: string, targetPath: string): string {
  const fromParts = sourceDir ? sourceDir.split("/").filter(Boolean) : [];
  const toParts = targetPath.split("/").filter(Boolean);

  let commonLength = 0;
  while (
    commonLength < fromParts.length &&
    commonLength < toParts.length &&
    fromParts[commonLength] === toParts[commonLength]
  ) {
    commonLength++;
  }

  const upCount = fromParts.length - commonLength;
  const relParts: string[] = [];

  for (let i = 0; i < upCount; i++) {
    relParts.push("..");
  }

  for (let i = commonLength; i < toParts.length; i++) {
    relParts.push(toParts[i]);
  }

  // URL encode segments (e.g. spaces -> %20)
  return relParts.map((p) => (p === ".." ? p : encodeURIComponent(p))).join("/");
}
