document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab-btn');
    const panes = document.querySelectorAll('.tab-pane');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and panes
            tabs.forEach(t => t.classList.remove('active'));
            panes.forEach(p => p.classList.remove('active'));

            // Add active class to clicked tab and corresponding pane
            tab.classList.add('active');
            const targetId = tab.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // --- Onboarding Tour Logic ---
    const tourSteps = [
        { target: 'tab-presentation', text: 'Start here! Click through the slides to view our proposal.' },
        { target: 'tab-mobile', text: 'Next, click here to interact with the working mobile app prototype!' },
        { target: 'tab-landing', text: 'Finally, explore the custom premium landing page we designed.' }
    ];

    let currentStep = 0;
    const overlay = document.getElementById('tour-overlay');
    const tooltip = document.getElementById('tour-tooltip');
    const tooltipText = document.getElementById('tour-text');
    const nextBtn = document.getElementById('tour-next');

    function showTourStep(index) {
        if (index >= tourSteps.length) {
            endTour();
            return;
        }

        // Remove highlight from all tabs
        tabs.forEach(t => t.classList.remove('tour-highlight'));
        
        const step = tourSteps[index];
        const targetElement = document.querySelector(`[data-target="${step.target}"]`);
        const mvpIframe = document.querySelector('#tab-mobile iframe');
        
        if (mvpIframe && mvpIframe.contentWindow) {
            if (step.target === 'tab-mobile') {
                mvpIframe.contentWindow.postMessage('showArrows', '*');
            } else {
                mvpIframe.contentWindow.postMessage('hideArrows', '*');
            }
        }
        
        if (targetElement) {
            // Add tour-active class to body
            document.body.classList.add('tour-active');

            // Add highlight class
            targetElement.classList.add('tour-highlight');
            
            // Set text
            tooltipText.textContent = step.text;
            
            // Position tooltip
            const rect = targetElement.getBoundingClientRect();
            tooltip.style.top = `${rect.bottom + 16}px`;
            // Center the tooltip horizontally relative to the target tab
            tooltip.style.left = `${rect.left + (rect.width / 2) - 125}px`; 
            
            // Show overlay and tooltip
            overlay.classList.remove('hidden');
            tooltip.classList.remove('hidden');

            // Optionally, automatically click the tab so the background content switches
            targetElement.click();
        }
    }

    function endTour() {
        document.body.classList.remove('tour-active');
        overlay.classList.add('hidden');
        tooltip.classList.add('hidden');
        tabs.forEach(t => t.classList.remove('tour-highlight'));
        
        const mvpIframe = document.querySelector('#tab-mobile iframe');
        if (mvpIframe && mvpIframe.contentWindow) {
            mvpIframe.contentWindow.postMessage('hideArrows', '*');
        }
        
        // Return to the first tab when tour finishes
        document.querySelector('[data-target="tab-presentation"]').click();
    }

    nextBtn.addEventListener('click', () => {
        currentStep++;
        showTourStep(currentStep);
    });

    // Start tour automatically after a short delay so the UI can render
    setTimeout(() => {
        showTourStep(0);
    }, 800);
});
