



const domTutorial = {
    divTutorial:                document.querySelector ('.tutorial'),
    img:                        document.querySelector ('.tutorial-image'),

    btnNext:                    document.querySelector ('.btn-tutorial-next'),

    images: [],

    curPage: 0,
    isEnabled: false,

    setup () {
        if (this.isEnabled) {
            let imgsCount = 0;
            while (imgsCount < 6) {
                this.images.push (`media/imgs/tut-0${imgsCount + 1}.png`);
                imgsCount++;
            }
            this.img.src = this.images [0];

            this.btnNext.addEventListener ('click', this.callbackNext.bind (this));
        } else {
            this.divTutorial.style.display = 'none';
        }
    },

    callbackNext (){
        this.curPage++;

        if (this.curPage < this.images.length) {
            this.img.src = this.images [this.curPage];
        } else {
            this.divTutorial.style.display = 'none';
        }
    }
};