


const domHandHistory = {
    divHandHistory:             document.querySelector ('.control'),
    txtHistory:                 document.querySelector('.hand-history-txt'),

    addHistory (str){
        this.txtHistory.innerHTML += `${str}<br>`;
        this.txtHistory.scrollTop = this.txtHistory.scrollHeight;
    }
}