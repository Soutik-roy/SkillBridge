from sqlalchemy import Column, String, Text, Integer, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base
import uuid


class CourseLesson(Base):
    """A single lesson/chapter inside a course."""
    __tablename__ = "course_lessons"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    course_id = Column(String(36), ForeignKey("courses.id"), nullable=False)
    order = Column(Integer, nullable=False, default=1)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)          # Markdown lesson content
    duration_mins = Column(Integer, default=15)     # estimated reading/watch time

    course = relationship("Course", back_populates="lessons")
    progresses = relationship("LessonProgress", back_populates="lesson")


class LessonProgress(Base):
    """Tracks whether a student has completed a specific lesson."""
    __tablename__ = "lesson_progress"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    student_id = Column(String(36), ForeignKey("student_profiles.id"), nullable=False)
    lesson_id = Column(String(36), ForeignKey("course_lessons.id"), nullable=False)
    completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, nullable=True)

    student = relationship("StudentProfile")
    lesson = relationship("CourseLesson", back_populates="progresses")
