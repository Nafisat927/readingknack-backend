"""
Django Forms for ReadingKnack Application

This file defines Django forms for handling user input, including document uploads
and user registration. Forms provide validation and HTML rendering capabilities.
"""

from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import UploadedDocument

class UploadedDocumentForm(forms.ModelForm):
    """
    Form for uploading reading comprehension documents.
    
    This form allows users to upload Word files that will be
    processed to generate reading comprehension questions. The form includes
    fields for the document title and file upload.
    """
    class Meta:
        model = UploadedDocument  # Links form -> UploadedDocument model
        fields = ['title', 'file']  # Only include title and file fields in the form

