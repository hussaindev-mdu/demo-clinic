import { HeartPulse, Stethoscope, Sparkles, Baby, Bone, ScanLine } from 'lucide-react'

export const CLINIC = {
  name: 'CarePlus Medical Centre',
  tagline: 'Advanced Care. Compassionate Healing.',
  address: ['No. 12, Demo Street, Adyar', 'Chennai – 600 020, Tamil Nadu', '(Fictional address for demonstration)'],
  phone: '+91 00000 00000',
  email: 'hello@careplus.example',
}

export const NAV = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'specialities', label: 'Specialities' },
  { id: 'doctors', label: 'Doctors' },
  { id: 'facilities', label: 'Facilities' },
  { id: 'contact', label: 'Contact' },
]

export const SPECIALITIES = [
  { name: 'Cardiology', icon: HeartPulse, blurb: 'Heart-health assessments, ECG and echocardiography, and long-term follow-up for cardiac conditions.', topics: ['Heart health check-ups', 'ECG & echocardiography', 'Blood pressure management', 'Cardiac rehabilitation advice'] },
  { name: 'General Medicine', icon: Stethoscope, blurb: 'First-line care for everyday illness, chronic conditions and preventive health for adults.', topics: ['Fever & infections', 'Diabetes & thyroid care', 'Preventive health screening', 'Lifestyle counselling'] },
  { name: 'Dermatology', icon: Sparkles, blurb: 'Care for skin, hair and nails, from common rashes to long-standing skin conditions.', topics: ['Acne & pigmentation', 'Eczema & allergies', 'Hair & scalp concerns', 'Minor skin procedures'] },
  { name: 'Pediatrics', icon: Baby, blurb: 'Gentle, family-friendly care for babies, children and teenagers, including growth and vaccination guidance.', topics: ['Well-baby visits', 'Vaccination schedule', 'Growth & development', 'Childhood illnesses'] },
  { name: 'Orthopedics', icon: Bone, blurb: 'Assessment and treatment plans for bones, joints, muscles and sports-related injuries.', topics: ['Joint & back pain', 'Fracture follow-up', 'Sports injuries', 'Physiotherapy referral'] },
  { name: 'Diagnostics', icon: ScanLine, blurb: 'Laboratory tests and imaging under one roof, with reports shared securely with your doctor.', topics: ['Blood & urine tests', 'Digital X-ray & ultrasound', 'ECG', 'Health package screening'] },
]

export const DOCTORS = [
  { id: 'd1', name: 'Dr. Anitha Raghavan', quals: 'MBBS, MD (General Medicine), DM (Cardiology)', speciality: 'Cardiology', years: 18, tone: ['#c9ece9', '#0e9f94'], skin: '#e4b48f', hair: '#2b2118', gender: 'f', bio: 'Fictional profile. Focuses on preventive cardiology and long-term heart-health follow-up.' },
  { id: 'd2', name: 'Dr. Karthik Subramanian', quals: 'MBBS, MD (General Medicine)', speciality: 'General Medicine', years: 14, tone: ['#dfeafa', '#2d5a8a'], skin: '#c58c63', hair: '#1c1a1a', gender: 'm', bio: 'Fictional profile. Special interest in diabetes, thyroid and lifestyle-related conditions.' },
  { id: 'd3', name: 'Dr. Meera Iyer', quals: 'MBBS, MD (Pediatrics), IAP Fellowship', speciality: 'Pediatrics', years: 11, tone: ['#e8f7f6', '#2bb5ab'], skin: '#d9a47c', hair: '#3a2a22', gender: 'f', bio: 'Fictional profile. Cares for newborns through adolescents with a calm, family-first approach.' },
  { id: 'd4', name: 'Dr. Arjun Menon', quals: 'MBBS, MS (Orthopaedics)', speciality: 'Orthopedics', years: 16, tone: ['#eef5fd', '#1c4673'], skin: '#b97d55', hair: '#171414', gender: 'm', bio: 'Fictional profile. Works on joint, spine and sports-injury care with a rehabilitation-first mindset.' },
]

export const FACILITIES = [
  { key: 'consult', title: 'Consultation rooms', text: 'Private, quiet rooms designed for unhurried conversations.' },
  { key: 'diagnostic', title: 'Diagnostic equipment', text: 'Digital imaging and cardiac testing on site.' },
  { key: 'waiting', title: 'Patient waiting area', text: 'Bright, comfortable seating with accessible facilities.' },
  { key: 'treatment', title: 'Treatment rooms', text: 'Clean, well-equipped rooms for procedures and day-care.' },
  { key: 'lab', title: 'Laboratory', text: 'In-house sample collection and laboratory testing.' },
]

export const WHY = [
  { title: 'Experienced medical professionals', text: 'Qualified specialists who take time to listen and explain.' },
  { title: 'Modern facilities', text: 'Well-maintained rooms and equipment across every department.' },
  { title: 'Patient-centred care', text: 'Care plans built around you and your family, not a checklist.' },
  { title: 'Convenient enquiries', text: 'Send an appointment enquiry online and we will confirm by phone.' },
  { title: 'Multispeciality services', text: 'Six departments under one roof to reduce running around.' },
]

export const TESTIMONIALS = [
  { name: 'Priya S.', place: 'Adyar, Chennai', text: 'The staff were patient and explained everything clearly. I never felt rushed during my consultation.' },
  { name: 'Rajesh K.', place: 'Velachery, Chennai', text: 'Tests and consultation in the same building saved us a lot of time. The waiting area was calm and clean.' },
  { name: 'Fatima A.', place: 'T. Nagar, Chennai', text: 'Our child was nervous, but the pediatric team made the visit easy. We felt well looked after.' },
]

export const TIMES = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM']

export const HOURS = [
  ['Monday – Saturday', '8:00 AM – 8:00 PM'],
  ['Sunday', '9:00 AM – 1:00 PM (OPD only)'],
]

/** Tiny event bus so cards can prefill the appointment form without prop-drilling. */
export const PREFILL_EVENT = 'careplus:prefill'
export function prefillAppointment(detail) {
  window.dispatchEvent(new CustomEvent(PREFILL_EVENT, { detail }))
  document.getElementById('appointment')?.scrollIntoView({ behavior: 'smooth' })
}
