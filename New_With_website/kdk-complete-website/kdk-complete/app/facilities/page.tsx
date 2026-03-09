import { COLLEGE } from '@/lib/college-data'

export default function FacilitiesPage() {
  return (
    <div>
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20 text-center">
        <h1 className="text-4xl font-bold mb-3">Campus Facilities</h1>
        <p className="text-blue-200 text-lg">World-class infrastructure for an exceptional learning experience</p>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COLLEGE.facilities.map((f, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="text-5xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-blue-900 text-xl mb-2">{f.name}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Labs highlight */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-900 text-center mb-10">Advanced Laboratories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: 'AI & Machine Learning Lab', desc: '40 workstations with GPUs, TensorFlow, PyTorch and cloud computing access.', tag: 'CSE' },
              { name: 'Robotics & Automation Lab', desc: 'Industrial robots, PLCs, pneumatic systems and CNC machines.', tag: 'MECH' },
              { name: 'Power Electronics Lab', desc: 'Inverters, converters, solar simulation and smart grid setup.', tag: 'EE' },
              { name: 'VLSI Design Lab', desc: 'Cadence tools, FPGA boards and IC fabrication simulation software.', tag: 'ECE' },
              { name: 'Geotechnical Lab', desc: 'Soil testing, triaxial tests and foundation design equipment.', tag: 'CIVIL' },
              { name: 'Cybersecurity Lab', desc: 'Ethical hacking tools, network simulators and forensics systems.', tag: 'CSE' },
            ].map((lab, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200 flex gap-4">
                <div className="w-14 h-14 bg-blue-100 text-blue-800 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0">{lab.tag}</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{lab.name}</h3>
                  <p className="text-gray-600 text-sm">{lab.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-blue-900 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Come Experience Our Campus!</h2>
          <p className="text-blue-200 mb-6">Schedule a campus visit and see our world-class facilities in person.</p>
          <a href="/contact" className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-xl transition-colors">Book a Campus Visit</a>
        </div>
      </section>
    </div>
  )
}
