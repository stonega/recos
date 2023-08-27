const data = {
  features: [
    {
      title: "Stability",
      description:
        "Recos use the robust and speedy Whisper API from OpenAI to generate content, ensuring a stable experience.",
    },
    {
      title: "Scalability",
      description:
        "With the capacity to process audio files up to 100 MB, Recos can handle even large files with ease.",
    },
    {
      title: "Privacy",
      description:
        "Recos do not retain any files on our servers, ensuring complete confidentiality for your content.",
    },
  ],
};
const WhatIsRecos = () => {
  return (
    <div className="mt-20">
      <div className="my-8 text-4xl font-bold text-green-600 dark:text-green-600">
        Why choose Recos.
      </div>
      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
        {data.features.map((item) => (
          <div key={item.title} className="card">
            <div className="mb-4 mt-2 text-2xl font-bold dark:text-white">
              {item.title}
            </div>
            <div className="text-xl dark:text-white">{item.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhatIsRecos;
