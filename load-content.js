// Load content from data.js and populate the page
function loadContent() {
    try {
        // Use the global siteData variable from data.js
        const data = siteData;
        
        // Update sidebar content
        updateSidebar(data.sidebar);
        
        // Check which page we're on and load appropriate content
        const path = window.location.pathname;
        
        if (path.includes('blog-post-') || path.includes('blog-post')) {
            // We're on a blog post page
            const postId = extractPostId(path);
            loadBlogPost(data, postId);
        } else {
            // We're on the index page
            loadIndexPage(data);
        }
        
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

function extractPostId(path) {
    const match = path.match(/blog-post-(\d+)/);
    return match ? parseInt(match[1]) : null;
}

function updateSidebar(sidebar) {
    // Update Treatment Milestones
    const diagnosisEl = document.querySelector('[data-sidebar="diagnosis"]');
    if (diagnosisEl) diagnosisEl.textContent = sidebar.treatmentMilestones.diagnosis;
    
    const mriResultsEl = document.querySelector('[data-sidebar="mri-results"]');
    if (mriResultsEl) mriResultsEl.textContent = sidebar.treatmentMilestones.mriResults;
    
    const biopsyResultsEl = document.querySelector('[data-sidebar="biopsy-results"]');
    if (biopsyResultsEl) biopsyResultsEl.textContent = sidebar.treatmentMilestones.biopsyResults;
    
    const chemoStartEl = document.querySelector('[data-sidebar="chemo-start"]');
    if (chemoStartEl) chemoStartEl.textContent = sidebar.treatmentMilestones.chemotherapyStart;
    
    // Update How to Pray
    const prayList = document.querySelector('[data-sidebar="pray-list"]');
    if (prayList) {
        prayList.innerHTML = sidebar.howToPray.map(item => 
            `<li class="flex items-start gap-2">
                <span class="text-amber-600 mt-1">•</span>
                <span>${item}</span>
            </li>`
        ).join('');
    }
    
    // Update How to Give Thanks
    const thanksList = document.querySelector('[data-sidebar="thanks-list"]');
    if (thanksList) {
        thanksList.innerHTML = sidebar.howToGiveThanks.map(item => 
            `<li class="flex items-start gap-2">
                <span class="text-green-600 mt-1">•</span>
                <span>${item}</span>
            </li>`
        ).join('');
    }
}

function loadIndexPage(data) {
    // Update hero section
    const lastUpdatedEl = document.querySelector('[data-hero="last-updated"]');
    if (lastUpdatedEl) lastUpdatedEl.textContent = `Last updated: ${data.site.lastUpdated}`;
    
    const shareMessageEl = document.querySelector('[data-hero="share-message"]');
    if (shareMessageEl) shareMessageEl.textContent = data.site.shareMessage;
    
    // Load blog posts
    const blogPostsContainer = document.querySelector('[data-blog="posts"]');
    if (blogPostsContainer) {
        // Sort blog posts by ID descending (newest first)
        const sortedPosts = [...data.blogPosts].sort((a, b) => b.id - a.id);
        
        blogPostsContainer.innerHTML = sortedPosts.map(post => {
            const startBadge = post.isStart ? 
                `<span class="text-xs font-medium bg-${post.color}-100 text-${post.color}-700 px-2 py-1 rounded-full">Start Here</span>` : '';
            
            return `
                <article class="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all border border-gray-200 p-6 md:p-8">
                    <div class="flex items-start gap-4 mb-4">
                        <div class="relative flex-shrink-0">
                            <div class="absolute inset-0 bg-${post.color}-400 rounded-full blur-sm opacity-30"></div>
                            <img src="${post.heroImage}" alt="${post.title}" class="relative w-24 h-24 rounded-full object-cover border-4 border-white shadow-md">
                        </div>
                        <div class="flex-1">
                            <div class="flex items-center gap-2 ${startBadge ? 'mb-2' : 'text-sm text-gray-500 mb-2'}">
                                ${startBadge}
                                <span class="text-sm text-gray-500">${post.date}</span>
                            </div>
                            <h4 class="font-serif text-2xl font-bold text-${post.color}-700 mb-3 hover:text-${post.color}-800 transition-colors">
                                <a href="blog-post-${post.id}.html">${post.title}</a>
                            </h4>
                        </div>
                    </div>
                    <p class="text-gray-600 mb-4 line-clamp-3">
                        ${post.excerpt}
                    </p>
                    <a href="blog-post-${post.id}.html" class="inline-flex items-center bg-${post.color}-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-${post.color}-700 transition-colors">
                        Read More
                        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </a>
                </article>
            `;
        }).join('');
    }
}

function loadBlogPost(data, postId) {
    const post = data.blogPosts.find(p => p.id === postId);
    if (!post) return;
    
    // Update hero image
    const heroImg = document.querySelector('[data-hero="image"]');
    if (heroImg) {
        heroImg.src = post.heroImage;
        heroImg.style.objectPosition = post.heroImagePosition;
    }
    
    // Update title and date
    const titleEl = document.querySelector('[data-post="title"]');
    if (titleEl) titleEl.textContent = post.title;
    
    const dateEl = document.querySelector('[data-post="date"]');
    if (dateEl) dateEl.textContent = post.date;
    
    // Load content
    const contentContainer = document.querySelector('[data-post="content"]');
    if (contentContainer) {
        contentContainer.innerHTML = post.content.map(item => {
            switch (item.type) {
                case 'paragraph':
                    return `<p class="mb-4">${item.text}</p>`;
                case 'image':
                    const widthClass = item.width || 'w-full';
                    return `
                        <div class="my-8">
                            <div>
                                <img src="${item.src}" alt="${item.alt}" class="${widthClass} rounded-xl shadow-lg mx-auto">
                                <p class="text-sm text-gray-500 mt-2 text-center italic">${item.caption}</p>
                            </div>
                        </div>
                    `;
                case 'images':
                    if (item.captions) {
                        // Multiple images with individual captions
                        return `
                            <div class="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                                ${item.images.map((img, i) => `
                                    <div>
                                        <img src="${img.src}" alt="${img.alt}" class="w-full rounded-xl shadow-lg">
                                        <p class="text-sm text-gray-500 mt-2 text-center italic">${item.captions[i]}</p>
                                    </div>
                                `).join('')}
                            </div>
                        `;
                    } else {
                        // Multiple images with single caption
                        return `
                            <div class="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                                ${item.images.map(img => `
                                    <div>
                                        <img src="${img.src}" alt="${img.alt}" class="w-full rounded-xl shadow-lg">
                                    </div>
                                `).join('')}
                            </div>
                            <p class="text-sm text-gray-500 mt-2 text-center italic">${item.caption}</p>
                        `;
                    }
                default:
                    return '';
            }
        }).join('');
    }
}

// Load content when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadContent);
} else {
    loadContent();
}
