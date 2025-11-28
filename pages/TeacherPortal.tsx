import React from 'react';
import { Card, Button } from '../components/UI';
import { MOCK_TEACHER } from '../constants';
import { Users, BookOpen, Edit, CheckSquare } from 'lucide-react';

export const TeacherDashboard = () => {
  const classes = [
    { name: 'Hifz Class 1', students: 24, attendance: '96%' },
    { name: 'Hifz Class 2', students: 20, attendance: '92%' },
  ];

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-serif font-bold text-gray-800">Welcome, Ustadh {MOCK_TEACHER.name.split(' ')[2]}</h1>
            <p className="text-sm text-gray-500">Employee ID: {MOCK_TEACHER.employeeId}</p>
          </div>
          <Button>Upload Grades</Button>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="My Classes">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {classes.map((cls) => (
                   <div key={cls.name} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                         <h3 className="font-bold text-lg text-islamic-primary">{cls.name}</h3>
                         <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">{cls.attendance} Attendance</span>
                      </div>
                      <p className="text-gray-500 text-sm mb-4">{cls.students} Students Enrolled</p>
                      <div className="flex gap-2">
                         <Button size="sm" variant="outline" className="w-full">Roster</Button>
                         <Button size="sm" variant="primary" className="w-full">Attendance</Button>
                      </div>
                   </div>
                ))}
             </div>
          </Card>

          <Card title="Quick Actions">
             <div className="grid grid-cols-2 gap-4">
                <button className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-gray-50 transition-colors">
                   <div className="bg-blue-100 p-3 rounded-full text-blue-600 mb-3"><CheckSquare size={24}/></div>
                   <span className="font-medium text-gray-700">Mark Attendance</span>
                </button>
                <button className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-gray-50 transition-colors">
                   <div className="bg-yellow-100 p-3 rounded-full text-yellow-600 mb-3"><Edit size={24}/></div>
                   <span className="font-medium text-gray-700">Enter Grades</span>
                </button>
                <button className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-gray-50 transition-colors">
                   <div className="bg-purple-100 p-3 rounded-full text-purple-600 mb-3"><BookOpen size={24}/></div>
                   <span className="font-medium text-gray-700">Lesson Plan</span>
                </button>
                <button className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-gray-50 transition-colors">
                   <div className="bg-green-100 p-3 rounded-full text-green-600 mb-3"><Users size={24}/></div>
                   <span className="font-medium text-gray-700">Student Progress</span>
                </button>
             </div>
          </Card>
       </div>

       <Card title="Pending Grading Queue">
          <table className="min-w-full divide-y divide-gray-200">
             <thead>
                <tr>
                   <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Assessment</th>
                   <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                   <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                   <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-200">
                <tr>
                   <td className="px-4 py-3 text-sm text-gray-900">Surah Al-Baqarah (1-50)</td>
                   <td className="px-4 py-3 text-sm text-gray-500">Hifz 1</td>
                   <td className="px-4 py-3 text-sm text-red-500 font-medium">Today</td>
                   <td className="px-4 py-3 text-sm text-right"><span className="text-yellow-600 bg-yellow-100 px-2 py-1 rounded text-xs">Pending (20/24)</span></td>
                </tr>
                <tr>
                   <td className="px-4 py-3 text-sm text-gray-900">Tajweed Oral Test</td>
                   <td className="px-4 py-3 text-sm text-gray-500">Hifz 2</td>
                   <td className="px-4 py-3 text-sm text-gray-500">Tomorrow</td>
                   <td className="px-4 py-3 text-sm text-right"><span className="text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs">Not Started</span></td>
                </tr>
             </tbody>
          </table>
       </Card>
    </div>
  );
};