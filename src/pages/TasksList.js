import React, { useState, useEffect } from "react";
import TaskCard from "../components/TaskCard";
import { getTasks } from "../api";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    getTasks()
      .then((data) => {
        setTasks(data);
        setFilteredTasks(data);
      })
      .catch((e) => alert("Ошибка загрузки задач: " + e));
  }, []);

  const difficulties = Array.from(
    new Set(tasks.map((t) => t.difficulty).filter(Boolean))
  );

  useEffect(() => {
    let filtered = tasks;

    if (difficultyFilter) {
      filtered = filtered.filter((t) => t.difficulty === difficultyFilter);
    }

    if (searchText.trim()) {
      filtered = filtered.filter((t) =>
        t.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredTasks(filtered);
  }, [difficultyFilter, searchText, tasks]);

  return (
    <div className="container">
      <h1 className="page-title">Задачи</h1>

      <div className="filters">
        <label className="filter-label">
          Сложность:
          <select
            className="filter-select"
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            aria-label="Фильтр по сложности"
          >
            <option value="">Все</option>
            {difficulties.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>

        <label className="filter-label search-label">
          Поиск:
          <input
            className="filter-input"
            type="search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Введите название задачи"
            aria-label="Поиск задач"
          />
        </label>
      </div>

      {filteredTasks.length === 0 ? (
        <p className="no-tasks">Задачи не найдены</p>
      ) : (
        <div className="tasks-list">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap');

        .container {
          max-width: 900px;
          margin: 40px auto;
          padding: 0 15px;
          font-family: 'Roboto Mono', monospace;
          color: #333;
        }

        .page-title {
          font-weight: 700;
          font-size: 2.4rem;
          margin-bottom: 30px;
          color: #24292e;
          user-select: none;
        }

        .filters {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          margin-bottom: 30px;
        }

        .filter-label {
          display: flex;
          flex-direction: column;
          font-weight: 600;
          font-size: 0.9rem;
          color: #586069;
          user-select: none;
          min-width: 140px;
        }

        .search-label {
          flex-grow: 1;
          min-width: 200px;
        }

        .filter-select,
        .filter-input {
          margin-top: 8px;
          padding: 8px 12px;
          font-size: 1rem;
          border-radius: 6px;
          border: 1px solid #d1d5da;
          outline-offset: 2px;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
          font-family: inherit;
          color: #24292e;
          background-color: #fff;
        }

        .filter-select:focus,
        .filter-input:focus {
          border-color: #0366d6;
          box-shadow: 0 0 0 3px rgb(3 102 214 / 0.3);
        }

        .filter-input {
          width: 100%;
          box-sizing: border-box;
        }

        .no-tasks {
          font-size: 1.1rem;
          color: #6a737d;
          text-align: center;
          margin-top: 50px;
          user-select: none;
        }

        .tasks-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* Добавим стили для TaskCard, если нужно */
        /* Например, у TaskCard должны быть тени, скругления, плавный hover */
        /* Пример можно реализовать в самом TaskCard или тут, если TaskCard - простой div */

        /* Пример стилизации кнопок в TaskCard - если нужно */
        /* .task-card-button {
          background-color: #0366d6;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 8px 16px;
          cursor: pointer;
          font-weight: 600;
          transition: background-color 0.2s ease;
        }
        .task-card-button:hover {
          background-color: #0356b6;
        } */
      `}</style>
    </div>
  );
}
