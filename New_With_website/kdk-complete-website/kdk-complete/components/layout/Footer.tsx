import Link from 'next/link'
import { GraduationCap, Phone, Mail, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-lg">KDK College</span>
          </div>
          <p className="text-blue-200 text-sm">Excellence in Engineering Education Since 1998. NAAC A Grade | NBA Accredited | AICTE Approved</p>
        </div>

        <div>
          <h3 className="font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-blue-200 text-sm">
            {([['Home','/home'],['About','/about'],['Academics','/academics'],['Admissions','/admissions'],['Placements','/placements']] as const).map(([l,h]) => (
              <li key={h}><Link href={h} className="hover:text-white transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-4">More</h3>
          <ul className="space-y-2 text-blue-200 text-sm">
            {([['Facilities','/facilities'],['Student Life','/student-life'],['Contact','/contact'],['AI Assistant','/chat'],['Admin Panel','/admin/login']] as const).map(([l,h]) => (
              <li key={h}><Link href={h} className="hover:text-white transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-4">Contact</h3>
          <ul className="space-y-3 text-blue-200 text-sm">
            <li className="flex gap-2"><MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" /><span>MIDC Area, Hingna Road, Nagpur - 440016</span></li>
            <li className="flex gap-2"><Phone className="w-4 h-4 flex-shrink-0" /><span>+91-712-1234567</span></li>
            <li className="flex gap-2"><Mail className="w-4 h-4 flex-shrink-0" /><span>info@kdkcollege.edu.in</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-blue-800 text-center py-4 text-blue-300 text-sm">
        © 2026 KDK College of Engineering, Nagpur. All rights reserved.
      </div>
    </footer>
  )
}
