import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTaskById, runTaskCode } from "../api";

export default function TaskDetail() {
  const { taskId } = useParams();

  const [task, setTask] = useState(null);
  const [codeWithHeader, setCodeWithHeader] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTestIndex, setActiveTestIndex] = useState(0);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    setResults(null);
    setError(null);
    setCodeWithHeader("");
    setActiveTestIndex(0);

    getTaskById(taskId)
      .then((taskData) => {
        setTask(taskData);

        let funcArgs = "...";
        if (taskData.tests?.length > 0) {
          const firstTest = taskData.tests.find((t) => t.is_active);
          if (firstTest) {
            try {
              const inputObj = JSON.parse(firstTest.input_data);
              funcArgs = Object.keys(inputObj).join(", ");
            } catch {}
          }
        }

        const funcHeader = `def ${taskData.function_name}(${funcArgs}):`;
        const initialBody = "    ";

        setCodeWithHeader(funcHeader + "\n" + initialBody);
      })
      .catch((e) => setError("Задача не найдена: " + e));
  }, [taskId]);

  function normalizeBodyLines(lines) {
    return lines.map((line) => {
      if (line.trim() === "") return "    ";
      if (!line.startsWith("    ")) return "    " + line.trimStart();
      return line;
    });
  }

  function handleCodeChange(e) {
    const value = e.target.value;
    const lines = value.split("\n");

    const header = lines[0] || "";
    const bodyLines = lines.slice(1);

    const normalizedBody = normalizeBodyLines(bodyLines);
    const normalizedCode = [header, ...normalizedBody].join("\n");
    setCodeWithHeader(normalizedCode);
  }

  function handlePaste(e) {
    e.preventDefault();
    const paste = e.clipboardData.getData("text");
    const pasteLines = paste.split("\n");

    const textarea = e.target;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const normalizedPasteLines = pasteLines.map((line) =>
      line.trim() === "" ? "    " : "    " + line.trimStart()
    );

    const beforeCursor = codeWithHeader.substring(0, start);
    const afterCursor = codeWithHeader.substring(end);

    const newCode = beforeCursor + normalizedPasteLines.join("\n") + afterCursor;

    setCodeWithHeader(newCode);

    setTimeout(() => {
      const pos = start + normalizedPasteLines.join("\n").length;
      textarea.selectionStart = textarea.selectionEnd = pos;
    }, 0);
  }

  function handleKeyDown(e) {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = e.target;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const newValue =
        codeWithHeader.substring(0, start) +
        "    " +
        codeWithHeader.substring(end);

      setCodeWithHeader(newValue);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    } else if (e.key === "Enter") {
      e.preventDefault();

      const textarea = e.target;
      const value = textarea.value;
      const selectionStart = textarea.selectionStart;
      const selectionEnd = textarea.selectionEnd;

      const lines = value.substring(0, selectionStart).split("\n");

      if (lines.length === 1) {
        const newValue =
          value.slice(0, selectionStart) + "\n" + value.slice(selectionEnd);
        setCodeWithHeader(newValue);

        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = selectionStart + 1;
        }, 0);
        return;
      }

      const currentLine = lines[lines.length - 1];
      const indentMatch = currentLine.match(/^(\s*)/);
      const indent = indentMatch ? indentMatch[1] : "";

      const insertText = "\n" + indent;
      const newValue =
        value.slice(0, selectionStart) + insertText + value.slice(selectionEnd);
      setCodeWithHeader(newValue);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = selectionStart + insertText.length;
      }, 0);
    }
  }

  async function runCode() {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const lines = codeWithHeader.split("\n");
      const bodyLines = lines.slice(1);

      const bodyCode = bodyLines
        .map((line) => (line.startsWith("    ") ? line.slice(4) : line))
        .join("\n");

      if (!bodyCode.trim()) {
        throw new Error("Тело функции не должно быть пустым.");
      }

      const data = await runTaskCode(taskId, bodyCode);
      setResults(data);
      setActiveTestIndex(0);
    } catch (e) {
      setError("Ошибка выполнения: " + e);
    } finally {
      setLoading(false);
    }
  }

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  if (error)
    return (
      <div className={`container ${theme}`}>
        <div className="error">{error}</div>
      </div>
    );
  if (!task)
    return (
      <div className={`container ${theme}`}>
        <div className="loading">Загрузка задачи...</div>
      </div>
    );

  const activeTests = task.tests?.filter((t) => t.is_active) || [];

  return (
    <div className={`container ${theme}`}>
      <header className="header" role="banner">
        <h1>{task.title}</h1>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          type="button"
        >
          {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </header>

      <main className="main-content">
        <section
          className="description-panel"
          aria-label="Task description and testcases"
        >
          <h2 className="subtitle">Description</h2>
          <div className="tags-row" aria-label="Difficulty tag">
            <span className="tag difficulty">{task.difficulty || "Unknown"}</span>
          </div>
          <p className="description-text" tabIndex={0}>
            {task.description}
          </p>

          {activeTests.length > 0 && (
            <div className="examples">
              <h3>Testcases</h3>
              <div
                className="testcase-list"
                role="list"
                aria-label="Test case selector"
              >
                {activeTests.map((test, idx) => (
                  <button
                    key={test.id}
                    className={`testcase-btn ${
                      activeTestIndex === idx ? "active" : ""
                    }`}
                    onClick={() => setActiveTestIndex(idx)}
                    type="button"
                    aria-pressed={activeTestIndex === idx}
                  >
                    Case {idx + 1}
                  </button>
                ))}
              </div>
              <div
                className="testcase-data"
                aria-live="polite"
                aria-atomic="true"
                tabIndex={0}
              >
                <div>
                  <b>Input:</b>
                  <pre>{activeTests[activeTestIndex]?.input_data}</pre>
                </div>
                <div>
                  <b>Expected Output:</b>
                  <pre>{activeTests[activeTestIndex]?.expected_output}</pre>
                </div>
                {results &&
                  results.results &&
                  results.results[activeTestIndex] && (
                    <div>
                      <b>Your Output:</b>
                      <pre>
                        {typeof results.results[activeTestIndex].output ===
                        "string"
                          ? results.results[activeTestIndex].output
                          : JSON.stringify(
                              results.results[activeTestIndex].output,
                              null,
                              2
                            )}
                      </pre>
                      <b>Result: </b>
                      {results.results[activeTestIndex].passed ? (
                        <span className="pass-text">Passed</span>
                      ) : (
                        <span className="fail-text">Failed</span>
                      )}
                      {results.results[activeTestIndex].error && (
                        <div className="error-text">
                          <b>Error:</b> {results.results[activeTestIndex].error}
                        </div>
                      )}
                    </div>
                  )}
              </div>
            </div>
          )}
        </section>

        <section className="editor-panel" aria-label="Code editor">
          <textarea
            className="code-editor"
            value={codeWithHeader}
            onChange={handleCodeChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            spellCheck={false}
            rows={30}
            aria-label="Code editor"
          />
          <button
            className="run-button"
            onClick={runCode}
            disabled={loading || !codeWithHeader.trim()}
            title="Run Code"
            aria-live="polite"
            type="button"
          >
            {loading ? "Running..." : "Submit"}
          </button>
        </section>
      </main>

      <style>{`
        /* Reset & base */
        * {
          box-sizing: border-box;
        }
        html, body, #root {
          height: 100%;
          margin: 0;
          background: var(--bg);
          color: var(--text);
          font-family: 'Fira Code', monospace, monospace;
          overflow: hidden; /* prevent body scroll */
        }
        /* Theme variables */
        .container.dark {
          --bg: #1e1e1e;
          --panel-bg: #252526;
          --border: #333;
          --text: #d4d4d4;
          --highlight: #61dafb;
          --green: #0e8f55;
          --red: #f44747;
          --code-bg: #252526;
          --code-border: #3c3c3c;
          --shadow: rgba(0,0,0,0.7);
          --button-bg: #007acc;
          --button-bg-hover: #005f9e;
          --button-disabled: #3c3c3c;
        }
        .container.light {
          --bg: #f0f0f0;
          --panel-bg: #ffffff;
          --border: #ddd;
          --text: #333;
          --highlight: #007acc;
          --green: #0a8f55;
          --red: #d93025;
          --code-bg: #f9f9f9;
          --code-border: #ccc;
          --shadow: rgba(0,0,0,0.2);
          --button-bg: #007acc;
          --button-bg-hover: #005f9e;
          --button-disabled: #bbb;
        }
        .container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: var(--bg);
          color: var(--text);
          transition: background-color 0.3s ease, color 0.3s ease;
          overflow: hidden;
        }
        .header {
          position: sticky;
          top: 0;
          z-index: 20;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background: var(--panel-bg);
          box-shadow: 0 2px 6px var(--shadow);
          font-weight: 700;
          font-size: 1.5rem;
          color: var(--highlight);
          user-select: none;
          min-height: 60px;
        }
        .theme-toggle {
          background: none;
          border: none;
          color: var(--highlight);
          cursor: pointer;
          font-size: 1rem;
          padding: 0.3rem 0.6rem;
          border-radius: 6px;
          transition: background-color 0.3s ease;
        }
        .theme-toggle:hover {
          background-color: var(--button-bg-hover);
          color: white;
        }
        .main-content {
          display: flex;
          flex: 1;
          overflow: hidden;
          min-height: 0;
        }
        .description-panel {
          flex: 1;
          background: var(--panel-bg);
          border-right: 1px solid var(--border);
          padding: 2rem 2.5rem;
          overflow-y: auto;
          min-height: 0;
          display: flex;
          flex-direction: column;
        }
        .title {
          font-size: 2.2rem;
          margin-bottom: 0.5rem;
          color: var(--highlight);
          font-weight: 900;
          user-select: text;
        }
        .subtitle {
          font-weight: 700;
          font-size: 1.4rem;
          margin-bottom: 1rem;
          color: var(--highlight);
          user-select: none;
        }
        .tags-row {
          margin-bottom: 1.5rem;
        }
        .tag {
          display: inline-block;
          padding: 5px 14px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          user-select: none;
          cursor: default;
          background-color: var(--green);
          color: white;
        }
        .description-text {
          font-size: 1.1rem;
          line-height: 1.65;
          color: var(--text);
          white-space: pre-wrap;
          margin-bottom: 2rem;
          min-height: 150px;
          flex-grow: 1;
          user-select: text;
          overflow-y: auto;
        }
        .examples {
          border-top: 1px solid var(--border);
          padding-top: 1.5rem;
          user-select: none;
        }
        .testcase-list {
          display: flex;
          gap: 12px;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }
        .testcase-btn {
          background: #2d2d2d;
          border: none;
          padding: 8px 18px;
          border-radius: 6px;
          font-weight: 600;
          color: var(--text);
          cursor: pointer;
          user-select: none;
          transition: background-color 0.25s ease;
          font-size: 1rem;
        }
        .container.light .testcase-btn {
          background: #e0e0e0;
          color: #333;
        }
        .testcase-btn.active,
        .testcase-btn:hover {
          background: var(--button-bg);
          color: white;
          box-shadow: 0 0 12px var(--button-bg);
        }
        .testcase-data pre {
          background: var(--bg);
          padding: 14px;
          border-radius: 6px;
          overflow-x: auto;
          color: var(--highlight);
          font-size: 1rem;
          margin-top: 5px;
          white-space: pre-wrap;
          border: 1px solid var(--border);
          font-family: 'Fira Code', monospace, monospace;
          max-height: 220px;
          overflow-y: auto;
          user-select: text;
        }
        .pass-text {
          color: var(--green);
          font-weight: 700;
          font-size: 1.1rem;
        }
        .fail-text {
          color: var(--red);
          font-weight: 700;
          font-size: 1.1rem;
        }
        .error-text {
          margin-top: 6px;
          color: #ff6e6e;
          font-weight: 600;
          font-size: 0.95rem;
        }
        .editor-panel {
          flex: 1.5;
          display: flex;
          flex-direction: column;
          padding: 2rem 2.5rem;
          background: var(--bg);
          min-height: 0;
          overflow: hidden;
        }
        .code-editor {
          flex-grow: 1;
          background: var(--code-bg);
          border-radius: 8px;
          border: 1px solid var(--code-border);
          color: var(--text);
          font-size: 16px;
          line-height: 1.5;
          font-family: 'Fira Code', monospace, monospace;
          padding: 20px;
          resize: none;
          outline: none;
          white-space: pre;
          box-shadow: inset 0 0 18px var(--shadow);
          transition: border-color 0.3s ease;
          user-select: text;
          min-height: 500px;
          overflow-y: auto;
        }
        .code-editor:focus {
          border-color: var(--button-bg);
          box-shadow: 0 0 15px var(--button-bg);
          background: var(--panel-bg);
        }
        .run-button {
          margin-top: 20px;
          padding: 14px 38px;
          font-size: 1.2rem;
          background-color: var(--button-bg);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 700;
          box-shadow: 0 6px 12px rgb(0 122 204 / 0.8);
          transition: background-color 0.3s ease;
          user-select: none;
          align-self: flex-start;
          min-width: 140px;
          text-align: center;
        }
        .run-button:disabled {
          background-color: var(--button-disabled);
          cursor: not-allowed;
          box-shadow: none;
          color: #999;
        }
        .run-button:not(:disabled):hover {
          background-color: var(--button-bg-hover);
        }
        .error {
          background: #ff4c4c;
          padding: 15px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 1.1rem;
          color: white;
          text-align: center;
          box-shadow: 0 0 12px #ff4c4caa;
          margin: 40px auto;
          max-width: 600px;
          user-select: none;
        }
        .loading {
          font-size: 1.3rem;
          text-align: center;
          color: var(--highlight);
          margin: 60px 0;
          user-select: none;
        }

        /* Scrollbar styling */
        .description-panel::-webkit-scrollbar,
        .testcase-data pre::-webkit-scrollbar,
        .code-editor::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        .description-panel::-webkit-scrollbar-thumb,
        .testcase-data pre::-webkit-scrollbar-thumb,
        .code-editor::-webkit-scrollbar-thumb {
          background-color: #555;
          border-radius: 10px;
        }
        .description-panel::-webkit-scrollbar-track,
        .testcase-data pre::-webkit-scrollbar-track,
        .code-editor::-webkit-scrollbar-track {
          background-color: var(--panel-bg);
        }
        .container.light .description-panel::-webkit-scrollbar-track,
        .container.light .testcase-data pre::-webkit-scrollbar-track,
        .container.light .code-editor::-webkit-scrollbar-track {
          background-color: #f0f0f0;
        }
      `}</style>
    </div>
  );
}
