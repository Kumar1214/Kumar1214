# Exam/Quiz Module - Critical Issues & Fixes

## Issues Identified (from Browser Testing)

### 1. **401 Unauthorized Errors**
**Endpoints Failing:**
- `GET /api/questions` - Returns 401
- `GET /api/analytics/exam/overview` - Returns 401
- `GET /api/roles` - Returns 401

**Root Cause:**
- The `/api/questions` endpoint requires `authorize('instructor', 'admin')` middleware
- The logged-in admin user may not have the correct role set in the database
- Token might be valid but role permissions are not matching

**Fix Required:**
1. Check admin user's role in database
2. Update user role to 'admin' if needed
3. OR modify `/api/questions` endpoint to allow 'admin' role without 'instructor'

### 2. **Question Sub-Modal Not Updating Parent State**
**Symptom:**
- Click "+ Create New" in Questions section
- Fill question form and click "Add Question"
- Modal closes but parent still shows "Questions (0)"
- Question is NOT added to the exam's question array

**Root Cause:**
- `handleQuestionSubmit` calls `addQuestion()` which returns the created question
- The code updates `newExam.questions` array with the new question ID
- BUT the state update might not be triggering a re-render
- OR the `addQuestion` API call is failing silently due to 401 error

**Current Code (Lines 138-148):**
```javascript
const res = await addQuestion(dataToSubmit);
if (res && res.success && res.data) {
    setNewExam(prev => {
        const currentQuestions = parseArrayField(prev.questions);
        return {
            ...prev,
            questions: [...currentQuestions, res.data.id]
        };
    });
}
```

**Fix Required:**
- Add error handling and console logging
- Check if `addQuestion` is actually succeeding
- Verify the 401 error is not blocking question creation

### 3. **Edit Mode - Questions Not Fetching**
**Symptom:**
- Click "Edit" on existing exam
- Modal shows "Questions (2)" in header
- But the list below is completely empty
- No questions are displayed

**Root Cause:**
- The `handleEditExam` function sets `newExam.questions` to an array of IDs: `[1, 2]`
- The display logic filters `questions` array: `questions.filter(q => parseArrayField(newExam.questions).includes(q.id))`
- BUT the `questions` array from `useData()` context is empty or not loaded
- This is because `GET /api/questions` returns 401, so the questions never load into context

**Fix Required:**
- Fix the 401 error on `/api/questions`
- Ensure questions are fetched when component mounts
- Add loading state and error handling

### 4. **Main Exam Form Submission**
**Symptom:**
- Fill exam form and click "Submit"
- Modal closes
- Console shows: "Form submission canceled because the form is not connected"
- Exam does NOT appear in listing

**Root Cause:**
- This error typically means the form element was unmounted during submission
- The `handleExamSubmit` function calls `setShowExamModal(false)` which unmounts the modal
- If the API call (`addExam`) is slow or fails, the form gets disconnected

**Current Code (Lines 76-88):**
```javascript
const handleExamSubmit = (data) => {
    const examData = { ...newExam, ...(data || {}) };
    
    if (editingExam) {
        updateExam(editingExam.id, examData);
    } else {
        addExam(examData);
    }
    setShowExamModal(false); // This unmounts the form!
    resetExamForm();
};
```

**Fix Required:**
- Make `handleExamSubmit` async
- Wait for `addExam`/`updateExam` to complete before closing modal
- Add error handling
- Show loading state during submission

## Recommended Fixes

### Fix 1: Update Questions Route to Allow Admin
```javascript
// backend/src/modules/learning/questions.routes.js
router.get('/', protect, async (req, res) => {
    try {
        // Allow admin, instructor, or any authenticated user to view questions
        const questions = await Question.findAll({ order: [['createdAt', 'DESC']] });
        res.json({ success: true, data: questions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
```

### Fix 2: Make Exam Submit Async with Error Handling
```javascript
const handleExamSubmit = async (data) => {
    const examData = { ...newExam, ...(data || {}) };
    
    try {
        if (editingExam) {
            await updateExam(editingExam.id, examData);
        } else {
            await addExam(examData);
        }
        setShowExamModal(false);
        resetExamForm();
    } catch (error) {
        console.error('Failed to save exam:', error);
        alert('Failed to save exam. Please try again.');
    }
};
```

### Fix 3: Add Error Handling to Question Submit
```javascript
const handleQuestionSubmit = async (e) => {
    if (e && e.preventDefault) {
        e.preventDefault();
    }
    
    const formData = questionFormData;
    const dataToSubmit = {
        ...formData,
        tags: typeof formData.tags === 'string' ? formData.tags.split(',').map(t => t.trim()) : formData.tags,
        category: newExam.category || 'General'
    };

    try {
        if (editingQuestion) {
            await updateQuestion(editingQuestion.id, dataToSubmit);
        } else {
            const res = await addQuestion(dataToSubmit);
            console.log('Question created:', res); // Debug log
            
            if (res && res.success && res.data) {
                setNewExam(prev => {
                    const currentQuestions = parseArrayField(prev.questions);
                    const updated = {
                        ...prev,
                        questions: [...currentQuestions, res.data.id]
                    };
                    console.log('Updated exam state:', updated); // Debug log
                    return updated;
                });
            } else {
                throw new Error('Failed to create question');
            }
        }
        
        setShowQuestionModal(false);
        resetQuestionForm();
    } catch (error) {
        console.error('Question submit error:', error);
        alert('Failed to save question: ' + error.message);
    }
};
```

### Fix 4: Check Admin User Role in Database
```sql
-- Run this in your database
SELECT id, name, email, role FROM users WHERE email = 'admin@gaugyan.com';

-- If role is not 'admin', update it:
UPDATE users SET role = 'admin' WHERE email = 'admin@gaugyan.com';
```

## Priority Order

1. **CRITICAL**: Fix 401 errors by updating questions route or user role
2. **HIGH**: Make exam submit async with proper error handling
3. **HIGH**: Add error handling to question submit
4. **MEDIUM**: Add loading states and better UX feedback

## Testing Steps After Fixes

1. Login as admin
2. Navigate to Exams page
3. Click "Create Exam"
4. Click "+ Create New" in Questions section
5. Fill question form and submit
6. Verify question appears in list (should show "Questions (1)")
7. Fill exam details and click Submit
8. Verify exam appears in listing
9. Click "Edit" on the exam
10. Verify questions are displayed in edit modal
