const block_passion = document.getElementById('passions')
const passion_jpop = document.getElementById('jpop');
const passion_dnd = document.getElementById('lastfragment');
const retour_gauche = document.getElementById('retour-gauche');
const retour_droit = document.getElementById('retour-droit');
const transition = 400;


passion_jpop.addEventListener('click', ()=>{
    block_passion.style.marginLeft = "10%";

    animationBounce('0%');
});

passion_dnd.addEventListener('click', ()=>{
    block_passion.style.marginLeft = "-210%";

    animationBounce('-200%');
});

retour_gauche.addEventListener('click', ()=>{
    block_passion.style.marginLeft = "-110%";

    animationBounce('-100%')
});

retour_droit.addEventListener('click', ()=>{
    block_passion.style.marginLeft = "-90%";

    animationBounce('-100%')
});


function animationBounce(margin){
    setTimeout(()=>{
        block_passion.style.marginLeft = margin;
    },transition);
}