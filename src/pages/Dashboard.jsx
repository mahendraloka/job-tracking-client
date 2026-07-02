import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ applied: 0, interview: 0, ghosting: 0, rejected: 0 });
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);

  const [userName, setUserName] = useState('User');
  const [deletingId, setDeletingId] = useState(null);

  const fetchDashboardData = useCallback(async (pageNumber = 1) => {
    try {
      setLoading(true);
      const [statsRes, jobsRes] = await Promise.all([
        api.get('/dashboard-stats'),
        api.get(`/job-applications?page=${pageNumber}`)
      ]);
      
      setStats(statsRes.data);
      
      const paginationData = jobsRes.data.data; 
      setJobs(paginationData.data);
      setCurrentPage(paginationData.current_page);
      setTotalPages(paginationData.last_page);
      setTotalJobs(paginationData.total);
    } catch (err) {
      console.error("Gagal memuat data dashboard:", err.message || err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedName = localStorage.getItem('user_name');
    if (savedName) {
      setUserName(savedName);
    }
    fetchDashboardData(currentPage);
  }, [currentPage, fetchDashboardData]);

  const confirmDelete = async (id) => {
    try {
      await api.delete(`/job-applications/${id}`);
      setDeletingId(null);
      fetchDashboardData(currentPage); 
    } catch (err) {
      console.error("Gagal menghapus:", err);
      alert("Gagal menghapus data.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Hey, {userName}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Here is a quick look at your job application pipelines.
          </p>
        </div>
      </div>
  
      {/* STATS SECTION */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Applied */}
        <div className="p-5 bg-white dark:bg-[#13151c] border-t-4 border-blue-500 border-x border-b border-slate-200 dark:border-[#1e2130] rounded-2xl flex flex-col justify-between shadow-sm min-h-[120px] transition-colors duration-300">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Applied</span>
            <span className="p-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-500 rounded-lg">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v4m16 0a2 2 0 012 2v3a2 2 0 01-2 2H6a2 2 0 01-2-2v-3a2 2 0 012-2" />
              </svg>
            </span>
          </div>
          <div className="text-4xl font-black text-slate-900 dark:text-white mt-3">{stats.applied}</div>
        </div>
  
        {/* Interview */}
        <div className="p-5 bg-white dark:bg-[#13151c] border-t-4 border-amber-500 border-x border-b border-slate-200 dark:border-[#1e2130] rounded-2xl flex flex-col justify-between shadow-sm min-h-[120px] transition-colors duration-300">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Interview</span>
            <span className="p-1.5 bg-amber-50 dark:bg-amber-500/10 text-amber-500 rounded-lg">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </span>
          </div>
          <div className="text-4xl font-black text-slate-900 dark:text-white mt-3">{stats.interview}</div>
        </div>
  
        {/* Ghosting */}
        <div className="p-5 bg-white dark:bg-[#13151c] border-t-4 border-purple-500 border-x border-b border-slate-200 dark:border-[#1e2130] rounded-2xl flex flex-col justify-between shadow-sm min-h-[120px] transition-colors duration-300">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Ghosted</span>
            <span className="p-1.5 bg-purple-50 dark:bg-purple-500/10 text-purple-500 rounded-lg">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </span>
          </div>
          <div className="text-4xl font-black text-slate-900 dark:text-white mt-3">{stats.ghosting}</div>
        </div>
  
        {/* Rejected */}
        <div className="p-5 bg-white dark:bg-[#13151c] border-t-4 border-rose-500 border-x border-b border-slate-200 dark:border-[#1e2130] rounded-2xl flex flex-col justify-between shadow-sm min-h-[120px] transition-colors duration-300">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Rejected</span>
            <span className="p-1.5 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-lg">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <div className="text-4xl font-black text-slate-900 dark:text-white mt-3">{stats.rejected}</div>
        </div>
      </div>
  
      {/* TABLE CONTAINER */}
      <div className="bg-white dark:bg-[#13151c] border border-slate-200 dark:border-[#1e2130] rounded-2xl p-6 shadow-sm transition-colors duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-950 dark:text-white tracking-tight">Application Log</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              You have logged <span className="text-emerald-500 dark:text-emerald-400 font-extrabold">{totalJobs} applications</span>.
            </p>
          </div>
          <Link 
            to="/add-job" 
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl transition-all active:scale-95 shadow-md shadow-emerald-500/10 flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add New Job
          </Link>
        </div>
  
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400 text-xs font-medium">
            <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
            Loading your data...
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-slate-400 dark:text-slate-500 text-xs text-center py-16 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-[#0d0e12]/40">
            Your pipeline is empty. Time to drop some CVs!
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-xs font-bold tracking-wider">
                    <th className="pb-4 px-2 uppercase">Company</th>
                    <th className="pb-4 px-2 uppercase">Role</th>
                    <th className="pb-4 px-2 uppercase">Date</th>
                    <th className="pb-4 px-2 uppercase">Status</th>
                    <th className="pb-4 px-2 text-right uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50/50 dark:hover:bg-[#22252e]/30 transition-colors duration-150">
                      <td className="py-4 px-2 font-bold text-slate-900 dark:text-slate-200">{job.company_name}</td>
                      <td className="py-4 px-2 text-slate-600 dark:text-slate-300">{job.job_title}</td>
                      <td className="py-4 px-2 text-slate-400 dark:text-slate-500 text-xs">{new Date(job.applied_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className="py-4 px-2">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          job.status === 'Applied' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-500/20' :
                          job.status === 'Interview' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-200 border-amber-200 dark:border-amber-500/20' :
                          job.status === 'Ghosting' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-300 border-purple-200 dark:border-purple-500/20' :
                          'bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-200 dark:border-rose-500/20'
                        }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-right">
                        {deletingId === job.id ? (
                          <div className="flex justify-end gap-2 items-center text-xs">
                            <span className="text-xs text-rose-500 dark:text-rose-400 font-bold mr-1">Sure?</span>
                            <button 
                              onClick={() => confirmDelete(job.id)} 
                              className="px-2 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-[10px] font-extrabold transition-all"
                            >
                              Yes
                            </button>
                            <button 
                              onClick={() => setDeletingId(null)} 
                              className="px-2 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-[10px] font-extrabold transition-all"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-3 items-center">
                            <Link 
                              to={`/edit-job/${job.id}`} 
                              className="p-1 text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
                              title="Edit application"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </Link>
                            <button 
                              onClick={() => setDeletingId(job.id)} 
                              className="p-1 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                              title="Delete application"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
  
            {/* PAGINATION */}
            <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800 mt-6 pt-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 bg-slate-50 dark:bg-[#0d0e12] hover:bg-slate-100 dark:hover:bg-[#22252e] disabled:bg-slate-50 dark:disabled:bg-[#0d0e12] text-slate-700 dark:text-slate-200 disabled:text-slate-400 dark:disabled:text-slate-600 font-bold rounded-lg border border-slate-200 dark:border-slate-800 disabled:border-transparent transition-colors"
                >
                  Prev
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 bg-slate-50 dark:bg-[#0d0e12] hover:bg-slate-100 dark:hover:bg-[#22252e] disabled:bg-slate-50 dark:disabled:bg-[#0d0e12] text-slate-700 dark:text-slate-200 disabled:text-slate-400 dark:disabled:text-slate-600 font-bold rounded-lg border border-slate-200 dark:border-slate-800 disabled:border-transparent transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;