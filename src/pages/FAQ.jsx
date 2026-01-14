import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQData = [
    {
        question: "What is GauGyan World?",
        answer: "GauGyan World is a platform dedicated to spreading knowledge about cow welfare, offering courses, quizzes, and exams on the subject."
    },
    {
        question: "How can I enroll in a course?",
        answer: "You can browse our courses in the 'Education' section, select a course, and click 'Enroll Now' to start learning."
    },
    {
        question: "Is there a certificate for completing courses?",
        answer: "Yes, upon successful completion of a course and passing the final exam, you will receive a certificate."
    },
    {
        question: "How can I donate to a Gaushala?",
        answer: "Visit the 'Gaushala' section, choose a registered Gaushala, and click 'Donate' to contribute directly."
    }
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleQuestion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="container mt-lg mb-2xl">
            <h1 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>Frequently Asked Questions</h1>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                {FAQData.map((item, index) => (
                    <div key={index} style={{ marginBottom: 'var(--spacing-md)', border: '1px solid #E5E7EB', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                        <button
                            onClick={() => toggleQuestion(index)}
                            style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: 'var(--spacing-lg)',
                                background: 'white',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                textAlign: 'left'
                            }}
                        >
                            {item.question}
                            {openIndex === index ? <ChevronUp /> : <ChevronDown />}
                        </button>
                        {openIndex === index && (
                            <div style={{ padding: '0 var(--spacing-lg) var(--spacing-lg)', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                                {item.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQ;
