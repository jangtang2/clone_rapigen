$(window).on('load', function () {
    fullPage();
});

function fullPage() {
    let currentSection = 0;
    const $sections = $('.section'); // 모든 섹션 요소
    const $menu =  $('.menu > li'); // 메뉴 항목
    const $footer = $('footer'); // 페이지 하단 영역
    let menuHeight = $('header').height(); // 상단 메뉴 높이
    let isScrolling = false; // 스크롤 중 여부를 나타내는 플래그
    let isWindowSizeValid = false; // 윈도우 크기 유효 여부를 나타내는 플래그
    const numSections = $sections.length; // 섹션의 개수

    //메뉴 클릭 이벤트 핸들러
    function clickHandler(e, targetSectionIndex) {
        e.preventDefault();
        const offset = $sections.eq(targetSectionIndex).offset().top;
        currentSection = targetSectionIndex;
        // 해당 섹션으로 스크롤 이동
        $('html,body').animate({ scrollTop: offset - menuHeight }, 500);
    }

    // 섹션 스크롤 함수
    function scrollToSection(sectionIndex) {
        const targetPosition = sectionIndex === numSections ? $footer.offset().top : $sections.eq(sectionIndex).offset().top;
        //특정 섹션으로 스크롤 이동
        $('html, body').animate({
            scrollTop: targetPosition - menuHeight
        }, 500, function () {
            isScrolling = false;
        });
    }
    
    // 윈도우 크기 확인 함수
    function checkWindowSize() {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        isWindowSizeValid = windowWidth > 767 && windowHeight > 700;
        menuHeight = $('header').height();
    }

    // 초기 윈도우 크기 확인
    checkWindowSize();

    // 윈도우 크기 변경 시 윈도우 크기 확인
    $(window).on('resize', checkWindowSize);

    // 스크롤 이벤트 핸들러
    function handleScroll(e) {
        if (!isWindowSizeValid || isScrolling) return;
        isScrolling = true;

        // 스크롤 방향에 따라 섹션 인덱스 변경
        if (e.originalEvent.deltaY < 0 && currentSection > 0) {
            currentSection--;
        } else if (e.originalEvent.deltaY > 0 && currentSection < numSections - 1) {
            currentSection++;
        } else if (e.originalEvent.deltaY > 0 && $footer.offset().top - $(window).scrollTop() <= window.innerHeight) {
            currentSection = numSections;
        }
        scrollToSection(currentSection);
    }

    // 메뉴 클릭 이벤트 핸들러
    $menu.children('a').on('click', function (e) {
        const targetSectionIndex = $sections.index($($(this).attr('href')));
        clickHandler(e, targetSectionIndex);
    });

    // 마우스 휠 이벤트 핸들러
    $(window).on('wheel', handleScroll);

    // 터치 이벤트 핸들러
    let touchStartY = 0;
    $(window).on('touchstart', function (e) {
        if (!isWindowSizeValid || isScrolling) return;
        touchStartY = e.originalEvent.touches[0].clientY;
    });

    $(window).on('touchmove', function (e) {
        if (!isWindowSizeValid || isScrolling) return;
        const currentY = e.originalEvent.touches[0].clientY;
        const deltaY = currentY - touchStartY;

        // 터치 방향에 따라 섹션 인덱스 변경
        if (deltaY < 0 && currentSection < numSections) {
            currentSection++;
        } else if (deltaY > 0 && $footer.offset().top - $(window).scrollTop() <= window.innerHeight) {
            currentSection--;
        } else if (deltaY > 0 && currentSection > 0) {
            currentSection--;
        }
        scrollToSection(currentSection);
        isScrolling = true;
    });

    $(window).on('touchend', function () {
        if (!isWindowSizeValid) return;
        isScrolling = false;
    });

    // 스크롤 이벤트 핸들러를 통해 활성 메뉴 업데이트
    $(window).scroll(function(){
        let scltop = $(window).scrollTop() + menuHeight;
        $.each($sections, function(idx, item){
            let targetTop = $(this).offset().top;
            if (targetTop <= scltop) {
                $menu.removeClass('active');
                $menu.eq(idx).addClass('active');
            }
        })
        if (Math.round( $(window).scrollTop()) == $(document).height() - $(window).height()) {
            $menu.last().addClass('active').siblings().removeClass('active');
        }
    }).scroll();
}
