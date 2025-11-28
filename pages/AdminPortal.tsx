import React, { useState, useMemo } from 'react';
import { Card, Button, Badge, Input } from '../components/UI';
import { 
  Users, CreditCard, Settings, FileText, Download, Check, X, Printer, 
  Award, PenTool, Upload, Trash2, Search, MoreHorizontal, UserPlus, 
  DollarSign, Briefcase, Edit3, Plus, ArrowLeft, MoveRight, UserCheck, ArrowUp, ArrowDown, AlertCircle, List
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useContent, Post, FormField } from '../context/ContentContext';

// --- MOCK DATA INITIALIZATION ---
const INITIAL_CLASSES = [
  { id: 'CLS001', name: 'Hifz Level 1', section: 'Boys A', capacity: 20, enrolled: 18, teacher: 'Ustadh Ali' },
  { id: 'CLS002', name: 'Hifz Level 1', section: 'Girls A', capacity: 20, enrolled: 19, teacher: 'Malama Fatima' },
  { id: 'CLS003', name: 'Hifz Level 2', section: 'Boys A', capacity: 25, enrolled: 12, teacher: 'Ustadh Usman' },
  { id: 'CLS004', name: 'Pre-Hifz', section: 'Mixed', capacity: 30, enrolled: 25, teacher: 'Ustadh Ibrahim' },
  { id: 'CLS005', name: 'Islamiyyah 1', section: 'A', capacity: 35, enrolled: 30, teacher: 'Sheikh Umar' },
];

const INITIAL_STUDENTS = [
  { id: 'MUKL/2024/001', name: 'Abdullah Ibrahim', class: 'Hifz Level 1', status: 'Active', feeStatus: 'Paid' },
  { id: 'MUKL/2024/002', name: 'Yusuf Ali', class: 'Hifz Level 1', status: 'Active', feeStatus: 'Pending' },
  { id: 'MUKL/2024/003', name: 'Fatima Umar', class: 'Islamiyyah 1', status: 'Active', feeStatus: 'Paid' },
  { id: 'MUKL/2024/004', name: 'Zainab Musa', class: 'Hifz Level 1', status: 'Inactive', feeStatus: 'Paid' },
  { id: 'MUKL/2024/005', name: 'Omar Farouk', class: 'Hifz Level 2', status: 'Active', feeStatus: 'Overdue' },
  { id: 'MUKL/2024/006', name: 'Amira Sani', class: 'Hifz Level 1', status: 'Active', feeStatus: 'Paid' },
];

const INITIAL_STAFF = [
  { id: 'STF/001', name: 'Sheikh Umar', role: 'Principal', department: 'Administration', phone: '+123 456 7890' },
  { id: 'STF/002', name: 'Ustadh Ali', role: 'Teacher', department: 'Hifz Dept', phone: '+123 456 7891' },
  { id: 'STF/003', name: 'Dr. Ahmed', role: 'Exams Officer', department: 'Academics', phone: '+123 456 7892' },
  { id: 'STF/004', name: 'Hajiya Amina', role: 'Bursar', department: 'Finance', phone: '+123 456 7893' },
];

const INITIAL_TRANSACTIONS = [
  { id: 'TRX-8901', student: 'Abdullah Ibrahim', type: 'Tuition Fee', amount: 50000, date: '2024-05-20', status: 'Success' },
  { id: 'TRX-8902', student: 'Yusuf Ali', type: 'Book Fee', amount: 15000, date: '2024-05-19', status: 'Pending' },
  { id: 'TRX-8903', student: 'Fatima Umar', type: 'Uniform', amount: 25000, date: '2024-05-18', status: 'Success' },
  { id: 'TRX-8904', student: 'Omar Farouk', type: 'Exam Fee', amount: 5000, date: '2024-05-17', status: 'Failed' },
];

