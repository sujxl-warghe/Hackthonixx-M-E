'use client'
import { useState } from 'react'
import { COLLEGE } from '@/lib/college-data'

const deptDetails: Record<string, {
  hod: string; welcome: string; labs: string[]; subjects: string[]; careers: string[];
}> = {
  'Computer Science & Engineering': {
    hod: 'Dr. Sunita Agrawal',
    welcome: 'Our CSE department combines core computer science with cutting-edge technologies in AI, ML, cloud computing and cybersecurity to produce industry-ready engineers.',
    labs: ['Programming Lab', 'Data Science Lab', 'AI & ML Lab', 'Networking Lab', 'Cybersecurity Lab'],
    subjects: ['Data Structures', 'Algorithms', 'Machine Learning', 'Database Management', 'Operating Systems', 'Cloud Computing'],
    careers: ['Software Engineer', 'Data Scientist', 'AI Engineer', 'DevOps Engineer', 'Cybersecurity Analyst'],
  },
  'Mechanical Engineering': {
    hod: 'Dr. Prakash Rao',
    welcome: 'Mechanical Engineering at KDK bridges traditional manufacturing with modern automation, robotics and sustainable energy systems.',
    labs: ['Workshop Lab', 'CAD/CAM Lab', 'Thermodynamics Lab', 'Robotics Lab', 'Automobile Lab'],
    subjects: ['Engineering Mechanics', 'Thermodynamics', 'Manufacturing Processes', 'CAD/CAM', 'Robotics', 'Fluid Mechanics'],
    careers: ['Mechanical Engineer', 'Design Engineer', 'Manufacturing Manager', 'Automotive Engineer', 'HVAC Engineer'],
  },
  'Electrical Engineering': {
    hod: 'Dr. Meena Kulkarni',
    welcome: 'Our Electrical Engineering program equips students with expertise in power systems, renewable energy, and smart grid technologies.',
    labs: ['Electrical Machines Lab', 'Power Electronics Lab', 'Control Systems Lab', 'Smart Grid Lab', 'PLC Lab'],
    subjects: ['Circuit Theory', 'Power Systems', 'Control Systems', 'Power Electronics', 'Renewable Energy', 'Smart Grids'],
    careers: ['Electrical Engineer', 'Power System Engineer', 'Control Engineer', 'Renewable Energy Consultant'],
  },
  'Civil Engineering': {
    hod: 'Dr. Anand Joshi',
    welcome: 'Civil Engineering at KDK focuses on sustainable infrastructure design, structural analysis, and environmental engineering for tomorrow\'s cities.',
    labs: ['Structural Lab', 'Geotechnical Lab', 'Environmental Lab', 'Survey Lab', 'Transportation Lab'],
    subjects: ['Structural Analysis', 'Geotechnical Engineering', 'Environmental Engineering', 'Transportation Engineering', 'Construction Management'],
    careers: ['Civil Engineer', 'Structural Engineer', 'Project Manager', 'Urban Planner', 'Environmental Engineer'],
  },
  'Electronics & Communication Engineering': {
    hod: 'Dr. Kavita Sharma',
    welcome: 'ECE at KDK covers embedded systems, VLSI, wireless communications and IoT — preparing students for the connected world of tomorrow.',
    labs: ['VLSI Lab', 'Embedded Systems Lab', 'Communication Lab', 'IoT Lab', 'Signal Processing Lab'],
    subjects: ['Digital Electronics', 'VLSI Design', 'Embedded Systems', 'Wireless Communication', 'IoT', 'Signal Processing'],
    careers: ['Electronics Engineer', 'VLSI Designer', 'Embedded Engineer', 'RF Engineer', 'IoT Developer'],
  },
}

export default function AcademicsPage() {
  const [active, setActive] = useState(COLLEGE.departments[0].name)
  const dept = deptDetails[active]

  return (
    <div>
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20 text-center">
        <h1 className="text-4xl font-bold mb-3">Academic Programs</h1>
        <p className="text-blue-200 text-lg">5 NBA-Accredited B.Tech Engineering Programs</p>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          {/* Tab buttons */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {COLLEGE.departments.map(d => (
              <button
                key={d.name}
                onClick={() => setActive(d.name)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${active === d.name ? 'bg-blue-800 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-800'}`}
              >
                {d.icon} {d.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {dept && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* HOD */}
              <div className="md:col-span-1">
                <div className="bg-blue-50 rounded-2xl p-6">
                  <div className="w-20 h-20 bg-blue-800 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                    {dept.hod.split(' ').map(n => n[0]).join('').slice(0,2)}
                  </div>
                  <h3 className="font-bold text-blue-900">{dept.hod}</h3>
                  <p className="text-orange-500 text-sm font-semibold mb-3">Head of Department</p>
                  <p className="text-gray-600 text-sm italic">"{dept.welcome}"</p>
                </div>
              </div>

              {/* Details */}
              <div className="md:col-span-2 space-y-6">
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h3 className="font-bold text-blue-900 mb-3">Labs & Facilities</h3>
                  <div className="flex flex-wrap gap-2">
                    {dept.labs.map((l, i) => (
                      <span key={i} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">{l}</span>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h3 className="font-bold text-blue-900 mb-3">Key Subjects</h3>
                  <div className="flex flex-wrap gap-2">
                    {dept.subjects.map((s, i) => (
                      <span key={i} className="bg-orange-100 text-orange-700 text-sm px-3 py-1 rounded-full">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h3 className="font-bold text-blue-900 mb-3">Career Opportunities</h3>
                  <div className="flex flex-wrap gap-2">
                    {dept.careers.map((c, i) => (
                      <span key={i} className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full">✓ {c}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-12 bg-orange-500 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-3">Ready to Enroll?</h2>
          <p className="text-orange-100 mb-6">Applications for 2026 batch are now open. Limited seats available!</p>
          <a href="/admissions" className="inline-block bg-white text-orange-600 font-bold px-8 py-3 rounded-xl hover:bg-orange-50 transition-colors">Apply Now →</a>
        </div>
      </section>
    </div>
  )
}
