// State management for commission view data
let recentArtworks = [];

/**
 * 1. Initialize and Fetch Recent Works from JSON
 */
async function loadCommissionPage() {
    try {
        const response = await fetch('/artworks.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Sort entries by date (Newest entries first)
        const sortedArtworks = data.sort((a, b) => b.date.localeCompare(a.date));
        
        // Grab only the 6 most recent works for the preview track
        recentArtworks = sortedArtworks.slice(0, 6);
        
        // Render horizontal masonry elements
        renderRecentWorks();
        
        // Setup button listeners unique to the commission flow
        setupCommissionListeners();
        
    } catch (error) {
        console.error("Error loading commission page previews:", error);
        const container = document.getElementById('recent-works-container');
        if (container) {
            container.innerHTML = `
                <p class="text-rose-400 text-xs py-2">
                    Failed to load preview assets.
                </p>
            `;
        }
    }
}

/**
 * 2. Helper Function: Clean filenames for hover titles
 */
function getTitleFromFilename(imagePath) {
    const baseName = imagePath.split('/').pop();
    const cleanName = baseName.substring(0, baseName.lastIndexOf('.')) || baseName;
    const formatName = cleanName.replace(/[_-]/g, ' ');
    return formatName.replace(/\b\w/g, char => char.toUpperCase());
}

/**
 * 3. Render Horizontal Scroller Items
 */
function renderRecentWorks() {
    const container = document.getElementById('recent-works-container');
    if (!container) return;
    
    if (recentArtworks.length === 0) {
        container.innerHTML = `<p class="text-slate-500 text-xs py-4">No recent works found.</p>`;
        return;
    }
    
    container.innerHTML = recentArtworks.map(art => {
        const dynamicTitle = getTitleFromFilename(art.image);
        
        return `
            <div class="w-44 h-60 rounded-lg bg-slate-950 shrink-0 snap-start overflow-hidden group border border-slate-700/30 hover:border-pink-500/40 transition-all duration-300 relative shadow-md select-none cursor-zoom-in" onclick="openLightbox('${art.full_image || art.image}', '${dynamicTitle}')">
                
                <img src="${art.image}" 
                     alt="${dynamicTitle}" 
                     class="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                     loading="lazy">
                
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 pointer-events-none">
                    <p class="text-xs font-semibold text-white truncate tracking-wide">${dynamicTitle}</p>
                    <p class="text-[10px] text-slate-400 font-mono mt-0.5">${art.date}</p>
                </div>

            </div>
        `;
    }).join('');
}

/**
 * 4. Interactive Page Listeners
 */
function setupCommissionListeners() {
    const requestBtn = document.getElementById('comm-req-btn');
    
    if (requestBtn) {
        requestBtn.addEventListener('click', () => {
            // Placeholder: Replace this with your form handler, mailto link, or contact pop-up logic!
            alert("Ruh-roh! Commission requests feature coming soon! At the moment you can directly contact @awfulaime on Discord!");
        });
    }
}

// Fire loading sequence when the document structure finishes layout parses
window.addEventListener('DOMContentLoaded', loadCommissionPage);