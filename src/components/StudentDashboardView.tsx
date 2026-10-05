import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  Award,
  FileText,
  CreditCard,
  Play,
  ExternalLink,
} from 'lucide-react';

export const StudentDashboardView: React.FC = () => {
  const {
    currentUser,
    courses,
    orders,
    setCurrentView,
    setSelectedCourseId,
    setSelectedCertificate,
    getCourseProgressPercent,
    formatPrice,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'courses' | 'certs' | 'notes' | 'orders'>('courses');

  const enrolledCourses = courses.filter((c) => currentUser.enrolledCourseIds.includes(c.id));

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Profile Welcome Header */}
      <div className="bg-gradient-to-r from-emerald-50 via-white to-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{currentUser.name}</h1>
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-mono font-bold rounded uppercase">
                Apprenant Vérifié
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5 font-medium">{currentUser.email} • {currentUser.company}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 w-full md:w-auto font-mono">
          <div className="p-3 bg-white border border-slate-200 rounded-xl text-center shadow-xs">
            <div className="text-lg font-bold text-emerald-700">{enrolledCourses.length}</div>
            <div className="text-[10px] text-slate-500 font-medium">Formations</div>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-xl text-center shadow-xs">
            <div className="text-lg font-bold text-cyan-700">{currentUser.completedLessonIds.length}</div>
            <div className="text-[10px] text-slate-500 font-medium">Leçons Validées</div>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-xl text-center shadow-xs">
            <div className="text-lg font-bold text-amber-700">{currentUser.certificates.length}</div>
            <div className="text-[10px] text-slate-500 font-medium">Certificats</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-bold font-mono overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('courses')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors ${
            activeSubTab === 'courses'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Mes Formations En Cours ({enrolledCourses.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('certs')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors ${
            activeSubTab === 'certs'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Mes Certificats Officiels ({currentUser.certificates.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('notes')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors ${
            activeSubTab === 'notes'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Mes Notes Personnelles</span>
        </button>

        <button
          onClick={() => setActiveSubTab('orders')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 transition-colors ${
            activeSubTab === 'orders'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Historique de Paiements</span>
        </button>
      </div>

      {/* SUBTAB 1: Enrolled Courses */}
      {activeSubTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((course) => {
            const progress = getCourseProgressPercent(course.id);
            return (
              <div
                key={course.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs p-5 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="relative h-36 rounded-xl overflow-hidden bg-slate-100">
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-white/90 border border-slate-200 rounded text-[10px] font-mono text-emerald-800 font-bold">
                      {course.category}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug">
                    {course.title}
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1 text-xs font-mono">
                    <div className="flex justify-between text-slate-700 font-medium">
                      <span>Progression :</span>
                      <span className="text-emerald-700 font-bold">{progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCourseId(course.id);
                      setCurrentView('classroom');
                    }}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-transform flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Reprendre le Cours</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SUBTAB 2: Certificates */}
      {activeSubTab === 'certs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentUser.certificates.map((cert) => (
            <div
              key={cert.id}
              className="p-6 bg-white border border-amber-300 rounded-2xl shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-amber-600" />
                  <span className="text-xs font-mono font-bold text-amber-900">{cert.certificateCode}</span>
                </div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold rounded">
                  Score : {cert.scorePercent}%
                </span>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">{cert.courseTitle}</h4>
                <p className="text-xs text-slate-500 mt-1 font-medium">Délivré le {cert.issueDate} par {cert.instructorName}</p>
              </div>

              <button
                onClick={() => {
                  setSelectedCertificate(cert);
                  setCurrentView('certificate');
                }}
                className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Afficher / Imprimer le Certificat HD</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* SUBTAB 3: Notes */}
      {activeSubTab === 'notes' && (
        <div className="space-y-4">
          {Object.entries(currentUser.savedNotes).map(([lessonId, note]) => (
            <div key={lessonId} className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2 shadow-xs">
              <div className="text-xs font-mono text-emerald-800 font-bold">Leçon ID : {lessonId}</div>
              <p className="text-xs text-slate-800 font-mono leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                {note}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* SUBTAB 4: Orders */}
      {activeSubTab === 'orders' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs text-xs">
          <table className="w-full text-left font-mono">
            <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
              <tr>
                <th className="p-4">Transaction ID</th>
                <th className="p-4">Formation</th>
                <th className="p-4">Montant</th>
                <th className="p-4">Mode</th>
                <th className="p-4">Statut</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900">{order.transactionId}</td>
                  <td className="p-4 text-slate-700 font-medium">{order.courseTitle}</td>
                  <td className="p-4 font-bold text-emerald-800">{formatPrice(order.amountMAD)}</td>
                  <td className="p-4 uppercase text-slate-600 font-medium">{order.paymentMethod}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] uppercase font-bold">
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 font-medium">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
