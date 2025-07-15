import ast
import json
import sys

def explain_code(code):
    try:
        tree = ast.parse(code)
        func_names = [node.name for node in ast.walk(tree) if isinstance(node, ast.FunctionDef)]
        class_names = [node.name for node in ast.walk(tree) if isinstance(node, ast.ClassDef)]

        explanation = []

        if func_names:
            explanation.append(f"The code defines function(s): {', '.join(func_names)}.")
        if class_names:
            explanation.append(f"It includes class(es): {', '.join(class_names)}.")
        if not explanation:
            explanation.append("No functions or classes found. Likely a script with simple statements.")

        return {"explanation": " ".join(explanation)}

    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    input_data = json.loads(sys.stdin.read())
    code = input_data.get("code", "")
    output = explain_code(code)
    print(json.dumps(output))

