import { useEffect, useMemo, useState } from "react";

import {
  FaBookOpen,
  FaClock,
  FaEdit,
  FaEye,
  FaPlayCircle,
  FaPlus,
  FaSearch,
  FaTimes,
  FaTrash,
} from "react-icons/fa";

import "./ManageChapters.css";

const CHAPTER_API =
  "http://localhost:5000/api/admin/chapters";

const COURSE_API =
  "http://localhost:5000/api/admin/courses";

const emptyForm = {
  course: "",
  title: "",
  description: "",
  videoUrl: "",
  content: "",
  duration: "",
  order: 1,
  freePreview: false,
  active: true,
};

function ManageChapters() {
  const [chapters, setChapters] =
    useState([]);

  const [courses, setCourses] =
    useState([]);

  const [form, setForm] =
    useState(emptyForm);

  const [selectedChapter, setSelectedChapter] =
    useState(null);

  const [modal, setModal] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [courseFilter, setCourseFilter] =
    useState("All");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  useEffect(() => {
    fetchPageData();
  }, []);

  const extractArray = (
    data,
    keys
  ) => {
    if (Array.isArray(data)) {
      return data;
    }

    for (const key of keys) {
      if (Array.isArray(data?.[key])) {
        return data[key];
      }
    }

    return [];
  };

  const fetchPageData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        chapterResponse,
        courseResponse,
      ] = await Promise.all([
        fetch(CHAPTER_API),
        fetch(COURSE_API),
      ]);

      const [
        chapterData,
        courseData,
      ] = await Promise.all([
        chapterResponse.json(),
        courseResponse.json(),
      ]);

      if (!chapterResponse.ok) {
        throw new Error(
          chapterData.message ||
            "Unable to load chapters."
        );
      }

      if (!courseResponse.ok) {
        throw new Error(
          courseData.message ||
            "Unable to load courses."
        );
      }

      setChapters(
        extractArray(chapterData, [
          "chapters",
          "lessons",
        ])
      );

      setCourses(
        extractArray(courseData, [
          "courses",
        ])
      );
    } catch (requestError) {
      console.error(requestError);
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const getCourseId = (course) =>
    course?._id || course?.id;

  const getChapterId = (chapter) =>
    chapter?._id || chapter?.id;

  const getChapterCourseId = (
    chapter
  ) => {
    if (
      chapter?.course &&
      typeof chapter.course === "object"
    ) {
      return (
        chapter.course._id ||
        chapter.course.id
      );
    }

    return (
      chapter?.course ||
      chapter?.courseId
    );
  };

  const getCourseName = (
    chapter
  ) => {
    if (
      chapter?.course &&
      typeof chapter.course === "object"
    ) {
      return (
        chapter.course.title ||
        "DVOC Course"
      );
    }

    const courseId =
      getChapterCourseId(chapter);

    const matchedCourse =
      courses.find(
        (course) =>
          String(getCourseId(course)) ===
          String(courseId)
      );

    return (
      matchedCourse?.title ||
      "DVOC Course"
    );
  };

  const filteredChapters =
    useMemo(() => {
      const value =
        search.trim().toLowerCase();

      return chapters
        .filter((chapter) => {
          const matchesSearch =
            !value ||
            `
              ${chapter.title || ""}
              ${chapter.description || ""}
              ${getCourseName(chapter)}
            `
              .toLowerCase()
              .includes(value);

          const matchesCourse =
            courseFilter === "All" ||
            String(
              getChapterCourseId(chapter)
            ) ===
              String(courseFilter);

          return (
            matchesSearch &&
            matchesCourse
          );
        })
        .sort(
          (first, second) =>
            Number(first.order || 0) -
            Number(second.order || 0)
        );
    }, [
      chapters,
      courses,
      search,
      courseFilter,
    ]);

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((previousForm) => ({
      ...previousForm,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const openAddModal = () => {
    setForm(emptyForm);
    setSelectedChapter(null);
    setModal("add");
    setError("");
    setMessage("");
  };

  const openViewModal = (chapter) => {
    setSelectedChapter(chapter);
    setModal("view");
  };

  const openEditModal = (chapter) => {
    setSelectedChapter(chapter);

    setForm({
      course:
        getChapterCourseId(chapter) ||
        "",

      title: chapter.title || "",

      description:
        chapter.description || "",

      videoUrl:
        chapter.videoUrl || "",

      content:
        chapter.content || "",

      duration:
        chapter.duration || "",

      order:
        chapter.order || 1,

      freePreview:
        chapter.freePreview || false,

      active:
        chapter.active !== false,
    });

    setModal("edit");
    setError("");
    setMessage("");
  };

  const closeModal = () => {
    setModal(null);
    setSelectedChapter(null);
    setForm(emptyForm);
    setError("");
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (!form.course) {
      setError(
        "Please select a course."
      );
      return;
    }

    if (!form.title.trim()) {
      setError(
        "Please enter a chapter title."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const isEditing =
        modal === "edit";

      const chapterId =
        getChapterId(
          selectedChapter
        );

      const requestUrl = isEditing
        ? `${CHAPTER_API}/${chapterId}`
        : CHAPTER_API;

      const payload = {
        course: form.course,

        title: form.title.trim(),

        description:
          form.description.trim(),

        videoUrl:
          form.videoUrl.trim(),

        content:
          form.content.trim(),

        duration:
          form.duration.trim(),

        order: Number(
          form.order || 1
        ),

        freePreview:
          form.freePreview,

        active: form.active,
      };

      const response = await fetch(
        requestUrl,
        {
          method: isEditing
            ? "PUT"
            : "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(payload),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            "Unable to save chapter."
        );
      }

      setMessage(
        isEditing
          ? "Chapter updated successfully."
          : "Chapter added successfully."
      );

      await fetchPageData();

      setTimeout(() => {
        closeModal();
        setMessage("");
      }, 700);
    } catch (requestError) {
      console.error(requestError);
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (
    chapter
  ) => {
    const chapterId =
      getChapterId(chapter);

    const confirmed = window.confirm(
      `Delete "${chapter.title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      const response = await fetch(
        `${CHAPTER_API}/${chapterId}`,
        {
          method: "DELETE",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to delete chapter."
        );
      }

      setChapters(
        (previousChapters) =>
          previousChapters.filter(
            (item) =>
              String(
                getChapterId(item)
              ) !==
              String(chapterId)
          )
      );

      setMessage(
        "Chapter deleted successfully."
      );
    } catch (requestError) {
      console.error(requestError);
      setError(requestError.message);
    }
  };

  return (
    <section className="manage-chapters-page">
      <div className="chapter-page-header">
        <div>
          <span className="chapter-eyebrow">
            COURSE LEARNING CONTENT
          </span>

          <h1>Manage Chapters</h1>

          <p>
            Add, view, edit and delete
            video lessons and course
            chapters.
          </p>
        </div>

        <button
          type="button"
          className="chapter-add-button"
          onClick={openAddModal}
        >
          <FaPlus />
          Add Chapter
        </button>
      </div>

      {message && (
        <div className="chapter-success-message">
          {message}
        </div>
      )}

      {error && !modal && (
        <div className="chapter-error-message">
          {error}
        </div>
      )}

      <div className="chapter-toolbar">
        <div className="chapter-search-box">
          <FaSearch />

          <input
            type="text"
            placeholder="Search chapter or course..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />
        </div>

        <select
          value={courseFilter}
          onChange={(event) =>
            setCourseFilter(
              event.target.value
            )
          }
        >
          <option value="All">
            All Courses
          </option>

          {courses.map((course) => (
            <option
              key={getCourseId(course)}
              value={getCourseId(course)}
            >
              {course.title}
            </option>
          ))}
        </select>

        <span>
          {filteredChapters.length}{" "}
          chapter
          {filteredChapters.length !== 1
            ? "s"
            : ""}
        </span>
      </div>

      {loading ? (
        <div className="chapter-loading">
          Loading chapters...
        </div>
      ) : (
        <div className="chapter-list">
          {filteredChapters.map(
            (chapter, index) => (
              <article
                className="chapter-card"
                key={getChapterId(
                  chapter
                )}
              >
                <div className="chapter-number">
                  {String(
                    chapter.order ||
                      index + 1
                  ).padStart(2, "0")}
                </div>

                <div className="chapter-main-info">
                  <span className="chapter-course-name">
                    {getCourseName(
                      chapter
                    )}
                  </span>

                  <h3>{chapter.title}</h3>

                  <p>
                    {chapter.description ||
                      "No description has been added."}
                  </p>

                  <div className="chapter-meta">
                    <span>
                      <FaClock />
                      {chapter.duration ||
                        "Duration not set"}
                    </span>

                    <span>
                      <FaPlayCircle />
                      {chapter.videoUrl
                        ? "Video available"
                        : "No video"}
                    </span>

                    {chapter.freePreview && (
                      <span className="chapter-preview-badge">
                        Free Preview
                      </span>
                    )}
                  </div>
                </div>

                <div className="chapter-actions">
                  <button
                    type="button"
                    className="chapter-view-action"
                    onClick={() =>
                      openViewModal(
                        chapter
                      )
                    }
                    title="View chapter"
                  >
                    <FaEye />
                  </button>

                  <button
                    type="button"
                    className="chapter-edit-action"
                    onClick={() =>
                      openEditModal(
                        chapter
                      )
                    }
                    title="Edit chapter"
                  >
                    <FaEdit />
                  </button>

                  <button
                    type="button"
                    className="chapter-delete-action"
                    onClick={() =>
                      handleDelete(
                        chapter
                      )
                    }
                    title="Delete chapter"
                  >
                    <FaTrash />
                  </button>
                </div>
              </article>
            )
          )}

          {filteredChapters.length ===
            0 && (
            <div className="chapter-empty-state">
              <FaBookOpen />

              <h3>No chapters found</h3>

              <p>
                Add course lessons and
                learning content.
              </p>
            </div>
          )}
        </div>
      )}

      {(modal === "add" ||
        modal === "edit") && (
        <div className="chapter-modal-overlay">
          <div className="chapter-modal">
            <div className="chapter-modal-header">
              <div>
                <span>
                  DVOC COURSE CONTENT
                </span>

                <h2>
                  {modal === "edit"
                    ? "Update Chapter"
                    : "Add Chapter"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModal}
              >
                <FaTimes />
              </button>
            </div>

            <form
              className="chapter-form"
              onSubmit={handleSubmit}
            >
              <div className="chapter-form-grid">
                <div className="chapter-form-group full">
                  <label>
                    Select Course *
                  </label>

                  <select
                    name="course"
                    value={form.course}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select course
                    </option>

                    {courses.map(
                      (course) => (
                        <option
                          key={getCourseId(
                            course
                          )}
                          value={getCourseId(
                            course
                          )}
                        >
                          {course.title}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className="chapter-form-group full">
                  <label>
                    Chapter Title *
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Introduction to Java"
                    required
                  />
                </div>

                <div className="chapter-form-group">
                  <label>
                    Chapter Order
                  </label>

                  <input
                    type="number"
                    min="1"
                    name="order"
                    value={form.order}
                    onChange={handleChange}
                  />
                </div>

                <div className="chapter-form-group">
                  <label>Duration</label>

                  <input
                    type="text"
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    placeholder="18 minutes"
                  />
                </div>

                <div className="chapter-form-group full">
                  <label>Video URL</label>

                  <input
                    type="text"
                    name="videoUrl"
                    value={form.videoUrl}
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                </div>

                <div className="chapter-form-group full">
                  <label>
                    Short Description
                  </label>

                  <textarea
                    name="description"
                    value={
                      form.description
                    }
                    onChange={handleChange}
                    placeholder="Explain this lesson..."
                  />
                </div>

                <div className="chapter-form-group full">
                  <label>
                    Written Lesson Content
                  </label>

                  <textarea
                    className="chapter-content-input"
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    placeholder="Enter lesson notes or content..."
                  />
                </div>
              </div>

              <div className="chapter-checkbox-row">
                <label>
                  <input
                    type="checkbox"
                    name="freePreview"
                    checked={
                      form.freePreview
                    }
                    onChange={handleChange}
                  />

                  Free preview
                </label>

                <label>
                  <input
                    type="checkbox"
                    name="active"
                    checked={form.active}
                    onChange={handleChange}
                  />

                  Active lesson
                </label>
              </div>

              {error && (
                <div className="chapter-error-message">
                  {error}
                </div>
              )}

              {message && (
                <div className="chapter-success-message">
                  {message}
                </div>
              )}

              <div className="chapter-modal-actions">
                <button
                  type="button"
                  className="chapter-cancel-button"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="chapter-save-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : modal === "edit"
                    ? "Update Chapter"
                    : "Add Chapter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modal === "view" &&
        selectedChapter && (
          <div className="chapter-modal-overlay">
            <div className="chapter-view-modal">
              <button
                type="button"
                className="chapter-view-close"
                onClick={closeModal}
              >
                <FaTimes />
              </button>

              <div className="chapter-view-icon">
                <FaPlayCircle />
              </div>

              <span className="chapter-view-course">
                {getCourseName(
                  selectedChapter
                )}
              </span>

              <h2>
                {selectedChapter.title}
              </h2>

              <p>
                {selectedChapter.description ||
                  "No description has been added."}
              </p>

              <div className="chapter-view-details">
                <div>
                  <span>Order</span>

                  <strong>
                    {selectedChapter.order ||
                      1}
                  </strong>
                </div>

                <div>
                  <span>Duration</span>

                  <strong>
                    {selectedChapter.duration ||
                      "Not set"}
                  </strong>
                </div>

                <div>
                  <span>Preview</span>

                  <strong>
                    {selectedChapter.freePreview
                      ? "Yes"
                      : "No"}
                  </strong>
                </div>
              </div>

              {selectedChapter.videoUrl && (
                <a
                  href={
                    selectedChapter.videoUrl
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="chapter-video-link"
                >
                  <FaPlayCircle />
                  Open Video
                </a>
              )}

              {selectedChapter.content && (
                <div className="chapter-view-content">
                  <h3>
                    Lesson Content
                  </h3>

                  <p>
                    {
                      selectedChapter.content
                    }
                  </p>
                </div>
              )}

              <button
                type="button"
                className="chapter-save-button"
                onClick={() =>
                  openEditModal(
                    selectedChapter
                  )
                }
              >
                <FaEdit />
                Edit Chapter
              </button>
            </div>
          </div>
        )}
    </section>
  );
}

export default ManageChapters;