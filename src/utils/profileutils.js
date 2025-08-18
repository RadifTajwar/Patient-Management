export const saveDoctorName = (name) => {
  localStorage.setItem('doctorName', name);
};

export const getDoctorName = () => {
  localStorage.getItem('doctorName');
};


