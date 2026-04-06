import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaCode } from "react-icons/fa";
import { getCodingTasks, getSubmissionsHistory } from "../api";
import SimpleHeader from '../components/SimpleHeader';

// Circular progress component
function CircularProgress({ percent }) {
  const radius = 7;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="tasks-page__progress-circle">
      <svg>
        <circle
          className="tasks-page__progress-circle-bg"
          cx="10"
          cy="10"
          r={radius}
        />
        <circle
          className="tasks-page__progress-circle-fill"
          cx="10"
          cy="10"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
    </div>
  );
}

// Task card component
function TaskCard({ task, onClick }) {
  const difficultyMap = {
    easy: { label: "Легко", class: "easy" },
    medium: { label: "Средне", class: "medium" },
    hard: { label: "Сложно", class: "hard" },
  };

  const difficulty = difficultyMap[task.difficulty] || { label: task.difficulty, class: "" };
  const progress = task.isSolved ? 100 : 0;

  return (
    <div className="tasks-page__card" onClick={() => onClick(task.id)}>
      <div className="tasks-page__card-image-wrapper">
        {task.image ? (
          <img src={task.image} alt={task.title} className="tasks-page__card-image" />
        ) : (
          <div className="tasks-page__card-image-placeholder">
            <FaCode />
          </div>
        )}
        <div className="tasks-page__card-badge">
          <span>Задача #{task.number}</span>
        </div>
        {task.hasAchievement && (
          <div className="tasks-page__card-badge tasks-page__card-badge--achievement">
            <span>Баллы от «Другого Дела»</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" fill="currentColor" />
            </svg>
          </div>
        )}
      </div>

      <div className="tasks-page__card-content">
        <div className="tasks-page__card-tags">
          <span className={`tasks-page__card-tag tasks-page__card-tag--difficulty-${difficulty.class}`}>
            {difficulty.label}
          </span>
          {task.tags?.slice(0, 2).map((tag, idx) => (
            <span key={idx} className="tasks-page__card-tag">
              {tag}
            </span>
          ))}
        </div>

        <h3 className="tasks-page__card-title">{task.title}</h3>

        <p className="tasks-page__card-description">
          {task.description || "Решите эту задачу по программированию"}
        </p>

        <div className="tasks-page__card-footer">
          <CircularProgress percent={progress} />
          <span className="tasks-page__progress-text">{progress}% пройдено</span>
        </div>
      </div>
    </div>
  );
}

export default function TasksList() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const tasksData = await getCodingTasks({ limit: 100 });
        
        // Получаем список решенных задач
        let solvedIds = new Set();
        try {
          const submissions = await getSubmissionsHistory({ 
            status: 'success',
            limit: 1000 
          });
          solvedIds = new Set(submissions.map(s => s.coding_task_id));
        } catch (err) {
          console.warn('Не удалось загрузить историю решений:', err);
        }

        const formatted = tasksData.map((t, idx) => ({
          id: t.id,
          number: idx + 1,
          title: t.title,
          description: t.description,
          difficulty: t.difficulty || "easy",
          tags: t.tags || [],
          isSolved: solvedIds.has(t.id),
          hasAchievement: false, // TODO: получать с бэкенда
          image: null, // TODO: получать с бэкенда
        }));

        setTasks(formatted);
        setFilteredTasks(formatted);
      } catch (e) {
        console.error("Ошибка загрузки задач:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = tasks;

    // Фильтр по вкладкам
    if (activeTab === "in-progress") {
      filtered = filtered.filter(t => !t.isSolved && t.hasProgress);
    } else if (activeTab === "completed") {
      filtered = filtered.filter(t => t.isSolved);
    }

    // Поиск
    if (searchText.trim()) {
      filtered = filtered.filter((t) =>
        t.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredTasks(filtered);
  }, [activeTab, searchText, tasks]);

  const handleCardClick = (taskId) => {
    navigate(`/tasks/${taskId}`);
  };

  const allCount = tasks.length;
  const inProgressCount = 0; // TODO: реализовать логику "в процессе"
  const completedCount = tasks.filter(t => t.isSolved).length;

  return (
    <div className="tasks-page">
      <SimpleHeader />
      
      <div className="tasks-page__container">
        <h1 className="tasks-page__title">Тренажер</h1>

        {/* Search and filters */}
        <div className="tasks-page__filters">
          <div className="tasks-page__search-row">
            <div className="tasks-page__search-wrapper">
              <FaSearch className="tasks-page__search-icon" />
              <input
                type="search"
                className="tasks-page__search-input"
                placeholder="Поиск"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            
            <button className="tasks-page__dropdown">
              <span>Сортировка</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.6875 8.78514L13.5494 12.6187C13.8098 12.8771 14.2319 12.8771 14.4922 12.6187C14.7526 12.3602 14.7526 11.9412 14.4922 11.6828L10.1589 7.38133C9.89855 7.12289 9.47644 7.12289 9.21609 7.38133L4.88276 11.6828C4.62241 11.9412 4.62241 12.3602 4.88276 12.6187C5.14311 12.8771 5.56522 12.8771 5.82557 12.6187L9.6875 8.78514Z" />
              </svg>
            </button>

            <button className="tasks-page__dropdown">
              <span>Фильтры</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.6875 8.78514L13.5494 12.6187C13.8098 12.8771 14.2319 12.8771 14.4922 12.6187C14.7526 12.3602 14.7526 11.9412 14.4922 11.6828L10.1589 7.38133C9.89855 7.12289 9.47644 7.12289 9.21609 7.38133L4.88276 11.6828C4.62241 11.9412 4.62241 12.3602 4.88276 12.6187C5.14311 12.8771 5.56522 12.8771 5.82557 12.6187L9.6875 8.78514Z" />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="tasks-page__tabs">
            <button
              className={`tasks-page__tab ${activeTab === "all" ? "tasks-page__tab--active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              <span>Все подборки</span>
              <div className="tasks-page__tab-badge">{allCount}</div>
            </button>

            <button
              className={`tasks-page__tab ${activeTab === "in-progress" ? "tasks-page__tab--active" : ""}`}
              onClick={() => setActiveTab("in-progress")}
            >
              <span>В процессе</span>
              <div className="tasks-page__tab-badge">{inProgressCount}</div>
            </button>

            <button
              className={`tasks-page__tab ${activeTab === "completed" ? "tasks-page__tab--active" : ""}`}
              onClick={() => setActiveTab("completed")}
            >
              <span>Пройденные</span>
              <div className="tasks-page__tab-badge">{completedCount}</div>
            </button>
          </div>
        </div>

        {/* Cards grid */}
        {loading ? (
          <div className="tasks-page__loading">Загрузка задач...</div>
        ) : filteredTasks.length === 0 ? (
          <div className="tasks-page__empty">Задачи не найдены</div>
        ) : (
          <div className="tasks-page__grid">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={handleCardClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
