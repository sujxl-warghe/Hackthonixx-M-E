import Link from 'next/link'
import { COLLEGE } from '@/lib/college-data'
import { ArrowRight, Award, Beaker, Users, Lightbulb } from 'lucide-react'

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-24 md:py-36 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage:'url(/placeholder.jpg)',backgroundSize:'cover',backgroundPosition:'center'}} />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-500 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <Award className="w-4 h-4" /> NAAC A Grade Accredited
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">{COLLEGE.name}</h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-2xl mx-auto">{COLLEGE.tagline}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/admissions" className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg">
              Apply Now →
            </Link>
            <Link href="/academics" className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/30 transition-all">
              Explore Programs
            </Link>
            <Link href="/chat" className="px-8 py-3 bg-white text-blue-900 font-bold rounded-xl hover:bg-blue-50 transition-all hover:scale-105 shadow-lg">
              💬 Chat with AI
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {COLLEGE.stats.map((s, i) => (
              <div key={i} className="text-center p-6 bg-blue-50 rounded-2xl hover:shadow-md transition-shadow">
                <div className="text-4xl font-bold text-blue-800 mb-1">{s.value}</div>
                <div className="text-gray-600 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-2">Engineering Programs</h2>
            <p className="text-gray-600">Industry-aligned curriculum with hands-on experience</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COLLEGE.departments.map((d, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 border border-gray-100">
                <div className="text-4xl mb-4">{d.icon}</div>
                <h3 className="font-bold text-blue-900 mb-2">{d.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{d.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-orange-500 font-semibold bg-orange-50 px-3 py-1 rounded-full">4 Years B.Tech</span>
                  <Link href="/academics" className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:text-blue-800">
                    Learn More <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
            <div className="bg-blue-800 rounded-2xl p-6 text-white flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-xl mb-2">Ready to Start?</h3>
                <p className="text-blue-200 text-sm">Join 5000+ students shaping the future of engineering.</p>
              </div>
              <Link href="/admissions" className="mt-6 inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl transition-colors">
                Apply Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why KDK */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-2">Why Choose KDK?</h2>
            <p className="text-gray-600">What makes us stand out from the rest</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Users className="w-8 h-8" />, title: 'Industry Partnerships', desc: '50+ MoUs with top companies for internships and placements' },
              { icon: <Beaker className="w-8 h-8" />, title: 'State-of-the-art Labs', desc: 'Modern laboratories with latest equipment and technology' },
              { icon: <Award className="w-8 h-8" />, title: 'Expert Faculty', desc: '200+ experienced faculty with PhDs and industry expertise' },
              { icon: <Lightbulb className="w-8 h-8" />, title: 'Innovation Hub', desc: 'Dedicated startup incubator and innovation center' },
            ].map((item, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-blue-50 hover:bg-blue-100 transition-colors">
                <div className="w-16 h-16 bg-blue-800 text-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="font-bold text-blue-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Placements */}
      <section className="py-16 bg-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">Placement Excellence</h2>
            <p className="text-orange-100">Our students work at the world's best companies</p>
          </div>
          <div className="grid grid-cols-3 gap-6 mb-10">
            {[
              { value: COLLEGE.placements.rate, label: 'Placement Rate' },
              { value: COLLEGE.placements.highest, label: 'Highest Package' },
              { value: COLLEGE.placements.average, label: 'Average Package' },
            ].map((s, i) => (
              <div key={i} className="text-center bg-white/10 rounded-2xl p-6">
                <div className="text-3xl font-bold mb-1">{s.value}</div>
                <div className="text-orange-100 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {COLLEGE.placements.recruiters.map((r, i) => (
              <span key={i} className="bg-white text-orange-600 font-semibold px-4 py-2 rounded-xl text-sm">{r}</span>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/placements" className="inline-flex items-center gap-2 bg-white text-orange-600 font-bold px-8 py-3 rounded-xl hover:bg-orange-50 transition-colors">
              View Placement Details <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-2">What Our Alumni Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COLLEGE.testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <p className="text-gray-600 italic mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-800 text-white rounded-full flex items-center justify-center font-bold text-sm">{t.avatar}</div>
                  <div>
                    <div className="font-bold text-gray-900">{t.name}</div>
                    <div className="text-gray-500 text-xs">{t.batch}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-2">Latest News & Events</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COLLEGE.news.map((n, i) => (
              <div key={i} className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
                <span className="text-xs text-orange-500 font-semibold">{n.date}</span>
                <h3 className="font-bold text-blue-900 mt-2 mb-2">{n.title}</h3>
                <p className="text-gray-600 text-sm">{n.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-900 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Begin Your Engineering Journey?</h2>
          <p className="text-blue-200 mb-8">Join thousands of successful engineers who started here. Applications for 2026 now open!</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/admissions" className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all hover:scale-105">Apply Now</Link>
            <Link href="/chat" className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/30 transition-all">Ask AI Assistant</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
