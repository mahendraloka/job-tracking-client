import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ applied: 0, interview: 0, ghosting: 0, rejected: 0 });
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 1. STATE BARU: Untuk mengontrol pagination halaman aktif dan total loker
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);

  const [userName, setUserName] = useState('User');

  // Fungsi penarik data dari API Laravel
  const fetchDashboardData = useCallback(async (pageNumber = 1) => {
    try {
      setLoading(true);
      // Menembak endpoint, khusus job-applications kita beri query param ?page=
      const [statsRes, jobsRes] = await Promise.all([
        api.get('/dashboard-stats'),
        api.get(`/job-applications?page=${pageNumber}`)
      ]);
      
      setStats(statsRes.data);
      
      // Menyesuaikan penangkapan struktur object Paginate dari Laravel
      const paginationData = jobsRes.data.data; 
      setJobs(paginationData.data);              // Array list lowongan (hanya 5 baris)
      setCurrentPage(paginationData.current_page); // Halaman saat ini
      setTotalPages(paginationData.last_page);     // Total halaman maksimal
      setTotalJobs(paginationData.total);          // TOTAL KESELURUHAN LOKER DI APPLY
    } catch (err) {
      console.error("Gagal memuat data dashboard:", err.message || err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Memicu fetch data ulang setiap kali state currentPage berubah
  useEffect(() => {
    const savedName = localStorage.getItem('user_name');
    if (savedName) {
      setUserName(savedName);
    }
    fetchDashboardData(currentPage);
  }, [currentPage, fetchDashboardData]);

  // Fungsi untuk Menghapus Data (Delete)
  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data lowongan ini?")) {
      try {
        await api.delete(`/job-applications/${id}`);
        alert("Data lowongan pekerjaan berhasil dihapus.");
        // Ambil data ulang di halaman yang sedang aktif saat ini
        fetchDashboardData(currentPage); 
      } catch (err) {
        console.error("Gagal menghapus:", err);
        alert("Gagal menghapus data.");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#121318] text-[#f3f4f6] p-5 md:p-8 font-sans antialiased selection:bg-emerald-500 selection:text-slate-900">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Hey, {userName} 
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Here is a quick look at your job application pipelines.
          </p>
        </div>
        <button 
          onClick={handleLogout} 
          className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-rose-400 transition-colors duration-200"
        >
          Sign Out
        </button>
      </div>
  
      {/* STATS SECTION (Pastel Muted Tones, Bulat Nyaman, Tanpa Glow Palsu) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Applied - Pastel Biru */}
        <div className="p-5 bg-[#1a1c23] border border-slate-800 rounded-2xl flex flex-col justify-between min-h-[110px]">
          <span className="text-xs font-bold text-blue-300 tracking-wide">Applied</span>
          <div className="text-4xl font-black text-white mt-2">{stats.applied}</div>
        </div>
  
        {/* Interview - Pastel Kuning */}
        <div className="p-5 bg-[#1a1c23] border border-slate-800 rounded-2xl flex flex-col justify-between min-h-[110px]">
          <span className="text-xs font-bold text-amber-200 tracking-wide">Interview</span>
          <div className="text-4xl font-black text-white mt-2">{stats.interview}</div>
        </div>
  
        {/* Ghosting - Pastel Ungu */}
        <div className="p-5 bg-[#1a1c23] border border-slate-800 rounded-2xl flex flex-col justify-between min-h-[110px]">
          <span className="text-xs font-bold text-purple-300 tracking-wide">Ghosting</span>
          <div className="text-4xl font-black text-white mt-2">{stats.ghosting}</div>
        </div>
  
        {/* Rejected - Pastel Merah Muda */}
        <div className="p-5 bg-[#1a1c23] border border-slate-800 rounded-2xl flex flex-col justify-between min-h-[110px]">
          <span className="text-xs font-bold text-rose-300 tracking-wide">Rejected</span>
          <div className="text-4xl font-black text-white mt-2">{stats.rejected}</div>
        </div>
      </div>
  
      {/* TABLE CONTAINER (Clean Minimalist List) */}
      <div className="bg-[#1a1c23] border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Application Log</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              You have sent <span className="text-emerald-400 font-extrabold">{totalJobs} applications</span> so far. Keep going!
            </p>
          </div>
          <Link 
            to="/add-job" 
            className="px-4 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs rounded-xl transition-all duration-200 active:scale-95 shadow-sm"
          >
            + Add New Job
          </Link>
        </div>
  
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400 text-xs font-medium">
            <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
            Loading your data...
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-slate-400 text-xs text-center py-16 border border-dashed border-slate-800 rounded-xl bg-[#121318]/40">
            Your pipeline is empty. Time to drop some CVs!
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-xs font-bold tracking-wide">
                    <th className="pb-4 px-2">Company</th>
                    <th className="pb-4 px-2">Role</th>
                    <th className="pb-4 px-2">Date</th>
                    <th className="pb-4 px-2">Status</th>
                    <th className="pb-4 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-[#22252e]/40 transition-colors duration-150">
                      <td className="py-4 px-2 font-bold text-slate-200">{job.company_name}</td>
                      <td className="py-4 px-2 text-slate-300">{job.job_title}</td>
                      <td className="py-4 px-2 text-slate-400 text-xs">{new Date(job.applied_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className="py-4 px-2">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          job.status === 'Applied' ? 'bg-blue-500/10 text-blue-300 border-blue-500/20' :
                          job.status === 'Interview' ? 'bg-amber-500/10 text-amber-200 border-amber-500/20' :
                          job.status === 'Ghosting' ? 'bg-purple-500/10 text-purple-300 border-purple-200/20' :
                          'bg-rose-500/10 text-rose-300 border-rose-500/20'
                        }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-right">
                        <div className="flex justify-end gap-4 text-xs font-bold">
                          <Link to={`/edit-job/${job.id}`} className="text-slate-400 hover:text-amber-200 transition-colors">
                            Edit
                          </Link>
                          <button onClick={() => handleDelete(job.id)} className="text-slate-500 hover:text-rose-400 transition-colors">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
  
            {/* CASUAL PAGINATION */}
            <div className="flex justify-between items-center border-t border-slate-800 mt-6 pt-4 text-xs text-slate-400 font-medium">
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 bg-[#121318] hover:bg-[#22252e] disabled:bg-[#121318] text-slate-200 disabled:text-slate-600 font-bold rounded-lg border border-slate-800 disabled:border-transparent transition-colors"
                >
                  Prev
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 bg-[#121318] hover:bg-[#22252e] disabled:bg-[#121318] text-slate-200 disabled:text-slate-600 font-bold rounded-lg border border-slate-800 disabled:border-transparent transition-colors"
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