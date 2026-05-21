import { useState } from "react";
import type { QuizQuestion } from "../../api/algorithms";

interface Props {
    questions: QuizQuestion[];
    algorithm: string;
    array: number[];
    onClose: () => void;
}

export function Quiz({ questions, algorithm, array, onClose }: Props) {
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [done, setDone] = useState(false);

    const q = questions[current];

    const handleAnswer = (i: number) => {
        if (selected !== null) return;
        setSelected(i);
        if (i === q.correct_index) setScore(s => s + 1);
    };

    const handleNext = () => {
        if (current + 1 >= questions.length) {
            setDone(true);
        } else {
            setCurrent(c => c + 1);
            setSelected(null);
        }
    };

    if (done) {
        return (
            <div className="quiz-card">
                <h2>Quiz complete!</h2>
                <p className="quiz-score">{score} / {questions.length} correct</p>
                <p className="quiz-score-msg">
                    {score === questions.length
                        ? "Perfect score — you nailed it!"
                        : score >= questions.length / 2
                            ? "Good work — review the explanations below."
                            : "Keep watching the visualizer and try again."}
                </p>
                <button className="btn-primary quiz-btn" onClick={onClose}>Back to visualizer</button>
            </div>
        );
    }

    return (
        <div className="quiz-card">
            <div className="quiz-context">
                <span className="quiz-algo">{algorithm} sort</span>
                <span className="quiz-array">Input: [{array.join(", ")}]</span>
            </div>
            <div className="quiz-progress">Question {current + 1} / {questions.length}</div>
            <h3 className="quiz-question">{q.question}</h3>
            <div className="quiz-options">
                {q.options.map((opt, i) => {
                    let cls = "quiz-option";
                    if (selected !== null) {
                        if (i === q.correct_index) cls += " correct";
                        else if (i === selected) cls += " wrong";
                    }
                    return (
                        <button key={i} className={cls} onClick={() => handleAnswer(i)}>
                            {opt}
                        </button>
                    );
                })}
            </div>
            {selected !== null && (
                <div className="quiz-explanation">
                    <strong>{selected === q.correct_index ? "✓ Correct!" : "✗ Incorrect"}</strong>
                    <p>{q.explanation}</p>
                </div>
            )}
            {selected !== null && (
                <button className="btn-primary quiz-btn" onClick={handleNext}>
                    {current + 1 >= questions.length ? "See results" : "Next question"}
                </button>
            )}
        </div>
    );
}