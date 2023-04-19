import { mergeMultipleSrtStrings, mergeSrtStrings } from "utils/srt";
import { describe, test, expect } from "vitest";

describe("srt test", () => {
  const srt1 = `1
00:00:00,000 --> 00:00:01,000
First subtitle

2
00:00:01,000 --> 00:00:02,000
Second subtitle

`;

  const srt2 = `1
00:00:00,000 --> 00:00:01,000
Third subtitle

2
00:00:01,000 --> 00:00:02,000
Fourth subtitle

`;
  const srt3 = `1
00:00:00,000 --> 00:00:01,000
Fifth subtitle

2
00:00:01,000 --> 00:00:02,000
Sixth subtitle

`;
  // Expected output
  const expectedResult = `1
00:00:00,000 --> 00:00:01,000
First subtitle

2
00:00:01,000 --> 00:00:02,000
Second subtitle

3
00:00:02,000 --> 00:00:03,000
Third subtitle

4
00:00:03,000 --> 00:00:04,000
Fourth subtitle`;

  test("merge srt", () => {
    const result = mergeSrtStrings(srt1, srt2)
    console.log(result);
    expect(result).toBe(expectedResult);
  });

  test("merge multiple srt", () => {
    const result = mergeMultipleSrtStrings(3, srt1, srt2, srt3);
    const expectedResult = `1
00:00:00,000 --> 00:00:03,000
First subtitle Second subtitle Third subtitle

2
00:00:03,000 --> 00:00:06,000
Fourth subtitle Fifth subtitle Sixth subtitle`
    console.log(result);
    expect(result).toBe(expectedResult);
  });
});
