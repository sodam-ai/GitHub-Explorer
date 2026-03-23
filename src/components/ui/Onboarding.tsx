import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Key, Sparkles, ArrowRight, X, Check } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const STEPS = [
  {
    icon: Search,
    title: 'GitHub를 자연어로 검색',
    description: '키워드 대신 일상 언어로 입력하세요.\n"React 드래그앤드롭 라이브러리" 같이요.',
    color: '#3b82f6',
  },
  {
    icon: Key,
    title: 'API 키를 설정하면 더 강력해져요',
    description: '설정에서 OpenAI API 키를 입력하면\nAI가 검색 결과를 분석하고 요약해줍니다.',
    color: '#8b5cf6',
  },
  {
    icon: Sparkles,
    title: '코드에 대해 질문하세요',
    description: '마음에 드는 저장소를 찾으면\n"이 프로젝트 아키텍처 설명해줘" 라고 물어보세요.',
    color: '#f59e0b',
  },
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);

  function handleNext() {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem('onboarding_done', '1');
      onComplete();
    }
  }

  function handleSkip() {
    localStorage.setItem('onboarding_done', '1');
    onComplete();
  }

  const current = STEPS[step];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[var(--bg-primary)]"
    >
      <button
        onClick={handleSkip}
        className="absolute top-4 right-4 btn btn-ghost text-[12px]"
      >
        건너뛰기
        <X size={13} />
      </button>

      <div className="w-full max-w-sm mx-4 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ background: `${current.color}15` }}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <current.icon size={28} style={{ color: current.color }} />
            </motion.div>

            <h2 className="text-[18px] font-bold tracking-tight mb-2">
              {current.title}
            </h2>
            <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
              {current.description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 mt-8 mb-6">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? 'w-6 bg-[var(--accent)]' : 'w-1.5 bg-[var(--border)]'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="btn btn-primary text-[13px] px-6 py-2.5 mx-auto"
        >
          {step < STEPS.length - 1 ? (
            <>
              다음
              <ArrowRight size={14} />
            </>
          ) : (
            <>
              시작하기
              <Check size={14} />
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
