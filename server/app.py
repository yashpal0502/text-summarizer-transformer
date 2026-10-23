from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import T5ForConditionalGeneration, T5Tokenizer
import torch
import re

# initialize fastapi app
app = FastAPI(
    title="Text Summarizer App",
    description="Text Summarization using T5",
    version="1.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and tokenizer
model = T5ForConditionalGeneration.from_pretrained("models/saved_summary_model")
tokenizer = T5Tokenizer.from_pretrained("models/saved_summary_model")

# device
if torch.backends.mps.is_available():
    device = torch.device("mps")
elif torch.cuda.is_available():
    device = torch.device("cuda")
else:
    device = torch.device("cpu")

model.to(device)


# Input schema
class DialogueInput(BaseModel):
    dialogue: str


def clean_data(text):
    text = re.sub(r"<.*?>", " ", text)  # Remove HTML tags
    text = re.sub(r"\r\n|\r|\n", " ", text)  # Remove line breaks
    text = re.sub(r"\s+", " ", text)  # Normalize whitespace
    text = text.strip()

    return text


def summarize_dialogue(dialogue: str) -> str:
    dialogue = "summarize: " + clean_data(dialogue)

    # tokenization (no padding needed for a single example)
    inputs = tokenizer(
        dialogue, max_length=512, truncation=True, return_tensors="pt"
    ).to(device)

    # generate summary :- token id's will be generated
    with torch.no_grad():
        targets = model.generate(
            input_ids=inputs["input_ids"],
            attention_mask=inputs["attention_mask"],
            max_new_tokens=128,
            num_beams=4,
            no_repeat_ngram_size=3,
            early_stopping=True,
        )

    # token id's to summary
    summary = tokenizer.decode(targets[0], skip_special_tokens=True)

    return summary


# API Endpoints
@app.post("/summarize/")
async def summarize(dialogue_input: DialogueInput):
    summary = summarize_dialogue(dialogue_input.dialogue)
    return {"summary": summary}
