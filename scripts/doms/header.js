






const domHeader = {

    domNavbar: document.querySelector ('#nav-bar'),

    btnNav: document.querySelector ('#nav-btn'),

    navBarShow: false,

    setup (){
        this.btnNav.addEventListener('click', function() {
            if (!this.navBarShow) {
                this.domNavbar.style.display = 'block';
                this.domNavbar.style.width = '200px';

                this.navBarShow = true;

            } else {
                this.domNavbar.style.width = '0px';

                this.navBarShow = false;
            }
        }.bind (this));
    }
};