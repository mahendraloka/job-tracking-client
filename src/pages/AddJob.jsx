import { useActionState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

async function addJobAction(prevState, formData) {
  try {
    const company_name = formData.get('company_name');
    const job_title = formData.get('job_title');
    const status = formData.get('status');
    const applied_date = formData.get('applied_date');
    const job_url = formData.get('job_url');
    const notes = formData.get('notes');
    const salary_expectation = formData.get('salary_expectation');

    await api.post('/job-applications', { 
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
      error: err.response?.data?.message || 'Gagal menambahkan data.' 
    };
  }
}

function AddJob() {
  const navigate = useNavigate();

  const [state, formAction, isPending] = useActionState(async (prevState, formData) => {
    const result = await addJobAction(prevState, formData);
    if (result.success) {
      navigate('/dashboard');
    }
    return result;
  }, null);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">New Application</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Log a new job opportunity into your tracker.</p>
        </div>
        <Link 
          to="/dashboard" 
          className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg transition-colors border border-slate-200 dark:border-transparent"
        >
          Cancel
        </Link>
      </div>
  
      {/* FORM CONTAINER */}
      <div className="bg-white dark:bg-[#13151c] border border-slate-200 dark:border-[#1e2130] rounded-2xl p-6 md:p-8 shadow-sm transition-colors duration-300">
        {state?.error && (
          <div className="mb-5 p-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-xl text-center">
            {state.error}
          </div>
        )}
  
        <form action={formAction} className="space-y-5 text-sm">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Company Name</label>
            <input 
              type="text" 
              name="company_name" 
              required 
              className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0d0e12] border border-slate-200 dark:border-[#1e2130] rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all" 
              placeholder="e.g., PT Maju Mundur" 
            />
          </div>
  
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Role / Position</label>
            <input 
              type="text" 
              name="job_title" 
              required 
              className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0d0e12] border border-slate-200 dark:border-[#1e2130] rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all" 
              placeholder="e.g., Full Stack Developer" 
            />
          </div>
  
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Status</label>
              <select 
                name="status" 
                required 
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0d0e12] border border-slate-200 dark:border-[#1e2130] rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer"
              >
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Ghosting">Ghosting 👻</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
  
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Date Applied</label>
              <input 
                type="date" 
                name="applied_date" 
                required 
                className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0d0e12] border border-slate-200 dark:border-[#1e2130] rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all" 
              />
            </div>
          </div>
  
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Job URL <span className="text-slate-400 dark:text-slate-600 lowercase font-normal">(optional)</span></label>
            <input 
              type="url" 
              name="job_url" 
              className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0d0e12] border border-slate-200 dark:border-[#1e2130] rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all" 
              placeholder="https://linkedin.com/jobs/..." 
            />
          </div>
  
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Salary Expectation <span className="text-slate-400 dark:text-slate-600 lowercase font-normal">(optional)</span></label>
            <input 
              type="number" 
              name="salary_expectation" 
              className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0d0e12] border border-slate-200 dark:border-[#1e2130] rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all" 
              placeholder="e.g., 5000000" 
            />
          </div>
  
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Notes <span className="text-slate-400 dark:text-slate-600 lowercase font-normal">(optional)</span></label>
            <textarea 
              name="notes" 
              rows="4" 
              className="w-full px-4 py-3 bg-slate-50 dark:bg-[#0d0e12] border border-slate-200 dark:border-[#1e2130] rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none" 
              placeholder="Add details like interview stages, tech stack used, or recruiter contacts..."
            ></textarea>
          </div>
  
          <button 
            type="submit" 
            disabled={isPending} 
            className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-800 text-slate-950 font-extrabold rounded-xl transition-all duration-150 active:scale-[0.98] shadow-md shadow-emerald-500/10 cursor-pointer"
          >
            {isPending ? 'Saving Entry...' : 'Save Application'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddJob;