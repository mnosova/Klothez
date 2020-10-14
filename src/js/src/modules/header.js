const headerMenu = function () {
    let $bigItem = $('.header-secondmenu__navigation');
    let $smallItem = $('.header-menu__navigation-category');
    $smallItem.on('mouseenter', function () {
        $bigItem.hide();
        $smallItem.removeClass('js-show');
        $bigItem.eq($(this).index()).show();
        $smallItem.eq($(this).index()).addClass('js-show');
    });

    $bigItem.on('mouseleave',  () => $bigItem.hide());
};
export default headerMenu;