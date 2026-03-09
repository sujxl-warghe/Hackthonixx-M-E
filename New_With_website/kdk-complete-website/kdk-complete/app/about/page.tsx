import Link from 'next/link'
import { Award, Target, Eye } from 'lucide-react'

const timeline = [
  { year: '1998', event: 'KDK College of Engineering founded in Nagpur' },
  { year: '2003', event: 'Received AICTE approval and expanded to 5 departments' },
  { year: '2008', event: 'NBA Accreditation received for all engineering programs' },
  { year: '2012', event: 'New campus infrastructure — labs, library and hostels' },
  { year: '2016', event: 'NAAC A Grade Accreditation — a landmark achievement' },
  { year: '2020', event: 'Crossed 5,000 alumni milestone worldwide' },
  { year: '2024', event: 'NAAC A Grade reaccreditation; highest placement package of 42 LPA' },
  { year: '2026', event: 'AI-powered learning systems and smart campus initiative launched' },
]

const awards = [
  { icon: '🏆', title: 'NAAC A Grade', desc: 'Reaccredited with top grade' },
  { icon: '⭐', title: 'NBA Accreditation', desc: 'All 5 departments accredited' },
  { icon: '🎓', title: 'Best Engineering College', desc: 'Central India — 2024' },
  { icon: '🔬', title: 'Innovation Award', desc: 'AICTE recognized lab setup' },
  { icon: '💼', title: '95% Placement', desc: '3 consecutive years' },
  { icon: '🌟', title: 'Research Excellence', desc: '100+ published papers — 2025' },
]

export default function AboutPage() {
  return (
    <div>
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20 text-center">
        <h1 className="text-4xl font-bold mb-3">About KDK College</h1>
        <p className="text-blue-200 text-lg">Excellence in Engineering Education Since 1998</p>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-blue-50 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-800 rounded-xl flex items-center justify-center"><Eye className="w-6 h-6 text-white" /></div>
              <h2 className="text-2xl font-bold text-blue-900">Our Vision</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">To be a globally recognized institution of engineering excellence, producing innovative engineers who contribute meaningfully to technological advancement and national development.</p>
          </div>
          <div className="bg-orange-50 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center"><Target className="w-6 h-6 text-white" /></div>
              <h2 className="text-2xl font-bold text-orange-600">Our Mission</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">To provide world-class engineering education through state-of-the-art facilities, industry collaboration, and experienced faculty — fostering innovation, ethics, and leadership in every student.</p>
          </div>
        </div>
      </section>

      {/* Principal's Message */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-900 text-center mb-10">Principal's Message</h2>
          <div className="bg-white rounded-2xl shadow-sm p-8 flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0 text-center">
              <div className="w-32 h-32 bg-blue-200 rounded-full mx-auto flex items-center justify-center text-4xl font-bold text-blue-800">DR</div>
              <div className="mt-3 font-bold text-gray-900">Dr. Rajesh Deshmukh</div>
              <div className="text-gray-500 text-sm">Principal</div>
            </div>
            <div>
              <p className="text-gray-700 leading-relaxed italic">"At KDK College of Engineering, we are committed to nurturing not just technically competent engineers, but well-rounded individuals with strong values and a drive for innovation. Our faculty, facilities, and industry partnerships create an environment where every student can thrive and achieve their full potential. I welcome you to be part of our ever-growing KDK family."</p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-900 text-center mb-12">Our Journey</h2>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-blue-200" />
            <div className="space-y-8">
              {timeline.map((t, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="relative z-10 w-16 h-16 bg-blue-800 text-white rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">{t.year}</div>
                  <div className="bg-blue-50 rounded-xl p-4 flex-1 mt-2">
                    <p className="text-gray-700">{t.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-900 text-center mb-10">Awards & Accreditations</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {awards.map((a, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-3">{a.icon}</div>
                <div className="font-bold text-blue-900">{a.title}</div>
                <div className="text-gray-600 text-sm mt-1">{a.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accreditation badges */}
      <section className="py-12 bg-blue-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Official Recognition</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {['NAAC A Grade','NBA Accredited','AICTE Approved','RTMNU Affiliated','ISO 9001:2015'].map((badge, i) => (
              <span key={i} className="bg-orange-500 text-white font-bold px-6 py-3 rounded-xl">{badge}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
