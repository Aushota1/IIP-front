import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaSortAmountDown,
  FaFilter,
  FaCheckCircle,
  FaRegCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  getCodingTasks,
  getSubmissionsHistory,
} from "../api";
import SimpleHeader from '../components/SimpleHeader';
import styles from "./TaskList.module.css";

function TaskCard({ task, onToggleFavorite }) {
  const navigate = useNavigate();

  const colors = {
    easy: "#2ea44f",
    medium: "#d29922",
    hard: "#cf222e",
  };

  const difficultyLabels = {
    easy: "Easy",
    medium: "Med.",
    hard: "Hard",
  };

  const diff = task.difficulty || "easy";
  const diffColor = colors[diff] || "#57606a";
  const diffLabel = difficultyLabels[diff] || diff;

  function handleClick(e) {
    if (e.target.closest("button")) return;
    navigate(`/tasks/${task.id}`);
  }

  return (
    <div
      className={styles.taskCard}
      onClick={handleClick}
      tabIndex={0}
      role="link"
      aria-label={`Открыть задачу ${task.title}`}
    >
      <div className={styles.taskStatusIcon}>
        {task.isSolved ? (
          <FaCheckCircle color="#2ea44f" />
        ) : (
          <FaRegCircle color="#57606a" />
        )}
      </div>
      <div className={styles.taskNumber}>{task.number}.</div>
      <div className={styles.taskTitle}>{task.title}</div>
      <div className={styles.taskPercent}>{task.solvedPercent?.toFixed(1)}%</div>
      <div className={styles.taskDifficulty} style={{ color: diffColor }}>
        {diffLabel}
      </div>
      <div className={styles.taskProgressBar}>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`${styles.progressSegment} ${
              i < (task.progressLevel || 0) ? styles.progressSegmentFilled : ""
            }`}
          ></div>
        ))}
      </div>
      {/* Избранное временно отключено - API не поддерживает
      <button
        className={styles.taskFavoriteBtn}
        aria-label={
          task.isFavorite ? "Убрать из избранного" : "Добавить в избранное"
        }
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(task.id, task.isFavorite);
        }}
      >
        {task.isFavorite ? (
          <FaStar color="#ffbf00" />
        ) : (
          <FaRegStar color="#8b949e" />
        )}
      </button>
      */}
    </div>
  );
}

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [searchText, setSearchText] = useState("");
  const [solvedTaskIds, setSolvedTaskIds] = useState(new Set());

  useEffect(() => {
    async function fetchData() {
      try {
        const tasksData = await getCodingTasks({ limit: 100 });
        
        // Получаем список решенных задач из истории решений
        let solvedTaskIds = new Set();
        try {
          const submissions = await getSubmissionsHistory({ 
            status: 'success',
            limit: 1000 
          });
          solvedTaskIds = new Set(submissions.map(s => s.coding_task_id));
        } catch (err) {
          console.warn('Не удалось загрузить историю решений:', err);
        }

        setSolvedTaskIds(solvedTaskIds);

        const formatted = tasksData.map((t, idx) => ({
          id: t.id,
          number: idx + 1,
          title: t.title,
          solvedPercent: 0, // TODO: получать статистику с бэкенда
          difficulty: t.difficulty || "easy",
          isFavorite: false, // TODO: реализовать избранное если нужно
          progressLevel: Math.floor(Math.random() * 7),
          isSolved: solvedTaskIds.has(t.id),
        }));

        setTasks(formatted);
        setFilteredTasks(formatted);
      } catch (e) {
        console.error("Ошибка загрузки задач:", e);
        alert("Ошибка загрузки задач: " + e.message);
      }
    }
    fetchData();
  }, []);

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

  async function toggleFavorite(id, currentlyFavorite) {
    // TODO: Реализовать функционал избранного если нужно
    // Пока просто обновляем локальное состояние
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, isFavorite: !currentlyFavorite } : t
      )
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <SimpleHeader />
      <nav className={styles.sidebar}>
        <h2>Library</h2>
        <ul>
          <li>
            <b>Library</b>
          </li>
          <li>Study Plan</li>
          <li>Favorite</li>
          <li>Session (Migrated)</li>
          <li>to do</li>
        </ul>
      </nav>

      <main className={styles.mainContent}>
        <header className={styles.bannerRow}>
          <div className={`${styles.banner} ${styles.bannerGreen}`}>
            <div>
              <h3>LeetCode's Interview Crash Course:</h3>
              <p>System Design for Interviews and Beyond</p>
              <button className={styles.btnPrimary}>Start Learning</button>
            </div>
          </div>
          <div className={`${styles.banner} ${styles.bannerPurple}`}>
            <div>
              <h3>LeetCode's Interview Crash Course:</h3>
              <p>Data Structures and Algorithms</p>
              <button className={styles.btnSecondary}>Start Learning</button>
            </div>
          </div>
          <div className={`${styles.banner} ${styles.bannerBlue}`}>
            <div>
              <h3>Top Interview Questions</h3>
              <button className={styles.btnTertiary}>Get Started</button>
            </div>
          </div>
        </header>

        <section className={styles.topicsRow} aria-label="Темы задач">
          {[
            "Array",
            "String",
            "Hash Table",
            "Dynamic Programming",
            "Math",
            "Sorting",
            "Greedy",
          ].map((topic) => (
            <button key={topic} className={styles.topicBtn}>
              {topic}{" "}
              <span className={styles.topicCount}>
                {Math.floor(Math.random() * 2000)}
              </span>
            </button>
          ))}
        </section>

        <section className={styles.filterButtons} aria-label="Фильтры по темам">
          <button className={`${styles.filterBtn} ${styles.filterBtnActive}`}>
            All Topics
          </button>
          <button className={styles.filterBtn}>Algorithms</button>
          <button className={styles.filterBtn}>Database</button>
          <button className={styles.filterBtn}>Shell</button>
          <button className={styles.filterBtn}>Concurrency</button>
          <button className={styles.filterBtn}>JavaScript</button>
          <button className={styles.filterBtn}>
            <FaFilter />
          </button>
        </section>

        <section className={styles.searchSortBar}>
          <div className={styles.searchInputWrapper}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="search"
              placeholder="Search questions"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              aria-label="Поиск задач"
            />
          </div>
          <button className={styles.btnIcon} title="Sort">
            <FaSortAmountDown />
          </button>
          <button className={styles.btnIcon} title="Filter">
            <FaFilter />
          </button>
          <div className={styles.solvedCount}>
            {filteredTasks.filter((t) => t.isSolved).length} / {tasks.length} Solved
          </div>
        </section>

        <section className={styles.tasksList} aria-label="Список задач">
          {filteredTasks.length === 0 ? (
            <p className={styles.noTasks}>Задачи не найдены</p>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleFavorite={toggleFavorite}
              />
            ))
          )}
        </section>
      </main>
    </div>
  );
}
