import { useCallback, useEffect, useMemo, useState } from "react";
import Button from "../shared/button";
import {
  formatDuration,
  getDuration,
  getFee,
  getTime,
  mergeMultipleSrtStrings,
  transcript,
  unzipAudios,
} from "utils";
import { useApiModal } from "./api-modal";
import { toast } from "sonner";
import { AudioInput, TranscriptOption } from "types";
import { ofetch } from "ofetch";
import InfoCard from "../shared/info-card";
import * as Switch from "@radix-ui/react-switch";
import ResultEditor from "./result-editor";

interface ResultProps {
  input: AudioInput;
}

type Step = "input" | "downloading" | "loading" | "result";

const DEFAULT_PROMPT = "Add punctuation marks and format the text.";
const DEFAULT_OPTION: TranscriptOption = {
  prompt: "",
  translate: false,
  srt: false,
};

const Result = ({ input }: ResultProps) => {
  const [step, setStep] = useState<Step>("input");
  const [progress, setProgress] = useState(0);
  const [option, setOption] = useState<TranscriptOption>(DEFAULT_OPTION);
  const [duration, setDuration] = useState<number>(input.duration);
  const { setShowApiModal, ApiModal } = useApiModal();
  const [result, setResult] = useState("");
  const filename = useMemo(() => {
    if (typeof input.input === "string") {
      return input.title;
    }
    return input.title.split(".").slice(0, -1).join(".");
  }, [input]);

  const getAudioDuration = useCallback(() => {
    if (typeof input.input === "string") {
      setDuration(input.duration);
      return;
    }
    getDuration(input.input).then((result) => setDuration(result));
  }, [input.duration, input.input]);

  useEffect(() => {
    if (input.input) setStep("input");
    getAudioDuration();
  }, [getAudioDuration, input.input]);

  const handleBack = () => {
    setStep("input");
    setResult("");
  };
  const audioSource = useMemo(() => {
    if (typeof input.input === "string") {
      return input.input;
    }
    return URL.createObjectURL(input.input);
  }, [input.input]);

  const submit = useCallback(async () => {
    const apiKey = localStorage.getItem("open-api-key");
    if (!apiKey) {
      setShowApiModal(true);
      return;
    }
    let audioFiles = [input.input];
    if (typeof input.input === "string") {
      setStep("downloading");
      try {
        const response = await ofetch(
          "https://recos-audio-slice-production.up.railway.app/download",
          { query: { url: input.input }, responseType: "blob" },
        );
        const audios = await unzipAudios(response, async (progress) =>
          setProgress(progress),
        );
        audioFiles = audios;
      } catch (error) {
        setStep("input");
        if (error instanceof Error) toast.error(error.message);
        return;
      }
    }
    setStep("loading");
    try {
      const results = await Promise.all(
        audioFiles.map((file) => {
          return transcript(
            file as File,
            {
              translate: option.translate,
              prompt: DEFAULT_PROMPT + option.prompt,
              srt: option.srt,
            },
            apiKey,
          );
        }),
      );
      setStep("result");
      const finalResult = option.srt
        ? mergeMultipleSrtStrings(...results)
        : results.join(" ");
      setResult(finalResult);
      document.title = "Task Completed, " + filename;
    } catch (error) {
      setStep("input");
      if (error instanceof Error) toast.error(error.message);
    }
  }, [input.input, setShowApiModal, option.srt, option.translate, option.prompt, filename]);
  return (
    <>
      <div className="border-1 mt-6 min-h-[10rem] w-full rounded-md border border-green-400 bg-white/40 dark:bg-black/40">
        <div className="flex flex-col items-center justify-start gap-2 p-2">
          <ApiModal />
          <div className="pt-4 pb-2 text-2xl font-bold dark:text-white">
            {input.title}
          </div>
          <div className="w-full rounded-md bg-green-200 px-4 py-6 dark:bg-green-400">
            <audio className="w-full" controls src={audioSource}></audio>
          </div>
        </div>
        {step === "input" && (
          <>
            <div className="flex flex-col items-center justify-start gap-2 p-2">
              <div className="grid w-full grid-cols-3 gap-2">
                <InfoCard
                  title="🎧"
                  value={formatDuration(duration)}
                  prefix=""
                ></InfoCard>
                <InfoCard
                  title="💰"
                  value={getFee(duration)}
                  prefix="≈ $"
                ></InfoCard>
                <InfoCard
                  title="⌛"
                  value={getTime(duration)}
                  prefix="≈"
                ></InfoCard>
              </div>
              <div className="grid w-full grid-cols-3 gap-2 md:grid-cols-5">
                <div className="col-span-2 flex flex-col space-y-2 rounded-md bg-green-200 p-4 dark:bg-green-400 md:col-span-4">
                  <label htmlFor="prompt" className="text-lg">
                    Prompt
                  </label>
                  <textarea
                    name="prompt"
                    cols={6}
                    className="textarea"
                    placeholder="Something about your audio, like language or keywords"
                    value={option.prompt}
                    onChange={(event) =>
                      setOption({ ...option, prompt: event.target.value })
                    }
                  />
                </div>
                <div className="col-span-1 flex flex-col items-center justify-between space-y-2 rounded-md bg-green-200 p-2 pt-4 dark:bg-green-400">
                  <label htmlFor="srt" className="text-lg">
                    Timestamp
                  </label>
                  <Switch.Root
                    className="relative h-[25px] w-[42px] cursor-default rounded-full bg-black outline-none focus:shadow-[0_0_0_2px] focus:shadow-black data-[state=checked]:bg-green-700"
                    id="srt"
                    checked={option.srt}
                    onCheckedChange={(value) =>
                      setOption({ ...option, srt: value })
                    }
                  >
                    <Switch.Thumb className="shadow-blackA7 block h-[21px] w-[21px] translate-x-0.5 rounded-full bg-white  transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]" />
                  </Switch.Root>
                  <span className="text-xs">Return srt format</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {step === "input" && (
        <Button className="mx-auto mt-10 mb-6 px-8" onClick={submit}>
          Generate Transcription
        </Button>
      )}
      {step === "loading" && (
        <div className="mt-10 flex h-60 flex-col items-center justify-center gap-2 darK:text-white">
          <span className="text-2xl dot-loader">Generating</span>
          <span className="mb-12">
            Please don&apos;t close the tab, and wait a few minutes.{" "}
          </span>
          <span className="printer-loader mb-24"></span>
        </div>
      )}
      {step === "downloading" && (
        <div className="mt-10 flex h-60 flex-col items-center justify-center gap-2 dark:text-white">
          <span className="text-2xl dot-loader">Preparing</span>
          <span className="mb-10">
            Please don&apos;t close the tab, and wait a few minutes.{" "}
          </span>
          <span className="player-loader"></span>
          <div className="my-10"></div>
        </div>
      )}
      {step === "input" && (
        <ResultEditor
          text={testText}
          title={filename}
          onBack={handleBack}
          srt={true}
        />
      )}
    </>
  );
};

const testText = `1
00:00:01,000 --> 00:00:03,000
行万里路读万卷书

2
00:00:03,000 --> 00:00:04,160
这里是路书

3
00:00:04,160 --> 00:00:04,760
大家好

4
00:00:04,760 --> 00:00:05,680
我是瞿侠

5
00:00:05,960 --> 00:00:06,440
大家好

6
00:00:06,440 --> 00:00:07,280
我是古村

7
00:00:08,240 --> 00:00:09,840
今天是路书的首播

8
00:00:10,160 --> 00:00:11,920
路书是一档讨论艺术史话题的

9
00:00:11,920 --> 00:00:12,880
播客节目

10
00:00:12,920 --> 00:00:15,880
我们追求知行合一的学习体验

11
00:00:16,120 --> 00:00:18,000
行路读书知其然

12
00:00:18,000 --> 00:00:19,280
更知其所以然

13
00:00:19,760 --> 00:00:21,880
推荐大家使用泛用型播客客户端

14
00:00:21,880 --> 00:00:22,720
订阅收听

15
00:00:22,760 --> 00:00:23,600
除此之外

16
00:00:23,640 --> 00:00:25,320
我们的节目还会在喜马拉雅

17
00:00:25,320 --> 00:00:26,520
网易云音乐

18
00:00:26,560 --> 00:00:28,760
荔枝FM等收听平台上同步

19
00:00:28,760 --> 00:00:31,160
我们欢迎您成为路书的会员

20
00:00:31,160 --> 00:00:32,600
支持我们行得更远

21
00:00:32,600 --> 00:00:33,640
读得更多

22
00:00:33,800 --> 00:00:35,480
有关会员计划的详情

23
00:00:35,480 --> 00:00:38,000
请访问 lushu88.com

24
00:00:38,040 --> 00:00:39,320
/member

25
00:00:41,400 --> 00:00:44,080
这是我们一次全新的节目

26
00:00:44,400 --> 00:00:46,000
在此瞿侠跟我

27
00:00:46,640 --> 00:00:49,160
向我们的新老听众先致以

28
00:00:49,400 --> 00:00:50,760
谢意跟问候

29
00:00:51,520 --> 00:00:53,800
那么在我们进入正式的

30
00:00:54,160 --> 00:00:55,760
这一期节目的内容之前

31
00:00:55,760 --> 00:00:58,680
我们先花几分钟聊一聊

32
00:00:58,680 --> 00:00:59,760
我们这期新的节目

33
00:00:59,760 --> 00:01:01,400
有些什么新的特点

34
00:01:02,480 --> 00:01:05,240
因为在过往两年里面做节目

35
00:01:05,400 --> 00:01:07,680
不断的收到我们热心的听友

36
00:01:07,680 --> 00:01:09,600
给我们来的反馈跟意见

37
00:01:10,640 --> 00:01:13,400
这里面很多涉及到了一点

38
00:01:14,240 --> 00:01:16,600
如何能够更系统

39
00:01:16,600 --> 00:01:19,080
或者是更全面的

40
00:01:19,080 --> 00:01:20,200
来了解一些

41
00:01:20,200 --> 00:01:22,520
我们在节目中所提的一些内容

42
00:01:22,520 --> 00:01:24,760
或补充这方面的知识

43
00:01:24,760 --> 00:01:28,080
有一个听众还提到这样一个问题

44
00:01:28,080 --> 00:01:29,200
就是授人以鱼

45
00:01:29,200 --> 00:01:31,040
不如授人以渔的问题

46
00:01:31,400 --> 00:01:33,440
那么这也是促使我们

47
00:01:34,480 --> 00:01:36,240
考虑在新的节目里

48
00:01:36,240 --> 00:01:37,680
补充一部分内容

49
00:01:38,560 --> 00:01:39,760
古人说

50
00:01:39,800 --> 00:01:41,880
读万卷书行万里路

51
00:01:41,920 --> 00:01:43,920
那么我们这个节目叫路书

52
00:01:43,920 --> 00:01:44,960
顾名思义

53
00:01:45,000 --> 00:01:48,280
除了在强调我们过往两年里面

54
00:01:48,280 --> 00:01:51,200
所一直强调的我们行路

55
00:01:51,200 --> 00:01:55,520
去体会于古人神接的意趣

56
00:01:55,640 --> 00:01:58,120
这方面我们继续会强调

57
00:01:58,160 --> 00:02:00,280
但是我们还会补充

58
00:02:00,320 --> 00:02:01,840
书这方面的内容

59
00:02:01,840 --> 00:02:03,880
这就是我们一个新的特点

60
00:02:04,720 --> 00:02:05,920
曲家念这讲到书

61
00:02:05,920 --> 00:02:08,480
我们有一个非常热心的网友

62
00:02:08,480 --> 00:02:11,040
在豆瓣里面列了一个

63
00:02:11,200 --> 00:02:12,840
列了一个书单

64
00:02:12,840 --> 00:02:15,040
好像是100多本书的书单

65
00:02:15,040 --> 00:02:16,600
看着叹为观止

66
00:02:16,960 --> 00:02:18,040
过去两年的积累

67
00:02:18,040 --> 00:02:19,400
可能100多本都不止

68
00:02:19,400 --> 00:02:21,880
好像我印象中反正有

69
00:02:21,920 --> 00:02:24,240
他因为是一栏一栏

70
00:02:24,240 --> 00:02:25,520
比方好像每一期节目

71
00:02:25,520 --> 00:02:27,360
都有一个书单

72
00:02:27,360 --> 00:02:28,120
对吧

73
00:02:28,120 --> 00:02:29,480
我们有100期节目

74
00:02:29,480 --> 00:02:29,960
你想想看

75
00:02:29,960 --> 00:02:31,560
一期节目如果有

76
00:02:31,840 --> 00:02:33,440
一本书就100本

77
00:02:33,440 --> 00:02:35,160
那一期节目不止100

78
00:02:35,160 --> 00:02:35,520
对吧

79
00:02:35,520 --> 00:02:37,440
所以这是相当可观的一个

80
00:02:37,600 --> 00:02:38,480
但我们节目

81
00:02:38,480 --> 00:02:40,800
我想不能在每期节目里

82
00:02:40,800 --> 00:02:42,400
都推荐很多种书

83
00:02:42,400 --> 00:02:44,720
对很多书当然不现实

84
00:02:44,720 --> 00:02:46,040
因为我觉得是这样

85
00:02:46,040 --> 00:02:48,560
有很多可能还需要

86
00:02:48,560 --> 00:02:50,800
我们热心的听友来补充`
export default Result;
