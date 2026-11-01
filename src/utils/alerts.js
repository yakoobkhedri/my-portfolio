import Swal from 'sweetalert2';

// تشخیص تم فعلی
const isDark = () => document.documentElement.classList.contains('dark');

// کانفیگ پایه
const baseConfig = () => ({
  background: isDark() ? '#1e1b4b' : '#ffffff',
  color: isDark() ? '#ffffff' : '#1f2937',
  confirmButtonColor: '#6366f1',
  cancelButtonColor: '#ef4444',
});

// تأییدیه (Confirm)
// تأییدیه (Confirm)
export const confirmAlert = async (title, text = '', confirmText = 'Yes') => {
  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: confirmText, // ← پارامتر جدید
    cancelButtonText: 'Cancel',
    ...baseConfig(),
  });
  return result.isConfirmed;
};

// موفقیت (Success)
export const successAlert = (title, text = '') => {
  Swal.fire({
    title,
    text,
    icon: 'success',
    timer: 2000,
    showConfirmButton: false,
    ...baseConfig(),
  });
};

// خطا (Error)
export const errorAlert = (title, text = '') => {
  Swal.fire({
    title,
    text,
    icon: 'error',
    ...baseConfig(),
  });
};

// اطلاع (Info)
export const infoAlert = (title, text = '') => {
  Swal.fire({
    title,
    text,
    icon: 'info',
    ...baseConfig(),
  });
};