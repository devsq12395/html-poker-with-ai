






const domHeader = {

    domNavbar: document.querySelector ('#nav-bar'),

    btnNav: document.querySelector ('#nav-btn'),
    btnTutorial: document.querySelector ('#nav-bar-tutorial'),
    btnCombination: document.querySelector ('#nav-bar-combination'),


    navBarShow: false,

    setup (){
        this.btnNav.addEventListener('click', this.callbackNavBtn.bind (this));
        this.btnTutorial.addEventListener('click', this.callbackTutorialBtn.bind (this));
        this.btnCombination.addEventListener('click', this.callbackCombinationBtn.bind (this));
    },

    callbackNavBtn (){
        this.navbarShow (!this.navBarShow);
    },

    navbarShow (show) {
        if (show) {
            this.domNavbar.style.display = 'block';
            this.domNavbar.style.width = '200px';

        } else {
            this.domNavbar.style.width = '0px';
        }
        this.navBarShow = show;
    }, 

    callbackTutorialBtn (){
        domTutorial.show ();
        this.navbarShow (false);
    },

    callbackCombinationBtn (){
        domTutorial.show (5);
        this.navbarShow (false);
    }
};