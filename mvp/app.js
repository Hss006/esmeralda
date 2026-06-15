// State Management
const state = {
    currentView: 'home',
    progress: 45,
    w2Uploaded: false,
    selectedPackage: null
};

// DOM Elements
const elements = {
    header: document.getElementById('app-header'),
    headerTitle: document.getElementById('header-title'),
    backBtn: document.getElementById('back-btn'),
    content: document.getElementById('app-content'),
    navItems: document.querySelectorAll('.nav-item')
};

// App Logic
const app = {
    init() {
        this.setupNavigation();
        this.renderView('home');
        
        elements.backBtn.addEventListener('click', () => {
            this.navigate('home');
        });
    },

    setupNavigation() {
        elements.navItems.forEach(item => {
            item.addEventListener('click', () => {
                const view = item.getAttribute('data-view');
                this.navigate(view);
            });
        });
    },

    navigate(view) {
        state.currentView = view;
        
        // Update Nav
        elements.navItems.forEach(item => {
            if (item.getAttribute('data-view') === view) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Header Logic
        if (view === 'home') {
            elements.header.classList.add('hidden');
        } else {
            elements.header.classList.remove('hidden');
            
            // Set Titles based on view
            const titles = {
                'services': '',
                'booking': 'Book a Consultation',
                'vault': 'Document Vault',
                'profile': 'Profile'
            };
            elements.headerTitle.textContent = titles[view];
        }

        this.renderView(view);
    },

    renderView(view) {
        const template = document.getElementById(`tpl-${view}`);
        if (!template) return;

        // Clone template content
        const clone = template.content.cloneNode(true);
        
        // Clear content and append new
        elements.content.innerHTML = '';
        elements.content.appendChild(clone);

        // Apply state specific updates after render
        this.applyStateUpdates(view);
    },

    applyStateUpdates(view) {
        if (view === 'home') {
            const progressBar = document.querySelector('.progress-bar');
            const progressText = document.querySelector('.progress-labels span:nth-child(2)');
            const subtitle = document.querySelector('.subtitle');
            
            if (progressBar && progressText) {
                // Slight delay for animation
                setTimeout(() => {
                    progressBar.style.width = `${state.progress}%`;
                    progressText.textContent = `${state.progress}%`;
                }, 50);
            }

            if (state.w2Uploaded && subtitle) {
                subtitle.textContent = "All documents uploaded. Waiting for review.";
            }
        }

        if (view === 'vault' && state.w2Uploaded) {
            const w2Doc = document.getElementById('w2-doc');
            if (w2Doc) {
                w2Doc.innerHTML = `
                    <div class="doc-icon success">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    </div>
                    <div class="doc-details">
                        <h4>W-2 Form</h4>
                        <p>1.8 MB</p>
                    </div>
                    <button class="icon-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                    </button>
                `;
                
                const needsActionList = document.getElementById('needs-action-list');
                if(needsActionList) {
                    needsActionList.innerHTML = `<p style="font-size: 12px; color: var(--text-muted); padding: 16px;">All required documents uploaded.</p>`;
                }
            }
        }
        
        if (view === 'services' && state.selectedPackage) {
             const cards = document.querySelectorAll('.package-card');
             cards.forEach(card => {
                 if(card.querySelector('h4').textContent === state.selectedPackage) {
                     card.classList.add('selected');
                 }
             });
        }
    },

    selectPackage(pkgName) {
        state.selectedPackage = pkgName;
        // Visual feedback
        const cards = document.querySelectorAll('.package-card');
        cards.forEach(card => card.classList.remove('selected'));
        event.currentTarget.classList.add('selected');
        
        // Small delay then navigate to home
        setTimeout(() => {
            this.navigate('home');
        }, 300);
    },

    confirmAppointment() {
        const btn = document.querySelector('.btn-primary');
        const originalText = btn.innerHTML;
        btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Confirmed!`;
        btn.style.background = 'var(--primary)';
        
        setTimeout(() => {
            this.navigate('home');
        }, 1500);
    },

    simulateUpload(inputElement) {
        if (!inputElement.files || inputElement.files.length === 0) return;

        const w2Doc = document.getElementById('w2-doc');
        if (!w2Doc) return;

        // Change to uploading state
        w2Doc.classList.add('uploading-card');
        w2Doc.innerHTML = `
            <div class="doc-icon" style="background: white; border: 2px solid var(--primary); color: var(--primary);">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
            </div>
            <div class="doc-details" style="width: 100%;">
                <h4 style="display:flex; justify-content:space-between;">W-2 Form.pdf <span>Uploading...</span></h4>
                <div class="progress-bar-container">
                    <div class="progress-bar" id="upload-progress" style="width: 0%;"></div>
                </div>
            </div>
        `;

        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            const bar = document.getElementById('upload-progress');
            if(bar) bar.style.width = `${progress}%`;
            
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    state.w2Uploaded = true;
                    state.progress = 85; // Update overall progress
                    this.renderView('vault'); // Re-render to show completed state
                }, 500);
            }
        }, 150);
    }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
