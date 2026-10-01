import React, { useState, useEffect, useMemo } from 'react';
import { Briefcase, CheckCircle, Clock, Plus, Trash2, Search } from 'lucide-react';

export default function App() {
  const [jobs, setJobs] = useState(() => {
    const savedJobs = localStorage.getItem('tracker_jobs');
    return savedJobs ? JSON.parse(savedJobs) : [
      { id: 1, company: 'Google', role: 'Frontend Engineer', status: 'Interviewing', date: '2026-09-28', notes: 'Technical round next Tuesday.' },
      { id: 2, company: 'TCS', role: 'React Developer', status: 'Applied', date: '2026-09-30', notes: 'Referred by my ex-manager.' },
      { id: 3, company: 'Infosys', role: 'Full Stack Developer', status: 'Offered', date: '2026-09-15', notes: 'Received offer letter!' }
    ];
  });

  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('Applied');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    localStorage.setItem('tracker_jobs', JSON.stringify(jobs));
  }, [jobs]);

  const metrics = useMemo(() => {
    const total = jobs.length;
    const applied = jobs.filter(j => j.status === 'Applied').length;
    const interviewing = jobs.filter(j => j.status === 'Interviewing').length;
    const offered = jobs.filter(j => j.status === 'Offered').length;
    const rejected = jobs.filter(j => j.status === 'Rejected').length;
    const positiveResponses = interviewing + offered;
    const responseRate = total > 0 ? Math.round((positiveResponses / total) * 100) : 0;
    return { total, applied, interviewing, offered, rejected, responseRate };
  }, [jobs]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!company || !role) return alert('Please fill out Company and Role');
    const newJob = { id: Date.now(), company, role, status, date, notes };
    setJobs([newJob, ...jobs]);
    setCompany('');
    setRole('');
    setStatus('Applied');
    setNotes('');
  };

  const deleteJob = (id) => {
    setJobs(jobs.filter(job => job.id !== id));
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const styles = {
    container: { fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#f3f4f6', minHeight: '100vh', padding: '24px', color: '#1f2937' },
    header: { marginBottom: '24px' },
    grid3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' },
    card: { backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '16px' },
    mainLayout: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' },
    panel: { backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' },
    input: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', marginTop: '4px', marginBottom: '12px', boxSizing: 'border-box' },
    button: { width: '100%', padding: '12px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
    jobItem: { borderBottom: '1px solid #e5e7eb', padding: '16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
    badge: (status) => {
      const colors = { Applied: '#3b82f6', Interviewing: '#f59e0b', Offered: '#10b981', Rejected: '#ef4444' };
      return { backgroundColor: colors[status] || '#6b7280', color: '#ffffff', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' };
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#1e3a8a' }}>CareerTrack Pro</h1>
        <p style={{ margin: '4px 0 0 0', color: '#6b7280' }}>Manage applications and track metrics</p>
      </div>

      <div style={styles.grid3}>
        <div style={styles.card}>
          <div style={{ backgroundColor: '#dbeafe', padding: '12px', borderRadius: '50%', color: '#2563eb' }}><Briefcase /></div>
          <div><p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>Total Jobs</p><h2 style={{ margin: 0 }}>{metrics.total}</h2></div>
        </div>
        <div style={styles.card}>
          <div style={{ backgroundColor: '#feebc8', padding: '12px', borderRadius: '50%', color: '#dd6b20' }}><Clock /></div>
          <div><p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>Interviewing</p><h2 style={{ margin: 0 }}>{metrics.interviewing}</h2></div>
        </div>
        <div style={styles.card}>
          <div style={{ backgroundColor: '#d1fae5', padding: '12px', borderRadius: '50%', color: '#059669' }}><CheckCircle /></div>
          <div><p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>Success Rate</p><h2 style={{ margin: 0 }}>{metrics.responseRate}%</h2></div>
        </div>
      </div>

      <div style={styles.mainLayout}>
        <div style={styles.panel}>
          <h3 style={{ marginTop: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Plus size={20}/> Log New Application</h3>
          <form onSubmit={handleSubmit}>
            <label>Company Name *</label>
            <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Amazon" style={styles.input} required />

            <label>Job Title / Role *</label>
            <input type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. React Developer" style={styles.input} required />

            <label>Current Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} style={styles.input}>
              <option value="Applied">Applied</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Offered">Offered</option>
              <option value="Rejected">Rejected</option>
            </select>

            <label>Application Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={styles.input} />

            <label>Notes / Follow-up Details</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add links, contacts..." style={{...styles.input, height: '80px', resize: 'none'}} />

            <button type="submit" style={styles.button}>Add Application</button>
          </form>
        </div>

        <div style={styles.panel}>
          <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Application Pipeline</h3>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search company..." style={{ ...styles.input, marginBottom: 0, paddingLeft: '32px' }} />
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '14px', color: '#9ca3af' }} />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ ...styles.input, width: '130px', marginBottom: 0 }}>
              <option value="All">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Offered">Offered</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div style={{ maxHeight: '450px', overflowY: 'auto' }}>
            {filteredJobs.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#9ca3af', marginTop: '40px' }}>No records found.</p>
            ) : (
              filteredJobs.map((job) => (
                <div key={job.id} style={styles.jobItem}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>{job.company}</h4>
                    <p style={{ margin: '2px 0 6px 0', fontSize: '14px', color: '#4b5563' }}>{job.role}</p>
                    <span style={styles.badge(job.status)}>{job.status}</span>
                    {job.notes && <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#6b7280', fontStyle: 'italic' }}>Note: {job.notes}</p>}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#9ca3af' }}>{job.date}</span>
                    <button onClick={() => deleteJob(job.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
