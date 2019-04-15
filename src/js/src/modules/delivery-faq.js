const deliveryFaq = function () {

    $('.delivery-faq__list').find('li').on('click', function () {

        if ($(this).hasClass('js-show')) {

            $(this).find('p').slideDown();
            $(this).removeClass('js-show');
        }
        else {
            $(this).find('p').slideUp();
            $(this).addClass('js-show');
        }


    });
};
export default deliveryFaq;