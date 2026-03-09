export default function StudentLifePage() {
  const clubs = [
    { icon: '💻', name: 'CodeKraft Club', desc: 'Competitive programming, hackathons, open-source contributions.' },
    { icon: '🤖', name: 'Robotics Club', desc: 'Build robots, participate in national competitions, IoT projects.' },
    { icon: '🌐', name: 'IoT & Embedded Club', desc: 'Smart systems, Arduino, Raspberry Pi, real-world problem solving.' },
    { icon: '🎵', name: 'Music Society', desc: 'Classical, fusion and rock — concerts and inter-college events.' },
    { icon: '💃', name: 'Dance Troupe', desc: 'Classical, folk and Western dance performances and competitions.' },
    { icon: '🎭', name: 'Drama Club', desc: 'Street plays, theatrical performances and public speaking.' },
    { icon: '📷', name: 'Photography Club', desc: 'Campus events, nature, portrait and urban photography.' },
    { icon: '✍️', name: 'Literary Club', desc: 'Debates, elocution, creative writing and blogging workshops.' },
  ]

  const events = [
    { name: 'TechFest', type: 'Technical', desc: '3-day annual festival with 20+ competitions, workshops and guest lectures from IITians and industry leaders.', date: 'March 2026' },
    { name: 'Rangmanch', type: 'Cultural', desc: 'Grand cultural festival with music, dance, drama, fashion show and celebrity performances.', date: 'February 2026' },
    { name: 'Sports Week', type: 'Sports', desc: 'Inter-department and inter-college sports competition in 10+ sports with prizes and trophies.', date: 'January 2026' },
    { name: 'Hackathon', type: 'Technical', desc: '36-hour coding hackathon with real-world problem statements and prizes up to ₹1 lakh.', date: 'November 2025' },
  ]

  const sports = ['🏏 Cricket', '⚽ Football', '🏀 Basketball', '🏐 Volleyball', '🏸 Badminton', '🏓 Table Tennis', '🤸 Gymnastics', '🏊 Swimming', '🥊 Boxing', '🏋️ Gym']

  return (
    <div>
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20 text-center">
        <h1 className="text-4xl font-bold mb-3">Student Life</h1>
        <p className="text-blue-200 text-lg">Beyond academics — clubs, events, sports and memories for life</p>
      </section>

      {/* Clubs */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-900 text-center mb-4">Clubs & Societies</h2>
          <p className="text-gray-600 text-center mb-10">25+ active student clubs for every interest</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {clubs.map((c, i) => (
              <div key={i} className="bg-blue-50 rounded-2xl p-5 hover:bg-blue-100 transition-colors">
                <div className="text-4xl mb-3">{c.icon}</div>
                <h3 className="font-bold text-blue-900 mb-2">{c.name}</h3>
                <p className="text-gray-600 text-sm">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-900 text-center mb-10">Annual Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((e, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-blue-900 text-xl">{e.name}</h3>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full mt-1 inline-block ${e.type === 'Technical' ? 'bg-blue-100 text-blue-700' : e.type === 'Cultural' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>{e.type}</span>
                  </div>
                  <span className="text-orange-500 text-sm font-semibold">{e.date}</span>
                </div>
                <p className="text-gray-600 text-sm">{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sports */}
      <section className="py-16 bg-orange-500 text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Sports & Athletics</h2>
          <p className="text-orange-100 mb-10">State-of-the-art sports facilities for 10+ sports</p>
          <div className="flex flex-wrap justify-center gap-4">
            {sports.map((s, i) => (
              <span key={i} className="bg-white text-orange-600 font-bold px-6 py-3 rounded-xl text-lg">{s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-900 text-center mb-10">Student Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '🏆', title: 'Smart India Hackathon Winners', desc: 'KDK team won 1st prize at SIH 2025 — ₹1 lakh cash prize' },
              { icon: '🥇', title: 'National Robotics Championship', desc: '2nd place at All India Robotics Competition, IIT Bombay' },
              { icon: '🎤', title: 'Best Technical Paper', desc: 'Published in IEEE Xplore — first UG paper from Nagpur region' },
            ].map((a, i) => (
              <div key={i} className="text-center p-6 bg-yellow-50 rounded-2xl border border-yellow-100">
                <div className="text-5xl mb-4">{a.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{a.title}</h3>
                <p className="text-gray-600 text-sm">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
