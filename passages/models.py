from django.db import models
from django.contrib.auth.models import User
from django.conf import settings

# GradeLevel model: different educational level -> use to categorize
class GradeLevel(models.Model):
    name = models.CharField(max_length=20)  

    def __str__(self):
        return self.name
    
# SkillCategory model: different skill categories -> use to filter by skill
class SkillCategory(models.Model):
    name = models.CharField(max_length=120)  

    def __str__(self):
        return self.name

# Old models -> replaced by the UploadedDocument and QuizQuestion/QuizAnswer models
# These models represented a simpler structure where passages were stored as text fields
# The current implementation uses file uploads instead for more flexibility

# class Passage(models.Model): 
#     title = models.CharField(max_length=255) #passage title
#     text = models.TextField() #the text
#     uploader = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
#     grade_level = models.ForeignKey(GradeLevel, on_delete=models.CASCADE, default=1) 
#     skill_category = models.ForeignKey(SkillCategory, on_delete=models.CASCADE, default=1)  # we'll create ID 1

#     def __str__(self):
#         return self.title #return title
    
# class Question(models.Model):
#     passage = models.ForeignKey('Passage', on_delete=models.CASCADE,)
#     question_text = models.TextField()
#     correct_choice = models.CharField(max_length=1)
#     explanation =  models.TextField()
    
#     def __str__(self):
#         return self.question_text

# class AnswerChoice(models.Model):
#     question =  models.ForeignKey(Question, on_delete=models.CASCADE,)
#     choice_letter = models.CharField(max_length=1)
#     choice_text = models.TextField()

#     def __str__(self):
#         return self.choice_letter
    
# UploadedDocument model: documents uploaded by users 
# Processed to extract text and generate quiz questions
class UploadedDocument(models.Model):
    title = models.CharField(max_length=255)  #user defined
    file = models.FileField(upload_to='documents/')  # actual uploaded file -> (stored in media/documents/)
    uploaded_at = models.DateTimeField(auto_now_add=True)  
    parsed_text = models.TextField(blank=True, null=True)  # Extracted text
    grade_level = models.ForeignKey(GradeLevel, on_delete=models.CASCADE, null=True, blank=True)  
    skill_category = models.ForeignKey(SkillCategory, on_delete=models.CASCADE, null=True, blank=True)  
    uploader = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)  # User who uploaded the document

    def __str__(self):
        return self.title

# QuizQuestion model: quiz questions generated from uploaded documents
class QuizQuestion(models.Model):
    document = models.ForeignKey(UploadedDocument, on_delete=models.CASCADE, related_name='questions')  # The document this question is based on
    question_text = models.TextField()  # The actual question 
    explanation = models.TextField(blank=True, null=True)  
    created_at = models.DateTimeField(auto_now_add=True)  

    def __str__(self):
        return f"{self.document.title} - {self.question_text[:50]}..."

# QuizAnswer model: Answer choices for quiz questions
class QuizAnswer(models.Model):
    question = models.ForeignKey(QuizQuestion, on_delete=models.CASCADE, related_name='answers')  # The question this answer belongs to
    choice_letter = models.CharField(max_length=1)  # A B C D 
    choice_text = models.TextField()  # answer text
    is_correct = models.BooleanField(default=False)  

    def __str__(self):
        return f"{self.question.question_text[:30]} - {self.choice_letter}"

# QuizResponse model: completed quiz attempt -> stores overall score and metadata 
class QuizResponse(models.Model):
    document = models.ForeignKey(UploadedDocument, on_delete=models.CASCADE)  # The document/quiz that was taken
    user_name = models.CharField(max_length=100, blank=True, null=True)  # Name for anonymous users
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True) 
    score = models.IntegerField()  
    total_questions = models.IntegerField() 
    submitted_at = models.DateTimeField(auto_now_add=True) 

    def __str__(self):
        return f"{self.document.title} - {self.score}/{self.total_questions}"

# UserAnswer model: represents individual answer choices made by users during a quiz -> stores whether each answer was correct 
# Links a QuizResponse to specific questions and the answers selected
class UserAnswer(models.Model):
    response = models.ForeignKey(QuizResponse, on_delete=models.CASCADE, related_name='user_answers')  # The quiz session this answer belongs to
    question = models.ForeignKey(QuizQuestion, on_delete=models.CASCADE)  # The specific question answered
    selected_answer = models.ForeignKey(QuizAnswer, on_delete=models.CASCADE)  # The answer choice the user selected
    is_correct = models.BooleanField()  # Whether the selected answer was correct

    def __str__(self):
        return f"{self.response.user_name or 'Anonymous'} - {self.question.question_text[:30]}"





