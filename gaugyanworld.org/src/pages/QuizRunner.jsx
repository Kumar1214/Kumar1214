import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/useData';
import { CheckCircle, XCircle, Award, ArrowRight } from 'lucide-react';
import Button from '../components/Button';
import logo from '../assets/logo.png';

const QuizRunner = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { quizzes, submitResult, loading: dataLoading } = useData();

    const [quiz, setQuiz] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);

    useEffect(() => {
        if (quizzes.length > 0) {
            const foundQuiz = quizzes.find(q => q.id === parseInt(id) || q.id === id);
            // Only update if we found a quiz and it's different from the current one
            if (foundQuiz && (!quiz || quiz.id !== foundQuiz.id)) {
                setQuiz(foundQuiz);
            }
        }
    }, [id, quizzes, quiz]);

    if (dataLoading && !quiz) return <div className="container mt-lg text-center p-8">Loading Quiz Data...</div>;

    if (!quiz) return <div className="container mt-lg text-center p-8">Quiz not found or not loaded. <br /><Button variant="outline" onClick={() => navigate('/quizzes')} style={{ marginTop: '1rem' }}>Back to Quizzes</Button></div>;

    const handleOptionSelect = (idx) => {
        if (isAnswered) return;
        setSelectedOption(idx);
        setIsAnswered(true);

        if (idx === quiz.questions[currentQuestion].correctAnswer) {
            setScore(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentQuestion < quiz.questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            setShowResult(true);
            submitResult({
                quizId: quiz.id,
                title: quiz.title,
                score: (score + (selectedOption === quiz.questions[currentQuestion].correctAnswer ? 1 : 0)) / quiz.questions.length * 100,
                passed: true, // Quizzes might not have pass/fail, just score
                type: 'quiz'
            });
        }
    };

    if (!quiz) return <div className="container mt-lg">Loading...</div>;

    if (showResult) {
        const percentage = (score / quiz.questions.length) * 100;
        const passed = percentage >= 70; // Assuming 70% is passing for quizzes

        const handleDownloadCertificate = () => {
            const certificateHTML = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Certificate - ${quiz.title}</title>
                    <style>
                        body {
                            font-family: 'Georgia', serif;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            min-height: 100vh;
                            margin: 0;
                            background: #f5f5f5;
                        }
                        .certificate {
                            width: 800px;
                            padding: 60px;
                            background: white;
                            border: 20px solid #F59E0B;
                            box-shadow: 0 0 30px rgba(0,0,0,0.1);
                        }
                        .header {
                            text-align: center;
                            margin-bottom: 40px;
                        }
                        .logo {
                            font-size: 48px;
                            margin-bottom: 10px;
                        }
                        .title {
                            font-size: 36px;
                            color: #F59E0B;
                            margin: 20px 0;
                            text-transform: uppercase;
                            letter-spacing: 3px;
                        }
                        .subtitle {
                            font-size: 18px;
                            color: #666;
                        }
                        .content {
                            text-align: center;
                            margin: 40px 0;
                        }
                        .recipient {
                            font-size: 32px;
                            color: #333;
                            margin: 30px 0;
                            font-weight: bold;
                        }
                        .description {
                            font-size: 18px;
                            line-height: 1.8;
                            color: #555;
                            margin: 20px 0;
                        }
                        .quiz-title {
                            font-size: 24px;
                            color: #F59E0B;
                            font-weight: bold;
                            margin: 20px 0;
                        }
                        .score {
                            font-size: 28px;
                            color: #059669;
                            font-weight: bold;
                            margin: 20px 0;
                        }
                        .footer {
                            display: flex;
                            justify-content: space-between;
                            margin-top: 60px;
                            padding-top: 30px;
                            border-top: 2px solid #ddd;
                        }
                        .signature {
                            text-align: center;
                        }
                        .signature-line {
                            border-top: 2px solid #333;
                            width: 200px;
                            margin: 10px auto;
                        }
                        .date {
                            color: #666;
                            font-size: 14px;
                        }
                        @media print {
                            body { background: white; }
                            .certificate { border: 15px solid #F59E0B; box-shadow: none; }
                        }
                    </style>
                </head>
                <body>
                    <div class="certificate">
                        <div class="header">
                            {/* <div class="logo">☀️</div>  Removing placeholder text logo if we use the real one, or keeping it? User said 'above transparent logo' */}
                            {/* Let's keep the header text but maybe add the logo there? 
                                User said specifically: "certificate of completion should be centre aligned and aove that will be our tranparent logo"
                            */}
                            <h1 style="margin: 0; font-size: 42px; color: #F59E0B;">Gaugyan</h1>
                            <p class="subtitle">Ancient Wisdom for Modern Living</p>
                        </div>
                        
                        <div style="text-align: center; margin-bottom: 10px;">
                             <img src="${window.location.origin + logo}" style="width: 100px; height: auto;" />
                        </div>
                        <div class="title" style="text-align: center;">Certificate of Completion</div>
                        
                        <div class="content">
                            <p class="description">This is to certify that</p>
                            <div class="recipient">${localStorage.getItem('userName') || 'Student'}</div>
                            <p class="description">has successfully completed</p>
                            <div class="quiz-title">${quiz.title}</div>
                            <p class="description">with a score of</p>
                            <div class="score">${score} / ${quiz.questions.length} (${percentage.toFixed(0)}%)</div>
                        </div>
                        
                        <div class="footer">
                            <div class="signature">
                                <div class="signature-line"></div>
                                <p style="margin: 5px 0; font-weight: bold;">Authorized Signature</p>
                                <p class="date">Gaugyan Platform</p>
                            </div>
                            <div class="signature">
                                <div class="signature-line"></div>
                                <p style="margin: 5px 0; font-weight: bold;">Date of Issue</p>
                                <p class="date">${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>
                        </div>
                    </div>
                    <script>
                        window.onload = function() {
                            window.print();
                        }
                    </script>
                </body>
                </html>
            `;

            const printWindow = window.open('', '_blank');
            printWindow.document.open();
            printWindow.document.body.innerHTML = certificateHTML;
            printWindow.document.close();
        };

        return (
            <div className="container mt-lg" style={{ maxWidth: '600px', textAlign: 'center', padding: '4rem 0' }}>
                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <Award size={80} color="#F59E0B" />
                </div>
                <h2 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-sm)' }}>Quiz Completed!</h2>
                <p style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-xl)', color: 'var(--color-text-muted)' }}>
                    You scored
                </p>
                <div style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: 'var(--spacing-xl)' }}>
                    {score} / {quiz.questions.length}
                </div>

                <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Button variant="outline" onClick={() => navigate('/quizzes')}>Back to Quizzes</Button>
                    {passed && (
                        <Button onClick={handleDownloadCertificate} style={{ backgroundColor: '#059669' }}>
                            Download Certificate
                        </Button>
                    )}
                    <Button onClick={() => window.location.reload()}>Play Again</Button>
                </div>
            </div>
        );
    }

    const question = quiz.questions[currentQuestion];

    return (
        <div className="container mt-lg" style={{ maxWidth: '800px' }}>
            {/* Progress Bar */}
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                    <span>Question {currentQuestion + 1}/{quiz.questions.length}</span>
                    <span>Score: {score}</span>
                </div>
                <div style={{ height: '8px', backgroundColor: '#E5E7EB', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                        height: '100%',
                        width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%`,
                        backgroundColor: 'var(--color-primary)',
                        transition: 'width 0.3s ease'
                    }}></div>
                </div>
            </div>

            {/* Question Card */}
            <div className="card" style={{ padding: 'var(--spacing-2xl)', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-xl)', textAlign: 'center' }}>
                    {question.text}
                </h3>

                <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                    {question.options.map((option, idx) => {
                        let backgroundColor = 'white';
                        let borderColor = '#E5E7EB';
                        let icon = null;

                        if (isAnswered) {
                            if (idx === question.correctAnswer) {
                                backgroundColor = '#D1FAE5';
                                borderColor = '#059669';
                                icon = <CheckCircle size={20} color="#059669" />;
                            } else if (idx === selectedOption) {
                                backgroundColor = '#FEE2E2';
                                borderColor = '#DC2626';
                                icon = <XCircle size={20} color="#DC2626" />;
                            }
                        }

                        return (
                            <button
                                key={`option-${idx}-${option.substring(0, 15)}`}
                                type="button"
                                onClick={() => handleOptionSelect(idx)}
                                disabled={isAnswered}
                                style={{
                                    padding: '16px 20px',
                                    border: `2px solid ${borderColor}`,
                                    backgroundColor: backgroundColor,
                                    borderRadius: 'var(--radius-md)',
                                    cursor: isAnswered ? 'default' : 'pointer',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    fontSize: '1.1rem',
                                    fontWeight: 500,
                                    width: '100%',
                                    textAlign: 'left'
                                }}
                            >
                                {option}
                                {icon}
                            </button>
                        );
                    })}
                </div>

                {isAnswered && (
                    <div style={{ marginTop: 'auto', paddingTop: 'var(--spacing-xl)', display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={handleNext} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {currentQuestion === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'} <ArrowRight size={18} />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizRunner;
