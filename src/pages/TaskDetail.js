import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { getTaskById, runTaskCode, getTaskLeaderboard, isTaskSolved } from "../api";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Tooltip,
} from "recharts";

// Кастомный тултип с аватаром пользователя
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        style={{
          backgroundColor: "#252526",
          color: "#d4d4d4",
          padding: 12,
          borderRadius: 12,
          boxShadow: "0 0 15px #007accbb",
          fontFamily: "'Fira Code', monospace",
          fontSize: 14,
          display: "flex",
          alignItems: "center",
          gap: 12,
          minWidth: 220,
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        <img
          src={data.user_avatar || "https://via.placeholder.com/40?text=?"}
          alt={data.user_name || "User avatar"}
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "2px solid #007acc",
            objectFit: "cover",
            flexShrink: 0,
          }}
          loading="lazy"
        />
        <div>
          <div style={{ fontWeight: "700", fontSize: 16, marginBottom: 4 }}>
            {data.user_name || "Anonymous"}
          </div>
          <div>
            <span style={{ color: "#0e8f55", fontWeight: "700" }}>Runtime:</span>{" "}
            {data.runtime?.toFixed(4)} sec
          </div>
          <div
            style={{
              marginTop: 4,
              color: data.isBest ? "#00bfff" : data.passed ? "#0e8f55" : "#f44747",
              fontWeight: "700",
            }}
          >
            {data.passed ? "✔️ Passed" : "❌ Failed"}
          </div>
        </div>
      </div>
    );
  }
  return null;
};

