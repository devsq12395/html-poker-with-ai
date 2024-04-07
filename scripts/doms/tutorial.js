



const domTutorial = {
    divTutorial:                document.querySelector ('.tutorial'),
    img:                        document.querySelector ('.tutorial-image'),

    btnNext:                    document.querySelector ('.btn-tutorial-next'),

    images: [],
    imagesPort: [], imagesLandscape: [],

    curPage: 0,
    isEnabled: true,

    setup () {
        if (this.isEnabled) {
            let imgsCount = 0;
            while (imgsCount < 6) {
                this.imagesLandscape.push (`media/imgs/tut-0${imgsCount + 1}.png`);
                this.imagesPort.push (`media/imgs/tut-portrait-0${imgsCount + 1}.png`);
                imgsCount++;
            }
            this.img.src = this.images [0];

            this.btnNext.addEventListener ('click', this.callbackNext.bind (this));
        } else {
            this.divTutorial.style.display = 'none';
        }

        window.addEventListener('resize', this.mediaQueryEvent.bind (this));
    },

    mediaQueryEvent (){
        if (window.innerWidth <= 876) {
            this.images = this.imagesPort;
        } else {
            this.images = this.imagesLandscape;
        }
        this.updateImage ();
    },

    updateImage (){
        this.img.src = this.images [this.curPage];
    },

    callbackNext (){
        this.curPage++;

        if (this.curPage < this.images.length) {
            this.updateImage ();
        } else {
            this.divTutorial.style.display = 'none';
        }
    }
};