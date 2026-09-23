import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../../api/client';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Progress } from '../../components/ui/Progress';
import {
  Target, ChevronRight, CheckCircle2, XCircle,
  BookOpen, Sparkles, RotateCcw, Trophy
} from 'lucide-react';

// ── Step 1: Skill Selector ────────────────────────────────────────────────────
const SKILL_ICONS = {
  python: '🐍', javascript: '⚡', sql: '🗄️', react: '⚛️',
  'machine learning': '🤖', docker: '🐳', aws: '☁️', fastapi: '🚀'
};

function SkillSelector({ onStart }) {
  const skills = Object.keys(SKILL_ICONS);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    if (!selected) return toast.error('Please select a skill first');
    setLoading(true);
    try {
      const res = await client.post('/quiz/start', { skill_name: selected });
      onStart(selected, res.data.questions, res.data.session_id);
    } catch {
      toast.error('Failed to load quiz questions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-2">
          <Target className="w-8 h-8 text-indigo-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">AI Skill Assessment</h1>
        <p className="text-gray-500 max-w-md mx-auto">
          Pick a skill topic. We'll ask you 5 questions, score your answers, and recommend the right learning resources.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {skills.map(skill => (
          <button
            key={skill}
            onClick={() => setSelected(skill)}
            className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all font-medium capitalize text-sm ${
              selected === skill
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md scale-105'
                : 'border-gray-200 bg-white text-gray-600 hover:border-indigo-300 hover:bg-indigo-50/50'
            }`}
          >
            <span className="text-3xl mb-2">{SKILL_ICONS[skill]}</span>
            {skill}
          </button>
        ))}
      </div>

      <Button
        onClick={handleStart}
        isLoading={loading}
        disabled={!selected}
        className="w-full h-12 text-base"
      >
        <Sparkles className="w-5 h-5 mr-2" />
        Start Assessment {selected ? `— ${selected.charAt(0).toUpperCase() + selected.slice(1)}` : ''}
        <ChevronRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  );
}

// ── Step 2: Quiz Questions ────────────────────────────────────────────────────
function QuizQuestion({ skill, questions, sessionId, onComplete }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const current = questions[currentIdx];
  const progress = ((currentIdx) / questions.length) * 100;
  const isLast = currentIdx === questions.length - 1;

  const handleSelect = (option) => {
    if (selected) return; // prevent changing after selection
    setSelected(option);
  };

  const handleNext = async () => {
    if (!selected) return toast.error('Please select an answer');
    const newAnswers = [...answers, selected];

    if (isLast) {
      setSubmitting(true);
      try {
        const res = await client.post('/quiz/submit', {
          session_id: sessionId,
          answers: newAnswers,
        });
        onComplete(res.data);
      } catch {
        toast.error('Failed to submit quiz');
        setSubmitting(false);
      }
    } else {
      setAnswers(newAnswers);
      setSelected(null);
      setCurrentIdx(i => i + 1);
    }
  };

  const optionColors = (opt) => {
    if (!selected) return 'border-gray-200 bg-white hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer';
    if (opt === selected) return 'border-indigo-500 bg-indigo-50 text-indigo-700';
    return 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed';
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Badge variant="default" className="capitalize">{skill}</Badge>
        <span className="text-sm font-medium text-gray-500">
          Question {currentIdx + 1} of {questions.length}
        </span>
      </div>

      {/* Progress */}
      <Progress value={progress} className="h-2" />

      {/* Question Card */}
      <Card className="shadow-lg">
        <CardHeader>
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">
            Q{currentIdx + 1}
          </p>
          <CardTitle className="text-xl leading-relaxed font-semibold text-gray-900">
            {current.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(current.options).map(([key, value]) => (
            <button
              key={key}
              onClick={() => handleSelect(key)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${optionColors(key)}`}
            >
              <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                selected === key ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-gray-300 text-gray-500'
              }`}>
                {key.toUpperCase()}
              </span>
              <span className="font-medium text-sm">{value}</span>
            </button>
          ))}
        </CardContent>
      </Card>

      <Button
        onClick={handleNext}
        isLoading={submitting}
        disabled={!selected}
        className="w-full h-12 text-base"
      >
        {isLast ? (
          <><Trophy className="w-5 h-5 mr-2" /> Submit & See Results</>
        ) : (
          <>Next Question <ChevronRight className="w-5 h-5 ml-2" /></>
        )}
      </Button>
    </div>
  );
}

// ── Step 3: Results ───────────────────────────────────────────────────────────
function QuizResults({ result, onRetake }) {
  const proficiencyColors = {
    EXPERT: { bg: 'bg-purple-50', text: 'text-purple-700', badge: 'bg-purple-100 text-purple-800', bar: 'bg-purple-500' },
    ADVANCED: { bg: 'bg-green-50', text: 'text-green-700', badge: 'bg-green-100 text-green-800', bar: 'bg-green-500' },
    INTERMEDIATE: { bg: 'bg-blue-50', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-800', bar: 'bg-blue-500' },
    BEGINNER: { bg: 'bg-orange-50', text: 'text-orange-700', badge: 'bg-orange-100 text-orange-800', bar: 'bg-orange-500' },
  };
  const colors = proficiencyColors[result.proficiency] || proficiencyColors.BEGINNER;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Score Hero */}
      <Card className={`${colors.bg} border-0 shadow-lg`}>
        <CardContent className="p-8 text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Trophy className={`w-8 h-8 ${colors.text}`} />
            <h2 className={`text-2xl font-bold ${colors.text}`}>Assessment Complete!</h2>
          </div>
          <div className={`text-7xl font-black ${colors.text}`}>{result.score}%</div>
          <div className="flex items-center justify-center gap-3">
            <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${colors.badge}`}>
              {result.proficiency}
            </span>
            <span className="text-gray-600 text-sm">
              {result.correct_count}/{result.total_questions} correct
            </span>
          </div>
          <Progress
            value={result.score}
            className="h-3 bg-white/60 max-w-xs mx-auto"
            indicatorClassName={colors.bar}
          />
        </CardContent>
      </Card>

      {/* AI Feedback */}
      <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 to-white">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-indigo-900">
            <Sparkles className="w-5 h-5 text-indigo-600" /> AI Feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-indigo-800/80 leading-relaxed">{result.ai_feedback}</p>
        </CardContent>
      </Card>

      {/* Question Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Question Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {result.breakdown.map((item, i) => (
            <div key={i} className={`p-4 rounded-xl border ${item.is_correct ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <div className="flex items-start gap-3">
                {item.is_correct
                  ? <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  : <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                }
                <div className="flex-1 space-y-2">
                  <p className="font-semibold text-sm text-gray-900">{item.question}</p>
                  {!item.is_correct && (
                    <div className="space-y-1 text-sm">
                      <p className="text-red-700">
                        <span className="font-medium">Your answer:</span> {item.your_answer}
                      </p>
                      <p className="text-green-700">
                        <span className="font-medium">Correct:</span> {item.correct_answer}
                      </p>
                    </div>
                  )}
                  <p className="text-gray-500 text-xs italic">{item.explanation}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Course Recommendations */}
      {result.recommended_courses?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              Recommended Courses for You
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {result.recommended_courses.map((course, i) => (
              <div key={i} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors">
                <div>
                  <p className="font-semibold text-sm text-gray-900">{course.title}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {course.provider} · {course.duration_weeks} weeks ·{' '}
                    {course.is_free
                      ? <span className="text-green-600 font-semibold">Free</span>
                      : <span className="text-gray-500">Paid</span>
                    }
                  </p>
                </div>
                <Link to={`/courses/${course.id}`}>
                  <Button variant="outline" size="sm">
                    Start →
                  </Button>
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Retake */}
      <Button variant="outline" className="w-full" onClick={onRetake}>
        <RotateCcw className="w-4 h-4 mr-2" /> Assess Another Skill
      </Button>
    </div>
  );
}

// ── Main Assessment Page ──────────────────────────────────────────────────────
export default function Assessment() {
  const [step, setStep] = useState('select');   // select | quiz | results
  const [skill, setSkill] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [result, setResult] = useState(null);

  const handleStart = (selectedSkill, qs, sessId) => {
    setSkill(selectedSkill);
    setQuestions(qs);
    setSessionId(sessId);
    setStep('quiz');
  };

  const handleComplete = (res) => {
    setResult(res);
    setStep('results');
  };

  const handleRetake = () => {
    setSkill(null);
    setQuestions([]);
    setSessionId(null);
    setResult(null);
    setStep('select');
  };

  return (
    <div className="min-h-full py-6 px-4">
      {step === 'select' && <SkillSelector onStart={handleStart} />}
      {step === 'quiz' && (
        <QuizQuestion skill={skill} questions={questions} sessionId={sessionId} onComplete={handleComplete} />
      )}
      {step === 'results' && (
        <QuizResults result={result} onRetake={handleRetake} />
      )}
    </div>
  );
}
