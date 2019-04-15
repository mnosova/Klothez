//autocomplete fix
const formReset = function () {
if( navigator.userAgent.match(/(iPod|iPhone|iPad)/)){
    window.setInterval(function(){
        $('input:-webkit-autofill').each(function(){
            let clone = $(this).clone(true, true);
            $(this).after(clone).remove();
        });
    }, 20);
}
};
export default formReset;