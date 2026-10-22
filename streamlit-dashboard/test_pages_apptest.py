"""AppTest harness: executes app.py and each of the seven pages."""
from streamlit.testing.v1 import AppTest

PAGES = [
    "Overview",
    "Graphs & Clusters",
    "Model Performance & Errors",
    "Reviews Explorer",
    "AI Research Assistant",
    "Feedback Prediction",
    "Model Workflow",
]

failures = 0
for page in PAGES:
    at = AppTest.from_file("app.py", default_timeout=60)
    at.run()
    if at.exception:
        failures += 1
        print(f"FAIL [{page}] initial: {at.exception[0].value}")
        continue
    radios = [w for w in at.sidebar.radio if w.key == "workspace_nav"]
    radios[0].set_value(page)
    at.run()
    exc = at.exception[0].value if at.exception else None
    n_elements = len(at.main)
    has_content = n_elements > 0
    status = "PASS" if (not exc and has_content) else "FAIL"
    if status == "FAIL":
        failures += 1
    print(f"{status} [{page}] elements={n_elements} exception={exc!r}")

print("RESULT:", "ALL PAGES PASS" if failures == 0 else f"{failures} PAGE(S) FAILED")
