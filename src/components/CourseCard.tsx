import type { Course } from '../types';
import { useApp } from '../context/AppContext';
import { Star, Clock, BookOpen, CheckCircle2, Play, Sparkles, ArrowRight } from 'lucide-react';

interface Props {
  course: Course;
}

export const CourseCard: React.FC<Props> = ({ course }) => {
  const {
    setCurrentView,
    setSelectedCourseId,
    isCourseEnrolled,
    getCourseProgressPercent,
    formatPrice,
    enrollInCourse,
  } = useApp();

  const enrolled = isCourseEnrolled(course.id);
  const progress = getCourseProgressPercent(course.id);

  const handleOpenCourse = () => {
    setSelectedCourseId(course.id);
    setCurrentView('course-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickEnroll = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCourseId(course.id);
    if (course.isFree) {
      enrollInCourse(course.id, 'coupon');
      setCurrentView('classroom');
    } else {
      setCurrentView('checkout');
    }
  };

  return (
    <div
      onClick={handleOpenCourse}
      className="group relative bg-white border border-slate-200/90 rounded-2xl overflow-hidden hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-950/5 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Thumbnail Header */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={course.imageUrl}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md border border-slate-200 rounded-lg text-[10px] font-bold text-slate-800 uppercase tracking-wider font-mono shadow-xs">
            {course.category}
          </span>
          {course.isBestseller && (
            <span className="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg text-[10px] font-bold text-white uppercase tracking-wider shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Bestseller
            </span>
          )}
          {course.isFree && (
            <span className="px-2.5 py-1 bg-emerald-600 rounded-lg text-[10px] font-bold text-white uppercase tracking-wider shadow-md">
              Offert
            </span>
          )}
        </div>

        {/* Level Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-0.5 bg-white/90 border border-slate-200 text-[10px] text-slate-700 font-bold rounded-md font-mono shadow-xs">
            {course.level}
          </span>
        </div>

        {/* Play Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/30 backdrop-blur-xs">
          <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Rating & Stats */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-mono">
            <div className="flex items-center gap-1 text-amber-600 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-500" />
              <span>{course.rating}</span>
              <span className="text-slate-400 font-normal">({course.ratingCount})</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {course.durationHours}h
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                {course.totalLessons} leçons
              </span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
            {course.title}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
            {course.subtitle}
          </p>
        </div>

        {/* Instructor Info */}
        <div className="flex items-center gap-2.5 pt-3 border-t border-slate-100">
          <img
            src={course.instructorAvatar}
            alt={course.instructorName}
            className="w-7 h-7 rounded-full object-cover border border-slate-300"
          />
          <div className="truncate text-xs">
            <div className="text-slate-800 font-semibold truncate">{course.instructorName}</div>
            <div className="text-[10px] text-slate-500 truncate">{course.instructorTitle}</div>
          </div>
        </div>

        {/* Enrolled Progress OR Price & Action */}
        <div className="pt-2">
          {enrolled ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Inscrit
                </span>
                <span className="text-slate-700 font-bold">{progress}% complet</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-black text-slate-900 font-mono">
                  {formatPrice(course.priceMAD)}
                </span>
                {course.originalPriceMAD > course.priceMAD && (
                  <span className="text-xs text-slate-400 line-through font-mono">
                    {formatPrice(course.originalPriceMAD)}
                  </span>
                )}
              </div>

              <button
                onClick={handleQuickEnroll}
                className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-600 border border-emerald-300 hover:border-emerald-600 text-emerald-800 hover:text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1 shadow-xs"
              >
                <span>{course.isFree ? 'S\'inscrire' : 'Découvrir'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
