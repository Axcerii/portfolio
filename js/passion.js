const block_passion = document.getElementById('passions')
const passion_jpop = document.getElementById('jpop');
const passion_dnd = document.getElementById('lastfragment');
const retour_gauche = document.getElementById('retour-gauche');
const retour_droit = document.getElementById('retour-droit');


passion_jpop.addEventListener('click', ()=>{
    block_passion.style.marginLeft = "0%";
});

passion_dnd.addEventListener('click', ()=>{
    block_passion.style.marginLeft = "-200%";
});

retour_gauche.addEventListener('click', ()=>{
    block_passion.style.marginLeft = "-100%";
});

retour_droit.addEventListener('click', ()=>{
    block_passion.style.marginLeft = "-100%";
});