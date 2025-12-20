
import React from 'react';

const Profile: React.FC = () => {
  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-sky-50 p-8">
      <h3 className="font-extrabold text-slate-800 text-xl tracking-tighter">Profile Settings</h3>
      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Manage your account</p>
      <div className="mt-6">
        <p>Profile settings will be displayed here.</p>
      </div>
    </div>
  );
};

export default Profile;
