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
            _shrinkTimer: null,
            skillsInput: 'HTML, CSS, JavaScript, Vue.js, Node.js, PHP, MySQL, Git',
            cv: {
                photo: null,
                name: 'ALEXANDER HAMILTON',
                title: 'Full Stack Web Developer & UI/UX Designer',
                summary: 'Highly motivated and detail-oriented Full Stack Developer with over 5 years of experience in building robust web applications. Expert in modern JavaScript frameworks like Vue.js and React, with a deep understanding of backend systems using Node.js and Python. Passionate about creating seamless user experiences and optimizing application performance.',
                email: 'alexander.hamilton@example.com',
                phone: '+1 234 567 890',
                location: 'San Francisco, CA',
                linkedin: 'linkedin.com/in/alexanderhamilton',
                github: 'github.com/alexanderhamilton',
                website: 'alexander.dev',
                experience: [
                    {
                        company: 'Innovative Solutions PLC',
                        position: 'Senior Lead Developer',
                        start: '2021',
                        end: 'Present',
                        description: 'Architected and implemented a high-traffic e-commerce platform handling over 100k daily active users. Optimized database queries reducing load times by 40%. Led a team of 12 developers using Agile methodologies.'
                    },
                    {
                        company: 'Creative Tech Studio',
                        position: 'Full Stack Developer',
                        start: '2019',
                        end: '2021',
                        description: 'Developed custom CRM solutions for international clients using Vue.js and Express. Integrated multiple third-party APIs including Stripe and Twilio.'
                    }
                ],
                education: [
                    { institution: 'University of Moratuwa', degree: 'BSc (Hons) in Information Technology', start: '2013', end: '2017' }
                ],
                projects: [
                    {
                        name: 'AI-Powered Portfolio Builder',
                        description: 'A revolutionary platform that uses machine learning to suggest the best CV templates and content based on a user\'s LinkedIn profile data.'
                    }
                ],
                certifications: [
                    { name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', year: '2023' }
                ],
                skills: ['JavaScript (ES6+)', 'Vue.js', 'React.js', 'Node.js', 'Python', 'Tailwind CSS', 'SQL', 'MongoDB', 'AWS', 'Docker', 'Git', 'UI/UX Design'],
                languages: [
                    { language: 'English', proficiency: 'Fluent' },
                    { language: 'Sinhala', proficiency: 'Native' }
                ]
            }
        }
    },
    watch: {
        themeColor() { this.updateTheme(); },
        activeTab() { this.scrollToActiveTab(); },
        cv: {
            handler() { this.debouncedAutoShrink(); },
            deep: true
        },
        currentTemplate() { this.debouncedAutoShrink(); }
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
                    setTimeout(() => { this.autoShrink(); }, 400);
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
            this.$nextTick(() => {
                setTimeout(() => { this.autoShrink(); }, 100);
            });
        },

        updateSkills() {
            this.cv.skills = this.skillsInput.split(',').map(s => s.trim()).filter(s => s !== '');
            this.autoShrink();
        },

        updateTheme() {
            const root = document.documentElement;
            root.style.setProperty('--primary', this.themeColor);
            root.style.setProperty('--primary-light', this.themeColor + '20');
        },

        debouncedAutoShrink() {
            if (this._shrinkTimer) clearTimeout(this._shrinkTimer);
            this._shrinkTimer = setTimeout(() => {
                this.autoShrink();
            }, 120);
        },

        autoShrink() {
            this.$nextTick(() => {
                setTimeout(() => {
                    const wrapper = document.querySelector('.template-wrapper');
                    if (!wrapper) return;

                    const targetH = 1122; // A4 height at 96 DPI
                    this.cvScale = 1;

                    setTimeout(() => {
                        const originalStyle = wrapper.getAttribute('style') || '';
                        wrapper.style.setProperty('height', 'auto', 'important');
                        wrapper.style.setProperty('min-height', '0', 'important');
                        wrapper.style.setProperty('max-height', 'none', 'important');

                        const realHeight = wrapper.scrollHeight || wrapper.offsetHeight;
                        wrapper.setAttribute('style', originalStyle);

                        if (realHeight > targetH + 5) {
                            const scale = targetH / realHeight;
                            this.cvScale = Math.max(scale, 0.35);
                        } else {
                            this.cvScale = 1;
                        }
                    }, 50);
                }, 100);
            });
        },

        async downloadPDF(event) {
            const element = document.getElementById('cv-page');
            if (!element) return;

            const btn = event?.target?.closest('button');
            const originalHTML = btn ? btn.innerHTML : '';
            if (btn) {
                btn.disabled = true;
                btn.innerHTML = '<i class="fa-solid fa-circle-notch animate-spin"></i> Generating PDF...';
            }

            const originalScale = this.cvScale;
            this.cvScale = 1;
            await this.$nextTick();
            await new Promise(r => setTimeout(r, 100));

            const options = {
                margin: 0,
                filename: `${this.cv.name ? this.cv.name.replace(/\s+/g, '_') : 'my'}_cv.pdf`,
                image: { type: 'jpeg', quality: 1 },
                html2canvas: { scale: 3, useCORS: true, logging: false },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            try {
                await html2pdf().set(options).from(element).save();
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
        },

        debounce(func, delay) {
            let timeout;
            return function (...args) {
                const context = this;
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(context, args), delay);
            };
        }
    },

    computed: {
        wrapperStyle() {
            const s = this.cvScale;
            if (s >= 1) return { transform: 'scale(1)', width: '100%', transformOrigin: 'top left' };
            const invertedW = (1 / s) * 100;
            return {
                transform: `scale(${s})`,
                width: `${invertedW}%`,
                transformOrigin: 'top left'
            };
        }
    },

    mounted() {
        window.exportCVasPDF = (e) => this.downloadPDF(e);
        this.updateTheme();

        this.debouncedAutoShrink = this.debounce(() => { this.autoShrink(); }, 300);
        setTimeout(() => { this.autoShrink(); }, 300);

        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth < 768;
            if (!this.isMobile) this.showPreview = false;
            this.debouncedAutoShrink();
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

        const prepareForPrint = () => {
            const editorPane = document.querySelector('#app > div > div:first-child');
            if (editorPane) {
                editorPane.setAttribute('data-print-hidden', 'true');
                editorPane.style.setProperty('display', 'none', 'important');
            }
            const a4Container = document.querySelector('.a4-container');
            if (a4Container) {
                a4Container.setAttribute('data-print-expanded', 'true');
                a4Container.style.setProperty('width', '210mm', 'important');
                a4Container.style.setProperty('height', '297mm', 'important');
                a4Container.style.setProperty('padding', '0', 'important');
                a4Container.style.setProperty('margin', '0', 'important');
                a4Container.style.setProperty('overflow', 'hidden', 'important');
                a4Container.style.setProperty('display', 'block', 'important');
                a4Container.style.setProperty('position', 'absolute', 'important');
                a4Container.style.setProperty('top', '0', 'important');
                a4Container.style.setProperty('left', '0', 'important');
                a4Container.style.setProperty('transform', 'none', 'important');
            }
            const wrapper = document.querySelector('.template-wrapper');
            if (wrapper) {
                wrapper.setAttribute('data-print-scale', wrapper.style.transform || '');
                wrapper.setAttribute('data-print-width', wrapper.style.width || '');
                wrapper.style.setProperty('transform', 'none', 'important');
                wrapper.style.setProperty('width', '210mm', 'important');
                wrapper.style.setProperty('height', '297mm', 'important');
                wrapper.style.setProperty('position', 'absolute', 'important');
                wrapper.style.setProperty('top', '0', 'important');
                wrapper.style.setProperty('left', '0', 'important');
                wrapper.style.setProperty('overflow', 'hidden', 'important');
            }
            const a4Page = document.querySelector('.a4-page');
            if (a4Page) {
                a4Page.setAttribute('data-print-transform', a4Page.style.transform || '');
                a4Page.style.setProperty('transform', 'none', 'important');
                a4Page.style.setProperty('left', '0', 'important');
                a4Page.style.setProperty('top', '0', 'important');
                a4Page.style.setProperty('margin', '0', 'important');
                a4Page.style.setProperty('width', '210mm', 'important');
                a4Page.style.setProperty('height', '297mm', 'important');
                a4Page.style.setProperty('position', 'absolute', 'important');
            }
        };

        const restoreAfterPrint = () => {
            const editorPane = document.querySelector('[data-print-hidden="true"]');
            if (editorPane) {
                editorPane.removeAttribute('data-print-hidden');
                editorPane.style.removeProperty('display');
            }
            const a4Container = document.querySelector('[data-print-expanded="true"]');
            if (a4Container) {
                a4Container.removeAttribute('data-print-expanded');
                ['width', 'height', 'padding', 'margin', 'overflow', 'display', 'position', 'top', 'left', 'transform'].forEach(p => a4Container.style.removeProperty(p));
            }
            const wrapper = document.querySelector('.template-wrapper');
            if (wrapper) {
                const savedT = wrapper.getAttribute('data-print-scale');
                const savedW = wrapper.getAttribute('data-print-width');
                wrapper.removeAttribute('data-print-scale');
                wrapper.removeAttribute('data-print-width');
                ['transform', 'width', 'height', 'position', 'top', 'left', 'overflow'].forEach(p => wrapper.style.removeProperty(p));
                if (savedT) wrapper.style.transform = savedT;
                if (savedW) wrapper.style.width = savedW;
            }
            const a4Page = document.querySelector('.a4-page');
            if (a4Page) {
                a4Page.removeAttribute('data-print-transform');
                ['transform', 'left', 'top', 'margin', 'width', 'height', 'position'].forEach(p => a4Page.style.removeProperty(p));
            }
            setTimeout(() => { this.autoShrink(); }, 200);
        };

        window.addEventListener('beforeprint', prepareForPrint);
        window.addEventListener('afterprint', restoreAfterPrint);

        const originalPrint = window.print.bind(window);
        window.print = () => {
            prepareForPrint();
            setTimeout(() => { originalPrint(); }, 100);
        };
    }
}).mount('#app');
