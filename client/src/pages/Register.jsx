import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register as registerApi } from '../services/api.js'

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year']

export default function Register() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: '',
    department: '',
    year: YEARS[0],
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (form.password !== form.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  setLoading(true);

  try {

    const response = await registerApi({
      name: form.fullName,
      email: form.email,
      password: form.password,
      college: form.college,
      department: form.department,
      year: form.year,
    });

    alert(response.data.message);

    navigate("/login");

  } catch (error) {

    console.error(error);

    alert(
      error.response?.data?.message ||
      "Registration failed"
    );

  } finally {

    setLoading(false);

  }
};

  return (
    <div className="container-page flex min-h-[calc(100vh-64px)] items-center justify-center py-12 page-enter">
      <div className="card w-full max-w-lg p-8">
        <h1 className="font-display text-2xl font-bold text-slate-900">Create your account</h1>
        <p className="mt-1.5 text-sm text-slate-500">Join the swap — takes less than a minute.</p>

        <form onSubmit={handleSubmit} className="mt-7 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label-field">Full Name</label>
            <input name="fullName" required value={form.fullName} onChange={handleChange} placeholder="Tejal Mehra" className="input-field" />
          </div>

          <div className="sm:col-span-2">
            <label className="label-field">Email</label>
            <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="you@college.edu" className="input-field" />
          </div>

          <div>
            <label className="label-field">Password</label>
            <input type="password" name="password" required value={form.password} onChange={handleChange} placeholder="••••••••" className="input-field" />
          </div>

          <div>
            <label className="label-field">Confirm Password</label>
            <input type="password" name="confirmPassword" required value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" className="input-field" />
          </div>

          <div className="sm:col-span-2">
            <label className="label-field">College</label>
            <input name="college" required value={form.college} onChange={handleChange} placeholder="VNIT Nagpur" className="input-field" />
          </div>

          <div>
            <label className="label-field">Department</label>
            <input name="department" required value={form.department} onChange={handleChange} placeholder="Computer Science" className="input-field" />
          </div>

          <div>
            <label className="label-field">Year</label>
            <select name="year" value={form.year} onChange={handleChange} className="input-field">
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={loading} className="btn-primary sm:col-span-2 mt-2 py-3">
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
