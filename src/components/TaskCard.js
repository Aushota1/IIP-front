import React from "react";
import { useNavigate } from "react-router-dom";

export default function TaskCard({ task }) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "10px",
        marginBottom: "10px",
        borderRadius: "5px",
        cursor: "pointer",
      }}
      onClick={() => navigate(`/tasks/${task.id}`)}
    >
      <h3>{task.title}</h3>
      <p><b>Сложность:</b> {task.difficulty || "не указано"}</p>
      <p>{task.description.length > 100 ? task.description.slice(0, 100) + "..." : task.description}</p>
    </div>
  );
}
