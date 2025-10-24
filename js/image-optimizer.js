/**
 * Image Performance Optimization Script
 * Provides lazy loading fallback, responsive image loading, and image optimization
 */

(function() {
    'use strict';

    // Feature detection for native lazy loading
    const supportsNativeLazyLoading = 'loading' in HTMLImageElement.prototype;

    /**
     * Intersection Observer based lazy loading fallback
     * for browsers that don't support native lazy loading
     */
    function setupLazyLoadingFallback() {
        if (supportsNativeLazyLoading) {
            return; // Native lazy loading is supported
        }

        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        // Load the image
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                        }
                        if (img.dataset.srcset) {
                            img.srcset = img.dataset.srcset;
                        }
                        
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px', // Start loading 50px before entering viewport
                threshold: 0.01
            });

            lazyImages.forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for very old browsers - load all images
            lazyImages.forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
                if (img.dataset.srcset) {
                    img.srcset = img.dataset.srcset;
                }
            });
        }
    }

    /**
     * Add fade-in effect when images load
     */
    function setupImageLoadEffects() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            if (img.complete) {
                img.classList.add('loaded');
            } else {
                img.addEventListener('load', function() {
                    this.classList.add('loaded');
                });
            }
        });
    }

    /**
     * Preload critical images that are above the fold
     */
    function preloadCriticalImages() {
        const criticalImages = document.querySelectorAll('[data-preload]');
        
        criticalImages.forEach(img => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = img.src || img.dataset.src;
            
            if (img.srcset || img.dataset.srcset) {
                link.imageSrcset = img.srcset || img.dataset.srcset;
            }
            
            document.head.appendChild(link);
        });
    }

    /**
     * Optimize image decoding
     */
    function optimizeImageDecoding() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Use async decoding for images that are not critical
            if (!img.hasAttribute('data-preload') && 'decode' in img) {
                img.decoding = 'async';
            }
        });
    }

    /**
     * Add error handling for failed image loads
     */
    function setupImageErrorHandling() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            img.addEventListener('error', function() {
                this.classList.add('image-error');
                console.warn('Failed to load image:', this.src);
                
                // Optionally set a placeholder or hide the image
                // this.style.display = 'none';
            });
        });
    }

    /**
     * Monitor images for performance metrics
     */
    function monitorImagePerformance() {
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        // Log slow loading images (taking more than 2 seconds)
                        if (entry.duration > 2000 && entry.initiatorType === 'img') {
                            console.warn('Slow loading image detected:', entry.name, 'Duration:', entry.duration);
                        }
                    }
                });
                
                observer.observe({ entryTypes: ['resource'] });
            } catch (e) {
                // PerformanceObserver not fully supported
            }
        }
    }

    /**
     * Implement responsive image selection based on connection speed
     */
    function adaptiveImageLoading() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            const effectiveType = connection.effectiveType;
            
            // On slow connections (2g, slow-2g), prefer smaller images
            if (effectiveType === '2g' || effectiveType === 'slow-2g') {
                const images = document.querySelectorAll('img[srcset]');
                images.forEach(img => {
                    // Force selection of smaller image variants
                    img.setAttribute('data-low-bandwidth', 'true');
                });
            }
        }
    }

    /**
     * Initialize all optimizations
     */
    function init() {
        // Run on DOMContentLoaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                setupLazyLoadingFallback();
                setupImageLoadEffects();
                preloadCriticalImages();
                optimizeImageDecoding();
                setupImageErrorHandling();
                monitorImagePerformance();
                adaptiveImageLoading();
            });
        } else {
            // DOM already loaded
            setupLazyLoadingFallback();
            setupImageLoadEffects();
            preloadCriticalImages();
            optimizeImageDecoding();
            setupImageErrorHandling();
            monitorImagePerformance();
            adaptiveImageLoading();
        }
    }

    // Initialize the optimizations
    init();

})();
