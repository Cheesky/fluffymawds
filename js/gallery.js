// State management for raw data
let allArtworks = [];

/**
 * 1. Initialize and Fetch Gallery Data
 */
async function loadGallery() {
    try {
        // Fetches from the root of your public web directory served by Nginx
        const response = await fetch('/artworks.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Automatically sort items by date string (Newest entries first)
        allArtworks = data.sort((a, b) => b.date.localeCompare(a.date));
        
        // Initial render: Show all items on page load
        renderGallery("All");
        
        // Bind click events to your filter buttons
        setupFilterListeners();
        
    } catch (error) {
        console.error("Error initializing the artwork gallery:", error);
        const container = document.getElementById('gallery-container');
        if (container) {
            container.innerHTML = `
                <div class="col-span-full py-12 text-center">
                    <p class="text-rose-400 font-medium">Failed to load gallery content.</p>
                    <p class="text-slate-500 text-xs mt-1">Check that artworks.json exists in your html root directory.</p>
                </div>
            `;
        }
    }
}

/**
 * 2. Helper Function: Extract clean titles from image paths
 * Converts "images/gallery/neon_forest.png" -> "Neon Forest"
 */
function getTitleFromFilename(imagePath) {
    // Isolate the filename from the folder paths: "neon_forest.png"
    const baseName = imagePath.split('/').pop();
    
    // Strip the file extension: "neon_forest"
    const cleanName = baseName.substring(0, baseName.lastIndexOf('.')) || baseName;
    
    // Swap underscores or hyphens into clean spacing gaps: "neon forest"
    const formatName = cleanName.replace(/[_-]/g, ' ');
    
    // Capitalize the first letter of each word beautifully
    return formatName.replace(/\b\w/g, char => char.toUpperCase());
}

/**
 * 3. Render items into the Masonry Columns Grid
 */
function renderGallery(selectedTag) {
    const galleryContainer = document.getElementById('gallery-container');
    if (!galleryContainer) return;
    
    // Filter array logic: Show all, or look inside the tags array configuration
    const filteredItems = selectedTag === "All" 
        ? allArtworks 
        : allArtworks.filter(art => art.tags.includes(selectedTag));
        
    // Empty state handling
    if (filteredItems.length === 0) {
        galleryContainer.innerHTML = `
            <p class="text-slate-500 py-16 text-center text-sm w-full [column-span:all]">
                No submissions found matching this layout category.
            </p>
        `;
        return;
    }
    
    // Map elements into string templates and inject them in one single DOM update
    galleryContainer.innerHTML = filteredItems.map(art => {
        const dynamicTitle = getTitleFromFilename(art.image);
        
        return `
            <div class="w-full break-inside-avoid mb-2 bg-slate-900/60 border border-slate-700/30 rounded-2xl overflow-hidden group hover:border-emerald-500/40 transition-all duration-300 shadow-xl backdrop-blur-xs flex flex-col">
        
                <div class="w-full overflow-hidden bg-slate-950 cursor-zoom-in" onclick="openLightbox('${art.full_image || art.image}', '${dynamicTitle}')">
                    <img src="${art.image}" 
                        alt="${dynamicTitle}" 
                        class="w-full h-auto object-cover group-hover:scale-102 transition duration-500" 
                        loading="lazy">
                </div>
                
                

            </div>
        `;
    }).join('');
}

/**
 * 4. Handle Button Clicks & Tailwind Active State Transitions
 */
function setupFilterListeners() {
    const buttons = document.querySelectorAll('.filter-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const clickedTag = e.currentTarget.getAttribute('data-tag');
            
            // Re-render grid with matching subset elements
            renderGallery(clickedTag);
            
            // Reset ALL buttons to default slate layout classes
            buttons.forEach(btn => {
                btn.classList.remove('bg-pink-600', 'text-white', 'shadow-lg');
                btn.classList.add('bg-slate-800/60', 'text-slate-300', 'border', 'border-slate-700/30');
            });
            
            // Promote the CURRENT clicked button to active pink design configurations
            e.currentTarget.classList.remove('bg-slate-800/60', 'text-slate-300', 'border', 'border-slate-700/30');
            e.currentTarget.classList.add('bg-pink-600', 'text-white', 'shadow-lg');
        });
    });
}

// Fire when the document layout handles initial memory setups
window.addEventListener('DOMContentLoaded', loadGallery);