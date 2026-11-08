import { useEffect, useMemo, useRef, useState } from 'react'
import { CalendarCheck, Info, CheckCircle2 } from 'lucide-react'
import { DOCTORS, SPECIALITIES, TIMES, PREFILL_EVENT } from '../data.js'
import { useScrollAnimation } from '../hooks/useScrollAnimation.js'

const INITIAL = { name: '', phone: '', department: '', doctor: '', date: '', time: '', message: '' }
const todayISO = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10) }

/** Accepts Indian mobile numbers: optional +91 / 91 / 0 prefix, then 10 digits starting 6–9. */
export const isValidIndianMobile = (v) => /^(?:\+?91|0)?[6-9]\d{9}$/.test(v.replace(/[\s-]/g, ''))

function validate(v) {
  const e = {}
  if (!v.name.trim()) e.name = 'Please enter the patient’s name.'
  else if (!/^[\p{L}][\p{L}\s.'-]{1,59}$/u.test(v.name.trim())) e.name = 'Use letters only (2–60 characters).'
  if (!v.phone.trim()) e.phone = 'Please enter a mobile number.'
  else if (!isValidIndianMobile(v.phone)) e.phone = 'Enter a valid 10-digit Indian mobile number, e.g. 98765 43210.'
  if (!v.department) e.department = 'Please choose a department.'
  if (!v.date) e.date = 'Please choose a preferred date.'
  else if (v.date < todayISO()) e.date = 'Please choose today or a future date.'
  if (!v.time) e.time = 'Please choose a preferred time.'
  if (v.message.length > 500) e.message = 'Please keep the message under 500 characters.'
  return e
}

function Field({ id, label, error, hint, required, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-navy-800">{label}{required && <span className="text-teal-700" aria-hidden="true"> *</span>}</label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="mt-1 text-xs text-navy-600">{hint}</p>}
      {error && <p id={`${id}-err`} className="mt-1 text-xs font-medium text-red-700">{error}</p>}
    </div>
  )
}

export default function Appointment() {
  const ref = useScrollAnimation()
  const formRef = useRef(null)
  const successRef = useRef(null)
  const [values, setValues] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(null)

  // Prefill from Specialities / Doctors cards
  useEffect(() => {
    const on = (e) => { setSubmitted(null); setValues((v) => ({ ...v, department: e.detail.department || v.department, doctor: e.detail.doctor || '' })) }
    window.addEventListener(PREFILL_EVENT, on)
    return () => window.removeEventListener(PREFILL_EVENT, on)
  }, [])

  const doctorOptions = useMemo(() => DOCTORS.filter((d) => !values.department || d.speciality === values.department), [values.department])

  const set = (k) => (e) => {
    const next = { ...values, [k]: e.target.value }
    if (k === 'department' && next.doctor && !DOCTORS.some((d) => d.name === next.doctor && d.speciality === next.department)) next.doctor = ''
    setValues(next)
    if (touched[k] || k === 'department') setErrors(validate(next))
  }
  const blur = (k) => () => { setTouched((t) => ({ ...t, [k]: true })); setErrors(validate(values)) }

  const onSubmit = (e) => {
    e.preventDefault()
    const errs = validate(values)
    setErrors(errs)
    setTouched({ name: 1, phone: 1, department: 1, date: 1, time: 1, message: 1 })
    const first = Object.keys(errs)[0]
    if (first) { formRef.current.elements[first]?.focus(); return }
    // Demo only: nothing is sent anywhere.
    setSubmitted(values)
    setValues(INITIAL); setTouched({}); setErrors({})
    requestAnimationFrame(() => successRef.current?.focus())
  }

  const a11y = (k, hint) => ({ 'aria-invalid': errors[k] ? 'true' : undefined, 'aria-describedby': errors[k] ? `${k}-err` : hint ? `${k}-hint` : undefined })
  const cls = (k) => `field ${errors[k] ? '!border-red-600' : ''}`

  return (
    <section id="appointment" ref={ref} className="relative z-10 -mt-10 rounded-t-[2.5rem] bg-gradient-to-b from-sky-50 to-white">
      <div className="section grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p data-reveal className="eyebrow">Appointment enquiry</p>
          <h2 data-reveal className="text-4xl font-semibold sm:text-5xl">Tell us how we can help.</h2>
          <p data-reveal className="mt-4 text-lg text-navy-700">Share your preferred department, date and time. In a real clinic, the team would call you to confirm a slot.</p>
          <div data-reveal className="mt-8 flex gap-3 rounded-2xl border border-teal-500/25 bg-teal-50 p-5 text-sm text-navy-800">
            <Info className="mt-0.5 shrink-0 text-teal-600" size={20} aria-hidden="true" />
            <p><strong>Demo notice:</strong> this form validates your input but sends nothing and books nothing. No appointment is created and no data is stored.</p>
          </div>
          <p data-reveal className="mt-4 text-sm text-navy-600">This website is not for medical emergencies. In an emergency call your local emergency number (112 in India).</p>
        </div>

        <div data-reveal className="card p-6 sm:p-9 hover:!translate-y-0">
          {submitted ? (
            <div ref={successRef} tabIndex={-1} role="status" className="py-6 text-center outline-none">
              <CheckCircle2 className="mx-auto text-teal-500" size={56} aria-hidden="true" />
              <h3 className="mt-4 text-3xl font-semibold">Enquiry form completed</h3>
              <p className="mx-auto mt-3 max-w-md text-navy-700">
                Thank you, {submitted.name.trim()}. Your details for <strong>{submitted.department}</strong> on <strong>{submitted.date}</strong> at <strong>{submitted.time}</strong> passed validation.
              </p>
              <p className="mx-auto mt-3 max-w-md rounded-xl bg-sky-50 p-3 text-sm text-navy-700"><strong>This is a demo.</strong> No appointment has been booked and nothing was sent to a clinic.</p>
              <button type="button" onClick={() => setSubmitted(null)} className="btn btn-ghost mt-6">Fill in another enquiry</button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={onSubmit} noValidate aria-label="Appointment enquiry form" className="grid gap-5 sm:grid-cols-2">
              {Object.keys(errors).length > 0 && Object.keys(touched).length > 0 && (
                <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800 sm:col-span-2">Please fix the {Object.keys(errors).length} highlighted field{Object.keys(errors).length > 1 ? 's' : ''} below.</p>
              )}
              <Field id="name" label="Patient name" required error={errors.name}>
                <input id="name" name="name" autoComplete="name" className={cls('name')} placeholder="e.g. Priya Sharma" value={values.name} onChange={set('name')} onBlur={blur('name')} {...a11y('name')} />
              </Field>
              <Field id="phone" label="Mobile number" required error={errors.phone} hint="10-digit Indian mobile number">
                <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" className={cls('phone')} placeholder="98765 43210" value={values.phone} onChange={set('phone')} onBlur={blur('phone')} {...a11y('phone', true)} />
              </Field>
              <Field id="department" label="Department" required error={errors.department}>
                <select id="department" name="department" className={cls('department')} value={values.department} onChange={set('department')} onBlur={blur('department')} {...a11y('department')}>
                  <option value="">Select department</option>
                  {SPECIALITIES.map((s) => <option key={s.name}>{s.name}</option>)}
                </select>
              </Field>
              <Field id="doctor" label="Preferred doctor (fictional)">
                <select id="doctor" name="doctor" className="field" value={values.doctor} onChange={set('doctor')}>
                  <option value="">No preference</option>
                  {doctorOptions.map((d) => <option key={d.id}>{d.name}</option>)}
                </select>
              </Field>
              <Field id="date" label="Preferred date" required error={errors.date}>
                <input id="date" name="date" type="date" min={todayISO()} className={cls('date')} value={values.date} onChange={set('date')} onBlur={blur('date')} {...a11y('date')} />
              </Field>
              <Field id="time" label="Preferred time" required error={errors.time}>
                <select id="time" name="time" className={cls('time')} value={values.time} onChange={set('time')} onBlur={blur('time')} {...a11y('time')}>
                  <option value="">Select time</option>
                  {TIMES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </Field>
              <div className="sm:col-span-2">
                <Field id="message" label="Additional message" error={errors.message} hint={`${values.message.length}/500 – please don't include sensitive medical details.`}>
                  <textarea id="message" name="message" rows={4} className={cls('message')} value={values.message} onChange={set('message')} onBlur={blur('message')} {...a11y('message', true)} />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <button type="submit" className="btn btn-primary w-full"><CalendarCheck size={18} aria-hidden="true" /> Send enquiry (demo)</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
