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
                    }, 350);
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
            const presets = {
                'template-professional': '#2c3e50',
                'template-elegant': '#5f9ea0',
                'template-circular': '#3b82f6',
                'template-modern': '#1a1a1a',
                'template-executive': '#1e293b'
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
                this.cvScale = 1;
                setTimeout(() => {
                    const contentHeight = wrapper.scrollHeight;
                    const containerHeight = container.clientHeight;
                    if (contentHeight > containerHeight) {
                        const scale = containerHeight / contentHeight;
                        this.cvScale = Math.max(scale, 0.6);
                    } else {
                        this.cvScale = 1;
                    }
                }, 50);
            });
        },
        async downloadPDF(event) {
            const element = document.querySelector('.a4-page');
            if (!element) return;

            const originalScale = this.cvScale;
            this.cvScale = 1;

            // Button Feedback
            const btn = event?.target?.closest('button');
            const originalHTML = btn ? btn.innerHTML : '';
            if (btn) {
                btn.disabled = true;
                btn.innerHTML = '<i class="fa-solid fa-circle-notch animate-spin"></i> Processing...';
            }

            // Wait for scale reset to settle
            await this.$nextTick();
            await new Promise(r => setTimeout(r, 600));

            const opt = {
                margin: 0,
                filename: `${this.cv.name ? this.cv.name.replace(/\s+/g, '_') : 'My'}_CV.pdf`,
                image: { type: 'jpeg', quality: 1 },
                html2canvas: {
                    scale: 3,
                    useCORS: true,
                    logging: false,
                    letterRendering: true,
                    windowWidth: 794, // Standard A4 width in px at 96 DPI
                    scrollY: 0,
                    scrollX: 0,
                    onclone: (clonedDoc) => {
                        const clonedPage = clonedDoc.querySelector('.a4-page');
                        const clonedWrapper = clonedDoc.querySelector('.template-wrapper');

                        // CRITICAL: Move the page to the very top-left of the clone
                        // This ignores any flex/grid/alignment logic from the original page
                        if (clonedPage) {
                            // Reset all parents to prevent offsets
                            let parent = clonedPage.parentElement;
                            while (parent && parent !== clonedDoc.body) {
                                parent.style.margin = '0';
                                parent.style.padding = '0';
                                parent.style.display = 'block';
                                parent.style.position = 'static';
                                parent.style.transform = 'none';
                                parent = parent.parentElement;
                            }

                            clonedPage.style.position = 'absolute';
                            clonedPage.style.top = '0';
                            clonedPage.style.left = '0';
                            clonedPage.style.margin = '0';
                            clonedPage.style.padding = '0';
                            clonedPage.style.transform = 'none';
                            clonedPage.style.boxShadow = 'none';
                        }

                        if (clonedWrapper) {
                            clonedWrapper.style.transform = 'none';
                            clonedWrapper.style.width = '210mm';
                            clonedWrapper.style.height = '297mm';
                            clonedWrapper.style.margin = '0';
                            clonedWrapper.style.padding = '0';
                        }
                    }
                },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            try {
                await html2pdf().set(opt).from(element).save();
            } catch (err) {
                console.error('PDF Export Error:', err);
                alert('Export failed. Please try again.');
            } finally {
                this.cvScale = originalScale;
                if (btn) {
                    btn.disabled = false;
                    btn.innerHTML = originalHTML;
                }
            }
        }
    },
    mounted() {
        window.exportCVasPDF = (e) => this.downloadPDF(e);
        this.updateTheme();
        this.autoShrink();
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth < 768;
            if (!this.isMobile) {
                this.showPreview = false;
                this.autoShrink();
            }
        });
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