function RuntimeMemoryChart({ leaderboard }) {
  if (!leaderboard || leaderboard.length === 0) return null;

  // Найдем минимальное время среди всех
  const bestRuntime = leaderboard
    .filter((e) => e.best_runtime != null)
    .reduce((min, e) => (e.best_runtime < min ? e.best_runtime : min), Infinity);

  // Формируем данные для графика: runtime для каждого пользователя
  const data = leaderboard.map((entry, i) => ({
    name: entry.user_name || `#${i + 1}`,
    runtime: entry.best_runtime || 0,
    passed: entry.best_runtime != null, // считаем, что наличие времени - значит прошел
    user_name: entry.user_name || "Anonymous",
    user_avatar: entry.avatar_url || null,
    isBest: entry.best_runtime === bestRuntime,
  }));

  return (
    <div
      style={{
        width: "100%",
        height: 320,
        backgroundColor: "#1e1e1e",
        borderRadius: 16,
        boxShadow: "0 0 40px #007acccc",
        padding: 24,
        marginBottom: 24,
        userSelect: "none",
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap={24} barGap={12}>
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#007acc22", radius: 12 }} />

          {/* Свечки runtime */}
          <Bar
            dataKey="runtime"
            radius={[12, 12, 12, 12]}
            barSize={24}
            maxBarSize={36}
            isAnimationActive={true}
            animationDuration={900}
            fill="#0e8f55"
            // Цвет и ширина для лучшего runtime (подсветка)
            shape={({ x, y, width, height, payload }) => {
              const isBest = payload.isBest;
              const barWidth = isBest ? 36 : 24;
              const fillColor = isBest ? "#00bfff" : "#0e8f55";
              return (
                <rect
                  x={x + (width - barWidth) / 2}
                  y={y}
                  width={barWidth}
                  height={height}
                  rx={12}
                  ry={12}
                  fill={fillColor}
                />
              );
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Вкладки навигации
function Tabs({ tabs, current, onChange }) {
  return (
    <nav
      role="tablist"
      aria-label="Task navigation"
      style={{
        display: "flex",
        gap: 16,
        borderBottom: "2px solid #007acc",
        marginBottom: 20,
        userSelect: "none",
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={current === tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            cursor: "pointer",
            padding: "12px 20px",
            fontWeight: current === tab.id ? 700 : 500,
            fontSize: 16,
            background: current === tab.id ? "#007acc" : "transparent",
            color: current === tab.id ? "#fff" : "#61dafb",
            border: "none",
            borderRadius: "8px 8px 0 0",
            boxShadow: current === tab.id ? "0 0 12px #007accbb" : "none",
            transition: "background 0.3s ease",
          }}
        >
          {tab.title}
        </button>
      ))}
    </nav>
  );
}

export default function TaskDetail() {
  const { taskId } = useParams();

  const [task, setTask] = useState(null);
  const [codeWithHeader, setCodeWithHeader] = useState("");
  const [results, setResults] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTestIndex, setActiveTestIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSolved, setIsSolved] = useState(false);

  const textareaRef = useRef(null);

  // Функция загрузки лидерборда с учётом токена
  async function fetchLeaderboard(taskId) {
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("authToken");
      const lb = await getTaskLeaderboard(taskId, token);
      if (lb && lb.leaderboard) {
        const sorted = lb.leaderboard
          .filter((e) => e.best_runtime != null)
          .sort((a, b) => a.best_runtime - b.best_runtime);
        setLeaderboard(sorted);
      } else {
        setLeaderboard([]);
      }
    } catch {
      setLeaderboard([]);
    }
  }

  useEffect(() => {
    async function loadTaskAndSolved() {
      setError(null);
      setResults(null);
      setLeaderboard(null);
      setCodeWithHeader("");
      setActiveTestIndex(0);
      setActiveTab("description");
      setIsSubmitting(false);
      setIsSolved(false);

      try {
        const data = await getTaskById(taskId);
        setTask(data);

        let solved = false;
        try {
          const token = localStorage.getItem("token") || localStorage.getItem("authToken");
          if (token) {
            const solvedData = await isTaskSolved(taskId, token);
            solved = solvedData.solved;
          }
        } catch {}

        setIsSolved(solved);

        if (solved) {
          setActiveTab("accepted");
          await fetchLeaderboard(taskId);
        }

        let args = "";
        if (data.tests?.length) {
          const firstTest = data.tests.find((t) => t.is_active);
          if (firstTest) {
            try {
              args = Object.keys(JSON.parse(firstTest.input_data)).join(", ");
            } catch {}
          }
        }
        setCodeWithHeader(`def ${data.function_name}(${args}):\n    `);
      } catch (e) {
        setError("Задача не найдена: " + e.message);
      }
    }

    loadTaskAndSolved();
  }, [taskId]);

  function normalizeBodyLines(lines) {
    return lines.map((line) => {
      if (line.trim() === "") return "    ";
      if (!line.startsWith("    ")) return "    " + line.trimStart();
      return line;
    });
  }

  function handleCodeChange(e) {
    const val = e.target.value;
    const lines = val.split("\n");
    const header = lines[0] || "";
    const bodyLines = lines.slice(1);
    const normalized = normalizeBodyLines(bodyLines);
    setCodeWithHeader([header, ...normalized].join("\n"));
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
    const before = codeWithHeader.substring(0, start);
    const after = codeWithHeader.substring(end);
    const newCode = before + normalizedPasteLines.join("\n") + after;
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
      const newVal = codeWithHeader.substring(0, start) + "    " + codeWithHeader.substring(end);
      setCodeWithHeader(newVal);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const textarea = e.target;
      const val = textarea.value;
      const selStart = textarea.selectionStart;
      const selEnd = textarea.selectionEnd;
      const lines = val.substring(0, selStart).split("\n");
      if (lines.length === 1) {
        const newVal = val.slice(0, selStart) + "\n" + val.slice(selEnd);
        setCodeWithHeader(newVal);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = selStart + 1;
        }, 0);
        return;
      }
      const currentLine = lines[lines.length - 1];
      const indentMatch = currentLine.match(/^(\s*)/);
      const indent = indentMatch ? indentMatch[1] : "";
      const insertText = "\n" + indent;
      const newVal = val.slice(0, selStart) + insertText + val.slice(selEnd);
      setCodeWithHeader(newVal);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = selStart + insertText.length;
      }, 0);
    }
  }

  async function runUserCode() {
    setIsSubmitting(false);
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const body = codeWithHeader
        .split("\n")
        .slice(1)
        .map((line) => (line.startsWith("    ") ? line.slice(4) : line))
        .join("\n");
      if (!body.trim()) throw new Error("Тело функции не должно быть пустым.");
      const data = await runTaskCode(taskId, body);
      setResults(data);
      setActiveTestIndex(0);
    } catch (e) {
      setError("Ошибка выполнения: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  async function submitUserCode() {
    setIsSubmitting(true);
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const body = codeWithHeader
        .split("\n")
        .slice(1)
        .map((line) => (line.startsWith("    ") ? line.slice(4) : line))
        .join("\n");
      if (!body.trim()) throw new Error("Тело функции не должно быть пустым.");
      const data = await runTaskCode(taskId, body);
      setResults(data);
      setActiveTestIndex(0);

      if (data.success) {
        setIsSolved(true);
        setActiveTab("accepted");
        await fetchLeaderboard(taskId);
      }
    } catch (e) {
      setError("Ошибка выполнения: " + e.message);
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={{ color: "#f44747", fontWeight: "700", fontSize: 18, marginTop: 24 }}>{error}</div>
      </div>
    );
  }
  if (!task) {
    return (
      <div style={styles.container}>
        <div style={{ color: "#61dafb", fontWeight: "700", fontSize: 18, marginTop: 24 }}>Загрузка задачи...</div>
      </div>
    );
  }

  const tabs = [
    { id: "description", title: "Description" },
    { id: "accepted", title: "Accepted" },
    { id: "editorial", title: "Editorial" },
    { id: "solutions", title: "Solutions" },
    { id: "submissions", title: "Submissions" },
  ];

  const activeTests = task.tests?.filter((t) => t.is_active) || [];

  return (
    <div style={styles.container}>
      <Tabs tabs={tabs} current={activeTab} onChange={setActiveTab} />

      <div style={styles.contentArea}>
        <section style={styles.leftPanel} aria-label="Task details">
          {activeTab === "description" && (
            <>
              <h1 style={styles.title}>
                {task.id}. {task.title}
                <span style={{ ...styles.status, color: isSolved ? "#0e8f55" : "#f44747" }}>
                  {isSolved ? "Solved ✔️" : "Unsolved"}
                </span>
              </h1>
              <div style={styles.tags}>
                <span style={{ ...styles.tag, backgroundColor: "#0e8f55" }}>Easy</span>
                {task.topics?.map((topic) => (
                  <span key={topic} style={{ ...styles.tag, backgroundColor: "#007acc" }}>
                    {topic}
                  </span>
                ))}
                {task.companies?.map((c) => (
                  <span key={c} style={{ ...styles.tag, backgroundColor: "#c586c0" }}>
                    {c}
                  </span>
                ))}
                {task.hint && (
                  <span style={{ ...styles.tag, backgroundColor: "#9cdcfe", color: "#333" }}>Hint</span>
                )}
              </div>
              <article style={styles.description} tabIndex={0} dangerouslySetInnerHTML={{ __html: task.description }} />
            </>
          )}

          {activeTab === "accepted" && (
            <>
              <h2 style={styles.subTitle}>Accepted Submissions</h2>
              {leaderboard === null && <p style={{ color: "#999" }}>Loading leaderboard...</p>}
              {leaderboard && leaderboard.length === 0 && <p style={{ color: "#999" }}>No leaderboard data available.</p>}
              {leaderboard && leaderboard.length > 0 && (
                <>
                  <RuntimeMemoryChart leaderboard={leaderboard} />

                  <table style={styles.table} aria-label="Leaderboard table">
                    <thead>
                      <tr>
                        <th style={styles.th}>Rank</th>
                        <th style={styles.th}>User</th>
                        <th style={styles.th}>Best Runtime (sec)</th>
                        <th style={styles.th}>Best Memory (MB)</th>
                        <th style={styles.th}>Submissions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.map((entry, i) => (
                        <tr
                          key={entry.user_id}
                          style={{ cursor: "pointer" }}
                          tabIndex={0}
                          aria-label={`Rank ${i + 1}, User ${entry.user_name}, Runtime ${
                            entry.best_runtime?.toFixed(3) || "N/A"
                          } sec, Memory ${entry.best_memory?.toFixed(2) || "N/A"} MB`}
                        >
                          <td style={styles.td}>{i + 1}</td>
                          <td style={styles.td}>{entry.user_name}</td>
                          <td style={styles.td}>
                            {entry.best_runtime != null ? entry.best_runtime.toFixed(6) : "N/A"}
                          </td>
                          <td style={styles.td}>{entry.best_memory != null ? entry.best_memory.toFixed(2) : "N/A"}</td>
                          <td style={styles.td}>{entry.total_submissions}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </>
          )}

          {activeTab === "editorial" && <p style={{ color: "#999" }}>Editorial content not implemented yet.</p>}
          {activeTab === "solutions" && <p style={{ color: "#999" }}>Solutions content not implemented yet.</p>}
          {activeTab === "submissions" && <p style={{ color: "#999" }}>Submissions content not implemented yet.</p>}
        </section>

        <section style={styles.rightPanel} aria-label="Code editor and test cases">
          <div style={styles.editorHeader}>
            <div style={styles.languageLabel}>Python</div>
            <div>
              <button
                onClick={() => alert("Undo not implemented")}
                style={styles.actionButton}
                title="Undo"
                type="button"
              >
                ↶
              </button>
              <button
                onClick={() => alert("Redo not implemented")}
                style={styles.actionButton}
                title="Redo"
                type="button"
              >
                ↷
              </button>
              <button
                onClick={runUserCode}
                disabled={loading || !codeWithHeader.trim()}
                style={{
                  ...styles.actionButton,
                  ...(loading || !codeWithHeader.trim() ? styles.disabledBtn : {}),
                }}
                title="Run Code"
                type="button"
              >
                ▶️
              </button>
              <button
                onClick={submitUserCode}
                disabled={loading || !codeWithHeader.trim()}
                style={{
                  ...styles.actionButton,
                  ...styles.submitBtn,
                  ...(loading || !codeWithHeader.trim() ? styles.disabledBtn : {}),
                }}
                title="Submit Code"
                type="button"
              >
                Submit
              </button>
            </div>
          </div>

          <textarea
            ref={textareaRef}
            value={codeWithHeader}
            onChange={handleCodeChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            spellCheck={false}
            aria-label="Code editor"
            rows={20}
            style={styles.textarea}
          />

          <div
            aria-live="polite"
            role="status"
            style={{
              color: loading ? "#61dafb" : error ? "#f44747" : "transparent",
              height: 30,
              marginTop: 8,
              fontWeight: "700",
              userSelect: "none",
              textAlign: "center",
            }}
          >
            {loading ? (isSubmitting ? "Submitting..." : "Running...") : error ? error : ""}
          </div>

          {results && results.results && results.results[activeTestIndex] && (
            <div style={styles.testCaseResult} tabIndex={0}>
              <div style={{ fontWeight: "700", fontSize: 16 }}>
                Test Case {activeTestIndex + 1} Result:{" "}
                <span style={{ color: results.results[activeTestIndex].passed ? "#0e8f55" : "#f44747" }}>
                  {results.results[activeTestIndex].passed ? "Passed" : "Failed"}
                </span>
              </div>
              <pre
                style={
                  results.results[activeTestIndex].passed
                    ? styles.outputPre
                    : styles.errorPre
                }
              >
                {typeof results.results[activeTestIndex].output === "string"
                  ? results.results[activeTestIndex].output
                  : JSON.stringify(results.results[activeTestIndex].output, null, 2)}
              </pre>
              {results.results[activeTestIndex].error && (
                <div role="alert" style={{ color: "#f44747", fontWeight: "700" }}>
                  Error: {results.results[activeTestIndex].error}
                </div>
              )}
              <div style={{ marginTop: 10 }}>
                <button
                  onClick={() => setActiveTestIndex((idx) => Math.max(0, idx - 1))}
                  disabled={activeTestIndex === 0}
                  style={{
                    marginRight: 10,
                    padding: "6px 14px",
                    cursor: activeTestIndex === 0 ? "not-allowed" : "pointer",
                  }}
                >
                  Prev Test
                </button>
                <button
                  onClick={() =>
                    setActiveTestIndex((idx) =>
                      Math.min(results.results.length - 1, idx + 1)
                    )
                  }
                  disabled={activeTestIndex === results.results.length - 1}
                  style={{
                    padding: "6px 14px",
                    cursor:
                      activeTestIndex === results.results.length - 1
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  Next Test
                </button>
              </div>
            </div>
          )}

          {activeTests.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <div style={{ marginBottom: 8, fontWeight: "700", color: "#61dafb" }}>
                Active Tests
              </div>
              <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
                {activeTests.map((test, i) => (
                  <button
                    key={test.id}
                    onClick={() => setActiveTestIndex(i)}
                    style={{
                      padding: "8px 12px",
                      backgroundColor: activeTestIndex === i ? "#007acc" : "#1e1e1e",
                      color: activeTestIndex === i ? "#fff" : "#9cdcfe",
                      border: "none",
                      borderRadius: 8,
                      cursor: "pointer",
                      userSelect: "none",
                      boxShadow: activeTestIndex === i ? "0 0 12px #007accbb" : "none",
                      whiteSpace: "nowrap",
                    }}
                    aria-selected={activeTestIndex === i}
                    role="tab"
                  >
                    Case {i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#1e1e1e",
    color: "#d4d4d4",
    height: "100vh",
    width: "100vw",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    display: "flex",
    flexDirection: "column",
    padding: 20,
    userSelect: "text",
  },
  contentArea: {
    display: "flex",
    flexGrow: 1,
    overflow: "hidden",
    borderRadius: 10,
    boxShadow: "0 0 32px #007accbb",
  },
  leftPanel: {
    flexBasis: "45%",
    padding: 24,
    borderRight: "3px solid #007acc",
    overflowY: "auto",
    backgroundColor: "#252526",
    borderRadius: "10px 0 0 10px",
    userSelect: "text",
  },
  rightPanel: {
    flexBasis: "55%",
    backgroundColor: "#1e1e1e",
    padding: 24,
    display: "flex",
    flexDirection: "column",
  },
  title: {
    fontWeight: 900,
    fontSize: 28,
    marginBottom: 10,
    userSelect: "text",
  },
  status: {
    marginLeft: 16,
    fontWeight: 700,
    fontSize: 18,
    userSelect: "none",
  },
  tags: {
    display: "flex",
    gap: 10,
    marginBottom: 16,
    flexWrap: "wrap",
  },
  tag: {
    padding: "6px 14px",
    borderRadius: 9999,
    fontWeight: 700,
    fontSize: 12,
    userSelect: "none",
    color: "white",
  },
  description: {
    lineHeight: 1.6,
    fontSize: 16,
    userSelect: "text",
    overflowY: "auto",
    maxHeight: "65vh",
    paddingRight: 10,
  },
  subTitle: {
    fontWeight: 700,
    fontSize: 20,
    marginBottom: 12,
    color: "#61dafb",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: 12,
  },
  th: {
    backgroundColor: "#007acc",
    color: "white",
    padding: "10px 14px",
    fontWeight: 700,
    textAlign: "left",
  },
  td: {
    padding: "10px 14px",
    borderBottom: "1px solid #333",
  },
  editorHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 10,
    alignItems: "center",
  },
  languageLabel: {
    color: "#9cdcfe",
    fontWeight: 700,
    fontFamily: "'Fira Code', monospace",
  },
  actionButton: {
    background: "transparent",
    border: "none",
    color: "#9cdcfe",
    fontSize: 20,
    marginLeft: 12,
    cursor: "pointer",
    borderRadius: 10,
    padding: "4px 10px",
    transition: "all 0.25s ease",
  },
  disabledBtn: {
    color: "#555",
    cursor: "not-allowed",
  },
  submitBtn: {
    fontWeight: 700,
    boxShadow: "0 0 12px #0e8f5588",
  },
  textarea: {
    backgroundColor: "#252526",
    color: "#d4d4d4",
    fontFamily: "'Fira Code', monospace",
    fontSize: 15,
    padding: 20,
    borderRadius: 14,
    border: "none",
    resize: "none",
    flexGrow: 1,
    outline: "none",
    lineHeight: 1.4,
    boxShadow: "inset 0 0 20px #007accaa",
    userSelect: "text",
  },
  testCaseResult: {
    backgroundColor: "#1e1e1e",
    marginTop: 20,
    padding: 18,
    borderRadius: 12,
    boxShadow: "0 0 16px #007accbb",
    fontFamily: "'Fira Code', monospace",
  },
  outputPre: {
    backgroundColor: "#252526",
    color: "#0e8f55",
    padding: 16,
    borderRadius: 8,
    marginTop: 12,
    overflowX: "auto",
    whiteSpace: "pre-wrap",
    fontSize: 14,
  },
  errorPre: {
    backgroundColor: "#2a1e1e",
    color: "#f44747",
    padding: 16,
    borderRadius: 8,
    marginTop: 12,
    overflowX: "auto",
    whiteSpace: "pre-wrap",
    fontSize: 14,
  },
};
