from transformers import RobertaTokenizer, T5ForConditionalGeneration
import sys
import json

tokenizer = RobertaTokenizer.from_pretrained("Salesforce/codet5-base-multi-sum")
model = T5ForConditionalGeneration.from_pretrained("Salesforce/codet5-base-multi-sum")

try:
    input_json = sys.stdin.read()
    data = json.loads(input_json)
    code = data.get("code", "")

    if not code:
        print(json.dumps({"error": "No code provided"}))
        sys.exit()

    prompt = f"summarize: {code}"
    input_ids = tokenizer(prompt, return_tensors="pt").input_ids
    output_ids = model.generate(input_ids, max_length=64)
    explanation = tokenizer.decode(output_ids[0], skip_special_tokens=True)

    print(json.dumps({"explanation": explanation}))

except Exception as e:
    print(json.dumps({"error": str(e)}))
    sys.exit(1)
