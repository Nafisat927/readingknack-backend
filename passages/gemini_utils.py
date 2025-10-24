import os
import google.generativeai as genai
from dotenv import load_dotenv
import re
from django.db import transaction
from .models import QuizQuestion, QuizAnswer

# Load environment variables
load_dotenv()

# Configure Gemini with API key
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Primary and fallback models (updated for free tier compatibility)
PRIMARY_MODEL = "gemini-2.0-flash-001"  # Stable Gemini 2.0 Flash
FALLBACK_MODEL = "gemini-2.5-flash"     # Stable Gemini 2.5 Flash

def generate_questions(text): #takes in passage text 
    """
    Given a passage of text, generate 7 reading comprehension questions, using Gemini.
    Falls back to another model if the first one fails.
    """
    prompt = f"""Based on this passage, generate exactly 7 reading comprehension questions. 

IMPORTANT: Use EXACTLY this format for each question:

**1. Question text here?**
A) First choice text
B) Second choice text  
C) Third choice text
D) Fourth choice text
Answer: C

**2. Next question here?**
A) Choice A text
B) Choice B text
C) Choice C text
D) Choice D text
Answer: B

(Continue for all 7 questions)

Passage:
{text}"""

    #try each model 
    for model_name in [PRIMARY_MODEL, FALLBACK_MODEL]:
        try:
            print(f"Trying Gemini model: {model_name}...")
            model = genai.GenerativeModel(model_name)
            response = model.generate_content(prompt)
            return response.text
        #log errors and proceed to next model
        except Exception as e:
            print(f"⚠️ Error with {model_name}: {e}")
    #if both models fail
    return "❌ Failed to generate questions."

def parse_questions(raw_text):
    """
    Parse the raw Gemini output into structured data.

    Args:
        raw_text (str): The raw text output from Gemini.

    Returns:
        list[dict]: A list of question dicts with empty answers (for now).
    """
    questions = []
    current_question = None

    #regex patterns to identify question, choices, and answers in the text.
    question_pattern = re.compile(r'^\*\*\d+\.\s*(.+?)\*\*')
    choice_pattern = re.compile(r'^[A-D]\)\s*(.+)')
    answer_pattern = re.compile(r'^Answer:\s*([A-D])')

    for line in raw_text.splitlines():
        line = line.strip()
        if not line:
            continue

        if question_pattern.match(line):
            if current_question:
                questions.append(current_question)
            current_question = {"question_text": "", "answers": [], "correct_choice": None}
            current_question["question_text"] = question_pattern.match(line).group(1).strip()
        elif choice_pattern.match(line) and current_question:
            choice_text = choice_pattern.match(line).group(1).strip()
            choice_letter = line[0]  # 'A', 'B', 'C', or 'D'
            current_question["answers"].append({
                "choice_letter": choice_letter,
                "choice_text": choice_text,
                "is_correct": False
            })
        elif 'A)' in line and 'B)' in line and 'C)' in line and 'D)' in line and current_question:
            # Handle case where all choices are on one line
            choice_matches = re.findall(r'([A-D])\s*\)\s*([^A-D]+?)(?=\s*[A-D]\s*\)|$)', line)
            for choice_letter, choice_text in choice_matches:
                current_question["answers"].append({
                    "choice_letter": choice_letter,
                    "choice_text": choice_text.strip(),
                    "is_correct": False
                })
                #mark correct answer
        elif answer_pattern.match(line) and current_question:
            correct_letter = answer_pattern.match(line).group(1)
            for ans in current_question["answers"]:
                ans["is_correct"] = (ans["choice_letter"] == correct_letter)
    #append last parsed question 
    if current_question:
        questions.append(current_question)

    return questions


def save_parsed_questions(document, parsed_questions):
    """
    Save parsed questions to the database with proper error handling.
    
    Args:
        document: UploadedDocument instance
        parsed_questions: List of parsed question dictionaries
    
    Returns:
        bool: True if successful, False otherwise
    """
    try:
        print(f"🔄 Attempting to save {len(parsed_questions)} questions to database...")
        #all DB operations succeed or none are saved
        with transaction.atomic():
            for q in parsed_questions:
                print(f"📝 Creating question: {q['question_text'][:50]}...")
                
                new_question = QuizQuestion.objects.create(
                    document=document,
                    question_text=q["question_text"],
                    explanation=""  # or fill if you get explanation
                )
                
                print(f"✅ Question created with ID: {new_question.id}")
                
                for ans in q["answers"]:
                    QuizAnswer.objects.create(
                        question=new_question,
                        choice_letter=ans["choice_letter"],
                        choice_text=ans["choice_text"],
                        is_correct=ans["is_correct"]
                    )
                    print(f"   📍 Answer {ans['choice_letter']}: {ans['choice_text'][:30]}...")
                
                print(f"✅ All answers saved for question {new_question.id}")
        
        print(f"🎉 Successfully saved {len(parsed_questions)} questions with all answers!")
        return True
        
    except Exception as e:
        print(f"❌ Error saving questions to database: {str(e)}")
        print(f"❌ Error type: {type(e).__name__}")
        import traceback
        traceback.print_exc()
        return False
