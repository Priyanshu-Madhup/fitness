import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { Input, Select, Textarea } from '../components/InputField';
import Button from '../components/Button';
import Card from '../components/Card';
import { generatePlan } from '../services/api';
import { useToast } from '../context/ToastContext';

const GENDER_OPTIONS = [
  { value: '', label: 'Select gender' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other / Prefer not to say' },
];

const GOAL_OPTIONS = [
  { value: '', label: 'Select your goal' },
  { value: 'lose_weight', label: 'Lose Weight' },
  { value: 'build_muscle', label: 'Build Muscle' },
  { value: 'improve_endurance', label: 'Improve Endurance' },
  { value: 'stay_active', label: 'Stay Active & Healthy' },
  { value: 'athletic_performance', label: 'Athletic Performance' },
];

const ACTIVITY_OPTIONS = [
  { value: '', label: 'Select activity level' },
  { value: 'sedentary', label: 'Sedentary (little/no exercise)' },
  { value: 'light', label: 'Lightly Active (1–3 days/week)' },
  { value: 'moderate', label: 'Moderately Active (3–5 days/week)' },
  { value: 'very_active', label: 'Very Active (6–7 days/week)' },
  { value: 'extra_active', label: 'Extra Active (twice/day)' },
];

const DIET_OPTIONS = [
  { value: '', label: 'Select diet preference' },
  { value: 'no_preference', label: 'No Preference' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'keto', label: 'Keto' },
  { value: 'paleo', label: 'Paleo' },
  { value: 'mediterranean', label: 'Mediterranean' },
];

const initialForm = {
  age: '',
  gender: '',
  weight: '',
  height: '',
  goal: '',
  activity_level: '',
  diet_preference: '',
  sleep_hours: '',
  stress_level: '5',
  health_conditions: '',
};

const DAY_GRADIENTS = {
  Monday:    'from-blue-500 to-blue-600',
  Tuesday:   'from-violet-500 to-violet-600',
  Wednesday: 'from-green-500 to-green-600',
  Thursday:  'from-orange-500 to-orange-600',
  Friday:    'from-rose-500 to-rose-600',
  Saturday:  'from-pink-500 to-pink-600',
  Sunday:    'from-slate-400 to-slate-500',
};

function DayCard({ day, html, index }) {
  const gradient = DAY_GRADIENTS[day] || 'from-green-500 to-green-600';
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden"
    >
      <div className={`bg-gradient-to-r ${gradient} px-4 py-2.5`}>
        <span className="text-white font-bold text-sm tracking-wide">{day}</span>
      </div>
      <div
        className="px-4 py-3 plan-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </motion.div>
  );
}

function HtmlSection({ title, html, contentKey, expanded, onToggle }) {
  return (
    <div className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
      <button
        onClick={() => onToggle(contentKey)}
        className="w-full flex items-center justify-between px-5 py-4 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div
              className="px-5 py-4 bg-gray-50 dark:bg-gray-800/50 plan-content"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PlanDisplay({ plan }) {
  const [expanded, setExpanded] = useState({ nutrition: true, tips: true });
  const toggle = (key) => setExpanded((e) => ({ ...e, [key]: !e[key] }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 mt-6"
    >
      <div className="flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 text-green-500" />
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Your Personalised Plan</h2>
      </div>

      {/* Workout — one card per day */}
      {plan.workout_days?.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">🏋️ Weekly Workout Plan</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {plan.workout_days.map((d, i) => (
              <DayCard key={d.day} day={d.day} html={d.html} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Nutrition */}
      {plan.nutrition_plan && (
        <HtmlSection
          title="🥗 Nutrition Plan"
          html={plan.nutrition_plan}
          contentKey="nutrition"
          expanded={expanded.nutrition}
          onToggle={toggle}
        />
      )}

      {/* Tips */}
      {plan.tips && (
        <HtmlSection
          title="💡 Tips & Recommendations"
          html={plan.tips}
          contentKey="tips"
          expanded={expanded.tips}
          onToggle={toggle}
        />
      )}
    </motion.div>
  );
}

export default function GeneratePlanPage() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const { addToast } = useToast();

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: undefined }));
  };

  const validate = () => {
    const errs = {};
    if (!form.age || isNaN(form.age) || Number(form.age) < 10 || Number(form.age) > 100)
      errs.age = 'Enter a valid age (10–100)';
    if (!form.gender) errs.gender = 'Please select a gender';
    if (!form.weight || isNaN(form.weight) || Number(form.weight) < 20)
      errs.weight = 'Enter a valid weight (kg)';
    if (!form.goal) errs.goal = 'Please select a goal';
    if (!form.activity_level) errs.activity_level = 'Please select an activity level';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setPlan(null);
    try {
      const res = await generatePlan(form);
      setPlan(res.data);
      addToast('Your plan has been generated!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to generate plan', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-9 h-9 bg-green-100 dark:bg-green-900/40 rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Generate My Plan</h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          Fill in your details and let AI create a personalised workout &amp; nutrition plan.
        </p>
      </motion.div>

      {/* Form */}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Row 1 */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Age"
              type="number"
              min={10} max={100}
              placeholder="e.g. 24"
              value={form.age}
              onChange={update('age')}
              error={errors.age}
            />
            <Select
              label="Gender"
              options={GENDER_OPTIONS}
              value={form.gender}
              onChange={update('gender')}
              error={errors.gender}
            />
          </div>

          {/* Row 2 */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Weight (kg)"
              type="number"
              min={20}
              placeholder="e.g. 70"
              value={form.weight}
              onChange={update('weight')}
              error={errors.weight}
            />
            <Input
              label="Height (cm)"
              type="number"
              min={100}
              placeholder="e.g. 175"
              value={form.height}
              onChange={update('height')}
              error={errors.height}
            />
          </div>

          {/* Row 3 */}
          <Select
            label="Primary Goal"
            options={GOAL_OPTIONS}
            value={form.goal}
            onChange={update('goal')}
            error={errors.goal}
          />

          <Select
            label="Activity Level"
            options={ACTIVITY_OPTIONS}
            value={form.activity_level}
            onChange={update('activity_level')}
            error={errors.activity_level}
          />

          <Select
            label="Diet Preference"
            options={DIET_OPTIONS}
            value={form.diet_preference}
            onChange={update('diet_preference')}
          />

          {/* Row 4 */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Sleep (hours / night)"
              type="number"
              min={1} max={24}
              placeholder="e.g. 7"
              value={form.sleep_hours}
              onChange={update('sleep_hours')}
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Stress Level: <span className="text-green-500 font-bold">{form.stress_level}/10</span>
              </label>
              <input
                type="range"
                min={1} max={10}
                value={form.stress_level}
                onChange={update('stress_level')}
                className="w-full accent-green-500 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>Low</span><span>High</span>
              </div>
            </div>
          </div>

          {/* Health conditions */}
          <Textarea
            label="Health Conditions / Injuries (optional)"
            placeholder="e.g. Lower back pain, asthma…"
            value={form.health_conditions}
            onChange={update('health_conditions')}
          />

          <Button
            type="submit"
            size="lg"
            loading={loading}
            leftIcon={Zap}
            className="w-full"
          >
            {loading ? 'Generating…' : 'Generate My Plan'}
          </Button>
        </form>
      </Card>

      {/* Plan output */}
      {plan && <PlanDisplay plan={plan} />}
    </div>
  );
}
