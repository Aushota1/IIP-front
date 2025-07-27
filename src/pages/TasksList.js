import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaSortAmountDown,
  FaFilter,
  FaStar,
  FaRegStar,
  FaCheckCircle,
  FaRegCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  getTasks,
  getFavorites,
  addFavorite,
  removeFavorite,
  getSolvedTasks,
} from "../api";
import styles from "./TaskList.module.css";

function TaskCard({ task, onToggleFavorite }) {
  const navigate = useNavigate();

  const colors = {
    Easy: "#2ea44f",
    Medium: "#d29922",
    Med: "#d29922",
    Hard: "#cf222e",
  };

  const diff = task.difficulty || "Easy";
  const diffColor = colors[diff] || "#57606a";

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
        {diff === "Medium" ? "Med." : diff}
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
        const tasksData = await getTasks();
        const favoritesData = await getFavorites();
        const solvedTasksData = await getSolvedTasks();

        const favoriteIds = new Set(favoritesData.map((f) => f.id));
        const solvedIds = new Set(solvedTasksData.map((t) => t.id));
        setSolvedTaskIds(solvedIds);

        const formatted = tasksData.map((t, idx) => ({
          id: t.id,
          number: idx + 1,
          title: t.title,
          solvedPercent: t.solvedPercent || 0,
          difficulty: t.difficulty || "Easy",
          isFavorite: favoriteIds.has(t.id),
          progressLevel: Math.floor(Math.random() * 7),
          isSolved: solvedIds.has(t.id),
        }));

        setTasks(formatted);
        setFilteredTasks(formatted);
      } catch (e) {
        alert("Ошибка загрузки задач: " + e);
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
    try {
      if (currentlyFavorite) {
        await removeFavorite(id);
      } else {
        await addFavorite(id);
      }
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, isFavorite: !currentlyFavorite } : t
        )
      );
    } catch (error) {
      alert("Ошибка при обновлении избранного: " + error.message);
    }
  }

  return (
    <div className={styles.pageWrapper}>
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
