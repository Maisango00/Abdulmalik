import React from 'react';
import { Card, Button, Badge } from '../components/UI';
import { MOCK_STUDENT } from '../constants';
import { BookOpen, Calendar, Download, AlertCircle, CheckCircle, Award, Lock } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const hifzData = [
  { name: 'Memorized', value: 45 },
  { name: 'Remaining', value: 55 },
];
const COLORS = ['#047857', '#e5e7eb'];

export const StudentDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
           <h1 className="text-2xl font-serif font-bold text-gray-800">Assalamu Alaykum, {MOCK_STUDENT.name.split(' ')[0]}</h1>
           <p className="text-gray-500 text-sm">Reg No: {MOCK_STUDENT.regNumber} | Class: {MOCK_STUDENT.class}</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" size="sm">Download ID Card</Button>
        </div>
      </div>

      {MOCK_STUDENT.feesOwed > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-sm flex justify-between items-center">
          <div className="flex items-center">
             <AlertCircle className="text-red-500 mr-3" />
             <div>
               <h3 className="text-red-800 font-bold">Outstanding Fees</h3>
               <p className="text-red-600 text-sm">You have a balance of ₦{MOCK_STUDENT.feesOwed.toLocaleString()}</p>
             </div>
          </div>
          <Button variant="danger" size="sm">Pay Now</Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card title="Hifz Progress">
            <div className="flex flex-col items-center">
               <div className="h-40 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie data={hifzData} innerRadius={40} outerRadius={60} fill="#8884d8" paddingAngle={5} dataKey="value">
                       {hifzData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                     </Pie>
                   </PieChart>
                 </ResponsiveContainer>
               </div>
               <div className="text-center mt-[-90px] mb-8 z-10">
                  <span className="text-2xl font-bold text-gray-800">{MOCK_STUDENT.hifzProgress}%</span>
                  <p className="text-xs text-gray-500">Completed</p>
               </div>
               <div className="mt-8 text-center w-full">
                 <p className="text-sm text-gray-600 mb-2">Current Surah: <span className="font-bold">Al-An'am</span></p>
                 <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-islamic-primary h-2.5 rounded-full" style={{ width: '45%' }}></div>
                 </div>
               </div>
            </div>
         </Card>

         <Card title="Recent Activities" className="md:col-span-2">
            <ul className="space-y-4">
              {[
                { title: 'Tajweed Exam', date: 'Yesterday', type: 'Exam', score: '92/100' },
                { title: 'School Fees Payment', date: '2 days ago', type: 'Finance', score: 'Success' },
                { title: 'Assignment Submission', date: 'Last Week', type: 'Academic', score: 'Pending' },
              ].map((item, idx) => (
                <li key={idx} className="flex justify-between items-center border-b pb-3 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${item.type === 'Exam' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                       {item.type === 'Exam' ? <BookOpen size={16}/> : <CheckCircle size={16}/>}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.date}</p>
                    </div>
                  </div>
                  <Badge>{item.score}</Badge>
                </li>
              ))}
            </ul>
         </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <Card title="Quick Downloads">
            <div className="space-y-2">
               {['Admission Letter', 'Term Report Sheet', 'School Fees Receipt #4092'].map(doc => (
                 <div key={doc} className="flex justify-between items-center p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors cursor-pointer">
                   <div className="flex items-center gap-2">
                     <div className="text-red-500"><FileIcon /></div>
                     <span className="text-sm font-medium text-gray-700">{doc}</span>
                   </div>
                   <Download size={16} className="text-gray-400" />
                 </div>
               ))}
            </div>
         </Card>
         
         <Card title="Certificates & Awards">
             <div className="space-y-3">
                {/* Available Certificate */}
                <div className="flex justify-between items-center p-4 bg-islamic-cream rounded border border-islamic-primary/20">
                   <div className="flex items-center gap-3">
                      <div className="bg-islamic-primary text-white p-2 rounded-full">
                         <Award size={20} />
                      </div>
                      <div>
                         <h4 className="font-bold text-gray-800">Juz 30 Completion</h4>
                         <p className="text-xs text-gray-500">Issued: Jan 15, 2024</p>
                      </div>
                   </div>
                   <Button size="sm" variant="primary">Download</Button>
                </div>

                {/* Locked Certificate */}
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded border border-gray-200 opacity-70">
                   <div className="flex items-center gap-3">
                      <div className="bg-gray-300 text-gray-500 p-2 rounded-full">
                         <Lock size={20} />
                      </div>
                      <div>
                         <h4 className="font-bold text-gray-500">Hifz Completion Certificate</h4>
                         <p className="text-xs text-gray-400">Unlock at 100% progress</p>
                      </div>
                   </div>
                   <Button size="sm" variant="outline" disabled>Locked</Button>
                </div>
             </div>
         </Card>
      </div>
    </div>
  );
};

const FileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);
