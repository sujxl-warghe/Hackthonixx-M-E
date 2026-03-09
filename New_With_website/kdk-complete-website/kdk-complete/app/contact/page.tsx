'use client'
import { useState } from 'react'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div>
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20 text-center">
        <h1 className="text-4xl font-bold mb-3">Contact Us</h1>
        <p className="text-blue-200 text-lg">We're here to help — reach out anytime</p>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-blue-900 mb-6">Get In Touch</h2>
              {[
                { icon: <MapPin className="w-5 h-5" />, title: 'Address', value: 'MIDC Area, Hingna Road, Nagpur - 440016, Maharashtra' },
                { icon: <Phone className="w-5 h-5" />, title: 'Phone', value: '+91-712-1234567' },
                { icon: <Mail className="w-5 h-5" />, title: 'Email', value: 'info@kdkcollege.edu.in' },
                { icon: <Clock className="w-5 h-5" />, title: 'Office Hours', value: 'Monday – Saturday: 9 AM – 5 PM' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-4 bg-blue-50 rounded-xl mb-3">
                  <div className="w-10 h-10 bg-blue-800 text-white rounded-lg flex items-center justify-center flex-shrink-0">{item.icon}</div>
                  <div>
                    <div className="text-xs font-bold text-blue-900 uppercase tracking-wide">{item.title}</div>
                    <div className="text-gray-700 text-sm">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h3 className="font-bold text-blue-900 mb-3">Department Contacts</h3>
              <div className="space-y-2 text-sm">
                {[
                  ['Admissions Office', 'admissions@kdkcollege.edu.in'],
                  ['Placement Cell', 'placements@kdkcollege.edu.in'],
                  ['Principal Office', 'principal@kdkcollege.edu.in'],
                ].map(([dept, email]) => (
                  <div key={dept} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">{dept}</span>
                    <span className="text-blue-600">{email}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-12 text-center">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-green-800 mb-2">Message Sent!</h3>
                <p className="text-green-700">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', message: '' }) }} className="mt-6 px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors">Send Another</button>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-blue-900 mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                      <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" placeholder="your@email.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" placeholder="+91-XXXXXXXXXX" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                    <textarea required rows={5} value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none" placeholder="How can we help you?" />
                  </div>
                  <button type="submit" className="w-full py-3 bg-blue-800 hover:bg-blue-900 text-white font-bold rounded-xl transition-colors">Send Message</button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="bg-gray-100 h-64 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <MapPin className="w-12 h-12 mx-auto mb-2 text-blue-400" />
          <p className="font-medium">KDK College of Engineering</p>
          <p className="text-sm">MIDC Area, Hingna Road, Nagpur - 440016</p>
          <a href="https://maps.google.com" target="_blank" className="mt-3 inline-block text-blue-600 underline text-sm">Open in Google Maps →</a>
        </div>
      </section>
    </div>
  )
}