const chartData = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 2000 },
  { name: 'Apr', revenue: 2780 },
  { name: 'May', revenue: 1890 },
  { name: 'Jun', revenue: 2390 },
];

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { 
    content, updateHero, updateAbout, addPost, deletePost, 
    updateAdmissionSettings, updateApplicationStatus 
  } = useContent();

  const { applications } = content; // Using applications from context

  // --- DATA STATE ---
  const [classesList, setClassesList] = useState(INITIAL_CLASSES);
  const [studentsList, setStudentsList] = useState(INITIAL_STUDENTS);
  const [staffList, setStaffList] = useState(INITIAL_STAFF);
  
  // --- UI STATE ---
  const [cmsTab, setCmsTab] = useState<'pages' | 'posts'>('pages');
  const [newPost, setNewPost] = useState<Partial<Post>>({ title: '', category: 'News', content: '' });
  const [isAddingPost, setIsAddingPost] = useState(false);
  const [isAddingClass, setIsAddingClass] = useState(false);
  const [newClassData, setNewClassData] = useState({ name: '', section: '', capacity: '', teacher: '' });
  const [rosterSortConfig, setRosterSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });
  const [admissionsTab, setAdmissionsTab] = useState<'list' | 'config'>('list');
  
  // --- MODAL & ACTION STATE ---
  const [viewingClassId, setViewingClassId] = useState<string | null>(null); // For Master-Detail view in Classes
  
  const [transferModal, setTransferModal] = useState<{isOpen: boolean, studentId: string | null, currentClass: string}>({isOpen: false, studentId: null, currentClass: ''});
  const [approveModal, setApproveModal] = useState<{isOpen: boolean, appId: string | null, appName: string}>({isOpen: false, appId: null, appName: ''});
  const [assignTeacherModal, setAssignTeacherModal] = useState<{isOpen: boolean, staffId: string | null, staffName: string}>({isOpen: false, staffId: null, staffName: ''});
  
  const [selectedTargetClass, setSelectedTargetClass] = useState('');

  // --- FORM BUILDER STATE ---
  const [newField, setNewField] = useState<Partial<FormField>>({ label: '', type: 'text', required: true });

  // --- CERTIFICATE STATE ---
  const [certConfig, setCertConfig] = useState({
    title: 'CERTIFICATE OF HIFZ COMPLETION',
    subtitle: 'Madrasatu Umar Bn Khaddab Litahfidhul Qur\'anil Kareem',
    body: 'This is to certify that\n\n{student_name}\n\nHas successfully completed the memorization of the Holy Quran with Tajweed rules and has passed the final examination with excellence.',
    borderStyle: 'border-double',
    signatures: {
      principal: true,
      coordinator: true,
      examOfficer: false
    }
  });

  const [signatures, setSignatures] = useState([
    { id: 'sig1', role: 'Principal', name: 'Sheikh Umar', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Signature_sample.svg/1200px-Signature_sample.svg.png', assignedDocs: ['Admission Letter', 'Hifz Certificate'] },
    { id: 'sig2', role: 'Hifz Coordinator', name: 'Ustadh Ali', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Signature_of_John_Hancock.svg/1200px-Signature_of_John_Hancock.svg.png', assignedDocs: ['Hifz Certificate'] },
    { id: 'sig3', role: 'Exams Officer', name: 'Dr. Ahmed', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Signature_of_D._H._Lawrence.svg/1200px-Signature_of_D._H._Lawrence.svg.png', assignedDocs: ['Result Sheet'] },
  ]);

  // --- ACTION HANDLERS ---

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPost.title && newPost.content) {
      addPost({
        title: newPost.title,
        category: newPost.category as any,
        content: newPost.content,
        date: new Date().toISOString().split('T')[0],
        image: 'https://picsum.photos/400/250?random=' + Math.floor(Math.random() * 100)
      });
      setNewPost({ title: '', category: 'News', content: '' });
      setIsAddingPost(false);
    }
  };

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (newClassData.name && newClassData.capacity) {
      const newClass = {
        id: `CLS${Math.floor(Math.random() * 1000)}`,
        name: newClassData.name,
        section: newClassData.section || 'A',
        capacity: parseInt(newClassData.capacity),
        enrolled: 0,
        teacher: newClassData.teacher || 'Unassigned'
      };
      setClassesList([...classesList, newClass]);
      setNewClassData({ name: '', section: '', capacity: '', teacher: '' });
      setIsAddingClass(false);
    }
  };

  const handleDeleteClass = (id: string) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      setClassesList(classesList.filter(c => c.id !== id));
    }
  };

  const handleSort = (key: string) => {
    setRosterSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // 1. APPROVE ADMISSION & ASSIGN CLASS
  const handleApproveClick = (app: any) => {
     setApproveModal({ isOpen: true, appId: app.id, appName: app.applicantName });
     setSelectedTargetClass(classesList[0]?.name || '');
  };

  const confirmApproval = () => {
     if (!approveModal.appId) return;

     // 1. Create Student Record
     const newStudent = {
        id: `MUKL/2024/${Math.floor(Math.random() * 9000) + 1000}`,
        name: approveModal.appName,
        class: selectedTargetClass,
        status: 'Active',
        feeStatus: 'Pending'
     };
     setStudentsList([newStudent, ...studentsList]);

     // 2. Update Application Status via Context
     updateApplicationStatus(approveModal.appId, 'Approved');

     // 3. Update Class Enrollment Count
     setClassesList(classesList.map(cls => 
        cls.name === selectedTargetClass ? { ...cls, enrolled: cls.enrolled + 1 } : cls
     ));

     // Close Modal
     setApproveModal({ isOpen: false, appId: null, appName: '' });
  };

  const handleRejectClick = (appId: string) => {
     if(window.confirm("Are you sure you want to reject this application?")) {
        updateApplicationStatus(appId, 'Rejected');
     }
  }

  // 2. TRANSFER STUDENT
  const handleTransferClick = (student: any) => {
     setTransferModal({ isOpen: true, studentId: student.id, currentClass: student.class });
     setSelectedTargetClass(classesList.find(c => c.name !== student.class)?.name || '');
  };

  const confirmTransfer = () => {
     if (!transferModal.studentId) return;

     // 1. Update Student Class
     setStudentsList(studentsList.map(s => 
        s.id === transferModal.studentId ? { ...s, class: selectedTargetClass } : s
     ));

     // 2. Update Class Counts (Simple decrement/increment based on names)
     setClassesList(classesList.map(cls => {
        if (cls.name === transferModal.currentClass) return { ...cls, enrolled: cls.enrolled - 1 };
        if (cls.name === selectedTargetClass) return { ...cls, enrolled: cls.enrolled + 1 };
        return cls;
     }));

     setTransferModal({ isOpen: false, studentId: null, currentClass: '' });
  };

  // 3. ASSIGN TEACHER TO CLASS
  const handleAssignTeacherClick = (staff: any) => {
     setAssignTeacherModal({ isOpen: true, staffId: staff.id, staffName: staff.name });
     setSelectedTargetClass(classesList[0]?.name || '');
  };

  const confirmTeacherAssignment = () => {
     setClassesList(classesList.map(cls => 
        cls.name === selectedTargetClass ? { ...cls, teacher: assignTeacherModal.staffName } : cls
     ));
     setAssignTeacherModal({ isOpen: false, staffId: null, staffName: '' });
  };

  // Admission Config Handlers
  const addFormField = () => {
    if (newField.label) {
      const field: FormField = {
        id: `f${Date.now()}`,
        label: newField.label,
        type: newField.type || 'text',
        required: newField.required || false,
        options: newField.options
      };
      updateAdmissionSettings({
        formFields: [...content.admissionSettings.formFields, field]
      });
      setNewField({ label: '', type: 'text', required: true });
    }
  };

  const removeFormField = (id: string) => {
    updateAdmissionSettings({
      formFields: content.admissionSettings.formFields.filter(f => f.id !== id)
    });
  };

  // Helpers for Certs
  const handleCertChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCertConfig({ ...certConfig, [e.target.name]: e.target.value });
  };

  const toggleSignature = (key: keyof typeof certConfig.signatures) => {
    setCertConfig({
      ...certConfig,
      signatures: { ...certConfig.signatures, [key]: !certConfig.signatures[key] }
    });
  };

  const handleDocAssignment = (sigId: string, doc: string) => {
    setSignatures(signatures.map(sig => {
      if (sig.id === sigId) {
        const newDocs = sig.assignedDocs.includes(doc) 
          ? sig.assignedDocs.filter(d => d !== doc)
          : [...sig.assignedDocs, doc];
        return { ...sig, assignedDocs: newDocs };
      }
      return sig;
    }));
  };

  return (
    <div className="space-y-6 relative">
      {/* --- MODALS --- */}
      
      {/* 1. APPROVE ADMISSION MODAL */}
      {approveModal.isOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md">
               <h3 className="text-xl font-bold font-serif mb-4 text-islamic-primary">Approve Admission</h3>
               <p className="text-gray-600 mb-4">Select a class to assign <strong>{approveModal.appName}</strong>:</p>
               <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assign Class</label>
                  <select 
                     className="w-full border rounded p-2"
                     value={selectedTargetClass}
                     onChange={(e) => setSelectedTargetClass(e.target.value)}
                  >
                     {classesList.map(cls => (
                        <option key={cls.id} value={cls.name}>{cls.name} ({cls.section}) - {cls.enrolled}/{cls.capacity}</option>
                     ))}
                  </select>
               </div>
               <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setApproveModal({isOpen: false, appId: null, appName: ''})}>Cancel</Button>
                  <Button onClick={confirmApproval}>Confirm Approval</Button>
               </div>
            </div>
         </div>
      )}

      {/* 2. TRANSFER STUDENT MODAL */}
      {transferModal.isOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md">
               <h3 className="text-xl font-bold font-serif mb-4 text-islamic-primary">Transfer Student</h3>
               <p className="text-gray-600 mb-4">Move student from <strong>{transferModal.currentClass}</strong> to:</p>
               <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Class</label>
                  <select 
                     className="w-full border rounded p-2"
                     value={selectedTargetClass}
                     onChange={(e) => setSelectedTargetClass(e.target.value)}
                  >
                     {classesList
                        .filter(c => c.name !== transferModal.currentClass)
                        .map(cls => (
                        <option key={cls.id} value={cls.name}>{cls.name} ({cls.section})</option>
                     ))}
                  </select>
               </div>
               <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setTransferModal({isOpen: false, studentId: null, currentClass: ''})}>Cancel</Button>
                  <Button onClick={confirmTransfer}>Transfer Student</Button>
               </div>
            </div>
         </div>
      )}

      {/* 3. ASSIGN TEACHER MODAL */}
      {assignTeacherModal.isOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md">
               <h3 className="text-xl font-bold font-serif mb-4 text-islamic-primary">Assign Teacher to Class</h3>
               <p className="text-gray-600 mb-4">Assign <strong>{assignTeacherModal.staffName}</strong> to lead:</p>
               <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Existing Class</label>
                  <select 
                     className="w-full border rounded p-2"
                     value={selectedTargetClass}
                     onChange={(e) => setSelectedTargetClass(e.target.value)}
                  >
                     {classesList.map(cls => (
                        <option key={cls.id} value={cls.name}>{cls.name} ({cls.section})</option>
                     ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-2">Note: This will replace the current teacher if one is assigned.</p>
               </div>
               <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setAssignTeacherModal({isOpen: false, staffId: null, staffName: ''})}>Cancel</Button>
                  <Button onClick={confirmTeacherAssignment}>Assign Class</Button>
               </div>
            </div>
         </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome back, Admin</p>
        </div>
        <div className="flex gap-2">
           <Button size="sm" variant="outline"><Printer size={16} className="mr-2"/> Report</Button>
           <Button size="sm" variant="primary"><UserPlus size={16} className="mr-2"/> New User</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="-mb-px flex space-x-6 min-w-max">
          {['overview', 'classes', 'students', 'staff', 'admissions', 'finance', 'website', 'certificates', 'settings'].map(tab => (
             <button
               key={tab}
               onClick={() => { setActiveTab(tab); setViewingClassId(null); }}
               className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${activeTab === tab ? 'border-islamic-primary text-islamic-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
             >
               {tab}
             </button>
          ))}
        </nav>
      </div>

      {/* --- WEBSITE CONTENT TAB --- */}
      {activeTab === 'website' && (
        <div className="space-y-6">
          <div className="flex space-x-4 border-b">
            <button onClick={() => setCmsTab('pages')} className={`pb-2 px-4 ${cmsTab === 'pages' ? 'border-b-2 border-islamic-primary font-bold' : ''}`}>General Pages</button>
            <button onClick={() => setCmsTab('posts')} className={`pb-2 px-4 ${cmsTab === 'posts' ? 'border-b-2 border-islamic-primary font-bold' : ''}`}>Publications & News</button>
          </div>

          {cmsTab === 'pages' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Home Page - Hero Section">
                <div className="space-y-4">
                  <Input 
                    label="Main Headline" 
                    value={content.hero.title} 
                    onChange={(e) => updateHero({ title: e.target.value })} 
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subheadline</label>
                    <textarea 
                      className="w-full px-3 py-2 border rounded-md" 
                      rows={3}
                      value={content.hero.subtitle}
                      onChange={(e) => updateHero({ subtitle: e.target.value })}
                    />
                  </div>
                  <Input 
                    label="CTA Button Text" 
                    value={content.hero.ctaText} 
                    onChange={(e) => updateHero({ ctaText: e.target.value })} 
                  />
                  <Button size="sm">Save Changes</Button>
                </div>
              </Card>

              <Card title="Home Page - About Section">
                <div className="space-y-4">
                  <Input 
                    label="Section Title" 
                    value={content.about.title} 
                    onChange={(e) => updateAbout({ title: e.target.value })} 
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description Text</label>
                    <textarea 
                      className="w-full px-3 py-2 border rounded-md" 
                      rows={4}
                      value={content.about.description}
                      onChange={(e) => updateAbout({ description: e.target.value })}
                    />
                  </div>
                  <Button size="sm">Save Changes</Button>
                </div>
              </Card>
            </div>
          )}

          {cmsTab === 'posts' && (
            <div className="space-y-6">
              {!isAddingPost ? (
                <Card title="Manage Publications">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-gray-500">Manage news, announcements, and events that appear on the homepage.</p>
                    <Button onClick={() => setIsAddingPost(true)}><Plus size={16} className="mr-2" /> Add New Post</Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {content.posts.map((post) => (
                          <tr key={post.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{post.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge color={post.category === 'Announcement' ? 'red' : 'blue'}>{post.category}</Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button onClick={() => deletePost(post.id)} className="text-red-600 hover:text-red-900"><Trash2 size={16}/></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              ) : (
                <Card title="Create New Publication">
                  <form onSubmit={handlePostSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input 
                        label="Post Title" 
                        required 
                        value={newPost.title}
                        onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                      />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select 
                          className="w-full px-3 py-2 border rounded-md"
                          value={newPost.category}
                          onChange={(e) => setNewPost({...newPost, category: e.target.value as any})}
                        >
                          <option value="News">News</option>
                          <option value="Announcement">Announcement</option>
                          <option value="Event">Event</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                      <textarea 
                        className="w-full px-3 py-2 border rounded-md" 
                        rows={6} 
                        required
                        value={newPost.content}
                        onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsAddingPost(false)}>Cancel</Button>
                      <Button type="submit">Publish Post</Button>
                    </div>
                  </form>
                </Card>
              )}
            </div>
          )}
        </div>
      )}

      {/* --- OVERVIEW TAB --- */}
      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-l-4 border-l-blue-500">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">Total Students</p>
                  <h3 className="text-2xl font-bold">{studentsList.length + 1200}</h3>
                </div>
                <div className="p-2 bg-blue-100 rounded text-blue-600"><Users size={20} /></div>
              </div>
            </Card>
            <Card className="border-l-4 border-l-green-500">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">Revenue (Monthly)</p>
                  <h3 className="text-2xl font-bold">₦2.4M</h3>
                </div>
                <div className="p-2 bg-green-100 rounded text-green-600"><CreditCard size={20} /></div>
              </div>
            </Card>
            <Card className="border-l-4 border-l-yellow-500">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">Pending Apps</p>
                  <h3 className="text-2xl font-bold">{applications.filter(a => a.status === 'Pending').length}</h3>
                </div>
                <div className="p-2 bg-yellow-100 rounded text-yellow-600"><FileText size={20} /></div>
              </div>
            </Card>
            <Card className="border-l-4 border-l-purple-500">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">Classes</p>
                  <h3 className="text-2xl font-bold">{classesList.length}</h3>
                </div>
                <div className="p-2 bg-purple-100 rounded text-purple-600"><Briefcase size={20} /></div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Financial Overview">
               <div className="h-64">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={chartData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} />
                     <XAxis dataKey="name" />
                     <YAxis />
                     <Tooltip />
                     <Bar dataKey="revenue" fill="#047857" radius={[4, 4, 0, 0]} />
                   </BarChart>
                 </ResponsiveContainer>
               </div>
            </Card>

            <Card title="Recent Applications">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {applications.map((app) => (
                      <tr key={app.id}>
                        <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.applicantName}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm">
                          <Badge color={app.status === 'Approved' ? 'green' : app.status === 'Pending' ? 'yellow' : 'red'}>
                            {app.status}
                          </Badge>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {app.status === 'Pending' && (
                             <button onClick={() => handleApproveClick(app)} className="text-islamic-primary hover:underline">Approve</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-center">
                 <Button variant="outline" size="sm" onClick={() => setActiveTab('admissions')}>View All</Button>
              </div>
            </Card>
          </div>
        </>
      )}

      {/* --- CLASSES TAB --- */}
      {activeTab === 'classes' && (
        <Card title={viewingClassId ? `Class Details: ${classesList.find(c => c.id === viewingClassId)?.name}` : "Class Management"}>
          {viewingClassId ? (
             <div>
                <Button variant="outline" size="sm" onClick={() => setViewingClassId(null)} className="mb-4">
                   <ArrowLeft size={16} className="mr-2"/> Back to Classes
                </Button>
                
                {/* Class Detail Header */}
                {(() => {
                   const cls = classesList.find(c => c.id === viewingClassId)!;
                   const studentsInClass = studentsList.filter(s => s.class === cls.name);
                   
                   // Sorting Logic
                   const sortedStudents = [...studentsInClass].sort((a, b) => {
                      const aValue = a[rosterSortConfig.key as keyof typeof a];
                      const bValue = b[rosterSortConfig.key as keyof typeof b];
                      if (aValue < bValue) return rosterSortConfig.direction === 'asc' ? -1 : 1;
                      if (aValue > bValue) return rosterSortConfig.direction === 'asc' ? 1 : -1;
                      return 0;
                   });

                   return (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                           <div className="p-4 bg-gray-50 rounded border">
                              <p className="text-gray-500 text-sm">Teacher</p>
                              <p className="font-bold text-lg">{cls.teacher}</p>
                           </div>
                           <div className="p-4 bg-gray-50 rounded border">
                              <p className="text-gray-500 text-sm">Enrollment</p>
                              <div className="flex items-center gap-2 mt-1">
                                 <div className="flex-grow bg-gray-200 rounded-full h-2">
                                    <div 
                                       className={`h-2 rounded-full ${cls.enrolled >= cls.capacity ? 'bg-red-500' : 'bg-green-500'}`} 
                                       style={{ width: `${Math.min((cls.enrolled / cls.capacity) * 100, 100)}%` }}
                                    ></div>
                                 </div>
                                 <span className="font-bold text-lg whitespace-nowrap">{cls.enrolled} / {cls.capacity}</span>
                              </div>
                           </div>
                           <div className="p-4 bg-gray-50 rounded border">
                              <p className="text-gray-500 text-sm">Section</p>
                              <p className="font-bold text-lg">{cls.section}</p>
                           </div>
                        </div>

                        <div className="flex justify-between items-center mb-4">
                           <h3 className="font-bold text-lg">Student Roster</h3>
                           <Badge color="blue">{studentsInClass.length} Students</Badge>
                        </div>
                        
                        <div className="overflow-x-auto border rounded-lg">
                           <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                 <tr>
                                    <th 
                                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                                       onClick={() => handleSort('id')}
                                    >
                                       <div className="flex items-center gap-1">Reg Number {rosterSortConfig.key === 'id' && (rosterSortConfig.direction === 'asc' ? <ArrowUp size={12}/> : <ArrowDown size={12}/>)}</div>
                                    </th>
                                    <th 
                                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                                       onClick={() => handleSort('name')}
                                    >
                                       <div className="flex items-center gap-1">Name {rosterSortConfig.key === 'name' && (rosterSortConfig.direction === 'asc' ? <ArrowUp size={12}/> : <ArrowDown size={12}/>)}</div>
                                    </th>
                                    <th 
                                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                                       onClick={() => handleSort('status')}
                                    >
                                       <div className="flex items-center gap-1">Status {rosterSortConfig.key === 'status' && (rosterSortConfig.direction === 'asc' ? <ArrowUp size={12}/> : <ArrowDown size={12}/>)}</div>
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                 </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                 {sortedStudents.length > 0 ? sortedStudents.map(student => (
                                    <tr key={student.id}>
                                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{student.id}</td>
                                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{student.name}</td>
                                       <td className="px-6 py-4 whitespace-nowrap"><Badge color={student.status === 'Active' ? 'green' : 'red'}>{student.status}</Badge></td>
                                       <td className="px-6 py-4 whitespace-nowrap text-right">
                                          <Button size="sm" variant="outline" onClick={() => handleTransferClick(student)}>
                                             <MoveRight size={14} className="mr-2"/> Transfer
                                          </Button>
                                       </td>
                                    </tr>
                                 )) : (
                                    <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">No students enrolled yet.</td></tr>
                                 )}
                              </tbody>
                           </table>
                        </div>
                      </>
                   );
                })()}
             </div>
          ) : (
            <>
               <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
                  <div className="relative w-full md:w-96">
                     <input type="text" placeholder="Search class or teacher..." className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-islamic-primary focus:border-islamic-primary" />
                     <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  </div>
                  <Button onClick={() => setIsAddingClass(true)}><Plus size={18} className="mr-2" /> Add New Class</Button>
               </div>

               {isAddingClass && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                  <h3 className="font-bold text-gray-700 mb-4">Create New Class</h3>
                  <form onSubmit={handleAddClass} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                     <Input 
                        label="Class Name" 
                        placeholder="e.g. Hifz Level 1" 
                        value={newClassData.name} 
                        onChange={e => setNewClassData({...newClassData, name: e.target.value})} 
                        required 
                     />
                     <Input 
                        label="Section" 
                        placeholder="e.g. A" 
                        value={newClassData.section} 
                        onChange={e => setNewClassData({...newClassData, section: e.target.value})} 
                     />
                     <Input 
                        label="Capacity" 
                        type="number" 
                        placeholder="30" 
                        value={newClassData.capacity} 
                        onChange={e => setNewClassData({...newClassData, capacity: e.target.value})} 
                        required 
                     />
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
                        <select 
                           className="w-full px-3 py-2 border rounded-md"
                           value={newClassData.teacher}
                           onChange={e => setNewClassData({...newClassData, teacher: e.target.value})}
                        >
                           <option value="">Select Coordinator</option>
                           {staffList.filter(s => s.role === 'Teacher').map(staff => (
                           <option key={staff.id} value={staff.name}>{staff.name}</option>
                           ))}
                        </select>
                     </div>
                     <div className="md:col-span-4 flex justify-end gap-2 mt-2">
                        <Button type="button" variant="outline" onClick={() => setIsAddingClass(false)}>Cancel</Button>
                        <Button type="submit">Save Class</Button>
                     </div>
                  </form>
                  </div>
               )}

               <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                     <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Section</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned Teacher</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                     {classesList.map((cls) => (
                        <tr key={cls.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cls.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{cls.section}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                           <div className="flex items-center gap-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                 <div 
                                    className={`h-2 rounded-full ${cls.enrolled >= cls.capacity ? 'bg-red-500' : 'bg-green-500'}`} 
                                    style={{ width: `${Math.min((cls.enrolled / cls.capacity) * 100, 100)}%` }}
                                 ></div>
                              </div>
                              <span className="text-xs text-gray-600">{cls.enrolled}/{cls.capacity}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 flex items-center gap-2">
                           <Briefcase size={14} className="text-gray-400"/> {cls.teacher}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                           <button className="text-islamic-primary hover:text-islamic-dark mr-3" title="View Details" onClick={() => setViewingClassId(cls.id)}>View</button>
                           <button className="text-red-500 hover:text-red-700" title="Delete" onClick={() => handleDeleteClass(cls.id)}><Trash2 size={18} /></button>
                        </td>
                        </tr>
                     ))}
                  </tbody>
                  </table>
               </div>
            </>
          )}
        </Card>
      )}

      {/* --- STUDENTS TAB --- */}
      {activeTab === 'students' && (
        <Card title="Student Management">
           <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
              <div className="relative w-full md:w-96">
                <input type="text" placeholder="Search by name, ID or class..." className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-islamic-primary focus:border-islamic-primary" />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
              <Button><UserPlus size={18} className="mr-2" /> Add Student</Button>
           </div>
           
           <div className="overflow-x-auto">
             <table className="min-w-full divide-y divide-gray-200">
               <thead className="bg-gray-50">
                 <tr>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reg Number</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                   <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                 </tr>
               </thead>
               <tbody className="bg-white divide-y divide-gray-200">
                 {studentsList.map((student) => (
                   <tr key={student.id} className="hover:bg-gray-50">
                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.id}</td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.name}</td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.class}</td>
                     <td className="px-6 py-4 whitespace-nowrap">
                       <Badge color={student.status === 'Active' ? 'green' : 'red'}>{student.status}</Badge>
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button size="sm" variant="outline" onClick={() => handleTransferClick(student)}>
                           <MoveRight size={14} className="mr-2"/> Transfer
                        </Button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </Card>
      )}

      {/* --- STAFF TAB --- */}
      {activeTab === 'staff' && (
        <Card title="Staff Directory">
           <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
              <div className="relative w-full md:w-96">
                <input type="text" placeholder="Search staff..." className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-islamic-primary focus:border-islamic-primary" />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
              <Button><UserPlus size={18} className="mr-2" /> Add Staff</Button>
           </div>
           
           <div className="overflow-x-auto">
             <table className="min-w-full divide-y divide-gray-200">
               <thead className="bg-gray-50">
                 <tr>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Staff ID</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                   <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                 </tr>
               </thead>
               <tbody className="bg-white divide-y divide-gray-200">
                 {staffList.map((staff) => (
                   <tr key={staff.id} className="hover:bg-gray-50">
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{staff.id}</td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{staff.name}</td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{staff.role}</td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{staff.department}</td>
                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                       {staff.role === 'Teacher' && (
                          <Button size="sm" variant="outline" onClick={() => handleAssignTeacherClick(staff)}>
                             <UserCheck size={14} className="mr-2"/> Assign Class
                          </Button>
                       )}
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </Card>
      )}

      {/* --- ADMISSIONS TAB --- */}
      {activeTab === 'admissions' && (
        <div className="space-y-6">
          <div className="flex space-x-4 border-b">
             <button onClick={() => setAdmissionsTab('list')} className={`pb-2 px-4 ${admissionsTab === 'list' ? 'border-b-2 border-islamic-primary font-bold' : ''}`}>Applications List</button>
             <button onClick={() => setAdmissionsTab('config')} className={`pb-2 px-4 ${admissionsTab === 'config' ? 'border-b-2 border-islamic-primary font-bold' : ''}`}>Configuration & Settings</button>
          </div>

          {admissionsTab === 'list' && (
            <Card title="Admissions Management">
              <div className="flex gap-4 mb-4">
                 <div className="relative flex-grow">
                   <input type="text" placeholder="Search applications..." className="w-full pl-10 pr-4 py-2 border rounded-md" />
                   <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                 </div>
                 <Button variant="outline">Filter</Button>
              </div>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map((app) => (
                    <tr key={app.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.applicantName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.program}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                         <Badge color={app.status === 'Approved' ? 'green' : app.status === 'Pending' ? 'yellow' : 'red'}>{app.status}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                         <div className="flex justify-end gap-2">
                           {app.status === 'Pending' && (
                              <button onClick={() => handleApproveClick(app)} className="text-green-600 hover:text-green-900 bg-green-50 p-1 rounded" title="Approve & Assign Class"><Check size={16}/></button>
                           )}
                           {app.status === 'Pending' && (
                              <button onClick={() => handleRejectClick(app.id)} className="text-red-600 hover:text-red-900 bg-red-50 p-1 rounded" title="Reject"><X size={16}/></button>
                           )}
                           <button className="text-gray-600 hover:text-gray-900 bg-gray-50 p-1 rounded" title="Download Form"><Download size={16}/></button>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}

          {admissionsTab === 'config' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Application Form Builder */}
                <Card title="Application Form Builder">
                   <div className="space-y-4">
                      <p className="text-sm text-gray-500 mb-4">Customize the fields that appear on the public admission form.</p>
                      
                      <div className="bg-gray-50 rounded p-4 border space-y-2">
                         {content.admissionSettings.formFields.map(field => (
                            <div key={field.id} className="flex justify-between items-center bg-white p-2 border rounded shadow-sm">
                               <div>
                                  <p className="font-medium text-sm">{field.label}</p>
                                  <p className="text-xs text-gray-400 capitalize">{field.type} {field.required ? '*' : ''}</p>
                               </div>
                               <button onClick={() => removeFormField(field.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16}/></button>
                            </div>
                         ))}
                      </div>

                      <div className="border-t pt-4">
                         <h4 className="font-bold text-sm mb-2">Add New Field</h4>
                         <div className="grid grid-cols-2 gap-2 mb-2">
                            <Input placeholder="Field Label" value={newField.label} onChange={e => setNewField({...newField, label: e.target.value})} />
                            <select 
                               className="border rounded p-2 text-sm"
                               value={newField.type}
                               onChange={e => setNewField({...newField, type: e.target.value as any})}
                            >
                               <option value="text">Text Input</option>
                               <option value="number">Number</option>
                               <option value="date">Date</option>
                               <option value="email">Email</option>
                               <option value="tel">Phone</option>
                               <option value="select">Dropdown</option>
                            </select>
                         </div>
                         {newField.type === 'select' && (
                            <div className="mb-2">
                               <Input placeholder="Options (comma separated)" onChange={e => setNewField({...newField, options: e.target.value.split(',')})} />
                            </div>
                         )}
                         <Button size="sm" variant="secondary" onClick={addFormField} disabled={!newField.label} className="w-full">Add Field</Button>
                      </div>
                   </div>
                </Card>
                
                {/* General Settings */}
                <div className="space-y-6">
                   <Card title="Admission Fees">
                      <div className="space-y-4">
                         <Input 
                           label="Application Fee Amount (₦)" 
                           type="number" 
                           value={content.admissionSettings.fee}
                           onChange={e => updateAdmissionSettings({ fee: parseInt(e.target.value) })}
                         />
                         <Button>Save Fee Settings</Button>
                      </div>
                   </Card>

                   <Card title="Admission Letter Template">
                      <div className="space-y-4">
                         <Input 
                            label="School Name on Letter" 
                            value={content.admissionSettings.template.schoolName} 
                            onChange={e => updateAdmissionSettings({ 
                               template: { ...content.admissionSettings.template, schoolName: e.target.value } 
                            })}
                         />
                         <Input 
                            label="Address / Header Info" 
                            value={content.admissionSettings.template.address} 
                            onChange={e => updateAdmissionSettings({ 
                               template: { ...content.admissionSettings.template, address: e.target.value } 
                            })}
                         />
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Letter Body</label>
                            <p className="text-xs text-gray-500 mb-1">Use {'{applicant_name}'}, {'{program}'} as placeholders.</p>
                            <textarea 
                               className="w-full border rounded p-2 h-32"
                               value={content.admissionSettings.template.body}
                               onChange={e => updateAdmissionSettings({ 
                                  template: { ...content.admissionSettings.template, body: e.target.value } 
                               })}
                            />
                         </div>
                         <Button>Save Template</Button>
                      </div>
                   </Card>
                </div>
             </div>
          )}
        </div>
      )}

      {/* --- FINANCE TAB --- */}
      {activeTab === 'finance' && (
        <div className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-green-600 to-green-700 text-white">
                 <div className="flex justify-between items-start">
                    <div>
                       <p className="text-green-100 text-sm mb-1">Total Revenue (YTD)</p>
                       <h3 className="text-3xl font-bold">₦15,450,000</h3>
                    </div>
                    <div className="bg-white/20 p-2 rounded-lg"><DollarSign size={24} /></div>
                 </div>
                 <p className="text-green-100 text-xs mt-4 flex items-center"><ArrowUp size={12} className="mr-1" /> +12% from last year</p>
              </Card>
              <Card>
                 <div className="flex justify-between items-start">
                    <div>
                       <p className="text-gray-500 text-sm mb-1">Outstanding Fees</p>
                       <h3 className="text-3xl font-bold text-red-600">₦2,350,000</h3>
                    </div>
                    <div className="bg-red-100 p-2 rounded-lg text-red-600"><AlertCircle size={24} /></div>
                 </div>
                 <p className="text-gray-400 text-xs mt-4">Across 145 students</p>
              </Card>
              <Card>
                 <div className="flex justify-between items-start">
                    <div>
                       <p className="text-gray-500 text-sm mb-1">Expenses (This Month)</p>
                       <h3 className="text-3xl font-bold text-gray-800">₦850,000</h3>
                    </div>
                    <div className="bg-gray-100 p-2 rounded-lg text-gray-600"><CreditCard size={24} /></div>
                 </div>
                 <p className="text-gray-400 text-xs mt-4">Salaries pending</p>
              </Card>
           </div>

           <Card title="Recent Transactions">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                   <thead className="bg-gray-50">
                      <tr>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                         <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Receipt</th>
                      </tr>
                   </thead>
                   <tbody className="bg-white divide-y divide-gray-200">
                      {INITIAL_TRANSACTIONS.map((trx) => (
                         <tr key={trx.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{trx.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{trx.student}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trx.type}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trx.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800">₦{trx.amount.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                               <Badge color={trx.status === 'Success' ? 'green' : trx.status === 'Pending' ? 'yellow' : 'red'}>{trx.status}</Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                               <button className="text-islamic-primary hover:text-islamic-dark"><Download size={18} /></button>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
              </div>
           </Card>
        </div>
      )}

      {/* --- CERTIFICATES TAB --- */}
      {activeTab === 'certificates' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Certificate Editor */}
          <Card title="Certificate Designer">
            <div className="space-y-4">
              <Input 
                label="Certificate Title" 
                name="title" 
                value={certConfig.title} 
                onChange={handleCertChange} 
              />
              <Input 
                label="Subtitle / School Name" 
                name="subtitle" 
                value={certConfig.subtitle} 
                onChange={handleCertChange} 
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Body Text</label>
                <div className="text-xs text-gray-500 mb-2">Available placeholders: {'{student_name}'}, {'{date}'}, {'{reg_number}'}</div>
                <textarea 
                  name="body"
                  rows={6}
                  value={certConfig.body}
                  onChange={handleCertChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-islamic-primary focus:border-islamic-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Visible Signatures</label>
                <div className="flex gap-4 flex-wrap">
                  <label className="flex items-center space-x-2 border p-2 rounded cursor-pointer hover:bg-gray-50">
                    <input type="checkbox" checked={certConfig.signatures.principal} onChange={() => toggleSignature('principal')} className="text-islamic-primary focus:ring-islamic-primary" />
                    <span className="text-sm">Principal</span>
                  </label>
                  <label className="flex items-center space-x-2 border p-2 rounded cursor-pointer hover:bg-gray-50">
                    <input type="checkbox" checked={certConfig.signatures.coordinator} onChange={() => toggleSignature('coordinator')} className="text-islamic-primary focus:ring-islamic-primary" />
                    <span className="text-sm">Hifz Coordinator</span>
                  </label>
                  <label className="flex items-center space-x-2 border p-2 rounded cursor-pointer hover:bg-gray-50">
                    <input type="checkbox" checked={certConfig.signatures.examOfficer} onChange={() => toggleSignature('examOfficer')} className="text-islamic-primary focus:ring-islamic-primary" />
                    <span className="text-sm">Exams Officer</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button className="w-full"><Award className="mr-2" size={18}/> Save Template</Button>
              </div>
            </div>
          </Card>

          {/* Live Preview */}
          <div className="flex flex-col">
             <div className="flex justify-between items-center mb-2">
                <h3 className="font-serif font-bold text-gray-700">Live Preview</h3>
                <Badge color="blue">Hifz Completion</Badge>
             </div>
             <div className={`bg-white p-8 text-center text-gray-800 shadow-xl relative aspect-[1.414/1] flex flex-col justify-between border-[12px] ${certConfig.borderStyle === 'border-double' ? 'border-double border-islamic-primary/20' : 'border-solid border-islamic-gold'}`}>
                {/* Watermark/Background */}
                <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                   <div className="w-64 h-64 rounded-full border-8 border-gray-900 flex items-center justify-center text-9xl font-serif">M</div>
                </div>
                
                {/* Header */}
                <div className="relative z-10 mt-8">
                   <div className="w-16 h-16 mx-auto bg-islamic-primary text-white rounded-full flex items-center justify-center font-bold text-2xl font-serif border-4 border-islamic-gold mb-4">M</div>
                   <h2 className="text-xs uppercase tracking-widest text-gray-500 mb-1">{certConfig.subtitle}</h2>
                   <h1 className="text-3xl font-serif font-bold text-islamic-primary mb-6">{certConfig.title}</h1>
                </div>

                {/* Body */}
                <div className="relative z-10 px-8">
                   <p className="text-lg leading-relaxed font-serif whitespace-pre-line">
                     {certConfig.body.replace('{student_name}', 'Abdullah Ibrahim')}
                   </p>
                   <p className="mt-4 text-sm text-gray-500">Given this day: {new Date().toLocaleDateString()}</p>
                </div>

                {/* Signatures */}
                <div className="relative z-10 flex justify-around items-end mt-12 mb-8">
                  {certConfig.signatures.principal && (
                     <div className="flex flex-col items-center gap-1">
                        <img src={signatures.find(s => s.role === 'Principal')?.img} alt="Sig" className="h-10 opacity-80" />
                        <div className="w-32 h-px bg-gray-400"></div>
                        <span className="text-xs uppercase font-bold text-gray-500">Principal</span>
                     </div>
                  )}
                  {certConfig.signatures.coordinator && (
                     <div className="flex flex-col items-center gap-1">
                        <img src={signatures.find(s => s.role === 'Hifz Coordinator')?.img} alt="Sig" className="h-10 opacity-80" />
                        <div className="w-32 h-px bg-gray-400"></div>
                        <span className="text-xs uppercase font-bold text-gray-500">Hifz Coordinator</span>
                     </div>
                  )}
                  {certConfig.signatures.examOfficer && (
                     <div className="flex flex-col items-center gap-1">
                         <img src={signatures.find(s => s.role === 'Exams Officer')?.img} alt="Sig" className="h-10 opacity-80" />
                        <div className="w-32 h-px bg-gray-400"></div>
                        <span className="text-xs uppercase font-bold text-gray-500">Exams Officer</span>
                     </div>
                  )}
                </div>
                
                <div className="absolute bottom-4 left-0 right-0 text-center">
                   <p className="text-[10px] text-gray-400">Verify this certificate at mukl.edu/verify/12345</p>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* --- SETTINGS TAB --- */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Registration Number Config">
               <div className="space-y-4">
                 <Input label="Prefix Pattern" defaultValue="MUKL" />
                 <Input label="Separator" defaultValue="/" />
                 <div className="flex gap-4">
                   <Input label="Current Year" defaultValue="2024" className="w-1/2" />
                   <Input label="Start Sequence" defaultValue="001" className="w-1/2" />
                 </div>
                 <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                   Preview: MUKL/2024/001/CLS
                 </div>
                 <Button>Save Configuration</Button>
               </div>
            </Card>
            <Card title="Document Templates">
               <div className="space-y-4">
                 <div className="flex justify-between items-center p-3 border rounded bg-gray-50">
                   <span className="text-sm font-medium">Admission Letter</span>
                   <Button size="sm" variant="outline">Edit</Button>
                 </div>
                 <div className="flex justify-between items-center p-3 border rounded bg-gray-50">
                   <span className="text-sm font-medium">Result Sheet</span>
                   <Button size="sm" variant="outline">Edit</Button>
                 </div>
                 <div className="flex justify-between items-center p-3 border rounded bg-gray-50">
                   <span className="text-sm font-medium">ID Card Template</span>
                   <Button size="sm" variant="outline">Edit</Button>
                 </div>
               </div>
            </Card>
          </div>

          <Card title="Digital Signature Management">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role / Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Signature Preview</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned Documents</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {signatures.map((sig) => (
                    <tr key={sig.id}>
                       <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-bold text-gray-900">{sig.role}</div>
                          <div className="text-sm text-gray-500">{sig.name}</div>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-12 w-32 border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden rounded bg-white">
                             <img src={sig.img} alt="Signature" className="max-h-full max-w-full" />
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                             {['Admission Letter', 'Result Sheet', 'Hifz Certificate'].map(doc => (
                                <label key={doc} className={`inline-flex items-center space-x-1 text-xs px-2 py-1 rounded cursor-pointer transition-colors ${sig.assignedDocs.includes(doc) ? 'bg-islamic-primary/10 text-islamic-primary border border-islamic-primary/20' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                                   <input 
                                     type="checkbox" 
                                     checked={sig.assignedDocs.includes(doc)}
                                     onChange={() => handleDocAssignment(sig.id, doc)}
                                     className="rounded text-islamic-primary focus:ring-islamic-primary h-3 w-3" 
                                   />
                                   <span>{doc}</span>
                                </label>
                             ))}
                          </div>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end gap-2">
                             <Button size="sm" variant="outline" className="px-2 py-1"><Upload size={14} className="mr-1" /> Update</Button>
                             <button className="text-red-500 hover:text-red-700 p-1"><Trash2 size={16} /></button>
                          </div>
                       </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 border-t pt-6 bg-gray-50 -mx-6 -mb-6 px-6 pb-6">
               <h4 className="text-sm font-bold text-gray-700 mb-4">Add New Digital Signature</h4>
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <Input placeholder="Role Title (e.g. Registrar)" />
                  <Input placeholder="Staff Name" />
                  <div className="flex flex-col">
                     <label className="text-sm text-gray-700 mb-1 font-medium">Upload Image</label>
                     <input type="file" className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-islamic-primary/10 file:text-islamic-primary hover:file:bg-islamic-primary/20" />
                  </div>
                  <Button variant="secondary"><Check size={16} className="mr-2"/> Add Signature</Button>
               </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
