"""
Django Admin Configuration for ReadingKnack Application

This file configures the Django admin interface for managing reading comprehension
quiz data, including documents, questions, answers, and user responses.
"""

from django.contrib import admin
from .models import (
    UploadedDocument, GradeLevel, SkillCategory, 
    QuizQuestion, QuizAnswer, QuizResponse, UserAnswer
)


@admin.register(GradeLevel)
class GradeLevelAdmin(admin.ModelAdmin):
    """
    Admin interface for GradeLevel model.
    Manages educational grade levels (e.g., Elementary, Middle School, High School).
    """
    list_display = ['name']  # Show grade level name in list view
    search_fields = ['name']  # Enable search by grade level name


@admin.register(SkillCategory)
class SkillCategoryAdmin(admin.ModelAdmin):
    """
    Admin interface for SkillCategory model.
    Manages reading comprehension skill categories (e.g., Main Idea, Inference, Vocabulary).
    """
    list_display = ['name']  # Show skill category name in list view
    search_fields = ['name']  # Enable search by skill category name


@admin.register(UploadedDocument)
class UploadedDocumentAdmin(admin.ModelAdmin):
    """
    Admin interface for UploadedDocument model.
    Manages uploaded reading passages and their metadata.
    """
    list_display = ['title', 'uploaded_at', 'grade_level', 'skill_category']  # Key fields in list view
    list_filter = ['uploaded_at', 'grade_level', 'skill_category']  # Filter options in sidebar
    search_fields = ['title', 'parsed_text']  # Search by title and document content
    readonly_fields = ['uploaded_at']  # Prevent editing of upload timestamp


@admin.register(QuizQuestion)
class QuizQuestionAdmin(admin.ModelAdmin):
    """
    Admin interface for QuizQuestion model.
    Manages questions generated from uploaded documents.
    """
    list_display = ['question_text', 'document', 'created_at']  # Show question, source document, and creation date
    list_filter = ['created_at', 'document']  # Filter by creation date and source document
    search_fields = ['question_text', 'document__title']  # Search by question text and document title
    readonly_fields = ['created_at']  # Prevent editing of creation timestamp


@admin.register(QuizAnswer)
class QuizAnswerAdmin(admin.ModelAdmin):
    """
    Admin interface for QuizAnswer model.
    Manages answer choices for quiz questions.
    """
    list_display = ['choice_letter', 'choice_text', 'question', 'is_correct']  # Show choice letter, text, question, and correctness
    list_filter = ['is_correct', 'question__document']  # Filter by correctness and source document
    search_fields = ['choice_text', 'question__question_text']  # Search by answer text and question text


@admin.register(QuizResponse)
class QuizResponseAdmin(admin.ModelAdmin):
    """
    Admin interface for QuizResponse model.
    Manages user quiz submissions and scores.
    """
    list_display = ['document', 'user_name', 'score', 'total_questions', 'submitted_at']  # Show quiz results summary
    list_filter = ['submitted_at', 'document']  # Filter by submission date and document
    search_fields = ['user_name', 'document__title']  # Search by user name and document title
    readonly_fields = ['submitted_at']  # Prevent editing of submission timestamp


@admin.register(UserAnswer)
class UserAnswerAdmin(admin.ModelAdmin):
    """
    Admin interface for UserAnswer model.
    Manages individual user answers to quiz questions.
    """
    list_display = ['response', 'question', 'selected_answer', 'is_correct']  # Show user's answer and correctness
    list_filter = ['is_correct', 'response__document']  # Filter by correctness and source document
    search_fields = ['response__user_name', 'question__question_text']  # Search by user name and question text
