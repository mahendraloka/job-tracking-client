import { useEffect, useState, useActionState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../utils/api';


async function updateJobAction(id, formData) {
  try {
    const company_name = formData.get('company_name');
    const job_title = formData.get('job_title');
    const status = formData.get('status');
    const applied_date = formData.get('applied_date');
    const job_url = formData.get('job_url');
    const notes = formData.get('notes');
    const salary_expectation = formData.get('salary_expectation');

    await api.put(`/job-applications/${id}`, {
      company_name,
      job_title,
      status,
      applied_date,
      job_url: job_url || null,
      notes: notes || null,
      salary_expectation: salary_expectation ? parseInt(salary_expectation) : null
    });

    return { success: true, error: null };
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.message || 'Gagal memperbarui data lowongan.'
    };
  }
}

function EditJob() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialLoading, setInitialLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [formData, setFormData] = useState({
    company_name: '',
    job_title: '',
    status: 'Applied',
    applied_date: '',
    job_url: '',
    salary_expectation: '',
    notes: ''
  });

  useEffect(() => {
    async function fetchJobDetail() {
      try {
        setInitialLoading(true);
        const response = await api.get(`/job-applications/${id}`);
        const job = response.data.data;
        
        setFormData({
          company_name: job.company_name || '',
          job_title: job.job_title || '',
          status: job.status || 'Applied',
          applied_date: job.applied_date ? job.applied_date.substring(0, 10) : '',
          job_url: job.job_url || '',
          salary_expectation: job.salary_expectation || '',
          notes: job.notes || ''
        });
      } catch (err) {
        setFetchError('Data lowongan tidak ditemukan atau Anda tidak memiliki akses.');
      } finally {
        setInitialLoading(false);
      }
    }
    fetchJobDetail();
  }, [id]);

  const [state, formAction, isPending] = useActionState(async (prevState, fData) => {
    const result = await updateJobAction(id, fData);
    if (result.success) {
      navigate('/dashboard');
    }
    return result;
  }, null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-[#121318] flex flex-col items-center justify-center gap-3 text-slate-400 text-sm antialiased">
        <div className="w-5 h-5 border-2 border-amber-200 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-medium">Loading application details...</p>
      </div>
    );
  }
  
  if (fetchError) {
    return (
      <div className="min-h-screen bg-[#121318] text-[#f3f4f6] p-5 md:p-8 flex items-center justify-center font-sans antialiased">
        <div className="max-w-xl w-full bg-[#1a1c23] border border-slate-800 rounded-2xl p-6 text-center shadow-sm">
          <p className="text-rose-400 text-sm font-semibold mb-5">{fetchError}</p>
          <Link 
            to="/dashboard" 
            className="inline-block px-4 py-2 bg-[#121318] hover:bg-[#22252e] text-slate-200 font-bold text-xs rounded-xl border border-slate-800 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121318] text-[#f3f4f6] p-5 md:p-8 font-sans antialiased">
      
      {/* HEADER SECTION */}
      <div className="max-w-xl mx-auto flex justify-between items-center border-b border-slate-800 pb-6 mb-8">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Edit Application</h2>
          <p className="text-xs text-slate-400 mt-1">Update the details of your recruitment stage.</p>
        </div>
        <Link to="/dashboard" className="text-xs font-bold text-slate-400 hover:text-amber-200 transition-colors">
          Cancel
        </Link>
      </div>
  
      {/* FORM CONTAINER */}
      <div className="max-w-xl mx-auto bg-[#1a1c23] border border-slate-800 rounded-2xl p-6 shadow-sm">
        {state?.error && (
          <div className="mb-5 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold rounded-xl text-center">
            {state.error}
          </div>
        )}
  
        <form action={formAction} className="space-y-5 text-sm">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Company Name</label>
            <input 
              type="text" 
              name="company_name" 
              value={formData.company_name} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-3 bg-[#121318] border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-amber-200 transition-colors" 
            />
          </div>
  
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Role / Position</label>
            <input 
              type="text" 
              name="job_title" 
              value={formData.job_title} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-3 bg-[#121318] border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-amber-200 transition-colors" 
            />
          </div>
  
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Status</label>
              <select 
                name="status" 
                value={formData.status} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-3 bg-[#121318] border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-amber-200 transition-colors cursor-pointer"
              >
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Ghosting">Ghosting 👻</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
  
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Date Applied</label>
              <input 
                type="date" 
                name="applied_date" 
                value={formData.applied_date} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-3 bg-[#121318] border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-amber-200 transition-colors" 
              />
            </div>
          </div>
  
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Job URL <span className="text-slate-600 lowercase font-normal">(optional)</span></label>
            <input 
              type="url" 
              name="job_url" 
              value={formData.job_url} 
              onChange={handleChange} 
              className="w-full px-4 py-3 bg-[#121318] border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-amber-200 transition-colors" 
            />
          </div>
  
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Salary Expectation <span className="text-slate-600 lowercase font-normal">(optional)</span></label>
            <input 
              type="number" 
              name="salary_expectation" 
              value={formData.salary_expectation} 
              onChange={handleChange} 
              className="w-full px-4 py-3 bg-[#121318] border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-amber-200 transition-colors" 
            />
          </div>
  
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Notes <span className="text-slate-600 lowercase font-normal">(optional)</span></label>
            <textarea 
              name="notes" 
              rows="4" 
              value={formData.notes} 
              onChange={handleChange} 
              className="w-full px-4 py-3 bg-[#121318] border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-amber-200 transition-colors resize-none" 
            />
          </div>
  
          <button 
            type="submit" 
            disabled={isPending} 
            className="w-full py-3 px-4 bg-amber-200 hover:bg-amber-300 disabled:bg-amber-800 text-slate-950 font-bold rounded-xl transition-colors duration-200 active:scale-[0.99]"
          >
            {isPending ? 'Updating Entry...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditJob;