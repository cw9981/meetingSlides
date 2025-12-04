// 簡報數據和狀態
let presentationData = {
    companyInfo: {
        name: "PAPAGO Corporation",
        logo: "assets/company-logo.png",
        tagline: "Face8 台灣臉霸",
        presenter: "張經理",
        time: "2025年第一季度",
        lastUpdate: "2025年1月15日",
        location: "台北總公司會議廳"
    },
    titlePage: {
        mainTitle: "Staff Business Review 2025",
        subTitle: "員工業務回顧 2025",
        subtitleText: "年度績效與業務發展分析"
    },
    slides: []
};

let currentSlide = 0;
let totalSlides = 1; // 初始為1(標題頁)
let isFullscreen = false;

// DOM元素
const slidesContainer = document.getElementById('slides-container');
const prevButton = document.getElementById('prev-slide');
const nextButton = document.getElementById('next-slide');
const progressBar = document.getElementById('progress-bar');
const currentPageSpan = document.querySelector('.current-page');
const totalPagesSpan = document.querySelector('.total-pages');
const fullscreenToggle = document.getElementById('fullscreen-toggle');
const fullscreenExitHint = document.getElementById('fullscreen-exit-hint');
const body = document.body;

// 全屏相關變數
let fullscreenBtnIcon = fullscreenToggle.querySelector('i');
let fullscreenBtnText = fullscreenToggle.querySelector('.btn-text');

// 載入JSON數據
async function loadPresentationData() {
    try {
        const response = await fetch('meeting.json');
        if (!response.ok) {
            throw new Error('無法載入簡報數據');
        }
        const data = await response.json();
        
        // 更新公司資訊
        if (data.companyInfo) {
            presentationData.companyInfo = {...presentationData.companyInfo, ...data.companyInfo};
            updateCompanyInfo();
        }
        
        // 更新標題頁資訊
        if (data.titlePage) {
            presentationData.titlePage = {...presentationData.titlePage, ...data.titlePage};
            updateTitlePage();
        }
        
        // 載入幻燈片數據
        if (data.slides && Array.isArray(data.slides)) {
            presentationData.slides = data.slides;
            totalSlides = 1 + presentationData.slides.length;
            createSlidesFromData();
            updatePageIndicator();
            updateProgressBar();
        }
    } catch (error) {
        console.error('載入數據時發生錯誤:', error);
        // 使用預設數據
        loadDefaultData();
    }
}

// 載入預設數據
function loadDefaultData() {
    // 預設幻燈片數據
    presentationData.slides = [
        {
            type: "text_image",
            title: "年度業務表現",
            text: "2024年我們取得了顯著的業務增長，營收同比增長了15%，客戶滿意度達到歷史新高。",
            image: "assets/chart1.png"
        },
        {
            type: "two_level_list",
            title: "重點成就",
            items: [
                {
                    title: "市場拓展",
                    subitems: [
                        "成功進入兩個新區域市場",
                        "與5家新合作夥伴建立戰略關係",
                        "市場佔有率提升至22%"
                    ]
                },
                {
                    title: "產品創新",
                    subitems: [
                        "推出3款新產品系列",
                        "獲得兩項產品設計專利",
                        "客戶反饋滿意度達95%"
                    ]
                },
                {
                    title: "團隊發展",
                    subitems: [
                        "新增兩個專業團隊",
                        "完成超過500小時的專業培訓",
                        "員工滿意度提升12%"
                    ]
                }
            ]
        },
        {
            type: "text_image",
            title: "未來展望",
            text: "2025年我們將專注於數位轉型與可持續發展，目標實現20%的營收增長並擴大亞太區市場。",
            image: "assets/chart2.png"
        },
        {
            type: "two_level_list",
            title: "2025年策略重點",
            items: [
                {
                    title: "技術升級",
                    subitems: [
                        "投資AI與大數據分析平台",
                        "實現80%業務流程數位化",
                        "建立雲端協作系統"
                    ]
                },
                {
                    title: "人才發展",
                    subitems: [
                        "擴大培訓計畫覆蓋率",
                        "引進高端技術人才",
                        "建立導師制度"
                    ]
                },
                {
                    title: "永續經營",
                    subitems: [
                        "減少30%碳排放",
                        "建立綠色供應鏈",
                        "推出環保產品線"
                    ]
                }
            ]
        }
    ];
    
    totalSlides = 1 + presentationData.slides.length;
    createSlidesFromData();
    updatePageIndicator();
    updateProgressBar();
}

// 更新公司資訊
function updateCompanyInfo() {
    const companyInfo = presentationData.companyInfo;
    
    document.getElementById('company-name').textContent = companyInfo.name;
    document.getElementById('company-tagline').textContent = companyInfo.tagline;
    document.getElementById('presenter-name').textContent = companyInfo.presenter;
    document.getElementById('presentation-time').textContent = companyInfo.time;
    document.getElementById('last-update').textContent = companyInfo.lastUpdate;
    document.getElementById('location').textContent = companyInfo.location;
    
    // 更新logo（如果提供了）
    if (companyInfo.logo) {
        const logoElement = document.getElementById('company-logo');
        logoElement.src = companyInfo.logo;
        
        // 添加錯誤處理，如果圖標無法載入
        logoElement.onerror = function() {
            // 使用SVG作為備用
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNjAiIGN5PSI2MCIgcj0iNTAiIGZpbGw9IiMzNDk4REIiLz48cGF0aCBkPSJNNjAgMzBDNDguMDY1IDMwIDM4LjUgMzkuNTY1IDM4LjUgNTEuNUMzOC41IDYzLjQzNSA0OC4wNjUgNzMgNjAgNzNDNzEuOTM1IDczIDgxLjUgNjMuNDM1IDgxLjUgNTEuNUM4MS41IDM5LjU2NSA3MS45MzUgMzAgNjAgMzBaTTc1IDU0SDUyLjVWNjYuNUg3NVY1NFpNNTIgNTRINDIuNVY2Ni41SDUyVjU0WiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=';
        };
    }
}

// 更新標題頁資訊
function updateTitlePage() {
    const titlePage = presentationData.titlePage;
    
    document.getElementById('main-title').textContent = titlePage.mainTitle;
    document.getElementById('sub-title').textContent = titlePage.subTitle;
    document.getElementById('presentation-subtitle').textContent = titlePage.subtitleText;
    
    // 更新網頁標題
    document.title = titlePage.mainTitle;
}

// 根據數據創建幻燈片
function createSlidesFromData() {
    presentationData.slides.forEach((slideData, index) => {
        const slideNumber = index + 1;
        const slideElement = document.createElement('div');
        slideElement.className = 'slide';
        slideElement.id = `slide-${slideNumber}`;
        
        // 根據類型創建不同幻燈片
        if (slideData.type === 'text_image') {
            slideElement.innerHTML = createTextImageSlide(slideData);
        } else if (slideData.type === 'two_level_list') {
            slideElement.innerHTML = createTwoLevelListSlide(slideData);
        }
        
        slidesContainer.appendChild(slideElement);
    });
    
    totalPagesSpan.textContent = totalSlides;
}

// 創建文字+圖片幻燈片
function createTextImageSlide(slideData) {
    return `
        <div class="slide-content">
            <h3>${slideData.title || '標題'}</h3>
            <div class="text-image-container">
                <div class="text-image-text">
                    <p>${slideData.text || '內容文字'}</p>
                </div>
                <div class="text-image-image">
                    <img src="${slideData.image || 'assets/default-image.png'}" alt="${slideData.title || '簡報圖片'}" onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNFNUU1RTUiLz48cmVjdCB4PSI1MCIgeT0iNTAiIHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjJGMkYyIi8+PGNpcmNsZSBjeD0iMjAwIiBjeT0iMTUwIiByPSI0MCIgZmlsbD0iIzM0OThEQyIvPjxwYXRoIGQ9Ik0yMDAgMTMwTDIyMCAxNzBIMTgwTDIwMCAxMzBaIiBmaWxsPSJ3aGl0ZSIvPjx0ZXh0IHg9IjIwMCIgeT0iMjMwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkltYWdlIFBsYWNlaG9sZGVyPC90ZXh0Pjwvc3ZnPg=='">
                </div>
            </div>
        </div>
        <div class="slide-footer">
            <div class="page-indicator">第 <span class="current-page">${currentSlide + 1}</span> 頁，共 <span class="total-pages">${totalSlides}</span> 頁</div>
        </div>
    `;
}

// 創建兩層清單幻燈片
function createTwoLevelListSlide(slideData) {
    let itemsHTML = '';
    
    if (slideData.items && Array.isArray(slideData.items)) {
        slideData.items.forEach((item, index) => {
            let subitemsHTML = '';
            
            if (item.subitems && Array.isArray(item.subitems)) {
                item.subitems.forEach(subitem => {
                    subitemsHTML += `<li>${subitem}</li>`;
                });
            }
            
            itemsHTML += `
                <div class="main-item">
                    <div class="main-item-title">
                        <span class="main-item-number">${index + 1}</span>
                        ${item.title || '項目標題'}
                    </div>
                    <ul class="sub-items ${slideData.bulletStyle || ''}">
                        ${subitemsHTML}
                    </ul>
                </div>
            `;
        });
    }
    
    return `
        <div class="slide-content">
            <h3>${slideData.title || '標題'}</h3>
            <div class="two-level-list">
                ${itemsHTML}
            </div>
        </div>
        <div class="slide-footer">
            <div class="page-indicator">第 <span class="current-page">${currentSlide + 1}</span> 頁，共 <span class="total-pages">${totalSlides}</span> 頁</div>
        </div>
    `;
}

// 切換到指定幻燈片
function goToSlide(slideIndex) {
    // 確保索引在範圍內
    if (slideIndex < 0 || slideIndex >= totalSlides) return;
    
    // 隱藏當前幻燈片
    const currentSlideElement = document.querySelector('.slide.active');
    if (currentSlideElement) {
        currentSlideElement.classList.remove('active');
    }
    
    // 顯示新幻燈片
    const newSlideElement = document.getElementById(`slide-${slideIndex}`);
    if (newSlideElement) {
        newSlideElement.classList.add('active');
        
        // 更新當前幻燈片中的頁碼
        const pageIndicator = newSlideElement.querySelector('.current-page');
        if (pageIndicator) {
            pageIndicator.textContent = slideIndex + 1;
        }
    }
    
    currentSlide = slideIndex;
    updatePageIndicator();
    updateProgressBar();
}

// 下一頁
function nextSlide() {
    if (currentSlide < totalSlides - 1) {
        goToSlide(currentSlide + 1);
    }
}

// 上一頁
function prevSlide() {
    if (currentSlide > 0) {
        goToSlide(currentSlide - 1);
    }
}

// 更新頁面指示器
function updatePageIndicator() {
    currentPageSpan.textContent = currentSlide + 1;
}

// 更新進度條
function updateProgressBar() {
    const progress = ((currentSlide + 1) / totalSlides) * 100;
    progressBar.style.width = `${progress}%`;
}

// 全屏相關功能
function toggleFullscreen() {
    if (!isFullscreen) {
        enterFullscreen();
    } else {
        exitFullscreen();
    }
}

function enterFullscreen() {
    const elem = document.documentElement;
    
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
    }
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { /* Chrome, Safari & Opera */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE/Edge */
        document.msExitFullscreen();
    }
}

function updateFullscreenButton() {
    if (isFullscreen) {
        fullscreenBtnIcon.className = 'fas fa-compress';
        fullscreenBtnText.textContent = '退出全屏';
        fullscreenToggle.setAttribute('title', '退出全屏 (ESC)');
    } else {
        fullscreenBtnIcon.className = 'fas fa-expand';
        fullscreenBtnText.textContent = '全屏';
        fullscreenToggle.setAttribute('title', '切換全屏 (F)');
    }
}

function handleFullscreenChange() {
    isFullscreen = !!(document.fullscreenElement || 
                     document.mozFullScreenElement || 
                     document.webkitFullscreenElement || 
                     document.msFullscreenElement);
    
    if (isFullscreen) {
        body.classList.add('fullscreen');
        // 顯示退出提示3秒後淡出
        fullscreenExitHint.style.opacity = '1';
        setTimeout(() => {
            if (isFullscreen) {
                fullscreenExitHint.style.opacity = '0.5';
            }
        }, 3000);
    } else {
        body.classList.remove('fullscreen');
        fullscreenExitHint.style.opacity = '0';
    }
    
    updateFullscreenButton();
}
// 初始化事件監聽器
function initEventListeners() {
    // 左右按鈕點擊 - 增加 e.stopPropagation() 以防止點擊事件冒泡到 document 的區域點擊監聽器
    prevButton.addEventListener('click', (e) => {
        e.stopPropagation(); // 阻止事件向上傳播
        prevSlide();
    });
    nextButton.addEventListener('click', (e) => {
        e.stopPropagation(); // 阻止事件向上傳播
        nextSlide();
    });
    
    // 全屏按鈕點擊
    fullscreenToggle.addEventListener('click', toggleFullscreen);
    
    // 鍵盤事件監聽
    document.addEventListener('keydown', (e) => {
        // 防止默認行為（特別是F鍵和空格鍵）
        if (e.key === ' ' || e.key === 'F' || e.key === 'f') {
            e.preventDefault();
        }
        
        // 左右鍵盤按鍵
        if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
            prevSlide();
        } else if (e.key === 'ArrowRight' || e.key === 'PageDown') {
            nextSlide();
        } else if (e.key === ' ') {
            nextSlide(); // 空白鍵下一頁
        }
        
        // 全屏切換按鍵
        if (e.key === 'F' || e.key === 'f') {
            toggleFullscreen();
        }
        
        // 退出全屏按鍵
        if ((e.key === 'Escape' || e.key === 'Enter') && isFullscreen) {
            exitFullscreen();
        }
    });
    
    // 點擊左右側區域（除了按鈕本身）
    document.addEventListener('click', (e) => {
        // 如果在全屏模式下，點擊右上角提示區域不觸發頁面切換
        if (isFullscreen && e.target.closest('.fullscreen-exit-hint')) {
            return;
        }
        
        const windowWidth = window.innerWidth;
        const clickX = e.clientX;
        
        // 點擊左側10%區域
        if (clickX < windowWidth * 0.1) {
            prevSlide();
        }
        // 點擊右側10%區域
        else if (clickX > windowWidth * 0.9) {
            nextSlide();
        }
    });
    
    // 全屏變化事件監聽
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
}

// 初始化應用程式
function initApp() {
    initEventListeners();
    loadPresentationData();
    updateFullscreenButton();
}

// 當DOM載入完成後初始化
document.addEventListener('DOMContentLoaded', initApp);