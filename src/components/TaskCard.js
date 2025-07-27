import React from "react";
import { useNavigate } from "react-router-dom";

export default function TaskCard({ task }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/tasks/${task.id}`)}
      style={{
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        cursor: "pointer",
        backgroundColor: "#252526",
        border: "1px solid #3c3c3c",
        boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
        transition: "background-color 0.3s ease",
        userSelect: "none",
        color: "#d4d4d4",
      }}
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#007acc")}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#252526")}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") navigate(`/tasks/${task.id}`); }}
      aria-label={`Перейти к задаче ${task.title}`}
    >
      <h3 style={{ margin: "0 0 8px 0", color: "#61dafb" }}>{task.title}</h3>
      <p style={{ margin: "0 0 6px 0", fontWeight: "600" }}>
        Сложность: <span style={{ color: "#0e8f55" }}>{task.difficulty || "не указано"}</span>
      </p>
      <p style={{ margin: 0, fontSize: 14, color: "#cfcfcf" }}>
        {task.description.length > 100
          ? task.description.slice(0, 100) + "..."
          : task.description}
      </p>
    </div>
  );
}
