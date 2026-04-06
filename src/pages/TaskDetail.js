import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { getCodingTaskById, getTestCases, testCode, submitCode, getSubmissionsHistory } from "../api";

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

  // Функция загрузки истории решений
  async function fetchSubmissionsHistory(taskId) {
    try {
      const submissions = await getSubmissionsHistory({ 
        coding_task_id: taskId,
        status: 'success',
        limit: 10 
      });
      
      if (submissions && submissions.length > 0) {
        // Преобразуем в формат лидерборда
        const leaderboardData = submissions.map((sub, idx) => ({
          user_id: sub.user_id,
          user_name: sub.username || `User ${idx + 1}`, // используем username из БД
          avatar_url: sub.avatar_url || null,
          best_runtime: sub.execution_time_ms / 1000, // конвертируем в секунды
          best_memory: sub.memory_used_mb,
          total_submissions: 1,
        }));
        
        const sorted = leaderboardData.sort((a, b) => a.best_runtime - b.best_runtime);
        setLeaderboard(sorted);
      } else {
        setLeaderboard([]);
      }
    } catch (err) {
      console.error('Error fetching submissions:', err);
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
        // Загружаем задачу
        const data = await getCodingTaskById(taskId);
        setTask(data);

        // Загружаем тестовые случаи (только публичные)
        const testCases = await getTestCases(taskId, false);
        
        // Проверяем, решена ли задача (по истории решений)
        let solved = false;
        try {
          const submissions = await getSubmissionsHistory({ 
            coding_task_id: taskId,
            status: 'success',
            limit: 1 
          });
          solved = submissions && submissions.length > 0;
        } catch (err) {
          console.error('Error checking solved status:', err);
        }

        setIsSolved(solved);

        if (solved) {
          setActiveTab("accepted");
          await fetchSubmissionsHistory(taskId);
        }

        // Устанавливаем начальный код с сигнатурой функции
        const signature = data.function_signature || "def solution():\n    ";
        setCodeWithHeader(signature + "pass");
        
        // Сохраняем тесты в task
        setTask(prev => ({ ...prev, tests: testCases }));
      } catch (e) {
        console.error('Error loading task:', e);
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
      const code = codeWithHeader.trim();
      if (!code) throw new Error("Код не должен быть пустым.");
      
      // Формируем JSON для отправки
      const requestData = {
        coding_task_id: taskId,
        language: 'python',
        code: code,
      };
      
      // Скачиваем JSON
      const blob = new Blob([JSON.stringify(requestData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `task_${taskId}_test_request.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Отправляем код на тестирование (только публичные тесты, без сохранения)
      const data = await testCode(requestData);
      
      // Преобразуем результат в формат для отображения
      const formattedResults = {
        success: data.status === 'success',
        results: data.test_results?.map(tr => ({
          passed: tr.passed,
          output: tr.actual,
          expected: tr.expected,
          error: tr.error,
        })) || [],
      };
      
      setResults(formattedResults);
      setActiveTestIndex(0);
    } catch (e) {
      console.error('Error running code:', e);
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
      const code = codeWithHeader.trim();
      if (!code) throw new Error("Код не должен быть пустым.");
      
      // Отправляем код на проверку (все тесты, включая скрытые)
      const data = await submitCode({
        coding_task_id: taskId,
        language: 'python',
        code: code,
      });
      
      // Преобразуем результат в формат для отображения
      const formattedResults = {
        success: data.status === 'success',
        results: data.test_results?.map(tr => ({
          passed: tr.passed,
          output: tr.actual,
          expected: tr.expected,
          error: tr.error,
        })) || [],
      };
      
      setResults(formattedResults);
      setActiveTestIndex(0);

      if (data.status === 'success') {
        setIsSolved(true);
        setActiveTab("accepted");
        await fetchSubmissionsHistory(taskId);
      }
    } catch (e) {
      console.error('Error submitting code:', e);
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

  const activeTests = task.tests?.filter((t) => !t.is_hidden) || [];

  return (
    <div style={styles.container}>
      <Tabs tabs={tabs} current={activeTab} onChange={setActiveTab} />

      <div style={styles.contentArea}>
        <section style={styles.leftPanel} aria-label="Task details">
          {activeTab === "description" && (
            <>
              <h1 style={styles.title}>
                {task.title}
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
                          key={`${entry.user_id}-${i}`}
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
              <div style={{ marginBottom: 12, fontWeight: "700", color: "#61dafb", fontSize: 18 }}>
                Tests
              </div>
              <div style={{ 
                backgroundColor: "#252526", 
                borderRadius: 12, 
                overflow: "hidden",
                border: "1px solid #007acc"
              }}>
                <table style={{ 
                  width: "100%", 
                  borderCollapse: "collapse",
                  fontFamily: "'Fira Code', monospace",
                  fontSize: 14
                }}>
                  <thead>
                    <tr style={{ backgroundColor: "#007acc" }}>
                      <th style={{ 
                        padding: "12px 16px", 
                        textAlign: "left", 
                        color: "#fff",
                        fontWeight: "700",
                        width: "50%"
                      }}>
                        Input
                      </th>
                      <th style={{ 
                        padding: "12px 16px", 
                        textAlign: "left", 
                        color: "#fff",
                        fontWeight: "700",
                        width: "50%"
                      }}>
                        Expected Output
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeTests.map((test, i) => (
                      <tr 
                        key={i}
                        style={{ 
                          borderBottom: i < activeTests.length - 1 ? "1px solid #333" : "none",
                          cursor: "pointer",
                          backgroundColor: activeTestIndex === i ? "rgba(0, 122, 204, 0.2)" : "transparent",
                          transition: "background-color 0.2s ease"
                        }}
                        onClick={() => setActiveTestIndex(i)}
                        onMouseEnter={(e) => {
                          if (activeTestIndex !== i) {
                            e.currentTarget.style.backgroundColor = "rgba(0, 122, 204, 0.1)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (activeTestIndex !== i) {
                            e.currentTarget.style.backgroundColor = "transparent";
                          }
                        }}
                      >
                        <td style={{ 
                          padding: "12px 16px", 
                          color: "#d4d4d4",
                          fontFamily: "'Fira Code', monospace"
                        }}>
                          <code style={{ 
                            backgroundColor: "#1e1e1e", 
                            padding: "4px 8px", 
                            borderRadius: 4,
                            display: "inline-block",
                            maxWidth: "100%",
                            overflow: "auto"
                          }}>
                            {typeof test.input_data === 'string' 
                              ? test.input_data 
                              : JSON.stringify(test.input_data)}
                          </code>
                        </td>
                        <td style={{ 
                          padding: "12px 16px", 
                          color: "#d4d4d4",
                          fontFamily: "'Fira Code', monospace"
                        }}>
                          <code style={{ 
                            backgroundColor: "#1e1e1e", 
                            padding: "4px 8px", 
                            borderRadius: 4,
                            display: "inline-block",
                            maxWidth: "100%",
                            overflow: "auto"
                          }}>
                            {typeof test.expected_output === 'string' 
                              ? test.expected_output 
                              : JSON.stringify(test.expected_output)}
                          </code>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
