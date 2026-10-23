# TEXT SUMMARIZER USING T5 TRANSFORMER

## Project Report

---

## 1. Abstract

This project develops a dialogue summarization system using the pretrained T5-base Transformer. The model was fine-tuned on the SAMSum conversational dataset and evaluated using ROUGE metrics. The work covers preprocessing, tokenization, dataset preparation, fine-tuning, checkpoint handling, model saving, inference, qualitative testing, and basic error analysis.

## 2. Objectives

- Understand a practical sequence-to-sequence Transformer workflow.
- Fine-tune T5 for dialogue summarization.
- Build reusable single and batch inference pipelines.
- Evaluate summaries using ROUGE-1, ROUGE-2, and ROUGE-L.
- Identify common summarization errors.

## 3. Dataset

The project uses SAMSum, a dialogue summarization dataset containing conversations and reference summaries.

| Split      | Samples |
|------------|---------|
| Training   | 14,731  |
| Validation | 818     |
| Test       | 819     |

## 4. Preprocessing

Text cleaning removed HTML-like markup, line breaks, repeated whitespace, and surrounding whitespace. The project did not force lowercase conversion. T5 tokenization used the `summarize:` task prefix, 512-token input sequences, and 150-token target sequences. Padding positions in labels were replaced by `-100`.

## 5. Fine-tuning

The final model was `T5ForConditionalGeneration` using the pretrained `t5-base` checkpoint.

- `DataCollatorForSeq2Seq` and `Seq2SeqTrainer` were used.
- Training was configured for up to 6 epochs.
- Validation, checkpoint saving, and best-model loading were used.
- ROUGE was used during validation.
- Gradient accumulation, BF16 when supported, and early stopping were included.
- GPU acceleration was used when available.

Training was interrupted by a runtime/internet disconnection and resumed successfully from a saved checkpoint. A T5 tied/shared-weight checkpoint warning was observed, but training completed successfully.

## 6. Model Saving and Inference

The trained model and tokenizer were saved and later loaded for inference. The inference pipeline cleans the dialogue, adds the `summarize:` prefix, tokenizes it, generates token IDs, and decodes them into a readable summary.

Generation used `max_new_tokens=128`, `num_beams=4`, `no_repeat_ngram_size=3`, and `early_stopping=True`. A batch summarization function was also implemented and optimized to reduce unnecessary padding.

## 7. Evaluation

Evaluation used `rouge_score` with a simple loop-based implementation. The reported final evaluation used 200 examples from the 819-example test set because evaluating the entire test set was time-consuming.

| Metric  | Score           |
|---------|-----------------|
| ROUGE-1 | 0.4989 (49.89%) |
| ROUGE-2 | 0.2402 (24.02%) |
| ROUGE-L | 0.4086 (40.86%) |

## 8. Baseline Comparison

| Model    | ROUGE-1 | ROUGE-2 | ROUGE-L |
|----------|---------|---------|---------|
| T5-small | 44.48%  | 20.26%  | 37.94%  |
| T5-base  | 49.89%  | 24.02%  | 40.86%  |

The reported T5-base results improved over the earlier T5-small baseline by approximately +5.41, +3.76, and +2.92 percentage points for ROUGE-1, ROUGE-2, and ROUGE-L respectively.

## 9. Qualitative Testing and Error Analysis

Manual testing showed that the model generally captures the main topic of a conversation, but recurring weaknesses were observed:

- Information omission.
- Confusion between separate events, dates, or actions.
- Awkward or grammatically imperfect wording.
- Occasional hallucination of unsupported information.
- Greater difficulty with long conversations containing many events.

## 10. Technologies

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

## 11. Key Learning Outcomes

- Sequence-to-sequence Transformers and T5.
- Task prefixes, tokenization, attention masks, padding, truncation, and label masking.
- Hugging Face Dataset preparation and persistence.
- Fine-tuning with `Seq2SeqTrainer`.
- Checkpoint saving and resuming.
- Beam search and batch inference.
- ROUGE-based evaluation.
- Qualitative error analysis and recognition of hallucination and omission.

## 12. Limitations

- The final ROUGE evaluation used 200 of 819 test examples.
- Generation-parameter optimization was started but intentionally stopped.
- Error analysis was based on selected examples.
- Production deployment was outside the project's scope.

## 13. Future Scope

- Evaluate all 819 test examples.
- Systematically tune generation parameters.
- Perform larger-scale error analysis.
- Experiment with other pretrained summarization models.
- Deploy through an API or web application.

## 14. Conclusion

The project successfully demonstrates a practical beginner-to-intermediate implementation of Transformer-based dialogue summarization. T5-base was fine-tuned on SAMSum, saved for reuse, tested through single and batch inference, and evaluated using ROUGE. The reported scores were 49.89% ROUGE-1, 24.02% ROUGE-2, and 40.86% ROUGE-L on a 200-example test subset. The project is complete at the intended learning scope without requiring advanced optimization or deployment.
