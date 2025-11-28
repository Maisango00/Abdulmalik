import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Users, Award, Clock, ArrowRight, CheckCircle, Download, Megaphone, Search, Printer, FileText } from 'lucide-react';
import { Card, Button, Input, Badge } from '../components/UI';
import { PRAYER_TIMES } from '../constants';
import { useContent } from '../context/ContentContext';
import { Application } from '../types';

// --- Home Page ---
export const Home = () => {
  const { content } = useContent();

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-islamic-primary text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/1920/1080?grayscale&blur=2')] opacity-10 bg-cover bg-center"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight">
            {content.hero.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto mb-10">
            {content.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/admissions">
               <Button size="lg" variant="secondary" className="w-full sm:w-auto shadow-lg shadow-islamic-gold/20">
                 {content.hero.ctaText}
               </Button>
            </Link>
            <Link to="/#about">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-white border-white hover:bg-white/10 hover:text-white">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Stats & Prayer Times */}
      <section className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white border-b-4 border-b-islamic-gold flex items-center p-6 shadow-xl">
             <div className="bg-islamic-primary/10 p-3 rounded-full mr-4 text-islamic-primary">
               <Users size={32} />
             </div>
             <div>
               <h3 className="text-3xl font-bold text-gray-800">1,200+</h3>
               <p className="text-gray-500 text-sm">Students Enrolled</p>
             </div>
          </Card>
          <Card className="bg-white border-b-4 border-b-islamic-primary flex items-center p-6 shadow-xl">
             <div className="bg-islamic-gold/10 p-3 rounded-full mr-4 text-islamic-gold">
               <Award size={32} />
             </div>
             <div>
               <h3 className="text-3xl font-bold text-gray-800">98%</h3>
               <p className="text-gray-500 text-sm">Pass Rate</p>
             </div>
          </Card>
          <Card className="col-span-1 md:col-span-2 bg-islamic-dark text-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-xl font-bold flex items-center gap-2">
                <Clock size={20} className="text-islamic-gold"/> Prayer Times
              </h3>
              <span className="text-xs bg-white/10 px-2 py-1 rounded">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="grid grid-cols-5 gap-2 text-center">
              {Object.entries(PRAYER_TIMES).map(([name, time]) => (
                <div key={name} className="bg-white/5 rounded p-2">
                  <div className="text-xs text-gray-400 uppercase">{name}</div>
                  <div className="font-bold text-sm lg:text-base">{time}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* News & Announcements Section */}
      {content.posts.length > 0 && (
        <section className="container mx-auto px-4 py-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif font-bold text-gray-800 mb-4">Latest Updates</h2>
            <p className="text-gray-600">News, announcements and events from Madrasatu Umar.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.posts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <Badge color={post.category === 'Announcement' ? 'red' : post.category === 'Event' ? 'yellow' : 'blue'}>
                      {post.category}
                    </Badge>
                    <span className="text-xs text-gray-400">{post.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{post.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">{post.content}</p>
                  <Button variant="outline" size="sm" className="w-full">Read More</Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Features/Values - About Section */}
      <section id="about" className="container mx-auto px-4 py-8 bg-islamic-cream/50 rounded-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-gray-800 mb-4">{content.about.title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{content.about.description}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Qualified Instructors', desc: 'Expert Huffaz and certified teachers dedicated to student success.', icon: Users },
            { title: 'Structured Curriculum', desc: 'Balanced approach to Hifz, Tajweed, and Academic subjects.', icon: BookOpen },
            { title: 'Modern Facilities', desc: 'Safe, clean, and technology-enabled learning environments.', icon: CheckCircle },
          ].map((feature, idx) => (
            <div key={idx} className="text-center p-6 bg-white shadow-sm hover:shadow-lg rounded-xl transition-all duration-300">
              <div className="w-16 h-16 mx-auto bg-islamic-cream rounded-full flex items-center justify-center text-islamic-primary mb-4">
                <feature.icon size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// --- Admissions Page ---
export const Admissions = () => {
  const { content, addApplication } = useContent();
  const [activeTab, setActiveTab] = useState<'apply' | 'status'>('apply');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [generatedId, setGeneratedId] = useState('');
  
  // Status Check State
  const [statusSearchId, setStatusSearchId] = useState('');
  const [foundApplication, setFoundApplication] = useState<Application | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [showPrintLetter, setShowPrintLetter] = useState(false);
  const [showPrintForm, setShowPrintForm] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const generateRegNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `MUKL/${year}/${random}/APP`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Create new application object
    const appId = generateRegNumber();
    const newApp: Application = {
       id: appId,
       applicantName: formValues['First Name'] && formValues['Last Name'] 
          ? `${formValues['First Name']} ${formValues['Last Name']}` 
          : 'New Applicant',
       status: 'Pending',
       date: new Date().toISOString().split('T')[0],
       program: formValues['Program Choice'] || 'General',
       formData: formValues // Save the form data for re-printing later
    };

    setTimeout(() => {
      setLoading(false);
      setGeneratedId(appId);
      addApplication(newApp);
      setStep(3);
    }, 2000);
  };

  const checkStatus = (e: React.FormEvent) => {
    e.preventDefault();
    const app = content.applications.find(a => a.id === statusSearchId);
    if (app) {
      setFoundApplication(app);
      if (app.formData) {
        setFormValues(app.formData);
      }
      setStatusMessage('');
    } else {
      setFoundApplication(null);
      setStatusMessage('Application not found. Please check your tracking ID.');
    }
  };

  const triggerPrint = () => {
     window.print();
  };

  const FormPrintView = () => (
     <div className="hidden print:block fixed inset-0 bg-white z-[100] p-8">
        <div className="text-center border-b pb-4 mb-8">
           <h1 className="text-2xl font-bold font-serif">{content.admissionSettings.template.schoolName}</h1>
           <p className="text-gray-600">{content.admissionSettings.template.address}</p>
           <h2 className="text-xl font-bold mt-4 uppercase">Application Form</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
           <div className="border p-4 rounded">
              <span className="text-gray-500 text-sm block">Application ID</span>
              <span className="font-mono text-xl font-bold">{generatedId || foundApplication?.id}</span>
           </div>
           <div className="border p-4 rounded">
              <span className="text-gray-500 text-sm block">Date</span>
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
           </div>
        </div>

        <div className="space-y-6">
           <h3 className="font-bold border-b pb-2">Applicant Details</h3>
           <div className="grid grid-cols-2 gap-6">
              {content.admissionSettings.formFields.map(field => (
                 <div key={field.id}>
                    <span className="text-gray-500 text-sm block">{field.label}</span>
                    <span className="font-medium text-lg border-b block w-full py-1">
                       {formValues[field.label] || "_________________"}
                    </span>
                 </div>
              ))}
           </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-gray-500">
           <p>This is a computer generated document.</p>
        </div>
     </div>
  );

  const LetterPrintView = () => {
    if (!foundApplication) return null;
    const { template } = content.admissionSettings;
    const bodyText = template.body
      .replace('{applicant_name}', foundApplication.applicantName)
      .replace('{program}', foundApplication.program);

    return (
       <div className="hidden print:block fixed inset-0 bg-white z-[100] p-12 leading-relaxed font-serif">
          {/* Header */}
          <div className="flex flex-col items-center mb-12 border-b-2 border-islamic-primary pb-6">
             {/* Logo Placeholder */}
             <div className="w-24 h-24 mb-4 rounded-full border-4 border-islamic-gold bg-islamic-primary text-white flex items-center justify-center font-bold text-3xl">M</div>
             <h1 className="text-3xl font-bold text-islamic-primary uppercase tracking-wide text-center">{template.schoolName}</h1>
             <p className="text-gray-600 text-center max-w-md mt-2">{template.address}</p>
          </div>

          <div className="flex justify-between mb-8 font-sans">
             <div>
                <p><strong>Ref:</strong> {foundApplication.id}/ADM</p>
                <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
             </div>
             <div className="text-right">
                <p><strong>To:</strong> {foundApplication.applicantName}</p>
                <p>Application ID: {foundApplication.id}</p>
             </div>
          </div>

          <h2 className="text-2xl font-bold text-center mb-8 uppercase underline decoration-islamic-gold">Provisional Admission Offer</h2>

          <div className="whitespace-pre-wrap text-lg text-justify mb-16 px-4">
             {bodyText}
          </div>

          <div className="mt-12 flex justify-between items-end px-8">
             <div className="text-center">
                <div className="mb-2 border-b border-black w-48 mx-auto"></div>
                <p className="font-bold">Registrar</p>
             </div>
             <div className="text-center">
                <div className="w-32 h-32 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 mb-2">
                   Stamp
                </div>
             </div>
          </div>
       </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Print Views (Hidden normally, visible when printing) */}
      {(step === 3 || showPrintForm) && <FormPrintView />}
      {showPrintLetter && <LetterPrintView />}

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif font-bold text-islamic-primary mb-4">Admissions Portal</h1>
          <p className="text-gray-600">Start your journey with us or check your application status.</p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
           <button 
             onClick={() => setActiveTab('apply')}
             className={`px-6 py-2 rounded-full font-medium transition-colors ${activeTab === 'apply' ? 'bg-islamic-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
           >
             New Application
           </button>
           <button 
             onClick={() => setActiveTab('status')}
             className={`px-6 py-2 rounded-full font-medium transition-colors ${activeTab === 'status' ? 'bg-islamic-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
           >
             Check Status
           </button>
        </div>

        <Card className="p-8 min-h-[500px]">
          {activeTab === 'apply' ? (
             <>
               {/* Progress Steps */}
               {step < 3 && (
                  <div className="flex justify-center mb-10">
                    {[1, 2].map((s) => (
                      <div key={s} className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= s ? 'bg-islamic-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                          {s}
                        </div>
                        {s !== 2 && <div className={`w-20 h-1 ${step > s ? 'bg-islamic-primary' : 'bg-gray-200'}`}></div>}
                      </div>
                    ))}
                  </div>
               )}

               {step === 1 && (
                 <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                   <h2 className="text-2xl font-serif font-bold mb-6 border-b pb-2">Applicant Information</h2>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                     {content.admissionSettings.formFields.map(field => (
                        <div key={field.id}>
                           <label className="block text-sm font-medium text-gray-700 mb-1">
                              {field.label} {field.required && <span className="text-red-500">*</span>}
                           </label>
                           {field.type === 'select' ? (
                              <select 
                                 name={field.label}
                                 required={field.required}
                                 onChange={handleInputChange}
                                 className="w-full px-3 py-2 border rounded-md focus:ring-islamic-primary focus:border-islamic-primary"
                              >
                                 <option value="">Select...</option>
                                 {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                              </select>
                           ) : (
                              <Input 
                                 type={field.type} 
                                 name={field.label}
                                 required={field.required}
                                 onChange={handleInputChange}
                              />
                           )}
                        </div>
                     ))}
                   </div>
                   <div className="flex justify-end">
                     <Button type="submit">Next: Payment <ArrowRight size={16} className="ml-2" /></Button>
                   </div>
                 </form>
               )}

               {step === 2 && (
                 <form onSubmit={handleSubmit}>
                   <h2 className="text-2xl font-serif font-bold mb-6 border-b pb-2">Payment Details</h2>
                   <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 text-center mb-8">
                     <p className="text-gray-600 mb-2">Total Application Fee</p>
                     <p className="text-4xl font-bold text-islamic-primary mb-4">₦{content.admissionSettings.fee.toLocaleString()}</p>
                     <p className="text-sm text-yellow-800">
                       A non-refundable fee is required to process this application. Secure payment via Paystack.
                     </p>
                   </div>
                   
                   <div className="space-y-4 max-w-md mx-auto">
                      <Input label="Card Number" placeholder="0000 0000 0000 0000" />
                      <div className="grid grid-cols-2 gap-4">
                         <Input label="Expiry Date" placeholder="MM/YY" />
                         <Input label="CVV" placeholder="123" />
                      </div>
                   </div>

                   <div className="flex justify-between items-center mt-8">
                     <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
                     <Button type="submit" disabled={loading}>
                       {loading ? 'Processing...' : `Pay ₦${content.admissionSettings.fee.toLocaleString()}`}
                     </Button>
                   </div>
                 </form>
               )}

               {step === 3 && (
                 <div className="text-center py-8">
                   <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
                     <CheckCircle size={48} />
                   </div>
                   <h2 className="text-3xl font-serif font-bold text-gray-800 mb-2">Alhamdulillah!</h2>
                   <p className="text-gray-600 mb-6">Your application has been submitted successfully.</p>
                   
                   <div className="bg-gray-50 p-6 rounded-lg max-w-md mx-auto mb-8 border border-gray-200">
                     <p className="text-sm text-gray-500 mb-1">Application Tracking ID</p>
                     <p className="text-2xl font-mono font-bold text-islamic-primary tracking-wider">{generatedId}</p>
                     <p className="text-xs text-gray-400 mt-2">Please save this number to track your admission status.</p>
                   </div>

                   <div className="flex flex-col sm:flex-row justify-center gap-4">
                     <Button variant="outline" onClick={triggerPrint}>
                       <Printer size={16} className="mr-2" /> Print Application Form
                     </Button>
                     <Link to="/">
                        <Button>Return Home</Button>
                     </Link>
                   </div>
                 </div>
               )}
             </>
          ) : (
             <div className="max-w-xl mx-auto">
                <h2 className="text-2xl font-serif font-bold mb-6 text-center">Check Application Status</h2>
                <form onSubmit={checkStatus} className="flex gap-2 mb-8">
                   <Input 
                     placeholder="Enter Application Tracking ID (e.g. MUKL/2024/...)" 
                     value={statusSearchId}
                     onChange={(e) => setStatusSearchId(e.target.value)}
                     className="flex-grow"
                   />
                   <Button type="submit"><Search size={20}/></Button>
                </form>

                {statusMessage && (
                   <div className="bg-red-50 text-red-600 p-4 rounded text-center">
                      {statusMessage}
                   </div>
                )}

                {foundApplication && (
                   <div className="border rounded-lg p-6 bg-gray-50 text-center">
                      <h3 className="text-lg font-bold text-gray-800 mb-1">{foundApplication.applicantName}</h3>
                      <p className="text-gray-500 text-sm mb-4">Program: {foundApplication.program}</p>
                      
                      <div className="inline-block px-4 py-2 rounded-full font-bold text-sm mb-6 bg-white border shadow-sm">
                         Status: <span className={`${
                            foundApplication.status === 'Approved' ? 'text-green-600' :
                            foundApplication.status === 'Rejected' ? 'text-red-600' : 'text-yellow-600'
                         }`}>
                            {foundApplication.status}
                         </span>
                      </div>

                      {foundApplication.status === 'Approved' && (
                         <div className="space-y-3">
                            <p className="text-green-700 font-medium">MashaAllah! You have been offered admission.</p>
                            <Button className="w-full" onClick={() => { setShowPrintLetter(true); setTimeout(window.print, 100); }}>
                               <FileText size={18} className="mr-2"/> Print Admission Letter
                            </Button>
                         </div>
                      )}
                      
                      <div className="mt-4 pt-4 border-t">
                         <Button variant="outline" size="sm" onClick={() => { setShowPrintForm(true); setTimeout(window.print, 100); }}>
                            <Printer size={16} className="mr-2"/> Reprint Application Form
                         </Button>
                      </div>
                   </div>
                )}
             </div>
          )}
        </Card>
      </div>
    </div>
  );
};