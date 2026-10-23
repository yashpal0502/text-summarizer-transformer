import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FileTextIcon,
  MessageCircleMoreIcon,
  MessageSquareTextIcon,
  PencilIcon,
  SparklesIcon,
  TrashIcon,
} from "lucide-react";

const examples = [
  {
    title: "Example 1",
    description: "Contact information",
  },
  {
    title: "Example 2",
    description: "Watching a video",
  },
  {
    title: "Example 3",
    description: "Buying clothes",
  },
  {
    title: "Example 4",
    description: "Dinner plans",
  },
  {
    title: "Example 5",
    description: "Travel and meeting",
  },
];

const Home = () => {
  const [dialogue, setDialogue] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const generateSummary = async () => {
    if (!dialogue.trim()) return;

    try {
      setLoading(true);

      const response = await axios.post("http://127.0.0.1:8000/summarize/", {
        dialogue: dialogue,
      });

      setSummary(response.data.summary);
    } catch (error) {
      console.log("Error generating summary:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateSummary();
  }, []);

  return (
    <div className="min-h-screen bg-[#F1F6FE] px-6 pb-10 md:px-8 lg:px-10">
      {/* Title section */}
      <div className="flex flex-col justify-center items-center py-4 md:py-6">
        <div className="flex justify-center items-center gap-2 pb-1 md:pb-2">
          <MessageSquareTextIcon
            size={22}
            className="bg-[#6C63F2] w-9 h-9 p-1.5 md:w-10 md:h-10 md:p-2 rounded-xl text-white"
          />
          <p className="text-2xl md:text-3xl font-semibold">
            Dialogue Summarizer
          </p>
        </div>
        <p className="text-sm text-center px-2 pt-1 text-[#526887]">
          Enter a conversation and get a concise summary using a fine-tuned T5
          model.
        </p>
      </div>

      {/* Middle Section */}
      <div className="flex max-sm:flex-col gap-4">
        {/* input */}
        <div className="p-4 bg-white md:w-1/2 rounded-xl border border-[#DDE7F5]">
          <div className="flex items-center pb-4">
            <PencilIcon className="h-13 w-13 p-2 rounded-xl bg-[#E8F0FF] text-[#3478E8]" />
            <div className="px-3">
              <p className="font-semibold text-xl">Input Dialogue</p>
              <p className="text-[13px] text-[#526887]">
                Enter a conversation between two or more people
              </p>
            </div>
          </div>
          <textarea
            value={dialogue}
            onChange={(e) => setDialogue(e.target.value)}
            placeholder={`Hannah: Hey, do you have Betty's number?
Amanda: Let me check...
Hannah: I need to contact her about the meeting.`}
            className="w-full border border-[#DFE5F2] outline-none h-80 md:h-[360px] rounded-xl p-4 focus:ring-2 focus:ring-[#4379E9]/20"
          />

          <div className="flex gap-3 pt-5">
            <button
              onClick={() => {
                (setDialogue(""), setSummary(""));
              }}
              className="flex gap-2 w-1/3 border-[2px] border-[#D7DEEC] justify-center items-center py-2 rounded-xl hover:bg-red-100 hover:border-red-200 transition duration-300"
            >
              <TrashIcon size={22} className="text-slate-500" />
              <p className="text-[18px] text-slate-500 font-semibold">Clear</p>
            </button>
            <button
              onClick={generateSummary}
              disabled={loading}
              className="flex gap-2 w-2/3 border border-[2px] border-[#4379E9] justify-center items-center bg-[#4379E9] py-2 rounded-xl shadow-md group hover:bg-[#3478E8] active:scale-[0.98] hover:border-[#E5F8EE] transition duration-300"
            >
              <SparklesIcon size={22} className="text-white" />
              <p className="text-[18px] text-white font-semibold">
                {loading ? "Generating..." : "Generate Summary"}
              </p>
            </button>
          </div>
        </div>
        {/* summary */}
        <div className="p-4 bg-white md:w-1/2 flex flex-col gap-3 rounded-xl border border-[#DDE7F5]">
          <div className="flex items-center pb-3">
            <FileTextIcon className="h-13 w-13 p-2 rounded-xl bg-[#E5F8EE] text-[#18B85A]" />
            <div className="px-3">
              <p className="font-semibold text-xl">Summary</p>
              <p className="text-[13px] text-[#526887]">
                Here is the generated summary of the dialogue.
              </p>
            </div>
          </div>
          <p className="bg-[#F0FAF5] p-4 md:p-6 rounded-xl text-[16px] text-[#182033] leading-7">
            {summary || "Your generated summary will appear here."}
          </p>
        </div>
      </div>

      {/* Footer Section */}
      <div className="bg-white my-4 md:my-6 rounded-xl border border-[#DDE7F5]">
        <div className="flex items-center p-4">
          <img
            src="/lightbulb.svg"
            alt="Try an example"
            className="h-13 w-13 p-2 rounded-xl bg-slate-100"
          />
          <div className="px-3">
            <p className="font-semibold text-xl">Try an Example</p>
            <p className="text-[13px] text-[#526887]">
              Click on an example below to see how it works.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 px-4 pb-4">
          {examples.map((example) => {
            return (
              <div
                key={example.title}
                className="flex items-center p-2.5 gap-3 border border-2 border-[#D7DEEC] rounded-xl"
              >
                <MessageCircleMoreIcon className="bg-[#EAF2FF] text-[#3478E8] h-12 w-12 p-2.5 rounded-2xl" />
                <div>
                  <p className="font-semibold">{example.title}</p>
                  <p className="text-[13px] text-[#526887]">
                    {example.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
