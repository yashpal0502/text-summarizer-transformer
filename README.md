# Text Summarizer using T5 Transformer

A practical dialogue summarization project using **Hugging Face Transformers**, **T5-base**, and the **SAMSum** dataset.

## Project Goal

Convert conversational dialogue into a concise, meaningful summary using a fine-tuned sequence-to-sequence Transformer.

## Dataset

| Split | Samples |
|---|---:|
| Training | 14,731 |
| Validation | 818 |
| Test | 819 |

## Project Structure

```text
text-summarizer-transformer/
├── data/
│   ├── raw/
│   └── tokenized/
│       ├── train/
│       ├── val/
│       └── test/
├── notebooks/
│   ├── 01_preprocessing.ipynb
│   ├── 02_finetuning.ipynb
│   └── 03_inference.ipynb
├── models/
│   └── saved_summary_model/
├── results/
├── REPORT.md
└── README.md
```

## Workflow

```text
SAMSum
  ↓
Cleaning
  ↓
Train / Validation / Test
  ↓
T5 Tokenization
  ↓
T5-base Fine-tuning
  ↓
Validation + Checkpoints
  ↓
Saved Model
  ↓
Inference
  ↓
ROUGE Evaluation
  ↓
Error Analysis
```

## Preprocessing

Text cleaning removes HTML-like markup, line breaks, repeated whitespace, and leading/trailing whitespace.

```python
import re

def clean_data(text):
    text = re.sub(r"<.*?>", " ", text)
    text = re.sub(r"\r\n|\r|\n", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()
```

The project intentionally did not force lowercase conversion.

T5 tokenization used:

- `T5Tokenizer`
- `t5-base`
- `summarize:` task prefix
- input maximum length: 512
- target maximum length: 150
- label padding replaced with `-100`

## Fine-tuning

The final model was:

```python
T5ForConditionalGeneration.from_pretrained("t5-base")
```

Training used:

- `DataCollatorForSeq2Seq`
- `Seq2SeqTrainer`
- validation during training
- checkpoint saving
- best-model loading
- ROUGE-based validation
- gradient accumulation
- BF16 when supported
- early stopping
- up to 6 epochs

Training was successfully resumed from a checkpoint after a runtime/internet interruption.

## Inference

The saved model and tokenizer are loaded from the model directory.

Generation used:

```text
max_new_tokens = 128
num_beams = 4
no_repeat_ngram_size = 3
early_stopping = True
```

Both single-dialogue and batch inference were implemented. Batch inference sorts inputs by length to reduce padding and restores the original order.

## Evaluation

ROUGE evaluation used `rouge_score` and a simple Python loop.

The final reported evaluation used **200 examples from the 819-example test set** because full evaluation was time-consuming.

| Metric | Score |
|---|---:|
| ROUGE-1 | 49.89% |
| ROUGE-2 | 24.02% |
| ROUGE-L | 40.86% |

### T5-small baseline vs T5-base

| Model | ROUGE-1 | ROUGE-2 | ROUGE-L |
|---|---:|---:|---:|
| T5-small | 44.48% | 20.26% | 37.94% |
| T5-base | 49.89% | 24.02% | 40.86% |

Approximate improvement with T5-base:

- ROUGE-1: +5.41 percentage points
- ROUGE-2: +3.76 percentage points
- ROUGE-L: +2.92 percentage points

These results are based on the reported 200-example evaluation, not the complete test set.

## Error Analysis

Manual testing identified:

1. **Information omission** — important secondary details may be missed.
2. **Event confusion** — separate events may be merged.
3. **Awkward wording** — meaning may be correct but grammar imperfect.
4. **Hallucination** — unsupported information may occasionally appear.
5. **Multi-event difficulty** — longer conversations are harder.

Example observations included missing a final action/advice, confusing separate lunch and tea events, and generating unsupported dinner/pickup information.

## Technologies

- Python
- PyTorch
- Hugging Face Transformers
- Hugging Face Datasets
- T5-base
- SAMSum
- ROUGE
- NumPy
- Pandas
- Jupyter Notebook / Google Colab
- CUDA / GPU

## Key Learning Outcomes

- Sequence-to-sequence Transformers
- T5 task prefixes
- Tokenization and attention masks
- Padding, truncation, and label masking
- Hugging Face Datasets
- Fine-tuning pretrained Transformers
- `Seq2SeqTrainer`
- Checkpoints and resuming training
- Beam search
- Batch inference
- ROUGE evaluation
- Qualitative error analysis
- Hallucination and information omission

## Current Status

- Preprocessing: **Complete**
- Fine-tuning: **Complete**
- Inference: **Complete**
- Evaluation: **Complete**
- Basic error analysis: **Complete**
- Advanced generation optimization: **Stopped intentionally**
- Deployment: **Not required for this learning project**

## Future Scope

Possible extensions are complete-test-set evaluation, systematic generation-parameter tuning, larger error analysis, comparison with other summarization models, and deployment through an API/web application.

## Conclusion

The project demonstrates a complete beginner-to-intermediate workflow for fine-tuning T5-base for dialogue summarization. The model achieved 49.89% ROUGE-1, 24.02% ROUGE-2, and 40.86% ROUGE-L on the reported 200-example test subset.
