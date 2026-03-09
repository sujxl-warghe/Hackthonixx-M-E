import Link from 'next/link'
import { CheckCircle, Calendar, DollarSign, FileText } from 'lucide-react'

const steps = [
  { step: '01', title: 'Check Eligibility', desc: '12th with PCM, minimum 50% marks. Valid MHT-CET or JEE Main score.' },
  { step: '02', title: 'Apply Online', desc: 'Fill the application form at our website or visit the admissions office.' },
  { step: '03', title: 'Document Verification', desc: 'Submit required documents — marksheets, ID proof, passport photos.' },
  { step: '04', title: 'Counselling Round', desc: 'Attend merit-based counselling and choose your preferred department.' },
  { step: '05', title: 'Fee Payment', desc: 'Complete the fee payment to confirm your admission.' },
  { step: '06', title: 'Orientation', desc: 'Attend freshman orientation and begin your engineering journey!' },
]

const dates = [
  { event: 'Application Portal Opens', date: 'May 1, 2026' },
  { event: 'Last Date to Apply', date: 'June 30, 2026' },
  { event: 'Document Verification', date: 'July 1–15, 2026' },
  { event: 'Counselling Rounds', date: 'July 16–31, 2026' },
  { event: 'Fee Payment Deadline', date: 'August 10, 2026' },
  { event: 'Classes Begin', date: 'August 15, 2026' },
]

export default function AdmissionsPage() {
  return (
    <div>
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20 text-center">
        <h1 className="text-4xl font-bold mb-3">Admissions 2026</h1>
        <p className="text-blue-200 text-lg">Join KDK College of Engineering — Applications Now Open!</p>
      </section>

      {/* Eligibility */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-900 text-center mb-10">Eligibility Criteria</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              'Passed 12th (HSC) with Physics, Chemistry & Mathematics',
              'Minimum 50% aggregate marks (45% for reserved categories)',
              'Valid MHT-CET 2026 or JEE Main 2026 score',
              'Indian nationals and NRI candidates are eligible',
              'Age: Below 25 years as on July 1, 2026',
              'No academic gap of more than 2 years',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-900 text-center mb-10">Admission Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="text-4xl font-black text-blue-100 mb-3">{s.step}</div>
                <h3 className="font-bold text-blue-900 mb-2">{s.title}</h3>
                <p className="text-gray-600 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Dates */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-900 text-center mb-10">Important Dates</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {dates.map((d, i) => (
              <div key={i} className={`flex items-center justify-between px-6 py-4 ${i % 2 === 0 ? 'bg-blue-50' : 'bg-white'}`}>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-800">{d.event}</span>
                </div>
                <span className="text-orange-600 font-bold">{d.date}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fee Structure */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-900 text-center mb-10">Fee Structure (Per Year)</h2>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {[
              { label: 'Tuition Fee', amount: '₹95,000', note: 'All departments' },
              { label: 'Hostel Fee (Boys)', amount: '₹55,000', note: 'Optional' },
              { label: 'Hostel Fee (Girls)', amount: '₹60,000', note: 'Optional' },
              { label: 'Mess Fee', amount: '₹36,000', note: 'If availing hostel' },
              { label: 'Exam Fee', amount: '₹5,000', note: 'Per semester' },
              { label: 'Library/Lab Fee', amount: '₹3,000', note: 'Annual' },
            ].map((f, i) => (
              <div key={i} className={`flex items-center justify-between px-6 py-4 ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                <div>
                  <div className="font-medium text-gray-800">{f.label}</div>
                  <div className="text-gray-500 text-xs">{f.note}</div>
                </div>
                <div className="text-blue-800 font-bold text-lg">{f.amount}</div>
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-sm mt-4 text-center">* Scholarship and fee waiver available for meritorious and economically weaker students</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-orange-500 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Start Your Application Today!</h2>
          <p className="text-orange-100 mb-8">480 seats across 5 departments. Apply early to secure your preferred branch.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#" className="px-8 py-3 bg-white text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition-colors">Download Prospectus</a>
            <Link href="/contact" className="px-8 py-3 bg-orange-600 border-2 border-white text-white font-bold rounded-xl hover:bg-orange-700 transition-colors">Contact Admissions Office</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
