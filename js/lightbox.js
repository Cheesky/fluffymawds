/**
 * js/lightbox.js
 * Handles the full-screen image viewing modal
 */

function openLightbox(highResSrc, title) {
    // 1. Create the modal wrapper
    const modal = document.createElement('div');
    modal.id = 'dynamic-lightbox';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md opacity-0 transition-opacity duration-300 cursor-zoom-out p-4 md:p-8';
    
    // 2. Inject the high-res image and UI
    modal.innerHTML = `
        <div class="relative max-w-full max-h-full flex flex-col items-center justify-center cursor-default" onclick="event.stopPropagation()">
            
            <div class="absolute -z-10 flex flex-col items-center justify-center">
                <div class="w-8 h-8 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin"></div>
            </div>

            <img src="${highResSrc}" alt="${title}" class="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl relative z-10">
            
            <p class="text-slate-200 mt-4 text-sm md:text-base font-medium tracking-wide z-10 shadow-black drop-shadow-md">${title}</p>
        </div>
    `;

    // 3. Close when clicking the blurred background
    modal.onclick = closeLightbox;

    document.body.appendChild(modal);
    
    // 4. Lock the background page from scrolling
    document.body.style.overflow = 'hidden';

    // 5. Trigger CSS fade-in
    requestAnimationFrame(() => {
        modal.classList.remove('opacity-0');
        modal.classList.add('opacity-100');
    });
}

function closeLightbox() {
    const modal = document.getElementById('dynamic-lightbox');
    if (!modal) return;

    // Fade out
    modal.classList.remove('opacity-100');
    modal.classList.add('opacity-0');

    // Remove from DOM and unlock scrolling after transition finishes
    setTimeout(() => {
        modal.remove();
        document.body.style.overflow = ''; 
    }, 300);
}

// Global listener to close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
});