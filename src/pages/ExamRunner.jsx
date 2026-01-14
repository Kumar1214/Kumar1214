import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/useData';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Button from '../components/Button';

const ExamRunner = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { exams, submitResult, loading: dataLoading } = useData();

    const [exam, setExam] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [isStarted, setIsStarted] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [score, setScore] = useState(0);

    useEffect(() => {
        if (exams.length > 0) {
            const foundExam = exams.find(e => e.id === parseInt(id) || e.id === id);
            if (foundExam) {
                setExam(foundExam);
                setTimeLeft(foundExam.duration * 60);
            }
        }
    }, [id, exams]);

    // Timer Logic
    useEffect(() => {
        let timer;
        if (isStarted && !isFinished && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isStarted && !isFinished) {
            handleSubmit();
        }
        return () => clearInterval(timer);
    }, [isStarted, isFinished, timeLeft]);

    // ... (formatTime, handleOptionSelect helpers remain same)

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleOptionSelect = (questionId, optionIndex) => {
        setAnswers({ ...answers, [questionId]: optionIndex });
    };

    const handleSubmit = () => {
        let calculatedScore = 0;
        exam.questions.forEach(q => {
            if (answers[q.id] === q.correctAnswer) {
                calculatedScore++;
            }
        });

        const percentage = (calculatedScore / exam.questions.length) * 100;
        setScore(percentage);
        setIsFinished(true);

        submitResult({
            examId: exam.id,
            title: exam.title,
            score: percentage,
            passed: percentage >= exam.passingScore,
            type: 'exam'
        });
    };

    if (dataLoading && !exam) return <div className="container mt-lg p-8 text-center">Loading exam data...</div>;

    if (!exam) return (
        <div className="container mt-lg p-8 text-center">
            <h2>Exam Not Found</h2>
            <p>The exam you are looking for does not exist or matches no records.</p>
            <Button onClick={() => navigate('/exams')} variant="outline" style={{ marginTop: '1rem' }}>Back to Exams</Button>
        </div>
    );

    if (!isStarted) {
        return (
            <div className="container mt-lg" style={{ maxWidth: '800px', textAlign: 'center', padding: '4rem 0' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-md)' }}>{exam.title}</h1>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xl)', color: 'var(--color-text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Clock size={24} /> {exam.duration} Minutes
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertCircle size={24} /> {exam.questions.length} Questions
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle size={24} /> Passing Score: {exam.passingScore}%
                    </div>
                </div>

                <div className="card" style={{ padding: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xl)', textAlign: 'left' }}>
                    <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Instructions:</h3>
                    <ul style={{ paddingLeft: '20px', lineHeight: 1.8 }}>
                        <li>The timer will start immediately after you click "Start Exam".</li>
                        <li>You cannot pause the exam once started.</li>
                        <li>Ensure you have a stable internet connection.</li>
                        <li>Do not refresh the page during the exam.</li>
                    </ul>
                </div>

                <Button onClick={() => setIsStarted(true)} size="large">Start Exam Now</Button>
            </div>
        );
    }

    if (isFinished) {
        const passed = score >= exam.passingScore;

        const handleDownloadCertificate = () => {
            // Create certificate HTML
            const certificateHTML = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Certificate - ${exam.title}</title>
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
                            border: 20px solid #FF6B35;
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
                            color: #FF6B35;
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
                        .exam-title {
                            font-size: 24px;
                            color: #FF6B35;
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
                            .certificate { border: 15px solid #FF6B35; box-shadow: none; }
                        }
                    </style>
                </head>
                <body>
                    <div class="certificate">
                        <div class="header">
                            <div class="logo">☀️</div>
                            <h1 style="margin: 0; font-size: 42px; color: #FF6B35;">Gaugyan</h1>
                            <p class="subtitle">Ancient Wisdom for Modern Living</p>
                        </div>
                        
                        <div class="title">Certificate of Achievement</div>
                        
                        <div class="content">
                            <p class="description">This is to certify that</p>
                            <div class="recipient">${localStorage.getItem('userName') || 'Student'}</div>
                            <p class="description">has successfully completed</p>
                            <div class="exam-title">${exam.title}</div>
                            <p class="description">with a score of</p>
                            <div class="score">${score.toFixed(0)}%</div>
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

            // Open in new window and print
            const printWindow = window.open('', '_blank');
            printWindow.document.write(certificateHTML);
            printWindow.document.close();
        };

        return (
            <div className="container mt-lg" style={{ maxWidth: '600px', textAlign: 'center', padding: '4rem 0' }}>
                <div style={{ fontSize: '5rem', marginBottom: 'var(--spacing-md)' }}>
                    {passed ? '🎉' : '😔'}
                </div>
                <h2 style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-sm)', color: passed ? '#059669' : '#DC2626' }}>
                    {passed ? 'Congratulations! You Passed' : 'Better Luck Next Time'}
                </h2>
                <p style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-xl)' }}>
                    You scored <span style={{ fontWeight: 700 }}>{score.toFixed(0)}%</span>
                </p>

                <div className="card" style={{ padding: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}>
                        <span>Total Questions:</span>
                        <strong>{exam.questions.length}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}>
                        <span>Correct Answers:</span>
                        <strong>{Object.keys(answers).filter(qId => answers[qId] === exam.questions.find(q => q.id === parseInt(qId)).correctAnswer).length}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Passing Score:</span>
                        <strong>{exam.passingScore}%</strong>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Button variant="outline" onClick={() => navigate('/exams')}>Back to Exams</Button>
                    {passed && (
                        <Button onClick={handleDownloadCertificate} style={{ backgroundColor: '#059669' }}>
                            Download Certificate
                        </Button>
                    )}
                    <Button onClick={() => window.location.reload()}>Retake Exam</Button>
                </div>
            </div>
        );
    }

    const question = exam.questions[currentQuestion];

    return (
        <div className="container mt-lg" style={{ maxWidth: '900px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xl)', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem' }}>{exam.title}</h2>
                    <span style={{ color: 'var(--color-text-muted)' }}>Question {currentQuestion + 1} of {exam.questions.length}</span>
                </div>
                <div style={{
                    padding: '10px 20px',
                    backgroundColor: timeLeft < 60 ? '#FEE2E2' : '#EFF6FF',
                    color: timeLeft < 60 ? '#DC2626' : '#1D4ED8',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <Clock size={20} />
                    {formatTime(timeLeft)}
                </div>
            </div>

            {/* Question Card */}
            <div className="card" style={{ padding: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-xl)' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-xl)', lineHeight: 1.5 }}>
                    {question.text}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                    {question.options.map((option, idx) => {
                        const isAnswered = answers[question.id] !== undefined;
                        const isSelected = answers[question.id] === idx;
                        const isCorrect = question.correctAnswer === idx;

                        let borderColor = '1px solid #E5E7EB';
                        let backgroundColor = 'white';
                        let icon = null;

                        if (isAnswered) {
                            if (isCorrect) {
                                borderColor = '2px solid #059669';
                                backgroundColor = '#D1FAE5';
                                icon = <CheckCircle size={20} color="#059669" />;
                            } else if (isSelected) {
                                borderColor = '2px solid #DC2626';
                                backgroundColor = '#FEE2E2';
                                icon = <XCircle size={20} color="#DC2626" />;
                            }
                        } else if (isSelected) {
                            // This case won't be visible if we lock selection, but keeping for safety
                            borderColor = '2px solid var(--color-primary)';
                            backgroundColor = '#FFF7ED';
                        }

                        return (
                            <div
                                key={idx}
                                onClick={() => !isAnswered && handleOptionSelect(question.id, idx)}
                                style={{
                                    padding: '16px 20px',
                                    border: borderColor,
                                    backgroundColor: backgroundColor,
                                    borderRadius: 'var(--radius-md)',
                                    cursor: isAnswered ? 'default' : 'pointer',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: '12px'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '50%',
                                        border: isAnswered
                                            ? (isCorrect ? '6px solid #059669' : (isSelected ? '6px solid #DC2626' : '2px solid #D1D5DB'))
                                            : (isSelected ? '6px solid var(--color-primary)' : '2px solid #D1D5DB'),
                                        backgroundColor: 'white'
                                    }}></div>
                                    <span style={{ fontSize: '1.05rem' }}>{option}</span>
                                </div>
                                {icon}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                    variant="outline"
                    onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestion === 0}
                >
                    Previous
                </Button>

                {currentQuestion === exam.questions.length - 1 ? (
                    <Button onClick={handleSubmit} style={{ backgroundColor: '#059669' }}>Submit Exam</Button>
                ) : (
                    <Button onClick={() => setCurrentQuestion(prev => Math.min(exam.questions.length - 1, prev + 1))}>
                        Next Question
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ExamRunner;
