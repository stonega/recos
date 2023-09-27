const data = {
  qas: [
    {
      question: "What does Recos do?",
      answer:
        "Recos is a web app that transcribes audio content into text using Whisper API. You can use your own OpenAI API key, or login to use credits.",
    },
    {
      question: "What file formats does Recos support?",
      answer:
        "Recos supports a variety of common audio file formats, including MP3, WAV, M4A, and FLAC. If you encounter any issues with a specific file format, please contact our customer support team for assistance.",
    },
    {
      question: "How accurate is Recos' transcription?",
      answer:
        "Recos is using whisper API from OpenAI. The accuracy is depended on OpenAI Whisper model. ",
    },
    {
      question: "How does the credit count?",
      answer:
        "You can generate 1 minute of audio transcription with 1 credit. For example, if you have 100 credits, you can generate 100 minutes of audio transcription. The duration is rounded to the nearest minute, for example, 1 minute 1 second will be counted as 1   minutes.",
    },
  ],
};
const WhatIsRecos = () => {
  return (
    <div className="mt-20">
      <div className="my-8 text-4xl font-bold text-green-600 dark:text-green-600">
        FAQS
      </div>
      <div className="border-t-2 border-green-500 py-2"></div>
      {data.qas.map((item, index) => (
        <div key={item.question}>
          <div className="my-4 text-xl font-bold">{item.question}</div>
          <div className="text-lg dark:text-white">
            {item.answer}{" "}
            {index == 2 && (
              <a
                className="text-green-500 underline decoration-solid hover:text-green-400"
                href="https://raw.githubusercontent.com/openai/whisper/main/language-breakdown.svg"
                target="_blank"
                rel="noreferrer"
              >
                Read more.
              </a>
            )}{" "}
          </div>
        </div>
      ))}
      <div className="border-b-2 border-green-500 py-4"></div>
    </div>
  );
};

export default WhatIsRecos;
