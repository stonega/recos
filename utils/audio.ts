import * as zip from "@zip.js/zip.js";

const FeePerMinute = 0.006;

export function getFee(duration: number) {
  const fee = (duration / 60) * FeePerMinute;
  return fee.toFixed(3);
}

export function getTime(duration: number) {
  const time = Math.min(120, duration / 10);
  return formatDuration(time);
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.ceil(seconds % 60);

  const padWithZero = (value: number): string =>
    value < 10 ? "0" + value : value.toString();

  return (
    padWithZero(hours) +
    ":" +
    padWithZero(minutes) +
    ":" +
    padWithZero(remainingSeconds)
  );
}

export async function unzipAudios(
  response: Blob,
  progress: (progress: number, total: number) => Promise<void>,
) {
  const config = {
    filenameEncoding: "cp437",
  };
  const responseBlob = new zip.BlobReader(response);
  const zipReader = new zip.ZipReader(responseBlob);
  const entries = await zipReader.getEntries(config);
  const audios = await Promise.all(
    entries.map(async (entry) => {
      const slice = await entry.getData!(new zip.BlobWriter(), {
        onprogress: progress,
      });
      return new File([slice], entry.filename);
    }),
  );
  return audios;
}
