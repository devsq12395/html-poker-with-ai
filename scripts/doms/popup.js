




const domPopup = {
    divPopup: document.querySelector ('.popup'),
    txtTitle: document.querySelector ('.popup-title'),
    txtMsg: document.querySelector ('.popup-msg'),
    btnOk: document.querySelector ('.popup-btn-ok'),

    setup () {
        this.btnOk.addEventListener ('click', function (){
            this.hidePopup ();
        }.bind (this));
    },

    showPopup (title, msg) {
        this.divPopup.style.display = 'flex';
        this.txtTitle.innerHTML = title;
        this.txtMsg.innerHTML = msg;
    },

    hidePopup (){
        this.divPopup.style.display = 'none';
    }
};