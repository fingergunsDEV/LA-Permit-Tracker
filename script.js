class LAPermitTracker {
    constructor() {
        this.currentSection = 'dashboard';
        this.permits = [
            {
                id: 'BL-2024-001234',
                name: 'Business License',
                type: 'General Business',
                status: 'active',
                expires: '2024-12-31',
                category: 'permits'
            },
            {
                id: 'HD-2024-005678',
                name: 'Health Department Permit',
                type: 'Food Service',
                status: 'warning',
                expires: '2024-03-15',
                category: 'permits'
            },
            {
                id: 'SP-2024-009876',
                name: 'Signage Permit',
                type: 'Exterior Signage',
                status: 'pending',
                submitted: '2024-02-20',
                category: 'permits'
            }
        ];
        
        this.documents = [
            {
                id: 1,
                name: 'Business License Certificate',
                filename: 'BL-2024-001234.pdf',
                type: 'permits',
                date: '2024-02-15'
            },
            {
                id: 2,
                name: 'Fire Safety Certificate',
                filename: 'FS-2024-005678.pdf',
                type: 'certificates',
                date: '2024-01-28'
            },
            {
                id: 3,
                name: 'Health Inspection Report',
                filename: 'HI-2024-002345.pdf',
                type: 'reports',
                date: '2023-12-10'
            }
        ];
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateDashboardStats();
        this.animateElements();
    }
    
    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const section = e.currentTarget.getAttribute('data-section');
                this.showSection(section);
            });
        });
        
        // Modal controls
        const uploadBtn = document.getElementById('uploadBtn');
        const modal = document.getElementById('uploadModal');
        const modalClose = document.querySelector('.modal-close');
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => {
                modal.classList.add('active');
            });
        }
        
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }
        
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        }
        
        // Upload area
        if (uploadArea && fileInput) {
            uploadArea.addEventListener('click', () => {
                fileInput.click();
            });
            
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = 'var(--primary-color)';
                uploadArea.style.background = 'rgba(37, 99, 235, 0.1)';
            });
            
            uploadArea.addEventListener('dragleave', () => {
                uploadArea.style.borderColor = 'var(--border-color)';
                uploadArea.style.background = 'transparent';
            });
            
            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = 'var(--border-color)';
                uploadArea.style.background = 'transparent';
                
                const files = e.dataTransfer.files;
                this.handleFileUpload(files);
            });
            
            fileInput.addEventListener('change', (e) => {
                this.handleFileUpload(e.target.files);
            });
        }
        
        // Document filters
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const filter = e.currentTarget.getAttribute('data-filter');
                this.filterDocuments(filter);
                
                // Update active tab
                document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });
        
        // Business type selector
        const businessTypeSelect = document.getElementById('businessType');
        if (businessTypeSelect) {
            businessTypeSelect.addEventListener('change', (e) => {
                this.updateComplianceForBusinessType(e.target.value);
            });
        }
        
        // Action buttons
        document.querySelectorAll('.action-button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleQuickAction(e.currentTarget);
            });
        });
        
        // Permit actions
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handlePermitAction(e.currentTarget);
            });
        });
        
        // Search functionality
        const searchInput = document.querySelector('.search-bar input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchPermits(e.target.value);
            });
        }
    }
    
    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show target section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        
        this.currentSection = sectionName;
        
        // Trigger section-specific animations
        this.animateElements();
    }
    
    updateDashboardStats() {
        const stats = {
            expiring: this.permits.filter(p => p.status === 'warning').length,
            pending: this.permits.filter(p => p.status === 'pending').length,
            active: this.permits.filter(p => p.status === 'active').length,
            updates: 2 // Mock data
        };
        
        // Update stat cards with animation
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach((card, index) => {
            const h3 = card.querySelector('h3');
            if (h3) {
                const values = [stats.expiring, stats.pending, stats.active, stats.updates];
                this.animateNumber(h3, 0, values[index], 1000);
            }
        });
    }
    
    animateNumber(element, start, end, duration) {
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(start + (end - start) * this.easeOutCubic(progress));
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
    
    animateElements() {
        // Animate cards on section change
        const cards = document.querySelectorAll('.stat-card, .permit-card, .category-card, .document-item');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    handleFileUpload(files) {
        Array.from(files).forEach(file => {
            console.log('Uploading file:', file.name);
            
            // Simulate upload progress
            this.simulateUploadProgress(file);
        });
    }
    
    simulateUploadProgress(file) {
        // Create a temporary progress indicator
        const uploadArea = document.getElementById('uploadArea');
        const originalContent = uploadArea.innerHTML;
        
        uploadArea.innerHTML = `
            <div class="upload-progress">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Uploading ${file.name}...</p>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 0%"></div>
                </div>
            </div>
        `;
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 20;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                setTimeout(() => {
                    uploadArea.innerHTML = `
                        <div class="upload-success">
                            <i class="fas fa-check-circle" style="color: var(--success-color);"></i>
                            <p>Upload successful!</p>
                        </div>
                    `;
                    
                    setTimeout(() => {
                        uploadArea.innerHTML = originalContent;
                        document.getElementById('uploadModal').classList.remove('active');
                    }, 2000);
                }, 500);
            }
            
            const progressBar = uploadArea.querySelector('.progress-fill');
            if (progressBar) {
                progressBar.style.width = `${progress}%`;
            }
        }, 200);
    }
    
    filterDocuments(filter) {
        const documents = document.querySelectorAll('.document-item');
        
        documents.forEach(doc => {
            const type = doc.getAttribute('data-type');
            
            if (filter === 'all' || type === filter) {
                doc.style.display = 'flex';
                doc.style.animation = 'fadeIn 0.3s ease';
            } else {
                doc.style.display = 'none';
            }
        });
    }
    
    updateComplianceForBusinessType(businessType) {
        // Mock compliance data for different business types
        const complianceData = {
            restaurant: {
                'Food Safety': 90,
                'Fire Safety': 75,
                'Building & Zoning': 95
            },
            retail: {
                'Fire Safety': 85,
                'Building & Zoning': 90,
                'Accessibility': 95
            },
            'food-truck': {
                'Food Safety': 85,
                'Mobile Vendor License': 80,
                'Health Department': 90
            },
            construction: {
                'Building Permits': 70,
                'Safety Compliance': 85,
                'Environmental': 75
            }
        };
        
        const data = complianceData[businessType] || complianceData.restaurant;
        
        // Update compliance categories (simplified version)
        console.log('Updating compliance for:', businessType, data);
    }
    
    handleQuickAction(button) {
        const action = button.querySelector('span').textContent;
        
        // Add visual feedback
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
        
        // Simulate action
        this.showNotification(`${action} initiated`, 'success');
    }
    
    handlePermitAction(button) {
        const action = button.querySelector('i').className;
        let actionType = 'Action';
        
        if (action.includes('eye')) actionType = 'View';
        if (action.includes('download')) actionType = 'Download';
        if (action.includes('sync')) actionType = 'Renew';
        if (action.includes('clock')) actionType = 'Track';
        
        // Add visual feedback
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
        
        this.showNotification(`${actionType} completed`, 'success');
    }
    
    searchPermits(query) {
        const permitCards = document.querySelectorAll('.permit-card');
        
        permitCards.forEach(card => {
            const text = card.textContent.toLowerCase();
            const matches = text.includes(query.toLowerCase());
            
            if (matches || query === '') {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.3s ease';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'success' ? 'var(--success-color)' : 'var(--primary-color)',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
            zIndex: '2000',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LAPermitTracker();
});

// Add some additional interactive features
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateY(-2px)';
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translateY(0)';
        });
    });
    
    // Add particle effect to buttons
    const buttons = document.querySelectorAll('.primary-button, .action-button');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: rgba(255, 255, 255, 0.6);
                border-radius: 50%;
                pointer-events: none;
                left: ${x}px;
                top: ${y}px;
                animation: ripple 0.6s linear;
            `;
            
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        });
    });
    
    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(40);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});

