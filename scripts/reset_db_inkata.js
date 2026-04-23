const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('/Users/user/Literasi AI/inkata_resurrection/.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);

const supabaseUrl = urlMatch[1].trim();
const supabaseKey = keyMatch[1].trim();

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
   const { data: teachers } = await supabase.from('teachers').select('*');
   const teacherInfo = (teachers && teachers.length > 0) ? teachers[0] : null;
   const school_id = teacherInfo ? teacherInfo.school_id : null;

   if (!school_id) {
       console.log("No teachers/schools found. DB wipe canceled to prevent orphaned data.");
       return;
   }

   console.log(`[+] Mengidentifikasi sekolah: ${school_id}`);

   if (school_id) {
      const { data: students } = await supabase.from('students').select('id').eq('school_id', school_id);
      if (students && students.length > 0) {
         const studentIds = students.map(s => s.id);
         console.log(`[~] Menghapus ${studentIds.length} portofolio dan siswa historikal...`);
         
         await supabase.from('assessments').delete().in('student_id', studentIds);
         await supabase.from('students').delete().in('id', studentIds);
      }
   }

   console.log("[+] Menyusun Ahmad (Wacana), Budi (Komunikasi), dan Caca (Bunyi)...");
   const { data: newStudents, error: insertError } = await supabase.from('students').insert([
       { name: "Ahmad", grade_level: "SD", room: "1", school_id: school_id },
       { name: "Budi", grade_level: "SD", room: "3", school_id: school_id },
       { name: "Caca", grade_level: "SD", room: "5", school_id: school_id }
   ]).select('*');

   if (insertError) {
      console.log("Error inserting students:", insertError);
      return;
   }

   await supabase.from('assessments').insert([
       { 
         student_id: newStudents.find(s => s.name === "Ahmad").id, score: 87, literacy_phase: "Fase Wacana", 
         vowels: 100, diction: 80, syntax: 90, logic: 85, spelling: 90,
         feedback_notes: "Ahmad menembus standar kompetensi paragraf wacana dengan saltik hanya 1 letak.", image_url: null 
       },
       { 
         student_id: newStudents.find(s => s.name === "Budi").id, score: 65, literacy_phase: "Fase Komunikasi", 
         vowels: 90, diction: 70, syntax: 60, logic: 65, spelling: 55,
         feedback_notes: "Budi berhasil memaparkan kalimat panjang (6 kalimat) namun masih meraba hubungan kohesi logis antarkalimat.", image_url: null 
       },
       { 
         student_id: newStudents.find(s => s.name === "Caca").id, score: 45, literacy_phase: "Fase Bunyi", 
         vowels: 60, diction: 40, syntax: 40, logic: 30, spelling: 20,
         feedback_notes: "Deteksi bottleneck Kelas 5-Bunyi. Menemukan saltik dan kapital salah lebih dari 5 kali.", image_url: null 
       }
   ]);

   console.log("[✔] Database berhasil diregenerasi secara sempurna.");
}

run();
