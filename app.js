const { createApp } = Vue;

createApp({
    data() {
        return {
            isMobile: window.innerWidth < 768,
            showPreview: false,
            activeTab: 'templates',
            themeColor: '#ef4444',
            currentTemplate: 'template-professional',
            showTemplateSelector: false,
            cvScale: 1,
            skillsInput: 'React, Vue.js, Node.js, TypeScript, Tailwind CSS',
            cv: {
                photo: null,
                name: 'JOHN DOE',
                title: 'Software Engineer',
                summary: 'Experienced software engineer with a strong background in developing scalable web applications and working with cross-functional teams to deliver high-quality software solutions.',
                email: 'john.doe@example.com',
                phone: '+1 234 567 890',
                location: 'New York, USA',
                linkedin: 'linkedin.com/in/johndoe',
                github: 'github.com/johndoe',
                website: 'johndoe.com',
                experience: [
                    { company: 'Tech Corp Inc.', position: 'Senior Developer', start: '2020', end: 'Present', description: 'Led the development of a cloud-based SaaS platform used by over 50k users.' },
                    { company: 'WebStudio', position: 'Junior Developer', start: '2018', end: '2020', description: 'Collaborated with designers to implement responsive user interfaces.' }
                ],
                education: [
                    { institution: 'State University', degree: 'BSc in Computer Science', start: '2014', end: '2018' }
                ],
                projects: [
                    { name: 'E-commerce Dashboard', description: 'A comprehensive dashboard for managing online store inventory and sales analytics.' }
                ],
                certifications: [
                    { name: 'Certified Cloud Practitioner', issuer: 'AWS', year: '2022' }
                ],
                skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'],
                languages: [
                    { language: 'English', proficiency: 'Native' },
                    { language: 'Spanish', proficiency: 'Intermediate' }
                ]
            }
        }
    },
    watch: {
        themeColor() {
            this.updateTheme();
        },
        activeTab() {
            this.scrollToActiveTab();
        },
        cv: {
            handler() {
                this.autoShrink();
            },
            deep: true
        }
    },
    methods: {
        scrollToActiveTab() {
            this.$nextTick(() => {
                const activeBtn = document.querySelector('.tab-btn.active');
                const container = document.querySelector('.sidebar-tabs');
                if (activeBtn && container) {
                    const containerWidth = container.offsetWidth;
                    const btnWidth = activeBtn.offsetWidth;
                    const btnLeft = activeBtn.offsetLeft;

                    // Center the button in the container
                    container.scrollTo({
                        left: btnLeft - (containerWidth / 2) + (btnWidth / 2),
                        behavior: 'smooth'
                    });
                }
            });
        },
        toggleMobileView() {
            this.showPreview = !this.showPreview;
            if (this.showPreview) {
                this.$nextTick(() => {
                    setTimeout(() => {
                        this.autoShrink();
                    }, 350); // Wait for transition
                });
            }
        },
        handleImageUpload(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.cv.photo = e.target.result;
                    this.autoShrink();
                };
                reader.readAsDataURL(file);
            }
        },
        applyLayout(template) {
            this.currentTemplate = template;
            this.showTemplateSelector = false;

            // Apply Premium Presets
            const presets = {
                'template-professional': '#2c3e50',
                'template-elegant': '#5f9ea0',
                'template-circular': '#3b82f6',
                'template-modern': '#1a1a1a'
            };
            if (presets[template]) this.themeColor = presets[template];

            this.autoShrink();
        },
        updateSkills() {
            this.cv.skills = this.skillsInput
                .split(',')
                .map(s => s.trim())
                .filter(s => s !== '');
            this.autoShrink();
        },
        updateTheme() {
            const root = document.documentElement;
            root.style.setProperty('--primary', this.themeColor);
            root.style.setProperty('--primary-light', this.themeColor + '20');
        },
        autoShrink() {
            this.$nextTick(() => {
                const wrapper = document.querySelector('.template-wrapper');
                const container = document.querySelector('.a4-page');
                if (!wrapper || !container) return;

                // Reset scale to measure true height
                // We set width explicitly to avoid width distortion on scale reset
                this.cvScale = 1;

                setTimeout(() => {
                    const contentHeight = wrapper.scrollHeight;
                    const containerHeight = container.clientHeight;

                    if (contentHeight > containerHeight) {
                        const scale = containerHeight / contentHeight;
                        this.cvScale = Math.max(scale, 0.6); // Min scale 0.6
                    } else {
                        this.cvScale = 1;
                    }
                }, 50);
            });
        }
    },
    mounted() {
        this.updateTheme();
        this.autoShrink();
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth < 768;
            if (!this.isMobile) {
                this.showPreview = false;
                this.autoShrink();
            }
        });

        // Horizontal scroll for tabs
        const tabsContainer = document.querySelector('.sidebar-tabs');
        if (tabsContainer) {
            tabsContainer.addEventListener('wheel', (e) => {
                if (e.deltaY !== 0) {
                    e.preventDefault();
                    tabsContainer.scrollLeft += e.deltaY;
                }
            });
        }
    }
}).mount('#app');