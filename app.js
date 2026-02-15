const { createApp, ref, computed, watch, onMounted } = Vue;

const app = createApp({
    setup() {
        // --- State ---
        const activeTab = ref('personal'); // personal, experience, unique, projects, education, styles
        
        // Mobile View State
        const isMobile = ref(window.innerWidth < 768);
        const showPreview = ref(false); // Controls mobile toggle (false = editor, true = preview)

        // --- NEW: Template State ---
        const currentTemplate = ref('template-classic'); // template-classic, template-modern, template-minimal

        const cv = ref({
            // Personal
            photo: null,
            name: '',
            title: '',
            email: '',
            phone: '',
            location: '',
            website: '',
            linkedin: '',
            github: '',
            summary: '',
            
            // Background
            experience: [
                { id: 1, company: 'Tech Solutions Inc.', position: 'Senior Developer', start: '2021', end: 'Present', description: 'Leading frontend development team and architectural decisions.' }
            ],
            
            education: [
                { id: 1, institution: 'University of Colombo', degree: 'BSc Computer Science', start: '2016', end: '2020', gpa: '3.8/4.0' }
            ],
            
            // Skills & Languages
            skills: ['React', 'Vue.js', 'Node.js', 'TypeScript', 'Tailwind CSS'],
            languages: [
                { language: 'English', proficiency: 'Native' },
                { language: 'Sinhala', proficiency: 'Native' }
            ],
            
            // Additional
            projects: [
                { name: 'E-Commerce Platform', link: 'github.com/example/shop', description: 'Built a full-stack e-commerce solution using MERN stack.' }
            ],
            
            certifications: [
                { name: 'AWS Certified Solutions Architect', year: '2022', issuer: 'Amazon Web Services' }
            ]
        });

        // Theme Settings
        const themeColor = ref('#ef4444'); // Default Red
        const fontFamily = ref('Inter');
        
        // Helper for raw input of skills
        const skillsInput = ref('React, Vue.js, Node.js, TypeScript, Tailwind CSS');

        // --- Methods ---

        // Image Handling
        const handleImageUpload = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => cv.value.photo = ev.target.result;
                reader.readAsDataURL(file);
            }
        };

        // List Management
        const addItem = (list, item) => {
            cv.value[list].push({ ...item, id: Date.now() });
        };

        const removeItem = (list, index) => {
            cv.value[list].splice(index, 1);
        };
        
        // Skills Logic
        const updateSkills = () => {
            cv.value.skills = skillsInput.value.split(',').map(s => s.trim()).filter(s => s.length > 0);
        };

        // Theme Logic
        const updateTheme = () => {
            const root = document.documentElement;
            root.style.setProperty('--primary', themeColor.value);
            
            // Calculate a lighter shade for backgrounds
            root.style.setProperty('--primary-light', themeColor.value + '20'); // 20 hex = ~12% opacity
        };

        // Print Logic
        const printCV = () => {
            document.title = `${cv.value.name || 'My_CV'} - Resume`;
            setTimeout(() => window.print(), 300);
        };

        // Mobile Logic
        const toggleMobileView = () => {
            showPreview.value = !showPreview.value;
        };

        // Listen for resize to reset view if desktop
        window.addEventListener('resize', () => {
            isMobile.value = window.innerWidth < 768;
            if (!isMobile.value) showPreview.value = false;
        });

        // Watchers
        watch(themeColor, updateTheme);
        
        // Initialize
       
         onMounted(() => {
         updateTheme();

    // PC Mouse wheel Tabs scroll
             const scrollContainer = document.querySelector(".sidebar-tabs");
             if (scrollContainer) {
            scrollContainer.addEventListener("wheel", (evt) => {
             evt.preventDefault();
             scrollContainer.scrollLeft += evt.deltaY;
        });
    }
});

        return {
            activeTab,
            isMobile,
            showPreview,
            currentTemplate, // Added here
            cv,
            skillsInput,
            themeColor,
            fontFamily,
            handleImageUpload,
            addItem,
            removeItem,
            updateSkills,
            printCV,
            toggleMobileView
        };
    }
});

app.mount('#app');