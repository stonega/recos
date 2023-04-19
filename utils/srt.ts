type SrtItem = {
  id: number,
  time: string,
  text: string
}

function parseSrt(
  srtString: string,
): SrtItem[] {
  const srtLines = srtString.trim().split("\n\n");
  return srtLines.map((line) => {
    const parts = line.trim().split("\n");
    return {
      id: parseInt(parts[0]),
      time: parts[1],
      text: parts.slice(2).join("\n"),
    };
  });
}

export function mergeSrtStrings(srt1: string, srt2: string): string {
  const srt1Parsed = parseSrt(srt1);
  const srt2Parsed = parseSrt(srt2);

  const lastTimeSrt1 = srt1Parsed[srt1Parsed.length - 1].time.split(" --> ")[1];
  const timeParts = lastTimeSrt1.split(":");
  const endTimeSrt1 =
    (+timeParts[0] * 3600 +
      +timeParts[1] * 60 +
      parseFloat(timeParts[2].replace(",", "."))) *
    1000;

  const srt2Adjusted = srt2Parsed.map((subtitle) => {
    const [start, end] = subtitle.time.split(" --> ").map((time) => {
      const parts = time.split(":");
      const timeInMs =
        (+parts[0] * 3600 +
          +parts[1] * 60 +
          parseFloat(parts[2].replace(",", "."))) *
        1000;
      const adjustedTime = timeInMs + endTimeSrt1;
      const ms = adjustedTime % 1000;
      const seconds = Math.floor(adjustedTime / 1000) % 60;
      const minutes = Math.floor(adjustedTime / (1000 * 60)) % 60;
      const hours = Math.floor(adjustedTime / (1000 * 60 * 60));
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")},${ms
        .toString()
        .padStart(3, "0")}`;
    });
    return {
      id: subtitle.id + srt1Parsed.length,
      time: `${start} --> ${end}`,
      text: subtitle.text,
    };
  });

  const mergedSubtitles = [...srt1Parsed, ...srt2Adjusted];
  // Adjust the index
  mergedSubtitles.forEach((subtitle, index) => {
    subtitle.id = index + 1;
  });

  return mergedSubtitles
    .map((subtitle) => `${subtitle.id}\n${subtitle.time}\n${subtitle.text}`)
    .join("\n\n");
}

function mergeMultiSrtItems(...items: SrtItem[]) {
  const startTime = items[0].time.split(" --> ")[0];
  const endTime = items[items.length - 1].time.split(" --> ")[1];
  return {
    id: items[0].id,
    time: startTime + " --> " + endTime,
    text: items.map((item) => item.text).join(" "),
  }
}

export function mergeMultipleSrtStrings(compact = 5,...srts: string[]): string {
  const [firstSrt, ...remainingSrts] = srts;
  let mergedSrtString = firstSrt;

  remainingSrts.forEach((srt) => {
    mergedSrtString = mergeSrtStrings(mergedSrtString, srt);
  });
  const mergedSrt = parseSrt(mergedSrtString)
  
  if(compact === 1) return mergedSrt.map((subtitle) => `${subtitle.id}\n${subtitle.time}\n${subtitle.text}`).join("\n\n");
  let tempItems: SrtItem[] = []
  let mergedSubtitles: SrtItem[] = [];
  mergedSrt.forEach((item, index) => {
    tempItems.push(item)
    if((index + 1) % compact === 0 || index === mergedSrt.length - 1) {
      mergedSubtitles.push(mergeMultiSrtItems(...tempItems))
      tempItems = []
    }
  })

  mergedSubtitles.forEach((subtitle, index) => {
    subtitle.id = index + 1;
  });
  return mergedSubtitles
    .map((subtitle) => `${subtitle.id}\n${subtitle.time}\n${subtitle.text}`)
    .join("\n\n");
}
