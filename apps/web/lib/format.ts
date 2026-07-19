export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unitIndex]}`;
}

export function formatPercentSaved(originalBytes: number, outputBytes: number): string {
  if (originalBytes <= 0) return "0%";
  const saved = ((originalBytes - outputBytes) / originalBytes) * 100;
  return `${saved.toFixed(saved >= 10 ? 0 : 1)}%`;
}

export function formatCompressionRatio(originalBytes: number, outputBytes: number): string {
  if (outputBytes <= 0) return "-";
  const ratio = originalBytes / outputBytes;
  return `${ratio.toFixed(ratio >= 10 ? 0 : 1)}:1`;
}
