import { COLLEGE } from '@/lib/college-data'
import { TrendingUp, Award, Users } from 'lucide-react'

const yearStats = [
  { year: '2021', placed: 78, total: 100, avg: '4.2 LPA', highest: '18 LPA' },
  { year: '2022', placed: 84, total: 100, avg: '5.1 LPA', highest: '24 LPA' },
  { year: '2023', placed: 90, total: 100, avg: '5.8 LPA', highest: '32 LPA' },
  { year: '2024', placed: 95, total: 100, avg: '6.2 LPA', highest: '38 LPA' },
  { year: '2025', placed: 95, total: 100, avg: '6.5 LPA', highest: '42 LPA' },
]

const stories = [
  { name: 'Priya Sharma', branch: 'CSE 2025', company: 'Amazon', package: '42 LPA', quote: "KDK's coding bootcamp and placement training made me placement-ready. Cleared Amazon's 6-round interview with confidence!" },
  { name: 'Rahul Patil', branch: 'ECE 2024', company: 'Qualcomm', package: '28 LPA', quote: "The VLSI lab at KDK gave me hands-on experience that impressed Qualcomm's technical panel." },
  { name: 'Sneha Joshi', branch: 'MECH 2024', company: 'Bosch', package: '14 LPA', quote: "The industry visits and internship support helped me understand real manufacturing. Bosch was my dream company!" },
]

export default function PlacementsPage() {
  return (
    <div>
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20 text-center">
        <h1 className="text-4xl font-bold mb-3">Placements</h1>
        <p className="text-blue-200 text-lg">Connecting students with India's and the world's top companies</p>
      </section>

      {/* Stats cards */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: <TrendingUp className="w-8 h-8" />, value: COLLEGE.placements.rate, label: 'Placement Rate', color: 'blue' },
              { icon: <Award className="w-8 h-8" />, value: COLLEGE.placements.highest, label: 'Highest Package 2025', color: 'orange' },
              { icon: <Users className="w-8 h-8" />, value: COLLEGE.placements.average, label: 'Average Package', color: 'green' },
            ].map((s, i) => (
              <div key={i} className={`rounded-2xl p-8 text-center text-white ${s.color === 'blue' ? 'bg-blue-800' : s.color === 'orange' ? 'bg-orange-500' : 'bg-green-600'}`}>
                <div className="flex justify-center mb-3">{s.icon}</div>
                <div className="text-4xl font-bold mb-1">{s.value}</div>
                <div className="opacity-90">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Year-wise table */}
          <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">Year-wise Placement Statistics</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-5 bg-blue-900 text-white text-sm font-bold px-6 py-3">
              {['Year','Students Placed (%)','Avg Package','Highest Package','Bar'].map(h => <div key={h} className="text-center">{h}</div>)}
            </div>
            {yearStats.map((s, i) => (
              <div key={i} className={`grid grid-cols-5 px-6 py-4 text-center ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                <div className="font-bold text-blue-900">{s.year}</div>
                <div className="text-gray-800">{s.placed}%</div>
                <div className="text-green-700 font-semibold">{s.avg}</div>
                <div className="text-orange-600 font-semibold">{s.highest}</div>
                <div className="flex items-center justify-center">
                  <div className="bg-blue-200 rounded-full h-3 w-24 overflow-hidden">
                    <div className="bg-blue-800 h-full rounded-full" style={{ width: `${s.placed}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recruiters */}
      <section className="py-16 bg-orange-500 text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Our Top Recruiters</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {COLLEGE.placements.recruiters.map((r, i) => (
              <span key={i} className="bg-white text-orange-600 font-bold px-6 py-3 rounded-xl text-lg">{r}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-900 text-center mb-10">Student Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stories.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-800 text-white rounded-full flex items-center justify-center font-bold">{s.name.split(' ').map(n => n[0]).join('')}</div>
                  <div>
                    <div className="font-bold text-gray-900">{s.name}</div>
                    <div className="text-gray-500 text-xs">{s.branch}</div>
                    <div className="text-orange-500 text-sm font-semibold">{s.company} • {s.package}</div>
                  </div>
                </div>
                <p className="text-gray-600 italic text-sm">"{s.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Placement Process */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-900 text-center mb-10">Placement Preparation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: '📚', title: 'Aptitude Training', desc: '200+ hours of quantitative, verbal and logical reasoning training' },
              { icon: '💻', title: 'Technical Workshops', desc: 'Coding bootcamps, DSA training, mock interviews and project building' },
              { icon: '🎤', title: 'Soft Skills', desc: 'Communication, presentation, group discussions and interview preparation' },
              { icon: '🏢', title: 'Industry Visits', desc: 'Regular visits to top companies and internship opportunities' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-6 bg-blue-50 rounded-2xl">
                <div className="text-3xl">{item.icon}</div>
                <div>
                  <h3 className="font-bold text-blue-900 mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
