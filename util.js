// utilities
HTMLElement.prototype.inputIsEmpty = function(){
    return this.value.trim().length === 0;
}
HTMLElement.prototype.hide = function(){
    this.style.display = 'none';
}
HTMLElement.prototype.show = function(){
    this.style.display = 'block'
}

HTMLButtonElement.prototype.enable = function(){
    this.disabled = false;
}

HTMLButtonElement.prototype.disable = function(){
    this.disabled = true;
}
HTMLElement.prototype.setAutoWidth = function(){
    this.style.width = 'auto';
}
